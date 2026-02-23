import React, { useState } from "react";
import { useGetBooksQuery, useAddBookMutation, useIssueBookMutation, useReturnBookMutation } from "../features/library/libraryApi";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, Alert } from "@mui/material";

const LibraryPage = () => {
  const { data, isLoading, error } = useGetBooksQuery();
  const [addBook] = useAddBookMutation();
  const [issueBook] = useIssueBookMutation();
  const [returnBook] = useReturnBookMutation();
  const [form, setForm] = useState({ title: "", author: "", isbn: "" });
  const [userId, setUserId] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    await addBook(form);
  };

  if (isLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">Failed to load books.</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Library</Typography>
      <form onSubmit={handleAddBook} style={{ marginBottom: 24 }}>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} required sx={{ mr: 2 }} />
        <TextField label="Author" name="author" value={form.author} onChange={handleChange} required sx={{ mr: 2 }} />
        <TextField label="ISBN" name="isbn" value={form.isbn} onChange={handleChange} sx={{ mr: 2 }} />
        <Button type="submit" variant="contained">Add Book</Button>
      </form>
      <TextField label="Your User ID" value={userId} onChange={e => setUserId(e.target.value)} sx={{ mb: 2 }} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.books?.map((b) => (
              <TableRow key={b._id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>{b.available ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {b.available ? (
                    <Button size="small" onClick={() => issueBook({ bookId: b._id, userId })}>Issue</Button>
                  ) : (
                    <Button size="small" onClick={() => returnBook({ bookId: b._id, userId })}>Return</Button>
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

export default LibraryPage;
