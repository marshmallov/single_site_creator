'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackgroundImageSelector from '../../components/BackgrounImageSelector'
import ServiceImageSelector from '../../components/ServiceImageSelector'
import SingleImageSelector from '@/app/components/SingleImageSelector'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [activeSection, setActiveSection] = useState('site');

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
  const updateServiceCount = (count) => {
    const current = settings.services.items || [];
    const newCount = Math.max(1, count); // prevent 0 or negative numbers

    let updatedItems = [...current];

    if (newCount > current.length) {
      // Add new empty service objects
      const additional = Array(newCount - current.length).fill().map(() => ({
        title: '',
        description: '',
        icon: '',
        backgroundImage: '',
      }));
      updatedItems = [...updatedItems, ...additional];
    } else if (newCount < current.length) {
      // Trim the array
      updatedItems = updatedItems.slice(0, newCount);
    }

    updateNestedSetting('services.items', updatedItems);
  };
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
  const handleDownload = async () => {
    const response = await fetch('/api/visitors/download');

    if (!response.ok) {
      alert('Failed to download');
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitors.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="min-h-screen bg-gray-500">
      {/* Header - spans full width */}
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

      {/* Container for sidebar and main content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-6 min-h-[calc(100vh-80px)]">
          <nav className="space-y-4">
            {['site', 'hero', 'about', 'services', 'contact', 'footer', 'extras'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${activeSection === section ? 'bg-blue-500 text-white' : 'text-black'
                  }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)} Section
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto min-h-[calc(100vh-80px)]">
          {/* Save Button */}
          <div className="mb-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/***Conditional Sections ***/}
          {message && (
            <div
              className={`mb-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
            >
              {message}
            </div>
          )}
          {/* Site settings */}
          {activeSection === 'site' && (
            <div className="text-black bg-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
              <div className=" gap-4 mb-4">
                <div className="grid grid-cols-[150px_1fr_auto]">
                  <label className="block text-sm font-medium mb-4">Site Title</label>
                  <input
                    type="text"
                    value={settings?.site?.title || ''}
                    onChange={(e) => updateNestedSetting('site.title', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-[150px_1fr_auto]">
                  <label className="block text-sm font-medium mb-4">Site Description</label>
                  <input
                    type="text"
                    value={settings?.site?.description || ''}
                    onChange={(e) => updateNestedSetting('site.description', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <input
                    type="color"
                    value={settings?.site?.titleColor || '#000000'}
                    onChange={(e) => updateNestedSetting('site.titleColor', e.target.value)}
                    className="w-16 h-10 p-0 border rounded"
                  />
                </div>
              </div>
            </div>
          )}


          { /* Hero settings */}
          {activeSection === 'hero' && (
            <div className="text-black bg-white p-6 rounded-lg mb-8">
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
          )}


          {/* About settings */}
          {activeSection === 'about' && (
            <div className="text-black bg-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">About Section</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-[150px_1fr_auto] gap-4 items-center">
                  <label className="text-sm font-medium">About Title</label>
                  <input
                    type="text"
                    value={settings?.about?.title || ''}
                    onChange={(e) => updateNestedSetting('about.title', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="color"
                    value={settings?.about?.titleColor || '#000000'}
                    onChange={(e) => updateNestedSetting('about.titleColor', e.target.value)}
                    className="w-16 h-10 p-0 border rounded"
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] gap-4">
                  <label className="text-sm font-medium pt-2">About Content</label>
                  <textarea
                    value={settings?.about?.content || ''}
                    onChange={(e) => updateNestedSetting('about.content', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows="5"
                  />
                </div>

                <SingleImageSelector
                  section="about"
                  label="About Top Image"
                  value={settings?.about?.image}
                  onChange={updateNestedSetting}
                  images={settings?.images}
                />
                <BackgroundImageSelector
                  section="about"
                  label="About Background Image"
                  value={settings?.about?.backgroundImage}
                  onChange={updateNestedSetting}
                  images={settings?.images}
                />
              </div>
            </div>
          )}


          {/* Services settings */}
          {activeSection === 'services' && (
            <div className="text-black bg-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Services Section</h2>

              <div className="grid grid-cols-[150px_1fr_auto] gap-4 items-center mb-4">
                <label className="text-sm font-medium">Services Title</label>
                <input
                  type="text"
                  value={settings?.services?.title || ''}
                  onChange={(e) => updateNestedSetting('services.title', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="color"
                  value={settings?.services?.titleColor || '#000000'}
                  onChange={(e) => updateNestedSetting('services.titleColor', e.target.value)}
                  className="w-16 h-10 p-0 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-black text-sm font-medium mb-2">Number of Services</label>
                <input
                  type="number"
                  min={1}
                  value={settings?.services?.items?.length || 0}
                  onChange={(e) => updateServiceCount(parseInt(e.target.value))}
                  className="text-black w-32 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
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
          )}


          {/* Contact settings */}
          {activeSection === 'contact' && (
            <div className="text-black bg-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Section</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-[150px_1fr_auto] gap-4 items-center">
                  <label className="text-sm font-medium">Contact Title</label>
                  <input
                    type="text"
                    value={settings?.contact?.title || ''}
                    onChange={(e) => updateNestedSetting('contact.title', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="color"
                    value={settings?.contact?.titleColor || '#000000'}
                    onChange={(e) => updateNestedSetting('contact.titleColor', e.target.value)}
                    className="w-16 h-10 p-0 border rounded"
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
                <div>
                  <label className="block text-sm font-medium mb-2">Show Contact Form</label>
                  <select
                    value={settings?.contact?.showForm ? 'true' : 'false'}
                    onChange={(e) => updateNestedSetting('contact.showForm', e.target.value === 'true')}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Show</option>
                    <option value="false">Hide</option>
                  </select>
                </div>
              </div>
            </div>
          )}


          {/* Footer settings */}
          {activeSection === 'footer' && (
            <div className="text-black bg-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Footer Section</h2>

              <div className="grid grid-cols-[150px_1fr] gap-4 mb-4">
                <label className="text-sm font-medium pt-2">Year</label>
                <input
                  type="text"
                  value={settings?.footer?.year || ''}
                  onChange={(e) => updateNestedSetting('footer.year', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-[150px_1fr] gap-4 mb-4">
                <label className="text-sm font-medium pt-2">Footer Text</label>
                <input
                  type="text"
                  value={settings?.footer?.text || ''}
                  onChange={(e) => updateNestedSetting('footer.text', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Footer Links</h3>
                {settings?.footer?.links?.map((link, index) => (
                  <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2 items-center">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) =>
                        updateNestedSetting(`footer.links.${index}.label`, e.target.value)
                      }
                      className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateNestedSetting(`footer.links.${index}.url`, e.target.value)
                      }
                      className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const newLinks = [...settings.footer.links]
                        newLinks.splice(index, 1)
                        updateNestedSetting('footer.links', newLinks)
                      }}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newLinks = [...(settings.footer?.links || [])]
                    newLinks.push({ label: '', url: '' })
                    updateNestedSetting('footer.links', newLinks)
                  }}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Link
                </button>
              </div>
            </div>
          )}


          {/* Extras  */}
          {activeSection === 'extras' && (
            <div className="text-black bg-white p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Extras</h2>
              <div className="p-4">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download Visitors JSON
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}