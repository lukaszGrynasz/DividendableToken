pragma solidity ^0.4.24;
import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import './BaseDividendableToken.sol';

contract DividendableToken is BaseDividendableToken {

    event Debug(uint256 holded,address addr);

    event DividendPayed(address to,uint256 amount);

    constructor(uint _dividendTimeSpan) BaseDividendableToken(_dividendTimeSpan) public{
    }

    function transfer(address _to,uint256 _value) public returns(bool){
        require(address(this) != _to, "Cannot send tokens to token smart contract");

        uint senderBalance = balanceOf(msg.sender);
        emit Debug(senderBalance, msg.sender);
        require(_value <= senderBalance, "Sender balance is less than value");
        require(_to != address(0), "Address to can not be 0x0");

        //set data for msg.sender
        var (dividendForSender, lastDividendSender ) = calculateDividend(msg.sender);
        setAccount(msg.sender,senderBalance.sub(_value).add(dividendForSender),lastDividendSender);

        //set data for _to
        uint reciverBalance = balanceOf(_to);
        var (dividendForReciever, lastDividendReciever ) = calculateDividend(_to);
        setAccount(_to,reciverBalance.add(_value).add(dividendForReciever),lastDividendReciever);

        emit Transfer(msg.sender, _to, _value);

        //set data form token balance
        setBalance(address(this), balanceOf(this).sub(dividendForSender).sub(dividendForReciever));

        if(dividendForSender > 0)
            emit DividendPayed(msg.sender,dividendForSender);
        if(dividendForReciever > 0)
            emit DividendPayed(_to,dividendForReciever);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(address(this) != _to, "Cannot send tokens to token smart contract");
        require(_value <= balanceOf(_from), "Balance from is less than value");
        require(_value <= allowed[_from][msg.sender], "Allowance is not enaught");
        require(_to != address(0), "Address to can not be 0x0");

        //set data for msg.sender
        uint balance = balanceOf(msg.sender);
        var (dividendForSender, lastDividendSender ) = calculateDividend(msg.sender);
        setAccount(msg.sender,balance.add(dividendForSender),lastDividendSender);

        //set data for _to
        balance = balanceOf(_to);
        var (dividendForReciever, lastDividendReciever ) = calculateDividend(_to);
        setAccount(_to,balance.add(_value).add(dividendForReciever),lastDividendReciever);

        balance = balanceOf(_from);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        var (dividendForFrom, lastDividendFrom ) = calculateDividend(_from);
        setAccount(_from,balance.sub(_value).add(dividendForFrom),lastDividendFrom);

        emit Transfer(_from, _to, _value);

        //set data form token balance
        setBalance(address(this), balanceOf(this).sub(dividendForSender).sub(dividendForReciever).sub(dividendForFrom));
        
        if(dividendForSender > 0)
            emit DividendPayed(msg.sender,dividendForSender);
        if(dividendForReciever > 0)
            emit DividendPayed(_to,dividendForReciever);
        if(dividendForFrom > 0)
            emit DividendPayed(_from,dividendForFrom);

        return true;
    }
}