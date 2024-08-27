import rspack, { RspackPluginInstance } from '@rspack/core';
import {
  REACT_NATIVE_CODEGEN_RULES,
  REACT_NATIVE_LOADING_RULES,
  NODE_MODULES_LOADING_RULES,
} from '../../rules';

/**
 * {@link DefaultRulesPlugin} configuration options.
 */
export interface DefaultRulesPluginConfig {
  /** Target application platform. */
  platform: string;
}

/**
 * @category Webpack Plugin
 */
export class DefaultRulesPlugin implements RspackPluginInstance {
  constructor(private config: DefaultRulesPluginConfig) {}

  apply(compiler: rspack.Compiler) {
    const mode = compiler.options.mode;
    const devServer = compiler.options.devServer;

    compiler.options.module.defaultRules = [
      '...',
      REACT_NATIVE_LOADING_RULES,
      NODE_MODULES_LOADING_RULES,
      /** Here you can adjust loader that will process your files. */
      {
        test: /\.[jt]sx?$/,
        exclude: [/node_modules/],
        type: 'javascript/auto',
        use: {
          loader: 'builtin:swc-loader',
          /** @type {import('@rspack/core').SwcLoaderOptions} */
          options: {
            env: {
              targets: {
                'react-native': '0.74',
              },
            },
            jsc: {
              externalHelpers: true,
              transform: {
                react: {
                  runtime: 'automatic',
                  development: mode === 'development',
                  refresh: mode === 'development' && Boolean(devServer),
                },
              },
            },
          },
        },
      },
      // codegen needs to run before
      REACT_NATIVE_CODEGEN_RULES,
    ];
  }
}