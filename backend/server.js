import { createServer } from "node:http";
import "dotenv/config";

import { app } from "./src/app.js";

const server = createServer(app);

const PORT = process.env.PORT || 5678;

server.listen(PORT, () => {
  console.info(`server is running at Port : ${PORT}`);
});