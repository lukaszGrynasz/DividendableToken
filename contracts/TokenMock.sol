pragma solidity ^0.4.24;
import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import './DividendableToken.sol';

contract TokenMock is DividendableToken {

    string public name = "DIV";
    string public symbol = "DIV";
    uint8 public decimals = 18;

    constructor(uint _dividendTimeSpan) DividendableToken(_dividendTimeSpan) {
        totalSupply_ = 1000000 * (10 ** 18);
        setBalance(msg.sender, totalSupply_);
        
    }
}