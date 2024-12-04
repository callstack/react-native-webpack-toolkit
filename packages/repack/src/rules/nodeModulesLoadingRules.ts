import type { RuleSetRule } from '@rspack/core';
import { getModulePaths } from '../utils';

/**
 * @constant NODE_MODULES_LOADING_RULES
 * @type {RuleSetRule}
 * @description Module rule configuration for loading node_modules, excluding React Native Core & out-of-tree platform packages.
 */
export const NODE_MODULES_LOADING_RULES: RuleSetRule = {
  type: 'javascript/auto',
  test: /\.[cm]?[jt]sx?$/,
  include: [/node_modules/],
  exclude: getModulePaths([
    'react',
    'react-native',
    '@react-native',
    'react-native-macos',
    'react-native-windows',
    'react-native-tvos',
    '@callstack/react-native-visionos',
  ]),
  oneOf: [
    {
      test: /jsx?$/,
      use: [
        {
          loader: 'builtin:swc-loader',
          options: {
            env: {
              targets: { 'react-native': '0.74' },
            },
            jsc: {
              externalHelpers: true,
              loose: true,
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
            module: {
              type: 'commonjs',
              strict: false,
              strictMode: false,
            },
          },
        },
      ],
    },
    {
      test: /ts$/,
      use: [
        {
          loader: 'builtin:swc-loader',
          options: {
            env: {
              targets: { 'react-native': '0.74' },
            },
            jsc: {
              externalHelpers: true,
              loose: true,
              parser: {
                syntax: 'typescript',
                tsx: false,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
            module: {
              type: 'commonjs',
              strict: false,
              strictMode: false,
            },
          },
        },
      ],
    },
    {
      test: /tsx$/,
      use: [
        {
          loader: 'builtin:swc-loader',
          options: {
            env: {
              targets: { 'react-native': '0.74' },
            },
            jsc: {
              externalHelpers: true,
              loose: true,
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
            module: {
              type: 'commonjs',
              strict: false,
              strictMode: false,
            },
          },
        },
      ],
    },
  ],
};
