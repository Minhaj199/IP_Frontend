import { useState } from 'react';

import type { Invoice, InvoiceItem, Product } from '../types/type';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Navigation } from '../components/navigation';
export const InvoicePage: React.FC<{ 
  products: Product[]; 
  onCreateInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
}> = ({ products, onCreateInvoice, onUpdateStock }) => {
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<number, string>>({});

  const validateCustomer = () => {
    const newErrors: Record<string, string> = {};
    if (!customer.name.trim()) newErrors.customerName = 'Customer name is required';
    if (!customer.phone.trim()) newErrors.customerPhone = 'Customer phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    setSelectedItems([...selectedItems, {
      productId: '',
      productName: '',
      quantity: 0,
      price: 0,
      total: 0
    }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...selectedItems];
    const item = { ...newItems[index] };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productId = value;
        item.productName = product.name;
        item.price = product.price;
        item.total = item.quantity * product.price;
      }
    } else if (field === 'quantity') {
      const qty = parseInt(value) || 0;
      item.quantity = qty;
      item.total = qty * item.price;
    }
    
    newItems[index] = item;
    setSelectedItems(newItems);
    
    // Clear error for this item
    const newItemErrors = { ...itemErrors };
    delete newItemErrors[index];
    setItemErrors(newItemErrors);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const validateItems = () => {
    const newItemErrors: Record<number, string> = {};
    
    selectedItems.forEach((item, index) => {
      if (!item.productId) {
        newItemErrors[index] = 'Please select a product';
      } else if (item.quantity <= 0) {
        newItemErrors[index] = 'Quantity must be greater than 0';
      } else {
        const product = products.find(p => p.id === item.productId);
        if (product && item.quantity > product.currentStock) {
          newItemErrors[index] = `Insufficient stock. Available: ${product.currentStock}`;
        }
      }
    });
    
    setItemErrors(newItemErrors);
    return Object.keys(newItemErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isCustomerValid = validateCustomer();
    const areItemsValid = validateItems();
    
    if (selectedItems.length === 0) {
      alert('Please add at least one item to the invoice');
      return;
    }
    
    if (isCustomerValid && areItemsValid) {
      const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);
      
      onCreateInvoice({
        customer,
        items: selectedItems,
        totalAmount
      });
      
      // Update stock
      selectedItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          onUpdateStock(item.productId, product.currentStock - item.quantity);
        }
      });
      
      // Reset form
      setCustomer({ name: '', phone: '' });
      setSelectedItems([]);
      setErrors({});
      setItemErrors({});
      
      alert('Invoice created successfully!');
    }
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
    <Navigation currentPage='invoice'/>
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Invoice</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter phone number"
                />
                {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Products</h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} (Stock: {product.currentStock})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={item.price || ''}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                    <input
                      type="number"
                      value={item.total || ''}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                  
                  {itemErrors[index] && (
                    <div className="md:col-span-5">
                      <p className="text-red-500 text-sm">{itemErrors[index]}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {selectedItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No items added yet. Click "Add Item" to start.</p>
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Amount:</span>
              <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create Invoice
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomer({ name: '', phone: '' });
                setSelectedItems([]);
                setErrors({});
                setItemErrors({});
              }}
              className="px-8 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};