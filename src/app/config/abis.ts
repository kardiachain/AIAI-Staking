const CONTRACT_ABI = [
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "WITHDRAWAL_DELAY",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "emerencyWithdraw",
      inputs: [{ type: "address", name: "staker", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        { type: "uint256", name: "", internalType: "uint256" },
        { type: "uint256", name: "", internalType: "uint256" },
        { type: "uint256", name: "", internalType: "uint256" },
      ],
      name: "getStake",
      inputs: [{ type: "address", name: "addr", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        { type: "address[]", name: "", internalType: "address[]" },
        { type: "uint256[]", name: "", internalType: "uint256[]" },
      ],
      name: "getStakers",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "owner",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "renounceOwnership",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "requestWithdrawal",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "payable",
      outputs: [],
      name: "stake",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "address", name: "", internalType: "address" }],
      name: "stakers",
      inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [
        { type: "uint256", name: "amount", internalType: "uint256" },
        { type: "uint256", name: "stakeTime", internalType: "uint256" },
        { type: "uint256", name: "withdrawRequestTime", internalType: "uint256" },
      ],
      name: "stakes",
      inputs: [{ type: "address", name: "", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "transferOwnership",
      inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "withdraw",
      inputs: [],
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        { type: "address", name: "previousOwner", indexed: true },
        { type: "address", name: "newOwner", indexed: true },
      ],
      anonymous: false,
    },
    { type: "receive" },
    { type: "fallback" },
  ];
  