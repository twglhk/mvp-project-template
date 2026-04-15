import { Hono } from "hono";
import { getSupabase } from "../services/supabase.js";

export const leads = new Hono();

leads.post("/", async (c) => {
  const { email, projectSlug } = await c.req.json<{
    email: string;
    projectSlug: string;
  }>();

  if (!email) {
    return c.json({ error: "email is required" }, 400);
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("leads").insert({
    email,
    landing_page_id: projectSlug || "default",
  });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ status: "ok" });
});
