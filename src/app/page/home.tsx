"use client";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { config } from "../providers";
import { getTransactionReceipt, readContract, writeContract } from '@wagmi/core'
import { useEffect, useState } from "react";




export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [currentKaiStake, setCurrentKaiStake] = useState<number>(0);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [unstakeRequested, setUnstakeRequested] = useState(false);
  const [unstakeTime, setUnstakeTime] = useState<number | null>(null);

  const formatAddress = (address: string): string =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getCurrentKaiStake = async () => {
    const result: any = await readContract(config, {
      address: `0xc04AA462b6fCC1e1cf6DB8bfAAa89fa13C63201E`,
      abi: CONTRACT_ABI,
      functionName: "getStake",
      args: [address as `0x${string}`],
    });
    console.log('result: ', result[0]);
    const formattedStake = Number(result[0]) / 1e18;
    return setCurrentKaiStake(formattedStake);
  };
  const stakeKai = async () => {
    console.log('stakeAmount: ', stakeAmount);

    if (stakeAmount <= 0) {
      alert("Please enter a valid amount to stake.");
      return;
    }
    try {
      const result: any = await writeContract(config,{
        address: `0xc04AA462b6fCC1e1cf6DB8bfAAa89fa13C63201E`,
        abi: CONTRACT_ABI,
        functionName: "stake",
        value: BigInt(stakeAmount * 1e18), // Chuyển số KAI sang wei (1 KAI = 10^18 wei)
        args: [],
        
      });
      console.log("Stake result: ", result);
      await getCurrentKaiStake(); // Cập nhật số dư stake sau khi thực hiện
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
    if(address) {
      getCurrentKaiStake();
    }
    console.log(currentKaiStake,"current")
  }, [address]);

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
        <p className="mb-4">Current Staked KAI:{currentKaiStake ? currentKaiStake.toFixed(4) : "0"}</p>
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