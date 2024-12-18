import type { FederationRuntimePlugin } from '@module-federation/enhanced/runtime';
import type * as RepackClient from '../ScriptManager/index.ts';

const RepackCorePlugin: () => FederationRuntimePlugin = () => ({
  name: 'repack-core-plugin',
  loadEntry: async ({ remoteInfo }) => {
    const client = require('../ScriptManager.ts') as typeof RepackClient;
    const { ScriptManager, getWebpackContext } = client;
    const { entry, entryGlobalName } = remoteInfo;

    try {
      await ScriptManager.shared.loadScript(
        entryGlobalName,
        undefined,
        getWebpackContext(),
        entry
      );

      // @ts-ignore
      if (!globalThis[entryGlobalName]) {
        throw new Error();
      }

      // @ts-ignore
      return globalThis[entryGlobalName];
    } catch {
      console.error(`Failed to load remote entry: ${entryGlobalName}`);
    }
  },
});

export default RepackCorePlugin;
