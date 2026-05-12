import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TablesModule } from './tables/tables.module';
import { ChatModule } from './chat/chat.module';
import { N8nModule } from './n8n/n8n.module';
import { MenuModule } from './menu/menu.module';
import { AiModule } from './ai/ai.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, RestaurantsModule, TablesModule, ChatModule, N8nModule, MenuModule, AiModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
