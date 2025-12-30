import type { Request } from "express";
export interface fnRequestWithClaim extends Request {
  claim?: any;
}
