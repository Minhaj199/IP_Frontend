import { InvoicesPage } from "./pages/invoiceList/InvoiceListing";
import { InvoicePage } from "./pages/inoviceCreaion/InvoiceCreation";
import { ProductsPage } from "./pages/ProductManagement";
import { StockInPage } from "./pages/stockIn/StockIn";
import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/welcomePage";
import NotFound from "./pages/PageNotFound";
export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/invoice" element={<InvoicePage />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="/stock-in" element={<StockInPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
