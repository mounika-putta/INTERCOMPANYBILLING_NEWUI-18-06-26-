import { AxiosInstance } from "./api";


export const getQuotationorInvoicecount = async () => {
  const response = await AxiosInstance.get("/api/Billing/getQuotationorInvoicecount"); 
  return response.data;
};


export const getQuotationOrInvoiceDetails = async ({ type, status }) => {
  const response = await AxiosInstance.post(
  `/api/Billing/getQuotationorInvoicedetails?type=${type}&status=${status}`
   );
   debugger
  return response.data;
};

export const getDashboardReport = async (fromDate) => {
  
  const response = await AxiosInstance.get(
    `/api/Reports/dashboard`,
    {
      params: { fromDate }
    }
  );

  return response.data;
};

export const getReportDetails = async (type, status, fromDate) => {
  debugger
  const response = await AxiosInstance.get(
    `/api/Reports/details`,
    {
      params: {
        type,
        status,
        fromDate
      }
    }
  );

  return response.data;
};
