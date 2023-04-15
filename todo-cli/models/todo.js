// models/todo.js
"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      console.log(
        (await Todo.overdue())
          .map((todo) => {
            return todo.displayableString();
          })
          .join("\n")
      );

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE

      console.log(
        (await Todo.dueToday())
          .map((todo) => {
            return todo.displayableString();
          })
          .join("\n")
      );
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      console.log(
        (await Todo.dueLater())
          .map((todo) => {
            return todo.displayableString();
          })
          .join("\n")
      );
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toISOString().slice(0, 10) },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      return await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date().toISOString().slice(0, 10) },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toISOString().slice(0, 10) },
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update({ completed: true }, { where: { id } });
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
