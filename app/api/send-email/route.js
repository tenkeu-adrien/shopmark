import nodemailer from 'nodemailer';

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { recaptchaToken, ...formData } = req.body;

  // Vérification reCAPTCHA
  try {
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: 'POST' }
    );
    const recaptchaData = await recaptchaResponse.json();
    
    if (!recaptchaData.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying reCAPTCHA' });
  }

  // Configuration Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou autre service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Préparation de l'email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'contact@devagencyweb.online', // Email de destination
    subject: `Nouveau message: ${formData.subject}`,
    html: `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom:</strong> ${formData.fullName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Téléphone:</strong> ${formData.phone || 'Non fourni'}</p>
      <p><strong>Service:</strong> ${formData.service || 'Non spécifié'}</p>
      <p><strong>Option:</strong> ${formData.otherOption || 'Non spécifiée'}</p>
      <h3>Message:</h3>
      <p>${formData.message}</p>
    `,
  };

  // Envoi de l'email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}