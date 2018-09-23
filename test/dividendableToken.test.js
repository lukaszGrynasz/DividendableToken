const TokenMock = artifacts.require('TokenMock.sol');

import { ether } from 'openzeppelin-solidity/test/helpers/ether';
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert';

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();
  
  contract('PwayDelayedWithdrawWalletFactory', function (accounts) {
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
          
          describe('Test balance', function () {
            it('should show correct balance', async function () {

                var acc1Balance = await data.token.balanceOf(accounts[1]);
                acc1Balance.should.be.bignumber.equal(ether(100000));
            });

            it('should transfer tokens', async function () {

                var acc1Balance = await data.token.balanceOf(accounts[1]);
                await data.token.transfer(accounts[1], ether(20));
                var acc1BalanceAfter = await data.token.balanceOf(accounts[1]);

                acc1BalanceAfter.should.be.bignumber.equal(acc1Balance.plus(ether(20)));
            });

            it('should add dividend to token', async function () {
              
                await data.token.addDividend(ether(10000));
                var dividenBalance = await data.token.balanceOf(data.token.address);
                dividenBalance.should.be.bignumber.equal(ether(10000));
                
            });

            it('should substract token transfered on dividend', async function () {
              
                var accBalance = await data.token.balanceOf(accounts[0]);
                await data.token.addDividend(ether(10000));
                var accBalanceAfter = await data.token.balanceOf(accounts[0]);
              
                accBalance.should.be.bignumber.equal(accBalanceAfter.plus(ether(10000)));
                
            });

            it('should show correct number of dividends', async function () {
              
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(20000));
                //var dividentToPayoff = await data.token.calculateDividend(accounts[0]);
                //console.log(dividentToPayoff);
                //accBalance.should.be.bignumber.equal(accBalanceAfter.plus(ether(10000)));
                var div = await data.token.dividends(1);
                div.should.be.bignumber.equal(ether(20000));
                
            });

            it('should calculate current dividend', async function () {
              
                await data.token.addDividend(ether(10000));
                var lastDiv = await data.token.getLastDividend(accounts[0])
                console.log(lastDiv);

                var dividentToPayoff = await data.token.calculateDividend.call(accounts[0]);
                console.log(dividentToPayoff);
                //accBalance.should.be.bignumber.equal(accBalanceAfter.plus(ether(10000)));
                
            });
           
          });    
        
  });
  
  
 
  