<template>
  <h2 class="text-xl mb-2 text-primary-200">
    <strong class="font-semibold">Aggregated Contributions</strong>
  </h2>

  <Heatmap
    class="w-full h-full"
    :heatmap="aggregated"
    :from="data?.range.from"
    :to="data?.range.to"
  />

  <h2 class="text-xl mb-2 text-primary-200">
    <strong class="font-semibold">Forge Breakdown</strong>
  </h2>

  <UAccordion
    :items="accordionItems"
    :disabled="pending"
    :ui="{ label: 'text-lg font-light' }"
    type="multiple"
  >
    <template #content="{ index }">
      <Heatmap
        v-if="contributions"
        :heatmap="contributions[index]"
        :from="data?.range.from"
        :to="data?.range.to"
      />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';

const props = defineProps<{ profile: string }>();
const { profile } = toRefs(props);

const { data, pending } = await useFetch('/api/contributions', { query: { profile } });

const aggregated = computed<HeatmapData | undefined>(() => {
  if (!data.value) return;
  const { aggregated, total } = aggregateContributions(data.value.contributions);
  return {
    profile: '',
    contributions: aggregated,
    totalContributions: total,
  };
});

const forges: Record<Forge, AccordionItem> = {
  'github': {
    label: 'GitHub',
    icon: 'lucide:github',
    ui: { leadingIcon: 'text-default' },
  },
  'gitlab': {
    label: 'GitLab',
    icon: 'devicon:gitlab',
  },
  'gitlab-self': {
    label: 'GitLab (self-hosted)',
    icon: 'devicon:gitlab',
  },
  'codeberg': {
    label: 'Codeberg',
    icon: 'devicon:codeberg',
  },
  'forgejo': {
    label: 'Forgejo',
    icon: 'devicon:forgejo',
  },
  'gitea': {
    label: 'Gitea',
    icon: 'devicon:gitea',
  },
};

const accordionItems = computed<AccordionItem[]>(() => {
  if (!data.value) {
    return [];
  }

  return data.value.contributions.map<AccordionItem>((forge) => {
    const forgeItem = forges[forge.forge];
    let label = forge.name ?? `${forge.forge}:${forge.username}`;

    if (forgeItem.label) {
      label = `${label} (${forgeItem.label})`;
    }

    return {
      ...forgeItem,
      label,
    };
  });
});

const contributions = computed(() => {
  if (!data.value) return;

  const forges: Array<HeatmapData & { forge: Forge }> = [];

  for (const forge of data.value.contributions) {
    const { aggregated, total } = aggregateContributions(forge);
    forges.push({
      profile: props.profile,
      forge: forge.forge,
      contributions: aggregated,
      totalContributions: total,
    });
  }

  return forges;
});
</script>
