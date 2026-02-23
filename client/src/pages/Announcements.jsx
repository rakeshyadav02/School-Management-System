import React from "react";
import { useGetAnnouncementsQuery } from "../features/announcements/announcementsApi";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";

const Announcements = () => {
  const { data, isLoading, error } = useGetAnnouncementsQuery();

  if (isLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Typography color="error">Failed to load announcements.</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Announcements</Typography>
      {data?.announcements?.length === 0 && <Typography>No announcements found.</Typography>}
      {data?.announcements?.map((a) => (
        <Card key={a._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{a.title}</Typography>
            <Typography variant="body2">{a.message}</Typography>
            <Typography variant="caption" color="text.secondary">
              {a.audience ? `Audience: ${a.audience}` : ""}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Announcements;
