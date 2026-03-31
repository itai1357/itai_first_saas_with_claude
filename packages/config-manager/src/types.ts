export interface IConfigProvider {
  get(key: string): Promise<string | undefined>;
}
