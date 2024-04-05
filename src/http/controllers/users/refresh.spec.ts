import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Refresh Token (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to refresh token", async () => {
    const userEmail = "johndoe@example.com";
    const userPassword = "123456";

    await request(app.server).post("/users").send({
      name: "John Doe",
      email: userEmail,
      password: userPassword,
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies as string[])
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ token: expect.any(String) });
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken"),
    ]);
  });
});
