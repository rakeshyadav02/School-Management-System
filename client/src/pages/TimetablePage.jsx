import React, { useState } from "react";
import { useGetTimetablesQuery, usePostTimetableMutation } from "../features/timetables/timetablesApi";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, Alert } from "@mui/material";

const TimetablePage = () => {
  const { data, isLoading, error } = useGetTimetablesQuery();
  const [postTimetable] = usePostTimetableMutation();
  const [form, setForm] = useState({ className: "", section: "", periods: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // periods: comma-separated for demo, should be structured in real app
    const periodsArr = form.periods.split(",").map((p) => ({ period: p.trim() }));
    await postTimetable({ ...form, periods: periodsArr });
  };

  if (isLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">Failed to load timetables.</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Timetables</Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <TextField label="Class" name="className" value={form.className} onChange={handleChange} required sx={{ mr: 2 }} />
        <TextField label="Section" name="section" value={form.section} onChange={handleChange} required sx={{ mr: 2 }} />
        <TextField label="Periods (comma separated)" name="periods" value={form.periods} onChange={handleChange} required sx={{ mr: 2 }} />
        <Button type="submit" variant="contained">Add Timetable</Button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Periods</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.timetables?.map((t) => (
              <TableRow key={t._id}>
                <TableCell>{t.className}</TableCell>
                <TableCell>{t.section}</TableCell>
                <TableCell>{t.periods.map((p, i) => p.period).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimetablePage;
