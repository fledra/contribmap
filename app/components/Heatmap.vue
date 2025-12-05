<template>
  <div class="w-full h-full">
    <svg width="100%" height="100%" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="xMidYMid meet">
      <g>
        <rect
          v-for="(_, i) in daysInYear"
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
  </div>
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

const year = ref(new Date().getUTCFullYear());
const leapYear = computed(() => isLeapYear(year.value));
const firstDayOfYear = computed(() => getFirstDayOfYear(year.value));

const daysInWeek = 7;
const weeksInYear = 52;
const daysInYear = computed(() => (leapYear.value ? 366 : 365) + firstDayOfYear.value.day);

const width = computed(() => (boxSize * (weeksInYear + 1)) + (gap * weeksInYear));
const height = computed(() => (boxSize * daysInWeek) + (gap * (daysInWeek - 1)));

function getX(idx: number) {
  return Math.floor(idx / 7) * (boxSize + gap);
}

function getY(idx: number) {
  return (idx % 7) * (boxSize + gap);
}

function getColor(idx: number) {
  if (idx < firstDayOfYear.value.day) return 'transparent';
  return '#333';
}
</script>
