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

    // Crear categorías (las 6 categorías del original)
    const categoriesData = [
      { name: 'Máquinas de Tatuaje', descripcion: 'Máquinas profesionales para tatuaje', activa: true, orden: 1 },
      { name: 'Agujas', descripcion: 'Agujas de diferentes calibre', activa: true, orden: 2 },
      { name: 'Tintas', descripcion: 'Tintas de alta calidad', activa: true, orden: 3 },
      { name: 'Accesorios', descripcion: 'Accesorios y suministros', activa: true, orden: 4 },
      { name: 'Cuidado Posterior', descripcion: 'Productos para el cuidado del tatuaje', activa: true, orden: 5 },
      { name: 'Equipos de Protección', descripcion: 'Guantes, máscaras y equipos de seguridad', activa: true, orden: 6 },
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

    // Crear productos usando todos los del archivo original
    console.log('🎨 Creating products...');
    const productsData = [
      // Máquinas de Tatuaje
      {
        nombre: 'Máquina Rotativa Bishop V6',
        descripcion: 'Máquina rotativa profesional de alta precisión, ideal para líneas y sombras.',
        precio: 850.00,
        stock: 10,
        marca: 'Bishop',
        modelo: 'V6',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Bishop+V6'],
        categoriaId: savedCategories[0].id,
        destacado: true,
        disponible: true,
        sku: 'BV6-001',
      },
      {
        nombre: 'Máquina Bobina Tradicional',
        descripcion: 'Máquina de bobina clásica, perfecta para líneas definidas.',
        precio: 450.00,
        stock: 15,
        marca: 'Classic',
        modelo: 'Coil Pro',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Bobina+Classic'],
        categoriaId: savedCategories[0].id,
        disponible: true,
        sku: 'CC-002',
      },
      {
        nombre: 'Máquina Pen Rotativa',
        descripcion: 'Máquina tipo pen, ergonómica y silenciosa.',
        precio: 650.00,
        stock: 8,
        marca: 'Pen Pro',
        modelo: 'Ergonomic',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Pen+Pro'],
        categoriaId: savedCategories[0].id,
        destacado: true,
        disponible: true,
        sku: 'PP-003',
      },

      // Agujas
      {
        nombre: 'Agujas Round Liner 03RL',
        descripcion: 'Agujas para líneas finas, paquete de 50 unidades.',
        precio: 45.00,
        stock: 100,
        marca: 'ProNeedle',
        modelo: '03RL',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Agujas+03RL'],
        categoriaId: savedCategories[1].id,
        disponible: true,
        sku: 'PN-03RL-50',
      },
      {
        nombre: 'Agujas Round Shader 07RS',
        descripcion: 'Agujas para sombreado, paquete de 50 unidades.',
        precio: 50.00,
        stock: 80,
        marca: 'ProNeedle',
        modelo: '07RS',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Agujas+07RS'],
        categoriaId: savedCategories[1].id,
        disponible: true,
        sku: 'PN-07RS-50',
      },
      {
        nombre: 'Agujas Magnum 09M1',
        descripcion: 'Agujas magnum para relleno, paquete de 50 unidades.',
        precio: 55.00,
        stock: 60,
        marca: 'ProNeedle',
        modelo: '09M1',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Agujas+09M1'],
        categoriaId: savedCategories[1].id,
        destacado: true,
        disponible: true,
        sku: 'PN-09M1-50',
      },

      // Tintas
      {
        nombre: 'Tinta Negra Eternal Ink',
        descripcion: 'Tinta negra premium de 30ml, ideal para líneas y sombras.',
        precio: 7.50,
        stock: 50,
        marca: 'Eternal Ink',
        modelo: 'Black',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Tinta+Negra'],
        categoriaId: savedCategories[2].id,
        destacado: true,
        disponible: true,
        sku: 'EI-BLACK-30',
      },
      {
        nombre: 'Set de Tintas de Colores',
        descripcion: 'Set de 12 colores básicos de 15ml cada uno.',
        precio: 320.00,
        stock: 25,
        marca: 'World Famous',
        modelo: 'Color Set 12',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Set+Colores'],
        categoriaId: savedCategories[2].id,
        destacado: true,
        disponible: true,
        sku: 'WF-SET12-15',
      },
      {
        nombre: 'Tinta Blanca Intenze',
        descripcion: 'Tinta blanca de alta cobertura, 30ml.',
        precio: 8.50,
        stock: 30,
        marca: 'Intenze',
        modelo: 'White',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Tinta+Blanca'],
        categoriaId: savedCategories[2].id,
        disponible: true,
        sku: 'IN-WHITE-30',
      },

      // Accesorios
      {
        nombre: 'Grips Desechables',
        descripcion: 'Grips desechables de diferentes diámetros, paquete de 100.',
        precio: 120.00,
        stock: 40,
        marca: 'Supplies Pro',
        modelo: 'Grip-100',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Grips'],
        categoriaId: savedCategories[3].id,
        disponible: true,
        sku: 'SP-GRIP-100',
      },
      {
        nombre: 'Fuente de Poder Digital',
        descripcion: 'Fuente de poder digital con pantalla LCD.',
        precio: 2800.00,
        stock: 12,
        marca: 'PowerMax',
        modelo: 'Digital LCD',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Fuente+Poder'],
        categoriaId: savedCategories[3].id,
        destacado: true,
        disponible: true,
        sku: 'PM-LCD-001',
      },
      {
        nombre: 'Pedal de Control',
        descripcion: 'Pedal de control ergonómico para máquinas.',
        precio: 950.00,
        stock: 20,
        marca: 'ControlMax',
        modelo: 'Ergonomic',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Pedal'],
        categoriaId: savedCategories[3].id,
        disponible: true,
        sku: 'CM-PEDAL-001',
      },

      // Cuidado Posterior
      {
        nombre: 'Crema Cicatrizante Bepanthen',
        descripcion: 'Crema para el cuidado posterior del tatuaje, 100g.',
        precio: 13.00,
        stock: 150,
        marca: 'Bepanthen',
        modelo: 'Healing Cream',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Bepanthen'],
        categoriaId: savedCategories[4].id,
        disponible: true,
        sku: 'BP-CREAM-100',
      },
      {
        nombre: 'Jabón Antibacterial',
        descripcion: 'Jabón especial para la limpieza de tatuajes recientes.',
        precio: 2.50,
        stock: 200,
        marca: 'CleanCare',
        modelo: 'Antibacterial',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Jabon'],
        categoriaId: savedCategories[4].id,
        disponible: true,
        sku: 'CC-SOAP-001',
      },
      {
        nombre: 'Plastico Protector',
        descripcion: 'Plastico protector transparente para tatuajes.',
        precio: 4.50,
        stock: 80,
        marca: 'ProtectFilm',
        modelo: 'Transparent',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Protector'],
        categoriaId: savedCategories[4].id,
        disponible: true,
        sku: 'PF-TRANS-001',
      },

      // Equipos de Protección
      {
        nombre: 'Guantes de Nitrilo',
        descripcion: 'Guantes de nitrilo sin polvo, caja de 100 unidades.',
        precio: 6.00,
        stock: 100,
        marca: 'SafeHands',
        modelo: 'Nitrile 100',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Guantes'],
        categoriaId: savedCategories[5].id,
        disponible: true,
        sku: 'SH-NIT-100',
      },
      {
        nombre: 'Mascarillas Quirúrgicas',
        descripcion: 'Mascarillas desechables de 3 capas, paquete de 50.',
        precio: 3.50,
        stock: 150,
        marca: 'SafeMask',
        modelo: '3 Layer',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Mascarillas'],
        categoriaId: savedCategories[5].id,
        disponible: true,
        sku: 'SM-3L-50',
      },
      {
        nombre: 'Fundas para Máquinas',
        descripcion: 'Fundas desechables para máquinas de tatuaje, paquete de 100.',
        precio: 5.50,
        stock: 60,
        marca: 'CoverPro',
        modelo: 'Disposable 100',
        imagenes: ['https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Fundas'],
        categoriaId: savedCategories[5].id,
        disponible: true,
        sku: 'CP-DIS-100',
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
