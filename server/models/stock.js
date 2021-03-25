// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Stock extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Stock.associate = models => {
//         Stock.belongsToMany(models.User, {
//           // through: 'UserStocks', 
//         // foreignKey: 'userId'
//       })
//       }

//     }
//   };
//   Stock.init({
//     symbol: DataTypes.STRING,
//     name: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Stock',
//   });
//   return Stock;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
  }, {});
  // User.associate = function(models) {
  //   User.belongsToMany(models.Stock, {through: 'UserStocks',foreignKey: 'userId', as: 'stocks'})
  // };
  return Stock;
};