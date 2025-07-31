import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

import type { Invoice, InvoiceItem, Product } from "../../types/type";
import { Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Navigation } from "../../components/navigation";
import { enqueueSnackbar } from "notistack";

import { fetchProduct, fetchStock, submitInvoice } from "../inoviceCreaion/operations";

export const InvoicePage: React.FC<{products: Product[];onCreateInvoice: (invoice: Omit<Invoice, "id" | "createdAt">) => void;onUpdateStock: (productId: string, newStock: number) => void;}> = ({ onCreateInvoice }) => {
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<number, string>>({});
  const [products,setProducts]=useState<Product[]>([])

  const validateCustomer = () => {
    const newErrors: Record<string, string> = {};
    if (!customer.name.trim())
      newErrors.customerName = "Customer name is required";
    if (customer.name.trim().length > 15)
      newErrors.customerName = "Maximum charecter limit 15";
    if (customer.name.trim().length <3)
      newErrors.customerName = "Insert aleast 3 letters";
    
    if (!customer.phone.trim())
      newErrors.customerPhone = "Customer phone is required";
      if (customer.phone.trim().length<10||customer.phone.trim().length>14)
      newErrors.customerPhone = "Enter a valid number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const addItem = () => {setSelectedItems([...selectedItems,{productId: "",productName: "",quantity: 0,price: 0,total: 0,},])};


  useEffect(()=>{
    async function fetchData(){
      const data=await fetchProduct()
      setProducts(data.products)
    }
    fetchData()
  },[])


  /////////////// stock updated
const updateStock=(id:string,quantity:number)=>{
  setProducts(prev=>prev.map(el=>(el._id===id)?{...el,stock:el.stock-quantity}:el))
   setCustomer({ name: "", phone: "" });
    setSelectedItems([]);
    setErrors({});
    setItemErrors({});
}
  const updateItem =async (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const newItems = [...selectedItems];
    const item = { ...newItems[index] };
   
    if (field === "productId") {
      
      const product = products.find((p) => p._id === value);
      
      if (product) {
        item.productId = value
        item.productName = product.name;
        item.price = product.price;
        item.total = item.quantity * product.price;
       
      }
    } else if (field === "quantity") {
      const qty = parseInt(value) || 0;
      item.quantity = qty;
      item.total = qty * item.price;
     const product = products.find((p) => p._id === item.productId);
     const curr=product?.stock||0
      if(curr<item.quantity){
         setItemErrors(prev=>({...prev,[index]:`Current stock. Available: ${curr}`}))
        return
      }
      
    }
  
    newItems[index] = item;
    setSelectedItems(newItems);

    const newItemErrors = { ...itemErrors };
    delete newItemErrors[index];
    setItemErrors(newItemErrors);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };
  
  const validateItems = () => {
    const newItemErrors: Record<number, string> = {};
    const set=new Set()
    selectedItems.forEach((item, index) => {

      if (!item.productId) {
        newItemErrors[index] = "Please select a product";
      } else if (item.quantity <= 0) {
        newItemErrors[index] = "Quantity must be greater than 0";
      }else if(set.has(item.productId)){
        newItemErrors[index]='Remove duplicated entries'
      }
       else {
        const product = products.find((p) => p._id === item.productId);
        if (product && item.quantity > product.stock) {
          newItemErrors[index] = `Insufficient stock. Available: ${product.stock}`;
        }else{
          set.add(item.productId)
        }
      }
    });

    setItemErrors(newItemErrors);
    return Object.keys(newItemErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {

    /////////////////// submitting data here/////////////
    e.preventDefault();
    ///////////// customer validation//////////
    const isCustomerValid = validateCustomer();
    ///////////// validation//////////
    const areItemsValid = validateItems();

    if (selectedItems.length === 0) {
      enqueueSnackbar("Please add at least one item to the invoice", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });

      return;
    }

    if (isCustomerValid && areItemsValid) {
      const totalAmount = selectedItems.reduce(
        (sum, item) => sum + item.total,
        0
      );

      /////////////////// submitting to server///////////
      submitInvoice({customer,selectedItems,totalAmount,setErrors,setItemErrors,setCustomer,setSelectedItems,updateStock})
      
      
    }
  };



  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <Navigation currentPage="invoice" />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create Invoice
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.customerName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customerName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.customerPhone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
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
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      {/* updateItem(index, 'productId', ) */}
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <Select onValueChange={(e)=>updateItem(index,'productId',e)}>
                        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products?.map((el)=>{

                          return<SelectItem key={el._id} value={el._id}>{`${el.name} (${el.stock}${el.unit})`}</SelectItem>
                          })}
                          
                        </SelectContent>
                      </Select>
                      
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity 
                      </label>
                      <input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        className="w-full py-2 px- border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={item.price || ""}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total
                      </label>
                      <input
                        type="number"
                        value={item.total || ""}
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
                        <p className="text-red-500 text-sm">
                          {itemErrors[index]}
                        </p>
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
                <span className="text-green-600">
                  ₹{totalAmount.toLocaleString()}
                </span>
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
                  setCustomer({ name: "", phone: "" });
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
