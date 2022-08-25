// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// token can mint any time
contract Ketchup is ERC20{
    constructor(uint256 initialSupply) ERC20("Ketchup", "KCP") {}

    function mintToken(address to, uint256 _quantity) public {
        _mint(to, _quantity * 10**18);
    }

}