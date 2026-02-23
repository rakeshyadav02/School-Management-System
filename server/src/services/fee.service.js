const { ObjectId } = require("mongodb");
const { getCollection } = require("../models/Fee.model");
const { AppError } = require("../utils/appError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const buildFeeFilter = (query) => {
  const filter = {};

  if (query.studentId) {
    filter.student = new ObjectId(query.studentId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.dueBefore) {
    filter.dueDate = { $lte: new Date(query.dueBefore) };
  }

  return filter;
};

const createFee = async (payload) => {
  const fee = {
    ...payload,
    student: new ObjectId(payload.student),
    dueDate: new Date(payload.dueDate),
    status: payload.status || "pending",
    paidAt: payload.paidAt ? new Date(payload.paidAt) : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await getCollection().insertOne(fee);
  return { _id: result.insertedId, ...fee };
};

const listFees = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildFeeFilter(query);

  const [items, total] = await Promise.all([
    getCollection()
      .aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
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
        { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } }
      ])
      .toArray(),
    getCollection().countDocuments(filter)
  ]);

  return {
    items,
    meta: getPaginationMeta(total, page, limit)
  };
};

const getFeeById = async (id) => {
  const fees = await getCollection()
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
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } }
    ])
    .toArray();

  if (!fees || fees.length === 0) {
    throw new AppError("Fee record not found", 404);
  }

  return fees[0];
};

const updateFee = async (id, payload) => {
  const updateData = { ...payload, updatedAt: new Date() };
  if (payload.student) updateData.student = new ObjectId(payload.student);
  if (payload.dueDate) updateData.dueDate = new Date(payload.dueDate);
  if (payload.paidAt) updateData.paidAt = new Date(payload.paidAt);

  const result = await getCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new AppError("Fee record not found", 404);
  }

  return getFeeById(id);
};

const deleteFee = async (id) => {
  const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new AppError("Fee record not found", 404);
  }
};

module.exports = {
  createFee,
  listFees,
  getFeeById,
  updateFee,
  deleteFee
};
