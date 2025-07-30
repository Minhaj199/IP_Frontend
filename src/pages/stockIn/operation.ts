
import type { Dispatch, SetStateAction } from "react";
import type { Product, SearchOutput, StockFields, StockInputs } from "../../types/type";
import { request } from "../../utils/axiosInterceptor";

 export const handleSubmit = (e: React.FormEvent,formData:StockInputs,setErrors:Dispatch<SetStateAction<Record<string,string>>>,setFormData:Dispatch<SetStateAction<StockInputs>>) => {
    e.preventDefault();
    
    if (validateForm(formData,setErrors)) {
      if (formData.productId) {
        const quantity = parseInt(formData.quantity);
        
        
        // onUpdateStock(formData.productId, newStock);
        // onAddTransaction({
        //   productId: formData.productId,
        //   productName: product.name,
        //   quantity,
        //   type: 'in',
        //   source: formData.source,
        //   remarks: formData.remarks
        // });
        
        setFormData({ productId: '', quantity: '', source: '', remarks: '',category:'',product:'',currentStock:0});
        setErrors({});
        alert('Stock updated successfully!');
      }
    }
  };
//////////// validating form
    const validateForm = (formData:StockInputs,setErrors:Dispatch<SetStateAction<Record<string,string>>>) => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.productId) newErrors.productId = 'Please select a product';
      if (!formData.quantity || parseInt(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
      if (!formData.source.trim()) newErrors.source = 'Source is required';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
///////////////fetching product data api/////

export const fetchProduct=async(id:string,field:string):Promise<{success:boolean,data:SearchOutput}>=>{
  
  const data:{success:boolean,data:SearchOutput}=await request({url:`/api/fetch-productdata?id=${id}&field=${field}`})
  return data
}