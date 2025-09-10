import express from "express";
const app = express();
import { sequelize } from "./database";

const port = process.env.PORT ?? "3001";

app.listen(port, () => {
  console.log(`Server rodando na porta: ${port}`);

  // Sincroniza apenas o banco
  sequelize
    .sync()
    .then(() => {
      console.log("Banco sincronizado!");
    })
    .catch((err: unknown) => {
      console.error("Erro ao sincronizar o banco:", err);
    });
});
