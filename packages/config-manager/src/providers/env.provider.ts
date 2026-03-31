import { IConfigProvider } from "../types";

export class EnvConfigProvider implements IConfigProvider {
  async get(key: string): Promise<string | undefined> {
    return process.env[key];
  }
}
