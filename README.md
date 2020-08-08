# ... And Dragons

Gamifying learning, one integration at a time.

## Introduction

Coding's cool. What's even cooler? Wearing together the platforms used in a coding class and creating an extensible, integrated, gamified workflow. Awarding students points for engaging with different platforms and reaching learning goals can help create a community around virtual education.

## Development

### Requirements

- Docker
- Node.JS 12.x.x+

### Setup

1. Run `npm install` in the root folder.
2. Copy `.mock.env` and rename as `.env`
3. Fill out `.env`
4. Run the app: `npm start dev`
5. Access the API at `http://localhost:8080`

#### Localhost

To run in dev mode: `npm start dev`

To run with [nodemon](https://nodemon.io/): `npm start dev:watch`

To run a compiled, "production" version: `npm build && npm start`

#### With Docker

`docker-compose up` (will have to run `docker-compose build` to rebuild, and `docker-compose down` to tear down)

## API

| Endpoint  | Description        | Response            |
| --------- | ------------------ | ------------------- |
| `/health` | Server liveliness. | `OK` (upon success) |

## Integrations

### Overview

| Platform                                                           | Notes                                                                                                                                                                                                                                                                                                 | Token                                                                                               |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [PrairieLearn](https://prairielearn.readthedocs.io/en/latest/api/) | Read only access                                                                                                                                                                                                                                                                                      | Ask Cinda                                                                                           |
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
