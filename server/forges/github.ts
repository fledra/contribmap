import type { Contribution, ContributionFetcher } from '../types/contribution';

export interface GithubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: GithubContributionCalendar;
      };
    };
  };
}

export interface GithubContributionCalendar {
  totalContributions: number;
  weeks: GithubContributionWeek[];
}

export interface GithubContributionWeek {
  contributionDays: GithubContributionDay[];
}

export interface GithubContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

const BASE_URL = 'https://api.github.com/graphql';
const query = `
  query ContributionCalendar($username: String!) {
    user(login: $username) {
      contributionsCollection {
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

export const fetchGithub: ContributionFetcher = async (config) => {
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
      variables: { username: config.username },
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
