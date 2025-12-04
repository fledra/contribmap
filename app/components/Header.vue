<template>
  <UHeader mode="slideover" :toggle="false">
    <template #title>
      <h1 class="text-2xl font-bold tracking-wider hover:text-primary transition">
        contribmap
      </h1>
    </template>

    <template #right>
      <UTooltip text="Open on GitHub">
        <UButton
          color="neutral"
          variant="ghost"
          icon="lucide:github"
          to="https://github.com/fledra/contribmap"
          target="_blank"
        />
      </UTooltip>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
