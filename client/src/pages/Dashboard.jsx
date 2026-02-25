import React from "react";
import { Card, CardContent, Grid, Typography, Box, CircularProgress, Avatar, Button, Stack, Divider, List, ListItem, ListItemText } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { useListStudentsQuery } from "../features/students/studentsApi";
import { useListTeachersQuery } from "../features/teachers/teachersApi";
import { useListClassesQuery } from "../features/classes/classesApi";
import { useListAttendanceQuery } from "../features/attendance/attendanceApi";
import { useListExamsQuery } from "../features/exams/examsApi";
import { useListFeesQuery } from "../features/fees/feesApi";
import { useGetAnnouncementsQuery } from "../features/announcements/announcementsApi";
import { useGetAdmissionsQuery } from "../features/admissions/admissionsApi";
import { useGetNotificationsQuery } from "../features/notifications/notificationsApi";
import { useGetTimetablesQuery } from "../features/timetables/timetablesApi";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const user = useAuth();
  const role = user?.role;

  // Announcements, Admissions, Notifications, Timetables
  const { data: announcementsData } = useGetAnnouncementsQuery();
  const { data: admissionsData } = useGetAdmissionsQuery(undefined, { skip: role !== "admin" });
  const { data: notificationsData } = useGetNotificationsQuery();
  const { data: timetablesData } = useGetTimetablesQuery(undefined, { skip: role === "admin" });

  const canViewStudents = ["admin", "teacher"].includes(role);
  const canViewTeachers = role === "admin";
  const canViewClasses = ["admin", "teacher"].includes(role);
  const canViewAttendance = ["admin", "teacher"].includes(role);
  const canViewFees = role === "admin";

  const students = useListStudentsQuery(
    { page: 1, limit: 100 },
    { skip: !canViewStudents }
  );
  const teachers = useListTeachersQuery(
    { page: 1, limit: 1 },
    { skip: !canViewTeachers }
  );
  const classes = useListClassesQuery(
    { page: 1, limit: 1 },
    { skip: !canViewClasses }
  );
  const attendance = useListAttendanceQuery(
    { page: 1, limit: 100 },
    { skip: !canViewAttendance }
  );
  const exams = useListExamsQuery({ page: 1, limit: 100 });
  const fees = useListFeesQuery({ page: 1, limit: 100 }, { skip: !canViewFees });

  const stats = [
    canViewStudents
      ? { label: "Students", value: students.data?.meta?.total || 0, color: "#1b5e20" }
      : null,
    canViewTeachers
      ? { label: "Teachers", value: teachers.data?.meta?.total || 0, color: "#ff8f00" }
      : null,
    canViewClasses
      ? { label: "Classes", value: classes.data?.meta?.total || 0, color: "#1976d2" }
      : null,
    canViewAttendance
      ? { label: "Attendance", value: attendance.data?.meta?.total || 0, color: "#d32f2f" }
      : null,
    { label: "Exams", value: exams.data?.meta?.total || 0, color: "#7b1fa2" },
    canViewFees
      ? {
          label: "Pending Fees",
          value: (fees.data?.items || []).filter((f) => f.status === "pending").length,
          color: "#f57c00"
        }
      : null
  ].filter(Boolean);

  // Attendance Status Chart Data
  const attendanceData = () => {
    const items = attendance.data?.items || [];
    const statusCount = {
      present: items.filter((a) => a.status === "present").length,
      absent: items.filter((a) => a.status === "absent").length,
      late: items.filter((a) => a.status === "late").length,
      excused: items.filter((a) => a.status === "excused").length
    };
    return [
      { name: "Present", value: statusCount.present, fill: "#4caf50" },
      { name: "Absent", value: statusCount.absent, fill: "#f44336" },
      { name: "Late", value: statusCount.late, fill: "#ff9800" },
      { name: "Excused", value: statusCount.excused, fill: "#9c27b0" }
    ];
  };

  // Fee Status Chart Data
  const feeData = () => {
    const items = fees.data?.items || [];
    const statusCount = {
      paid: items.filter((f) => f.status === "paid").length,
      pending: items.filter((f) => f.status === "pending").length,
      overdue: items.filter((f) => f.status === "overdue").length
    };
    return [
      { name: "Paid", value: statusCount.paid },
      { name: "Pending", value: statusCount.pending },
      { name: "Overdue", value: statusCount.overdue }
    ];
  };

  // Student Status Chart Data
  const studentStatusData = () => {
    const items = students.data?.items || [];
    const statusCount = {
      active: items.filter((s) => s.status === "active").length,
      inactive: items.filter((s) => s.status === "inactive").length
    };
    return [
      { name: "Active", value: statusCount.active },
      { name: "Inactive", value: statusCount.inactive }
    ];
  };

  const isLoading =
    students.isLoading ||
    teachers.isLoading ||
    classes.isLoading ||
    attendance.isLoading ||
    exams.isLoading ||
    fees.isLoading;


  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px">
        <CircularProgress />
      </Box>
    );
  }

  // Welcome message and profile summary
  const welcomeSection = (
    <Box mb={3} display="flex" alignItems="center" gap={2}>
      <Avatar sx={{ width: 56, height: 56 }}>{user?.name?.[0] || "U"}</Avatar>
      <Box>
        <Typography variant="h5">Welcome, {user?.name || "User"}!</Typography>
        <Typography color="text.secondary">Role: {role}</Typography>
      </Box>
    </Box>
  );

  // Notifications panel
  const notificationsSection = (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Notifications</Typography>
        <List dense>
          {(notificationsData?.slice?.(0, 5) || []).map((n, idx) => (
            <ListItem key={n._id || idx} divider>
              <ListItemText primary={n.title || n.message} secondary={n.date || null} />
            </ListItem>
          ))}
          {(!notificationsData || notificationsData.length === 0) && (
            <Typography color="text.secondary">No notifications</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );

  // Announcements panel
  const announcementsSection = (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Announcements</Typography>
        <List dense>
          {(announcementsData?.slice?.(0, 5) || []).map((a, idx) => (
            <ListItem key={a._id || idx} divider>
              <ListItemText primary={a.title} secondary={a.date || null} />
            </ListItem>
          ))}
          {(!announcementsData || announcementsData.length === 0) && (
            <Typography color="text.secondary">No announcements</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );

  // Quick links (role-based)
  const quickLinks = [
    ...(role === "admin"
      ? [
          { label: "Admissions", to: "/admissions" },
          { label: "Announcements", to: "/announcements" },
          { label: "Classes", to: "/classes" },
          { label: "Teachers", to: "/teachers" },
          { label: "Students", to: "/students" },
          { label: "Timetables", to: "/timetables" },
          { label: "Library", to: "/library" },
          { label: "Transport", to: "/transport" },
          { label: "Health/Discipline", to: "/health-discipline" },
        ]
      : []),
    ...(role === "teacher"
      ? [
          { label: "My Classes", to: "/classes" },
          { label: "Attendance", to: "/attendance" },
          { label: "Exams", to: "/exams" },
          { label: "Timetable", to: "/timetables" },
        ]
      : []),
    ...(role === "student"
      ? [
          { label: "My Timetable", to: "/timetables" },
          { label: "Assignments", to: "/assignments" },
          { label: "Upload Docs", to: "/admission-docs" },
        ]
      : []),
  ];

  const quickLinksSection = (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Quick Links</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {quickLinks.map((link) => (
            <Button key={link.label} variant="outlined" href={link.to} sx={{ mb: 1 }}>
              {link.label}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  // Recent activity (admin)
  const recentActivitySection = role === "admin" && (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <List dense>
          {(admissionsData?.slice?.(0, 5) || []).map((a, idx) => (
            <ListItem key={a._id || idx} divider>
              <ListItemText primary={`Admission: ${a.studentName || "-"}`} secondary={a.date || null} />
            </ListItem>
          ))}
          {(!admissionsData || admissionsData.length === 0) && (
            <Typography color="text.secondary">No recent admissions</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {welcomeSection}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Stat Cards */}
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.label}>
                <Card>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {/* Attendance Chart */}
            {canViewAttendance && (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Attendance Status
                    </Typography>
                    {attendanceData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={attendanceData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {attendanceData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography color="text.secondary">No attendance data</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
            {/* Fee Chart */}
            {canViewFees && (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Fee Status
                    </Typography>
                    {feeData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={feeData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#1b5e20" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography color="text.secondary">No fee data</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
            {/* Student Status Chart */}
            {canViewStudents && (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Student Status
                    </Typography>
                    {studentStatusData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studentStatusData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#ff8f00" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography color="text.secondary">No student data</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          {notificationsSection}
          {announcementsSection}
          {quickLinksSection}
          {recentActivitySection}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
