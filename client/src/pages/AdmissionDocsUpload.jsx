import React, { useState } from "react";
import { useUploadDocumentMutation, useGetDocumentsQuery } from "../features/admissions/admissionDocsApi";
import { Box, Typography, Button, CircularProgress, Alert, List, ListItem, ListItemText } from "@mui/material";

const AdmissionDocsUpload = ({ admissionId }) => {
  const [file, setFile] = useState(null);
  const [uploadDocument, { isLoading, isSuccess, error }] = useUploadDocumentMutation();
  const { data, isLoading: docsLoading, error: docsError } = useGetDocumentsQuery(admissionId, { skip: !admissionId });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file && admissionId) {
      await uploadDocument({ id: admissionId, file });
    }
  };

  return (
    <Box>
      <Typography variant="h6">Upload Documents</Typography>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <Button type="submit" variant="contained" disabled={isLoading || !file} sx={{ ml: 2 }}>
          Upload
        </Button>
      </form>
      {isSuccess && <Alert severity="success">File uploaded!</Alert>}
      {error && <Alert severity="error">{error.data?.message || "Upload failed."}</Alert>}
      <Typography variant="h6" sx={{ mt: 2 }}>Submitted Documents</Typography>
      {docsLoading ? <CircularProgress /> : docsError ? <Alert severity="error">Failed to load documents.</Alert> : (
        <List>
          {data?.documents?.map((doc) => (
            <ListItem key={doc._id}>
              <ListItemText primary={doc.originalname} secondary={doc.uploadedAt && new Date(doc.uploadedAt).toLocaleString()} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AdmissionDocsUpload;
