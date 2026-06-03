import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    const prompt = `Eres NEXO, un asistente virtual empático, amable y humano. Tu objetivo es ayudar al usuario a sentirse bien. Responde de forma corta, conversacional y en español.
Usuario: ${message}
NEXO:`;

    try {
        // Node 20 (que usas en tu Dockerfile) ya trae fetch nativo
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'tinyllama',
                prompt: prompt,
                stream: false
            })
        });
        
        const data = await response.json();
        res.json({ reply: data.response });
    } catch (error) {
        console.error("Error con Ollama:", error);
        res.status(500).json({ reply: 'Chuta, me desconecté un ratito. ¿Me repites?' });
    }
});

// Configuración vital para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor NEXO activo en puerto ${PORT}`));
