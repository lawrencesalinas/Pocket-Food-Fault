'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    models.restaurant.belongsToMany(models.user, {through: "userRestaurant"})

    }
  };
  restaurant.init({
    name: DataTypes.STRING, 
    address: DataTypes.STRING,
    hours: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    phoneNumber: DataTypes.STRING,
    restaurantCode: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'restaurant',
  });
  return restaurant;
};