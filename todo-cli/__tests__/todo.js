/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();
describe("TodoList Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });
  test("Should add new todo", () => {
    const todoItemCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemCount + 1);
  });

  test("Should mark todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retrieve of overdue items", () => {
    const overDueTodoItemsCount = overdue().length;
    const dateToday = new Date();
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date(new Date().setDate(dateToday.getDate() - 1))
        .toISOString()
        .slice(0, 10),
    });
    expect(overdue().length).toEqual(overDueTodoItemsCount + 1);
  });

  test("Should retrieve of due today items", () => {
    const dueTodayTodoItemsCount = dueToday().length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(dueToday().length).toEqual(dueTodayTodoItemsCount + 1);
  });

  test("Should retrieve of due later items", () => {
    const dueLaterTodoItemsCount = dueLater().length;
    const dateToday = new Date();
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date(new Date().setDate(dateToday.getDate() + 1))
        .toISOString()
        .slice(0, 10),
    });
    expect(dueLater().length).toEqual(dueLaterTodoItemsCount + 1);
  });
});
