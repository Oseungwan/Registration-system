# Registration-system
# KLN Seaport New Year Party RSVP App

This project delivers the bilingual (English / Thai) RSVP site for the **KLN Seaport New Year Party 2026**. It is built with React, Tailwind CSS, Vite, and Framer Motion, and includes a confirmation overlay and Zapier webhook hook for logging submissions.

## 🤝 I just want it live (no coding needed)
Follow these steps to publish the site with GitHub Pages. Everything runs in the cloud; you only need a GitHub account.

1. **Upload the project to GitHub**
   - Click the green `Code` button in this repository and choose **Download ZIP**.
   - Create a new GitHub repository in your account and upload the ZIP contents (or drag and drop the files in the web UI).

2. **Enable the Pages deployment workflow**
   - Inside your repository, open the `.github/workflows/deploy.yml` file. GitHub will recognise it automatically.
   - Go to **Settings → Pages** and set **Source** to "GitHub Actions" (if it is not already selected).

3. **Publish**
   - Push or upload any change to the `main` branch. GitHub Actions will build the site and deploy it to Pages. This typically takes 1–2 minutes.
   - When the workflow finishes, GitHub shows the live URL at the top of the **Actions** run and under **Settings → Pages** (for example, `https://<your-username>.github.io/<repo-name>/`).

> **Need to update wording or images?** Edit the files directly in the GitHub web editor and commit — the workflow redeploys automatically.

### 🚧 If GitHub says "Resolve conflicts"
Sometimes GitHub Pages keeps running while you tweak text or images in the web editor. If you open a pull request and see the red **Resolve conflicts** button, remove every line that starts with `<<<<<<<`, `=======`, or `>>>>>>>` and paste in the final version of each file listed below. When you are done, press **Mark as resolved** and then **Commit merge**.

**Files you might need to fix**

1. `.github/workflows/deploy.yml`
   - Use the editor’s **Copy from branch** dropdown to select the `work` branch (or copy the snippet below) so the workflow always installs the dev dependencies before building.

   ```yaml
   name: Deploy RSVP site to GitHub Pages

   on:
     push:
       branches: ["main"]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       env:
         NODE_ENV: development
       steps:
         - name: Checkout repository
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: "npm"

         - name: Install dependencies
           run: npm install

         - name: Build project
           run: npm run build

         - name: Upload production-ready files
           uses: actions/upload-pages-artifact@v3
           with:
             path: dist

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. `vite.config.js`
   - Paste the snippet directly into the conflict editor:

   ```js
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig(({ command }) => {
     const isProdBuild = command === 'build';

     return {
       // GitHub Pages serves the app from a project subdirectory, so the
       // production bundle needs relative asset URLs. Local development can
       // continue using the default root base path.
       base: isProdBuild ? './' : '/',
       plugins: [react()],
     };
   });
   ```

3. `README.md`
   - If the README itself shows conflict markers, open this repository’s `README.md`, copy all of it, and paste over the conflicted version in GitHub. Conflicts usually happen after editing text directly in the web UI; replacing the file with the latest copy removes the markers immediately.

## ✉️ Hooking up Zapier (optional)
The RSVP form can POST each submission to a Zapier webhook. Replace the placeholder value in [`src/App.jsx`](src/App.jsx) on line that defines `ZAPIER_WEBHOOK_URL` with your real Zapier URL.

```js
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/YOUR-ZAPIER-ID';
```

Zapier will store every RSVP with the generated RSVP ID, dietary preference, and timestamps. If you leave the placeholder untouched, the app will skip the POST call so you can demo safely.

## 💻 Preview on your computer (optional)
If you would like to run the site locally:

1. [Install Node.js](https://nodejs.org/) version 18 or later. During installation, npm is included automatically.
2. Open a terminal (Command Prompt or PowerShell on Windows, Terminal on macOS).
3. Navigate to the project folder and run these commands:

   ```bash
   npm install
   npm run dev
   ```

4. Open the printed URL (usually `http://localhost:5173`) in your browser to see the RSVP page with hot reload.
5. When you are ready for a production build, run `npm run build` followed by `npm run preview` to check the optimised output.

## 📁 Project structure
- `src/App.jsx` – main page layout, bilingual copy, animations, and form logic
- `src/index.css` – Tailwind base styles plus custom glassmorphism effects
- `src/main.jsx` – React entry point
- `tailwind.config.js` – Tailwind theme customisation
- `.github/workflows/deploy.yml` – GitHub Pages automation workflow

Feel free to reach out to your Zapier or web team if you need help customising copy or assets — no additional code tooling is required beyond the steps above.