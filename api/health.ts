import type { ApiRequest, ApiResponse } from './_lib/types';

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}
