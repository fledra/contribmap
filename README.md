<h1 align="center">
  <img src="public/favicon/android-chrome-192x192.png" alt="contribmap icon" />
  <p>contribmap</p>
</h1>

contribmap is an app that pulls contribution activity from different software forges and merges them into a single calendar heatmap.

## Configuration

contribmap requires a configuration file to function properly and automatically detects your configuration file in the project root.

To keep your account(s) secure, contribmap uses Indirect Token Mapping. This means you never put your actual API keys in your configuration files.
Instead, you define them in your environment and reference the name of that variable in your configuration to tell the app which variable name to look for.

### Configuration Methods

You can configure contribmap via (in order of precedence):

- A `CONTRIBMAP_CONFIG` environment variable
- A `.contribmaprc` file in JSON or YAML format
- A `contribmap.config.json` file
- A `contribmap.config.yaml` or `contribmap.config.yml` file

### Configuration Format

Whether you use a file or the `CONTRIBMAP_SOURCES` environment variable, the data structure remains identical.

#### Schema

The configuration is an object where each key is a _Profile Name_. Each profile contains an array of _Sources_.

| Field    | Type    | Description                                                             |
| -------- | ------- | ----------------------------------------------------------------------- |
| name     | string? | Optional display name to differentiate instances                        |
| forge    | string  | `github`, `gitlab`, `gitlab-self`, `codeberg`, `forgejo`, or `gitea`    |
| username | string  | Your username on the platform                                           |
| token    | string  | The name of the environment variable that is holding your API token     |
| baseUrl  | string  | Required for self-hosted instances (e.g. <https://git.yourdomain.com>)  |

A basic configuration would look like this:

```jsonc
// contribmap.config.json

{
  "default": [
    { "forge": "github", "username": "githubusername", "token": "GH_TOKEN" },
    { "forge": "gitlab", "username": "gitlabusername", "token": "GITLAB_TOKEN" }
  ]
}
```

OR

```yaml
# contribmap.config.yaml

default:
  - forge: github
    username: githubusername
    token: GH_TOKEN

  - forge: gitlab
    username: gitlabusername
    token: GITLAB_TOKEN
```

> [!IMPORTANT]
> If you prefer to use the environment variable to configure contribmap, be sure that the value of this environment variable must be a **valid JSON string** that follows the exact same structure as a `contribmap.config.json` file.

> [!TIP]
> You can fill a `contribmap.config.json` file and and use `jq` to easily generate a value for `CONTRIBMAP_CONFIG` environment variable:
>
> ```sh
> jq -c . contribmap.config.json
> ```

<details>
<summary>Multi-profile configuration</summary>

You can define multiple profiles in your configuration:

```jsonc
// contribmap.config.json

{
  "$schema": "./public/schema.json",
  "default": [
    {
      "forge": "github",
      "username": "githubusername",
      "token": "GH_TOKEN"
    },
    {
      "forge": "gitlab",
      "username": "gitlabusername",
      "token": "GITLAB_TOKEN"
    }
  ],
  "work": [
    {
      "forge": "github",
      "username": "githubusername",
      "token": "GH_TOKEN"
    },
    {
      "forge": "gitlab-self",
      "username": "yourusername",
      "token": "WORK_GITLAB_TOKEN",
      "baseURL": "https://git.yourcompany.com"
    }
  ]
  // ...other profiles
}
```

OR

```yaml
# contribmap.config.yaml

default:
  - forge: github
    username: githubusername
    token: GH_TOKEN

  - forge: gitlab
    username: gitlabusername
    token: GITLAB_TOKEN

work:
  - forge: github
    username: githubusername
    token: GH_TOKEN

  - forge: gitlab-self
    username: yourusername
    token: WORK_GITLAB_TOKEN
    baseURL: https://git.yourcompany.com

# ...other profiles
```

</details>

## License

Copyright (C) 2025-PRESENT [Baran D. (Fledra)](https://fledra.dev)

Licensed under GNU Affero General Public License as stated in the [LICENSE](./LICENSE):

```md
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
