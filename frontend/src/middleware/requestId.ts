import { v4 as uuidv4 } from "uuid";

export function getRequestId(req: Request) {
  return req.headers.get("x-request-id") || uuidv4();
}
