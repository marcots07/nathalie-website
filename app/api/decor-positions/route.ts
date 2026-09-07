import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const FILE_PATH = path.join(process.cwd(), "content/decor/positions.json");

type UpdateBody = {
  id?: string;
  top?: number;
  left?: number;
  width?: number;
  rotate?: number;
};

/**
 * Persists one flower's dragged position back to
 * `content/decor/positions.json` on disk. This only makes sense against a
 * writable local filesystem, so it's hard-gated to development — in a
 * production build (or any deploy) this always 403s, both because the
 * editor UI itself never renders there (see DecorEditor) and as a second
 * independent guard in case this route is ever hit directly.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { ok: false, error: "Decor editing is only available in local development." },
      { status: 403 }
    );
  }

  let body: UpdateBody;
  try {
    body = (await req.json()) as UpdateBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { id, top, left, width, rotate } = body;
  if (
    !id ||
    typeof top !== "number" ||
    typeof left !== "number" ||
    typeof width !== "number" ||
    typeof rotate !== "number"
  ) {
    return NextResponse.json({ ok: false, error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data[id] || typeof data[id] !== "object") {
      return NextResponse.json({ ok: false, error: `Unknown decor id "${id}"` }, { status: 404 });
    }
    data[id] = { ...(data[id] as object), top, left, width, rotate };
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Write failed" },
      { status: 500 }
    );
  }
}
