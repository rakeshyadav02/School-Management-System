import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import RoleRoute from "../components/layout/RoleRoute";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Classes from "../pages/Classes";
import Attendance from "../pages/Attendance";
import Exams from "../pages/Exams";
import Fees from "../pages/Fees";
import Users from "../pages/admin/Users";
import NotFound from "../pages/NotFound";
import HealthRecords from "../pages/HealthRecords";
import DisciplineRecords from "../pages/DisciplineRecords";
import Announcements from "../pages/Announcements";
import Notifications from "../pages/Notifications";
import AdmissionForm from "../pages/AdmissionForm";
import AdmissionsAdmin from "../pages/AdmissionsAdmin";
import TimetablePage from "../pages/TimetablePage";
import LibraryPage from "../pages/LibraryPage";
import TransportPage from "../pages/TransportPage";

const AppRoutes = ({ isAuthLoading }) => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute isLoading={isAuthLoading} />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/students"
          element={
            <RoleRoute allowedRoles={["admin", "teacher"]}>
              <Students />
            </RoleRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Teachers />
            </RoleRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <RoleRoute allowedRoles={["admin", "teacher"]}>
              <Classes />
            </RoleRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <RoleRoute allowedRoles={["admin", "teacher"]}>
              <Attendance />
            </RoleRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <RoleRoute allowedRoles={["admin", "teacher", "student"]}>
              <Exams />
            </RoleRoute>
          }
        />
        <Route
          path="/fees"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Fees />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Users />
            </RoleRoute>
          }
        />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admission" element={<AdmissionForm />} />
        <Route
          path="/admissions-admin"
          element={
            <RoleRoute allowedRoles={["admin", "principal"]}>
              <AdmissionsAdmin />
            </RoleRoute>
          }
        />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route
          path="/students/:studentId/health"
          element={
            <RoleRoute allowedRoles={["admin", "teacher", "principal"]}>
              <HealthRecords />
            </RoleRoute>
          }
        />
        <Route
          path="/students/:studentId/discipline"
          element={
            <RoleRoute allowedRoles={["admin", "teacher", "principal"]}>
              <DisciplineRecords />
            </RoleRoute>
          }
        />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
