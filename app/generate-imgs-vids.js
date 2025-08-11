const fs = require('fs');
const path = require('path');

// Paths based on your actual structure
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const videosDir = path.join(__dirname, '..', 'public', 'videos');
const settingsPath = path.join(__dirname, 'lib', 'settings.json');

// Read settings.json
let settings;
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
} catch (err) {
  console.error('❌ Could not read settings.json:', err.message);
  process.exit(1);
}

// ==== IMAGES ====
const imageFiles = fs.readdirSync(imagesDir).filter(file =>
  /\.(jpe?g|png|webp|gif)$/i.test(file)
);

const images = {};
imageFiles.forEach(file => {
  const key = path.parse(file).name; // e.g., "hero1"
  images[key] = `/images/${file}`;   // e.g., "/images/hero1.jpg"
});
settings.images = images;

// ==== VIDEOS ====
const videoFiles = fs.readdirSync(videosDir).filter(file =>
  /\.(mp4|webm|mov)$/i.test(file)
);

const videos = {};
videoFiles.forEach((file, index) => {
  const key = path.parse(file).name || `Video ${index + 1}`;
  videos[key] = `/videos/${file}`;
});
settings.videos = videos;

// Save back to settings.json
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

console.log(`✅ settings.images updated with ${imageFiles.length} images from /public/images`);
console.log(`✅ settings.videos updated with ${videoFiles.length} videos from /public/videos`);
