interface OrderProduct {
  productId: number;
  quantity: number;
  price: string;
  Product: {
    id: number;
    name: string;
    price: string;
  };
}

export interface Order {
  id: string;
  status: string;
  total: string;
  user:{
    name: string;
    email: string;
  }
  items: OrderProduct[];
}

export interface ItemsOrder  {
  productId: number;
  quantity: number; 
}