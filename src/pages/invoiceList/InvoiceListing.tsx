import { useState } from "react";
import type { Invoice, Product } from "../../types/type";
import { FileText, Search, Trash2 } from "lucide-react";
import { Navigation } from "../../components/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./operations";
import { Pagination } from "@mui/material";

export const InvoicesPage: React.FC<{ invoices: Invoice[]; products: Product[];onDeleteInvoice: (invoiceId: string) => void;onUpdateStock: (productId: string, newStock: number) => void;
}> = ({ invoices, products, onDeleteInvoice, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
const [page,setPage]=useState(1)
const limit=5
  const handleDeleteInvoice = (invoice: Invoice) => {
    if (confirm(`Are you sure you want to delete invoice #${invoice._id.slice(-6)}? This will restore the stock.`)) {
      // Restore stock
      invoice.items.forEach(item => {
        const product = products.find(p => p._id === item.productId);
        if (product) {
          onUpdateStock(item.productId, product.stock + item.quantity);
        }
      });
      
      onDeleteInvoice(invoice._id);
    }
  };
    const { data} = useQuery<
    { invoices: Invoice[]; totalCount: number },Error
  >({
    queryKey: ["products", page],
    queryFn: () => fetchData(limit,page),
  });

const totalPage=Math.ceil((data?.totalCount||0)/limit)
  return (
    <>
    <Navigation currentPage="invoices"/>
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Invoice List</h1>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoices by customer name or invoice ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{invoice._id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{invoice.customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{invoice.customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{invoice.items.length} items</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-green-600">₹{invoice.totalAmount?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteInvoice(invoice)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {data?.invoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No invoices found.</p>
            </div>
          )}
        </div>
      </div>
       <div className="w-full pb-6 mt-9 flex justify-center items-center">
              <Pagination
                onChange={(_e, value) => setPage(value)}
                count={totalPage}
                page={page}
                variant="outlined"
                color="primary"
              />
            </div>
    </div>
   
    </>
  );
};