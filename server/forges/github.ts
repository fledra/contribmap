interface GithubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: GithubContributionCalendar;
      };
    };
  };
}

interface GithubContributionCalendar {
  totalContributions: number;
  weeks: GithubContributionWeek[];
}

interface GithubContributionWeek {
  contributionDays: GithubContributionDay[];
}

interface GithubContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

const BASE_URL = 'https://api.github.com/graphql';
const query = `
  query ContributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

function chunkQueries(options: ContributionFetcherOptions) {
  const chunks: ContributionFetcherOptions[] = [];
  const MS_PER_YEAR = (MS_PER_DAY * DAYS_PER_YEAR) + MS_PER_DAY; // current day inclusive

  const to = +new Date(options.to);
  let from = +new Date(options.from);

  while (from < to) {
    const currentTo = Math.min(from + MS_PER_YEAR, to);

    chunks.push({
      ...options,
      from: new Date(from).toISOString(),
      to: new Date(currentTo).toISOString(),
    });

    from = currentTo;
  }

  return chunks;
}

export const fetchGithub: ContributionFetcher = async (config, options) => {
  let token: string | undefined;

  if (config.token) {
    token = getToken(config.token);
  }

  const chunks = chunkQueries(options);
  const queries = await Promise.all(
    chunks.map((chunk) => $fetch<GithubResponse>(BASE_URL, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: {
        query,
        variables: {
          username: config.username,
          from: new Date(chunk.from).toISOString(),
          to: new Date(chunk.to).toISOString(),
        },
      },
    })),
  );

  const contributions = queries.reduce<Contribution[]>((acc, res) => {
    const weeks = res.data.user.contributionsCollection.contributionCalendar.weeks;

    for (const week of weeks) {
      for (const day of week.contributionDays) {
        acc.push({
          date: getISODate(day.date),
          count: day.contributionCount,
        });
      }
    }

    return acc;
  }, []);

  return contributions;
};
