# Shivang Sagar — Portfolio

A responsive, static portfolio website for GitHub Pages.

## Deploy to `https://shivangsagar.github.io/portfolio/`

1. Open the repository `https://github.com/shivangsagar/portfolio`.
2. Upload the **contents** of this folder (not the outer ZIP folder) to the repository root.
3. Commit the files to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site.

The website is configured for a repository named `portfolio`, so its relative asset paths work at `/portfolio/`.

## Folder structure

```text
portfolio/
├── index.html
├── style.css
├── script.js
├── config.js
├── projects.js
├── assets/
│   ├── favicon.svg
│   └── Shivang-Sagar-Resume.pdf
└── projects/
    ├── autocad/
    ├── revit/
    └── staad/
```

## Add AutoCAD drawings

1. Copy your `.dwg` or `.dxf` file into `projects/autocad/`.
2. Open `projects.js`.
3. Add an object inside the `autocad` array:

```js
{
  title: "My New Drawing",
  file: "projects/autocad/my-new-drawing.dwg",
  type: "DWG",
  description: "A short description of the drawing.",
  viewer: true,
  number: "08"
}
```

4. Save and push the changes to GitHub.

The AutoCAD preview uses the MLightCAD hosted embed viewer. It requests the drawing at the public URL of your GitHub Pages site. The drawing must be publicly accessible, and the MLightCAD service must be able to fetch it. If the preview fails for a particular drawing, keep the download link and set `viewer: false`.

**Privacy:** Any DWG placed in a public GitHub repository is publicly downloadable. Do not upload confidential/client drawings or personal information.

## Add Revit projects

RVT files are native project files and are not directly previewed by this static site. Add PDF sheets, exported images or a short project description for browser viewing, and optionally link the `.rvt` file for download.

Example entry inside `revit`:

```js
{
  title: "Residential Building Model",
  type: "RVT",
  file: "projects/revit/residential-building.rvt",
  preview: "projects/revit/residential-sheets.pdf",
  description: "BIM model with plans, elevations and sections.",
  viewer: false
}
```

For STAAD.Pro, use the same pattern: add `.std` input files, PDF reports and drawings in `projects/staad/`, then add entries to the `staad` array. Use `preview` for a PDF/image that can be opened in a browser.

## Add GitHub projects

Add an object to the `github` array in `projects.js`:

```js
{
  title: "Repository name",
  type: "ANDROID / KOTLIN",
  description: "What the project does.",
  url: "https://github.com/username/repository",
  tags: ["Kotlin", "Android"]
}
```

## Update résumé

Replace `assets/Shivang-Sagar-Resume.pdf` with your latest résumé, keeping the exact same filename. The résumé download and embedded preview will update automatically.

## Configure direct website email

The contact form currently opens the visitor's default email app using a prefilled message. To submit messages directly from the website:

1. Create a form with Formspree and copy its endpoint URL.
2. Open `config.js`.
3. Set:

```js
formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID"
```

4. Commit the change. Do not put private API keys or secrets in this public repository.

## Edit profile details

Update `config.js` for contact details and links. Update the HTML sections for biography, education, experience and credentials.

## Technology

- HTML5, CSS3 and vanilla JavaScript
- GitHub Pages hosting
- MLightCAD iframe integration for DWG/DXF preview
- Formspree-compatible contact form with mailto fallback
