import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ========================
  // ADMIN USER
  // ========================

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@keycaps.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!Dev';
  const adminHash = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: adminHash,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  console.log(`✅ Admin user: ${adminEmail}`);

  // ========================
  // CATEGORIAS
  // ========================

  const teclados = await prisma.category.upsert({
    where: { slug: 'teclados' },
    update: {},
    create: {
      name: 'Teclados',
      slug: 'teclados',
    },
  });

  const mecanicos = await prisma.category.upsert({
    where: { slug: 'teclados-mecanicos' },
    update: {},
    create: {
      name: 'Teclados Mecânicos',
      slug: 'teclados-mecanicos',
      parentId: teclados.id,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'rgb' },
    update: {},
    create: {
      name: 'RGB',
      slug: 'rgb',
      parentId: teclados.id,
    },
  });

  // ========================
  // PRODUTOS
  // ========================

  const products = [
    {
      name: 'Teclado Mecânico RGB Red Switch',
      slug: 'teclado-mecanico-red',
      basePrice: 299.9,
      sku: 'KB-RED-001',
      specs: { switch: 'Red', layout: 'ABNT2', rgb: true, size: 'Full Size' },
    },
    {
      name: 'Teclado Mecânico Blue Switch',
      slug: 'teclado-mecanico-blue',
      basePrice: 259.9,
      sku: 'KB-BLUE-001',
      specs: { switch: 'Blue', layout: 'ABNT2', rgb: false, size: 'TKL' },
    },
    {
      name: 'Teclado Gamer 60% RGB',
      slug: 'teclado-60-rgb',
      basePrice: 199.9,
      sku: 'KB-60-RGB-001',
      specs: { switch: 'Red', layout: '60%', rgb: true, size: '60%' },
    },
    {
      name: 'Teclado Mecânico Wireless',
      slug: 'teclado-wireless',
      basePrice: 349.9,
      sku: 'KB-WL-001',
      specs: { switch: 'Brown', layout: 'ABNT2', rgb: true, wireless: true },
    },
    {
      name: 'Teclado Básico Membrana',
      slug: 'teclado-membrana',
      basePrice: 89.9,
      sku: 'KB-MEMB-001',
      specs: { type: 'membrana', layout: 'ABNT2', rgb: false },
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        basePrice: product.basePrice,
      },
      create: {
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
        sku: product.sku,
        specs: product.specs,
        categoryId: mecanicos.id,
      },
    });

    // Criar variante padrão para cada produto
    const variantSku = `${product.sku}-DEFAULT`;
    await prisma.productVariant.upsert({
      where: { sku: variantSku },
      update: {
        stockQty: 10,
      },
      create: {
        productId: created.id,
        name: `${product.name} — Padrão`,
        sku: variantSku,
        stockQty: 10,
        price: product.basePrice,
        switchType: product.specs.switch ?? null,
        layout: product.specs.layout ?? null,
      },
    });

    // Criar imagem placeholder
    await prisma.image.upsert({
      where: { id: `img-${product.slug}` },
      update: { url: '/images/product-placeholder.svg', altText: product.name },
      create: {
        id: `img-${product.slug}`,
        productId: created.id,
        url: '/images/product-placeholder.svg',
        altText: product.name,
        category: 'PRODUCT',
        isPrimary: true,
        sortOrder: 0,
      },
    });
  }

  console.log('✅ Seed finalizado!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
