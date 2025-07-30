import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type {
  Product,
  StockFields,
  StockTransaction,
  SearchOutput,
  StockInputs,
} from "../../types/type";
import { Navigation } from "../../components/navigation";
import { fetchProduct, handleSubmit } from "./operation";
import { debounce } from "lodash";
import { request } from "../../utils/axiosInterceptor";

export const StockInPage: React.FC = () => {
  const [formData, setFormData] = useState<StockInputs>({category: "",productId: "",quantity: "",source: "",remarks: "",product:'',currentStock:0,
  });
  const [products, setProducts] = useState<Product[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const debounceSearch = useRef(
    debounce(
      (parms: { id: string; field: string }) =>
        fetchProduct(parms.id, parms.field),
      500
    )
  ).current;

  useEffect(() => {
    async function fetchPrductName() {
      try {
        const result: Product[]  = await request({
          url: "/api/fetch-productsdata",
        });
        if (result.length) {
          setProducts(result);
          setFormData(prev=>({...prev,}))
        }
      } catch (error) {}
    }
    fetchPrductName();
  },[]);
////////////// input handling////////
  const handleInputChange = async (field: StockFields,e: ChangeEvent<HTMLInputElement|HTMLSelectElement>
  ) => {
   let updatedData=({...formData,[field]:e.target.value})
    console.log(field)
    console.log(e.target.value)
    if (field === "productId") {
      const data=products.find(elm=>{
        return elm
      })
      // console.log(data)
      if(data){
        updatedData={
          category: data.category,productId: data._id,quantity: "",source: "",remarks: "",product:data.name,currentStock:data.stock
        }
      }else{}
      setFormData({...updatedData})
    }else if(field==='category'){
      const data=products.find((el)=>el.category.toLocaleLowerCase()===e.target.value.toLocaleLowerCase())
      if(data){
        updatedData={
          category: data.category,productId: data._id,quantity: "",source: "",remarks: "",product:data.name,currentStock:data.stock
        }
      }
    }else if(field==='product'){
      const data=products.find((el)=>el.name.toLocaleLowerCase()===e.target.value.toLocaleLowerCase())
      if(data){
        updatedData={
          category: data.category,productId: data._id,quantity: "",source: "",remarks: "",product:data.name,currentStock:data.stock
        }
      }
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     const product = products.find(p => p.id === formData.productId);
  //     if (product) {
  //       const quantity = parseInt(formData.quantity);
  //       const newStock = product.currentStock + quantity;

  //       onUpdateStock(formData.productId, newStock);
  //       onAddTransaction({
  //         productId: formData.productId,
  //         productName: product.name,
  //         quantity,
  //         type: 'in',
  //         source: formData.source,
  //         remarks: formData.remarks
  //       });

  //       setFormData({ productId: '', quantity: '', source: '', remarks: '',category:''});
  //       setErrors({});
  //       alert('Stock updated successfully!');
  //     }
  //   }
  // };

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
                <select
                  value={formData.productId}
                  onChange={(e) =>
                   handleInputChange('productId',e)
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.typeId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option key='' value=''>Id</option>
                  {products?.map(el=>{
                    // console.log(el._id)
                    return (
                      
                      <option key={el._id} value={el._id}>{el._id}</option>
                     
                  )

                  })}
                  
                </select>
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
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange('category',e)
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.typeId ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="">category</option>

                  <option value="Notebook">Notebook</option>
                  <option value="Pencil">Pencil</option>
                  <option value="Pen">Pen</option>
                </select>
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
                <select
                  value={formData.product}
                  onChange={(e) =>
                    handleInputChange("product",e)
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select product</option>
                  {products.map(
                    (product: {
                      _id: string;
                      name: string;
                      stock: number;
                    }) => (
                      <option key={product._id} value={formData.product}>
                        {product.name} (Current Stock: {product.stock})
                      </option>
                    )
                  )}
                </select>
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
                      currentStock:0,
                      product:''
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
