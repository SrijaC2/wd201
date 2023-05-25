"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayerSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlayerSession.belongsTo(models.User, {
        foreignKey: "player_id",
        targetKey: "id",
      });
      PlayerSession.belongsTo(models.Sessions, {
        foreignKey: "session_id",
        targetKey: "id",
      });
    }
  }
  PlayerSession.init(
    {
      player_id: DataTypes.INTEGER,
      session_id: DataTypes.INTEGER,
      player_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PlayerSession",
    }
  );
  return PlayerSession;
};

