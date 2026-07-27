import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ 
        error: 'No se ha configurado la API Key de Gemini. Por favor, añade tu clave válida en el archivo .env del servidor.' 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    // Pre-prompt context to make it act like the CampusAlert assistant
    const prompt = `Eres un asistente inteligente para la plataforma universitaria "CampusAlert AI". 
Tu objetivo es ayudar a los estudiantes y personal a resolver dudas sobre cómo reportar incidentes, cómo funciona la plataforma y dar consejos de seguridad en el campus.
Sé breve, amigable y profesional. Responde siempre en español.
El usuario dice: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error generating AI response:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al procesar la IA con Gemini.' });
  }
});

export default router;
