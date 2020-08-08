# ... And Dragons

Gamifying learning, one integration at a time.

## Introduction

Coding's cool. What's even cooler? Wearing together the platforms used in a coding class and creating an extensible, integrated, gamified workflow. Awarding students points for engaging with different platforms and reaching learning goals can help create a community around virtual education.

## Development

### Requirements

- Docker
- Node.JS 14.3.0

### Use

1. Copy `.mock.env` and rename as `.env`
2. Fill out `.env`
3. Run `and_dragons`

#### Localhost

To run with `nodemon`, i.e. to run with live reloads: `npm start:dev`

To run a "production" version: `npm build && npm start`

#### With Docker

// TODO
`docker-compose up` (will have to run `docker-compose build` to rebuild, and `docker-compose down` to tear down)

### APIS

| API                                                                | Notes                                                                        | Token                                                                                               |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [PrairieLearn](https://prairielearn.readthedocs.io/en/latest/api/) | Read only access                                                             | Ask Cinda                                                                                           |
| [Canvas](https://github.com/ubccapico/node-canvas-api)             | Package likely missing types; add more in `./src/types/node-canvas-api.d.ts` | [Profile Page > Approved Integrations > "New Access Token"](https://canvas.ubc.ca/profile/settings) |
| [Discord](https://discordjs.guide/)                                |                                                                              | [Set up a Discord Bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html)      |
| [Piazza](https://www.npmjs.com/package/piazza-api)                 | Package likely missing types; add more in `./src/types/piazza-api.d.ts`      | Use a TA/Teacher login & username                                                                   |
