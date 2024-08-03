// src/types/express.d.ts
import { IncomingMessage } from 'http';

declare global {
  namespace Express {
    interface Request extends IncomingMessage {
      rawBody?: string;
    }
  }
}
