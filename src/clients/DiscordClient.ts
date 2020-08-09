import { Client } from 'discord.js';

export class DiscordClient {
  private static client: Client;
  /**
   * Returns a discord.js client. If token is not provided, uses
   * DISCORD_BOT_TOKEN to log in.
   * @param token
   */
  public static async getClient(token?: string) {
    if (DiscordClient.client) return DiscordClient.client;
    const discordClient = new Client({
      restRequestTimeout: 600000,
      retryLimit: 10,
    });
    await discordClient.login(token || process.env.DISCORD_BOT_TOKEN);
    await new Promise(resolve => discordClient.on('ready', resolve));
    DiscordClient.client = discordClient;
    return discordClient;
  }
}
export default DiscordClient;
