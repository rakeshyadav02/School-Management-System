import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Chip,
  CircularProgress,
  TablePagination
} from "@mui/material";
import { Edit, Delete, Visibility, VisibilityOff, Search as SearchIcon } from "@mui/icons-material";
import {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation
} from "../../features/users/usersApi";
import { notifySuccess, notifyError } from "../../utils/notifications";

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    isActive: true
  });
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
  const [resetPasswordId, setResetPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const { data, isLoading } = useListUsersQuery({
    page: page + 1,
    limit: rowsPerPage,
    search: searchTerm,
    role: roleFilter
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingId(user._id);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        isActive: user.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        isActive: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowPassword(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || (!editingId && !formData.password)) {
        notifyError("Please fill all required fields");
        return;
      }

      if (editingId) {
        const updatePayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive
        };
        if (formData.password) updatePayload.password = formData.password;

        const response = await updateUser({
          id: editingId,
          data: updatePayload
        }).unwrap();
        notifySuccess("User updated successfully");
      } else {
        await createUser(formData).unwrap();
        notifySuccess("User created successfully");
      }
      handleCloseDialog();
    } catch (error) {
      notifyError(error?.data?.message || error?.message || "An error occurred");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      notifySuccess("User deleted successfully");
    } catch (error) {
      notifyError(error?.data?.message || error?.message || "Failed to delete user");
    }
  };

  const handleResetPasswordClick = (user) => {
    setResetPasswordId(user._id);
    setNewPassword("");
    setShowResetPassword(false);
    setResetPasswordDialog(true);
  };

  const handleResetPasswordSubmit = async () => {
    try {
      if (!newPassword || newPassword.length < 8) {
        notifyError("Password must be at least 8 characters");
        return;
      }
      await resetPassword({ id: resetPasswordId, newPassword }).unwrap();
      notifySuccess("Password reset successfully");
      setResetPasswordDialog(false);
    } catch (error) {
      notifyError(error?.data?.message || error?.message || "Failed to reset password");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleColor = (role) => {
    const colors = { admin: "error", teacher: "warning", student: "info" };
    return colors[role] || "default";
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "isActive", label: "Status" },
    { key: "actions", label: "Actions" }
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          disabled={isCreating || isUpdating || isDeleting}
        >
          Add New User
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search by name or email..."
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "action.active" }} />
              </InputAdornment>
            )
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} fontWeight="bold">
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users && data.users.length > 0 ? (
              data.users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color={getRoleColor(user.role)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? "Active" : "Inactive"}
                      color={user.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(user)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleResetPasswordClick(user)}
                      disabled={isResettingPassword || isDeleting}
                      title="Reset Password"
                    >
                      🔑
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={isDeleting || isUpdating}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {data?.pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={data.pagination.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TableContainer>

      {/* Create/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit User" : "Create New User"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            size="small"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            size="small"
          />
          <TextField
            fullWidth
            label={editingId ? "Password (Leave blank to not change)" : "Password"}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.isActive}
              label="Status"
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isCreating || isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog} onClose={() => setResetPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset User Password</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="New Password"
            type={showResetPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  edge="end"
                >
                  {showResetPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordDialog(false)} disabled={isResettingPassword}>
            Cancel
          </Button>
          <Button
            onClick={handleResetPasswordSubmit}
            variant="contained"
            color="primary"
            disabled={isResettingPassword}
          >
            {isResettingPassword ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
