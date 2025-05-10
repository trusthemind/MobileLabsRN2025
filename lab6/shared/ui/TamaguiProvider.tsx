import { TamaguiProvider as TamaguiProviderOG } from "tamagui";
import config from "@/tamagui.config";

export function Provider({ children }: { children: React.ReactNode }) {
  return <TamaguiProviderOG config={config}>{children}</TamaguiProviderOG>;
}

export default Provider;
