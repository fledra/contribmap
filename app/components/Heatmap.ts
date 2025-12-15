import { computed, defineComponent, h } from 'vue';

export default defineComponent({
  name: 'Heatmap',
  props: {
    forge: { type: String, default: '' },
    from: { type: [Date, Number] },
    to: { type: [Date, Number], default: Date.now() },
    cellSize: { type: Number, default: 10 },
    cellGap: { type: Number, default: 2 },
    cellRadius: { type: Number, default: 2 },
  },
  setup(props) {
    const toDate = computed(() => new Date(props.to));
    const fromDate = computed(() => props.from ? new Date(props.from) : new Date(toDate.value.getFullYear() - 1, toDate.value.getMonth(), toDate.value.getDate()));
    const range = computed(() => getHeatmapRange(fromDate.value, toDate.value).localTime);

    const gridWidth = computed(() => (props.cellSize * range.value.weeksBetween) + (props.cellGap * (range.value.weeksBetween - 1)));
    const gridHeight = computed(() => (props.cellSize * DAYS_IN_WEEK) + (props.cellGap * (DAYS_IN_WEEK - 1)));
    const viewBox = computed(() => `0 0 ${gridWidth.value} ${gridHeight.value}`);

    function getCellX(index: number) {
      const col = Math.floor(index / DAYS_IN_WEEK);
      return col * (props.cellSize + props.cellGap);
    }

    function getCellY(index: number) {
      const row = index % DAYS_IN_WEEK;
      return row * (props.cellSize + props.cellGap);
    }

    function getColor(index: number) {
      return `oklch(0.7 0.13 ${index})`;
    }

    return () => h(
      'svg',
      {
        viewBox: viewBox.value,
        preserveAspectRatio: 'xMidYMid meet',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      [
        Array.from(
          { length: range.value.daysBetween },
          (_, i) => h('rect', {
            key: `${props.forge}-gridCell-${i}`,
            x: getCellX(i),
            y: getCellY(i),
            fill: getColor(i),
            rx: props.cellRadius,
            ry: props.cellRadius,
            width: props.cellSize,
            height: props.cellSize,
          }),
        ),
      ],
    );
  },
});
