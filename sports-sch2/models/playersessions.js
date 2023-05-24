"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class playerSessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      playerSessions.belongsTo(models.User, {
        foreignKey: "player_id",
      });
      playerSessions.belongsTo(models.Sessions, {
        foreignKey: "session_id",
      });
    }
  }
  playerSessions.init(
    {
      player_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "playerSessions",
    }
  );
  return playerSessions;
};
