const { ObjectId } = require("mongodb");
const { getCollection: getClassCollection } = require("../models/Class.model");
const { getCollection: getStudentCollection } = require("../models/Student.model");
const { AppError } = require("../utils/appError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const buildClassFilter = (query) => {
  const filter = {};

  if (query.year) {
    filter.year = Number(query.year);
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { section: { $regex: query.search, $options: "i" } }
    ];
  }

  return filter;
};

const createClass = async (payload) => {
  const classItem = {
    ...payload,
    capacity: payload.capacity || 30,
    classTeacher: payload.classTeacher ? new ObjectId(payload.classTeacher) : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await getClassCollection().insertOne(classItem);
  return { _id: result.insertedId, ...classItem };
};

const listClasses = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildClassFilter(query);

  const [items, total] = await Promise.all([
    getClassCollection()
      .aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "teachers",
            localField: "classTeacher",
            foreignField: "_id",
            as: "classTeacher"
          }
        },
        { $unwind: { path: "$classTeacher", preserveNullAndEmptyArrays: true } }
      ])
      .toArray(),
    getClassCollection().countDocuments(filter)
  ]);

  return {
    items,
    meta: getPaginationMeta(total, page, limit)
  };
};

const getClassById = async (id) => {
  const classes = await getClassCollection()
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "teachers",
          localField: "classTeacher",
          foreignField: "_id",
          as: "classTeacher"
        }
      },
      { $unwind: { path: "$classTeacher", preserveNullAndEmptyArrays: true } }
    ])
    .toArray();

  if (!classes || classes.length === 0) {
    throw new AppError("Class not found", 404);
  }

  return classes[0];
};

const updateClass = async (id, payload) => {
  const updateData = { ...payload, updatedAt: new Date() };
  if (payload.classTeacher) {
    updateData.classTeacher = new ObjectId(payload.classTeacher);
  }

  const result = await getClassCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new AppError("Class not found", 404);
  }

  return getClassById(id);
};

const deleteClass = async (id) => {
  // Check if any students are assigned to this class
  const studentCount = await getStudentCollection().countDocuments({ class: new ObjectId(id) });
  if (studentCount > 0) {
    throw new AppError(
      `Cannot delete class. There are ${studentCount} student(s) assigned to this class. Please remove them first.`,
      409
    );
  }

  const result = await getClassCollection().deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new AppError("Class not found", 404);
  }

  return { message: "Class deleted successfully" };
};

module.exports = {
  createClass,
  listClasses,
  getClassById,
  updateClass,
  deleteClass
};

module.exports = {
  createClass,
  listClasses,
  getClassById,
  updateClass,
  deleteClass
};
