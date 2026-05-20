// ============================================================
// El-Ghalban | app/api/products/route.ts
// GET  — list products (with optional filters)
// POST — create a new product (admin only)
// ============================================================
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ─── Validation schema ──────────────────────────────────────
const createProductSchema = z.object({
  name:          z.string().min(1, "Name is required"),
  nameAr:        z.string().min(1, "Arabic name is required"),
  description:   z.string().optional(),
  descriptionAr: z.string().optional(),
  price:         z.number().positive("Price must be positive"),
  oldPrice:      z.number().positive().optional().nullable(),
  images:        z.array(
    z.object({
      url: z.string().url(),
      isMain: z.boolean().default(false),
      publicId: z.string().optional().nullable(),
    })
  ).min(1, "At least one image is required"),
  isAvailable:   z.boolean().default(true),
  isFeatured:    z.boolean().default(false),
  stock:         z.number().int().min(0).default(0),
  brand:         z.string().optional().nullable(),
  model:         z.string().optional().nullable(),
  categoryId:    z.string().min(1, "Category is required"),
});

// ─── GET /api/products ──────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const categorySlug  = searchParams.get("category");
    const brand         = searchParams.get("brand");
    const minPrice      = searchParams.get("minPrice");
    const maxPrice      = searchParams.get("maxPrice");
    const isFeatured    = searchParams.get("featured") === "true";
    const isAvailable   = searchParams.get("available") !== "false"; // default true
    const sortBy        = searchParams.get("sort") ?? "newest";
    const page          = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize      = Math.min(50, parseInt(searchParams.get("pageSize") ?? "20"));

    // Build where clause
    const where: Record<string, unknown> = { isAvailable };
    if (isFeatured)    where.isFeatured = true;
    if (brand)         where.brand      = brand;
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const orderByMap: Record<string, Record<string, string>> = {
      newest:     { createdAt: "desc" },
      oldest:     { createdAt: "asc" },
      price_asc:  { price: "asc" },
      price_desc: { price: "desc" },
      featured:   { isFeatured: "desc" },
    };
    const orderBy = orderByMap[sortBy] ?? { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: true },
        orderBy,
        skip:  (page - 1) * pageSize,
        take:  pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { success: false, error: "فشل في جلب المنتجات" },
      { status: 500 }
    );
  }
}

// ─── POST /api/products ──────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Auth guard — admin only
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بهذا الإجراء" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createProductSchema.parse(body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validated.categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "الفئة المحددة غير موجودة" },
        { status: 400 }
      );
    }

    const { images, ...productData } = validated;

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((img, idx) => ({
            url: img.url,
            isMain: idx === 0,
            publicId: img.publicId,
          })),
        },
      },
      include: { category: true, images: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "بيانات غير صحيحة", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[POST /api/products]", error);
    return NextResponse.json(
      { success: false, error: "فشل في إضافة المنتج" },
      { status: 500 }
    );
  }
}
