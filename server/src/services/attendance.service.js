const { ObjectId } = require("mongodb");
const { getCollection: getAttendanceCollection } = require("../models/Attendance.model");
const { getCollection: getStudentCollection } = require("../models/Student.model");
const { AppError } = require("../utils/appError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const buildAttendanceFilter = (query) => {
  const filter = {};

  if (query.classId) {
    filter.class = new ObjectId(query.classId);
  }

  if (query.studentId) {
    filter.student = new ObjectId(query.studentId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.date) {
    filter.date = new Date(query.date);
  }

  return filter;
};

const createAttendance = async (payload) => {
  const existing = await getAttendanceCollection().findOne({
    student: new ObjectId(payload.student),
    date: new Date(payload.date)
  });

  if (existing) {
    throw new AppError("Attendance already recorded for this date", 409);
  }

  const attendance = {
    ...payload,
    student: new ObjectId(payload.student),
    class: new ObjectId(payload.class),
    date: new Date(payload.date),
    takenBy: payload.takenBy ? new ObjectId(payload.takenBy) : null,
    status: payload.status || "present",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await getAttendanceCollection().insertOne(attendance);
  return { _id: result.insertedId, ...attendance };
};

const listAttendance = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildAttendanceFilter(query);

  const [items, total] = await Promise.all([
    getAttendanceCollection()
      .aggregate([
        { $match: filter },
        { $sort: { date: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "students",
            localField: "student",
            foreignField: "_id",
            as: "student"
          }
        },
        { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "classes",
            localField: "class",
            foreignField: "_id",
            as: "class"
          }
        },
        { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "teachers",
            localField: "takenBy",
            foreignField: "_id",
            as: "takenBy"
          }
        },
        { $unwind: { path: "$takenBy", preserveNullAndEmptyArrays: true } }
      ])
      .toArray(),
    getAttendanceCollection().countDocuments(filter)
  ]);

  return {
    items,
    meta: getPaginationMeta(total, page, limit)
  };
};

const getAttendanceById = async (id) => {
  const attendances = await getAttendanceCollection()
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "class"
        }
      },
      { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "teachers",
          localField: "takenBy",
          foreignField: "_id",
          as: "takenBy"
        }
      },
      { $unwind: { path: "$takenBy", preserveNullAndEmptyArrays: true } }
    ])
    .toArray();

  if (!attendances || attendances.length === 0) {
    throw new AppError("Attendance record not found", 404);
  }

  return attendances[0];
};

const updateAttendance = async (id, payload) => {
  const updateData = { ...payload, updatedAt: new Date() };
  if (payload.student) updateData.student = new ObjectId(payload.student);
  if (payload.class) updateData.class = new ObjectId(payload.class);
  if (payload.date) updateData.date = new Date(payload.date);
  if (payload.takenBy) updateData.takenBy = new ObjectId(payload.takenBy);

  const result = await getAttendanceCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new AppError("Attendance record not found", 404);
  }

  return getAttendanceById(id);
};

const deleteAttendance = async (id) => {
  const result = await getAttendanceCollection().deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new AppError("Attendance record not found", 404);
  }
};

const bulkMarkAttendance = async ({ classId, date, status, takenBy }) => {
  if (!classId || !date || !status) {
    throw new AppError("classId, date, and status are required", 400);
  }

  // Get all students in this class
  const students = await getStudentCollection()
    .find({ class: new ObjectId(classId), status: "active" })
    .toArray();

  if (students.length === 0) {
    throw new AppError("No active students found in this class", 404);
  }

  // Create attendance records for each student (skip if already exists)
  const attendanceDate = new Date(date);
  let recordsCreated = 0;

  for (const student of students) {
    const existing = await getAttendanceCollection().findOne({
      student: student._id,
      date: attendanceDate
    });

    if (!existing) {
      await getAttendanceCollection().insertOne({
        student: student._id,
        class: new ObjectId(classId),
        date: attendanceDate,
        status,
        takenBy: takenBy ? new ObjectId(takenBy) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      recordsCreated++;
    }
  }

  return {
    totalStudents: students.length,
    recordsCreated,
    alreadyMarked: students.length - recordsCreated
  };
};

module.exports = {
  createAttendance,
  listAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  bulkMarkAttendance
};

module.exports = {
  createAttendance,
  listAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  bulkMarkAttendance
};
