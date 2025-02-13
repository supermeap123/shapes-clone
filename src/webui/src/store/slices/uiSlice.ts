import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  confirmDialog: {
    open: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  };
  selectedSection: string | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  },
  selectedSection: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode.toString());
    },
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
      }>
    ) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    showConfirmDialog: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        onConfirm: () => void;
      }>
    ) => {
      state.confirmDialog = {
        open: true,
        title: action.payload.title,
        message: action.payload.message,
        onConfirm: action.payload.onConfirm,
      };
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog = {
        ...state.confirmDialog,
        open: false,
        onConfirm: null,
      };
    },
    setSelectedSection: (state, action: PayloadAction<string>) => {
      state.selectedSection = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleDarkMode,
  showSnackbar,
  hideSnackbar,
  showConfirmDialog,
  hideConfirmDialog,
  setSelectedSection,
} = uiSlice.actions;

export default uiSlice.reducer;
