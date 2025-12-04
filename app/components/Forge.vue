<template>
  <div class="flex gap-4">
    <UFormField label="Forge">
      <USelect
        v-model="selectedForge"
        :items="forges"
        :icon="selectedIcon"
        placeholder="Select forge"
        size="lg"
        class="w-42"
        :ui="{
          item: 'items-center',
          leadingIcon: 'text-default',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
      />
    </UFormField>

    <UFormField label="Endpoint">
      <UInput
        v-model="endpoint"
        size="lg"
        placeholder="git.yourdomain.com"
        :disabled="endpointDisabled"
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
  </div>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

const forges = [
  { label: 'GitHub', value: 'github', icon: 'lucide:github', ui: { itemLeadingIcon: 'text-default' } },
  { label: 'GitLab', value: 'gitlab', icon: 'devicon:gitlab' },
  { label: 'GitLab', value: 'gitlab-self', icon: 'devicon:gitlab', description: 'Self-hosted' },
  { label: 'Forgejo', value: 'forgejo', icon: 'devicon:forgejo' },
  { label: 'Gitea', value: 'gitea', icon: 'devicon:gitea' },
] as const satisfies SelectItem[];

const selectedForge = defineModel<(typeof forges)[number]['value']>();
const selectedIcon = computed(() => forges.find((f) => f.value === selectedForge.value)?.icon);

const endpointDisabled = ref(false);
const endpoint = ref('');

watch(selectedForge, (forge) => {
  switch (forge) {
    case 'forgejo':
    case 'gitea':
    case 'gitlab-self': {
      endpoint.value = '';
      endpointDisabled.value = false;
      break;
    }
    case 'github': {
      endpoint.value = 'api.github.com/graphql';
      endpointDisabled.value = true;
      break;
    }
    case 'gitlab': {
      endpoint.value = 'api.gitlab.com';
      endpointDisabled.value = true;
      break;
    }
  }
});
</script>
