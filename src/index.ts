import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const server = express();

server.use(cors());


const PORT: number = Number(process.env.PORT);

server.listen(PORT, () => console.log(`Rodando server na porta ${PORT}`));