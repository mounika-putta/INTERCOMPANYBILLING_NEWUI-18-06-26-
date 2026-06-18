import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getquotationslist, saveInvoicegeneration } from '../services/QuotationApprovalApi';

// Thunks
export const fetchQuotationlist = createAsyncThunk('user/fetchQuotationlist', async () => {
  const response = await getquotationslist();
  return response.list;

});

export const savegenerateinvoicewitherefno = createAsyncThunk(
  'user/savegenerateinvoicewitherefno',
  async ({ refNo, templateUrl }) => {
    debugger;
    const data = await saveInvoicegeneration(refNo, templateUrl);
    return data;
  }
);


const QuotationApprovalSlice = createSlice({
  name: 'quotationData',
  initialState: {
    quotationList: [],
    statusofInvoicegeneration: {}, 
    loadingByRefNo: {},           
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // approval quotation list
    builder
      .addCase(fetchQuotationlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationlist.fulfilled, (state, action) => {
        console.log('quotationlist', action.payload);
        state.quotationList = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuotationlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      });

    // generate Invoice
    builder
      .addCase(savegenerateinvoicewitherefno.pending, (state, action) => {
        const refNo = action.meta.arg;   // the refNo passed to thunk
        state.loadingByRefNo[refNo] = true;
        state.error = null;
      })
      .addCase(savegenerateinvoicewitherefno.fulfilled, (state, action) => {
        const refNo = action.meta.arg;
        state.statusofInvoicegeneration[refNo] = action.payload; 
        console.log('action.payload',action.payload);
        state.loadingByRefNo[refNo] = false;
      })
      .addCase(savegenerateinvoicewitherefno.rejected, (state, action) => {
        const refNo = action.meta.arg;
        state.error = action.payload || action.error.message;
        state.loadingByRefNo[refNo] = false;
      });
  },
});


export default QuotationApprovalSlice.reducer;