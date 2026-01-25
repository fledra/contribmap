<template>
  <NuxtRouteAnnouncer />

  <UApp>
    <Header />

    <UMain>
      <UContainer class="pt-4">
        <UEmpty
          v-if="!profiles || profiles.length === 0"
          class="mt-12"
          icon="i-lucide:file-cog"
          title="No profiles found"
          description="Looks like you haven't configured any profiles. Configure at least one profile to generate a heatmap."
        />

        <div v-else>
          <div class="flex justify-end items-center gap-2 mb-2">
            <p>Profile:</p>
            <USelect
              v-model="profile"
              :items="profiles"
              :loading="profilesLoading"
              :ui="{ content: 'min-w-fit', itemTrailingIcon: 'text-primary' }"
              class="w-42"
            />
          </div>
        </div>
      </UContainer>
    </UMain>
  </UApp>
</template>

<script setup lang="ts">
const { data: profiles, pending: profilesLoading } = await useAsyncData('profiles', (_, { signal }) => $fetch('/api/profiles', { signal }));
const profile = ref('default');
</script>
