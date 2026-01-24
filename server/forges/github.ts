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

export const fetchGithub: ContributionFetcher = async (config, options) => {
  let token: string | undefined;

  if (config.token) {
    token = getToken(config.token);
  }

  const response = await $fetch<GithubResponse>(BASE_URL, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: {
      query,
      variables: {
        username: config.username,
        from: new Date(options.from).toISOString(),
        to: new Date(options.to).toISOString(),
      },
    },
  });

  const contributions = response
    .data
    .user
    .contributionsCollection
    .contributionCalendar
    .weeks
    .flatMap((week) => week.contributionDays.map<Contribution>((day) => ({
      date: getISODate(day.date),
      count: day.contributionCount,
    })));

  return contributions;
};
