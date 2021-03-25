// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       User.associate = models => {
//         User.belongsToMany(models.Stock, {
//           // through: 'UserStocks',
//           // as: 'stocks',
//           // foreignKey: 'userId'
//         });
//         // User.hasMany(models.Draw)
//       }
      
//     }
//   };
//   User.init({
//     email: DataTypes.STRING,
//     password: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {});
  // User.associate = function(models) {
  //   User.belongsToMany(models.Stock, {through: 'UserStocks',foreignKey: 'userId', as: 'stocks'})
  // };
  return User;
};