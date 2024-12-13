# Three Little Mages' Home

A very simple static site using vite, threejs, tailwindcss and eleventy for blogging.

[threelittlemages.com](https://threelittlemages.com)

## Requirements

- A somewhat recent version of NodeJS (>=18) and NPM (like >=10 probably?).

## Install

- `npm i` to install dependencies.
- `npx tailwindcss -i style.css -o build/output.css` to build css (with optional `--watch` parameter for development)
- `npm run build` to build the whole website.
- `npm run build:blog` to only compile the markdown files in blog/ to static pages.