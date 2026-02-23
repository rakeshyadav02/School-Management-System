import React, { useState } from "react";
import { useGetFeeStructuresQuery, useAddFeeStructureMutation, usePayFeeMutation, useGetPaymentsQuery } from "../features/fees/feeApi";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, Alert } from "@mui/material";

const FeePage = () => {
  const { data: feeData, isLoading: feeLoading, error: feeError } = useGetFeeStructuresQuery();
  const { data: paymentData, isLoading: paymentLoading, error: paymentError } = useGetPaymentsQuery();
  const [addFeeStructure] = useAddFeeStructureMutation();
  const [payFee] = usePayFeeMutation();
  const [form, setForm] = useState({ className: "", amount: "", dueDate: "", installments: "" });
  const [paymentForm, setPaymentForm] = useState({ studentId: "", feeId: "", amount: "", installmentNo: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  };

  const handleAddFee = async (e) => {
    e.preventDefault();
    await addFeeStructure({ ...form, amount: Number(form.amount), installments: Number(form.installments) });
  };
  const handlePayFee = async (e) => {
    e.preventDefault();
    await payFee({ ...paymentForm, amount: Number(paymentForm.amount), installmentNo: Number(paymentForm.installmentNo) });
  };

  if (feeLoading || paymentLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (feeError || paymentError) return <Alert severity="error">Failed to load fee data.</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Fee Management</Typography>
      <form onSubmit={handleAddFee} style={{ marginBottom: 24 }}>
        <TextField label="Class" name="className" value={form.className} onChange={handleChange} required sx={{ mr: 2 }} />
        <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} required sx={{ mr: 2 }} />
        <TextField label="Due Date" name="dueDate" value={form.dueDate} onChange={handleChange} sx={{ mr: 2 }} />
        <TextField label="Installments" name="installments" value={form.installments} onChange={handleChange} sx={{ mr: 2 }} />
        <Button type="submit" variant="contained">Add Fee Structure</Button>
      </form>
      <form onSubmit={handlePayFee} style={{ marginBottom: 24 }}>
        <TextField label="Student ID" name="studentId" value={paymentForm.studentId} onChange={handlePaymentChange} required sx={{ mr: 2 }} />
        <TextField label="Fee ID" name="feeId" value={paymentForm.feeId} onChange={handlePaymentChange} required sx={{ mr: 2 }} />
        <TextField label="Amount" name="amount" value={paymentForm.amount} onChange={handlePaymentChange} required sx={{ mr: 2 }} />
        <TextField label="Installment No" name="installmentNo" value={paymentForm.installmentNo} onChange={handlePaymentChange} sx={{ mr: 2 }} />
        <Button type="submit" variant="contained">Pay Fee</Button>
      </form>
      <Typography variant="h6">Fee Structures</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Installments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeData?.fees?.map((f) => (
              <TableRow key={f._id}>
                <TableCell>{f.className}</TableCell>
                <TableCell>{f.amount}</TableCell>
                <TableCell>{f.dueDate}</TableCell>
                <TableCell>{f.installments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6">Payments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Fee ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Installment No</TableCell>
              <TableCell>Paid At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentData?.payments?.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.studentId}</TableCell>
                <TableCell>{p.feeId}</TableCell>
                <TableCell>{p.amount}</TableCell>
                <TableCell>{p.installmentNo}</TableCell>
                <TableCell>{p.paidAt && new Date(p.paidAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FeePage;
