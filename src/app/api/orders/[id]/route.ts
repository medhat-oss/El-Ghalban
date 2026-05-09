import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const updateSchema = z.object({
  status: z.enum(validStatuses),
});

export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id || id === '[id]') {
      return NextResponse.json({ success: false, error: "ID مفقود أو غير صالح" }, { status: 400 });
    }

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