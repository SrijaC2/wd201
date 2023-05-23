const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
let server, agent;

function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  const csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password,
    _csrf: csrfToken,
  });
};

describe("Sport Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/sport");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/sport");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a sport", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/sport");
    res = await agent.get("/createSport");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/sport").send({
      title: "cricket",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Fetches all Sports in the database using /sport endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/sport");
    res = await agent.get("/createSport");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/sport").send({
      title: "Tennis",
      _csrf: csrfToken,
    });
    const groupedTodosResponse1 = await agent
      .get("/sport")
      .set("Accept", "application/json");
    const parsedGroupedResponse1 = JSON.parse(groupedTodosResponse1.text);
    const NoOfSports = parsedGroupedResponse1.allSports.length;

    res = await agent.get("/sport");
    res = await agent.get("/createSport");
    csrfToken = extractCsrfToken(res);
    await agent.post("/sport").send({
      title: "Badminton",
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/sport")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const NoOfSports1 = parsedGroupedResponse.allSports.length;
    const latestSport = parsedGroupedResponse.allSports[NoOfSports1 - 1];
    expect(NoOfSports1).toBe(NoOfSports + 1);
    expect(latestSport.title).toBe("Badminton");
  });
});
