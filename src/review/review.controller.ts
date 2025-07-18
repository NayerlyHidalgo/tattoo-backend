import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewsDto } from './dto/filter-reviews.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewService.create(createReviewDto, req.user);
  }

  @Get()
  findAll(@Query() filterDto: FilterReviewsDto) {
    return this.reviewService.findAll(filterDto);
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query() filterDto: FilterReviewsDto,
  ) {
    return this.reviewService.findByProduct(productId, filterDto);
  }

  @Get('product/:productId/stats')
  getProductStats(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.reviewService.getProductStats(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  findMyReviews(@Request() req, @Query() filterDto: FilterReviewsDto) {
    return this.reviewService.findByUser(req.user.id, filterDto);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: FilterReviewsDto,
  ) {
    return this.reviewService.findByUser(userId, filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    return this.reviewService.update(id, updateReviewDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.reviewService.remove(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/approve')
  approveReview(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.approveReview(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/reject')
  rejectReview(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.rejectReview(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/util-vote')
  addUtilVote(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.addUtilVote(id);
  }
}
