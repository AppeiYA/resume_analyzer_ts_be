import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/config.js";
import compression from "compression";
import morgan from "morgan";
import cookieParser from 'cookie-parser'
import { StatusCodes } from "./shared/StatusCodes.js";
import v1router from "./router.v1.js";

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: ENV.isProd ? ["https://deployed-frontend-domain.com"] : "*",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

app.use(compression());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(ENV.COOKIE_SECRET));

if (!ENV.isProd) {
  app.use(morgan("dev"));
}

// routes 
app.get("/", (_req: Request, res: Response)=>{
    res.status(StatusCodes.OK).send("Welcome to Resume Analyzer API")
})
app.get("/health", (_req: Request, res: Response)=> {
    res.status(StatusCodes.OK).json({status: "GREEN OK"});
})
app.use("/api/v1", v1router)

app.use((_req: Request, res: Response)=>{
    res.status(StatusCodes.NOT_FOUND).json({error: "Route not found"})
})

export default app;
