import { computed, defineComponent, h, type SVGAttributes, type VNodeProps } from 'vue';

type HeatmapElement = VNodeProps & SVGAttributes;
type HeatmapLabel = HeatmapElement & { text: string };

export default defineComponent({
  name: 'Heatmap',
  props: {
    heatmap: { type: Object as PropType<HeatmapData> },
    from: { type: [Date, Number] },
    to: { type: [Date, Number], default: Date.now() },
    cellSize: { type: Number, default: 10 },
    cellGap: { type: Number, default: 2 },
    cellRadius: { type: Number, default: 2 },
    labelSize: { type: Number, default: 8 },
    labelMargin: { type: Number, default: 4 },
    labelColor: { type: String, default: 'oklch(92.2% 0 0)' },
  },
  setup(props) {
    const range = computed(() => getHeatmapRange(props.from, props.to).localTime);

    const dayLabelGutter = computed(() => props.labelSize * 2.8);
    const monthLabelGutter = computed(() => props.labelSize * 1.5);

    const gridWidth = computed(() => (range.value.weeksBetween * (props.cellSize + props.cellGap)) - props.cellGap);
    const gridHeight = computed(() => (DAYS_PER_WEEK * (props.cellSize + props.cellGap)) - props.cellGap);
    const viewBox = computed(() => `0 0 ${gridWidth.value + dayLabelGutter.value} ${gridHeight.value + monthLabelGutter.value}`);

    function getCellColor(index: number) {
      return `oklch(0.7 0.13 ${index % 360})`;
    }

    const gridCells = computed(() => {
      const cells: HeatmapElement[] = [];

      for (let i = 0; i < range.value.daysBetween; i++) {
        const row = i % DAYS_PER_WEEK;
        const col = Math.floor(i / DAYS_PER_WEEK);

        cells.push({
          key: `cell-${i}`,
          x: dayLabelGutter.value + (col * (props.cellSize + props.cellGap)),
          y: monthLabelGutter.value + (row * (props.cellSize + props.cellGap)),
          rx: props.cellRadius,
          ry: props.cellRadius,
          width: props.cellSize,
          height: props.cellSize,
          fill: getCellColor(i),
        });
      }

      return cells;
    });

    const dayLabels = computed(() => {
      const labels: HeatmapLabel[] = [];

      // Day indexes of Monday, Wednesday and Friday
      for (const dayIndex of [1, 3, 5]) {
        const row = monthLabelGutter.value + (dayIndex * (props.cellSize + props.cellGap));
        const date = new Date();
        date.setDate(date.getDate() - date.getDay() + dayIndex);

        labels.push({
          'text': getDayName(date),
          'x': dayLabelGutter.value - props.labelMargin,
          'y': row + (props.cellSize / 2) + (props.labelSize / 3),
          'font-size': props.labelSize,
          'text-anchor': 'end',
        });
      }

      return labels;
    });

    const monthLabels = computed(() => {
      const labels: HeatmapLabel[] = [];
      const startDate = new Date(range.value.from);

      let currentMonth = -1;

      for (let i = 0; i < range.value.weeksBetween; i++) {
        const date = new Date(range.value.from + (i * 7 * MS_PER_DAY));
        const month = date.getMonth();

        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const weekIndex = Math.floor(getDaysBetween(firstDayOfMonth, startDate) / DAYS_PER_WEEK);

        if (weekIndex >= 0 && currentMonth !== month) {
          labels.push({
            'text': getMonthName(date),
            'x': dayLabelGutter.value + i * (props.cellSize + props.cellGap),
            'y': monthLabelGutter.value - props.labelMargin,
            'font-size': props.labelSize,
          });

          currentMonth = month;
        }
      }

      return labels;
    });

    return () => h(
      'svg',
      {
        viewBox: viewBox.value,
        preserveAspectRatio: 'xMidYMid meet',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      [
        // Grid cells
        h('g', gridCells.value.map((props) => h('rect', props))),

        // Day labels
        h('g', { fill: 'white' }, dayLabels.value.map(({ text, ...props }) => h('text', props, text))),

        // Month labels
        h('g', { fill: 'white' }, monthLabels.value.map(({ text, ...props }) => h('text', props, text))),
      ],
    );
  },
});
