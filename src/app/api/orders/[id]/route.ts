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

// استخدمنا context: any عشان نتفادى أخطاء الـ TypeScript بين إصدارات Next.js
export async function PATCH(request: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    // الطريقة دي آمنة 100% سواء كنت بتستخدم Next.js 14 أو 15
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "رقم الطلب مفقود" }, { status: 400 });
    }

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