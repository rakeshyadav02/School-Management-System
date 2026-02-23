const { ObjectId } = require("mongodb");
const { getCollection } = require("../models/Exam.model");
const { AppError } = require("../utils/appError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");
const { calculateGrade } = require("../utils/gradeCalculator");

const buildExamFilter = (query) => {
  const filter = {};

  if (query.classId) {
    filter.class = new ObjectId(query.classId);
  }

  if (query.subject) {
    filter.subject = query.subject;
  }

  return filter;
};

const normalizeResults = (results, maxMarks) =>
  (results || []).map((result) => {
    const gradeInfo = calculateGrade(result.marks, maxMarks);
    return {
      student: new ObjectId(result.student),
      marks: result.marks,
      percentage: gradeInfo.percentage,
      grade: gradeInfo.grade
    };
  });

const createExam = async (payload) => {
  const exam = {
    ...payload,
    class: new ObjectId(payload.class),
    examDate: new Date(payload.examDate),
    results: normalizeResults(payload.results, payload.maxMarks),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await getCollection().insertOne(exam);
  return { _id: result.insertedId, ...exam };
};

const listExams = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildExamFilter(query);

  const [items, total] = await Promise.all([
    getCollection()
      .aggregate([
        { $match: filter },
        { $sort: { examDate: -1 } },
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
        { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "students",
            localField: "results.student",
            foreignField: "_id",
            as: "studentDetails"
          }
        },
        {
          $addFields: {
            results: {
              $map: {
                input: "$results",
                as: "result",
                in: {
                  $mergeObjects: [
                    "$$result",
                    {
                      student: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$studentDetails",
                              cond: { $eq: ["$$this._id", "$$result.student"] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        { $project: { studentDetails: 0 } }
      ])
      .toArray(),
    getCollection().countDocuments(filter)
  ]);

  return {
    items,
    meta: getPaginationMeta(total, page, limit)
  };
};

const getExamById = async (id) => {
  const exams = await getCollection()
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
      { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "students",
          localField: "results.student",
          foreignField: "_id",
          as: "studentDetails"
        }
      },
      {
        $addFields: {
          results: {
            $map: {
              input: "$results",
              as: "result",
              in: {
                $mergeObjects: [
                  "$$result",
                  {
                    student: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$studentDetails",
                            cond: { $eq: ["$$this._id", "$$result.student"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $project: { studentDetails: 0 } }
    ])
    .toArray();

  if (!exams || exams.length === 0) {
    throw new AppError("Exam not found", 404);
  }

  return exams[0];
};

const updateExam = async (id, payload) => {
  const updates = { ...payload, updatedAt: new Date() };
  if (payload.class) updates.class = new ObjectId(payload.class);
  if (payload.examDate) updates.examDate = new Date(payload.examDate);
  if (payload.results && payload.maxMarks) {
    updates.results = normalizeResults(payload.results, payload.maxMarks);
  }

  const result = await getCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new AppError("Exam not found", 404);
  }

  return getExamById(id);
};

const deleteExam = async (id) => {
  const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new AppError("Exam not found", 404);
  }
};

module.exports = {
  createExam,
  listExams,
  getExamById,
  updateExam,
  deleteExam
};
