# MacroSight.net v2 Architecture

## Overview

This static site implements a hybrid architecture that supports both standalone HTML pages and Wix-Velo iframe integration through postMessage communication.

## File Structure

### Static HTML Pages
- `home.html` - Pure static home page
- `about.html` - Pure static about page  
- `contact.html` - Pure static contact page
- `experience.html` - Pure static experience page
- `projects.html` - Pure static projects page
- `404.html` - Pure static 404 error page

### Wix Integration Pages
- `embed.html` - Dedicated postMessage listener for iframe embedding
- `resume.html` - Wix-embedded resume page with postMessage handling
- `invest.html` - Wix-embedded investment page with postMessage handling

### Assets
- `styles.css` - Global stylesheet with loader styles
- `robots.txt` - SEO crawler instructions
- `sitemap.xml` - Site structure for search engines

## CORS & Security Configuration

### HTML Files (`/*.html`)
- `Access-Control-Allow-Origin: *` - Allows cross-origin fetching for Wix integration

### All Other Files (`/*`)
- `Access-Control-Allow-Origin: https://www.macrosight.net` - Restrictive CORS
- Security headers: HSTS, X-Frame-Options, CSP, etc.

## postMessage Architecture

### Allowed Origins
- `https://www.macrosight.net`
- `https://macrosight.netlify.app`

### Safety Features
- Rejects HTML containing `<head>` tags
- Only injects into `document.body`
- Hides loader on successful injection
- Shows error message on failed injection

## Wix-Velo Integration

1. **Setup iframe**: Point to `embed.html` or use specific embed pages
2. **Fetch content**: Use `wix-fetch` to get HTML from Netlify
3. **Post message**: Send HTML content to iframe via postMessage
4. **Display**: Content replaces loader in iframe

Example:
```javascript
// In Wix Velo page code
const response = await fetch('https://www.macrosight.net/home.html');
const html = await response.text();
iframe.postMessage(html, 'https://www.macrosight.net');
```

## Testing Commands

```bash
# Test CORS headers for HTML files
curl -I https://www.macrosight.net/embed.html

# Test static page rendering  
curl https://www.macrosight.net/home.html

# Test redirects
curl -I https://www.macrosight.net/
```

## Security Notes

- Only `embed.html`, `resume.html`, and `invest.html` listen for postMessages
- All other pages are pure static HTML
- CORS is open for HTML files to enable Wix fetching
- Security headers protect against common attacks

---

# Usage with Wix Velo

## SEO & Launch Files

This site includes:
- `/robots.txt` (allows all, points to sitemap)
- `/sitemap.xml` (lists all public pages)

Both are in `/public` and will be live at the root of your deployed site for search engines and best practice.

All page scripts should import global styles like this for Wix/Velo compatibility:

```js
import { injectGlobalStyles } from "public/globalStyles";
```

Call `injectGlobalStyles()` at the top of your `$w.onReady()` function in each page script.

# Git Integration & Wix CLI <img align="left" src="https://user-images.githubusercontent.com/89579857/185785022-cab37bf5-26be-4f11-85f0-1fac63c07d3b.png">

This repo is part of Git Integration & Wix CLI, a set of tools that allows you to write, test, and publish code for your Wix site locally on your computer. 

Connect your site to GitHub, develop in your favorite IDE, test your code in real time, and publish your site from the command line.

## Set up this repository in your IDE
This repo is connected to a Wix site. That site tracks this repo's default branch. Any code committed and pushed to that branch from your local IDE appears on the site.

Before getting started, make sure you have the following things installed:
* [Git](https://git-scm.com/download)
* [Node](https://nodejs.org/en/download/), version 14.8 or later.
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [yarn](https://yarnpkg.com/getting-started/install)
* An SSH key [added to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

To set up your local environment and start coding locally, do the following:

1. Open your terminal and navigate to where you want to store the repo.
1. Clone the repo by running `git clone <your-repository-url>`.
1. Navigate to the repo's directory by running `cd <directory-name>`.
1. Install the repo's dependencies by running `npm install` or `yarn install`.
1. Install the Wix CLI by running `npm install -g @wix/cli` or `yarn global add @wix/cli`.  
   Once you've installed the CLI globally, you can use it with any Wix site's repo.

For more information, see [Setting up Git Integration & Wix CLI](https://support.wix.com/en/article/velo-setting-up-git-integration-wix-cli-beta).

## Write Velo code in your IDE
Once your repo is set up, you can write code in it as you would in any other non-Wix project. The repo's file structure matches the [public](https://support.wix.com/en/article/velo-working-with-the-velo-sidebar#public), [backend](https://support.wix.com/en/article/velo-working-with-the-velo-sidebar#backend), and [page code](https://support.wix.com/en/article/velo-working-with-the-velo-sidebar#page-code) sections in Editor X.

Learn more about [this repo's file structure](https://support.wix.com/en/article/velo-understanding-your-sites-github-repository-beta).

## Test your code with the Local Editor
The Local Editor allows you test changes made to your site in real time. The code in your local IDE is synced with the Local Editor, so you can test your changes before committing them to your repo. You can also change the site design in the Local Editor and sync it with your IDE.

Start the Local Editor by navigating to this repo's directory in your terminal and running `wix dev`.

For more information, see [Working with the Local Editor](https://support.wix.com/en/article/velo-working-with-the-local-editor-beta).

## Preview and publish with the Wix CLI
The Wix CLI is a tool that allows you to work with your site locally from your computer's terminal. You can use it to build a preview version of your site and publish it. You can also use the CLI to install [approved npm packages](https://support.wix.com/en/article/velo-working-with-npm-packages) to your site.

Learn more about [working with the Wix CLI](https://support.wix.com/en/article/velo-working-with-the-wix-cli-beta).

## Invite contributors to work with you
Git Integration & Wix CLI extends Editor X's [concurrent editing](https://support.wix.com/en/article/editor-x-about-concurrent-editing) capabilities. Invite other developers as collaborators on your [site](https://support.wix.com/en/article/inviting-people-to-contribute-to-your-site) and your [GitHub repo](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository). Multiple developers can work on a site's code at once.
