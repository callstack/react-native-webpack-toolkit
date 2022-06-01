import { Worker } from 'worker_threads';
import path from 'path';
import { CompilerOptions } from '@callstack/repack-dev-server';
import type { CliOptions, StartArguments } from '../types';

export function getWebpackDevServerAdapter(
  cliOptions: CliOptions
): CompilerOptions {
  const workers: Record<string, Worker> = {};
  const cache: Record<string, Record<string, string | Buffer>> = {};
  const listeners: Record<string, Array<(error?: Error) => void>> = {};

  function spawnWorker(platform: string) {
    const worker = new Worker(path.join(__dirname, './webpackWorker.js'), {
      workerData: {
        ...cliOptions,
        arguments: {
          start: {
            ...(cliOptions.arguments as { start: StartArguments }).start,
            platform,
          },
        },
      },
    });

    function notifyListeners(error?: Error) {
      listeners[platform].forEach((listener) => listener(error));
      listeners[platform] = [];
    }

    worker.on('message', (value) => {
      // set cache
      console.log(value);
      notifyListeners();
    });

    worker.on('error', (error) => {
      notifyListeners(error);
    });

    worker.on('exit', (code) => {
      notifyListeners(new Error(`Worker stopped with exit code ${code}`));
    });

    return worker;
  }

  async function getAsset(
    filename: string,
    platform: string
    // sendProgress?: SendProgress
  ): Promise<string | Buffer> {
    // Spawn new worker if not already running
    if (!workers[platform]) {
      workers[platform] = spawnWorker(platform);
    }

    // Return file from cache if exists
    const fileFromCache = cache[platform]?.[filename];
    if (fileFromCache) {
      return fileFromCache;
    }

    return new Promise<string | Buffer>((resolve, reject) => {
      // Add new listener to be executed when compilation is finished
      listeners[platform] = (listeners[platform] ?? []).concat(
        (error?: Error) => {
          if (error) {
            reject(error);
          } else {
            const fileFromCache = cache[platform]?.[filename];
            if (fileFromCache) {
              resolve(fileFromCache);
            } else {
              reject(new Error('File not found'));
            }
          }
        }
      );
    });
  }

  return {
    getAsset,
  };
}
