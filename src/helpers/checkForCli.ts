import getCLIName from './getCliName';
import * as toolCache from '@actions/tool-cache';
import * as core from '@actions/core';

export default function checkForCLI() {
  const toolName = getCLIName();
  const versions = toolCache.findAllVersions(toolName);
  if (versions.length < 1) {
    // TODO: clean up this message
    core.info(`
      We were unable to find the hx command line tool. Please
      ensure that the tool is installed on the runner. You
      can used the "Hyphen/setup-hx-action" action to install
      the hx CLI prior to running this action. For more details
      please see: https://github.com/marketplace/actions/setup-the-hyphen-cli
    `);
    throw new Error('hx command line not found');
  }

  core.debug(`hx CLI versions found: ${versions.join(', ')}`);
}
