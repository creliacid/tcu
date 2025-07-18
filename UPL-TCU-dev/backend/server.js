const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;
//const filePath = './data.json';
const filePath = path.join(__dirname, '../data/data.json');

app.use(cors());
app.use(express.json());

// Verificar estado del servidor
app.get('/', (req, res) => {
  res.send('Servidor backend activo 🟢');
});

// GET data
app.get('/data', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer data.json:', err);
      return res.status(500).send('Error leyendo JSON');
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (e) {
      console.error('JSON mal formado:', e);
      res.status(500).send('JSON inválido');
    }
  });
});

// PUT data
app.put('/data', (req, res) => {
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).send('Error escribiendo JSON');
    res.send('JSON actualizado correctamente');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
