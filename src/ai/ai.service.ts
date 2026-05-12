import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async askWaiter(data: {
    message: string;
    tableNumber: number;
    partySize: number;
    menu: any;
    history?: { role: 'user' | 'assistant'; content: string }[];
  }) {
    const response = await this.openai.responses.create({
      model: 'gpt-5-mini',
      input: [
        {
          role: 'system',
          content: `
You are an AI waiter for a Ukrainian restaurant.

Use ONLY dishes from this menu:
${JSON.stringify(data.menu)}

Return ONLY valid JSON:
{
  "answer": "short friendly answer",
  "recommendedItemIds": ["id-from-menu"]
}

Rules:
- never invent dishes
- recommendedItemIds must contain only ids from the menu
- if allergy is mentioned, avoid dishes with that allergen
- answer in the same language as the customer
- use conversation history to understand short replies like "yes", "так", "ok"
- if calories are unknown, give an approximate range only if it is a common dish and clearly say it is an estimate
          `,
        },
        ...(data.history ?? []),
        {
          role: 'user',
          content: `
Customer message: ${data.message}
Table number: ${data.tableNumber}
Party size: ${data.partySize}
          `,
        },
      ],
    });

    const text = response.output_text;

    try {
      return JSON.parse(text);
    } catch {
      return {
        answer: text,
        recommendedItemIds: [],
      };
    }
  }
}
