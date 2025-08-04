const fs = require('fs');
const path = require('path');

// Paths based on your actual structure
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const settingsPath = path.join(__dirname, 'lib', 'settings.json');

// Read settings.json
let settings;
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
} catch (err) {
  console.error('❌ Could not read settings.json:', err.message);
  process.exit(1);
}

// Read image files from /public/images
const imageFiles = fs.readdirSync(imagesDir).filter(file =>
  /\.(jpe?g|png|webp|gif)$/i.test(file)
);

// Build images object
const images = {};
imageFiles.forEach(file => {
  const key = path.parse(file).name; // e.g., "hero1"
  images[key] = `/images/${file}`;   // e.g., "/images/hero1.jpg"
});

// Inject into settings
settings.images = images;

// Save back to settings.json
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

console.log(`✅ settings.images updated with ${imageFiles.length} images from /public/images`);
