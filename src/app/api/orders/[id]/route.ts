import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// أهم سطرين لـ Vercel
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const updateSchema = z.object({
  status: z.enum(validStatuses),
});

// استخدمنا context بالـ type الصحيح لـ Next.js 15
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // تأكد إننا بننتظر الـ params لأنها في النسخ الجديدة بقت Promise
    const params = await context.params;
    const id = params.id;

    if (!id || id === '[id]') {
      return NextResponse.json({ success: false, error: "ID مفقود أو غير صالح" }, { status: 400 });
    }

    // Execution guard: Don't run Prisma if it's a build worker probe
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ success: true, message: "Build probe skipped" });
    }

    // التحقق من الأدمن
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateSchema.parse(body);

    const order = await prisma.order.update({
      where: { id: id },
      data: { status: validated.status }
    });

    return NextResponse.json({ success: true, data: order });

  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json({ success: false, error: "فشل التحديث" }, { status: 500 });
  }
}

// ضيف الدالة دي كـ "تمويه" لـ Next.js عشان يتأكد إن المسار ديناميكي
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!id || id === '[id]' || process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ message: "API is Dynamic - build probe skipped" });
    }
    return NextResponse.json({ message: "API is Dynamic", id });
  } catch {
    return NextResponse.json({ message: "API is Dynamic" });
  }
}