const express = require('express');
const fetch = require('node-fetch').default;
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta dinámica para acceder a cualquier endpoint de Holded
app.get('/api/holded/:module/:version/:resource', async (req, res) => {
    const { module, version, resource } = req.params;
    const apiKey = req.headers.authorization?.replace('Bearer ', '');

    if (!apiKey) {
        return res.status(400).json({ error: 'API key missing' });
    }

    const holdedUrl = `https://api.holded.com/api/${module}/${version}/${resource}`;

    try {
        const response = await fetch(holdedUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        res.json(data);
    } catch (error) {
    console.error(`❌ Error al conectar con Holded (${resource}):`, error.message);
    res.status(500).json({ error: error.message });
}

});

app.listen(PORT, () => {
    console.log(`🚀 Proxy dinámico activo en http://localhost:${PORT}`);
});