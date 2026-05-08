import app from "./app.js";
import { env, validateEnv } from "./config/env.js";

validateEnv();

app.listen(env.port, () => {
  console.log(`MeshVoice AI server listening on port ${env.port}`);
});
