import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near GYM",
        description: "Some description",
        phone: "11999999999",
        latitude: -23.5510318,
        longitude: -46.6863243,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far GYM",
        description: "Some description",
        phone: "11999999999",
        latitude: -23.3135165,
        longitude: -46.5783531,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -23.5510318, longitude: -46.6863243 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "Near GYM" }),
    ]);
  });
});
