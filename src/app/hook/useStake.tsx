import { useMutation } from "@tanstack/react-query"
import { useWallet } from "./useWallet"
import { CONTRACT_ABI } from "../config/abis"
import { config } from "../providers"
import { parseEther } from "viem"
import { writeContract } from "@wagmi/core"
import { STAKING_CONTRACT } from "../config/constant"

export const useStake = () => {
  const {address} = useWallet()

  const {mutate, mutateAsync, failureReason, status} = useMutation({
    mutationKey: ['stake-kai', address],
    mutationFn: async (amount: string) => {
      const result: any = await writeContract(config,{
        address: STAKING_CONTRACT,
        abi: CONTRACT_ABI,
        functionName: "stake",
        value: parseEther(amount), // Chuyển số KAI sang wei (1 KAI = 10^18 wei)
        args: [],
      });

      return result
    }
  })

  return {
    mutate, failureReason, status, mutateAsync
  }
}