import z from 'zod';

export const urlSchema = z.httpUrl({ normalize: true, error: 'Please enter a valid forge URL' }).optional();
export const forgeSchema = z.strictObject({
  forge: z.enum(['github', 'gitlab', 'gitlab-self', 'codeberg', 'forgejo', 'gitea']),
  username: z
    .string()
    .min(1, { error: 'Please enter a valid username' }),
  token: z
    .string()
    .min(1, { error: 'Please enter a valid forge API token' })
    .optional(),
  baseURL: urlSchema,
}).refine(
  (data) => {
    const selfHosted = ['gitlab-self', 'forgejo', 'gitea'];
    return !(selfHosted.includes(data.forge) && !data.baseURL && !data.baseURL);
  },
  {
    message: 'A valid forge URL is required for self-hosted instances',
    path: ['baseURL'],
  },
);

export const profileSchema = z.array(forgeSchema).min(1);
export const configSchema = z
  .object({ $schema: z.string().optional() })
  .catchall(profileSchema)
  .refine(
    (data) => {
      const keys = Object.keys(data).filter((k) => k !== '$schema');
      return keys.length > 0;
    },
    { message: 'Config must contain at least one profile (e.g. "default")' },
  );

export type ForgeConfig = z.infer<typeof forgeSchema>;
export type ContribmapConfig = z.infer<typeof configSchema>;

export type Forge = ForgeConfig['forge'];
