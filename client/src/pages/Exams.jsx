import React from "react";

import CrudPage from "../components/CrudPage";
import { useListClassesQuery } from "../features/classes/classesApi";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateExamMutation,
  useDeleteExamMutation,
  useListExamsQuery,
  useUpdateExamMutation
} from "../features/exams/examsApi";

const Exams = () => {
  const user = useAuth();
  const canManageExams = ["admin", "teacher"].includes(user?.role);
  const { data: classesData } = useListClassesQuery(
    { page: 1, limit: 100 },
    { skip: !canManageExams }
  );
  const classOptions = (classesData?.items || []).map((item) => ({
    value: item._id,
    label: `${item.name}${item.section ? ` - ${item.section}` : ""}`
  }));

  return (
    <CrudPage
      title="Exams"
      useListQuery={useListExamsQuery}
      useCreateMutation={useCreateExamMutation}
      useUpdateMutation={useUpdateExamMutation}
      useDeleteMutation={useDeleteExamMutation}
      canCreate={canManageExams}
      canEdit={canManageExams}
      canDelete={canManageExams}
      columns={[
        { field: "class.name", label: "Class", render: (item) => item.class?.name || "-" },
        { field: "subject", label: "Subject" },
        {
          field: "examDate",
          label: "Exam Date",
          render: (item) => new Date(item.examDate).toLocaleDateString()
        },
        { field: "maxMarks", label: "Max Marks" }
      ]}
      formFields={
        canManageExams
          ? [
              { name: "class", label: "Class", type: "select", options: classOptions, getValue: (item) => item.class?._id || "" },
              { name: "subject", label: "Subject" },
              { name: "examDate", label: "Exam Date", type: "date" },
              { name: "maxMarks", label: "Max Marks", type: "number" }
            ]
          : []
      }
      normalizePayload={(values) => ({
        ...values,
        examDate: values.examDate || undefined
      })}
      searchPlaceholder="Search exams"
    />
  );
};

export default Exams;
