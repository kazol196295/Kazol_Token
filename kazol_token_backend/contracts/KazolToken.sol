// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract KazolToken is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;
    constructor(
        uint256 cap,
        uint256 reward
    ) ERC20("KazolToken", "KAZ") ERC20Capped(cap * (10 ** decimals())) {
        owner = payable(msg.sender);

        _mint(owner, 70000000 * (10 ** decimals())); // Mint 70 million tokens
        blockReward = reward * (10 ** decimals()); // Set block reward
    }

    function setblockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped) {
        if (
            from != address(0) &&
            to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            _mintMinerReward();
        }
        super._update(from, to, value);
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}
