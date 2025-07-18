import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getActiveCart(@Request() req) {
    return this.cartService.getActiveCart(req.user.id);
  }

  @Get('summary')
  getCartSummary(@Request() req) {
    return this.cartService.getCartSummary(req.user.id);
  }

  @Get('history')
  getCartHistory(@Request() req) {
    return this.cartService.getCartHistory(req.user.id);
  }

  @Get(':cartId')
  getCartById(
    @Param('cartId', ParseUUIDPipe) cartId: string,
    @Request() req,
  ) {
    return this.cartService.getCartById(cartId, req.user.id);
  }

  @Post('add')
  addToCart(@Body() addToCartDto: AddToCartDto, @Request() req) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put('item/:cartItemId')
  updateCartItem(
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string,
    @Body() updateDto: UpdateCartItemDto,
    @Request() req,
  ) {
    return this.cartService.updateCartItem(req.user.id, cartItemId, updateDto);
  }

  @Delete('item/:cartItemId')
  removeFromCart(
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string,
    @Request() req,
  ) {
    return this.cartService.removeFromCart(req.user.id, cartItemId);
  }

  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post('checkout/prepare')
  prepareForCheckout(@Request() req) {
    return this.cartService.prepareForCheckout(req.user.id);
  }

  @Post('deactivate')
  deactivateCart(@Request() req) {
    return this.cartService.deactivateCart(req.user.id);
  }
}
