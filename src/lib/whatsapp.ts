// ============================================================
// El-Ghalban | lib/whatsapp.ts — WhatsApp Checkout Utility
// Generates formatted Arabic order messages for wa.me API
// ============================================================

import type { CartItem, CustomerInfo } from "@/types";

/** Delivery fee in EGP — 0 means free delivery */
export const DELIVERY_FEE = 0;

/**
 * Formats a number as Egyptian Pounds with Arabic-friendly formatting.
 */
function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} ج.م`;
}

/**
 * Returns the current Arabic-formatted date/time string.
 */
function getArabicDateTime(): string {
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  }).format(new Date());
}

/**
 * Generates a unique short order reference number.
 */
function generateOrderRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `EG-${timestamp}-${random}`;
}

export interface WhatsAppOrderData {
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/**
 * Builds a formatted Arabic WhatsApp message from order data.
 */
export function buildOrderMessage(data: WhatsAppOrderData): string {
  const { customer, items, subtotal, deliveryFee, total } = data;
  const orderRef = generateOrderRef();
  const dateTime = getArabicDateTime();

  const divider = "─────────────────────";

  // Build items list
  const itemsList = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.nameAr}\n` +
        `   الكمية: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const message = [
    "🛍️ *طلب جديد — الغلبان للموبايلات*",
    divider,
    `📋 رقم الطلب: *${orderRef}*`,
    `📅 التاريخ: ${dateTime}`,
    divider,
    "👤 *بيانات العميل*",
    `• الاسم: ${customer.name}`,
    `• الهاتف: ${customer.phone}`,
    `• العنوان: ${customer.address}`,
    customer.city ? `• المدينة: ${customer.city}` : "",
    customer.notes ? `• ملاحظات: ${customer.notes}` : "",
    divider,
    "📦 *المنتجات المطلوبة*",
    itemsList,
    divider,
    "💰 *ملخص الطلب*",
    `• المجموع الفرعي: ${formatPrice(subtotal)}`,
    `• رسوم التوصيل: ${deliveryFee === 0 ? "مجاني 🎁" : formatPrice(deliveryFee)}`,
    `• *الإجمالي: ${formatPrice(total)}*`,
    divider,
    "💳 *طريقة الدفع: الدفع عند الاستلام (كاش)*",
    divider,
    "شكراً لتسوقك مع الغلبان! ✨",
    "سيتم التواصل معك في أقرب وقت لتأكيد الطلب.",
  ]
    .filter(Boolean) // Remove empty strings (optional fields)
    .join("\n");

  return message;
}

/**
 * Generates the wa.me redirect URL with the encoded order message.
 * @param data  - order data
 * @param phone - store WhatsApp number (with country code, no + or spaces)
 */
export function generateWhatsAppUrl(
  data: WhatsAppOrderData,
  phone?: string
): string {
  const storePhone =
    phone || process.env.NEXT_PUBLIC_STORE_WHATSAPP || "201000000000";

  const message = buildOrderMessage(data);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${storePhone}?text=${encodedMessage}`;
}
