const parseSolcOutput = require('ultralightbeam/lib/parseSolcOutput')
const solc = require('solc')
const fs = require('fs')

const zeppelinContractsDir = `${__dirname}/../../node_modules/openzeppelin-solidity/contracts`

module.exports = parseSolcOutput(solc.compile({
    sources: {
      'math/SafeMath.sol': fs.readFileSync(`${zeppelinContractsDir}/math/SafeMath.sol`, 'utf8'),
      'utils/Address.sol': fs.readFileSync(`${zeppelinContractsDir}/utils/Address.sol`, 'utf8'),
      'IERC20.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC20/IERC20.sol`, 'utf8'),
      'ERC20.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC20/ERC20.sol`, 'utf8'),
      'ownership/Ownable.sol': fs.readFileSync(`${zeppelinContractsDir}/ownership/Ownable.sol`, 'utf8'),
      'Currency.sol': fs.readFileSync(`${__dirname}/Currency.sol`, 'utf8'),
    }
  }, 1))['Currency.sol:Currency']
