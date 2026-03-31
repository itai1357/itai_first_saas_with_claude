import { AsyncLocalStorage } from "async_hooks";
import { ConfigGetOptions } from "./types";

export abstract class BaseConfigManager {
  protected abstract _get<T = string>(key: string): T | undefined;
  abstract init(): void;

  get<T = string>(key: string, options?: ConfigGetOptions): T | undefined {
    const value = this._get<T>(key);
    if (options?.required && !value) {
      throw new Error(`Missing required config key: "${key}"`);
    }
    return value;
  }
}

class EnvVarConfigManager extends BaseConfigManager {
  protected _get<T = string>(key: string): T | undefined {
    return process.env[key] as T | undefined;
  }

  init(): void {}
}

class ConfigManagerInstance {
  private static asyncStorage = new AsyncLocalStorage<BaseConfigManager>();

  private static _getAndInitNew(): BaseConfigManager {
    const manager = new EnvVarConfigManager();
    manager.init();
    return manager;
  }

  public static get(): BaseConfigManager {
    const store = this.asyncStorage.getStore();
    if (!store) {
      throw new Error("ConfigManager not initialized. Call initConfigManager() before accessing configuration.");
    }
    return store;
  }

  public static init(): void {
    const manager = ConfigManagerInstance._getAndInitNew();
    this.asyncStorage.enterWith(manager);
  }
}

export function getConfigManager(): BaseConfigManager {
  return ConfigManagerInstance.get();
}

export function initConfigManager(): void {
  ConfigManagerInstance.init();
}
