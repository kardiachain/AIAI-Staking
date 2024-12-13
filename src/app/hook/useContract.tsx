import { readContract } from '@wagmi/core'
import { config } from '../providers';
import { CONTRACT_ABI } from '../config/abis';

export default function useContract(address: string) {
  const getCurrentKaiStake = async () => {
    const result: any = await readContract(config, {
      address: process.env.NEXT_PUBLIC_SMC_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getStake",
      args: [address],
    });
    return result;
  };

  return {
    getCurrentKaiStake,
  };
}