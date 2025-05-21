/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Firebase Function: index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const cors = require('cors')({ origin: true });
admin.initializeApp();

sgMail.setApiKey(functions.config().sendgrid.api_key);

exports.enviarCodigoEmail = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const { email } = req.body;
        if (!email) return res.status(400).send({ error: 'Correo electrónico no proporcionado' });

        try {
            const userSnapshot = await admin.firestore().collection('usuarios').where('email', '==', email).get();
            if (userSnapshot.empty) {
                return res.status(404).send({ error: 'Correo no registrado' });
            }

            const codigo = Math.floor(10000 + Math.random() * 90000); // Código de 5 dígitos
            const timestamp = Date.now();

            await admin.firestore().collection('codigos').doc(email).set({ codigo, timestamp });

            const msg = {
                to: email,
                from: 'no-reply@yourapp.com',
                subject: 'Código de Verificación',
                text: `Tu código de verificación es: ${codigo}`,
            };

            await sgMail.send(msg);
            res.status(200).send({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: 'Error al enviar el correo' });
        }
    });
});