import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products/products.entity';
import { Category } from './categories/category.entity';

async function createProducts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productRepository = app.get<Repository<Product>>(getRepositoryToken(Product));
  const categoryRepository = app.get<Repository<Category>>(getRepositoryToken(Category));

  try {
    console.log('🔍 Buscando categorías...');
    
    // Buscar categorías
    const categories = await categoryRepository.find();
    console.log('Categorías encontradas:', categories.map(c => ({ id: c.id, name: c.name })));

    if (categories.length === 0) {
      console.log('❌ No hay categorías. Creando algunas...');
      
      const nuevasCategories = await categoryRepository.save([
        { name: 'Máquinas de Tatuaje', descripcion: 'Máquinas profesionales', activa: true, orden: 1 },
        { name: 'Agujas', descripcion: 'Agujas de calidad', activa: true, orden: 2 },
        { name: 'Tintas', descripcion: 'Tintas profesionales', activa: true, orden: 3 },
        { name: 'Accesorios', descripcion: 'Accesorios varios', activa: true, orden: 4 }
      ]);
      
      console.log('✅ Categorías creadas');
      categories.push(...nuevasCategories);
    }

    // Tomar la primera categoría para prueba
    const primeraCategoria = categories[0];
    
    console.log('🎨 Creando producto de prueba...');
    console.log('Usando categoría:', primeraCategoria.name, 'ID:', primeraCategoria.id);

    // Crear un producto simple
    const productData = {
      nombre: 'Máquina de Prueba Pro',
      descripcion: 'Máquina profesional de alta calidad para todo tipo de trabajos de tatuaje.',
      precio: 599.99,
      stock: 25,
      marca: 'TestBrand',
      modelo: 'Pro 2024',
      disponible: true,
      destacado: true,
      categoriaId: primeraCategoria.id,
      imagenes: ['https://via.placeholder.com/400x400/6366f1/ffffff?text=Maquina+Pro'],
      especificaciones: 'Motor japonés de alta precisión, peso 95g, voltaje 8-14V'
    };

    // Verificar si ya existe
    const existingProduct = await productRepository.findOne({ 
      where: { nombre: productData.nombre } 
    });

    if (existingProduct) {
      console.log('⚠️ El producto ya existe');
    } else {
      const newProduct = productRepository.create(productData);
      await productRepository.save(newProduct);
      console.log('✅ Producto creado exitosamente:', productData.nombre);
    }

    // Crear algunos productos más
    const otrosProductos = [
      {
        nombre: 'Agujas Redondas RL1205',
        descripcion: 'Agujas redondas para líneas, calibre 12, configuración 05.',
        precio: 42.50,
        stock: 100,
        marca: 'PrecisionNeedle',
        modelo: 'RL1205',
        disponible: true,
        destacado: false,
        categoriaId: categories.find(c => c.name === 'Agujas')?.id || primeraCategoria.id,
        imagenes: ['https://via.placeholder.com/400x400/10b981/ffffff?text=Agujas+RL'],
        especificaciones: 'Estériles, caja de 50 unidades, membrana de seguridad'
      },
      {
        nombre: 'Tinta Negra Premium',
        descripcion: 'Tinta negra de máxima calidad, perfecta para líneas y sombras intensas.',
        precio: 28.99,
        stock: 75,
        marca: 'InkMaster',
        modelo: 'Black Supreme',
        disponible: true,
        destacado: true,
        categoriaId: categories.find(c => c.name === 'Tintas')?.id || primeraCategoria.id,
        imagenes: ['https://via.placeholder.com/400x400/1f2937/ffffff?text=Tinta+Negra'],
        especificaciones: 'Botella 30ml, fórmula vegana, certificada FDA'
      }
    ];

    for (const productoData of otrosProductos) {
      const existe = await productRepository.findOne({ 
        where: { nombre: productoData.nombre } 
      });

      if (!existe) {
        const producto = productRepository.create(productoData);
        await productRepository.save(producto);
        console.log('✅ Producto creado:', productoData.nombre);
      } else {
        console.log('⚠️ Producto ya existe:', productoData.nombre);
      }
    }

    console.log('🎉 ¡Productos creados exitosamente!');
    
    // Mostrar resumen
    const totalProductos = await productRepository.count();
    console.log(`📊 Total de productos en la base de datos: ${totalProductos}`);

  } catch (error) {
    console.error('❌ Error creando productos:', error);
  } finally {
    await app.close();
  }
}

createProducts();
