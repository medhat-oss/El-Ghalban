// ============================================================
// El-Ghalban | app/api/orders/[id]/route.ts — PATCH order status
// ============================================================

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const updateSchema = z.object({
  status: z.enum(validStatuses),
});

export async function PATCH(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // ── Auth Guard ─────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    // استخراج الـ ID والتأكد منه (مهم جداً للـ Build)
    const { id } = params;
    if (!id) {
        return NextResponse.json({ success: false, error: "رقم الطلب مفقود" }, { status: 400 });
    }

    // ── Parse & Validate Body ──────────────────────────────
    const body      = await request.json();
    const validated = updateSchema.parse(body);

    // ── Database Update ────────────────────────────────────
    const order = await prisma.order.update({ 
      where: { id: id }, 
      data: { status: validated.status } 
    });

    return NextResponse.json({ success: true, data: order });

  } catch (error) {
    console.error("[PATCH /api/orders/[id]] Error:", error);
    
    if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: "حالة الطلب غير صحيحة" }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: "فشل تحديث حالة الطلب" }, { status: 500 });
  }
}

// ضفنا GET هنا فاضية عشان نضمن إن الـ Route ده دائماً يترد عليه لو Vercel حاول يفحصه
export async function GET() {
    return NextResponse.json({ message: "Order API is active" });
}