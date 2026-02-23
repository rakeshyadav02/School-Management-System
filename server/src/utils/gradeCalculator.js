const calculateGrade = (score, maxScore) => {
  const safeMax = maxScore > 0 ? maxScore : 1;
  const percentage = Math.round((Number(score) / safeMax) * 100);

  let grade = "F";
  if (percentage >= 90) grade = "A";
  else if (percentage >= 80) grade = "B";
  else if (percentage >= 70) grade = "C";
  else if (percentage >= 60) grade = "D";

  return { percentage, grade };
};

module.exports = { calculateGrade };
