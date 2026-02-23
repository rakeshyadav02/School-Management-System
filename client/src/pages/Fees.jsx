import React from "react";

import CrudPage from "../components/CrudPage";
import { useListStudentsQuery } from "../features/students/studentsApi";
import {
  useCreateFeeMutation,
  useDeleteFeeMutation,
  useListFeesQuery,
  useUpdateFeeMutation
} from "../features/fees/feesApi";

const Fees = () => {
  const { data: studentsData } = useListStudentsQuery({ page: 1, limit: 100 });
  const studentOptions = (studentsData?.items || []).map((item) => ({
    value: item._id,
    label: item.name
  }));

  return (
    <CrudPage
      title="Fees"
      useListQuery={useListFeesQuery}
      useCreateMutation={useCreateFeeMutation}
      useUpdateMutation={useUpdateFeeMutation}
      useDeleteMutation={useDeleteFeeMutation}
      columns={[
        { field: "student.name", label: "Student", render: (item) => item.student?.name || "-" },
        { field: "amount", label: "Amount" },
        { field: "status", label: "Status" },
        {
          field: "dueDate",
          label: "Due Date",
          render: (item) => new Date(item.dueDate).toLocaleDateString()
        },
        {
          field: "paidAt",
          label: "Paid At",
          render: (item) => (item.paidAt ? new Date(item.paidAt).toLocaleDateString() : "-")
        }
      ]}
      formFields={[
        { name: "student", label: "Student", type: "select", options: studentOptions, getValue: (item) => item.student?._id || "" },
        { name: "amount", label: "Amount", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "overdue", label: "Overdue" }
          ],
          defaultValue: "pending"
        },
        { name: "dueDate", label: "Due Date", type: "date" },
        { name: "paidAt", label: "Paid At", type: "date" },
        { name: "reference", label: "Reference" }
      ]}
      normalizePayload={(values) => ({
        ...values,
        dueDate: values.dueDate || undefined,
        paidAt: values.paidAt || undefined
      })}
      searchPlaceholder="Search fees"
    />
  );
};

export default Fees;
