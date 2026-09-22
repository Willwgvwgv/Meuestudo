import { generateQuestions } from './_lib/gemini';
import type { ApiRequest, ApiResponse } from './_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const result = await generateQuestions(req.body ?? {});
  return res.status(result.status).json(result.body);
}
