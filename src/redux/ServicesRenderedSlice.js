import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getServiceRenderedList, saveServiceRenderdetails,updateservicerendered,deleteservicerendered } from "../services/ServicesRenderedApi";

export const fetchServiceRenderedlist = createAsyncThunk(
  "ServiceRendered/fetchServiceRenderedlist",
  async () => {
    const response = await getServiceRenderedList();
    return response.list || [];   // SAFELY RETURN THE LIST
  }
);


export const createservicerendered = createAsyncThunk(
  'ServiceRendered/createservicerendered',
  async (servicedata, { rejectWithValue }) => {

    try {
      const res = await saveServiceRenderdetails(servicedata);
      return res;
    } catch (err) {
      let errorMessage = "service rendered save failed";

      if (err.response) {
        console.log("Backend error response:", err.response);

        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateService = createAsyncThunk(
  'ServiceRendered/updateService',
  async (updatedata, { rejectWithValue }) => {
   
    try {
      const res = await updateservicerendered(updatedata);
      return res;
    } catch (err) {
      let errorMessage = "Customer Update failed";

      if (err.response) {
        console.log("Backend error response:", err.response);

        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);
export const deleteService = createAsyncThunk(
  'ServiceRendered/deleteService',
  async (Id, { rejectWithValue }) => {
    debugger;
    try {
      const res = await deleteservicerendered(Id);
      return res;
    } catch (err) {
      console.log('err', err)
      let errorMessage = "Service rendered delete failed";

      if (err.response) {
        console.log("Backend error response:", err.response);

        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const ServicesRenderedSlice = createSlice({
  name: "servicesRendered",
  initialState: {
    Serviceslist: [],
    loading: false,
    error: null,
    saveResult: null,
    updateResult: null,
    deleteResult: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceRenderedlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceRenderedlist.fulfilled, (state, action) => {
        state.Serviceslist = action.payload;
        state.loading = false;
      })
      .addCase(fetchServiceRenderedlist.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
    // service(save)

    builder
      .addCase(createservicerendered.pending, (state, action) => {
        console.log('pending', action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(createservicerendered.fulfilled, (state, action) => {
        console.log('fulfilled', action.payload);
        state.saveResult = action.payload;
        state.loading = false;
      })
      .addCase(createservicerendered.rejected, (state, action) => {
        console.log('rejected', action.payload);
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
    // customers (update)

    builder
      .addCase(updateService.pending, (state, action) => {
        console.log('pending', action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        console.log('fulfilled', action.payload);
        state.updateResult = action.payload;
        state.loading = false;
      })
      .addCase(updateService.rejected, (state, action) => {
        console.log('rejected', action.payload);
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
    // customers (update)

    builder
      .addCase(deleteService.pending, (state, action) => {
        console.log('pending', action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        console.log('fulfilled', action.payload);
        state.deleteResult = action.payload;
        state.loading = false;
      })
      .addCase(deleteService.rejected, (state, action) => {
        console.log('rejected', action.payload);
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
  },
});




export default ServicesRenderedSlice.reducer;
