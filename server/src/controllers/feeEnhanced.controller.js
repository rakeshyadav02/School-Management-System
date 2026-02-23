const { createFeeStructure, listFeeStructures, recordPayment, listPayments } = require("../models/FeeEnhanced.model");
const { AppError } = require("../utils/appError");

// POST /api/fees/structures
const postFeeStructure = async (req, res, next) => {
  try {
    const { className, amount, dueDate, installments } = req.body;
    if (!className || !amount) throw new AppError("className and amount required", 400);
    const fee = await createFeeStructure({ className, amount, dueDate, installments });
    res.status(201).json({ fee });
  } catch (err) {
    next(err);
  }
};

// GET /api/fees/structures
const getFeeStructures = async (req, res, next) => {
  try {
    const fees = await listFeeStructures();
    res.json({ fees });
  } catch (err) {
    next(err);
  }
};

// POST /api/fees/payments
const postPayment = async (req, res, next) => {
  try {
    const { studentId, feeId, amount, installmentNo } = req.body;
    if (!studentId || !feeId || !amount) throw new AppError("studentId, feeId, amount required", 400);
    const payment = await recordPayment({ studentId, feeId, amount, installmentNo });
    res.status(201).json({ payment });
  } catch (err) {
    next(err);
  }
};

// GET /api/fees/payments
const getPayments = async (req, res, next) => {
  try {
    const payments = await listPayments();
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postFeeStructure,
  getFeeStructures,
  postPayment,
  getPayments,
};
