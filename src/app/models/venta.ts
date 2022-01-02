export interface venta {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  subtotal: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
