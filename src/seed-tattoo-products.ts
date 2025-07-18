import { DataSource } from 'typeorm';
import { Product } from './products/products.entity';
import { Category } from './categories/category.entity';

export async function seedTattooProducts(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(Category);
  const productRepository = dataSource.getRepository(Product);

  // Crear categorías
  const categories = [
    { name: 'Máquinas de Tatuaje', descripcion: 'Máquinas profesionales para tatuaje' },
    { name: 'Agujas', descripcion: 'Agujas de diferentes calibre' },
    { name: 'Tintas', descripcion: 'Tintas de alta calidad' },
    { name: 'Accesorios', descripcion: 'Accesorios y suministros' },
    { name: 'Cuidado Posterior', descripcion: 'Productos para el cuidado del tatuaje' },
    { name: 'Equipos de Protección', descripcion: 'Guantes, máscaras y equipos de seguridad' },
  ];

  const savedCategories: Category[] = [];
  for (const categoryData of categories) {
    let category = await categoryRepository.findOne({ where: { name: categoryData.name } });
    if (!category) {
      category = categoryRepository.create(categoryData);
      category = await categoryRepository.save(category);
    }
    savedCategories.push(category);
  }

  // Crear productos
  const products = [
    // Máquinas de Tatuaje
    {
      nombre: 'Máquina Rotativa Bishop V6',
      descripcion: 'Máquina rotativa profesional de alta precisión, ideal para líneas y sombras.',
      precio: 850.00,
      stock: 10,
      imagenes: ['/images/products/machine-bishop-v6.jpg'],
      categoria: savedCategories[0],
      destacado: true,
    },
    {
      nombre: 'Máquina Bobina Tradicional',
      descripcion: 'Máquina de bobina clásica, perfecta para líneas definidas.',
      precio: 450.00,
      stock: 15,
      imagenes: ['/images/products/machine-coil.jpg'],
      categoria: savedCategories[0],
    },
    {
      nombre: 'Máquina Pen Rotativa',
      descripcion: 'Máquina tipo pen, ergonómica y silenciosa.',
      precio: 650.00,
      stock: 8,
      imagenes: ['/images/products/machine-pen.jpg'],
      categoria: savedCategories[0],
      destacado: true,
    },

    // Agujas
    {
      nombre: 'Agujas Round Liner 03RL',
      descripcion: 'Agujas para líneas finas, paquete de 50 unidades.',
      precio: 45.00,
      stock: 100,
      imagenes: ['/images/products/needles-03rl.jpg'],
      categoria: savedCategories[1],
    },
    {
      nombre: 'Agujas Round Shader 07RS',
      descripcion: 'Agujas para sombreado, paquete de 50 unidades.',
      precio: 50.00,
      stock: 80,
      imagenes: ['/images/products/needles-07rs.jpg'],
      categoria: savedCategories[1],
    },
    {
      nombre: 'Agujas Magnum 09M1',
      descripcion: 'Agujas magnum para relleno, paquete de 50 unidades.',
      precio: 55.00,
      stock: 60,
      imagenes: ['/images/products/needles-09m1.jpg'],
      categoria: savedCategories[1],
      destacado: true,
    },

    // Tintas
    {
      nombre: 'Tinta Negra Eternal Ink',
      descripcion: 'Tinta negra premium de 30ml, ideal para líneas y sombras.',
      precio: 7.50,
      stock: 50,
      imagenes: ['/images/products/ink-eternal-black.jpg'],
      categoria: savedCategories[2],
      destacado: true,
    },
    {
      nombre: 'Set de Tintas de Colores',
      descripcion: 'Set de 12 colores básicos de 15ml cada uno.',
      precio: 320.00,
      stock: 25,
      imagenes: ['/images/products/ink-color-set.jpg'],
      categoria: savedCategories[2],
    },
    {
      nombre: 'Tinta Blanca Intenze',
      descripcion: 'Tinta blanca de alta cobertura, 30ml.',
      precio: 8.50,
      stock: 30,
      imagenes: ['/images/products/ink-intenze-white.jpg'],
      categoria: savedCategories[2],
    },

    // Accesorios
    {
      nombre: 'Grips Desechables',
      descripcion: 'Grips desechables de diferentes diámetros, paquete de 100.',
      precio: 120.00,
      stock: 40,
      imagenes: ['/images/products/grips-disposable.jpg'],
      categoria: savedCategories[3],
    },
    {
      nombre: 'Fuente de Poder Digital',
      descripcion: 'Fuente de poder digital con pantalla LCD.',
      precio: 2800.00,
      stock: 12,
      imagenes: ['/images/products/power-supply.jpg'],
      categoria: savedCategories[3],
    },
    {
      nombre: 'Pedal de Control',
      descripcion: 'Pedal de control ergonómico para máquinas.',
      precio: 950.00,
      stock: 20,
      imagenes: ['/images/products/foot-pedal.jpg'],
      categoria: savedCategories[3],
    },

    // Cuidado Posterior
    {
      nombre: 'Crema Cicatrizante Bepanthen',
      descripcion: 'Crema para el cuidado posterior del tatuaje, 100g.',
      precio: 13.00,
      stock: 150,
      imagenes: ['/images/products/bepanthen-cream.jpg'],
      categoria: savedCategories[4],
    },
    {
      nombre: 'Jabón Antibacterial',
      descripcion: 'Jabón especial para la limpieza de tatuajes recientes.',
      precio: 2.50,
      stock: 200,
      imagenes: ['/images/products/antibacterial-soap.jpg'],
      categoria: savedCategories[4],
    },
    {
      nombre: 'Plastico Protector',
      descripcion: 'Plastico protector transparente para tatuajes.',
      precio: 4.50,
      stock: 80,
      imagenes: ['/images/products/protective-film.jpg'],
      categoria: savedCategories[4],
    },

    // Equipos de Protección
    {
      nombre: 'Guantes de Nitrilo',
      descripcion: 'Guantes de nitrilo sin polvo, caja de 100 unidades.',
      precio: 6.00,
      stock: 100,
      imagenes: ['/images/products/nitrile-gloves.jpg'],
      categoria: savedCategories[5],
    },
    {
      nombre: 'Mascarillas Quirúrgicas',
      descripcion: 'Mascarillas desechables de 3 capas, paquete de 50.',
      precio: 3.50,
      stock: 150,
      imagenes: ['/images/products/surgical-masks.jpg'],
      categoria: savedCategories[5],
    },
    {
      nombre: 'Fundas para Máquinas',
      descripcion: 'Fundas desechables para máquinas de tatuaje, paquete de 100.',
      precio: 5.50,
      stock: 60,
      imagenes: ['/images/products/machine-covers.jpg'],
      categoria: savedCategories[5],
    },
  ];

  // Guardar productos
  for (const productData of products) {
    let product = await productRepository.findOne({ where: { nombre: productData.nombre } });
    if (!product) {
      // Crear el producto con la categoría asignada
      const { categoria, ...productInfo } = productData;
      product = productRepository.create({
        ...productInfo,
        categoriaId: categoria.id,
      });
      await productRepository.save(product);
      console.log(`✅ Producto creado: ${product.nombre}`);
    }
  }

  console.log('🎨 Productos de tatuaje sembrados exitosamente');
}
