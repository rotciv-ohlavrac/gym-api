import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { ZodError } from "zod";
import { env } from "./env";
import { userRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: "refreshToken", signed: false },
  sign: { expiresIn: "10m" },
});
app.register(fastifyCookie);
app.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Gym API",
      description:
        "Example of implementing an API for managing check-in at gyms (similar to the gympass use case)",
      version: "0.1.0",
    },
  },
  openapi: {
    info: {
      title: "Gym API",
      description:
        "Example of implementing an API for managing check-in at gyms (similar to the gympass use case)",
      version: "0.1.0",
    },
  },
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((err, _, reply) => {
  if (err instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: err.format() });
  }
  if (env.NODE_ENV === "production") {
    console.error(err);
  } else {
    // TODO
  }
  return reply.status(500).send({ message: "Internal server error." });
});
