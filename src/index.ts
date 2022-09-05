import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cardRouter from  "./routes/cardRouter.js";
import paymentRouter from "./routes/paymentRouter.js";

dotenv.config();

const server = express();

server.use(cors());
server.use(json());

server.use(cardRouter);
server.use(paymentRouter);

const PORT: number = Number(process.env.PORT);

server.listen(PORT, () => console.log(`Rodando server na porta ${PORT}`));