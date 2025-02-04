import * as core from '@actions/core';
import { validOutputTypes } from '../constants';

export default function getAndValidateInputs(): {
  hxKeyFile: string;
  writeFiles: boolean;
  writeVariables: boolean;
  environment: string;
  variablePrefix: string;
} {
  const hxKeyFile = core.getInput('hxKeyFile', { required: true });
  const environment = core.getInput('environment', { required: true });
  const variablePrefix = core.getInput('variablePrefix') || '';
  const outputs = core.getMultilineInput('outputs') || ['files'];

  const parsedOutputs = outputs.reduce(
    (acc, output) => {
      if (validOutputTypes.includes(output)) {
        acc.valid.push(output);
      } else {
        acc.invalid.push(output);
      }
      return acc;
    },
    { valid: [] as string[], invalid: [] as string[] }
  );

  // TODO: consider throwing and error instead?
  if (parsedOutputs.invalid.length > 0) {
    core.warning(
      `Invalid outputs found these will : ${parsedOutputs.invalid.join(', ')}`
    );
  }

  if (parsedOutputs.valid.length === 0) {
    throw new Error('No valid outputs found');
  }

  return {
    hxKeyFile,
    environment,
    writeFiles: parsedOutputs.valid.includes('files'),
    writeVariables: parsedOutputs.valid.includes('variables'),
    variablePrefix
  };
}
