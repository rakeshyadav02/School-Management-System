import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Alert,
  Box
} from "@mui/material";
import CrudPage from "../components/CrudPage";
import { useListClassesQuery } from "../features/classes/classesApi";
import { useListStudentsQuery } from "../features/students/studentsApi";
import { useListTeachersQuery } from "../features/teachers/teachersApi";
import {
  useCreateAttendanceMutation,
  useDeleteAttendanceMutation,
  useListAttendanceQuery,
  useUpdateAttendanceMutation,
  useBulkMarkAttendanceMutation
} from "../features/attendance/attendanceApi";
import { notifySuccess, notifyError } from "../utils/notifications";

const Attendance = () => {
  const { data: studentsData } = useListStudentsQuery({ page: 1, limit: 100 });
  const { data: classesData } = useListClassesQuery({ page: 1, limit: 100 });
  const { data: teachersData } = useListTeachersQuery({ page: 1, limit: 100 });
  const [bulkMarkDialogOpen, setBulkMarkDialogOpen] = useState(false);
  const [bulkMarkForm, setBulkMarkForm] = useState({
    classId: "",
    date: "",
    status: "present"
  });
  const [bulkMarkAttendance, { isLoading: isBulkMarking }] = useBulkMarkAttendanceMutation();

  const studentOptions = (studentsData?.items || []).map((item) => ({
    value: item._id,
    label: item.name
  }));
  const classOptions = (classesData?.items || []).map((item) => ({
    value: item._id,
    label: `${item.name}${item.section ? ` - ${item.section}` : ""}`
  }));
  const teacherOptions = (teachersData?.items || []).map((item) => ({
    value: item._id,
    label: item.name
  }));

  const handleBulkMarkSubmit = async () => {
    try {
      if (!bulkMarkForm.classId || !bulkMarkForm.date || !bulkMarkForm.status) {
        notifyError("Please fill all fields");
        return;
      }
      const response = await bulkMarkAttendance({
        classId: bulkMarkForm.classId,
        date: bulkMarkForm.date,
        status: bulkMarkForm.status
      }).unwrap();
      notifySuccess(
        `Marked ${response.recordsCreated} students as ${bulkMarkForm.status}. ${response.alreadyMarked} already had records for this date.`
      );
      setBulkMarkDialogOpen(false);
      setBulkMarkForm({ classId: "", date: "", status: "present" });
    } catch (error) {
      notifyError(error?.data?.message || error?.message || "Failed to mark attendance");
    }
  };

  return (
    <>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setBulkMarkDialogOpen(true)}
        >
          Bulk Mark Attendance
        </Button>
      </Box>

      <CrudPage
        title="Attendance"
        singularLabel="Attendance"
        useListQuery={useListAttendanceQuery}
        useCreateMutation={useCreateAttendanceMutation}
        useUpdateMutation={useUpdateAttendanceMutation}
        useDeleteMutation={useDeleteAttendanceMutation}
        columns={[
          { field: "student.name", label: "Student", render: (item) => item.student?.name || "-" },
          { field: "class.name", label: "Class", render: (item) => item.class?.name || "-" },
          {
            field: "date",
            label: "Date",
            render: (item) => new Date(item.date).toLocaleDateString()
          },
          { field: "status", label: "Status" },
          {
            field: "takenBy.name",
            label: "Taken By",
            render: (item) => item.takenBy?.name || "-"
          }
        ]}
        formFields={[
          { name: "student", label: "Student", type: "select", options: studentOptions, getValue: (item) => item.student?._id || "" },
          { name: "class", label: "Class", type: "select", options: classOptions, getValue: (item) => item.class?._id || "" },
          { name: "date", label: "Date", type: "date" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "present", label: "Present" },
              { value: "absent", label: "Absent" },
              { value: "late", label: "Late" },
              { value: "excused", label: "Excused" }
            ],
            defaultValue: "present"
          },
          { name: "takenBy", label: "Taken By", type: "select", options: teacherOptions, getValue: (item) => item.takenBy?._id || "" }
        ]}
        normalizePayload={(values) => ({
          ...values,
          date: values.date || undefined
        })}
        searchPlaceholder="Search attendance"
      />

      {/* Bulk Mark Dialog */}
      <Dialog open={bulkMarkDialogOpen} onClose={() => setBulkMarkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Mark Attendance</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Mark entire class present/absent/late for a specific date. Existing records will be skipped.
          </Alert>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Class</InputLabel>
              <Select
                value={bulkMarkForm.classId}
                label="Class"
                onChange={(e) => setBulkMarkForm({ ...bulkMarkForm, classId: e.target.value })}
              >
                <MenuItem value="">Select Class</MenuItem>
                {classOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={bulkMarkForm.date}
              onChange={(e) => setBulkMarkForm({ ...bulkMarkForm, date: e.target.value })}
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={bulkMarkForm.status}
                label="Status"
                onChange={(e) => setBulkMarkForm({ ...bulkMarkForm, status: e.target.value })}
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
                <MenuItem value="excused">Excused</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkMarkDialogOpen(false)} disabled={isBulkMarking}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkMarkSubmit}
            variant="contained"
            color="primary"
            disabled={isBulkMarking}
          >
            {isBulkMarking ? "Marking..." : "Mark Attendance"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Attendance;
