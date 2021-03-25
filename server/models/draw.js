'use strict';

module.exports = (sequelize, DataTypes) => {
  const Draw = sequelize.define('draw', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      required: true
    },
    firstRank: {
      type: DataTypes.INTEGER,
      required: true
    },
    firstRankReversed: {
      type: DataTypes.BOOLEAN,
      required: true
    },
    secondRank: {
      type: DataTypes.INTEGER,
      required: true
    },
    secondRankReversed: {
      type: DataTypes.BOOLEAN,
      required: true
    },
    thirdRank: {
      type: DataTypes.INTEGER,
      required: true
    },
    thirdRankReversed: {
      type: DataTypes.BOOLEAN,
      required: true
    },
    pickedStock: {
      type: DataTypes.STRING,
      required: true
    },
    pickedStockReversed: {
      type: DataTypes.BOOLEAN,
      required: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: DataTypes.DATE
  })
  return Draw
}


