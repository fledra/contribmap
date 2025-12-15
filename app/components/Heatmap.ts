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
    }));

    const gridWidth = computed(() => (props.cellSize * range.value.weeksBetween) + (props.cellGap * (range.value.weeksBetween - 1)));
    const gridHeight = computed(() => (props.cellSize * DAYS_IN_WEEK) + (props.cellGap * (DAYS_IN_WEEK - 1)));
    const viewBox = computed(() => `0 0 ${gridWidth.value + labelGutter.value} ${gridHeight.value}`);

    function getCellX(index: number) {
      const col = Math.floor(index / DAYS_IN_WEEK);
      return col * (props.cellSize + props.cellGap) + labelGutter.value;
    }

    function getCellY(index: number) {
      const row = index % DAYS_IN_WEEK;
      return row * (props.cellSize + props.cellGap);
    }

    function getColor(index: number) {
      return `oklch(0.7 0.13 ${index})`;
    }

    function getDayLabelProps(index: number): VNodeProps & SVGAttributes {
      const row = index * 2 + 1;

      return {
        'key': `${props.forge}-day-${index}`,
        'x': labelGutter.value - maxLabelLength,
        'y': row * (props.cellSize + props.cellGap) + labelFontSize.value,
        'text-anchor': 'end',
      };
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
            fill: getColor(i),
            rx: props.cellRadius,
            ry: props.cellRadius,
            width: props.cellSize,
            height: props.cellSize,
          }),
        )),

        // Labels
        h('g', { style: labelStyles.value }, [
          dayNames.map((day, i) => h('text', getDayLabelProps(i), day)),
        ]),
      ],
    );
  },
});
