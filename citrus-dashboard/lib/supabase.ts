import * as SupaBase from "@supabase/supabase-js"

const supabase = SupaBase.createClient(
  process.env.NEXT_PUBLIC_DATABASE_URL!,
  process.env.NEXT_PUBLIC_API_KEY!
)

export default supabase
