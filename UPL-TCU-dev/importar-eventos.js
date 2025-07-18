// importar-eventos.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Ruta a tu archivo de credenciales
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Lee los eventos desde data.json
const dataPath = path.join(__dirname, 'data', 'data.json');
const eventos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Sube cada evento a la colección "eventos"
async function importarEventos() {
  for (const evento of eventos) {
    // Usa el id como docId si existe, si no, genera uno nuevo
    const docId = evento.id ? String(evento.id) : undefined;
    if (docId) {
      await db.collection('eventos').doc(docId).set(evento);
    } else {
      await db.collection('eventos').add(evento);
    }
    console.log(`Evento importado: ${evento.nombre}`);
  }
  console.log('Importación completada.');
  process.exit(0);
}

importarEventos().catch(console.error);
