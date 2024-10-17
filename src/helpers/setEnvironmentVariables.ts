import * as core from '@actions/core';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import path from 'path';

export default async function setEnvironmentVariables(
  workspace: string,
  environment: string,
  variablePrefix: string
): Promise<void> {
  const defaultEnvFile = await fs.readFile(
    path.join(workspace, '.env'),
    'utf8'
  );
  const defaultEnv = dotenv.parse(defaultEnvFile);
  const developmentEnvFile = await fs.readFile(
    path.join(workspace, `.env.${environment}`),
    'utf8'
  );
  const developmentEnv = dotenv.parse(developmentEnvFile);

  const envs = Object.assign({}, defaultEnv, developmentEnv);

  for (const key in envs) {
    core.exportVariable(`${variablePrefix}${key}`, envs[key]);
    core.setSecret(envs[key]);
    core.debug(`exported ${variablePrefix}${key}`);
  }
}
