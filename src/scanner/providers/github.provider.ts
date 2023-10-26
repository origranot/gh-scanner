import { Injectable } from '@nestjs/common';
import { Provider } from './provider';
import { Octokit } from '@octokit/core';
import { IRepository } from '../../shared/interfaces';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class GithubProvider extends Provider<Octokit> {
  constructor(private readonly config: AppConfigService) {
    super('GITHUB');

    this.authenticate();
  }

  authenticate(): void {
    const octokit = new Octokit({ auth: this.config.getConfig().githubToken });
    this._client = octokit;
  }

  async getRepositoriesByUsername(username: string): Promise<Partial<IRepository>[]> {
    const rawRepositories = await this.getRawRepositoriesByUsername(username);
    const repositories: IRepository[] = rawRepositories.map((rawRepository) => {
      return {
        id: rawRepository.id,
        name: rawRepository.name,
        size: rawRepository.size,
        private: rawRepository.private,
        ownerName: rawRepository.owner.login,
      };
    });

    return repositories;
  }

  async getRepositoryByName(name: string): Promise<IRepository> {
    const options = {
      owner: this.config.getConfig().usernameToScan,
      repo: name,
    };

    const [{ data: details }, activeWebhooks, fileContent, numberOfFiles] = await Promise.all([
      // Could also use the cache to retrive the details about a specficic repository (Wanted to keep it simple)
      this._client.request('GET /repos/{owner}/{repo}', options),

      this.getActiveWebhooks(options.owner, options.repo),
      this.getFileContent(options.owner, options.repo, this.config.getConfig().filePath),
      this.getNumberOfFiles(options.owner, options.repo),
    ]);

    return {
      id: details.id,
      name: details.name,
      size: details.size,
      private: details.private,
      ownerName: details.owner.login,
      numberOfFiles,
      ymlFileContent: fileContent ? Buffer.from((fileContent as any).content, 'base64').toString('utf-8') : null,
      activeWebhooks: activeWebhooks.length,
    };
  }

  private async getRawRepositoriesByUsername(username: string) {
    const response = await this._client.request('GET /users/{username}/repos', {
      username: username,
    });

    return response.data;
  }

  private async getActiveWebhooks(owner: string, repo: string) {
    try {
      const response = await this._client.request('GET /repos/{owner}/{repo}/hooks', {
        owner,
        repo,
      });

      return response.data.filter((hook) => hook.active);
    } catch (err) {
      return [];
    }
  }

  private async getNumberOfFiles(owner: string, repo: string): Promise<number> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
    const data = await response.json();

    return data?.tree?.length || null;
  }

  private async getFileContent(owner: string, repo: string, path: string) {
    try {
      const response = await this._client.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
      });

      return response.data;
    } catch (err) {
      return null;
    }
  }
}
