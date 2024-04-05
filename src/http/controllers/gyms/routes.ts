import { FastifyInstance } from "fastify";
import { search } from "./search";
import { create } from "./create";
import { nearby } from "./nearby";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/only-admin";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);
  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, create);
}
