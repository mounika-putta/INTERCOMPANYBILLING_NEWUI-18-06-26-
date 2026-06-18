import { AxiosInstance } from "./api";


export const getInvoiveslist = async () => {
  const response = await AxiosInstance.get("/api/Billing/getInvoiveslist"); 
  return response.data;
};

export const saveInvoicegeneration = async (refNo) => {
  const response = await AxiosInstance.post(
    `/api/Billing/saveInvoicegeneration?Refno=${refNo}`
  );
  return response.data;
};

export const savequotationIvoiceApprovalPaidorCancel = async (InvoiceId, type, reason) => {
  debugger;
  try {
    const response = await AxiosInstance.post(
      "/api/Billing/savequotationIvoiceApprovalPaidorCancel",
      {
        InvoiceId, 
        type,       
        reason       
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error saving Invoice Paid/Cancel:",
      error.response?.data || error.message
    );
    throw error;
  }
};
