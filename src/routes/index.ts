import { Request, Response, Router } from "express";
const router: Router = Router();

// Sample APIs
import sampleRouter from './sample';
router.use('/samples', sampleRouter)

// auth APIS
import AuthRouter from './auth.routes';
router.use("/auth", AuthRouter);

// Health-check Endpoint
router.get('/health', (_req: Request, res: Response) => { res.send('200') })

export default router;