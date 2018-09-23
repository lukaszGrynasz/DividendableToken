# DividendableToken
Dividendable ERC20 Token is designed to reduced gas costs of transfer and transferFrom methods in case of dividend payment.

1. Run tests
```
npm install
truffle develop 
```
in new console window 
```
truffle test .\test\baseFunctions.test.js --network local
truffle test .\test\costs.test.js --network local
truffle test .\test\transfers.test.js --network local
truffle test .\test\transfersFrom.test.js --network local
 ```
