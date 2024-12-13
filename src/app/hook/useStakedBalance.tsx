import { useQuery } from "@tanstack/react-query"
import { useWallet } from "./useWallet"
import { readContract } from "@wagmi/core"
import { config } from "../providers"
import { STAKING_CONTRACT } from "../config/constant"
import { formatEther } from "viem";
import { CONTRACT_ABI } from "../config/abis";

export const useStakedBalance = () => {
  const {address} = useWallet()

  const {data, isFetching, refetch} = useQuery({
    queryKey: ['current-staked', address],
    queryFn: async () => {
      const result: any = await readContract(config, {
        address: STAKING_CONTRACT,
        abi: CONTRACT_ABI,
        functionName: "getStake",
        args: [address as `0x${string}`],
      });
      console.log('result: ', result[0]);
      return formatEther(result[0])
    },
    initialData: "0"
  })
  
  return {
    data, isFetching, refetch
  }
}