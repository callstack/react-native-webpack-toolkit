import type { LoaderContext } from '@rspack/core';
import { cssToReactNativeRuntime } from 'react-native-css-interop/css-to-rn';

interface NativeWindLoaderOptions {
  babelPlugins?: string[];
  input: string;
}

function stringify(data: unknown): string {
  switch (typeof data) {
    case 'bigint':
    case 'symbol':
    case 'function':
      throw new Error(`Cannot stringify ${typeof data}`);
    case 'string':
      return `"${data}"`;
    case 'number':
      // Reduce to 3 decimal places
      return `${Math.round(data * 1000) / 1000}`;
    case 'boolean':
      return `${data}`;
    case 'undefined':
      // null is processed faster than undefined
      // JSON.stringify also converts undefined to null
      return 'null';
    case 'object': {
      if (data === null) {
        return 'null';
      }
      if (Array.isArray(data)) {
        return `[${data
          .map((value) => {
            // These values can be omitted to create a holey array
            // This is slightly slower to parse at runtime, but keeps the
            // file size smaller
            return value === null || value === undefined
              ? ''
              : stringify(value);
          })
          .join(',')}]`;
      }
      return `{${Object.entries(data)
        .flatMap(([key, value]) => {
          // If an object's property is undefined or null we can just skip it
          if (value === null || value === undefined) {
            return [];
          }

          // Make sure we quote strings that require quotes
          if (key.match(/[^a-zA-Z]/)) {
            key = `"${key}"`;
          }

          value = stringify(value);

          return [`${key}:${value}`];
        })
        .join(',')}}`;
    }
  }
}

function getNativeJS(data = {}): string {
  const output = `(${stringify(data)})`;
  return output;
}

export const raw = false;

export default function nativeWindLoader(
  this: LoaderContext<NativeWindLoaderOptions>,
  source: string
) {
  this.cacheable();
  const callback = this.async();

  try {
    const css = getNativeJS(cssToReactNativeRuntime(source));
    const code = `import { StyleSheet } from "nativewind"\nStyleSheet.registerCompiled(${css})`;
    callback(null, code);
  } catch (error) {
    console.log('nw error', error);
    callback(error as Error);
  }
}
