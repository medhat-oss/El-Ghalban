// ============================================================
// El-Ghalban | الغلبان — Global Type Definitions
// ============================================================

// ─── Prisma-derived types (augmented for frontend use) ──────

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  icon?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description?: string | null;
  descriptionAr?: string | null;
  price: number;
  oldPrice?: number | null;
  images: { id: string; url: string; isMain: boolean; publicId?: string | null }[];
  isAvailable: boolean;
  isFeatured: boolean;
  stock: number;
  brand?: string | null;
  model?: string | null;
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductWithCategory = Product & {
  category: Category;
};

// ─── Cart Types ─────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  quantity: number;
  categorySlug: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// ─── Checkout Types ──────────────────────────────────────────

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface OrderPayload {
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

// ─── API Response Types ──────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filter Types ────────────────────────────────────────────

export interface ProductFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  categorySlug?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "featured";
}

// ─── Admin Form Types ────────────────────────────────────────

export interface ProductFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  oldPrice?: number;
  images: { id?: string; url: string; isMain: boolean; publicId?: string | null }[];
  isAvailable: boolean;
  isFeatured: boolean;
  stock: number;
  brand: string;
  model: string;
  categoryId: string;
}

// ─── Next Auth augmentation ──────────────────────────────────

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
