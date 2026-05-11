import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get(':slug/tables')
  getTables(@Param('slug') slug: string) {
    return this.restaurantsService.getTables(slug);
  }
}
