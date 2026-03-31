import { AsyncLocalStorage } from "async_hooks";
import { IConfigProvider } from "./types";
import { ConfigManager } from "./config-manager";

const asyncLocalStorage = new AsyncLocalStorage<ConfigManager>();

export function initConfigContext(provider: IConfigProvider): void {
  asyncLocalStorage.enterWith(new ConfigManager(provider));
}

export function getConfig(): ConfigManager {
  const config = asyncLocalStorage.getStore();
  if (!config) {
    throw new Error("Config context not initialized. Call initConfigContext() first.");
  }
  return config;
}

export { IConfigProvider } from "./types";
export { ConfigManager } from "./config-manager";
export { EnvConfigProvider } from "./providers/env.provider";
