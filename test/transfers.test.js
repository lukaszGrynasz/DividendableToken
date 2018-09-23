const TokenMock = artifacts.require('TokenMock.sol');

import { ether } from 'openzeppelin-solidity/test/helpers/ether';
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert';

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();
  
  contract('DividendableToken transfers', function (accounts) {
       var data = {};
 
          beforeEach(async function () {
              data.token = await TokenMock.new(0);
              data.DECIMALS = await data.token.decimals();
              
              //distribute tokens
              await data.token.transfer(accounts[1], ether(100000));
              await data.token.transfer(accounts[2], ether(175000));
              await data.token.transfer(accounts[3], ether(250000));
              await data.token.transfer(accounts[5], ether(275000));
        
          });
          
          describe('Token tests', function () {

            it('should transfer tokens', async function () {

                var acc1Balance = await data.token.balanceOf(accounts[1]);
                await data.token.transfer(accounts[1], ether(20));
                var acc1BalanceAfter = await data.token.balanceOf(accounts[1]);

                acc1BalanceAfter.should.be.bignumber.equal(acc1Balance.plus(ether(20)));
            });

            it('should sub tokens from sender', async function () {

                var accBalance = await data.token.balanceOf(accounts[0]);
                await data.token.transfer(accounts[1], ether(20));
                var accBalanceAfter = await data.token.balanceOf(accounts[0]);

                accBalance.should.be.bignumber.equal(accBalanceAfter.plus(ether(20)));
            });
        

            it('should substract token transfered on dividend', async function () {
              
                var accBalance = await data.token.balanceOf(accounts[0]);
                await data.token.addDividend(ether(10000));
                var accBalanceAfter = await data.token.balanceOf(accounts[0]);
              
                accBalance.should.be.bignumber.equal(accBalanceAfter.plus(ether(10000)));
                
            });
          

            it('should distribute dividend after transfer', async function () {
              
                await data.token.addDividend(ether(10000));
                var balanceOfAcc = await data.token.balanceOf(accounts[0]);
                var dividend = await data.token.calculateDividend(accounts[0]);
               
                await data.token.transfer(accounts[1], 0);
                var balanceOfAccAfter = await data.token.balanceOf(accounts[0]);
                
                balanceOfAccAfter.should.be.bignumber.equal(balanceOfAcc.plus(dividend[0]));
                
            });

            it('should transfer should distribute token to transaction parties', async function () {
              
                await data.token.addDividend(ether(10000));
                var balanceOfAcc1 = await data.token.balanceOf(accounts[1]);
                var dividend = await data.token.calculateDividend(accounts[1]);
           
                await data.token.transfer(accounts[1], 0);
                var balanceOfAcc1After = await data.token.balanceOf(accounts[1]);
                
                balanceOfAcc1After.should.be.bignumber.equal(balanceOfAcc1.plus(dividend[0]));
                
            });

            it('should distibute two dividends', async function () {
              
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(20000));

                var balanceOfAcc1 = await data.token.balanceOf(accounts[1]);
                var dividend = await data.token.calculateDividend(accounts[1]);
               
                await data.token.transfer(accounts[1], 0);
                var balanceOfAcc1After = await data.token.balanceOf(accounts[1]);
                console.log(`dividend : ${dividend[0].toString(10)} acc balance ${balanceOfAcc1.toString(10)}`);
                balanceOfAcc1After.should.be.bignumber.equal(balanceOfAcc1.plus(dividend[0]));
                
            });

            it('should send last 5 dividends', async function () {
              
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));

                await data.token.addDividend(ether(10000));

                var balanceOfAcc1 = await data.token.balanceOf(accounts[1]);
                var dividend = await data.token.calculateDividend(accounts[1]);
         
                await data.token.transfer(accounts[1], 0);
                var balanceOfAcc1After = await data.token.balanceOf(accounts[1]);
                console.log(`dividend : ${dividend[0].toString(10)} acc balance ${balanceOfAcc1.toString(10)}`);
                balanceOfAcc1After.should.be.bignumber.equal(balanceOfAcc1.plus(dividend[0]));
                
            });

            it('should send 6 dividends in next transfer', async function () {
              
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(10000));

                await data.token.addDividend(ether(10000));

                await data.token.transfer(accounts[1], 0);

                var balanceOfAcc1 = await data.token.balanceOf(accounts[1]);
                var dividend = await data.token.calculateDividend(accounts[1]);
                var lastDividend = await data.token.getLastDividend(accounts[1]);
                console.log(`Last dividend ${lastDividend.toString(10)}`);
         
                await data.token.transfer(accounts[1], 0);
                var balanceOfAcc1After = await data.token.balanceOf(accounts[1]);
                console.log(`dividend : ${dividend[0].toString(10)} acc balance ${balanceOfAcc1.toString(10)}`);
                balanceOfAcc1After.should.be.bignumber.equal(balanceOfAcc1.plus(dividend[0]));
                
            });
           
          });    
        
  });
  
  
 
  