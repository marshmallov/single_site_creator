'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackgroundImageSelector from '../../components/BackgrounImageSelector'
import ServiceImageSelector from '../../components/ServiceImageSelector'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/adminLogin')
    } else if (status === 'authenticated') {
      fetchSettings()
    }
  }, [status, router])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Error saving settings')
      }
    } catch (error) {
      setMessage('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const updateNestedSetting = (path, value) => {
    const keys = path.split('.')
    const newSettings = { ...settings }
    let current = newSettings

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setSettings(newSettings)
  }

  const updateServiceItem = (index, field, value) => {
    const newSettings = { ...settings }
    newSettings.services.items[index][field] = value
    setSettings(newSettings)
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-500">
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-black text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <a
              href="/mainPage"
              target="_blank"
              className="text-blue-600 hover:text-blue-800"
            >
              View Site
            </a>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 ">
        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6  ">
          <div className="mb-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Site Settings */}
          <div className="text-black bg-white mb-8">
            <h2 className=" text-xl font-semibold mb-4">Site Settings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className=" block text-sm font-medium mb-2">Site Title</label>
                <input
                  type="text"
                  value={settings?.site?.title || ''}
                  onChange={(e) => updateNestedSetting('site.title', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Site Description</label>
                <input
                  type="text"
                  value={settings?.site?.description || ''}
                  onChange={(e) => updateNestedSetting('site.description', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-black bg-white mb-8">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <input
                  type="text"
                  value={settings?.hero?.title || ''}
                  onChange={(e) => updateNestedSetting('hero.title', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <textarea
                  value={settings?.hero?.subtitle || ''}
                  onChange={(e) => updateNestedSetting('hero.subtitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={settings?.hero?.buttonText || ''}
                    onChange={(e) => updateNestedSetting('hero.buttonText', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <input
                    type="text"
                    value={settings?.hero?.buttonLink || ''}
                    onChange={(e) => updateNestedSetting('hero.buttonLink', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <BackgroundImageSelector
                section="hero"
                label="Hero Background Image"
                value={settings?.hero?.backgroundImage}
                onChange={updateNestedSetting}
                images={settings?.images}
              />
            </div>

          </div>

          {/* About Section */}
          <div className="text-black bg-white mb-8">
            <h2 className="text-xl font-semibold mb-4">About Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">About Title</label>
                <input
                  type="text"
                  value={settings?.about?.title || ''}
                  onChange={(e) => updateNestedSetting('about.title', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">About Content</label>
                <textarea
                  value={settings?.about?.content || ''}
                  onChange={(e) => updateNestedSetting('about.content', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  rows="5"
                />
              </div>
              <BackgroundImageSelector
                section="about"
                label="About Background Image"
                value={settings?.about?.backgroundImage}
                onChange={updateNestedSetting}
                images={settings?.images}
              />
            </div>
          </div>

          {/* Services Section */}
          <div className="text-black bg-white mb-8">
            <h2 className="text-xl font-semibold mb-4">Services Section</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Services Title</label>
              <input
                type="text"
                value={settings?.services?.title || ''}
                onChange={(e) => updateNestedSetting('services.title', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
            {settings?.services?.items?.map((service, index) => (
  <div key={index} className="border p-4 rounded">
    <h3 className="font-medium mb-2">Service {index + 1}</h3>
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Icon</label>
        <input
          type="text"
          value={service.icon}
          onChange={(e) => updateServiceItem(index, 'icon', e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={service.title}
          onChange={(e) => updateServiceItem(index, 'title', e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={service.description}
          onChange={(e) => updateServiceItem(index, 'description', e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          rows="2"
        />
      </div>

      {/* ✅ Background image dropdown */}
      <div className="md:col-span-3">
        <label className="block text-sm font-medium mb-1">Background Image</label>
        <select
          value={service.backgroundImage || ''}
          onChange={(e) =>
            updateNestedSetting(`services.items.${index}.backgroundImage`, e.target.value)
          }
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">Select an image</option>
          {Object.entries(settings?.images || {}).map(([key, path]) => (
            <option key={key} value={path}>
              {key} ({path})
            </option>
          ))}
        </select>

        {service.backgroundImage && (
          <img
            src={service.backgroundImage}
            alt={`Service ${index + 1} Preview`}
            className="mt-2 h-32 object-cover rounded border"
          />
        )}
      </div>
    </div>
  </div>
))}
              <BackgroundImageSelector
                section="services"
                label="Services Background Image"
                value={settings?.services?.backgroundImage}
                onChange={updateNestedSetting}
                images={settings?.images}
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-black bg-white mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Title</label>
                <input
                  type="text"
                  value={settings?.contact?.title || ''}
                  onChange={(e) => updateNestedSetting('contact.title', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={settings?.contact?.email || ''}
                    onChange={(e) => updateNestedSetting('contact.email', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="text"
                    value={settings?.contact?.phone || ''}
                    onChange={(e) => updateNestedSetting('contact.phone', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    value={settings?.contact?.address || ''}
                    onChange={(e) => updateNestedSetting('contact.address', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
              <BackgroundImageSelector
                section="contact"
                label="Contact Background Image"
                value={settings?.contact?.backgroundImage}
                onChange={updateNestedSetting}
                images={settings?.images}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}