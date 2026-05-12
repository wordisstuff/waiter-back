import { Injectable } from '@nestjs/common';
import * as menu from '../data/menu.json';

@Injectable()
export class MenuService {
  getMenu() {
    return menu;
  }
}
