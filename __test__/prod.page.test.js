const { JSDOM } = require("jsdom");

function testMetaKeywords(domain, path, expectedKeywords) {
    describe(`Production ${domain}${path} page landing`, () => {
        if (false) {
            it("should have specific meta data", async () => {
                const response = await fetch(`https://${domain}${path}`);
                const text = await response.text();
                const dom = new JSDOM(text);
                const doc = dom.window.document;
                const meta = doc.querySelector('meta[name="keywords"]');
                expect(meta).not.toBeNull();
                expect(meta.getAttribute("content")).toBe(expectedKeywords);
            });
        }
    });
}

// Test cases for specific domains and paths
testMetaKeywords(
    "mbktechstudio.com",
    "/",
    "MBK Tech Studio, Open-Source, Software Development, Technology Solutions"
);

testMetaKeywords(
    "mbktechstudio.com",
    "/404PageTest",
    "404, Page Not Found, MBK Tech Studio, Error Page"
);

testMetaKeywords(
    "mbktechstudio.com",
    "/TrackTicket",
    "support ticket system, track ticket, resolve queries, MBK Tech Studio, customer support, ticket status, help desk, issue tracking"
);

testMetaKeywords(
    "mbktechstudio.com",
    "/Terms&Conditions",
    "MBK Tech Studio, Web-Portal, Terms & Conditions, Privacy Policy, User Agreement"
);

testMetaKeywords(
    "mbktechstudio.com",
    "/Support",
    "Support, Contact, MBK Tech Studio, Feedback, Collaboration, General Inquiry, Technical Support, Bug Reporting, Feature Requests"
);

testMetaKeywords(
    "mbktechstudio.com",
    "/FAQs",
    "FAQs, Frequently Asked Questions, MBK Tech Studio, Help Center"
);

testMetaKeywords(
    "privacy.mbktechstudio.com",
    "/",
    "MBK Tech Studio, Web-Portal, Terms & Conditions, Privacy Policy, User Agreement"
);

testMetaKeywords(
    "portfolio.mbktechstudio.com",
    "/",
    "portfolio, Muhammad Bin Khalid, ibnekhalid"
);

testMetaKeywords(
    "protfolio.mbktechstudio.com",
    "/",
    "portfolio, Muhammad Bin Khalid, ibnekhalid"
);

testMetaKeywords(
    "ibnekhalid.me",
    "/",
    "portfolio, Muhammad Bin Khalid, ibnekhalid"
);

testMetaKeywords(
    "api.mbktechstudio.com",
    "/",
    "API, MBK Tech Studio, endpoints, data processing, real-time analytics, cross-platform support, guides, examples"
);