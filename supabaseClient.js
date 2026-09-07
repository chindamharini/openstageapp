import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    "Supabase credentials are missing. Copy .env.example to .env and fill in your project's URL and anon key."
  );
}

export const supabase = createClient(url, key);
