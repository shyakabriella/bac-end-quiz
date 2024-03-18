module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
      courseName: DataTypes.STRING, // Changed from 'name' to 'courseName'
      hours: DataTypes.INTEGER
    }, {});
    return Course;
  };
  