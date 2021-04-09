// 'use strict';

// module.exports = (sequelize, DataTypes) => {
//   const Draw = sequelize.define('draw', {
//     // id: {
//     //   type: DataTypes.INTEGER,
//     //   primaryKey: true,
//     //   defaultValue: DataTypes.INTEGER,
//     //   allowNull: false
//     // },
//     userId: {
//       type: DataTypes.INTEGER,
//       required: true
//     },
//     firstRank: {
//       type: DataTypes.INTEGER,
//       required: true
//     },
//     firstRankReversed: {
//       type: DataTypes.BOOLEAN,
//       required: true
//     },
//     secondRank: {
//       type: DataTypes.INTEGER,
//       required: true
//     },
//     secondRankReversed: {
//       type: DataTypes.BOOLEAN,
//       required: true
//     },
//     thirdRank: {
//       type: DataTypes.INTEGER,
//       required: true
//     },
//     thirdRankReversed: {
//       type: DataTypes.BOOLEAN,
//       required: true
//     },
//     pickedStock: {
//       type: DataTypes.STRING,
//       required: true
//     },
//     pickedStockReversed: {
//       type: DataTypes.BOOLEAN,
//       required: true
//     },
//     // created_at: {
//     //   type: DataTypes.DATE,
//     //   allowNull: false
//     // },
//     // updated_at: DataTypes.DATE
//   }, 
//   {})
//   // Draw.associate = function(models) {
//   //   Draw.belongsTo(models.User, {as: 'user'})
//   // };
//   return Draw
// }

'use strict';

// const { Sequelize } = require("sequelize/types");

// const Draw = require('./draw')
module.exports = (sequelize, DataTypes) => {
  const Draw = sequelize.define('Draw', {
    userId: DataTypes.INTEGER,
    firstRank: DataTypes.INTEGER,
    secondRank: DataTypes.INTEGER,
    thirdRank: DataTypes.INTEGER,
    firstRankReversed: DataTypes.BOOLEAN,
    secondRankReversed: DataTypes.BOOLEAN,
    thirdRankReversed: DataTypes.BOOLEAN,
    // pickedStock: {
    //   type: DataTypes.INTEGER,
      // references: {
      //   model: 'stocks',
      //   key: 'id'
      // }
    // },
    pickedStock: DataTypes.INTEGER,
    pickedStockReversed: DataTypes.BOOLEAN
  }, {});
  // Draw.associate = function(models) {
  //   Draw.belongsTo(models.Stock)
  // }
  // User.associate = function(models) {
  //   User.belongsToMany(models.Stock, {through: 'UserStocks',foreignKey: 'userId', as: 'stocks'})
  //   User.hasMany(models.Draw, {as: 'draws', foreignKey: 'id'})
  // };
  return Draw;
};


