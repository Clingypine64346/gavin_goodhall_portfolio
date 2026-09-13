# Gavin Goodhall — Mechanical Engineering Portfolio

A complete static portfolio built with HTML, one CSS file, and vanilla JavaScript. No React, Node.js, package installation, database, backend, or build step is required. Open `index.html` directly in a browser to preview it.

## 1. Project organization

```text
index.html                         Homepage and featured work
engineering.html                   Five engineering project cards
blender.html                       Five Blender projects and image dialogs
about.html                         Education, interests, process, resume
css/style.css                      All styling and responsive layouts
js/main.js                         Mobile menu, galleries, contact notices, year
assets/images/                     Labeled SVG image placeholders
assets/resume/Gavin_Goodhall_Resume.pdf   Placeholder resume PDF
projects/projectile-simulator.html
projects/robot-catapult.html
projects/naval-orange-race.html
projects/cad-mechanical-design.html
projects/3d-printing.html
projects/project-template.html     Reusable engineering detail template
.nojekyll                          Tells GitHub Pages to serve static files
```

All links use relative paths, including `../` on project pages. This supports both a GitHub user website and a repository website under a subdirectory. File names are case sensitive on GitHub Pages.

## 2. Edit text and colors

Open any HTML file in a text editor and change the text between tags, preserving the surrounding markup. The full content is in HTML, so editing does not require learning JavaScript. Search for `Placeholder` to find unfinished content. Do not publish example text as a claim about your work.

The navigation and footer are intentionally in each HTML file so they work without JavaScript. When editing a shared link or footer text, use your editor's **Find in Files / Replace in Files** across all HTML files, including `projects/`. Keep `aria-current="page"` on the current section's navigation link.

Change the variables at the top of `css/style.css` to adjust colors, spacing, card backgrounds, borders, and maximum content width. Typography uses installed system fonts, so no external fonts load. Media queries near the bottom control tablet and phone layouts.

## 3. Replace images

All supplied images are abstract technical grids with visible placeholder labels. They are image slots, not photos, renders, CAD models, or claimed project results.

1. Put your image in `assets/images/`, for example `robot-catapult-main.webp`.
2. Replace its HTML `src`, for example `assets/images/robot-catapult.svg` → `assets/images/robot-catapult-main.webp`.
3. On a page in `projects/`, use `../assets/images/robot-catapult-main.webp`.
4. Update the `alt` attribute with an accurate description and remove “placeholder” from real image captions.
5. Set `width` and `height` to the actual image dimensions. CSS keeps them responsive.

Use WebP or JPG for photos/renders, PNG for diagrams that need it, or SVG for vector drawings. Aim for roughly 1200–1600 pixels across and compress large images, ideally to a few hundred KB. Cards crop to a consistent aspect ratio; detail galleries retain natural dimensions. Lazy loading is already enabled for images below the top of the page. Replace the generic detail gallery assets separately per project when adding real work.

## 4. Add a new engineering project

1. Copy `projects/project-template.html` to a meaningful filename, such as `projects/suspension-study.html`.
2. Edit `<title>`, the Open Graph title, the main heading, category, overview, and tools. Replace every placeholder paragraph with verified details or keep it explicitly marked unfinished.
3. Fill in **The Problem**, **My Role**, **Design & Process**, **Tools Used**, **Challenges**, **Solution / Iteration**, **Final Result**, and **What I Learned**. Keep team contributions distinct from your own.
4. Replace the main image and the three gallery images. Copy a `<figure>...</figure>` block to add CAD screenshots, engineering drawings, photos, MATLAB graphs, prototypes, or diagrams.
5. In `engineering.html`, copy one complete `<article class="project-card">...</article>`. Update its image, title, summary, category, tools, index number, and **both** project links.
6. To feature it on the homepage, replace or copy a card in `index.html` under `id="featured"`.

The project template is not linked from the public portfolio. Keep it as an authoring reference, or omit it from deployment if desired.

## 5. Add a new Blender project

All Blender content lives in `blender.html`; no JavaScript data editing is needed.

1. Copy an entire `<article class="art-card">...</article>` in the gallery.
2. Give its button a unique `data-modal` value, such as `vehicle-render-dialog`. Update the button's accessible label, title, main image, tools, and focus text.
3. Copy one matching `<dialog class="gallery-dialog">...</dialog>` near the end of the main content.
4. Set its `id` to the same value as `data-modal`. Give the heading a unique ID, and set `aria-labelledby` to that heading ID.
5. Update the description, tools, year, focus areas, image descriptions, and close-button label. Suggested focus areas in this first version are placeholders, not asserted project details.
6. Add 3–6 images by duplicating the `<figure>` blocks inside `.modal-images`. Each image should have its own useful `alt` text and caption.

Dialogs support keyboard navigation, Escape, close buttons, backdrop clicks, and focus restoration. The first gallery card spans both desktop columns by design; the grid automatically becomes one column on phones.

## 6. Replace the resume

Overwrite `assets/resume/Gavin_Goodhall_Resume.pdf` with your actual resume, using that exact spelling. The included one-page PDF is conspicuously marked **PLACEHOLDER — NOT A RESUME**, so the links and download work immediately without implying a finished resume exists.

Once replaced, remove the placeholder note from `about.html`. If you rename the PDF, replace its path in every HTML file. All resume links use `target="_blank"` and `rel="noopener noreferrer"` to open the PDF in a new tab. The About button also opens the PDF instead of forcing a download; visitors can download it from their browser’s PDF viewer.

## 7. Update Email, LinkedIn, and GitHub

Use Find in Files across **all HTML files** to replace:

| Placeholder | Replace with |
|---|---|
| `mailto:your-email@example.com` | `mailto:` followed by your email |
| `https://www.linkedin.com/in/YOUR-PROFILE/` | Your full LinkedIn profile URL |
| `https://github.com/YOUR-USERNAME` | Your full GitHub profile URL |

For each updated contact link, also remove its `data-placeholder="..."` attribute, change its `aria-label` to remove `(placeholder)`, and remove its `<span class="placeholder-marker"> placeholder</span>`. Until then, JavaScript deliberately displays a “contact information has not been added” notice instead of following the fake URL. With JavaScript off, example addresses remain clearly identified through their link labels/accessibility labels; replace them before sharing publicly.

There is no contact form or backend. Email uses the visitor's email application. No phone number or physical address is included.

## 8. Publish with GitHub Pages

1. Sign in to GitHub and create a repository, for example `portfolio`. For free GitHub Pages on GitHub Free, use a **public** repository.
2. Upload the **contents of this portfolio folder** to the repository root: `index.html` should be at the top level, alongside `css/`, `js/`, `assets/`, and `projects/`. Do not upload the enclosing folder or the ZIP as a single file. Include `.nojekyll` if your upload method allows it; the site also works without it.
3. Commit the files to `main`.
4. Open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose **main** and **/(root)**, and save.
5. Wait for the Pages deployment to finish. GitHub will display the published address, typically `https://YOUR-USERNAME.github.io/portfolio/`.
6. To use `https://YOUR-USERNAME.github.io/` instead, name the repository exactly `YOUR-USERNAME.github.io` and follow the same steps.
7. Future commits to the selected branch publish updates automatically. Check the repository's Actions tab if a deployment fails.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### SEO and sharing

Each page includes a title, description, theme color, favicon, and Open Graph title/description/type. The homepage uses the requested title and description. Each HTML `<head>` has a commented **PLACEHOLDER** block for `og:url` and `og:image`. After deployment, replace the example URL with that page's full public address and supply a real 1200 × 630 JPG/PNG sharing image. Then uncomment those two tags. Social crawlers need absolute HTTPS URLs for these metadata values; keep navigation and asset paths relative. No nonexistent social image is requested by the live HTML.

### Before sending to recruiters

- Replace the resume, contact links, and project images.
- Replace unfinished project text with your own verified details; leave any remaining examples clearly labeled.
- Check Home, Engineering, Blender, About, project pages, PDF, and all contact links at the published URL.
- Try a phone-sized window, keyboard Tab navigation, the mobile menu, and gallery closing with Escape.

This folder is the complete deployable website. You do not need the separate development or validation files used to create it.
