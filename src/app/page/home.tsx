"use client";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { config } from "../providers";
import { getTransactionReceipt, writeContract } from '@wagmi/core'
import { useEffect, useState } from "react";
import { CONTRACT_ABI } from "../config/abis";
import { useStakedBalance } from "../hook/useStakedBalance";
import { useStake } from "../hook/useStake";
import { formatAddress } from "../utils/string";


export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const {data: currentKaiStake, refetch} = useStakedBalance()
  const {mutateAsync: stake} = useStake()

  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [unstakeRequested, setUnstakeRequested] = useState(false);
  const [unstakeTime, setUnstakeTime] = useState<number | null>(null);
  
  const stakeKai = async () => {
    console.log('stakeAmount: ', stakeAmount);

    if (stakeAmount <= 0) {
      alert("Please enter a valid amount to stake.");
      return;
    }
    try {
      await stake(stakeAmount.toString())
      await refetch()
    } catch (error) {
      console.error("Error staking KAI: ", error);
    }
  };

  const unStakeKai = async () => {
    const txHash: any = await writeContract(config, {
      abi: CONTRACT_ABI,
      address: `0xc04AA462b6fCC1e1cf6DB8bfAAa89fa13C63201E`,
      functionName: "requestWithdrawal",
      
    });
    setUnstakeRequested(true);
    setUnstakeTime(Date.now() + 7 * 24 * 60 * 60 * 1000); // Thêm 7 ngày tính từ thời điểm hiện tại
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getTransactionReceipt(config, {
      hash: txHash,
    });
  };

  useEffect(() => {
    if (unstakeTime) {
      const timer = setInterval(() => {
        const timeLeft = Math.max(unstakeTime - Date.now(), 0);
        if (timeLeft <= 0) {
          clearInterval(timer);
          setUnstakeRequested(false);
          setUnstakeTime(null);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [unstakeTime]);

  return (
    <div className="h-full flex flex-col py-2">
      {/* <Navbar address={address || ""} onDisconnect={() => disconnect()} /> */}
      {!isConnected ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <div className="grid gap-4">
            <Image
              src="https://images.ctfassets.net/9sy2a0egs6zh/4zJfzJbG3kTDSk5Wo4RJI1/1b363263141cf629b28155e2625b56c9/mm-logo.svg"
              alt="MetaMask"
              width={320}
              height={140}
              priority
            />
            <ConnectButton />
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-lg font-bold mb-4">
          Connected Wallet: {formatAddress(address || "")}
        </p>
        <p className="mb-4">Current Staked KAI:{currentKaiStake}</p>
        <div className="grid gap-4">
          <input
            type="number"
            min="0"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            placeholder="Enter KAI to stake"
            className="p-2 border border-gray-300 rounded-lg w-64"
          />
          <button
            onClick={stakeKai}
            className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600"
          >
            Stake KAI
          </button>
          {unstakeRequested ? (
            <p className="text-yellow-500">
              Withdrawal requested. Please wait {Math.ceil((unstakeTime! - Date.now()) / (1000 * 60 * 60 * 24))} days to withdraw your KAI.
            </p>
          ) : (
            <button
              onClick={unStakeKai}
              className="bg-blue-500 text-white p-4 rounded-lg"
            >
              Request Withdrawal
            </button>
          )}
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white p-4 rounded-lg"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    )}
    </div>
  );
}