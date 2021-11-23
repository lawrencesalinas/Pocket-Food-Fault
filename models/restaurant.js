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
    // models.restaurant.belongsTo(models.city)

    }
  };
  restaurant.init({
    name: DataTypes.STRING, 
    cityId: DataTypes.BIGINT,
    address: DataTypes.STRING,
    hours: DataTypes.STRING,
    city: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    state: DataTypes.STRING,
    cuisine: DataTypes.STRING,
    menu: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    restaurantCode: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'restaurant',
  });
  return restaurant;
};