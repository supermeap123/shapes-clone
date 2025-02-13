import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IShape } from '../../types/shape';

interface ShapesState {
  shapes: IShape[];
  currentShape: IShape | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShapesState = {
  shapes: [],
  currentShape: null,
  loading: false,
  error: null,
};

export const fetchShapes = createAsyncThunk(
  'shapes/fetchShapes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/shapes');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shapes');
    }
  }
);

export const fetchShapeById = createAsyncThunk(
  'shapes/fetchShapeById',
  async (shapeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/shapes/${shapeId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shape');
    }
  }
);

export const updateShape = createAsyncThunk(
  'shapes/updateShape',
  async ({ shapeId, data }: { shapeId: string; data: Partial<IShape> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/v1/shapes/${shapeId}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update shape');
    }
  }
);

const shapesSlice = createSlice({
  name: 'shapes',
  initialState,
  reducers: {
    clearCurrentShape: (state) => {
      state.currentShape = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch shapes
      .addCase(fetchShapes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShapes.fulfilled, (state, action) => {
        state.loading = false;
        state.shapes = action.payload;
      })
      .addCase(fetchShapes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch shape by ID
      .addCase(fetchShapeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShapeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShape = action.payload;
      })
      .addCase(fetchShapeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update shape
      .addCase(updateShape.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShape.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShape = action.payload;
        const index = state.shapes.findIndex((shape) => shape._id === action.payload._id);
        if (index !== -1) {
          state.shapes[index] = action.payload;
        }
      })
      .addCase(updateShape.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentShape, setError, clearError } = shapesSlice.actions;
export default shapesSlice.reducer;
