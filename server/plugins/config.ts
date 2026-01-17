import { prettifyError, ZodError } from 'zod';

export default defineNitroPlugin(() => {
  let config: ContribmapConfig | undefined;

  try {
    config = loadConfigFromEnv();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn('Failed to parse config from environment\n', error.message);
    } else if (error instanceof ZodError) {
      console.warn('Failed to validate config from environment\n', prettifyError(error));
    }
  }

  if (!config) {
    try {
      config = loadConfigFromFile();
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn(`Failed to parse config file "${error.cause}"\n`, error.message);
      } else if (error instanceof ZodError) {
        console.warn(`Failed to validate config file "${error.cause}"\n`, prettifyError(error));
      }
    }
  }

  setContribmapConfig(config);
});
