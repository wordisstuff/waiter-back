import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTables(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: {
        tables: {
          orderBy: {
            number: 'asc',
          },
        },
      },
    });

    return restaurant?.tables || [];
  }
}
