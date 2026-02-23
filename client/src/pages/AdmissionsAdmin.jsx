import React from "react";
import { useGetAdmissionsQuery, useUpdateAdmissionStatusMutation } from "../features/admissions/admissionsApi";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from "@mui/material";

const AdmissionsAdmin = () => {
  const { data, isLoading, error } = useGetAdmissionsQuery();
  const [updateStatus] = useUpdateAdmissionStatusMutation();

  if (isLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">Failed to load admissions.</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Admissions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.admissions?.map((a) => (
              <TableRow key={a._id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell>
                  {a.status === "pending" && (
                    <>
                      <Button size="small" color="success" onClick={() => updateStatus({ id: a._id, status: "approved" })}>Approve</Button>
                      <Button size="small" color="error" onClick={() => updateStatus({ id: a._id, status: "rejected" })}>Reject</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdmissionsAdmin;
