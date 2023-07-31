import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), "public/dataBase/QUESTOES.db");
  const dbFile = fs.readFileSync(dbPath);
  res.status(200).send(dbFile);
}
