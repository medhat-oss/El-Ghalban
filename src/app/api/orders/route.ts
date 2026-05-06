// ============================================================
// El-Ghalban | app/api/orders/route.ts
// POST — save a new order record when WhatsApp checkout fires
// GET  — list orders (admin only)
// ============================================================
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cartItemSchema = z.object({
  id:           z.string(),
  name:         z.string(),
  nameAr:       z.string(),
  price:        z.number(),
  image:        z.string(),
  quantity:     z.number().int().positive(),
  categorySlug: z.string(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  phone:        z.string().min(8),
  address:      z.string().min(1),
  city:         z.string().optional(),
  notes:        z.string().optional(),
  items:        z.array(cartItemSchema).min(1),
  subtotal:     z.number().positive(),
  deliveryFee:  z.number().min(0).default(0),
  total:        z.number().positive(),
});

// ─── POST /api/orders ───────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body      = await request.json();
    const validated = createOrderSchema.parse(body);

    const order = await prisma.order.create({
      data: {
        customerName:    validated.customerName,
        phone:           validated.phone,
        address:         validated.address,
        city:            validated.city,
        notes:           validated.notes,
        items:           validated.items,
        subtotal:        validated.subtotal,
        deliveryFee:     validated.deliveryFee,
        total:           validated.total,
        paymentMethod:   "CASH_ON_DELIVERY",
        sentViaWhatsApp: true,
      },
    });

    return NextResponse.json({ success: true, data: { id: order.id, orderNumber: order.orderNumber } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "بيانات الطلب غير مكتملة", details: error.errors }, { status: 400 });
    }
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ success: false, error: "فشل في حفظ الطلب" }, { status: 500 });
  }
}

// ─── GET /api/orders (admin) ────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? "20"));
    const status   = searchParams.get("status");

    const where = status ? { status: status as never } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ success: false, error: "فشل في جلب الطلبات" }, { status: 500 });
  }
}
