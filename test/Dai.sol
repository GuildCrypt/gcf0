pragma solidity ^0.4.25;

import "ERC20.sol";
import "math/SafeMath.sol";

contract Dai is ERC20 {
  constructor(uint256 _totalSupply) public {
    _mint(msg.sender, _totalSupply);
  }
}
