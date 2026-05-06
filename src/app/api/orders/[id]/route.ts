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

// إضافة هذه الدالة تجعل Next.js يتخطى أي محاولة بناء ثابت (Static Generation) لهذا المسار
export async function generateStaticParams() {
  return [];
}

export async function PATCH(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    // انتظر الـ params للتأكد من استقرارها (Next.js 14/15 Requirement)
    const id = params.id;

    const body = await request.json();
    const validated = updateSchema.parse(body);

    const order = await prisma.order.update({ 
      where: { id: id }, 
      data: { status: validated.status } 
    });

    return NextResponse.json({ success: true, data: order });

  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل التحديث" }, { status: 500 });
  }
}

// أضف GET احتياطية فارغة
export async function GET() {
    return NextResponse.json({ status: "active" });
}