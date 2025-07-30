import { useState } from "react";
import type { Product, StockTransaction } from "../types/type";
import { Navigation } from "../components/navigation";

export const StockOutPage: React.FC<{ 
  products: Product[]; 
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddTransaction: (transaction: Omit<StockTransaction, 'id' | 'createdAt'>) => void;
}> = ({ products, onUpdateStock, onAddTransaction }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: '',
    remarks: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    
    // Check if sufficient stock
    const product = products.find(p => p._id === formData.productId);
    if (product && formData.quantity && parseInt(formData.quantity) > product.stock) {
      newErrors.quantity = `Insufficient stock. Available: ${product.stock}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const product = products.find(p => p._id === formData.productId);
      if (product) {
        const quantity = parseInt(formData.quantity);
        const newStock = product.stock - quantity;
        
        onUpdateStock(formData.productId, newStock);
        onAddTransaction({
          productId: formData.productId,
          productName: product.name,
          quantity,
          type: 'out',
          reason: formData.reason,
          remarks: formData.remarks
        });
        
        setFormData({ productId: '', quantity: '', reason: '', remarks: '' });
        setErrors({});
        alert('Stock updated successfully!');
      }
    }
  };

  return (
    <>
    <Navigation currentPage={'stock-out'}/>

    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Stock Out</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Remove Stock</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} (Current Stock: {product.stock})
                  </option>
                ))}
              </select>
              {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Remove</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter quantity"
                min="1"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select reason</option>
                <option value="Damaged">Damaged</option>
                <option value="Lost">Lost</option>
                <option value="Expired">Expired</option>
                <option value="Quality Issue">Quality Issue</option>
                <option value="Theft">Theft</option>
                <option value="Other">Other</option>
              </select>
              {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Remove Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ productId: '', quantity: '', reason: '', remarks: '' });
                  setErrors({});
                }}
                className="px-8 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  
    </>
  );
};