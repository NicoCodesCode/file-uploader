const request = require("supertest");
const app = require("../app");

test("GET /files/upload without auth redirects to /log-in", async () => {
  const response = await request(app).get("/files/upload");
  expect(response.status).toBe(302);
  expect(response.header.location).toBe("/log-in");
});

test("GET /folders/create without auth redirects to /log-in", async () => {
  const response = await request(app).get("/folders/create");
  expect(response.status).toBe(302);
  expect(response.header.location).toBe("/log-in");
});
