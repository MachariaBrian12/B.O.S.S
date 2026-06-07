import os

# 1. Fix supabase client (single source of truth)
supabase_client = """import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
"""

# write supabase client
os.makedirs("src/lib", exist_ok=True)
with open("src/lib/supabase.ts", "w") as f:
    f.write(supabase_client)

print("FIXED: src/lib/supabase.ts")


# 2. Patch API routes (remove duplicate createClient usage)
files = [
    "src/app/api/login/route.ts",
    "src/app/api/signup/route.ts"
]

for file in files:
    if not os.path.exists(file):
        print(f"MISSING: {file}")
        continue

    with open(file, "r") as f:
        content = f.read()

    # remove any direct supabase-js createClient usage
    content = content.replace('import { createClient } from "@supabase/supabase-js";', "")
    content = content.replace("import { createClient } from '@supabase/supabase-js'", "")

    # ensure import from lib exists
    if "from '@/lib/supabase'" not in content:
        content = "import { supabase } from '@/lib/supabase'\n" + content

    # remove accidental createClient lines
    lines = content.split("\n")
    cleaned = []
    for line in lines:
        if "createClient" in line and "supabase" not in line:
            continue
        cleaned.append(line)

    with open(file, "w") as f:
        f.write("\n".join(cleaned))

    print(f"FIXED: {file}")


print("\nDONE: Supabase architecture cleaned (single client + patched routes)")
