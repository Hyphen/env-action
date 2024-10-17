import { exec } from '@actions/exec';

export default async function pullForEnvironment(
  environment: string,
  workspace: string
) {
  const code = await exec(`hx env pull ${environment}`, undefined, {
    cwd: workspace
  });

  if (code !== 0) {
    throw new Error(`hx env pull ${environment} failed with code: ${code}`);
  }
}
