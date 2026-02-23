import React from "react";

import CrudPage from "../components/CrudPage";
import {
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
  useListTeachersQuery,
  useUpdateTeacherMutation
} from "../features/teachers/teachersApi";

const Teachers = () => (
  <CrudPage
    title="Teachers"
    useListQuery={useListTeachersQuery}
    useCreateMutation={useCreateTeacherMutation}
    useUpdateMutation={useUpdateTeacherMutation}
    useDeleteMutation={useDeleteTeacherMutation}
    columns={[
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
      { field: "employeeId", label: "Employee ID" },
      { field: "department", label: "Department" },
      { field: "status", label: "Status" }
    ]}
    formFields={[
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "employeeId", label: "Employee ID" },
      { name: "department", label: "Department" },
      { name: "subjects", label: "Subjects", type: "textarea", getValue: (item) => (item.subjects || []).join(", ") },
      { name: "phone", label: "Phone" },
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
      subjects: values.subjects
        ? values.subjects.split(",").map((subject) => subject.trim()).filter(Boolean)
        : []
    })}
    searchPlaceholder="Search teachers"
  />
);

export default Teachers;
