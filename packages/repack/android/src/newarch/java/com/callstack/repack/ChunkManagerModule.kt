package com.callstack.repack

import android.os.Handler
import com.facebook.react.bridge.*

class ScriptManagerModule(reactContext: ReactApplicationContext) : NativeScriptManagerSpec(reactContext) {
    private val remoteLoader: RemoteScriptLoader = RemoteScriptLoader(reactApplicationContext)
    private val fileSystemLoader: FileSystemScriptLoader = FileSystemScriptLoader(reactApplicationContext)

    private var implementation: ScriptManagerModuleImpl = ScriptManagerModuleImpl()

    override fun getName(): String = ScriptManagerModuleImpl.NAME

    override fun loadScript(scriptId: String, configMap: ReadableMap, promise: Promise) {
        implementation.loadScript(scriptId, configMap, promise, remoteLoader, fileSystemLoader)
    }

    override fun prefetchScript(scriptId: String, configMap: ReadableMap, promise: Promise) {
        implementation.prefetchScript(scriptId, configMap, promise, remoteLoader)
    }

    override fun invalidateScripts(scriptIds: ReadableArray, promise: Promise) {
        implementation.invalidateScripts(scriptIds, promise, remoteLoader)
    }
}