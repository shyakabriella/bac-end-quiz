const db = require('../models');
const Course = db.Course;

const addCourse = async (req, res) => {
  const { courseName, hours } = req.body;

  try {
    const course = await Course.create({ courseName, hours });
    return res.status(201).send(course);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    return res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

// Correct way to export both functions
module.exports = {
  addCourse,
  getCourses,
};
