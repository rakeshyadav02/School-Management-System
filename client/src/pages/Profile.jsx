import React from "react";
import { Card, CardContent, Typography, Avatar, Box, Button, TextField, Stack } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const user = useAuth();
  // Placeholder for edit state and form handling
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: Implement save logic (API call)
    setEditMode(false);
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" flexDirection="column" mb={2}>
            <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
              {user?.name?.[0] || "U"}
            </Avatar>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography color="text.secondary">{user?.role}</Typography>
          </Box>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />
            {/* Add role-specific info here if needed */}
            {!editMode ? (
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Changes
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
