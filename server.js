import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const OLLAMA_URL = "http://localhost:11434/api/generate";

app.get("/health", (_, res) => {
    res.json({ status: "ok", service: "nexo-bot" });
});

app.post("/chat", async (req, res) => {
    const { message, mood } = req.body;

    const prompt = `
Eres Nexo, un asistente de apoyo emocional inicial.
Debes responder en español claro, con calidez, sin exagerar, sin emojis, y en máximo 3 oraciones.
No diagnosticas enfermedades.
Si el estado es rojo, sugiere buscar apoyo humano y profesional.
Estado emocional del usuario: ${mood || "no definido"}.
Mensaje del usuario: ${message}
`;

    try {
        const response = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "tinyllama",
                prompt,
                stream: false
            })
        });

        const data = await response.json();
        res.json({ reply: data.response || "No tuve una respuesta disponible." });
    } catch (error) {
        res.status(500).json({
            reply: "No fue posible responder en este momento."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Nexo bot activo en puerto ${PORT}`);
});