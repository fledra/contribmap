import process from 'node:process';

export default function checkTokensExist(config: ContribmapConfig) {
  const envKeys = Object.keys(process.env);
  const invalidTokens: string[] = [];

  for (const profileName of Object.keys(config)) {
    const profile = config[profileName];

    if (!profile) {
      continue;
    }

    for (let i = 0; i < profile.length; i++) {
      const source = profile[i];
      const { token: tokenName } = source ?? {};

      if (!tokenName || !envKeys.includes(tokenName)) {
        invalidTokens.push(`  → ${tokenName} (at ${profileName}[${i}].token)`);
      } else {
        const token = getToken(tokenName);
        if (token.length === 0) {
          invalidTokens.push(`  → ${tokenName} (at ${profileName}[${i}].token)`);
        }
      }
    }
  }

  if (invalidTokens.length > 0) {
    throw new Error(`Could not find token${invalidTokens.length > 1 ? 's' : ''} in environment:\n${invalidTokens.join('\n')}`);
  }
}
