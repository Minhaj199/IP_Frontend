import type { Dispatch, SetStateAction } from "react";
import type { SearchOutput, StockInputs } from "../../types/type";
import { request } from "../../utils/axiosInterceptor";
import { enqueueSnackbar } from "notistack";

//////////// validating form/////
const validateForm = (
  formData: StockInputs,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
) => {
  const newErrors: Record<string, string> = {};
  if (!formData.productId) newErrors.productId = "Please select a product";
  if (!formData.quantity || parseInt(formData.quantity) <= 0)
    newErrors.quantity = "Valid quantity is required";
  if (!formData.source.trim()) newErrors.source = "Source is required";
  if ("remark" in formData) newErrors.source = "Source is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const handleSubmit = async (
  e: React.FormEvent,
  formData: StockInputs,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>,
  setFormData: Dispatch<SetStateAction<StockInputs>>
) => {
  e.preventDefault();
  if (validateForm(formData, setErrors)) {
    if (formData.productId) {
      try {
        const id = encodeURIComponent(formData.productId);
        const updateData: { success: true } = await request({
          url: "/api/stock-in/" + id,
          method: "put",
          data: formData,
        });
        if (updateData.success) {
          setFormData({
            productId: "",
            quantity: "",
            source: "",
            remarks: "",
            category: "",
            product: "",
            currentStock: 0,
          });
          setErrors({});
          enqueueSnackbar("Stock updated successfully!", {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        } else {
          enqueueSnackbar("Internal server error", {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        }
      } catch (error: any) {
        if ("errorType" in error && "result" in error) {
          if (
            error.errorType === "fieldError" &&
            error.result !== null &&
            typeof error === "object"
          ) {
            setErrors(error.result as Record<string, string>);
          } else if ("message" in error) {
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
      }
    }
  }
};

///////////////fetching product data api/////

export const fetchProduct = async (
  id: string,
  field: string
): Promise<{ success: boolean; data: SearchOutput }> => {
  const data: { success: boolean; data: SearchOutput } = await request({
    url: `/api/fetch-productdata?id=${id}&field=${field}`,
  });
  return data;
};
