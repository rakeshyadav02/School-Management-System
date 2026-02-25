import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useRegisterMutation } from "../features/auth/authApi";
import { notifyError, notifySuccess } from "../utils/notifications";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "student" });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const passwordRules = {
    minLength: "At least 8 characters",
    uppercase: "At least 1 uppercase letter",
    lowercase: "At least 1 lowercase letter",
    number: "At least 1 number",
    special: "At least 1 special character"
  };
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/;
  const isPasswordStrong = passwordPattern.test(form.password);
  const passwordChecks = {
    minLength: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z\d]/.test(form.password)
  };
  const isConfirmPasswordValid = form.confirmPassword.length > 0 && form.confirmPassword === form.password;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPasswordStrong) {
      notifyError({
        data: {
          message: "Please follow the password requirements.",
          details: Object.values(passwordRules)
        }
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      notifyError({ message: "Passwords do not match." });
      return;
    }

    const { confirmPassword, ...payload } = form;
    const response = await register(payload);
    if (!response.error) {
      notifySuccess("Account created successfully!");
      navigate("/dashboard");
    } else {
      notifyError(response.error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Create account
        </Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            label="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
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
            helperText="Use a strong password to protect your account."
            error={form.password.length > 0 && !isPasswordStrong}
            required
          />
          <Box sx={{ px: 0.5 }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Password requirements
            </Typography>
            {Object.entries(passwordRules).map(([key, rule]) => (
              <Typography
                key={key}
                variant="caption"
                color={passwordChecks[key] ? "success.main" : "text.secondary"}
                display="block"
              >
                {passwordChecks[key] ? "✓" : "•"} {rule}
              </Typography>
            ))}
          </Box>
          <TextField
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            error={form.confirmPassword.length > 0 && !isConfirmPasswordValid}
            helperText={form.confirmPassword.length > 0 && !isConfirmPasswordValid ? "Passwords do not match." : " "}
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !isPasswordStrong || form.password !== form.confirmPassword}
          >
            Create account
          </Button>
          <Link component={RouterLink} to="/login" underline="hover">
            Back to login
          </Link>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Register;
