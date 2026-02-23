const { ObjectId } = require("mongodb");
const { getCollection: getStudentCollection } = require("../models/Student.model");
const { getCollection: getClassCollection } = require("../models/Class.model");
const { AppError } = require("../utils/appError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const buildStudentFilter = (query) => {
  const filter = {};

  if (query.classId) {
    filter.class = new ObjectId(query.classId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { rollNumber: { $regex: query.search, $options: "i" } }
    ];
  }

  return filter;
};

const createStudent = async (payload) => {
  // Validate that class exists
  if (!payload.class) {
    throw new AppError("Class is required for a student", 400);
  }

  const classExists = await getClassCollection().findOne({ _id: new ObjectId(payload.class) });
  if (!classExists) {
    throw new AppError("Class not found", 404);
  }

  const student = {
    ...payload,
    class: new ObjectId(payload.class),
    status: payload.status || "active",
    admissionDate: payload.admissionDate || new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await getStudentCollection().insertOne(student);
  return { _id: result.insertedId, ...student };
};

const listStudents = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildStudentFilter(query);

  const [items, total] = await Promise.all([
    getStudentCollection()
      .aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "classes",
            localField: "class",
            foreignField: "_id",
            as: "class"
          }
        },
        { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } }
      ])
      .toArray(),
    getStudentCollection().countDocuments(filter)
  ]);

  return {
    items,
    meta: getPaginationMeta(total, page, limit)
  };
};

const getStudentById = async (id) => {
  const students = await getStudentCollection()
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "class"
        }
      },
      { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } }
    ])
    .toArray();

  if (!students || students.length === 0) {
    throw new AppError("Student not found", 404);
  }

  return students[0];
};

const updateStudent = async (id, payload) => {
  // If class is being updated, validate it exists
  if (payload.class) {
    const classExists = await getClassCollection().findOne({ _id: new ObjectId(payload.class) });
    if (!classExists) {
      throw new AppError("Class not found", 404);
    }
    payload.class = new ObjectId(payload.class);
  }

  const updateData = { ...payload, updatedAt: new Date() };

  const result = await getStudentCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new AppError("Student not found", 404);
  }

  // Get with populated class
  return getStudentById(id);
};

const deleteStudent = async (id) => {
  const result = await getStudentCollection().deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new AppError("Student not found", 404);
  }
};

module.exports = {
  createStudent,
  listStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
