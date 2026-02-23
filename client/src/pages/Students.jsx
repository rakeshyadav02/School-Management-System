import React from "react";

import CrudPage from "../components/CrudPage";
import { useListClassesQuery } from "../features/classes/classesApi";
import {
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useListStudentsQuery,
  useUpdateStudentMutation
} from "../features/students/studentsApi";

const Students = () => {
  const { data: classData } = useListClassesQuery({ page: 1, limit: 100 });
  const classOptions = (classData?.items || []).map((item) => ({
    value: item._id,
    label: `${item.name}${item.section ? ` - ${item.section}` : ""} (${item.year})`
  }));

  return (
    <CrudPage
      title="Students"
      useListQuery={useListStudentsQuery}
      useCreateMutation={useCreateStudentMutation}
      useUpdateMutation={useUpdateStudentMutation}
      useDeleteMutation={useDeleteStudentMutation}
      columns={[
        { field: "name", label: "Name" },
        { field: "email", label: "Email" },
        { field: "rollNumber", label: "Roll No" },
        {
          field: "class.name",
          label: "Class",
          render: (item) =>
            item.class
              ? `${item.class.name}${item.class.section ? ` - ${item.class.section}` : ""}`
              : "-"
        },
        { field: "status", label: "Status" },
        {
          field: "actions",
          label: "Health/Discipline",
          render: (item) => (
            <>
              <a
                href={`/students/${item._id}/health`}
                style={{ marginRight: 8 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Health
              </a>
              <a
                href={`/students/${item._id}/discipline`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discipline
              </a>
            </>
          )
        }
      ]}
      formFields={[
        { name: "name", label: "Name" },
        { name: "email", label: "Email" },
        { name: "rollNumber", label: "Roll Number" },
        {
          name: "class",
          label: "Class",
          type: "select",
          options: classOptions,
          getValue: (item) => item.class?._id || "",
          required: true
        },
        { name: "guardianName", label: "Guardian Name" },
        { name: "guardianPhone", label: "Guardian Phone" },
        { name: "admissionDate", label: "Admission Date", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" }
          ],
          defaultValue: "active"
        }
      ]}
      normalizePayload={(values) => ({
        ...values,
        admissionDate: values.admissionDate || undefined
      })}
      searchPlaceholder="Search students"
    />
  );
};

export default Students;
