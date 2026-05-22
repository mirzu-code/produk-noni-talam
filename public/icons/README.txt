Place your source logo image anywhere in the project (e.g. src/assets/logo.png). Then run:

npm install --save-dev sharp
npm run generate-icons -- <path-to-your-image>

This creates `public/icons/icon-192.png` and `public/icons/icon-512.png`, which are referenced by `manifest.json`. If you prefer, you can manually add images with those filenames.