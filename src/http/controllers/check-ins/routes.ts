import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { create } from "./create";
import { history } from "./history";
import { metrics } from "./metrics";
import { validate } from "./validate";
import { verifyUserRole } from "@/http/middlewares/only-admin";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);
  app.post("/gyms/:gymId/check-ins", create);
  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validate
  );
}
