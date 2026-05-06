
# The PIER Portal

The official portal for students and faculty of The Harbour School, Hong Kong.

## Access the Portal
The portal is optimized for static hosting on GitHub Pages.

👉 **[Launch The PIER Portal](https://penguininhk.github.io/thepeirISM/)**

## Build Status
This project uses GitHub Actions with Node.js 24 for automated deployment. 

## Development
1. `npm install --legacy-peer-deps`
2. `npm run dev`

## Static Export
To generate the static site manually:
`npm run build`
The files will be in the `out/` directory. Note that the `basePath` is set to `/thepeirISM`.
