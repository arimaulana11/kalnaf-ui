# Create directories
mkdir -p src/app/dashboard/categories
mkdir -p src/components/categories

# Create Page and Client Component
touch src/app/dashboard/categories/page.tsx
touch src/app/dashboard/categories/CategoryClient.tsx

# Create Components
touch src/components/categories/CategoryTable.tsx
touch src/components/categories/CategoryModal.tsx

# Create Types
touch src/types/category.ts

echo "Structure for Category module has been created!"