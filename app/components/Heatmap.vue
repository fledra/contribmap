<template>
  <svg width="100%" height="100%" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="xMidYMid meet">
    <g>
      <rect
        v-for="(_, i) in daysBetween"
        :key="i"
        :x="getX(i)"
        :y="getY(i)"
        :width="boxSize"
        :height="boxSize"
        :rx="boxRadius"
        :ry="boxRadius"
        :fill="getColor(i)"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
interface HeatmapProps {
  boxSize?: number;
  boxRadius?: number;
  gap?: number;
}

const {
  boxSize = 10,
  boxRadius = 2,
  gap = 2,
} = defineProps<HeatmapProps>();

const daysInWeek = 7;
const heatmapRange = getHeatmapRange();
const { daysBetween, weeksBetween } = heatmapRange.local;

const width = computed(() => (boxSize * (weeksBetween + 1)) + (gap * weeksBetween));
const height = computed(() => (boxSize * daysInWeek) + (gap * daysInWeek));

function getX(idx: number) {
  return Math.floor(idx / daysInWeek) * (boxSize + gap);
}

function getY(idx: number) {
  return (idx % daysInWeek) * (boxSize + gap);
}

function getColor(idx: number) {
  return `oklch(0.7 0.13 ${idx})`;
}
</script>
