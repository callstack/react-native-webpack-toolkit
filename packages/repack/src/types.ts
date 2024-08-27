import rspack from '@rspack/core';

export type Rule = string | RegExp;

export type InfrastructureLogger = ReturnType<
  rspack.Compiler['getInfrastructureLogger']
>;

type StatsPreset = Exclude<rspack.StatsValue, Record<any, any> | boolean>;
/**
 * CLI arguments passed from React Native CLI when running bundle command.
 *
 * @internal
 */
export interface BundleArguments {
  entryFile: string;
  platform: string;
  dev: boolean;
  minify?: boolean;
  bundleOutput?: string;
  sourcemapOutput?: string;
  assetsDest?: string;
  json?: string;
  stats?: StatsPreset;
  verbose?: boolean;
  watch?: boolean;
  webpackConfig?: string;
}

/**
 * CLI arguments passed from React Native CLI when running start command.
 *
 * @internal
 */
export interface StartArguments {
  port?: number;
  host: string;
  https?: boolean;
  key?: string;
  cert?: string;
  interactive?: boolean;
  experimentalDebugger?: boolean;
  json?: boolean;
  logFile?: string;
  reversePort?: boolean;
  silent?: boolean;
  verbose?: boolean;
  webpackConfig?: string;
}

interface CommonCliOptions {
  config: {
    root: string;
    reactNativePath: string;
    webpackConfigPath: string;
  };
}

export interface WebpackWorkerOptions {
  cliOptions: CliOptions;
  platform: string;
}

export interface StartCliOptions extends CommonCliOptions {
  command: 'start';
  arguments: {
    start: Omit<StartArguments, 'platforms'> & { platforms: string[] };
  };
}

export interface BundleCliOptions extends CommonCliOptions {
  command: 'bundle';
  arguments: { bundle: BundleArguments };
}

export type CliOptions = StartCliOptions | BundleCliOptions;

/**
 * Development server configuration options.
 */
export interface DevServerOptions {
  /**
   * Hostname or IP address under which to run the development server.
   *
   * See: {@link DEFAULT_HOSTNAME}.
   */
  host?: string;

  /**
   * Port under which to run the development server.
   *
   * See: {@link DEFAULT_PORT}.
   */
  port: number;

  /**
   * HTTPS options.
   * If specified, the server will use HTTPS, otherwise HTTP.
   */
  https?: {
    /** Path to certificate when running server on HTTPS. */
    cert?: string;

    /** Path to certificate key when running server on HTTPS. */
    key?: string;
  };

  /** Whether to enable Hot Module Replacement. */
  hmr?: boolean;
}

/**
 * Represents all relevant options that are passed to Webpack config function,
 * needed to create a valid Webpack configuration and configure all plugins.
 *
 * This is the return type of {@link parseCliOptions}.
 */
export interface EnvOptions {
  /** Compilation mode. */
  mode?: 'production' | 'development';

  /** Target application platform. */
  platform?: string;

  /** Context in which all resolution happens. Usually it's project root directory. */
  context?: string;

  /** Input filename - entry point of the bundle. */
  entry?: string;

  /** Bundle output filename - name under which generated bundle will be saved. */
  bundleFilename?: string;

  /**
   * Source map filename - name under which generated source map (for the main bundle) will be saved.
   */
  sourceMapFilename?: string;

  /** Assets output path - directory where generated static assets will be saved. */
  assetsPath?: string;

  /** Whether to minimize the final bundle. */
  minimize?: boolean;

  /** Path to React Native dependency. Usually points to `node_modules/react-native`. */
  reactNativePath?: string;

  /**
   * Development server configuration options.
   * Used to configure `@callstack/repack-dev-server`.
   *
   * If `undefined`, then development server should not be run.
   */
  devServer?: DevServerOptions;
}

/**
 * Represent Hot Module Replacement Update body.
 *
 * @internal
 */
export interface HMRMessageBody {
  name: string;
  time: number;
  hash: string;
  warnings: rspack.StatsCompilation['warnings'];
  errors: rspack.StatsCompilation['errors'];
}

/**
 * Represent Hot Module Replacement Update message.
 *
 * @internal
 */
export interface HMRMessage {
  action: 'building' | 'built' | 'sync';
  body: HMRMessageBody | null;
}
