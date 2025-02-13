import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { hideConfirmDialog } from '../../store/slices/uiSlice';

const ConfirmDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { confirmDialog } = useSelector((state: RootState) => state.ui);

  const handleClose = () => {
    dispatch(hideConfirmDialog());
  };

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    handleClose();
  };

  return (
    <Dialog
      open={confirmDialog.open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{confirmDialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {confirmDialog.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
