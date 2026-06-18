import { AxiosInstance } from "./api";

export const getInvoiceRefNo = async () => {
  const response = await AxiosInstance.get("/api/Billing/getInvoiceRefno");
  return response.data;
};
