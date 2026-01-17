import process from 'node:process';

export default function checkTokensExist(config: ContribmapConfig) {
  const envKeys = Object.keys(process.env);
  const invalidTokens: string[] = [];

  for (const profileName of Object.keys(config)) {
    const profile = config[profileName];

    for (let i = 0; i < profile.length; i++) {
      const source = profile[i];
      const { token } = source;

      if (token && !envKeys.includes(token)) {
        invalidTokens.push(`  → ${token} (at ${profileName}[${i}].token)`);
      }
    }
  }

  if (invalidTokens.length > 0) {
    throw new Error(`Could not find token${invalidTokens.length > 1 ? 's' : ''} in environment:\n${invalidTokens.join('\n')}`);
  }
}
