import process from 'node:process';

export default function loadConfigFromEnv() {
  const config = process.env.CONTRIBMAP_CONFIG;

  if (!config) return;

  const parsed = JSON.parse(config);
  return validateConfig(parsed);
}
