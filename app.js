import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import postRoutes from "./routes/post.js";
import minifyHTML from "express-minify-html";
import minify from "express-minify";
import compression from "compression";
import cors from "cors";
import { engine } from "express-handlebars";
import Handlebars from "handlebars";
import { generateSitemap, getAllSitemaps, domainRoutes } from './utils/sitemapGenerator.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(minify());
app.use(
  minifyHTML({
    override: true,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      minifyCSS: true,
      minifyJS: true,
    },
  })
);
app.use("/", express.static(path.join(__dirname, "public/")));
app.use('/static', express.static(path.join(__dirname, 'node_modules')));

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});
Handlebars.registerHelper('encodeURIComponent', function (str) {
  return encodeURIComponent(str);
});
Handlebars.registerHelper('conditionalEnv', function (trueResult, falseResult) {
  console.log(`Checking conditionalEnv: ${process.env.localenv}`);
  return process.env.localenv ? trueResult : falseResult;
});
// Configure Handlebars
app.engine("handlebars", engine({
  defaultLayout: false,
  partialsDir: [
    path.join(__dirname, "views/templates"),
    path.join(__dirname, "views/notice"),
    path.join(__dirname, "views")
  ], cache: false // Disable cache for development

}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


const domainRedirect = (req, res, next) => {
  let hostname = req.headers['x-forwarded-host'] || req.headers.host;
  hostname = hostname.replace(/:\d+$/, ''); // Remove port if present

  console.log(`Incoming request to hostname: http://${hostname}`);

  if (process.env.localenv === "true") {
    req.site = process.env.site;
  } else {
    req.site = {
      "mbktechstudio.com": "main",
      "www.mbktechstudio.com": "main",
      "docs.mbktechstudio.com": "docs",
      "project.mbktechstudio.com": "docs",
      "portfolio.mbktechstudio.com": "portfolio",
      "ibnekhalid.me": "portfolio",
      "api.mbktechstudio.com": "api",
      "download.mbktechstudio.com": "download",
    }[hostname] || "main";
  }

  console.log(`Request site set to: ${req.site}`);
  next();
};

// Routes
app.get("/", domainRedirect, (req, res) => {
  const siteViews = {
    main: "mainPages/mainDomain/index",
    docs: {
      view: "mainPages/otherDomain/docs",
    },
    portfolio: "mainPages/otherDomain/portfolio",
    api: "mainPages/apiDomain/index",
    download: {
      view: "mainPages/otherDomain/download",
      layout: "main",
      mainAppLink: process.env.PortalVersonControlJson
        ? JSON.parse(process.env.PortalVersonControlJson)
        : null,
    },
  };

  let viewEntry = siteViews[req.site] || siteViews.main;
  console.log(`Rendering view: ${JSON.stringify(viewEntry)}`);

  if (typeof viewEntry === "object") {
    const { view, ...locals } = viewEntry;
    res.render(view, locals);
  } else {
    res.render(viewEntry);
  }
});

app.get("/Documentation", domainRedirect, (req, res) => {
  if (req.site === "api") {
    return res.render("mainPages/apiDomain/Documentation");
  }
  res.render("mainPages/404");
});

const renderStaticRoutes = [
  { paths: ["/FAQS", "/FAQs", "/faqs", "/FrequentlyAskedQuestions"], view: "mainPages/mainDomain/FAQs" },
  { paths: ["/Terms&Conditions", "/PrivacyPolicy", "/privacypolicy", "/terms&conditions"], view: "mainPages/mainDomain/Terms&Conditions" },
  { paths: ["/Support&Contact", "/Support", "/Contact", "/Contact&Support"], view: "mainPages/mainDomain/Support&Contact" },
  { paths: ["/TrackTicket"], view: "mainPages/mainDomain/TrackTicket" },
];

renderStaticRoutes.forEach(({ paths, view }) => {
  app.get(paths, (req, res) => res.render(view));
});

// FAQs specific route
app.get(
  [
    "/FAQS/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/FAQs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/faqs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/FrequentlyAskedQuestions/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
  ],
  (req, res) => res.render("mainPages/mainDomain/otherPages/faqs1")
);

// Redirect routes
app.get(["/new"], (req, res) => {
  res.render("mainPages/mainDomain/new");
});

app.get(["/TrackTicket", "/Ticket", "/Track", "/trackticket"], (req, res) => {
  res.redirect("/TrackTicket");
});

// API and Post routes
app.use("/post", postRoutes);
app.use("/api", apiRoutes);

app.get(["/api*", "/post*"], (req, res) => {
  res.render("mainPages/apiDomain/notfound");
});

app.get('/sitemap.xml', domainRedirect, async (req, res) => {
  try {
    const domain = req.hostname;
    // Generate fresh sitemap for this domain, passing the site type for localhost
    const sitemap = await generateSitemap(domain, domain.includes('localhost') ? req.site : null);

    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// New endpoint to view all sitemaps
app.get('/sitemaps', domainRedirect, async (req, res) => {
  try {
    const domain = req.hostname;
    const sitemaps = await getAllSitemaps(domain);
    res.json(sitemaps);
  } catch (error) {
    console.error('Error getting sitemaps:', error);
    res.status(500).send('Error getting sitemaps');
  }
});

// Individual sitemap view endpoint
app.get('/sitemap/:type', domainRedirect, async (req, res) => {
  try {
    const domain = req.hostname;
    const siteType = req.params.type;
    const sitemap = await generateSitemap(domain, siteType);

    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});


app.get('/robots.txt', domainRedirect, (req, res) => {
  const hostname = req.headers['x-forwarded-host'] || req.headers.host;
  const domain = hostname.replace(/:\d+$/, '');

  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml`;

  res.type('text/plain');
  res.send(robotsContent);
});

// 404 handler
app.use((req, res) => {
  console.log(`Path not found: ${req.url}`);
  res.render("mainPages/404");
});

// app.js
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export default app;
