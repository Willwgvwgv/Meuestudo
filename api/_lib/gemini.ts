import { GoogleGenAI, Type } from '@google/genai';

export interface GenerateQuestionsRequestBody {
  subject?: string;
  topic?: string;
  difficulty?: string;
  count?: number;
}

export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
}

/**
 * Server-side Gemini question generator (GEMINI_API_KEY is never exposed to the browser).
 * Shared by the local Express dev server (server.ts) and the /api/generate-questions
 * Vercel Function so both environments behave identically.
 */
export async function generateQuestions(
  requestBody: GenerateQuestionsRequestBody,
): Promise<ApiResult> {
  const { subject, topic, difficulty = 'Médio', count = 3 } = requestBody || {};

  if (!subject || !topic) {
    return {
      status: 400,
      body: {
        error: 'É necessário fornecer a matéria e o tópico de estudo.',
      },
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      status: 500,
      body: {
        error:
          'Chave GEMINI_API_KEY não configurada no servidor. Configure nos Secrets do AI Studio.',
      },
    };
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

  try {
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
      return {
        status: 502,
        body: {
          error:
            'A IA gerou uma resposta em formato inválido. Por favor, tente novamente em instantes.',
        },
      };
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return {
        status: 502,
        body: {
          error: 'Nenhuma questão foi retornada pelo modelo. Tente refinar o tópico de estudo.',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        questions,
        subject,
        topic,
      },
    };
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

    return {
      status: 500,
      body: { error: message },
    };
  }
}
