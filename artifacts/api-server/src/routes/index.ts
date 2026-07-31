import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import clientsRouter from "./clients";
import settingsRouter from "./settings";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(clientsRouter);
router.use(settingsRouter);
router.use(storageRouter);

export default router;
