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
        targetKey: "id",
      });
      Sessions.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
    }

    static addSession({
      sessionName,
      date,
      time,
      venue,
      playersNeeded,
      userId,
    }) {
      return this.create({
        sessionName,
        date,
        time,
        venue,
        playersNeeded,
        userId,
      });
    }
  }
  Sessions.init(
    {
      sportId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      time: DataTypes.TIME,
      venue: DataTypes.STRING,
      playersNeeded: DataTypes.INTEGER,
      sessionName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Sessions",
    }
  );
  return Sessions;
};
