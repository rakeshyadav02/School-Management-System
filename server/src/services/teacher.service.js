const { ObjectId } = require("mongodb");
const { getCollection } = require("../models/Teacher.model");
const { AppError } = require("../utils/appError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const buildTeacherFilter = (query) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { employeeId: { $regex: query.search, $options: "i" } }
    ];
  }

  return filter;
};

const createTeacher = async (payload) => {
  const teacher = {
    ...payload,
    status: payload.status || "active",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await getCollection().insertOne(teacher);
  return { _id: result.insertedId, ...teacher };
};

const listTeachers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildTeacherFilter(query);

  const [items, total] = await Promise.all([
    getCollection().find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).toArray(),
    getCollection().countDocuments(filter)
  ]);

  return {
    items,
    meta: getPaginationMeta(total, page, limit)
  };
};

const getTeacherById = async (id) => {
  const teacher = await getCollection().findOne({ _id: new ObjectId(id) });
  if (!teacher) {
    throw new AppError("Teacher not found", 404);
  }

  return teacher;
};

const updateTeacher = async (id, payload) => {
  const updateData = { ...payload, updatedAt: new Date() };

  const result = await getCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new AppError("Teacher not found", 404);
  }

  return result;
};

const deleteTeacher = async (id) => {
  const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new AppError("Teacher not found", 404);
  }
};

module.exports = {
  createTeacher,
  listTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};
