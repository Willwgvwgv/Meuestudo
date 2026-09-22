import 'dotenv/config';
import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Config endpoint for client bootstrap
app.get('/api/config', (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    supabaseUrl,
    supabaseAnonKey,
    hasGeminiKey,
  });
});

// 2. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 3. Server-side Gemini Question Generator (GEMINI_API_KEY is never exposed to browser)
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { subject, topic, difficulty = 'Médio', count = 3 } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({
        error: 'É necessário fornecer a matéria e o tópico de estudo.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          'Chave GEMINI_API_KEY não configurada no servidor. Configure nos Secrets do AI Studio.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const clampedCount = Math.max(1, Math.min(Number(count) || 3, 10));

    const prompt = `Crie exatamente ${clampedCount} questão(ões) de múltipla escolha inéditas, contextualizadas e aprofundadas sobre:
Matéria / Área de Estudo: "${subject}"
Tópico Específico: "${topic}"
Nível de Dificuldade: "${difficulty}"

Instruções pedagógicas importantes:
- A matéria pode pertencer a QUALQUER área ou nível de ensino: fundamental, médio, técnico, graduação/ensino superior (qualquer faculdade como Medicina, Direito, Engenharias, Psicologia, etc.), pós-graduação, vestibulares/ENEM ou concursos públicos. Não presuma contexto escolar infantil a menos que especificado.
- Formato obrigatório JSON: um array com objetos contendo:
  { "questionText": "...", "options": ["...","...","...","..."], "correctAnswerIndex": 0, "explanation": "...", "difficulty": "${difficulty}" }
- Cada questão DEVE ter exatamente 4 opções de resposta bem fundamentadas e plausíveis.
- O campo correctAnswerIndex deve ser um número inteiro de 0 a 3 indicando a alternativa correta.
- A explicação ("explanation") deve ser didática, explicando claramente o porquê da alternativa correta.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Lista de questões geradas em formato JSON estrito',
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: {
                type: Type.STRING,
                description: 'Enunciado da questão',
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array de 4 alternativas',
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: 'Índice da resposta correta (0 a 3)',
              },
              explanation: {
                type: Type.STRING,
                description: 'Explicação detalhada da resposta',
              },
              difficulty: {
                type: Type.STRING,
                description: 'Fácil, Médio ou Difícil',
              },
            },
            required: [
              'questionText',
              'options',
              'correctAnswerIndex',
              'explanation',
              'difficulty',
            ],
          },
        },
        systemInstruction:
          'Você é um professor e elaborador de bancas examinadoras experiente. Gere questões com alto rigor técnico e pedagógico para qualquer nível de ensino ou área do conhecimento solicitada, sem ambiguidades e com 4 opções equilibradas.',
      },
    });

    const responseText = response.text || '[]';
    let questions;
    try {
      questions = JSON.parse(responseText);
    } catch {
      return res.status(502).json({
        error:
          'A IA gerou uma resposta em formato inválido. Por favor, tente novamente em instantes.',
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(502).json({
        error: 'Nenhuma questão foi retornada pelo modelo. Tente refinar o tópico de estudo.',
      });
    }

    return res.json({
      success: true,
      questions,
      subject,
      topic,
    });
  } catch (err: any) {
    console.error('Erro ao gerar questões com Gemini:', err);
    let message = 'Não foi possível gerar as questões no momento. Tente novamente.';
    const rawMsg = err?.message || String(err);

    if (
      rawMsg.includes('429') ||
      rawMsg.toLowerCase().includes('quota') ||
      rawMsg.toLowerCase().includes('resource has been exhausted')
    ) {
      message =
        'O limite de requisições temporário da IA foi atingido. Aguarde alguns segundos e tente novamente.';
    } else if (rawMsg.includes('403') || rawMsg.toLowerCase().includes('api key')) {
      message =
        'A chave da API Gemini não possui autorização ou é inválida. Verifique os Secrets do projeto.';
    } else if (
      rawMsg.toLowerCase().includes('safety') ||
      rawMsg.toLowerCase().includes('blocked')
    ) {
      message =
        'O tema solicitado acionou os filtros de segurança do modelo. Tente reescrever o tópico.';
    }

    return res.status(500).json({
      error: message,
    });
  }
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
