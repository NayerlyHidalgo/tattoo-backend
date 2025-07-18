import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './cart.entity';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getActiveCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { usuarioId: userId, activo: true },
      relations: ['items', 'items.producto'],
    });

    if (!cart) {
      cart = await this.createCart(userId);
    }

    // Actualizar el total del carrito
    cart.total = cart.calculateTotal();
    await this.cartRepository.save(cart);

    return cart;
  }

  async createCart(userId: string): Promise<Cart> {
    const cart = this.cartRepository.create({
      usuarioId: userId,
      activo: true,
      total: 0,
      items: [],
    });

    return await this.cartRepository.save(cart);
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productoId, cantidad } = addToCartDto;

    // Verificar que el producto existe
    const product = await this.productRepository.findOne({
      where: { id: productoId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar stock disponible
    if (product.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    // Obtener carrito activo
    const cart = await this.getActiveCart(userId);

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items?.find(item => item.productoId === productoId);

    if (existingItem) {
      // Actualizar cantidad del item existente
      const newQuantity = existingItem.cantidad + cantidad;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException('Stock insuficiente para la cantidad solicitada');
      }

      existingItem.cantidad = newQuantity;
      existingItem.subtotal = existingItem.calculateSubtotal();
      await this.cartItemRepository.save(existingItem);
    } else {
      // Crear nuevo item en el carrito
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productoId,
        nombreProducto: product.nombre,
        cantidad,
        precioUnitario: product.precio,
        subtotal: Number(product.precio) * cantidad,
        imagenProducto: product.imagenes?.[0] || undefined,
      });

      await this.cartItemRepository.save(cartItem);
    }

    // Devolver carrito actualizado
    return this.getActiveCart(userId);
  }

  async updateCartItem(userId: string, cartItemId: string, updateDto: UpdateCartItemDto): Promise<Cart> {
    const { cantidad } = updateDto;

    // Obtener el item del carrito
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart', 'producto'],
    });

    if (!cartItem) {
      throw new NotFoundException('Item del carrito no encontrado');
    }

    // Verificar que el carrito pertenece al usuario
    if (cartItem.cart.usuarioId !== userId) {
      throw new BadRequestException('No tienes permisos para modificar este carrito');
    }

    // Verificar stock disponible
    if (cartItem.producto.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    // Actualizar cantidad y subtotal
    cartItem.cantidad = cantidad;
    cartItem.subtotal = cartItem.calculateSubtotal();
    await this.cartItemRepository.save(cartItem);

    // Devolver carrito actualizado
    return this.getActiveCart(userId);
  }

  async removeFromCart(userId: string, cartItemId: string): Promise<Cart> {
    // Obtener el item del carrito
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('Item del carrito no encontrado');
    }

    // Verificar que el carrito pertenece al usuario
    if (cartItem.cart.usuarioId !== userId) {
      throw new BadRequestException('No tienes permisos para modificar este carrito');
    }

    // Eliminar item
    await this.cartItemRepository.remove(cartItem);

    // Devolver carrito actualizado
    return this.getActiveCart(userId);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getActiveCart(userId);

    // Eliminar todos los items
    if (cart.items && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }

    // Devolver carrito vacío
    return this.getActiveCart(userId);
  }

  async deactivateCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { usuarioId: userId, activo: true },
    });

    if (cart) {
      cart.activo = false;
      await this.cartRepository.save(cart);
    }
  }

  async getCartHistory(userId: string): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { usuarioId: userId },
      relations: ['items', 'items.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCartById(cartId: string, userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, usuarioId: userId },
      relations: ['items', 'items.producto'],
    });

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    return cart;
  }

  async getCartSummary(userId: string) {
    const cart = await this.getActiveCart(userId);

    return {
      cartId: cart.id,
      totalItems: cart.getTotalItems(),
      totalAmount: cart.total,
      itemsCount: cart.items?.length || 0,
      items: cart.items?.map(item => ({
        id: item.id,
        productId: item.productoId,
        productName: item.nombreProducto,
        quantity: item.cantidad,
        unitPrice: item.precioUnitario,
        subtotal: item.subtotal,
        image: item.imagenProducto,
      })) || [],
    };
  }

  // Método para checkout (preparar para orden)
  async prepareForCheckout(userId: string): Promise<Cart> {
    const cart = await this.getActiveCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    // Verificar stock de todos los productos
    for (const item of cart.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productoId },
      });

      if (!product) {
        throw new BadRequestException(`Producto ${item.nombreProducto} no disponible`);
      }

      if (product.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${item.nombreProducto}. Disponible: ${product.stock}, solicitado: ${item.cantidad}`
        );
      }

      // Actualizar precios por si han cambiado
      if (Number(product.precio) !== Number(item.precioUnitario)) {
        item.precioUnitario = product.precio;
        item.subtotal = item.calculateSubtotal();
        await this.cartItemRepository.save(item);
      }
    }

    // Recalcular total
    cart.total = cart.calculateTotal();
    await this.cartRepository.save(cart);

    return cart;
  }
}
