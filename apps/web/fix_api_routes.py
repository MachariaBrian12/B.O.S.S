from pathlib import Path

ROOT = Path("src")

REPLACEMENTS = {
    "/api/auth/login": "/api/login",
    "/api/auth/signup": "/api/signup",
}

changed = []

for file in ROOT.rglob("*"):
    if file.suffix in [".ts", ".tsx", ".js", ".jsx"]:
        try:
            text = file.read_text()

            new_text = text
            for k, v in REPLACEMENTS.items():
                new_text = new_text.replace(k, v)

            if new_text != text:
                file.write_text(new_text)
                changed.append(str(file))

        except Exception as e:
            print("Error:", file, e)

print("\nDONE")
print("Modified files:")
for c in changed:
    print("-", c)
