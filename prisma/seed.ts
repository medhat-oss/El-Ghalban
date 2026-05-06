// ============================================================
// El-Ghalban | prisma/seed.ts — Database Seeder
// Run with: npm run db:seed
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding El-Ghalban database...\n");

  // ── Upsert Categories ──────────────────────────────────────
  const mobilesCategory = await prisma.category.upsert({
    where:  { slug: "mobiles" },
    update: {},
    create: {
      name:   "Mobiles",
      nameAr: "موبايلات",
      slug:   "mobiles",
      icon:   "📱",
    },
  });
  console.log(`✅ Category: ${mobilesCategory.nameAr} (${mobilesCategory.slug})`);

  const accessoriesCategory = await prisma.category.upsert({
    where:  { slug: "accessories" },
    update: {},
    create: {
      name:   "Accessories",
      nameAr: "إكسسوارات",
      slug:   "accessories",
      icon:   "🎧",
    },
  });
  console.log(`✅ Category: ${accessoriesCategory.nameAr} (${accessoriesCategory.slug})`);

  // ── Sample Mobile Products ─────────────────────────────────
  const mobileProducts = [
    {
      name:          "iPhone 15 Pro Max",
      nameAr:        "آيفون 15 برو ماكس",
      description:   "Apple's flagship iPhone with A17 Pro chip and titanium design.",
      descriptionAr: "هاتف أبل الرائد بمعالج A17 Pro وتصميم من التيتانيوم — كاميرا 48 ميجابكسل.",
      price:         45999,
      oldPrice:      49999,
      images:        [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      ],
      isAvailable:   true,
      isFeatured:    true,
      stock:         15,
      brand:         "Apple",
      model:         "A3293",
    },
    {
      name:          "Samsung Galaxy S24 Ultra",
      nameAr:        "سامسونج جالاكسي S24 الترا",
      description:   "Samsung's ultimate smartphone with S Pen and 200MP camera.",
      descriptionAr: "هاتف سامسونج الأقوى بقلم S Pen وكاميرا 200 ميجابكسل وشاشة AMOLED 6.8 بوصة.",
      price:         38999,
      oldPrice:      42000,
      images:        [
        "https://images.unsplash.com/photo-1707192576161-f4b680c2a4a1?w=800&q=80",
      ],
      isAvailable:   true,
      isFeatured:    true,
      stock:         22,
      brand:         "Samsung",
      model:         "SM-S928B",
    },
    {
      name:          "Xiaomi 14 Pro",
      nameAr:        "شاومي 14 برو",
      description:   "Xiaomi flagship with Leica optics and Snapdragon 8 Gen 3.",
      descriptionAr: "هاتف شاومي الرائد بكاميرا Leica ومعالج Snapdragon 8 Gen 3 وشحن 120W.",
      price:         24999,
      images:        [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      ],
      isAvailable:   true,
      isFeatured:    false,
      stock:         18,
      brand:         "Xiaomi",
      model:         "23116PN5BC",
    },
    {
      name:          "OPPO Reno 11 Pro",
      nameAr:        "أوبو رينو 11 برو",
      description:   "OPPO Reno 11 Pro with impressive portrait camera and sleek design.",
      descriptionAr: "أوبو رينو 11 برو بكاميرا بورتريه رائعة وتصميم أنيق وشحن سريع 80W.",
      price:         14999,
      oldPrice:      16500,
      images:        [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      ],
      isAvailable:   true,
      isFeatured:    true,
      stock:         30,
      brand:         "Oppo",
      model:         "CPH2599",
    },
    {
      name:          "Vivo V30 Pro",
      nameAr:        "فيفو V30 برو",
      description:   "Vivo V30 Pro with ZEISS optics and 5000mAh battery.",
      descriptionAr: "فيفو V30 برو بكاميرا ZEISS وبطارية 5000 مللي أمبير وشاشة AMOLED منحنية.",
      price:         12999,
      images:        [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
      ],
      isAvailable:   true,
      isFeatured:    false,
      stock:         25,
      brand:         "Vivo",
      model:         "V2309",
    },
    {
      name:          "Tecno Spark 20 Pro",
      nameAr:        "تيكنو سبارك 20 برو",
      description:   "Budget-friendly Tecno Spark with 108MP camera.",
      descriptionAr: "هاتف تيكنو سبارك 20 برو بكاميرا 108 ميجابكسل وبطارية 5000 مللي أمبير بسعر مناسب.",
      price:         5499,
      oldPrice:      6000,
      images:        [
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
      ],
      isAvailable:   true,
      isFeatured:    false,
      stock:         50,
      brand:         "Tecno",
      model:         "KI7",
    },
  ];

  for (const product of mobileProducts) {
    const created = await prisma.product.upsert({
      where:  { id: `seed-mobile-${product.model}` },
      update: { ...product, categoryId: mobilesCategory.id },
      create: { id: `seed-mobile-${product.model}`, ...product, categoryId: mobilesCategory.id },
    });
    console.log(`  📱 ${created.nameAr}`);
  }

  // ── Sample Accessory Products ──────────────────────────────
  const accessoryProducts = [
    {
      name:          "Apple AirPods Pro 2nd Gen",
      nameAr:        "آبل إيربودز برو الجيل الثاني",
      description:   "Industry-leading noise cancellation with adaptive audio.",
      descriptionAr: "أفضل سماعات لاسلكية في العالم مع إلغاء الضوضاء النشط والصوت المكاني.",
      price:         5999,
      oldPrice:      6999,
      images:        ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80"],
      isAvailable:   true,
      isFeatured:    true,
      stock:         40,
      brand:         "سماعات",
      model:         "MTJV3",
    },
    {
      name:          "Anker 65W GaN Charger",
      nameAr:        "شاحن أنكر 65 واط GaN",
      description:   "Compact 65W GaN wall charger with PowerIQ 4.0.",
      descriptionAr: "شاحن أنكر المدمج 65 واط بتقنية GaN ومنفذ USB-C يشحن لابتوب، تابلت، وموبايل.",
      price:         649,
      images:        ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80"],
      isAvailable:   true,
      isFeatured:    false,
      stock:         100,
      brand:         "شواحن",
      model:         "A2667",
    },
    {
      name:          "Baseus 20000mAh Power Bank",
      nameAr:        "باور بانك باسيوس 20000 مللي أمبير",
      description:   "20000mAh slim power bank with 65W PD fast charging.",
      descriptionAr: "باور بانك باسيوس رفيع 20000 مللي أمبير مع شحن سريع 65W PD يشحن لابتوب وموبايل.",
      price:         1299,
      oldPrice:      1599,
      images:        ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80"],
      isAvailable:   true,
      isFeatured:    true,
      stock:         60,
      brand:         "باور بانك",
      model:         "PPBD050601",
    },
    {
      name:          "Samsung Galaxy Buds2 Pro",
      nameAr:        "سماعات سامسونج جالاكسي بودز2 برو",
      description:   "Hi-Fi 24-bit audio with intelligent ANC.",
      descriptionAr: "سماعات سامسونج لاسلكية بجودة صوت 24 بت وإلغاء ضوضاء ذكي ومقاومة للماء IPX7.",
      price:         3499,
      images:        ["https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80"],
      isAvailable:   true,
      isFeatured:    false,
      stock:         35,
      brand:         "سماعات",
      model:         "SM-R510",
    },
    {
      name:          "Spigen iPhone 15 Case",
      nameAr:        "كفر سبيجن لآيفون 15",
      description:   "Military-grade protection with slim profile.",
      descriptionAr: "كفر سبيجن لآيفون 15 بحماية عسكرية درجة MIL-STD-810G مع تصميم رفيع.",
      price:         299,
      images:        ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80"],
      isAvailable:   true,
      isFeatured:    false,
      stock:         150,
      brand:         "كفرات",
      model:         "ACS06709",
    },
    {
      name:          "Baseus 2m USB-C Cable",
      nameAr:        "كابل باسيوس USB-C مترين",
      description:   "100W fast charge braided USB-C to USB-C cable.",
      descriptionAr: "كابل باسيوس مضفر 100 واط USB-C إلى USB-C بطول 2 متر للشحن السريع ونقل البيانات.",
      price:         149,
      images:        ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
      isAvailable:   true,
      isFeatured:    false,
      stock:         200,
      brand:         "كابلات",
      model:         "CAJY000401",
    },
  ];

  for (const product of accessoryProducts) {
    const created = await prisma.product.upsert({
      where:  { id: `seed-acc-${product.model}` },
      update: { ...product, categoryId: accessoriesCategory.id },
      create: { id: `seed-acc-${product.model}`, ...product, categoryId: accessoriesCategory.id },
    });
    console.log(`  🎧 ${created.nameAr}`);
  }

  console.log("\n✅ Seeding complete! Database is ready.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
