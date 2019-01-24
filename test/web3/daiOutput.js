const parseSolcOutput = require('ultralightbeam/lib/parseSolcOutput')
const solc = require('solc')
const fs = require('fs')

const zeppelinContractsDir = `${__dirname}/../../node_modules/openzeppelin-solidity/contracts`

module.exports = solc.compile({
    sources: {
      'DAITOKEN.sol': fs.readFileSync(`${__dirname}/DAITOKEN.sol`, 'utf8'),
    }
  }, 1).contracts['DAITOKEN.sol:DAITOKEN']
