'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Draw extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Draw.associate = models => {
        Draw.belongsTo(models.User)
      }
    }
  };
  Draw.init({
    firstRank: DataTypes.INTEGER,
    firstRankReversed: DataTypes.BOOLEAN,
    secondRank: DataTypes.INTEGER,
    secondRankReversed: DataTypes.BOOLEAN,
    thirdRank: DataTypes.INTEGER,
    thirdRankReversed: DataTypes.BOOLEAN,
    pickedStock: DataTypes.STRING,
    pickedStockReversed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Draw',
  });
  return Draw;
};