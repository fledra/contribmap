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
    theme: { type: String, default: 'dark' },
  },
  setup(props) {
    const range = computed(() => getHeatmapRange(props.from, props.to).localTime);

    const dayLabelGutter = computed(() => props.labelSize * 2.8 + props.labelMargin);
    const monthLabelGutter = computed(() => props.labelSize * 1.5 + props.labelMargin);
    const legendGutter = computed(() => props.heatmap ? monthLabelGutter.value + props.labelMargin * 1.5 : 0);

    const gridWidth = computed(() => (range.value.weeksBetween * (props.cellSize + props.cellGap)) - props.cellGap);
    const gridHeight = computed(() => (DAYS_PER_WEEK * (props.cellSize + props.cellGap)) - props.cellGap);
    const viewBox = computed(() => `0 0 ${gridWidth.value + dayLabelGutter.value} ${gridHeight.value + monthLabelGutter.value + legendGutter.value}`);

    const theme = computed(() => getTheme(props.theme));
    const themeLevelThresholds = computed(() => {
      const contributions = props.heatmap ? Object.values(props.heatmap.contributions).map((c) => c.count) : [0];
      const max = Math.max(...contributions);
      return [
        Math.floor(max * 0.2),
        Math.floor(max * 0.4),
        Math.floor(max * 0.6),
        Math.floor(max * 0.8),
      ] as const;
    });

    function getCellColorLevel(index: number) {
      if (!props.heatmap) {
        return 1337; // party mode!
      }

      const offset = (index + 1) * MS_PER_DAY;
      const date = getISODate(range.value.from + offset);

      const contribution = props.heatmap.contributions[date];
      const count = contribution?.count ?? 0;
      const [q1, q2, q3, q4] = themeLevelThresholds.value;

      if (count === 0) return 0;
      if (count <= q1) return 1;
      if (count <= q2) return 2;
      if (count <= q3) return 3;
      if (count <= q4) return 4;
      return 5;
    }

    const gridCells = computed(() => {
      const cells: HeatmapElement[] = [];

      for (let i = 0; i < range.value.daysBetween; i++) {
        const row = i % DAYS_PER_WEEK;
        const col = Math.floor(i / DAYS_PER_WEEK);

        const colorLevel = getCellColorLevel(i);
        const color = colorLevel === 1337 ? { fill: `oklch(0.7 0.13 ${i % 360})` } : { class: `level-${colorLevel}` };

        cells.push({
          key: `cell-${i}`,
          x: dayLabelGutter.value + (col * (props.cellSize + props.cellGap)),
          y: monthLabelGutter.value + (row * (props.cellSize + props.cellGap)),
          rx: props.cellRadius,
          ry: props.cellRadius,
          width: props.cellSize,
          height: props.cellSize,
          ...color,
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
          'text': getDayName(date).slice(0, 3),
          'x': dayLabelGutter.value - props.labelMargin,
          'y': row + (props.cellSize / 2) + (props.labelSize / 3),
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
        const label = getMonthName(date).slice(0, 3);

        if (labels.find((l) => l.text === label)) {
          continue;
        }

        const month = date.getMonth();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const weekIndex = Math.floor(getDaysBetween(firstDayOfMonth, startDate) / DAYS_PER_WEEK);

        if (weekIndex >= 0 && currentMonth !== month) {
          labels.push({
            text: label,
            x: dayLabelGutter.value + i * (props.cellSize + props.cellGap),
            y: monthLabelGutter.value - props.labelMargin,
          });

          currentMonth = month;
        }
      }

      return labels;
    });

    const legendCells = computed(() => {
      const cells: HeatmapElement[] = [];
      const levels = Object.keys(theme.value.levels);

      for (let level = 0; level < levels.length; level++) {
        const color = theme.value.levels[level as ContribmapThemeLevel];

        cells.push({
          key: `legend-cell-${level}`,
          x: (level * (props.cellSize + props.cellGap)),
          rx: props.cellRadius,
          ry: props.cellRadius,
          width: props.cellSize,
          height: props.cellSize,
          fill: color,
        });
      }

      return cells;
    });

    const legendWidth = computed(() => (legendCells.value.length + 1) * (props.cellSize + props.cellGap));

    const classes = computed(() => `
      ${Object.entries(theme.value.levels).map(([level, color]) => `.level-${level} { fill: ${color} }`).join('')}

      .label {
        font-family: -apple-system, BlinkMacSystemFont, system-ui, Roboto, Arial, sans-serif;
        font-size: ${props.labelSize}px;
        fill: ${theme.value.labelColor};
      }
    `);

    return () => h(
      'svg',
      {
        viewBox: viewBox.value,
        preserveAspectRatio: 'xMidYMid meet',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      [
        // SVG styles
        h('style', classes.value),

        // Grid cells
        h('g', gridCells.value.map((props) => h('rect', props))),

        // Day labels
        h('g', { class: 'label' }, dayLabels.value.map(({ text, ...props }) => h('text', props, text))),

        // Month labels
        h('g', { class: 'label' }, monthLabels.value.map(({ text, ...props }) => h('text', props, text))),

        // Legend
        (props.heatmap && h('g', { transform: `translate(${gridWidth.value - legendWidth.value}, ${gridHeight.value + legendGutter.value})` }, [
          h(
            'text',
            {
              'class': 'label',
              'y': props.labelSize,
              'dx': -props.cellGap * 2,
              'text-anchor': 'end',
            },
            'Less',
          ),

          legendCells.value.map((props) => h('rect', props)),

          h(
            'text',
            {
              class: 'label',
              y: props.labelSize,
              dx: legendWidth.value - (props.cellSize + props.cellGap) + props.cellGap,
            },
            'More',
          ),
        ])),
      ],
    );
  },
});
