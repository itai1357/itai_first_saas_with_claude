import { IConfigProvider } from "./types";

export class ConfigManager {
  private provider: IConfigProvider;

  constructor(provider: IConfigProvider) {
    this.provider = provider;
  }

  async get(key: string): Promise<string | undefined> {
    return this.provider.get(key);
  }

  async getOrThrow(key: string): Promise<string> {
    const value = await this.provider.get(key);
    if (value === undefined) {
      throw new Error(`Missing required config key: "${key}"`);
    }
    return value;
  }
}
