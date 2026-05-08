import app from "../src/app.js";
import { validateEnv } from "../src/config/env.js";

let envValidated = false;

export default async function handler(req, res) {
  if (!envValidated) {
    validateEnv();
    envValidated = true;
  }

  return app(req, res);
}
