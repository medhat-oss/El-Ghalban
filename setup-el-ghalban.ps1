# ============================================================
# El-Ghalban Setup Script (PowerShell)
# Run from D:\ as:  .\setup-el-ghalban.ps1
# ============================================================

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  الغلبان — El-Ghalban Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Create project with Next.js 14 ─────────────────
Write-Host "[1/6] Creating Next.js 14 project..." -ForegroundColor Yellow
npx create-next-app@14 El_Ghalban `
  --typescript `
  --tailwind `
  --eslint `
  --app `
  --src-dir `
  --import-alias "@/*" `
  --no-git

Set-Location D:\El_Ghalban

# ── Step 2: Install all dependencies ───────────────────────
Write-Host ""
Write-Host "[2/6] Installing dependencies..." -ForegroundColor Yellow

npm install `
  @prisma/client `
  bcryptjs `
  cloudinary `
  framer-motion `
  lucide-react `
  next-auth `
  next-cloudinary `
  react-hot-toast `
  sharp `
  swiper `
  zod

npm install -D `
  @types/bcryptjs `
  prisma `
  tsx

Write-Host "Dependencies installed." -ForegroundColor Green

# ── Step 3: Init Prisma ─────────────────────────────────────
Write-Host ""
Write-Host "[3/6] Initialising Prisma..." -ForegroundColor Yellow
npx prisma init --datasource-provider postgresql
Write-Host "Prisma initialised." -ForegroundColor Green

# ── Step 4: Create .env.local from example ─────────────────
Write-Host ""
Write-Host "[4/6] Creating .env.local template..." -ForegroundColor Yellow

$envContent = @"
# ── Database (PostgreSQL — Supabase / Neon) ─────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

# ── NextAuth ─────────────────────────────────────────────────
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET="REPLACE_WITH_SECURE_RANDOM_STRING"
NEXTAUTH_URL="http://localhost:3000"

# ── Admin Credentials ────────────────────────────────────────
# Generate hash: node -e "const b=require('bcryptjs');console.log(b.hashSync('YOUR_PASSWORD',12))"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="`$2a`$12`$REPLACE_WITH_BCRYPT_HASH"

# ── Cloudinary ───────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="el_ghalban_products"

# ── Store Config ─────────────────────────────────────────────
NEXT_PUBLIC_STORE_WHATSAPP="201XXXXXXXXX"
NEXT_PUBLIC_STORE_NAME="الغلبان للموبايلات والإكسسوارات"
NEXT_PUBLIC_STORE_EMAIL="info@elghalban.com"
NEXT_PUBLIC_STORE_ADDRESS="بنها، القليوبية — شارع فريد نادي"
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host ".env.local created. Fill in your values before running the app." -ForegroundColor Green

# ── Step 5: Remind user to copy source files ─────────────────
Write-Host ""
Write-Host "[5/6] MANUAL STEP REQUIRED:" -ForegroundColor Magenta
Write-Host "  Copy all source files from the provided archive into D:\El_Ghalban\src\" -ForegroundColor White
Write-Host "  Also copy: prisma\schema.prisma, tailwind.config.ts, next.config.ts" -ForegroundColor White
Write-Host ""

# ── Step 6: Instructions ────────────────────────────────────
Write-Host "[6/6] Next steps after filling .env.local:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Generate Prisma client:" -ForegroundColor White
Write-Host "     npx prisma generate" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Push schema to database:" -ForegroundColor White
Write-Host "     npx prisma db push" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Seed the database:" -ForegroundColor White
Write-Host "     npm run db:seed" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. Generate bcrypt hash for admin password:" -ForegroundColor White
Write-Host "     node -e `"const b=require('bcryptjs');console.log(b.hashSync('YOUR_PASSWORD',12))`"" -ForegroundColor Cyan
Write-Host "     Then paste the hash into ADMIN_PASSWORD_HASH in .env.local" -ForegroundColor White
Write-Host ""
Write-Host "  5. Start dev server:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Setup complete! Visit http://localhost:3000" -ForegroundColor Green
Write-Host "  Admin panel: http://localhost:3000/admin" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
