import { getSettings } from "@/app/lib/settings"

export default async function MainPage() {
  const settings = await getSettings()

  if (!settings) {
    return <div>Error loading settings</div>
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">{settings.site.title}</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative text-white py-20 mt-16"
        style={{
          backgroundImage: `url(${settings.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl font-bold mb-4">{settings.hero.title}</h1>
          <p className="text-xl mb-8">{settings.hero.subtitle}</p>
          <a
            href={settings.hero.buttonLink}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {settings.hero.buttonText}
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50" style={{
        backgroundImage: `url(${settings.about.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">{settings.about.title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{settings.about.content}</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20" style={{
        backgroundImage: `url(${settings.services.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{settings.services.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {settings.services.items.map((service, index) => (
              <div
                key={index}
                className="p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow text-white"
                style={{
                  backgroundImage: `url(${service.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '',
                  backgroundBlendMode: 'overlay',
                }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50" style={{
        backgroundImage: `url(${settings.contact.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{settings.contact.title}</h2>
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">{settings.contact.email}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">{settings.contact.phone}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-600">{settings.contact.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 {settings.site.title}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}



