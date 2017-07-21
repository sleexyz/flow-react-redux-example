// @flow
import * as StorageService from "./storage_service";

export type Env = {
  storageService: StorageService.T
};

export const makeEnv = (): Env => {
  const env = {};
  env.storageService = StorageService.make(env);
  return env;
};
