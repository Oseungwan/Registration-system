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
Sometimes GitHub Pages keeps running while you tweak text or images in the web editor. If you see a merge conflict warning for `vite.config.js`, click **Resolve conflicts** and replace everything in that file with the snippet below, then press **Mark as resolved**. This keeps the production build loading correctly on GitHub Pages.

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const isProdBuild = command === 'build';

  return {
    base: isProdBuild ? './' : '/',
    plugins: [react()],
  };
});
```

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
