import path from 'path';
import webpack from 'webpack';
import { WebpackPlugin } from '../../types';

const REPACK_BOOTSTRAP = `
/******** Re.Pack bootstrap *********************************************/
/******/
/******/  /* ensure self is defined */
/******/  var self = self || this || new Function("return this")() || ({});
/******/
/******/  /* ensure repack object is defined */
/******/  var __repack__ = self["__repack__"] = __repack__ || self["__repack__"] || {
/******/    loadChunk: function() { throw new Error("Missing implementation for __repack__.loadChunk"); },
/******/    execChunkCallback: [],
/******/  };
/******/
/******/  /* inject repack to callback for chunk loading */
/******/  !function() {
/******/    function repackLoadChunkCallback(parentPush, data) {
/******/      if (parentPush) parentPush(data);
/******/      var chunkIds = data[0];
/******/      var i = 0;
/******/      for(; i < chunkIds.length; i++) {
/******/        __repack__.execChunkCallback.push(chunkIds[i]);
/******/      }
/******/    }
/******/
/******/    var chunkLoadingGlobal = self["loadChunkCallback"] = self["loadChunkCallback"] || [];
/******/    chunkLoadingGlobal.push = repackLoadChunkCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/  }();
/******/
/************************************************************************/
`;

/**
 * Plugin for tweaking the JavaScript runtime code to account for React Native environment.
 *
 * Globally available APIs differ with React Native and other target's like Web, so there are some
 * tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.
 *
 * @category Webpack Plugin
 */
export class TargetPlugin implements WebpackPlugin {
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */
  apply(compiler: webpack.Compiler) {
    compiler.options.target = false;
    compiler.options.output.chunkLoading = 'jsonp';
    compiler.options.output.chunkFormat = 'array-push';
    compiler.options.output.globalObject = 'self';
    compiler.options.output.chunkLoadingGlobal = 'loadChunkCallback';

    new webpack.NormalModuleReplacementPlugin(
      /react-native([/\\]+)Libraries([/\\]+)Utilities([/\\]+)HMRClient\.js$/,
      function (resource) {
        const request = require.resolve('../../client/runtime/DevServerClient');
        const context = path.dirname(request);
        resource.request = request;
        resource.context = context;
        resource.createData.resource = request;
        resource.createData.context = context;
      }
    ).apply(compiler);

    // Overwrite `LoadScriptRuntimeModule.generate` to avoid shipping DOM specific
    // code in the bundle. `__webpack_require__.l` implementation is provided
    // in `../../../runtime/setupChunkLoader.ts`.
    webpack.runtime.LoadScriptRuntimeModule.prototype.generate = function () {
      return webpack.Template.asString([
        `${webpack.RuntimeGlobals.loadScript} = function() {`,
        webpack.Template.indent(
          'return __repack__.loadChunk.apply(this, arguments);'
        ),
        '};',
      ]);
    };

    const renderBootstrap =
      webpack.javascript.JavascriptModulesPlugin.prototype.renderBootstrap;
    webpack.javascript.JavascriptModulesPlugin.prototype.renderBootstrap =
      function (...args) {
        const result = renderBootstrap.call(this, ...args);
        result.afterStartup.push('');
        result.afterStartup.push('// Re.Pack after startup');
        result.afterStartup.push(
          `__repack__.execChunkCallback.push("${args[0].chunk.id}")`
        );
        return result;
      };

    compiler.hooks.environment.tap('TargetPlugin', () => {
      new webpack.BannerPlugin({
        raw: true,
        entryOnly: true,
        banner: REPACK_BOOTSTRAP,
      }).apply(compiler);
    });

    compiler.hooks.compilation.tap('TargetPlugin', (compilation) => {
      compilation.hooks.afterProcessAssets.tap('TargetPlugin', () => {
        for (const chunk of compilation.chunks) {
          const manifest = {
            id: chunk.id,
            name: chunk.name,
            files: [...chunk.files],
            auxiliaryFiles: [...chunk.auxiliaryFiles],
          };

          if (manifest.files.length) {
            const manifestFile = `${manifest.files[0]}.json`;
            chunk.auxiliaryFiles.add(manifestFile);
            compilation.emitAsset(
              manifestFile,
              new webpack.sources.RawSource(JSON.stringify(manifest))
            );
          }
        }
      });
    });
  }
}
