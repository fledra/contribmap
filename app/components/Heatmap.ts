import { computed, defineComponent, h, type SVGAttributes, type VNodeProps } from 'vue';

const dayNames = ['Mon', 'Wed', 'Fri'] as const;
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const maxDayNameLength = dayNames.reduce((acc, cur) => Math.max(acc, cur.length), 0);

const CHAR_WIDTH_RATIO = 0.65;

export default defineComponent({
  name: 'Heatmap',
  props: {
    heatmap: { type: Object as PropType<HeatmapData> },
    from: { type: [Date, Number] },
    to: { type: [Date, Number], default: Date.now() },
    cellSize: { type: Number, default: 10 },
    cellGap: { type: Number, default: 2 },
    cellRadius: { type: Number, default: 2 },
    labelFontSize: { type: Number, default: 8 },
    labelMargin: { type: Number, default: 4 },
    labelColor: { type: String, default: 'oklch(92.2% 0 0)' },
  },
  setup(props) {
    const toDate = computed(() => new Date(props.to));
    const fromDate = computed(() => props.from ? new Date(props.from) : new Date(toDate.value.getFullYear(), toDate.value.getMonth(), toDate.value.getDate() - DAYS_PER_YEAR));
    const range = computed(() => getHeatmapRange(fromDate.value, toDate.value).localTime);

    const xAxisGutter = computed(() => props.labelFontSize + props.labelMargin * 2);
    const yAxisGutter = computed(() => props.labelMargin + maxDayNameLength * props.labelFontSize * CHAR_WIDTH_RATIO);

    const gridWidth = computed(() => (props.cellSize * range.value.weeksBetween) + (props.cellGap * (range.value.weeksBetween - 1)));
    const gridHeight = computed(() => (props.cellSize * DAYS_PER_WEEK) + (props.cellGap * (DAYS_PER_WEEK - 1)));
    const viewBox = computed(() => `0 0 ${gridWidth.value + yAxisGutter.value} ${gridHeight.value + xAxisGutter.value}`);

    const labelStyles = computed<SVGAttributes['style']>(() => ({
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif',
      fontSize: props.labelFontSize,
      fill: props.labelColor,
    }));

    const monthLabels = computed(() => {
      const labels: Array<[string, number]> = [];

      const from = new Date(range.value.from);
      const to = new Date(range.value.to);
      const firstDay = new Date(from.getFullYear(), from.getMonth(), from.getDate() - from.getDay());
      let cursor = new Date(from.getFullYear(), from.getMonth(), 1);

      while (cursor <= to) {
        const firstDayOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
        const weekIndex = Math.floor(getDaysBetween(firstDayOfMonth, firstDay) / DAYS_PER_WEEK);
        const month = monthNames[firstDayOfMonth.getMonth()];

        if (month && weekIndex >= 0 && weekIndex <= range.value.weeksBetween) {
          labels.push([month, weekIndex]);
        }

        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      }

      return labels;
    });

    function getCellX(index: number) {
      const col = Math.floor(index / DAYS_PER_WEEK);
      return col * (props.cellSize + props.cellGap) + yAxisGutter.value;
    }

    function getCellY(index: number) {
      const row = index % DAYS_PER_WEEK;
      return row * (props.cellSize + props.cellGap) + xAxisGutter.value;
    }

    function getDayLabelProps(index: number): VNodeProps & SVGAttributes {
      const row = (index * 2) + 1;
      const rowY = getCellY(row);

      return {
        'key': `day-${index}`,
        'x': yAxisGutter.value - props.labelMargin,
        'y': rowY + props.cellSize / 2,
        'text-anchor': 'end',
        'dominant-baseline': 'middle',
      };
    }

    function getMonthLabelProps(weekIndex: number): VNodeProps & SVGAttributes {
      const colX = getCellX((weekIndex + 1) * DAYS_PER_WEEK);

      return {
        'key': `month-${weekIndex}`,
        'x': colX - props.cellGap / 2,
        'y': props.labelMargin,
        'dominant-baseline': 'hanging',
      };
    }

    function getCellColor(index: number) {
      return `oklch(0.7 0.13 ${index % 360})`;
    }

    return () => h(
      'svg',
      {
        viewBox: viewBox.value,
        preserveAspectRatio: 'xMidYMid meet',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      [
        // Grid cells
        h('g', Array.from(
          { length: range.value.daysBetween },
          (_, i) => h('rect', {
            key: `cell-${i}`,
            x: getCellX(i),
            y: getCellY(i),
            fill: getCellColor(i),
            rx: props.cellRadius,
            ry: props.cellRadius,
            width: props.cellSize,
            height: props.cellSize,
          }),
        )),

        // Labels
        h('g', { style: labelStyles.value }, [
          dayNames.map((day, i) => h('text', getDayLabelProps(i), day)),
          monthLabels.value.map(([month, i]) => h('text', getMonthLabelProps(i), month)),
        ]),
      ],
    );
  },
});
