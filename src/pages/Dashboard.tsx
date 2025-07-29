import { 
  Package, 
  FileText,  
  TrendingUp,  
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Plus,

} from 'lucide-react';
import { Navigation } from '../components/navigation';
import type { Invoice, Product } from '../types/type';
import { useNavigate } from 'react-router-dom';
export const DashboardPage: React.FC<{ products: Product[]; invoices: Invoice[] }> = ({ products, invoices }) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.currentStock < 10).length;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const totalInvoices = invoices.length;

  const stats = [
    { title: 'Total Products', value: totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Low Stock Items', value: lowStockProducts, icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Invoices', value: totalInvoices, icon: FileText, color: 'bg-purple-500' }
  ];
const navigate=useNavigate()
  return (
   <>
    <Navigation currentPage='home'/>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Inventory Pro</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your inventory management with our powerful, intuitive platform designed for modern businesses.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={()=>navigate('/products',{state:{isAddOpionOn:true}})} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
              <Plus className="w-5 h-5" />
              <span>Add New Product</span>
            </button>
            <button onClick={()=>navigate('/invoice')} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
              <ShoppingCart className="w-5 h-5" />
              <span>Create Invoice</span>
            </button>
            <button onClick={()=>navigate('/stock-in')} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
              <TrendingUp className="w-5 h-5" />
              <span>Stock In</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Low Stock Alert</h3>
            <div className="space-y-3">
              {products.filter(p => p.currentStock < 10).slice(0, 5).map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {product.currentStock} left
                  </span>
                </div>
              ))}
              {products.filter(p => p.currentStock < 10).length === 0 && (
                <p className="text-gray-500 text-center py-4">All products are well-stocked!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Invoices</h3>
            <div className="space-y-3">
              {invoices.slice(-5).reverse().map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{invoice.customer.name}</p>
                    <p className="text-sm text-gray-600">#{invoice.id.slice(-6)}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </span>
                </div>
              ))}
              {invoices.length === 0 && (
                <p className="text-gray-500 text-center py-4">No invoices created yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  );
};
