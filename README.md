# João Santos Audio Portfolio

Personal portfolio for João Santos, a game audio designer and music producer. The site presents work across game audio, music production, mixing and mastering, vocal editing, and sound design for visual media.

Live site: [joaosantosaudio.vercel.app](https://joaosantosaudio.vercel.app/)

## Technology

- React 19
- Vite 7
- Tailwind CSS 4
- Vercel Analytics
- Web3Forms for the contact form
- YouTube, Dailymotion, and SoundCloud embeds

## Project structure

```text
public/
  images/                 Optimized public images
  icons/                  Social icons
  favicon.svg             Browser favicon
src/
  App.jsx                 Page composition, dialogs, and URL navigation
  components/             Hero, navigation, cards, players, and contact form
    sections/             Content layouts for each portfolio category
  test/                   Automated interface test setup
  utils/                  Focus management and video URL helpers
  index.css               Global styles and animations
  main.jsx                React entry point
  portfolio-data.json     Profile, categories, projects, and services
  HOW-TO-EDIT-PORTFOLIO.md
index.html                Metadata and application shell
```

Most content updates should be made in `src/portfolio-data.json`. See [`src/HOW-TO-EDIT-PORTFOLIO.md`](src/HOW-TO-EDIT-PORTFOLIO.md) for the current field formats and examples.

## Local development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Vite prints the local preview address in the terminal. Changes update automatically during development.

## Contact form

The contact form submits through Web3Forms. Create a local `.env` file containing:

```text
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

The `.env` file is ignored by Git. Configure the same environment variable in the production hosting service.

## Editing projects and media

- Game Audio videos use a complete `youtubeUrl` and support YouTube or Dailymotion.
- Mixing, Vocal Editing, and Visual Media videos use a YouTube `youtubeId`.
- Music and audio-only Vocal Editing projects use `soundcloudUrl`.
- Category images are optimized WebP files in `public/images/categories`.
- Project order in the JSON file is the display order on the site.

### Private SoundCloud track

One unlisted SoundCloud track intentionally includes a `secret_token` in `src/portfolio-data.json`. The token is required for that track to play for portfolio visitors.

**Do not remove or modify this token unless the portfolio owner explicitly requests it.**

## Quality checks

Run linting:

```bash
pnpm lint
```

Run the automated interface tests:

```bash
pnpm test
```

Create a production build:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Deployment

The site is a static Vite application. The production command and output directory are:

```text
Build command: pnpm build
Output directory: dist
```

For Vercel, connect the GitHub repository, select the Vite framework preset, configure `VITE_WEB3FORMS_ACCESS_KEY`, and deploy. Pushing a new commit to the configured production branch triggers a new deployment when automatic deployments are enabled.

Every push and pull request also runs linting, tests, and a production build through GitHub Actions. Before publishing, run `pnpm lint`, `pnpm test`, and `pnpm build`, then check the affected pages in the local preview.
