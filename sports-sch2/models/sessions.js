"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sessions.belongsTo(models.Sport, {
        foreignKey: "sportId",
      });
      Sessions.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Sessions.hasMany(models.playerSessions, {
        foreignKey: "session_id",
      });
    }

    static addSession({
      sessionName,
      date,
      time,
      venue,
      playersNeeded,
      userId,
      sportId,
    }) {
      return this.create({
        sessionName,
        date,
        time,
        venue,
        playersNeeded,
        userId,
        sportId,
      });
    }

    static UsergetSession(userId) {
      return this.findAll({
        where: {
          userId,
        },
      });
    }
  }
  Sessions.init(
    {
      date: DataTypes.DATE,
      time: DataTypes.TIME,
      venue: DataTypes.STRING,
      playersNeeded: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      sessionName: DataTypes.STRING,
      sportId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Sessions",
    }
  );
  return Sessions;
};
