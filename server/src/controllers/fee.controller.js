const feeService = require("../services/fee.service");
const { asyncHandler } = require("../utils/asyncHandler");

const createFee = asyncHandler(async (req, res) => {
  const fee = await feeService.createFee(req.body);
  res.status(201).json({ fee });
});

const listFees = asyncHandler(async (req, res) => {
  const result = await feeService.listFees(req.query);
  res.status(200).json(result);
});

const getFee = asyncHandler(async (req, res) => {
  const fee = await feeService.getFeeById(req.params.id);
  res.status(200).json({ fee });
});

const updateFee = asyncHandler(async (req, res) => {
  const fee = await feeService.updateFee(req.params.id, req.body);
  res.status(200).json({ fee });
});

const deleteFee = asyncHandler(async (req, res) => {
  await feeService.deleteFee(req.params.id);
  res.status(204).send();
});

module.exports = {
  createFee,
  listFees,
  getFee,
  updateFee,
  deleteFee
};
