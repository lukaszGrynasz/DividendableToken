const TokenMock = artifacts.require('TokenMock.sol');

import { ether } from 'openzeppelin-solidity/test/helpers/ether';
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert';

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();
  
  contract('DividendableToken costs', function (accounts) {
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
          
          describe('Test costs', function () {
            it('show transfer cost without dividend', async function () {
                var tx = await data.token.transfer(accounts[1], ether(20));
                console.log("Transfer gas used : "+ tx.receipt.gasUsed);
              
            });

            it('show transfer cost with dividend', async function () {
                await data.token.addDividend(ether(10000));
                var tx = await data.token.transfer(accounts[1], 0);

                console.log("Transfer with dividend gas used : "+ tx.receipt.gasUsed);
              
            });

            it('show transferFrom cost without dividend', async function () {
                await data.token.approve(accounts[1], ether(1000));
                var tx = await data.token.transferFrom(accounts[0], accounts[2], ether(1000), {from:accounts[1]});

                console.log("TransferFrom without dividend gas used : "+ tx.receipt.gasUsed);
              
            });

            it('show transferFrom cost with dividend', async function () {
                await data.token.approve(accounts[1], ether(1000));
                await data.token.addDividend(ether(10000));

                var tx = await data.token.transferFrom(accounts[0], accounts[2], ether(1000), {from:accounts[1]});

                console.log("TransferFrom with dividend gas used : "+ tx.receipt.gasUsed);
              
            });

          });    
        
  });
  
  
 
  