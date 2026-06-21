// Load environment variables for the standalone worker
import { config } from "dotenv";
config();

import "./ai-analyzer.worker";

console.log("[Worker] Started background worker processes");
