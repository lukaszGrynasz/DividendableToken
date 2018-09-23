const TokenMock = artifacts.require('TokenMock.sol');

import { ether } from 'openzeppelin-solidity/test/helpers/ether';
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert';

const BigNumber = web3.BigNumber;
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();
  
  contract('DividendableToken base function', function (accounts) {
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
            it('should show correct balance', async function () {

                var acc1Balance = await data.token.balanceOf(accounts[1]);
                acc1Balance.should.be.bignumber.equal(ether(100000));
            });

            it('should show correct last dividend number', async function () {
                var lastDividendNumber = await data.token.getLastDividend(accounts[1]);
                lastDividendNumber.should.be.bignumber.equal(new BigNumber(0));
                
            });

            it('should show correct calculate dividend amount when no dividends was applied', async function () {
                var lastDividend = await data.token.calculateDividend(accounts[1]);
                lastDividend[1].should.be.bignumber.equal(new BigNumber(0));
                
            });

            it('should show correct number of dividends', async function () {
              
                await data.token.addDividend(ether(10000));
                await data.token.addDividend(ether(20000));
                var div = await data.token.dividends(1);
                div.should.be.bignumber.equal(ether(20000));
                
            });

            it('should add dividend to token', async function () {
              
                await data.token.addDividend(ether(10000));
                var dividenBalance = await data.token.balanceOf(data.token.address);
                dividenBalance.should.be.bignumber.equal(ether(10000));
                
            });

            it('should calculate current dividend', async function () {
              
                await data.token.addDividend(ether(10000));
                //var lastDiv = await data.token.getLastDividend(accounts[0])
                var totalSupply = await data.token.totalSupply();
                var balanceOfAcc = await data.token.balanceOf(accounts[0]);
                //console.log(`Total supply : ${totalSupply.toString(10)} acc balance ${balanceOfAcc.toString(10)}`);
                
                var dividend = await data.token.calculateDividend(accounts[0]);
                dividend[0].should.be.bignumber.equal(balanceOfAcc.mul(ether(10000)).div(totalSupply));
                
            });

            it('should show last dividend amount for chosen account', async function () {
              
                await data.token.addDividend(ether(10000));
                //var lastDiv = await data.token.getLastDividend(accounts[0])
                var lastDividendAmount = await data.token.getLastDividendAmount(accounts[0]);
                //console.log(`Total supply : ${totalSupply.toString(10)} acc balance ${balanceOfAcc.toString(10)}`);
                lastDividendAmount.should.be.bignumber.equal(ether(10000));
                
            });
           
          });    
        
  });
  
  
 
  