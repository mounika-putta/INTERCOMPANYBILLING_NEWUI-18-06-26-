import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardReport, getQuotationorInvoicecount, getQuotationOrInvoiceDetails, getReportDetails } from '../services/DashboardApi';

// Thunks
export const fetchcount = createAsyncThunk('dashboard/fetchcount', async () => {
  const response = await getQuotationorInvoicecount();
  debugger;
  return response;
});

export const fetchQuotationOrInvoiceDetails = createAsyncThunk(
  "dashboard/fetchQuotationOrInvoiceDetails",
  async ({ type, status }) => {
    const response = await getQuotationOrInvoiceDetails({ type, status });
    debugger
    return response;
  }
);

export const fetchDashboardReport = createAsyncThunk(
  "reports/fetchDashboardReport",
  async (fromDate, thunkAPI) => {
    try {
      return await getDashboardReport(fromDate);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);
export const fetchReportDetails = createAsyncThunk(
  "dashboard/fetchReportDetails",
  async ({ type, status, fromDate }) => {
    const response = await getReportDetails(
      type,
      status,
      fromDate
    );

    return response;
  }
);



const registrationSlice = createSlice({
  name: 'dashboardsData',
  initialState: {
    counts: [],
    reportsdashboardData: null,
    reportsloading: false,
    reportDetailsData: [],
    reportDetailsCount: 0,
    reportDetailsLoading: false,
    quotationOrInvoiceData: [],
    loading: false,
    error: null,
  },
  reducers: {
  clearReportDetails: (state) => {
    state.reportDetailsData = [];
    state.reportDetailsCount = 0;
  },

  clearDashboardData: (state) => {
    state.reportsdashboardData = null;
  }
},
  extraReducers: (builder) => {
    debugger
    // Count
    builder
      .addCase(fetchcount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcount.fulfilled, (state, action) => {
        console.log("Quotation Total:", action.payload.quotations);
        console.log("Invoice Approved:", action.payload.invoices);
        state.counts = action.payload;
        state.loading = false;
      })
      .addCase(fetchcount.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
    // Quotation/Invoice details fetching
    builder
      .addCase(fetchQuotationOrInvoiceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationOrInvoiceDetails.fulfilled, (state, action) => {
        // API returns: { data: [...], type: "Quotation" }
        state.quotationOrInvoiceData = action.payload?.data || [];
        console.log("Quotation/Invoice Data:", state.quotationOrInvoiceData);
        state.loading = false;
      })
      .addCase(fetchQuotationOrInvoiceDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
    builder
      .addCase(fetchDashboardReport.pending, (state) => {
        state.reportsloading = true;
        state.error = null;
      })

      .addCase(fetchDashboardReport.fulfilled, (state, action) => {
        console.log("Dashboard API Response:", action.payload);

        state.reportsloading = false;
        state.reportsdashboardData = action.payload;
      })

      .addCase(fetchDashboardReport.rejected, (state, action) => {
        state.reportsloading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchReportDetails.pending, (state) => {
        state.reportDetailsLoading = true;
      })

      .addCase(fetchReportDetails.fulfilled, (state, action) => {
        state.reportDetailsLoading = false;

        state.reportDetailsData =
          action.payload?.data ||
          action.payload?.Data ||
          [];

        state.reportDetailsCount =
          action.payload?.count ||
          action.payload?.Count ||
          0;
      })

      .addCase(fetchReportDetails.rejected, (state) => {
        state.reportDetailsLoading = false;
      })

  },
});
export const {
  clearReportDetails,
  clearDashboardData
} = registrationSlice.actions;
export default registrationSlice.reducer;

