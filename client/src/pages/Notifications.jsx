import React from "react";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "../features/notifications/notificationsApi";
import { List, ListItem, ListItemText, IconButton, Typography, CircularProgress, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const Notifications = () => {
  const { data, isLoading, error } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();

  if (isLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Typography color="error">Failed to load notifications.</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Notifications</Typography>
      <List>
        {data?.notifications?.length === 0 && <Typography>No notifications found.</Typography>}
        {data?.notifications?.map((n) => (
          <ListItem key={n._id} secondaryAction={
            !n.read && (
              <IconButton edge="end" aria-label="mark as read" onClick={() => markRead(n._id)}>
                <CheckIcon />
              </IconButton>
            )
          }>
            <ListItemText
              primary={n.message}
              secondary={n.type ? n.type : null}
              style={{ textDecoration: n.read ? "line-through" : "none" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;
