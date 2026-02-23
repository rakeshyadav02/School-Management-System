import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { notifyError, notifySuccess } from "../utils/notifications";

const getValueByPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);

const buildInitialValues = (fields) =>
  fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {});

const CrudPage = ({
  title,
  singularLabel,
  columns,
  useListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  formFields,
  normalizePayload,
  queryParams,
  searchPlaceholder,
  canCreate = true,
  canEdit = true,
  canDelete = true
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState(buildInitialValues(formFields));
  const [fieldErrors, setFieldErrors] = useState({});

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      ...(search ? { search } : {}),
      ...(queryParams || {})
    }),
    [page, rowsPerPage, search, queryParams]
  );

  const { data, isLoading } = useListQuery(params);
  const [createItem, { isLoading: creating }] = useCreateMutation();
  const [updateItem, { isLoading: updating }] = useUpdateMutation();
  const [deleteItem] = useDeleteMutation();

  const items = data?.items || [];
  const total = data?.meta?.total || 0;

  const validateField = (fieldName, value) => {
    const field = formFields.find((f) => f.name === fieldName);
    if (!field) return "";

    // Check if required and empty
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${field.label} must be a valid email`;
      }
    }

    // Number validation
    if (field.type === "number" && value) {
      if (isNaN(value)) {
        return `${field.label} must be a number`;
      }
      if (field.min !== undefined && Number(value) < field.min) {
        return `${field.label} must be at least ${field.min}`;
      }
      if (field.max !== undefined && Number(value) > field.max) {
        return `${field.label} must be at most ${field.max}`;
      }
    }

    // Min length validation
    if (field.minLength && value && value.toString().length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    // Max length validation
    if (field.maxLength && value && value.toString().length > field.maxLength) {
      return `${field.label} must be at most ${field.maxLength} characters`;
    }

    return "";
  };

  const validateForm = () => {
    const errors = {};
    formFields.forEach((field) => {
      const error = validateField(field.name, formValues[field.name]);
      if (error) {
        errors[field.name] = error;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (fieldName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value
    }));
    // Clear error as user types
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: ""
      }));
    }
  };

  const handleOpenCreate = () => {
    if (!canCreate) {
      return;
    }
    setEditingItem(null);
    setFormValues(buildInitialValues(formFields));
    setFieldErrors({});
    setDialogOpen(true);
  };

  const handleOpenEdit = (item) => {
    if (!canEdit) {
      return;
    }
    setEditingItem(item);
    const nextValues = buildInitialValues(formFields);
    formFields.forEach((field) => {
      nextValues[field.name] = field.getValue ? field.getValue(item) : item[field.name] ?? "";
    });
    setFormValues(nextValues);
    setFieldErrors({});
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      notifyError("Please fix the errors in the form");
      return;
    }

    try {
      const payload = normalizePayload ? normalizePayload(formValues) : formValues;

      if (editingItem) {
        const response = await updateItem({ id: editingItem._id, data: payload });
        if (response.error) {
          notifyError(response.error);
          return;
        }
        notifySuccess("Record updated successfully!");
      } else {
        const response = await createItem(payload);
        if (response.error) {
          notifyError(response.error);
          return;
        }
        notifySuccess("Record created successfully!");
      }

      setDialogOpen(false);
    } catch (error) {
      notifyError(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteItem(id);
      if (response.error) {
        notifyError(response.error);
        return;
      }
      notifySuccess("Record deleted successfully!");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
        <Box flexGrow={1}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage {title.toLowerCase()} records
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder={searchPlaceholder || "Search"}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 220 }}
        />
        {canCreate && (
          <Button variant="contained" onClick={handleOpenCreate} disabled={creating || updating || isLoading}>
            Add {singularLabel || title.slice(0, -1)}
          </Button>
        )}
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>{col.label}</TableCell>
            ))}
            {(canEdit || canDelete) && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id} hover>
              {columns.map((col) => (
                <TableCell key={col.field}>
                  {col.render
                    ? col.render(item)
                    : getValueByPath(item, col.field) || "-"}
                </TableCell>
              ))}
              {(canEdit || canDelete) && (
                <TableCell align="right">
                  {canEdit && (
                    <IconButton onClick={() => handleOpenEdit(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {canDelete && (
                    <IconButton onClick={() => {
                      setDeleteId(item._id);
                      setDeleteConfirmOpen(true);
                    }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + (canEdit || canDelete ? 1 : 0)} align="center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? "Edit" : "Create"}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              {formFields.map((field) => (
                <TextField
                  key={field.name}
                  select={field.type === "select"}
                  type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                  label={field.label}
                  value={formValues[field.name]}
                  onChange={(event) =>
                    handleFieldChange(field.name, event.target.value)
                  }
                  error={!!fieldErrors[field.name]}
                  helperText={fieldErrors[field.name]}
                  InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                  multiline={field.type === "textarea"}
                  minRows={field.type === "textarea" ? 3 : undefined}
                  fullWidth
                  required={field.required}
                >
                  {field.type === "select" &&
                    (field.options || []).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={creating || updating}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={creating || updating}>
              {creating || updating ? "Saving..." : editingItem ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this record? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await handleDelete(deleteId);
              setDeleteConfirmOpen(false);
              setDeleteId(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CrudPage;
