import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEntitiesList,saveReceivingEntity,updateReceivingEntity,deleteReceivingEntity } from "../services/ReceivingEntitiesApi"; // ✅ keep if you have it

// ✅ Thunk for creating entity

export const fetchCompaniesList = createAsyncThunk('receivingEntities/fetchComapnieslist', async () => {
  const response = await getEntitiesList();
  return response.list; 
});

export const createReceivingEntity = createAsyncThunk(
  "receivingEntities/create",
  async (entityData, { rejectWithValue }) => {
    debugger;
    try {
      const response = await saveReceivingEntity(entityData);
      debugger
      return response; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error saving entity");
    }
  }
);

export const FetchdeleteEntity = createAsyncThunk(
  "receivingEntities/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteReceivingEntity(id);
      return { id, message: response.message }; // ✅ pick the message property
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete receiving entity"
      );
    }
  }
);


// ✅ Thunk for updating entity
export const FetchupdateReceivingEntity = createAsyncThunk( 
  "receivingEntities/update", async ({ id, payload  }, { rejectWithValue }) => {
    debugger;
   try { const response = await updateReceivingEntity(id, payload ); 
    return response; // should return updated entity 
    } catch (error) { 
    return rejectWithValue( error.response?.data || "Failed to update receiving entity" ); } } 
  );

const receivingEntitiesSlice = createSlice({
  name: "receivingEntities",
  initialState: {
    companies: [],
    entities: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetEntityState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
     builder
      .addCase(fetchCompaniesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesList.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
        
      })
      .addCase(fetchCompaniesList.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
    builder
    
      .addCase(createReceivingEntity.pending, (state) => {
        debugger
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReceivingEntity.fulfilled, (state, action) => {
        debugger
        state.loading = false;
        state.success = true;
        state.entities.push(action.payload);
      })
      .addCase(createReceivingEntity.rejected, (state, action) => {
        debugger
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update entity
      .addCase(FetchupdateReceivingEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(FetchupdateReceivingEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedEntity = action.payload.entity || action.payload; // depends on backend
        const index = state.entities.findIndex((e) => e.Id === updatedEntity.Id);

        if (index !== -1) {
          state.entities[index] = updatedEntity;
        }
      })
      .addCase(FetchupdateReceivingEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // ✅ Delete entity 
       .addCase(FetchdeleteEntity.pending, (state) => {
         state.loading = true;
          state.error = null; 
          state.success = false; }) 
      .addCase(FetchdeleteEntity.fulfilled, (state, action) => { 
        state.loading = false; 
        state.success = true; 
        state.entities = state.entities.filter((e) => e.Id !== action.payload.id); }) 
      .addCase(FetchdeleteEntity.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; })
      
  },
});

export const { resetEntityState } = receivingEntitiesSlice.actions;
export default receivingEntitiesSlice.reducer;
