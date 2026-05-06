import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// إجبار السيرفر على جعل المسار ديناميكي وعدم الكاش
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const updateSchema = z.object({
  status: z.enum(validStatuses),
});

// لاحظ التغيير هنا: params أصبحت Promise
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    // هنا السر: لازم نعمل await للـ params في Next.js 15
    const params = await props.params;
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