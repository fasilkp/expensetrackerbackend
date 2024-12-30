// src/common/interfaces/extended-request.interface.ts

import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: { id: string; name: string }; // Add custom properties here
}
