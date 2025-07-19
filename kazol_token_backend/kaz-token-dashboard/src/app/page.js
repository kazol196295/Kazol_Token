'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import kazolToken from '../app/kazolToken.json';

const tokenABI = kazolToken.abi;
const tokenAddress = '0x93a0E81E52C06CF35D11d8098482c7141AC23b15';

export default function Home() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [spender, setSpender] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [allowance, setAllowance] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [symbol, setSymbol] = useState('KAZ');

  let signer, tokenContract;

  const init = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    setAccount(accounts[0]);

    tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const bal = await tokenContract.balanceOf(accounts[0]);
    const decimals = await tokenContract.decimals();
    const sym = await tokenContract.symbol();
    setSymbol(sym);
    setBalance(ethers.formatUnits(bal, decimals));
  };

  const handleTransfer = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, tokenABI, signer);
      const decimals = await token.decimals();
      const tx = await token.transfer(recipient, ethers.parseUnits(amount, decimals));
      await tx.wait();
      alert('Transfer successful!');
      init();
    } catch (err) {
      alert(`Transfer failed: ${err.message}`);
    }
  };

  const handleApprove = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, tokenABI, signer);
      const decimals = await token.decimals();
      const tx = await token.approve(spender, ethers.parseUnits(approveAmount, decimals));
      await tx.wait();
      alert('Approval successful!');
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleCheckAllowance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, tokenABI, signer);
      const decimals = await token.decimals();
      const allowanceRaw = await token.allowance(account, spender);
      setAllowance(ethers.formatUnits(allowanceRaw, decimals));
    } catch (err) {
      alert(`Allowance check failed: ${err.message}`);
    }
  };

  const handleTransferFrom = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, tokenABI, signer);
      const decimals = await token.decimals();
      const tx = await token.transferFrom(fromAddress, toAddress, ethers.parseUnits(amount, decimals));
      await tx.wait();
      alert('Transfer From successful!');
      init();
    } catch (err) {
      alert(`Transfer From failed: ${err.message}`);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <main className="p-8 max-w-2xl mx-auto font-sans text-white bg-[#FFBC4C] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">KAZ Token Dashboard</h1>
      <p><strong>Account:</strong> {account}</p>
      <p><strong>Balance:</strong> {balance} {symbol}</p>

      <div className="mt-6 space-y-4">
        {/* Transfer Form */}
        <div className="bg-[#FEFFC4] p-4 rounded">
          <h2 className="font-semibold mb-1 text-black">Transfer Tokens</h2>
          <input
            placeholder="Recipient address"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            className="bg-[#FEFFC4] text-black p-2 mr-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-[#FEFFC4] text-black p-2 mr-2 border border-gray-300 rounded"
          />
          <button onClick={handleTransfer} className="bg-[#799EFF] text-white px-4 py-2 rounded">
            Send
          </button>
        </div>

        {/* Approve Form */}
        <div className="bg-[#FEFFC4] p-4 rounded">
          <h2 className="font-semibold mb-1 text-black">Approve Spender</h2>
          <input
            placeholder="Spender address"
            value={spender}
            onChange={e => setSpender(e.target.value)}
            className="bg-[#FEFFC4] text-black p-2 mr-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Amount"
            value={approveAmount}
            onChange={e => setApproveAmount(e.target.value)}
            className="bg-[#FEFFC4] text-black p-2 mr-2 border border-gray-300 rounded"
          />
          <button onClick={handleApprove} className="bg-[#799EFF] text-white px-4 py-2 rounded">
            Approve
          </button>
        </div>

        {/* Transfer From Form */}
        <div className="bg-[#FEFFC4] p-4 rounded">
          <h2 className="font-semibold mb-1 text-black">Transfer From</h2>
          <input
            placeholder="From address"
            value={fromAddress}
            onChange={e => setFromAddress(e.target.value)}
            className="bg-[#FEFFC4] text-black p-2 mr-2 border border-gray-300 rounded"
          />
          <input
            placeholder="To address"
            value={toAddress}
            onChange={e => setToAddress(e.target.value)}
            className="bg-[#FEFFC4] text-black p-2 mr-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-[#FEFFC4] text-black p-2 mr-2 border border-gray-300 rounded"
          />
          <button onClick={handleTransferFrom} className="bg-[#799EFF] text-white px-4 py-2 rounded">
            Transfer From
          </button>
        </div>

        {/* Allowance Check */}
        <div className="bg-[#FEFFC4] p-4 rounded">
          <h2 className="font-semibold mb-1 text-black">Check Allowance</h2>
          <button onClick={handleCheckAllowance} className="bg-[#799EFF] text-white px-4 py-2 rounded">
            Check
          </button>
          <p className="text-black mt-2">Allowance: {allowance} {symbol}</p>
        </div>

        {/* Uniswap Link — */}
        <div className="mt-4">
          <a
            href={`https://app.app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=sepolia`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#799EFF] underline"
          >
            🔄 Swap KAZ on Uniswap
          </a>
        </div>
      </div>
    </main>
  );
}