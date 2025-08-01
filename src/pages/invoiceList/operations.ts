
import type {  Invoice } from "../../types/type";
import { request } from "../../utils/axiosInterceptor";

 export const fetchData = async (limit:number,page:number): Promise<{
    invoices: Invoice[];
    totalCount: number;
  }> => {
    try {
 
      const fetchData: { invoices: Invoice[],totalCount:number} = await request({ url: `/api/fetch-invoice?limit=${limit}&&page=${page}`});
    
      return fetchData;
    } catch (error) {
      return { invoices: [], totalCount: 0 };
    }
  };