import { IRepository } from "../../shared/interfaces";

export abstract class Provider<Client> {
  constructor(readonly name: string) {}

  _client: Client;

  get client(): Client {
    return this._client;
  }

  protected abstract authenticate(): void;
  abstract getRepositoriesByUsername(username: string): Promise<Partial<IRepository>[]>;
  abstract getRepositoryByName(name: string): Promise<IRepository>;
}
