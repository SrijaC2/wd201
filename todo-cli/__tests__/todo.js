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
    const overdues = overdue();
    for (let i = 0; i < overdues.length; i++) {
      if (!overdues[i].completed) {
        expect(overdues[i].completed).toBe(false);
        markAsComplete(i);
        expect(overdues[i].completed).toBe(true);
      }
    }
  });

  test("Should retrieve of due today items", () => {
    const duetoday = dueToday();
    for (let i = 0; i < duetoday.length; i++) {
      if (!duetoday[i].completed) {
        expect(duetoday[i].completed).toBe(false);
        markAsComplete(i);
        expect(duetoday[i].completed).toBe(true);
      }
    }
  });

  test("Should retrieve of due later items", () => {
    const duelater = dueLater();
    for (let i = 0; i < duelater.length; i++) {
      if (!duelater[i].completed) {
        expect(duelater[i].completed).toBe(false);
        markAsComplete(i);
        expect(duelater[i].completed).toBe(true);
      }
    }
  });
});
