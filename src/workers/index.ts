// Load environment variables for the standalone worker
import { config } from "dotenv";
config();

import "./ai-analyzer.worker";
import "./ai-reviewer.worker";
import "./ai-fraud.worker";

console.log("[Worker] Started background worker processes");
