// ============================================================
// El-Ghalban | app/api/upload/route.ts
// POST — Upload image to Cloudinary (admin only)
// Accepts: multipart/form-data with "file" field
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE   = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES   = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    // ── Auth Guard ─────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك برفع الصور" },
        { status: 401 }
      );
    }

    // ── Parse Form Data ────────────────────────────────────
    const formData = await request.formData();
    const file     = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "لم يتم اختيار ملف" },
        { status: 400 }
      );
    }

    // ── Validations ────────────────────────────────────────
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "نوع الملف غير مدعوم. استخدم JPEG, PNG, أو WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "حجم الملف كبير جداً (الحد الأقصى 10 ميجا)" },
        { status: 400 }
      );
    }

    // ── Convert to base64 ─────────────────────────────────
    const bytes    = await file.arrayBuffer();
    const buffer   = Buffer.from(bytes);
    const base64   = buffer.toString("base64");
    const dataUri  = `data:${file.type};base64,${base64}`;

    // ── Upload to Cloudinary ──────────────────────────────
    const result = await uploadToCloudinary(dataUri, "el-ghalban/products");

    return NextResponse.json({
      success:    true,
      url:        result.secure_url,
      public_id:  result.public_id,
      width:      result.width,
      height:     result.height,
      format:     result.format,
      bytes:      result.bytes,
    });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json(
      { success: false, error: "فشل في رفع الصورة. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

// Cloudinary uploads can be large — increase body size limit
export const config = {
  api: { bodyParser: false },
};
