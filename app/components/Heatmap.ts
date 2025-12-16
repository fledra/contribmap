import { computed, defineComponent, h, type SVGAttributes, type VNodeProps } from 'vue';

const dayNames = ['Mon', 'Wed', 'Fri'] as const;
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const maxLabelLength = [...dayNames, ...monthNames].reduce((acc, cur) => Math.max(acc, cur.length), 0);

export default defineComponent({
  name: 'Heatmap',
  props: {
    forge: { type: String, default: '' },
    from: { type: [Date, Number] },
    to: { type: [Date, Number], default: Date.now() },
    cellSize: { type: Number, default: 10 },
    cellGap: { type: Number, default: 2 },
    cellRadius: { type: Number, default: 2 },
    labelColor: { type: String, default: 'oklch(92.2% 0 0)' },
  },
  setup(props) {
    const toDate = computed(() => new Date(props.to));
    const fromDate = computed(() => props.from ? new Date(props.from) : new Date(toDate.value.getFullYear() - 1, toDate.value.getMonth(), toDate.value.getDate()));
    const range = computed(() => getHeatmapRange(fromDate.value, toDate.value).localTime);

    const labelFontSize = computed(() => props.cellSize * 0.8);
    const labelGutter = computed(() => labelFontSize.value * maxLabelLength);
    const labelStyles = computed<SVGAttributes['style']>(() => ({
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif',
      fontSize: labelFontSize.value,
      fill: props.labelColor,
    }));

    const gridWidth = computed(() => (props.cellSize * range.value.weeksBetween) + (props.cellGap * (range.value.weeksBetween - 1)));
    const gridHeight = computed(() => (props.cellSize * DAYS_IN_WEEK) + (props.cellGap * (DAYS_IN_WEEK - 1)));
    const viewBox = computed(() => `0 0 ${gridWidth.value + labelGutter.value} ${gridHeight.value}`);

    const monthLabels = computed(() => {
      const labels: Array<[string, number]> = [];

      const from = new Date(range.value.from);
      const to = new Date(range.value.to);
      const firstDay = new Date(from.getFullYear(), from.getMonth(), from.getDate() - from.getDay());
      let cursor = new Date(from.getFullYear(), from.getMonth(), 1);

      while (cursor <= to) {
        const firstDayOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
        const weekIndex = Math.floor(getDaysBetween(firstDayOfMonth, firstDay) / DAYS_IN_WEEK);
        const month = monthNames[firstDayOfMonth.getMonth()];

        if (month && weekIndex >= 0 && weekIndex <= range.value.weeksBetween) {
          labels.push([month, weekIndex]);
        }

        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      }

      return labels;
    });

    function getCellX(index: number) {
      const col = Math.floor(index / DAYS_IN_WEEK);
      return col * (props.cellSize + props.cellGap) + labelGutter.value;
    }

    function getCellY(index: number) {
      const row = index % DAYS_IN_WEEK;
      return row * (props.cellSize + props.cellGap) + labelFontSize.value * 0.5;
    }

    function getDayLabelProps(index: number): VNodeProps & SVGAttributes {
      const row = index * 2 + 1;
      return {
        'key': `${props.forge}-day-${index}`,
        'x': labelGutter.value - maxLabelLength,
        'y': row * (props.cellSize + props.cellGap) + labelFontSize.value * 1.5,
        'text-anchor': 'end',
      };
    }

    function getMonthLabelProps(weekIndex: number): VNodeProps & SVGAttributes {
      const col = weekIndex + 1;
      return {
        key: `${props.forge}-month-${weekIndex}`,
        x: labelGutter.value + col * (props.cellSize + props.cellGap),
        y: 0,
      };
    }

    function getCellColor(index: number) {
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
        // Grid cells
        h('g', Array.from(
          { length: range.value.daysBetween },
          (_, i) => h('rect', {
            key: `${props.forge}-cell-${i}`,
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
