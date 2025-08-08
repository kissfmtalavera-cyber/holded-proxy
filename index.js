const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener contactos desde Holded
app.get('/api/contacts', async (req, res) => {
  try {
    const response = await axios.get('https://api.holded.com/api/invoicing/v1/contacts', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.HOLDED_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener contactos:', error.message);
    res.status(500).json({ error: 'Error al obtener contactos desde Holded' });
  }
});

// Ruta para obtener documentos (facturas, presupuestos, etc.)
app.get('/api/documents', async (req, res) => {
  try {
    const type = req.query.type; // Ejemplo: ?type=invoice
    const url = type
      ? `https://api.holded.com/api/invoicing/v1/documents?type=${type}`
      : 'https://api.holded.com/api/invoicing/v1/documents';

    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.HOLDED_API_KEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener documentos:', error.message);
    res.status(500).json({ error: 'Error al obtener documentos desde Holded' });
  }
});

// Ruta de diagnóstico (health check)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
