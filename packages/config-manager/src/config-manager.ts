import { ConfigGetOptions } from "./types";

export abstract class BaseConfigManager {
  protected abstract _get(key: string): string | undefined;
  abstract init(): void;

  get(key: string, options?: ConfigGetOptions): string | undefined {
    const value = this._get(key);
    if (options?.required && (value === null || value === undefined)) {
      throw new Error(`Missing required config key: "${key}"`);
    }
    return value;
  }
}

class EnvVarConfigManager extends BaseConfigManager {
  protected _get(key: string): string | undefined {
    return process.env[key];
  }

  init(): void {}
}

let instance: BaseConfigManager | null = null;

export function getConfigManager(): BaseConfigManager {
  if (!instance) {
    instance = new EnvVarConfigManager();
  }
  return instance;
}

export function initConfigManager(): void {
  const manager = getConfigManager();
  manager.init();
}
