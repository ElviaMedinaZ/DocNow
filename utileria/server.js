// Importaciones necesarias
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors());
app.use(bodyParser.json());

// Configuración del Transporter de Mailtrap
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: "e4dfa0ef5b9ee1",
        pass: "3c8c15026037c2"   // Contraseña de Mailtrap
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('Error al conectar con Mailtrap:', error);
    } else {
      console.log('Conexión exitosa con Mailtrap');
    }
  });
} catch (err) {
  console.error('Error al configurar el transporter:', err.message);
}

// Código global (para simplicidad, se debería usar una base de datos en producción)
let codigoGuardado = null;

app.post('/enviarCodigo', async (req, res) => {
  const { email, codigo } = req.body;
  try {
    codigoGuardado = codigo;  // Guardar el código temporalmente

    await transporter.sendMail({
      from: '"Prueba App" <no-reply@yourapp.com>',
      to: email,
      subject: 'Código de Verificación',
      text: `Tu código de verificación es: ${codigo}`,
    });

    console.log(`Correo enviado a ${email} con el código ${codigo}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Ruta para verificar el código ingresado
app.post('/verificarCodigo', (req, res) => {
  const { codigoIngresado } = req.body;

  if (codigoIngresado == codigoGuardado) {
    console.log('Código correcto');
    return res.json({ success: true });
  } else {
    console.log('Código incorrecto');
    return res.json({ success: false, error: 'Código incorrecto' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

