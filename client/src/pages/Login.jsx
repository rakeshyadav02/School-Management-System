import React, { useState } from "react";
import { Button, Container, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useLoginMutation } from "../features/auth/authApi";
import { notifyError, notifySuccess } from "../utils/notifications";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await login(form);
    if (!response.error) {
      notifySuccess("Login successful!");
      navigate("/dashboard");
    } else {
      notifyError(response.error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Welcome back
        </Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            Sign in
          </Button>
          <Link component={RouterLink} to="/register" underline="hover">
            Create an account
          </Link>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
