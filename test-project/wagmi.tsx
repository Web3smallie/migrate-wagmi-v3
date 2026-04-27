import { useConnection, useConnectionEffect, useSwitchConnection } from "wagmi";
/* TODO (AI): wagmi v3 moved connectors to peer dependencies. 
   Install the specific connector packages you need separately.
   See: https://wagmi.sh/react/guides/migrate-from-v2-to-v3 */
import { injected } from "@wagmi/connectors";

export function WalletStatus() {
  const { address, status } = useConnection();

  useConnectionEffect({
    onConnect(data) {
      console.log("Connected!", data);
    },
    onDisconnect() {
      console.log("Disconnected!");
    },
  });

  const { switchAccount } = useSwitchConnection();

  return (
    <div>
      <p>Address: {address}</p>
      <p>Status: {status}</p>
      <button onClick={() => switchAccount({ connector: injected() })}>
        Switch Account
      </button>
    </div>
  );
}