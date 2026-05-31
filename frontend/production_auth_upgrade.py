import os
from pathlib import Path

BASE = Path("src/app/api")

LOGIN = BASE / "login/route.ts"
SIGNUP = BASE / "signup/route.ts"

login_code = """
import { NextResponse } from "next/server";

const USERS = new Map();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const user = USERS.get(email);

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token: "dev-token-" + Date.now()
    });

  } catch (e) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Login API alive" });
}
"""

signup_code = """
import { NextResponse } from "next/server";

const USERS = globalThis.__USERS__ || (globalThis.__USERS__ = new Map());

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    if (USERS.has(email)) {
      return NextResponse.json({ success: false, message: "User exists" }, { status: 409 });
    }

    USERS.set(email, { email, password });

    return NextResponse.json({
      success: true,
      message: "Signup successful"
    });

  } catch (e) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Signup API alive" });
}
"""

def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip())
    print("UPDATED:", path)

def main():
    write(LOGIN, login_code)
    write(SIGNUP, signup_code)
    print("\nDONE: production auth upgraded")

if __name__ == "__main__":
    main()
