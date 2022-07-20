//SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;

import "poh-tron-contracts/contracts/HumanOnly.sol";

contract Counter is HumanOnly {
    uint256 public counter;

    event Increment(uint256 currentCounter);

    constructor() {
      setHumanityValidator(0x9790789d05e59D4F864F0Dc6Eef658744F8d2B30);
    }

    function increment(bytes calldata proof) public basicPoH(proof) {
        counter++;

        if (counter > 99) {
          counter = 1;
        }

        emit Increment(counter);
    }
}
