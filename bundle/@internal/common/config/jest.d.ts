import { type JestConfigWithTsJest } from 'ts-jest';

export declare const createJestConfig: (
  options?: JestConfigWithTsJest & {
    tsconfigPath?: string;
  },
) => JestConfigWithTsJest;
export default createJestConfig;
