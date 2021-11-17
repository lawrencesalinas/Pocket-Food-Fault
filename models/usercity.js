'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userCity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    //  models.userCity.belongsTo(models.city)
    //  models.userCity.belongsTo(models.user)
    }
  };
  userCity.init({
    userId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userCity',
  });
  return userCity;
};