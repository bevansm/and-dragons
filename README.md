# ... And Dragons

Gamifying learning, one integration at a time.

## Table of Contents

- [Database & API](./docs/ARCHITECTURE.md)

## Introduction

Coding's cool. What's even cooler? Wearing together the platforms used in a coding class and creating an extensible, integrated, gamified workflow. Awarding students points for engaging with different platforms and reaching learning goals can help create a community around virtual education.

## Development

### Requirements

- [Node.JS 12.x.x+](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/engine/install/)
- [VSCode](https://code.visualstudio.com/download) (reccommended IDE, but pick your poision)

### File Structure

```txt
├───dist        (compiled typescript files. gitignored)
├───docs        (doccumentation files)
├───res         (test scripts)
├───sql         (sql queries to set up tables, events, and mock data)
├───src         (the meat of the project)
│   ├───clients (api wrappers for various integrations & external apis)
│   ├───db      (a database wrapper)
│   ├───types   (typescript type files for external (aka not our) modules)
│   └───...
```

### Setup

1. If using VSCode, install the reccomended extensions. You should be prompted to do so when opening the project for the first time.
2. Run `npm install` in the root folder.
3. Copy `.mock.env` and rename as `.env`
4. Fill out `.env`
5. Run the app: `npm run dev`
6. Access the API at `http://localhost:8080`
   - You can find a list of endpoints [here](./docs/ARCHITECTURE.md#api)

#### Localhost

To run in dev mode: `npm run dev`

To run with [nodemon](https://nodemon.io/): `npm run dev:watch`

To run a compiled, "production" version: `npm build && npm start`

#### Docker

`docker-compose up` (will have to run `docker-compose build` to rebuild, and `docker-compose down` to tear down). Then, follow the instructions to initialize the database.

#### Database

To use the local database, with or without running the app in the docker container:

```bash
docker-compose up dragons_db
docker-compose exec -T dragons_db sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" -D $MYSQL_DATABASE' < ./sql/tables.sql
docker-compose exec -T dragons_db sh -c 'exec mysql -u $MYSQL_USER -p"$MYSQL_PASSWORD" -D $MYSQL_DATABASE' < ./sql/events.sql
docker-compose exec -T dragons_db sh -c 'exec mysql -u $MYSQL_USER -p"$MYSQL_PASSWORD" -D $MYSQL_DATABASE' < ./sql/mocks.sql
```

If you'd like a web UI to view the database (and see exactly what's going on!):

1. `docker-compose up dragons_admin`
2. Navigate to <http://localhost:8090>
3. Log in using:
   - Username: `dragons`
   - Password: `dragons`
4. Navigate to the `dragons_db` database on the left hand side of the menu.
5. From here, you'll be able tod look through an interact with the database. Happy development!

## Integrations

### Overview

| Platform                                                           | Notes                                                                                                                                                                                                                                                                                                 | Token                                                                                               |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [PrairieLearn](https://prairielearn.readthedocs.io/en/latest/api/) | Read only access                                                                                                                                                                                                                                                                                      | [PL Settings Page](https://ca.prairielearn.org/pl/settings)                                         |
| [Canvas](https://canvas.instructure.com/doc/api/)                  | Package likely missing types; add more in `./src/types/node-canvas-api.d.ts`                                                                                                                                                                                                                          | [Profile Page > Approved Integrations > "New Access Token"](https://canvas.ubc.ca/profile/settings) |
| [Discord](https://discordjs.guide/)                                |                                                                                                                                                                                                                                                                                                       | [Set up a Discord Bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html)      |
| Piazza                                                             | We'll have to build our own API wrapper/scraper; see [this cool article](https://hfaran.me/posts/reverse-engineering-piazzas-api/) about reverse engineering Piazza. We have cookie logic set up & functional logins; we just need to figure out what data we need, i.e. what endpoints to build out. | Use a TA/Teacher login & username                                                                   |

### Discord

- [Test Server](https://discord.gg/Fk3tk3n)

### Adding a Bot

1. [Create a Discord Application](https://discord.com/developers/applications)
2. Create a bot under `Bot > Add Bot`. Copy and paste the bot token.
3. Go to `OAuth2 > OAuth2 URL Generator` and tick the "bot" box under "scopes"
4. Copy the resulting URL
5. Copy and paste in your browser, and choose the server you'd like the bot to join!

## Notes

### Whoa, what's this whole TypeScript thing?

TypeScript is typed JavaScript. You can read about it more [here](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html). It's kinda fun because you have the freedom to create a lot of random types for objects, and interact with them in weird ways. If you'd never heard of generics before, well, TypeScript will get you on board quickly.

### This thing called tslint is yelling at me...

TSLint is a "linter", or a static code analysis tool, that enforces different coding conventions. It helps catch errors _and_ bad programming habits!

We configure TSLint using a file called `tslint.json`, which can be found in the root of the project.

TSLint is good to have because it helps squash errors and _make code easier to understand_. However, sometimes we know what we're doing, and we don't need linters to hold our hands.

If there's a certain line that tslint is screaming about, you can add a `// @ts-ignore` comment above that line:

```ts
// This is horrible, but it's valid TypeScript.
// @ts-ignore
var my_dad = !!{} + 1;
```

Alternatively, you can edit `tslint.json` to ignore a certain rule. This somewhat defeats the purpose of the linter, but if it's on your last nerve and ruining the language for you, feel free to update the file.

Coding is supposed to be fun; if linters are crushing your soul, tell them to lighten up!
