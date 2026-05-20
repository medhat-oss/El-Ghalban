// ============================================================
// El-Ghalban | app/api/products/[id]/route.ts
// GET    — single product
// PATCH  — update product (admin)
// DELETE — delete product (admin)
// ============================================================
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Partial update schema
const updateProductSchema = z.object({
  name:          z.string().min(1).optional(),
  nameAr:        z.string().min(1).optional(),
  description:   z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  price:         z.number().positive().optional(),
  oldPrice:      z.number().positive().optional().nullable(),
  images:        z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().url(),
      isMain: z.boolean().default(false),
      publicId: z.string().optional().nullable(),
    })
  ).optional(),
  isAvailable:   z.boolean().optional(),
  isFeatured:    z.boolean().optional(),
  stock:         z.number().int().min(0).optional(),
  brand:         z.string().optional().nullable(),
  model:         z.string().optional().nullable(),
  categoryId:    z.string().optional(),
});

// ─── GET /api/products/[id] ─────────────────────────────────
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const product = await prisma.product.findUnique({
      where:   { id: params.id },
      include: { category: true, images: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[GET /api/products/:id]", error);
    return NextResponse.json(
      { success: false, error: "فشل في جلب المنتج" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/products/[id] ───────────────────────────────
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بهذا الإجراء" },
        { status: 401 }
      );
    }

    // Check product exists
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    const body      = await request.json();
    const validated = updateProductSchema.parse(body);

    // If categoryId provided, verify it exists
    if (validated.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: validated.categoryId } });
      if (!category) {
        return NextResponse.json(
          { success: false, error: "الفئة المحددة غير موجودة" },
          { status: 400 }
        );
      }
    }

    const { images, ...productData } = validated;
    
    const updateData: any = { ...productData };
    if (images) {
      updateData.images = {
        deleteMany: {}, // Simplest way to update images: delete old ones and recreate
        create: images.map((img, idx) => ({
          url: img.url,
          isMain: idx === 0,
          publicId: img.publicId,
        }))
      };
    }

    const updated = await prisma.product.update({
      where:   { id: params.id },
      data:    updateData,
      include: { category: true, images: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "بيانات غير صحيحة", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[PATCH /api/products/:id]", error);
    return NextResponse.json(
      { success: false, error: "فشل في تحديث المنتج" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/products/[id] ──────────────────────────────
export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بهذا الإجراء" },
        { status: 401 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("[DELETE /api/products/:id]", error);
    return NextResponse.json(
      { success: false, error: "فشل في حذف المنتج" },
      { status: 500 }
    );
  }
}
