import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Minimal shape of the request/response objects Vercel's Node.js runtime
 * passes to a function handler. Declared locally (instead of depending on
 * `@vercel/node`) to avoid pulling in its vulnerable build-time transitive
 * dependencies for what is otherwise a types-only convenience.
 */
export interface ApiRequest extends IncomingMessage {
  method?: string;
  body?: any;
  query?: Record<string, string | string[]>;
}

export interface ApiResponse extends ServerResponse {
  status(statusCode: number): ApiResponse;
  json(body: unknown): ApiResponse;
}
