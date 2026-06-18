
import { AxiosInstance } from "./api";


export const getServiceRenderedList = async () => {
  const response = await AxiosInstance.get("/api/ServiceRendered/getServiceRenderedList"); 
  return response.data;
};

export const saveServiceRenderdetails = async (servicedata) => {
  debugger;
   console.log('servicedata',servicedata);
  const response = await AxiosInstance.post(
     "/api/ServiceRendered/saveServiceRenderdetails",
     servicedata, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  debugger;
  return response.data;
};

export const updateservicerendered = async (updatedata) => {
  debugger;
   console.log('servicedata',updatedata);
  const response = await AxiosInstance.post(
     "/api/ServiceRendered/updateservicerendered",
     updatedata, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  debugger;
  return response.data;
};
export const deleteservicerendered = async (id) => {
  debugger;
   console.log('servicedata',id);
   const response = await AxiosInstance.post(`/api/ServiceRendered/deleteservicerendered?Id=${id}`);
  debugger;
  return response.data;
};


