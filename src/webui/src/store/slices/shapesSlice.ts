import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IShape } from '../../types/shape';

const API_URL = 'http://localhost:5001/api/v1';

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
      const response = await axios.get(`${API_URL}/shapes`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shapes');
    }
  }
);

export const fetchShapeById = createAsyncThunk(
  'shapes/fetchShapeById',
  async (shapeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/shapes/${shapeId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shape');
    }
  }
);

export const createShape = createAsyncThunk(
  'shapes/createShape',
  async (_, { rejectWithValue }) => {
    try {
      const initialShape = {
        profile: {
          nickname: 'New Shape',
          description: 'A new AI personality',
        },
        personality: {
          traits: [],
          tone: 'casual',
        },
        freeWill: {
          levelOfFreeWill: 'semi-autonomous',
          directMessages: false,
          temperature: 0.7,
          numberOfMessages: 1,
        },
        aiEngine: {
          primaryEngine: 'gpt-4-turbo',
        },
        imageEngine: {
          textCommandPrefix: '!imagine',
          engine: 'stable-diffusion-xl',
        },
        voiceEngine: {
          voiceResponses: false,
        },
        knowledge: {
          generalKnowledge: [],
          commands: [],
        },
        training: {
          conversationSnippets: [],
        },
        settings: {
          shapeOwners: [],
          privacySettings: {
            serverListVisibility: false,
            dmResponseSettings: {
              enabled: false,
              allowlist: [],
              blocklist: [],
            },
            ignoreList: [],
          },
          customMessages: {},
        },
      };

      const response = await axios.post(`${API_URL}/shapes`, initialShape);
      // Ensure we have a valid shape object with an _id
      const shapeData = response.data;
      if (!shapeData || typeof shapeData !== 'object' || !('_id' in shapeData)) {
        throw new Error('Invalid shape data received from server');
      }
      return shapeData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create shape');
    }
  }
);

export const updateShape = createAsyncThunk(
  'shapes/updateShape',
  async ({ shapeId, updates }: { shapeId: string; updates: Partial<IShape> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/shapes/${shapeId}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update shape');
    }
  }
);

const shapesSlice = createSlice({
  name: 'shapes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentShape: (state) => {
      state.currentShape = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shapes
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
      // Fetch Shape by ID
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
      // Create Shape
      .addCase(createShape.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShape.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we have a valid shape object
        if (action.payload && '_id' in action.payload) {
          state.shapes.push(action.payload);
          state.currentShape = action.payload;
        }
      })
      .addCase(createShape.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Shape
      .addCase(updateShape.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShape.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShape = action.payload;
        state.shapes = state.shapes.map((shape) =>
          shape._id === action.payload._id ? action.payload : shape
        );
      })
      .addCase(updateShape.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentShape } = shapesSlice.actions;
export default shapesSlice.reducer;
