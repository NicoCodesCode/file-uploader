const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/prisma");

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash("correct_password123", 10);
  await prisma.user.create({
    data: {
      firstName: "test",
      lastName: "login",
      username: "test_login_user",
      password: hashedPassword,
    },
  });
});

describe("POST /log-in", () => {
  test("with right credentials responds with 302 and a session cookie", async () => {
    const response = await request(app).post("/log-in").type("form").send({
      username: "test_login_user",
      password: "correct_password123",
    });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/");
    expect(response.header["set-cookie"]).not.toBeUndefined();
  });

  test("with wrong password responds with 302 and redirects back to /log-in", async () => {
    const response = await request(app).post("/log-in").type("form").send({
      username: "test_login_user",
      password: "wrong_password123",
    });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/log-in");
    expect(response.header["set-cookie"]).toBeUndefined();
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { username: "test_login_user" } });
});
