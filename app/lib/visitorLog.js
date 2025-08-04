import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'app', 'lib', 'visitors.json');

export function saveVisitorData(newData) {
  let existingData = [];

  // Read existing log if file exists
  if (fs.existsSync(logPath)) {
    const fileContent = fs.readFileSync(logPath, 'utf-8');
    try {
      existingData = JSON.parse(fileContent);
    } catch {
      existingData = [];
    }
  }

  // Add new entry to the start
  existingData.unshift(newData);

  // Keep only last 100
  if (existingData.length > 1000) {
    existingData = existingData.slice(0, 1000);
  }

  // Save back to file
  fs.writeFileSync(logPath, JSON.stringify(existingData, null, 2));
}
