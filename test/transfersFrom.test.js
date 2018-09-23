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

            it('should set allowance tokens', async function () {

                await data.token.approve(accounts[1], ether(1000));
                var allowance = await data.token.allowance(accounts[0], accounts[1]);

                allowance.should.be.bignumber.equal(ether(1000));
            });

            it('should sub tokens from sender balance at transfer from', async function () {

                await data.token.approve(accounts[1], ether(1000));
                var balanceAcc = await data.token.balanceOf(accounts[0]);
               
                await data.token.transferFrom(accounts[0], accounts[2], ether(1000), {from:accounts[1]});

                var balanceAccAfter = await data.token.balanceOf(accounts[0]);
                console.log(`balanceAcc : ${balanceAcc.toString(10)} balanceAccAfter ${balanceAccAfter.toString(10)}`);
                balanceAcc.should.be.bignumber.equal(balanceAccAfter.plus(ether(1000)));
            });

            it('should add tokens to reciever balance at transfer from', async function () {

                await data.token.approve(accounts[1], ether(1000));
                var balanceAcc2 = await data.token.balanceOf(accounts[2]);
               
                await data.token.transferFrom(accounts[0], accounts[2], ether(1000), {from:accounts[1]});

                var balanceAcc2After = await data.token.balanceOf(accounts[2]);
                console.log(`balanceAcc2 : ${balanceAcc2.toString(10)} balanceAcc2After ${balanceAcc2After.toString(10)}`);
                balanceAcc2After.should.be.bignumber.equal(balanceAcc2.plus(ether(1000)));
            });

            it('should reduces allowance', async function () {

                await data.token.approve(accounts[1], ether(1000));
                var allowance = await data.token.allowance(accounts[0], accounts[1]);
               
                await data.token.transferFrom(accounts[0], accounts[2], ether(1000), {from:accounts[1]});

                var allowanceAfter = await data.token.allowance(accounts[0], accounts[1]);
                console.log(`allowance : ${allowance.toString(10)} allowanceAfter ${allowanceAfter.toString(10)}`);
                allowance.should.be.bignumber.equal(allowanceAfter.plus(ether(1000)));
            });

            it('should distribute dividiend to initiator', async function () {

                await data.token.approve(accounts[1], ether(1000));
                await data.token.addDividend(ether(10000));

                var balanceOfAcc1 = await data.token.balanceOf(accounts[1]);
                var dividend = await data.token.calculateDividend(accounts[1]);
           
                await data.token.transferFrom(accounts[0], accounts[2], ether(1000), {from:accounts[1]});

                var balanceOfAcc1After = await data.token.balanceOf(accounts[1]);
                
                balanceOfAcc1After.should.be.bignumber.equal(balanceOfAcc1.plus(dividend[0]));
            });
          });    
        
  });
  
  
 
  