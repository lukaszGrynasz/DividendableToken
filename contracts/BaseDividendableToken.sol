pragma solidity ^0.4.24;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract  BaseDividendableToken is StandardToken, Ownable {

    uint constant public BALANCE_FLAG = 2**128-1;
    uint8 constant public MAX_DIVIDEND_LOOP = 5; 

    //prevent from constantly add dividend 
    uint dividendTimeSpan = 0;
    uint lastDividentTimestamp = 0;

    constructor(uint _dividendTimeSpan) {
        dividendTimeSpan = _dividendTimeSpan;
    }

    event AddDividend( address indexed founder, uint256 valueAdded);

    event DebugBase(uint256 holded,address addr);

    uint[] public dividends;

    //0-127 balance
    mapping(address=>uint) internal accounts;
   
    function balanceOf(address _owner) public view returns (uint256) {
        return uint256(accounts[_owner] & BALANCE_FLAG);
    }

    function setBalance(address _owner, uint _value) internal {
        accounts[_owner] = accounts[_owner]&(BALANCE_FLAG<<128)|_value;
    } 

    function setLastDividend(address _owner,uint128 _lastDividend) internal {
        accounts[_owner] = accounts[_owner]&BALANCE_FLAG|(_lastDividend<<128);
    }

    function setAccount(address _owner, uint _value, uint _lastDividend) internal {
        accounts[_owner] = _value|(_lastDividend << 128);
    }

    function getLastDividend(address _owner) public returns(uint){
        return (accounts[_owner]>>128);
    }

    function addDividend(uint _value) public onlyOwner {
        require(lastDividentTimestamp + dividendTimeSpan <= now, "Dividend timespan is not reached");

        uint senderBalance = balanceOf(msg.sender);
        require(senderBalance >= _value, "Not enaught token balance");

        setBalance(msg.sender, senderBalance.sub(_value));
        setBalance(address(this), balanceOf(this).add(_value));

        dividends.push(_value);
        lastDividentTimestamp = now;

        emit AddDividend(msg.sender, _value);
    }

    function getLastDividendAmount(address _owner) public returns(uint) {
        return dividends[getLastDividend(_owner)];
    }

    function calculateDividend(address _owner) public returns(uint, uint) {
        
        uint lastDividend = getLastDividend(_owner);
        
        if(dividends.length > lastDividend) {
                
            uint _ownerBalance = balanceOf(_owner);
            uint sumOfDividends = 0;
            uint i = lastDividend;
            uint loops = dividends.length - lastDividend;
            
            //TODO add limits to 5-10 loops
            for(; i < loops ; i++)
                sumOfDividends = sumOfDividends + _ownerBalance * dividends[i] / totalSupply_;
            return (sumOfDividends, ++i);
        }

        return (0,lastDividend) ;
    }
    
}