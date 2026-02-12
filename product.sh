# Folder untuk Produk
mkdir -p src/app/dashboard/products
mkdir -p src/components/products

# File Utama
touch src/app/dashboard/products/page.tsx
touch src/app/dashboard/products/ProductClient.tsx

# Komponen Pendukung
touch src/components/products/ProductTable.tsx
touch src/components/products/ProductModal.tsx
touch src/components/products/VariantManager.tsx

# Types
touch src/types/product.ts

echo "Struktur modul Produk dan Varian berhasil dibuat!"