export default defineEventHandler(async (event) => {
  const { config } = useContribmapConfig(event);

  if (!config) {
    throw createError({
      statusCode: 500,
      statusText: 'Config Not Found',
      message: 'Could not get profiles due to missing or invalid configuration',
    });
  }

  return Object.keys(config);
});
