const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prisma");

test("POST /sign-up responds with 302 and creates user", async () => {
  const response = await request(app).post("/sign-up").type("form").send({
    firstName: "test",
    lastName: "signup",
    username: "test_signup_user",
    password: "test1234",
    confirmPassword: "test1234",
  });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/log-in");

  const { getUserByUsername } = require("../prisma/queries/userQueries");
  const user = await getUserByUsername("test_signup_user");
  expect(user).not.toBeNull();
});

afterEach(async () => {
  await prisma.user.deleteMany({ where: { username: "test_signup_user" } });
});
