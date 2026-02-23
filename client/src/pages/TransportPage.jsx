import React, { useState } from "react";
import { useGetRoutesQuery, useAddRouteMutation, useAssignStudentMutation, useAssignDriverMutation } from "../features/transport/transportApi";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, Alert } from "@mui/material";

const TransportPage = () => {
  const { data, isLoading, error } = useGetRoutesQuery();
  const [addRoute] = useAddRouteMutation();
  const [assignStudent] = useAssignStudentMutation();
  const [assignDriver] = useAssignDriverMutation();
  const [form, setForm] = useState({ name: "", stops: "" });
  const [studentId, setStudentId] = useState("");
  const [driverId, setDriverId] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    const stopsArr = form.stops.split(",").map((s) => s.trim());
    await addRoute({ ...form, stops: stopsArr });
  };

  if (isLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">Failed to load routes.</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Transport Management</Typography>
      <form onSubmit={handleAddRoute} style={{ marginBottom: 24 }}>
        <TextField label="Route Name" name="name" value={form.name} onChange={handleChange} required sx={{ mr: 2 }} />
        <TextField label="Stops (comma separated)" name="stops" value={form.stops} onChange={handleChange} required sx={{ mr: 2 }} />
        <Button type="submit" variant="contained">Add Route</Button>
      </form>
      <TextField label="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} sx={{ mr: 2 }} />
      <TextField label="Driver ID" value={driverId} onChange={e => setDriverId(e.target.value)} sx={{ mr: 2 }} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Route Name</TableCell>
              <TableCell>Stops</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Drivers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.routes?.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.stops.join(", ")}</TableCell>
                <TableCell>{(r.students || []).join(", ")}</TableCell>
                <TableCell>{(r.drivers || []).join(", ")}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => assignStudent({ id: r._id, studentId })}>Assign Student</Button>
                  <Button size="small" onClick={() => assignDriver({ id: r._id, driverId })}>Assign Driver</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransportPage;
