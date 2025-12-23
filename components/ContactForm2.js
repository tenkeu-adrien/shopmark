"use client"
import Image from 'next/image';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaFacebookF,  FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
export default function ContactForm2() {
  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    phone: '',
    email: '',
    service: '',
    otherOption: '',
    message: ''
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert('Veuillez compléter le reCAPTCHA');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken })
      });
      
      if (response.ok) {
        alert('Message envoyé avec succès!');
        setFormData({
          fullName: '',
          subject: '',
          phone: '',
          email: '',
          service: '',
          otherOption: '',
          message: ''
        });
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12" id="contact">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Formulaire */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Nom et prénom"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <input
                type="text"
                name="subject"
                placeholder="Objet du message"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Numéro de téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Choisir un service</option>
                  <option value="creation-site">Création de site web</option>
                  <option value="creation-site">Développement d'applications Web et mobiles</option>
                  
                  <option value="referencement">Référencement SEO</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <select
                  name="otherOption"
                  value={formData.otherOption}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Autre option</option>
                  <option value="urgence">Projet urgent</option>
                  <option value="budget">Demande de budget</option>
                </select>
              </div>
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Votre message..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              ></textarea>
            </div>

            <div className="my-4">
              <ReCAPTCHA
                sitekey="6Lf8OTErAAAAAIcaZQw2niRXZBPo9V4N9wCEwJlA"
                onChange={token => setRecaptchaToken(token)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
            

          <h4 className="font-semibold mb-3 mt-3">Connectez-vous avec nous :</h4>
 <div className="flex space-x-4">
      <a 
        href="https://www.facebook.com/devagenceweb" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
      >badges
        <FaFacebookF size={18} />
      </a>
 
      <a 
        href="https://www.linkedin.com/in/djeudje-tenkeu-adrien-kevin" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
      >
        <FaLinkedinIn size={18} />
      </a>
      <a 
        href="https://instagram.com/devagencyweb" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:opacity-90 transition-colors"
      >
        <FaInstagram size={18} />
      </a>
      <a 
        href="https://youtube.com/devagencyweb" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
      >
        <FaYoutube size={18} />
      </a>
    </div>

          
        </div>

        {/* Informations de contact */}
        <div className="w-full md:w-1/2  p-8 rounded-lg">
  <Image 
    src="/4.jpg"
    alt="Agence web Douala"
    width={500}  // Définir une largeur explicite
    height={300} // Définir une hauteur explicite
    className="w-full h-auto object-cover rounded-lg h-full"
    quality={100} // Augmenter la qualité
    priority // Si c'est une image importante
  />
</div>
      </div>
    </div>
  );
}