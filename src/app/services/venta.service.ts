import { Injectable } from '@angular/core';
import { venta } from '../models/venta';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  constructor() {}

  subtotal: number = 0;

  totalVenta: number = 0;

  efectivo: number = 0;

  cambio: number = 0;

  selectedPost: venta = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    category: '',
    subtotal: 0,
    image: '',
    rating: {
      rate: 0,
      count: 0,
    },
  };

  ventas = [];
}
