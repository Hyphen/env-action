import path from 'path';
import fs from 'fs/promises';
import * as io from '@actions/io';
import getCloneLocation from './getCloneLocation';

export default async function setupMetaDataFiles(
  workspace: string,
  hxKeyFile: string,
  writeFiles: boolean
): Promise<void> {
  if (!writeFiles) {
    await io.cp(path.join(getCloneLocation(), '.hx'), workspace);
  }

  const hxKeyFilePath = path.join(workspace, '.hxkey');
  await fs.writeFile(hxKeyFilePath, hxKeyFile, 'utf8');
}
