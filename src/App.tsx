import { useState } from "react";
import type { Invoice, Product, StockTransaction } from "./types/type";
import { DashboardPage } from "./pages/Dashboard";
import { InvoicesPage } from "./pages/InvoiceListing";
import { InvoicePage } from "./pages/InvoiceCreation";
import { ProductsPage } from "./pages/ProductManagement";
import { StockInPage } from "./pages/stockIn";
import { StockOutPage } from "./pages/stockOut";
import { Navigation } from "./components/navigation"; 
import { Route, Routes } from "react-router-dom";

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    unit: 'piece',
    initialStock: 50,
    currentStock: 35,
    price: 2999,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Coffee Beans',
    category: 'Food',
    unit: 'kg',
    initialStock: 100,
    currentStock: 78,
    price: 899,
    createdAt: new Date().toISOString()
  }
];


export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
  };

  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setInvoices([...invoices, newInvoice]);
  };

  const deleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, currentStock: Math.max(0, newStock) }
        : product
    ));
  };

  const addTransaction = (transactionData: Omit<StockTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: StockTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTransactions([...transactions, newTransaction]);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <DashboardPage products={products} invoices={invoices} />;
      case 'products':
        return <ProductsPage products={products} onAddProduct={addProduct} />;
      case 'invoice':
        return <InvoicePage products={products} onCreateInvoice={createInvoice} onUpdateStock={updateStock} />;
      case 'invoices':
        return <InvoicesPage invoices={invoices} products={products} onDeleteInvoice={deleteInvoice} onUpdateStock={updateStock} />;
      case 'stock-in':
        return <StockInPage products={products} onUpdateStock={updateStock} onAddTransaction={addTransaction} />;
      case 'stock-out':
        return <StockOutPage products={products} onUpdateStock={updateStock} onAddTransaction={addTransaction} />;
      default:
        return <DashboardPage products={products} invoices={invoices} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
};

export const App2=()=>{
   const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
    const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
  };
    const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setInvoices([...invoices, newInvoice]);
  };
    const updateStock = (productId: string, newStock: number) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, currentStock: Math.max(0, newStock) }
        : product
    ));
  };
    const deleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
  };
    const addTransaction = (transactionData: Omit<StockTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: StockTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTransactions([...transactions, newTransaction]);
  };
return(
  <Routes>
    <Route path="/" element={<DashboardPage products={products}  invoices={invoices} />} />   
    <Route path="/products" element={<ProductsPage products={products} onAddProduct={addProduct}/>} />   
    <Route path="/invoice" element={<InvoicePage products={products} onCreateInvoice={createInvoice} onUpdateStock={updateStock}  />} />   
    <Route path="/invoices" element={<InvoicesPage  invoices={invoices} onDeleteInvoice={deleteInvoice} onUpdateStock={updateStock} products={products}   />} />   
    <Route path="/stock-in" element={<StockInPage products={products} onUpdateStock={updateStock} onAddTransaction={addTransaction}   />} />   
    <Route path="/stock-out" element={<StockOutPage products={products} onUpdateStock={updateStock} onAddTransaction={addTransaction}   />} />   
  </Routes>

)
}