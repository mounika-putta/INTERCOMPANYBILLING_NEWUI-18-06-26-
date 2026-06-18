import { AxiosInstance } from "./api";


export const getquotationslist = async () => {
  const response = await AxiosInstance.get("/api/Billing/getquotationslist"); 
  return response.data;
};

export const saveInvoicegeneration = async (refNo, templateUrl) => {
  debugger;
  const response = await AxiosInstance.post(
    `/api/Billing/saveInvoicegeneration?Refno=${encodeURIComponent(refNo)}&templateurl=${encodeURIComponent(templateUrl)}`
  );
  return response.data;
};
