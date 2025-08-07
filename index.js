const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Tu clave de Holded
const HOLDED_API_KEY = 'b023d565797ee81761ccc946735086ab';

// Permitir CORS desde tu frontend
app.use(cors());

// Ruta para obtener facturas desde Holded
app.get('/api/holded/invoices', async (req, res) => {
  try {
    const response = await fetch('https://api.holded.com/api/invoicing/v1/documents?type=invoice', {
      headers: {
        Authorization: `Bearer ${HOLDED_API_KEY}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error al conectar con Holded' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ Error en el proxy:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy activo en http://localhost:${PORT}`);
});
