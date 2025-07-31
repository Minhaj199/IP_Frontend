import react, { useEffect, useState } from "react";
import type { Product } from "../types/type";
import { Plus} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { useLocation } from "react-router-dom";
import { request } from "../utils/axiosInterceptor";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export const ProductsPage: react.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    initialStock: "",
    price: "",
  });
  const [page, setPage] = useState(1);
  const limit = 4;
  const location = useLocation();

  const [errors, setErrors] = useState<Record<string, string>>({});


  const fetchData = async (): Promise<{
    products: Product[];
    totalCount: number;
  }> => {
    try {
      const fetchData: { products: Product[]; totalCount: number } =
        await request({ url: `/api/stock-list?limit=${limit}&&page=${page}` });
      return fetchData;
    } catch (error) {
      return { products: [], totalCount: 0 };
    }
  };
  /////////////////use query fetching////////////
  const { data, refetch} = useQuery<
    { products: Product[]; totalCount: number },
    Error
  >({
    queryKey: ["products", page],
    queryFn: () => fetchData(),
  });
  
  const totalPage = Math.ceil((data?.totalCount || 0) / limit);

  useEffect(() => {
    fetchData();
    if (location.state && location.state.isAddOpionOn) {
      setShowForm(location.state.isAddOpionOn);
    }
  }, [location.state]);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.initialStock || parseInt(formData.initialStock) < 0) newErrors.initialStock = 'Valid initial stock is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await request({
          url: "/api/add-product",
          method: "post",
          data: { ...formData },
        });
        setFormData({
          name: "",
          category: "",
          unit: "",
          initialStock: "",
          price: "",
        });
        setShowForm(false);
        setErrors({});

        if (result) {
          enqueueSnackbar("Product added successfully", {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          refetch();
        }
      } catch (error: any) {
        if ("errorType" in error&&'result' in error) {
          if (
            error.errorType === "fieldError" &&
            error.result !== null &&
            typeof error === "object"
          )
            setErrors(error.result as Record<string, string>);
            return
        } else if (
          error.errorType === "fieldError" &&
          error.result !== null &&
          typeof error === "object"
        ) {
          enqueueSnackbar(error.result.general || "internal server error", {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          return
        } 
        if('message' in error){
             enqueueSnackbar(error.message || "internal server error", {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        }
      }
    }
  };

  return (
    <>
      <Navigation currentPage="products" />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Product Management
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Add Product Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Add New Product
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={formData.initialStock}
                    onChange={(e) =>
                      setFormData({ ...formData, initialStock: e.target.value })
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.initialStock ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter initial stock"
                    min="0"
                  />
                  {errors.initialStock && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.initialStock}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={`w-full p-3 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.unit ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Pen">Pen</option>
                    <option value="Pencil">Pencil</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.unit ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Unit</option>
                    <option value="Piece">Piece</option>
                    <option value="Box">Box</option>
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter price"
                    min="0"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        name: "",
                        category: "",
                        unit: "",
                        initialStock: "",
                        price: "",
                      });
                      setErrors({});
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(data?.products)&&data?.products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{product.stock}</span>
                        <span className="text-gray-500 text-sm">
                          {" "}
                          / {product.initialStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stock === 0 ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : product.stock < import.meta.env.STOCK_LEVEL ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
