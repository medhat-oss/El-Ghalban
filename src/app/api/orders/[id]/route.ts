// El-Ghalban | app/api/orders/[id]/route.ts — PATCH order status

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const validStatuses = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"] as const;

const updateSchema = z.object({
  status: z.enum(validStatuses),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }
    const body      = await request.json();
    const validated = updateSchema.parse(body);
    const order = await prisma.order.update({ where: { id: params.id }, data: { status: validated.status } });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, error: "حالة غير صحيحة" }, { status: 400 });
    return NextResponse.json({ success: false, error: "فشل التحديث" }, { status: 500 });
  }
}
