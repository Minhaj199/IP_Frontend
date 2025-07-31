import { useState } from "react";
import type { Invoice, Product, StockTransaction } from "./types/type";
import { DashboardPage } from "./pages/Dashboard";
import { InvoicesPage } from "./pages/InvoiceListing";
import { InvoicePage } from "./pages/inoviceCreaion/InvoiceCreation";
import { ProductsPage } from "./pages/ProductManagement";
import { StockInPage } from "./pages/stockIn/StockIn";
import { StockOutPage } from "./pages/stockOut";
import { Route, Routes } from "react-router-dom";

export const App2 = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  const createInvoice = (invoiceData: Omit<Invoice, "id" | "createdAt">) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setInvoices([...invoices, newInvoice]);
  };
  const updateStock = (productId: string, newStock: number) => {
    setProducts(
      products.map((product) =>
        product._id === productId
          ? { ...product, currentStock: Math.max(0, newStock) }
          : product
      )
    );
  };
  const deleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));
  };
  const addTransaction = (
    transactionData: Omit<StockTransaction, "id" | "createdAt">
  ) => {
    const newTransaction: StockTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);
  };
  return (
    <Routes>
      <Route
        path="/"
        element={<DashboardPage products={products} invoices={invoices} />}
      />
      <Route path="/products" element={<ProductsPage />} />
      <Route
        path="/invoice"
        element={
          <InvoicePage
            products={products}
            onCreateInvoice={createInvoice}
            onUpdateStock={updateStock}
          />
        }
      />
      <Route
        path="/invoices"
        element={
          <InvoicesPage
            invoices={invoices}
            onDeleteInvoice={deleteInvoice}
            onUpdateStock={updateStock}
            products={products}
          />
        }
      />
      <Route path="/stock-in" element={<StockInPage/>} />
      <Route
        path="/stock-out"
        element={
          <StockOutPage
            products={products}
            onUpdateStock={updateStock}
            onAddTransaction={addTransaction}
          />
        }
      />
    </Routes>
  );
};
