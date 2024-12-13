"use client";
import "@rainbow-me/rainbowkit/styles.css";
import * as React from "react";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {  QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Chain } from "viem";
import { WagmiProvider } from "wagmi";


const { wallets } = getDefaultWallets();

const Kai = {
  id: 24, // Replace with actual KardiaChain ID if known
  name: "KardiaChain Mainnet",
  nativeCurrency: { name: "KardiaChain Mainnet", symbol: "KAI", decimals: 24 },
  rpcUrls: {
    default: { http: ["https://rpc.kardiachain.io"] },
  },
  blockExplorers: {
    default: {
      name: "KardiaChain Mainnet",
      url: "https://www.kardiachain.io",
    },
  },
  // Add any relevant contracts if needed (e.g., multicall address)
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "Kai Stack",
  projectId: "2cd0b8d904917c041a981b55d398edb8",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [Kai],
  ssr: true,
});

const queryClient = new QueryClient();



function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
            modalSize={"compact"}
          theme={lightTheme({
            accentColor: "#FFFFFF",
            accentColorForeground: "#CC3833",
          })}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
