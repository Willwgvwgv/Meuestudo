import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getAppConfig } from './api/_lib/config';
import { generateQuestions } from './api/_lib/gemini';

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes below are shared with the Vercel Functions under api/*.ts
// (api/_lib/config.ts and api/_lib/gemini.ts) so local dev and production
// behave identically.

// 1. Config endpoint for client bootstrap
app.get('/api/config', (req, res) => {
  res.json(getAppConfig());
});

// 2. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 3. Server-side Gemini Question Generator (GEMINI_API_KEY is never exposed to browser)
app.post('/api/generate-questions', async (req, res) => {
  const result = await generateQuestions(req.body);
  res.status(result.status).json(result.body);
});

// 4. Vite middleware for development / Static files for production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
