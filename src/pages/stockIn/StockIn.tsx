import { useEffect,  useState } from "react";
import type { Product, StockFields, StockInputs } from "../../types/type";
import { Navigation } from "../../components/Navigation";
import {  handleSubmit } from "./operation";


import { request } from "../../utils/axiosInterceptor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export const StockInPage: React.FC = () => {
  const [formData, setFormData] = useState<StockInputs>({
    category: "",
    productId: "",
    quantity: "",
    source: "",
    remarks: "",
    product: "",
    currentStock: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});


  useEffect(() => {
    async function fetchPrductName() {
      try {
        const result: Product[] = await request({
          url: "/api/fetch-productsdata",
        });
        if (result.length) {
          setProducts(result);
        }
      } catch (error) {}
    }
    fetchPrductName();
  }, []);
 
  ////////////// input handling////////
  const handleInputChange = async (
    field: StockFields,
    value: string | number
  ) => {
    let updatedData = { ...formData, [field]: value };

    if (field === "productId") {
    
      const data = products.find((elm) => {
        return elm._id===value;
      });
      if (data) {
        updatedData = {
          category: data.category,
          productId: data._id,
          quantity: "",
          source: "",
          remarks: "",
          product: data.name,
          currentStock: data.stock,
        };
      } else {
      }
      setFormData({ ...updatedData });
    } else if (field === "category" && typeof value === "string") {
    
      const data = products.find(
        (el) => el.category.toLocaleLowerCase() === value.toLocaleLowerCase()
      );
      if (data) {
        updatedData = {
          category: data.category,
          productId: data._id,
          quantity: "",
          source: "",
          remarks: "",
          product: data.name,
          currentStock: data.stock,
        };
      }
      setFormData({ ...updatedData });
    } else if (field === "product" && typeof value === "string") {
  
      const data = products.find((el)=>{
      return el.name.toLocaleLowerCase() === value.toLocaleLowerCase()
      });
    
      
      if (data) {
        updatedData = {
          category: data.category,
          productId: data._id,
          quantity: "",
          source: "",
          remarks: "",
          product: data.name,
          currentStock: data.stock,
        };
      }
      setFormData({ ...updatedData })
    }
  };


  return (
    <>
      <Navigation currentPage={"stock-in"} />

      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Stock In</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Stock</h2>

            <form
              onSubmit={(e) =>
                handleSubmit(e, formData, setErrors, setFormData)
              }
              className="space-y-6"
            >
              {/* product id field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product id
                </label>
                <Select
                  value={formData.productId}
                  onValueChange={(e) => handleInputChange("productId", e)}
                >
                  <SelectTrigger
                    className={`w-full px-2 py-6 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.typeId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((el) => {
                      return (
                        <SelectItem key={el._id} value={el._id}>
                          {el._id}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.typeId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productId}
                  </p>
                )}
              </div>
              {/* category field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(e) => handleInputChange("category", e)}
                >
                  <SelectTrigger
                    className={`w-full px-2 py-6 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.typeId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Notebook">Notebook</SelectItem>
                    <SelectItem value="Pencil">Pencil</SelectItem>
                    <SelectItem value="Pen">Pen</SelectItem>
                  </SelectContent>
                </Select>
                {errors.typeId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productId}
                  </p>
                )}
              </div>
              <div>
                {/*Product and stock */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <Select
                  value={formData.product}
                  onValueChange={(e) => handleInputChange("product", e)}
                >
                  <SelectTrigger
                    className={`w-full px-2 py-6 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.typeId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="products" />
                  </SelectTrigger>

                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product._id} value={product.name}>
                        {`${product.name} stock: (${product.stock})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.productId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productId}
                  </p>
                )}
              </div>
              {/*quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter quantity"
                  min="1"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              {/*source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.source ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Purchase from supplier, Returns, etc."
                />
                {errors.source && (
                  <p className="text-red-500 text-sm mt-1">{errors.source}</p>
                )}
              </div>
              {/*remark */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks (Optional)
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
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
                    setFormData({
                      productId: "",
                      quantity: "",
                      source: "",
                      remarks: "",
                      category: "",
                      currentStock: 0,
                      product: "",
                    });
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
