import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Product } from './products/products.entity';
import { Category } from './categories/category.entity';

async function seedTattooProducts() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const dataSource = app.get(DataSource);
    const categoryRepository = dataSource.getRepository(Category);
    const productRepository = dataSource.getRepository(Product);

    console.log('🌱 Starting tattoo products seeding...');

    // Crear categorías
    const categoriesData = [
      { name: 'Máquinas de Tatuaje', descripcion: 'Máquinas profesionales para tatuaje', activa: true, orden: 1 },
      { name: 'Agujas', descripcion: 'Agujas de diferentes calibre', activa: true, orden: 2 },
      { name: 'Tintas', descripcion: 'Tintas de alta calidad', activa: true, orden: 3 },
      { name: 'Accesorios', descripcion: 'Accesorios y suministros', activa: true, orden: 4 },
    ];

    console.log('📁 Creating categories...');
    const savedCategories: Category[] = [];
    for (const categoryData of categoriesData) {
      let category = await categoryRepository.findOne({ where: { name: categoryData.name } });
      if (!category) {
        category = categoryRepository.create(categoryData);
        category = await categoryRepository.save(category);
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⏭️ Category already exists: ${category.name}`);
      }
      savedCategories.push(category);
    }

    // Crear productos
    console.log('🎨 Creating products...');
    const productsData = [
      {
        nombre: 'Máquina Rotativa Bishop V6',
        descripcion: 'Máquina rotativa profesional de alta precisión, ideal para líneas y sombras.',
        precio: 850.00,
        stock: 10,
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Bishop+V6'],
        category_id: savedCategories[0].id,
        destacado: true,
        disponible: true,
        marca: 'Bishop',
        modelo: 'V6',
        sku: 'BV6-001',
      },
      {
        nombre: 'Máquina Bobina Tradicional',
        descripcion: 'Máquina de bobina clásica, perfecta para líneas definidas.',
        precio: 450.00,
        stock: 15,
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Bobina+Classic'],
        category_id: savedCategories[0].id,
        disponible: true,
        marca: 'Classic',
        modelo: 'Coil Pro',
        sku: 'CC-002',
      },
      {
        nombre: 'Agujas Round Liner 3RL',
        descripcion: 'Agujas desechables para líneas finas, caja de 50 unidades.',
        precio: 25.00,
        stock: 100,
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Agujas+3RL'],
        category_id: savedCategories[1].id,
        disponible: true,
        marca: 'ProNeedle',
        modelo: '3RL',
        sku: 'PN-3RL-50',
      },
      {
        nombre: 'Tinta Negra World Famous',
        descripcion: 'Tinta negra de alta calidad, botella de 30ml.',
        precio: 15.00,
        stock: 50,
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Tinta+Negra'],
        category_id: savedCategories[2].id,
        destacado: true,
        disponible: true,
        marca: 'World Famous',
        modelo: 'Black',
        sku: 'WF-BLACK-30',
      },
      {
        nombre: 'Set Tintas de Colores',
        descripcion: 'Set de 12 colores básicos, botellas de 15ml cada una.',
        precio: 120.00,
        stock: 25,
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Set+Colores'],
        category_id: savedCategories[2].id,
        destacado: true,
        disponible: true,
        marca: 'World Famous',
        modelo: 'Color Set 12',
        sku: 'WF-SET12-15',
      },
      {
        nombre: 'Cups Desechables',
        descripcion: 'Vasos desechables para tinta, paquete de 100 unidades.',
        precio: 8.00,
        stock: 200,
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Cups'],
        category_id: savedCategories[3].id,
        disponible: true,
        marca: 'Supplies Pro',
        modelo: 'Cup-100',
        sku: 'SP-CUP-100',
      },
    ];

    // Guardar productos
    for (const productData of productsData) {
      let product = await productRepository.findOne({ where: { nombre: productData.nombre } });
      if (!product) {
        product = productRepository.create(productData);
        await productRepository.save(product);
        console.log(`✅ Created product: ${product.nombre}`);
      } else {
        console.log(`⏭️ Product already exists: ${product.nombre}`);
      }
    }

    console.log('🎨 Tattoo products seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding tattoo products:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar el seeding
seedTattooProducts().catch(console.error);
