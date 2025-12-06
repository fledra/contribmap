<template>
  <div class="grid gap-4 md:grid-flow-col md:gap-6">
    <UForm
      :state="formData"
      :schema="forgeSchema"
      class="flex gap-4 flex-col"
    >
      <div class="flex flex-col gap-4 grow w-full md:w-60">
        <UFormField label="Forge" name="forge" required>
          <USelect
            v-model="formData.forge"
            :items="forges"
            :icon="selectedIcon"
            placeholder="Select forge"
            size="lg"
            class="w-full"
            :ui="{
              leadingIcon: 'text-default',
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
            }"
          />
        </UFormField>

        <UFormField v-if="!endpointDisabled" label="URL" name="endpoint" required>
          <UInput
            v-model="formData.endpoint"
            placeholder="git.yourdomain.com"
            class="w-full"
            size="lg"
            :ui="{
              base: 'pl-16',
              leading: 'pointer-events-none',
            }"
          >
            <template #leading>
              <p class="text-sm text-muted">
                https://
              </p>
            </template>
          </UInput>
        </UFormField>

        <UFormField label="User" name="user" required>
          <UInput
            v-model="formData.user"
            placeholder="Username"
            class="w-full"
            size="lg"
          />
        </UFormField>
      </div>

      <UButton type="submit" size="lg" block>
        Fetch
      </UButton>
    </UForm>

    <Heatmap />
  </div>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

import z from 'zod';

const forges = [
  { label: 'GitHub', value: 'github', icon: 'lucide:github', ui: { itemLeadingIcon: 'text-default' } },
  { label: 'GitLab', value: 'gitlab', icon: 'devicon:gitlab' },
  { label: 'GitLab (self-hosted)', value: 'gitlab-self', icon: 'devicon:gitlab' },
  { label: 'Codeberg', value: 'codeberg', icon: 'devicon:codeberg' },
  { label: 'Forgejo', value: 'forgejo', icon: 'devicon:forgejo' },
  { label: 'Gitea', value: 'gitea', icon: 'devicon:gitea' },
] as const satisfies SelectItem[];

const requiresEndpoint = ['gitlab-self', 'forgejo', 'gitea'];
const forgeSchema = z.object({
  forge: z.enum(forges.map((f) => f.value), { error: 'Please select a forge' }),
  endpoint: z
    .transform((v) => `https://${v}`)
    .pipe(z.httpUrl({ normalize: true, error: 'Please enter a valid forge URL' }))
    .optional(),
  user: z
    .string()
    .trim()
    .min(1, 'Please enter your username'),
}).superRefine((data, ctx) => {
  if (requiresEndpoint.includes(data.forge) && !data.endpoint) {
    ctx.addIssue({
      path: ['endpoint'],
      code: 'custom',
      message: 'Please enter a valid forge URL',
    });
  }
});

export type ForgeSchema = z.infer<typeof forgeSchema>;

const formData = reactive<Partial<ForgeSchema>>({
  forge: undefined,
  endpoint: undefined,
  user: '',
});

const selectedIcon = computed(() => forges.find((f) => f.value === formData.forge)?.icon);
const endpointDisabled = computed(() => !requiresEndpoint.includes(formData.forge ?? ''));

watchEffect(() => {
  if (endpointDisabled.value) {
    formData.endpoint = undefined;
  }
});
</script>
