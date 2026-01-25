export default defineEventHandler(async () => {
  const { config } = useContribmapConfig();

  if (!config) {
    throw createError({
      statusCode: 500,
      statusText: 'Config Not Found',
      message: 'Could not generate heatmap due to missing or invalid configuration',
    });
  }

  return Object.keys(config);
});
