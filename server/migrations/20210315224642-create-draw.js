'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Draws', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        }
      },
      firstRank: {
        type: Sequelize.INTEGER
      },
      firstRankReversed: {
        type: Sequelize.BOOLEAN
      },
      secondRank: {
        type: Sequelize.INTEGER
      },
      secondRankReversed: {
        type: Sequelize.BOOLEAN
      },
      thirdRank: {
        type: Sequelize.INTEGER
      },
      thirdRankReversed: {
        type: Sequelize.BOOLEAN
      },
      pickedStock: {
        type: Sequelize.INTEGER,
        references: {
          model: "Stocks",
          id: "id"
        }
      },
      pickedStockReversed: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Draws');
  }
};