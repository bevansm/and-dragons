declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_BOT_TOKEN: string;
      PIAZZA_USER: string;
      PIAZZA_PASS: string;
      PL_API_TOKEN: string;
      PL_API_DOMAIN: string;
      CANVAS_API_TOKEN: string;
      CANVAS_API_DOMAIN: string;
      DB_HOST: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
    }
  }
}

export {};
