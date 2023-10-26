export interface IRepository {
  id: number;
  name: string;
  private: boolean;
  ownerName: string;
  size: number;
  numberOfFiles?: number;
  ymlFileContent?: string;
  activeWebhooks?: number;
}
