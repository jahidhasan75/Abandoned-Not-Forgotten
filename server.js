import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3e3;
const distPath = path.join(__dirname, "dist");
app.get(["/healthz", "/health"], (_req, res) => {
  res.status(200).send("OK");
});
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Production build not found. Run npm run build first.");
  }
});
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`[Production Server] Listening on http://0.0.0.0:${PORT}`);
});
