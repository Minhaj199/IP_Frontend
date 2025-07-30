export interface Product {
  _id: string;
  name: string;
  category: string;
  unit: string;
  initialStock: number;
  stock: number;
  price: number;
  createdAt: string;
}

export interface Customer {
  name: string;
  phone: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  customer: Customer;
  items: InvoiceItem[];
  totalAmount: number;
  createdAt: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'in' | 'out';
  source?: string;
  reason?: string;
  remarks?: string;
  createdAt: string;
}

 export type StockInputs={
    category: string;
    productId: string;
    quantity: string;
    source: string;
    remarks: string;
    product:string,
    currentStock:number
}
export type SearchOutput={
    category: string;
    productId: string;
    quantity: string;
    name:string
}

export type StockFields='category'|'productId'|'quantity'|'source'|'remarks'|'product'
