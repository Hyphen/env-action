import * as core from '@actions/core';
import * as io from '@actions/io';
import path from 'path';
import getCloneLocation from './getCloneLocation';

export function _getTempDirectory(): string {
  const tempDirectory = process.env['RUNNER_TEMP'] || '';
  return tempDirectory;
}

export default async function getWorkspacePath(
  writeFiles: boolean
): Promise<string> {
  const workspace = writeFiles
    ? getCloneLocation()
    : core.toPlatformPath(path.join(_getTempDirectory(), 'hyphen-temp'));
  if (!writeFiles) {
    await io.mkdirP(workspace);
  }
  core.isDebug() &&
    core.debug(`using the following workspace path: ${workspace}`);
  return workspace;
}
