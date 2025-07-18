import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'app', 'lib', 'settings.json');

export async function getSettings() {
  try {
    const settingsFile = fs.readFileSync(settingsPath, 'utf8')
    return JSON.parse(settingsFile)
  } catch (error) {
    console.error('Error reading settings:', error)
    return null
  }
}

export async function updateSettings(newSettings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2))
    return true
  } catch (error) {
    console.error('Error updating settings:', error)
    return false
  }
}