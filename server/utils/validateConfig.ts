export default function validateConfig(config: unknown) {
  const parsed = configSchema.parse(config);

  if (parsed.$schema) {
    delete parsed.$schema;
  }

  try {
    ensureTokensExist(parsed);
  } catch (error) {
    if (error instanceof Error) {
      console.warn(error.message);
    }
  }

  return parsed;
}
