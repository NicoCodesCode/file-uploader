const request = require("supertest");
const app = require("../app");

test("GET / responds with 200", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toContain("please log in or sign up");
});
