import React from "react";
import { Card, CardContent, Grid, Typography, Box, CircularProgress } from "@mui/material";
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
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const user = useAuth();
  const role = user?.role;

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

  return (
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
  );
};

export default Dashboard;
