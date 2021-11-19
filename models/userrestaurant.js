'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userRestaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.userRestaurant.belongsTo(models.user)
      models.userRestaurant.belongsTo(models.restaurant)
      
    }
  };
  userRestaurant.init({
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'userRestaurant',
  });
  return userRestaurant;
};