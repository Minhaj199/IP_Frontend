import { 
  Package, 
  FileText, 
  List, 
  TrendingUp, 
  TrendingDown, 
  Home,

} from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
export const Navigation: React.FC<{ currentPage: string; onPageChange?: (page: string) => void }> = ({ currentPage }) => {
  const navigate=useNavigate()
  const navItems = [
    { key: 'home', label: 'Dashboard', icon: Home,route:'/'},
    { key: 'products', label: 'Products', icon: Package,route:'/products' },
    { key: 'invoice', label: 'Create Invoice', icon: FileText,route:'/invoice' },
    { key: 'invoices', label: 'Invoice List', icon: List,route:'/invoices' },
    { key: 'stock-in', label: 'Stock In', icon: TrendingUp,route:'/stock-in' },
    { key: 'stock-out', label: 'Stock Out', icon: TrendingDown,route:'/stock-out' }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Package className="w-8 h-8" />
            <h1  className="text-xl font-bold">Inventory Pro</h1>
          </div>
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ key, label, icon: Icon,route }) => (
              <button
                key={key}
                onClick={() => navigate(route)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === key
                    ? 'border border-white'
                    : 'hover:bg-white hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Mobile menu */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(({ key, label, icon: Icon,route }) => (
              <button
                key={key}
                onClick={() => navigate(route)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  currentPage === key
                    ? 'border border-white'
                    : 'hover:bg-white hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};