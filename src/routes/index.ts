import { Request, Response, Router } from "express";
const router: Router = Router();

// Sample APIs
import sampleRouter from './sample';
router.use('/samples', sampleRouter)

// auth APIS
import AuthRouter from './auth.routes';
router.use("/auth", AuthRouter);

// user APIS
import UserRouter from "./user.routes";
router.use("users", UserRouter);

//account APIS
import AccountRouter from "./account.routes";
router.use("accounts", AccountRouter);

// Health-check Endpoint
router.get('/health', (_req: Request, res: Response) => { res.send('200') })

export default router;