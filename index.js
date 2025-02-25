import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import postRoutes from "./routes/post.js";
import minifyHTML from "express-minify-html";
import minify from "express-minify";
import compression from "compression";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(minify());
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

function DomainRedirect(req, res, next) {
    const hostname = req.headers.host;
    console.log(`Incoming request to hostname: ${hostname}`);

    if (hostname === "mbktechstudio.com" || process.env.site === "main") {
        req.site = "main";
    } else if (hostname === "docs.mbktechstudio.com" || process.env.site === "docs") {
        req.site = "docs";
    } else {
        req.site = "main";
    }
    console.log(`Request site set to: ${req.site}`);
    next();
}

app.use("/", express.static(path.join(__dirname, "public/")));

app.get("/", DomainRedirect, (req, res) => {
    console.log(`Handling request for site: ${req.site}`);
    if (req.site === "docs") {
        console.log("Rendering docs index page");
        return res.render("mainPages/docDomain/index.ejs");
    } else {
        console.log("Rendering main index page");
        return res.render("mainPages/mainDomain/index.ejs"); // Assuming you want to render the main index page for other sites
    }
});

app.get(
    ["/FAQS", "/FAQs", "/faqs", "/FrequentlyAskedQuestions"],
    (req, res) => {
        return res.render("mainPages/mainDomain/FAQs.ejs");
    }
);
app.get(
    [
        "/FAQS/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
        "/FAQs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
        "/faqs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
        "/FrequentlyAskedQuestions/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    ],
    (req, res) => {
        return res.render("mainPages/mainDomain/otherPages/faqs1.ejs");
    }
);

app.get(
    [
        "/Terms&Conditions",
        "/PrivacyPolicy",
        "/privacypolicy",
        "/terms&conditions",
    ],
    (req, res) => {
        return res.render("mainPages/mainDomain/Terms&Conditions.ejs");
    }
);

app.use("/post", postRoutes);

app.use("/api", apiRoutes);

app.get(
    ["/Support&Contact", "/Support", "/Contact", "/Contact&Support"],
    (req, res) => {
        return res.render("mainPages/mainDomain/Support&Contact.ejs");
    }
);

app.use((req, res) => {
    console.log(`Path not found: ${req.url}`);
    return res.render("mainPages/mainDomain/404.ejs");
});

const port = 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});