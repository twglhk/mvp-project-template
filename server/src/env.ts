function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

function optional(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback;
}

export const env = {
  port: parseInt(process.env.PORT || "3001", 10),

  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  resendApiKey: optional("RESEND_API_KEY"),
  resendFrom: optional("RESEND_FROM_EMAIL", "noreply@example.com"),

  corsOrigins: (
    optional("CORS_ORIGINS") || "http://localhost:3000"
  ).split(","),
} as const;
