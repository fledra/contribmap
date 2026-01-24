export interface ContribmapTheme {
  name: string;
  labelColor: string;
  levels: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}

export type ContribmapThemeLevel = keyof ContribmapTheme['levels'];

const themes: Record<string, ContribmapTheme> = {
  'light': {
    name: 'contribmap Light',
    labelColor: '#64748b',
    levels: {
      0: '#ebedf0',
      1: '#bae6fd',
      2: '#7dd3fc',
      3: '#0ea5e9',
      4: '#0284c7',
      5: '#0369a1',
    },
  },

  'dark': {
    name: 'contribmap Dark',
    labelColor: '#8b949e',
    levels: {
      0: '#161b22',
      1: '#082f49',
      2: '#075985',
      3: '#0369a1',
      4: '#0ea5e9',
      5: '#7dd3fc',
    },
  },

  'github-light': {
    name: 'GitHub Light',
    labelColor: '#57606a',
    levels: {
      0: '#ebedf0',
      1: '#9be9a8',
      2: '#40c463',
      3: '#30a14e',
      4: '#216e39',
      5: '#194d28',
    },
  },

  'github-dark': {
    name: 'GitHub Dark',
    labelColor: '#8b949e',
    levels: {
      0: '#161b22',
      1: '#0e4429',
      2: '#006d32',
      3: '#26a641',
      4: '#39d353',
      5: '#56e36d',
    },
  },

  'forgejo-light': {
    name: 'Forgejo Light',
    labelColor: '#18181b',
    levels: {
      0: '#e5e5e8',
      1: '#fdba74',
      2: '#f97316',
      3: '#c2410c',
      4: '#9a3412',
      5: '#7c2d12',
    },
  },

  'forgejo-dark': {
    name: 'Forgejo Dark',
    labelColor: '#d2e0f0',
    levels: {
      0: '#232c37',
      1: '#9a3412',
      2: '#ea580c',
      3: '#fb923c',
      4: '#fdba74',
      5: '#fed7aa',
    },
  },
};

export default function getTheme(theme?: keyof typeof themes): ContribmapTheme {
  if (!theme || !themes[theme]) {
    return themes.dark as ContribmapTheme;
  }

  return themes[theme];
}
