<template>
  <h2 class="text-xl mb-2 text-primary-200">
    <strong class="font-semibold">Aggregated Contributions</strong>
  </h2>

  <Heatmap class="w-full h-full" :heatmap="contributions?.aggregated" />

  <h2 class="text-xl mb-2 text-primary-200">
    <strong class="font-semibold">Forge Breakdown</strong>
  </h2>

  <UAccordion
    :items="accordionItems"
    :disabled="contributionsLoading"
    :ui="{ label: 'text-lg font-light' }"
    type="multiple"
  >
    <template #body="{ item }">
      <Heatmap v-if="contributions && item.label" :heatmap="contributions.forges[item.label]" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';

const props = defineProps<{ profile: string }>();

const { data: contributionData, pending: contributionsLoading } = await useAsyncData(
  'contributions',
  (_, { signal }) => $fetch('/api/contributions', { signal, query: { profile: props.profile } }),
  { watch: [() => props.profile] },
);

const contributions = computed(() => {
  if (!contributionData.value) return;

  const forges: Record<string, HeatmapData> = {};

  for (const forge of contributionData.value.contributions) {
    const key = forge.name ?? `${forge.forge}:${forge.username}`;
    const { aggregated, total } = aggregateContributions(forge);

    forges[key] = {
      profile: '',
      contributions: aggregated,
      totalContributions: total,
    };
  }

  const { aggregated, total } = aggregateContributions(contributionData.value.contributions);
  const merged: HeatmapData = {
    profile: '',
    contributions: aggregated,
    totalContributions: total,
  };

  return {
    forges,
    aggregated: merged,
  };
});

const accordionItems = computed(() => {
  if (!contributions.value) {
    return [];
  }

  const keys = Object.keys(contributions.value.forges);
  return keys.map<AccordionItem>((forge) => ({ label: forge }));
});

// const forges = [
//   { label: 'GitHub', value: 'github', icon: 'lucide:github', ui: { itemLeadingIcon: 'text-default' } },
//   { label: 'GitLab', value: 'gitlab', icon: 'devicon:gitlab' },
//   { label: 'GitLab (self-hosted)', value: 'gitlab-self', icon: 'devicon:gitlab' },
//   { label: 'Codeberg', value: 'codeberg', icon: 'devicon:codeberg' },
//   { label: 'Forgejo', value: 'forgejo', icon: 'devicon:forgejo' },
//   { label: 'Gitea', value: 'gitea', icon: 'devicon:gitea' },
// ] as const satisfies SelectItem[];
</script>
