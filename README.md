<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HR Helper

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1F6BtWv0UrGFaPg3p91PrRlA9HYDYl7MX

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured to deploy to GitHub Pages using GitHub Actions.

1. Push your changes to the `main` or `master` branch.
2. The "Deploy to GitHub Pages" action will automatically run.
3. Once completed, your app will be available at `https://<USERNAME>.github.io/hr-helper/`.

> [!IMPORTANT]
> Ensure you have enabled GitHub Pages in your repository settings (Settings > Pages) and selected `gh-pages` branch as the source after the first successful deployment.

## Project Structure


- `src/`: Source code
  - `components/`: React components
  - `services/`: API services
- `public/`: Static assets
- `.github/workflows/`: CI/CD configurations
