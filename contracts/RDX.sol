// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// token only mint once time for creator
contract RDX is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("RDX", "RDX") {
        _mint(msg.sender, initialSupply * 10**18);
    }
}
