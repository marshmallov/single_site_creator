'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          surname: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border rounded"
          />
          <input
            type="text"
            name="surname"
            placeholder="Your Surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className="p-3 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (e.g. +48 123 456 789)"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="^\+\d{1,4}[\s]?\d{3}[\s]?\d{3}[\s]?\d{3}$"
            title="Enter a valid phone number"
            className="p-3 border rounded"
          />
        </div>

        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-800"
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>

        {status === 'success' && <p className="text-green-500">Message sent!</p>}
        {status === 'error' && <p className="text-red-500">Something went wrong.</p>}
      </form>
    </section>
  );
}
