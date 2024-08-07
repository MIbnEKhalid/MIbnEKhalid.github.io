# MBK Tech Studio Website

https://mbktechstudio.com/ or https://MIbnEKhalid.github.io/

# **Deployed Branches**

## **[Main Branch](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/main)**
- **Domain**: `mbktechstudio.com` / `mibnekhalid.github.io`
- **Deployment**: Hosted using GitHub Pages. The main branch of the repository is used to deploy the primary site.

## **[Privacy Branch](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/Privacy)**
- **Domain**: `privacy.mbktechstudio.com` / `privacy-mbktechstudio.netlify.app`
- **Deployment**: Hosted using Netlify. The Privacy branch is linked to Netlify and is used for the privacy-related subdomain of the site.

## **[Docs Branch](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/Docs)**
- **Domain**: `docs.mbktechstudio.com` / `docs-mbktechstudio.netlify.app`
- **Deployment**: Hosted using Netlify. The Privacy branch is linked to Netlify and is used for the privacy-related subdomain of the site.

## **[Maintenance Branch](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/Maintenance)**
- **Domain**: `mbktechstudio.com` / `mibnekhalid.github.io`
- **Deployment**: This branch is used for deploying a maintenance page on `mbktechstudio.com` when the main site is under maintenance. The Maintenance branch serves as a temporary replacement for the main site during maintenance periods.

**Note:** `mibnekhalid.github.io`, `privacy-mbktechstudio.netlify.app`, and `docs-mbktechstudio.netlify.app` are original domains. The `mbktechstudio.com` domain is a custom domains with CNAME records redirecting to the original domains.








Website Source Code 
https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/ or https://github.com/MIbnEKhalid/mbktech.studios/

https://mbktechstudio.com/ or https://mbktechstudio.com/mbktech.studios/

## Hosting:
- The Website Is Hosted On GitHub, With A Custom Domain Purchased From [NameCheap](https://namecheap.com).
  *Note: If you are using a custom domain, ensure it is properly configured to point to your GitHub repository.* [How To Add A Custom Domain On Github Pages](#how-to-add-a-custom-domain-on-github-pages)
- Buying a domain is not necessary; you can use a GitHub domain for free, such as `user.github.io`.

## Directory Tree:

```
root
├───Assets/
│ ├───Images/
│ │ ├───about9.jpg
│ │ ├───background.png
│ │ ├───cat.png
│ │ ├───close-icon.svg
│ │ ├───cookie-icon.svg
│ │ ├───dg.svg
│ │ ├───dgicon.svg
│ │ ├───logo.png
│ ├───cookie.css
│ ├───cookie.html
│ ├───script.js
│ ├───style.css
├───Project/
│ ├───Img/
│ │ ├───download.svg
│ │ ├───CTMCpp.png
│ │ ├───cpp.png
│ ├───index.html
│ ├───style.css
├───UserAgreement/
│ ├───index.html
├───404.html
├───CNAME
├───index.html
├───README.md
```

*Note: To ensure clean and user-friendly URLs, HTML files are organized within directories named after their respective content, with each directory containing an `index.html` file. This approach facilitates clean URLs, enhancing readability and SEO performance.*

#### Example:

Instead of using `UserAgreement.html`:
- Bad URL: [https://mbktech.xyz/UserAgreement.html](https://mbktech.xyz/UserAgreement.html)

Use `UserAgreement/index.html`:
  - Good URL: [https://mbktech.xyz/UserAgreement/](https://mbktech.xyz/UserAgreement/)

### How To Add A Custom Domain On Github Pages

## 1. Buy a Domain
- Purchase a domain from a domain registrar (e.g., Namecheap). Only the domain purchase is necessary; additional tools are not required.
- **Optional:** If you need a business email and have a low budget, you can use Zoho's free services to configure a business email for your custom domain.

## 2. Configure DNS Settings
- After purchasing your domain, go to the DNS settings or Advanced DNS settings of your domain registrar.

- Add the following CNAME Record:

    - **Type:** CNAME
    - **Host:** www
    - **Value:** `username.github.io.` (Replace `username` with your actual GitHub username)

- Add the following A Records:

    **Record 1:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.108.153

    **Record 2:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.109.153

    **Record 3:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.110.153

    **Record 4:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.111.153


## 3. GitHub Repository Settings
- Navigate to your `username.github.io` repository on GitHub.
- Go to the repository's **Settings**.
- Under **Code and Automation**, click on **Pages**.
- In the **Custom domain** field, enter your domain name (e.g., `example.com`) and click the **Save** button.
- Wait a few minutes for the domain to verify. Once verified, you will see the link change from `https://username.github.io/` to `http://example.com`.
- You will also see a `CNAME` file in your repository.

## 4. Enforce HTTPS
- In the same **Pages** section under **Custom domain**, check the **Enforce HTTPS** checkbox to ensure your site uses HTTPS.

## 5. Additional Notes
- If you create a repository named `<username>.github.io`, it will serve as the root of `https://<username>.github.io`. All other repository pages will be nested under this link. For example, a repository named `project1` would be accessible at `https://<username>.github.io/project1`.
- If you add a custom domain to `<username>.github.io`, all other repository pages will also be accessible under the new custom domain. For example, if your custom domain is `www.example.com`, the `project1` repository would be accessible at `https://www.example.com/project1`.
