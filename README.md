![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# ZMS Bürgeramt Prototyp Supabase Backend

This is the backend for the ZMS Prototyp Bürgeramt project.

## Prerequisites

- Docker
- Supabase Account
- Supabase CLI

## Installation

1. Clone the repository
2. Run supabase start

## Usage or Deployment

1. Link to existing supabase project or create a new one `supabase link --project-ref 123qwertz`
2. Start the local database `supabase start`
3. Push the local state to the remote

## Realtime

To make realtime subscriptions to the tables work you need to run this sql query in the database:

```sql
-- See https://supabase.com/docs/guides/realtime/postgres-changes
BEGIN;
-- remove the supabase_realtime publication
DROP publication IF EXISTS supabase_realtime;
-- re-create the supabase_realtime publication with no tables
CREATE publication supabase_realtime;
COMMIT;

-- add a table to the publication
ALTER publication supabase_realtime
	ADD TABLE processes;

ALTER TABLE processes REPLICA IDENTITY
	FULL;


```

## Cron Jobs for score Computation

Adding the cron extension [to the migrations](supabase/migrations/20221005135333_cron.sql) did create some errors in local development. To fix this, the following steps are necessary:

When you have a remote database running got to the database settings under `https://app.supabase.com/project/<YOUR PROJECT ID>/database/extensions` and enable the cron extension.

Then run the following SQL query in the database:

```sql
SELECT
	cron.schedule ('update processes scores every minute', '* * * * *', $$
		SELECT
			public.compute_scores () $$);
```

This creates a new cronjob that runs the function `public.compute_scores` every minute.

## Development

## Tests

## Contributing

Before you create a pull request, write an issue so we can discuss your changes.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt="Fabian Morón Zirfas"/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/zms-supabase/commits?author=ff6347" title="Documentation">📖</a> <a href="https://github.com/technologiestiftung/zms-supabase/commits?author=ff6347" title="Code">💻</a> <a href="#design-ff6347" title="Design">🎨</a> <a href="#infra-ff6347" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-ff6347" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="http://vogelino.com"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt="Lucas Vogel"/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/zms-supabase/commits?author=vogelino" title="Documentation">📖</a> <a href="#ideas-vogelino" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/technologiestiftung/zms-supabase/pulls?q=is%3Apr+reviewed-by%3Avogelino" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/technologiestiftung/zms-supabase/commits?author=vogelino" title="Code">💻</a></td>
      <td align="center"><a href="http://www.awsm.de"><img src="https://avatars.githubusercontent.com/u/434355?v=4?s=64" width="64px;" alt="Ingo Hinterding"/><br /><sub><b>Ingo Hinterding</b></sub></a><br /><a href="https://github.com/technologiestiftung/zms-supabase/commits?author=Esshahn" title="Documentation">📖</a> <a href="#ideas-Esshahn" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/technologiestiftung/zms-supabase/pulls?q=is%3Apr+reviewed-by%3AEsshahn" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Content Licencing

Texts and content available as [CC BY](https://creativecommons.org/licenses/by/3.0/de/).

Illustrations by Maria Musterfrau, all rights reserved.

## Credits

<table>
  <tr>
    <td>
      Made by <a href="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://citylab-berlin.org/wp-content/uploads/2021/05/citylab-logo.svg" />
      </a>
    </td>
    <td>
      A project by <a href="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://citylab-berlin.org/wp-content/uploads/2021/05/tsb.svg" />
      </a>
    </td>
    <td>
      Supported by <a href="https://www.berlin.de/rbmskzl/">
        <br />
        <br />
        <img width="80" src="https://citylab-berlin.org/wp-content/uploads/2021/12/B_RBmin_Skzl_Logo_DE_V_PT_RGB-300x200.png" />
      </a>
    </td>
  </tr>
</table>

## Related Projects

<!-- test semantic release back merge -->
