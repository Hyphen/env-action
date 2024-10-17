import * as core from '@actions/core';

export default function getCloneLocation(): string {
  return core.getInput('path') != ''
    ? core.getInput('path')
    : (process.env['GITHUB_WORKSPACE'] ?? process.cwd());
}
