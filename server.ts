import { ENV } from "./src/config/config.js";

import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";

app.listen(ENV.PORT, () => {
  logger.info(`Server started at http://localhost:${ENV.PORT}`);
});
