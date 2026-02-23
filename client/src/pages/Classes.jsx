import React from "react";

import CrudPage from "../components/CrudPage";
import { useListTeachersQuery } from "../features/teachers/teachersApi";
import {
  useCreateClassMutation,
  useDeleteClassMutation,
  useListClassesQuery,
  useUpdateClassMutation
} from "../features/classes/classesApi";

const Classes = () => {
  const { data: teachersData } = useListTeachersQuery({ page: 1, limit: 100 });
  const teacherOptions = (teachersData?.items || []).map((item) => ({
    value: item._id,
    label: item.name
  }));

  return (
    <CrudPage
      title="Classes"
      singularLabel="Class"
      useListQuery={useListClassesQuery}
      useCreateMutation={useCreateClassMutation}
      useUpdateMutation={useUpdateClassMutation}
      useDeleteMutation={useDeleteClassMutation}
      columns={[
        { field: "name", label: "Name" },
        { field: "section", label: "Section" },
        { field: "year", label: "Year" },
        {
          field: "classTeacher.name",
          label: "Class Teacher",
          render: (item) => item.classTeacher?.name || "-"
        },
        { field: "capacity", label: "Capacity" }
      ]}
      formFields={[
        { name: "name", label: "Name" },
        { name: "section", label: "Section" },
        { name: "year", label: "Year", type: "number" },
        {
          name: "classTeacher",
          label: "Class Teacher",
          type: "select",
          options: teacherOptions,
          getValue: (item) => item.classTeacher?._id || ""
        },
        { name: "capacity", label: "Capacity", type: "number", defaultValue: 30 }
      ]}
      searchPlaceholder="Search classes"
    />
  );
};

export default Classes;
