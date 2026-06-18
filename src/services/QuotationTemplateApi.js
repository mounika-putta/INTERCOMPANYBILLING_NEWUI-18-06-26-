import { AxiosInstance } from "./api";

export const getqouationdetailswithrefno = async (refNo) => {
    debugger;
  console.log('AxiosInstance',AxiosInstance);
  const response = await AxiosInstance.get('/api/Billing/getqouationdetailswithrefno', {
    params: { refNo: refNo }
  });
  debugger;
  return response.data;
};

export const getinvoicedetailswithrefno = async (refNo) => {
  debugger;
  console.log('AxiosInstance',AxiosInstance);
  const response = await AxiosInstance.get('/api/Billing/getinvoicedetailswithrefno', {
    params: { refNo: refNo }
  });
  return response.data;
};

export const getcreditnotedetailswithrefno = async (refNo) => {
  debugger;
  console.log('AxiosInstance',AxiosInstance);
  const response = await AxiosInstance.get('/api/Billing/getcreditnotedetailswithrefno', {
    params: { refNo: refNo }
  });
  return response.data;
};

export const getCreditnotedetailswithInvoicerefno = async (refNo) => {
  debugger;
  console.log('AxiosInstance',AxiosInstance);
  const response = await AxiosInstance.get('/api/Billing/getCreditnotedetailswithInvoicerefno', {
    params: { refNo: refNo }
  });
  return response.data;
};


export const savequotationApprovalorRejection = async (quotationId, type, reason) => {
  debugger;
  try {
    const response = await AxiosInstance.post(
      "/api/Billing/savequotationApprovalorRejection",
      {
        quotationId, 
        type,       
        reason       
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error saving quotation approval/rejection:",
      error.response?.data || error.message
    );
    throw error;
  }
};

