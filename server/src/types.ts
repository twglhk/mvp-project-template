export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "data"; payload: unknown }
  | { type: "done" }
  | { type: "error"; message: string };
