import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class N8nService {
  private readonly webhookUrl = process.env.N8N_AI_WAITER_WEBHOOK_URL;

  async sendMessage(data: {
    sessionId: string;
    restaurantId: string;
    tableId: string;
    tableNumber: number;
    partySize: number;
    message: string;
    menu: any;
  }) {
    if (!this.webhookUrl) {
      throw new Error('N8N_AI_WAITER_WEBHOOK_URL is not set');
    }

    const response = await axios.post(this.webhookUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    return response.data;
  }
}
