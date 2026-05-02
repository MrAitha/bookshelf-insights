# TODO: Launching to GitHub Pages

To finalize the deployment of **BookShelf Insights**, complete these final steps on GitHub:

- [ ] **1. Add Gemini API Key to GitHub Secrets**
  - Go to your repository on GitHub.
  - Click **Settings** > **Secrets and variables** > **Actions**.
  - Click **New repository secret**.
  - **Name**: `VITE_GEMINI_API_KEY`
  - **Value**: (Paste your Gemini API key from your `.env` file).

- [ ] **2. Enable GitHub Actions for Pages**
  - Go to **Settings** > **Pages**.
  - Under **Build and deployment** > **Source**, change the dropdown from "Deploy from a branch" to **GitHub Actions**.

- [ ] **3. Trigger the Build**
  - Go to the **Actions** tab.
  - You should see the "Deploy to GitHub Pages" workflow.
  - If it hasn't started, it will trigger on your next push, or you can run it manually.

- [ ] **4. Verify the Live Site**
  - Once the workflow turns green, your site will be live at:
    `https://MrAitha.github.io/bookshelf-insights/`

- [ ] **5. Install as an App**
  - Open the live URL in Chrome.
  - Click the "Install" icon in the address bar to save it as an "Instant App" on your desktop.
