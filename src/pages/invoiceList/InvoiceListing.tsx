import { useState } from "react";
import type { Invoice } from "../../types/type";
import { FileText,  Trash2 } from "lucide-react";
import { Navigation } from "../../components/Navigation"; 
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./operations";
import {  Pagination } from "@mui/material";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { request } from "../../utils/axiosInterceptor";
import { enqueueSnackbar } from "notistack";
import LoadingSpinner from "../../components/Spinner";

export const InvoicesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [invoiceID, setInvoiceId] = useState<string|null>();
  const limit = 5;

  const { data,refetch } = useQuery<{ invoices: Invoice[]; totalCount: number }, Error>(
    {
      queryKey: ["products", page],
      queryFn: () => fetchData(limit, page),
    }
  );
  const [isLoading,setIsLoading]=useState(false)
  const handleDeleteInvoice = async(invoice: Invoice) => {

   
    {
      // Restore stock
const id=encodeURIComponent(invoice._id)
      try {
        setIsLoading(true)
        const result:{success:boolean}=await request({url:`/api/delete-invoice/${id}`,method:'delete',data:invoice})
        if(result.success){
          refetch()
          enqueueSnackbar("invoice deleted", {
                variant: "success",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
        }
      } catch (error) {
        if(error instanceof Error){
          enqueueSnackbar(error.message||"unexpected error", {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
        }else{
         enqueueSnackbar("unexpected error", {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });  
        }
      }finally{
        setIsLoading(false)
      }

    }
  };
  const totalPage = Math.ceil((data?.totalCount || 0) / limit);
  return (
    <>
    {isLoading?<LoadingSpinner/>:
    <>

    <Navigation currentPage="invoices" />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Invoice List</h1>
          </div>

          {/* Search */}
         

          {/* Invoices Table */}
          <div className="bg-white mt-11 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   <AlertDialog onOpenChange={(open)=>{
                    if(!open)setInvoiceId(null)
                   }} open={!!invoiceID}>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete Invoice
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={()=>setInvoiceId(null)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={()=>{
                                        const invoice=data?.invoices.find(el=>el._id===invoiceID)
                                        if(invoice)handleDeleteInvoice(invoice)
                                        setInvoiceId(null)
                                      }}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                  {Array.isArray(data?.invoices)&&data?.invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                       
                       
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {invoice._id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {invoice.customer.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {invoice.customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {invoice.items.length} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-green-600">
                          ₹{invoice.totalAmount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      
    
                        <button
                          onClick={() => setInvoiceId(invoice._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {Array.isArray(data?.invoices)&&data?.invoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No invoices found.</p>
              </div>
            )}
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
    }
    </>
    
  
  );
};
