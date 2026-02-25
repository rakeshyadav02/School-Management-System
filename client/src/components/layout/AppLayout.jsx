import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import QuizIcon from "@mui/icons-material/Quiz";
import PaymentsIcon from "@mui/icons-material/Payments";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useLogoutMutation } from "../../features/auth/authApi";

const drawerWidth = 240;

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import GavelIcon from "@mui/icons-material/Gavel";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Profile", path: "/profile", icon: <AssignmentIndIcon />, roles: ["student"] },
  { label: "Announcements", path: "/announcements", icon: <AnnouncementIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Admissions", path: "/admissions", icon: <AssignmentIndIcon />, roles: ["admin", "teacher"] },
  { label: "Students", path: "/students", icon: <PeopleIcon />, roles: ["admin", "teacher"] },
  { label: "Teachers", path: "/teachers", icon: <SchoolIcon />, roles: ["admin"] },
  { label: "Classes", path: "/classes", icon: <ClassIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Attendance", path: "/attendance", icon: <FactCheckIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Exams", path: "/exams", icon: <QuizIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Fees", path: "/fees", icon: <PaymentsIcon />, roles: ["admin", "student"] },
  { label: "Library", path: "/library", icon: <LibraryBooksIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Transport", path: "/transport", icon: <DirectionsBusIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Notifications", path: "/notifications", icon: <NotificationsIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Timetable", path: "/timetable", icon: <CalendarMonthIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Health Records", path: "/health", icon: <HealthAndSafetyIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Discipline Records", path: "/discipline", icon: <GavelIcon />, roles: ["admin", "teacher", "student"] },
  { label: "Users", path: "/admin/users", icon: <AdminPanelSettingsIcon />, roles: ["admin"] }
];

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuth();
  const [logout] = useLogoutMutation();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role));

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap>
          SchoolMS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {visibleItems.map((item) => {
          // Only exact match for dashboard, startsWith for others
          const isSelected = item.path === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(item.path) && item.path !== "/dashboard";
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isSelected}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #1b5e20, #2e7d32)"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {navItems.find((item) => item.path === location.pathname)?.label ||
              "School Management System"}
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
