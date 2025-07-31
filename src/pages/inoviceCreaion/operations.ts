import { enqueueSnackbar } from "notistack";
import type { InvoiceResponse, Product } from "../../types/type";
import { request } from "../../utils/axiosInterceptor";

export type ProductName = {
  _id: string;
  name: string;
  stock: number;
  price: number;
  unite: string;
};

export type ProductResponse = {
  products: Product[];
};

export const fetchProduct = async (): Promise<ProductResponse> => {
  const res: { products: Product[]; hasMore: boolean } = await request({
    url: `/api/fetch-productname`,
  });
  return res;
};
export const submitInvoice = async ({
  customer,
  selectedItems,
  totalAmount,
  setErrors,
  setItemErrors,
  updateStock,
}: InvoiceResponse) => {
  try {
    const result: { success: true } = await request({
      url: "/api/add-invoice",
      method: "post",
      data: { customer, selectedItems, totalAmount },
    });
    selectedItems.forEach((element) => {
      updateStock(element.productId, element.quantity);
    });

    enqueueSnackbar("added", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
    return result;
  } catch (error: any) {
    if ("errorType" in error && "result" in error) {
      if (
        error.errorType === "fieldError" &&
        error.result !== null &&
        typeof error === "object"
      ) {
        setErrors(error.result as Record<string, string>);
      } else if (
        error.errorType === "itemError" &&
        error.result !== null &&
        typeof error === "object"
      ) {
        setItemErrors(error.result as Record<string, string>);
      }
    } else if (
      error.errorType === "itemError" &&
      error.result !== null &&
      typeof error === "object"
    ) {
    }
    if ("message" in error) {
      enqueueSnackbar(error.message || "internal server error", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    throw new Error("error");
  }
};

/////////////// fetching realtime stock////////////
export const fetchStock = async (id: string) => {
  try {
    const fetch: { stock: number } = await request({
      url: "/api/fetch-stock/" + id,
    });
    if (fetch) {
      return fetch;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
