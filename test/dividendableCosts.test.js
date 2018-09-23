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
              data.token = await TokenMock.new();
              data.DECIMALS = await data.token.decimals();
              
              //distribute tokens
              await data.token.transfer(accounts[1], ether(100000));
              await data.token.transfer(accounts[2], ether(175000));
              await data.token.transfer(accounts[3], ether(250000));
              await data.token.transfer(accounts[5], ether(275000));
        
          });
          
          describe('Test balance', function () {
            it('show transfer costn without dividend', async function () {
                var tx = await data.token.transfer(accounts[1], ether(20));
                console.log("Transfer gas used : "+ tx.receipt.gasUsed);
              
            });

          });    
        
  });
  
  
 
  