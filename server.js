require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const requiredEnvironmentVariables = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_TO'
];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (variable) => !process.env[variable]
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missingEnvironmentVariables.join(', ')}`
  );
}

const port = Number(process.env.PORT || 3000);
const smtpPort = Number(process.env.SMTP_PORT);
const smtpSecureSetting = process.env.SMTP_SECURE?.toLowerCase();
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT doit être un numéro de port valide.');
}
if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
  throw new Error('SMTP_PORT doit être un numéro de port valide.');
}
if (smtpSecureSetting && !['true', 'false'].includes(smtpSecureSetting)) {
  throw new Error('SMTP_SECURE doit valoir true ou false.');
}

const app = express();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpSecureSetting
    ? smtpSecureSetting === 'true'
    : smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://cdnjs.cloudflare.com'
        ],
        upgradeInsecureRequests: null
      }
    }
  })
);
app.use(express.json({ limit: '10kb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post(
  '/send-email',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false
  }),
  async (req, res) => {
    const { name, email, message } = req.body || {};
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim() : '';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';

    if (
      !cleanName ||
      cleanName.length > 100 ||
      !cleanEmail ||
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      !cleanMessage ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez vérifier les champs du formulaire.'
      });
    }

    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.MAIL_TO,
        replyTo: cleanEmail,
        subject: 'Nouveau message via le portfolio',
        text: `Nom : ${cleanName}\nEmail : ${cleanEmail}\n\n${cleanMessage}`
      });

      console.log('Email envoyé :', info.response);
      return res.status(200).json({
        success: true,
        message: 'Message envoyé avec succès !'
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi du message."
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Portfolio disponible sur http://localhost:${port}`);
});
