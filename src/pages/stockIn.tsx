import { useState } from "react";
import type { Product, StockTransaction } from "../types/type";
import { Navigation } from "../components/navigation";

export const StockInPage: React.FC<{ 
  products: Product[]; 
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddTransaction: (transaction: Omit<StockTransaction, 'id' | 'createdAt'>) => void;
}> = ({ products, onUpdateStock, onAddTransaction }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    source: '',
    remarks: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.source.trim()) newErrors.source = 'Source is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        const quantity = parseInt(formData.quantity);
        const newStock = product.currentStock + quantity;
        
        onUpdateStock(formData.productId, newStock);
        onAddTransaction({
          productId: formData.productId,
          productName: product.name,
          quantity,
          type: 'in',
          source: formData.source,
          remarks: formData.remarks
        });
        
        setFormData({ productId: '', quantity: '', source: '', remarks: '' });
        setErrors({});
        alert('Stock updated successfully!');
      }
    }
  };

  return (
    <>
    <Navigation currentPage={'stock-in'}/>
  
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Stock In</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add Stock</h2>
          
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
                  <option key={product.id} value={product.id}>
                    {product.name} (Current Stock: {product.currentStock})
                  </option>
                ))}
              </select>
              {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.source ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Purchase from supplier, Returns, etc."
              />
              {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
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
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Add Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ productId: '', quantity: '', source: '', remarks: '' });
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
