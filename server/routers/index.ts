import { Application } from "express";
import apiRoutes from "./api";
import adminRoutes from "./admin";

export default (app: Application): Application => {
  // Routes for frontend users
  app.use("/api", [apiRoutes]);
  // Routes for admin dashboard
  app.use("/api/admin", [...adminRoutes]);
  return app;
};
