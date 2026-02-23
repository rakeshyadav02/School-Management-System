import React, { useState } from "react";
import { useGetHealthRecordsQuery, useAddHealthRecordMutation } from "../features/healthDiscipline/healthDisciplineApi";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from "@mui/material";

const HealthRecords = () => {
  const { studentId } = useParams();
  const { data, isLoading, error } = useGetHealthRecordsQuery(studentId);
  const [addHealthRecord] = useAddHealthRecordMutation();
  const [form, setForm] = useState({ date: "", details: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addHealthRecord({ ...form, studentId });
    setForm({ date: "", details: "" });
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Student Health Records</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mr: 2 }}
            required
          />
          <TextField
            label="Details"
            name="details"
            value={form.details}
            onChange={handleChange}
            sx={{ mr: 2, width: 300 }}
            required
          />
          <Button type="submit" variant="contained">Add Record</Button>
        </form>
      </Paper>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">Error loading records</Typography>
      ) : (
        <List>
          {data && data.length === 0 && <ListItem><ListItemText primary="No records found." /></ListItem>}
          {data && data.map((rec) => (
            <ListItem key={rec._id} divider>
              <ListItemText
                primary={rec.details}
                secondary={rec.date}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HealthRecords;
