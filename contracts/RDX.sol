// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20.sol";

// token only mint once time for creator
contract RDX is ERC20 {
    uint256 private constant DEFAULT_MINT_AMOUNT = 10**8;

    constructor() ERC20("RDX", "RDX") {
        _mint(msg.sender, 10**12 * 10**decimals());
    }
}
