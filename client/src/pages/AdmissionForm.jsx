import React, { useState } from "react";
import { useSubmitAdmissionMutation } from "../features/admissions/admissionsApi";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const AdmissionForm = () => {
  const [form, setForm] = useState({ name: "", email: "", details: "" });
  const [submitAdmission, { isLoading, isSuccess, error }] = useSubmitAdmissionMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitAdmission({ ...form, details: { info: form.details } });
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" gutterBottom>Admission Form</Typography>
      {isSuccess && <Alert severity="success">Admission submitted!</Alert>}
      {error && <Alert severity="error">{error.data?.message || "Submission failed."}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Details"
          name="details"
          value={form.details}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading} sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AdmissionForm;
