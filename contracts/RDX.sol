// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20.sol";

// token only mint once time for creator
contract RDX is ERC20 {
    constructor(uint256 initialSupply) ERC20("RDX", "RDX") {
        _mint(msg.sender, initialSupply);
    }
}
