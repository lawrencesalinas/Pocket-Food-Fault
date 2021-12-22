'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.review.belongsTo(models.user)
    }
  };
  review.init({
    comment: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.BIGINT,
    reviewOwner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};