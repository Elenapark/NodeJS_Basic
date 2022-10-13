const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) {
    return res.status(204).json({ message: "No employees found." });
  }
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  console.log("직원생성req:", req.body);
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required." });
  }

  try {
    // create and store the new employee all at once
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    console.log("새로생성된직원:", result);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID:${req.body.id}.` });
  }
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  // 바뀐 정보 저장
  const result = await employee.save();
  console.log("직원정보수정:", result);
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req.body?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID:${req.body.id}.` });
  }

  const result = await employee.deleteOne({ _id: req.body.id });
  console.log("직원정보삭제:", result);
  res.json({
    data: result,
    message: "deleted successfully",
  });
};

const getEmployee = async (req, res) => {
  if (!req.params?.id)
    return res.status(400).json({ message: "ID parameter is required." });

  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID:${req.params.id}.` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
