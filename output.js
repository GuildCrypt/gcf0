const parseSolcOutput = require('ultralightbeam/lib/parseSolcOutput')
const solc = require('solc')
const fs = require('fs')

const zeppelinContractsDir = `${__dirname}/node_modules/openzeppelin-solidity/contracts`

module.exports = solc.compile({
    sources: {
      'math/SafeMath.sol': fs.readFileSync(`${zeppelinContractsDir}/math/SafeMath.sol`, 'utf8'),
      'utils/Address.sol': fs.readFileSync(`${zeppelinContractsDir}/utils/Address.sol`, 'utf8'),
      'introspection/IERC165.sol': fs.readFileSync(`${zeppelinContractsDir}/introspection/IERC165.sol`, 'utf8'),
      'introspection/ERC165.sol': fs.readFileSync(`${zeppelinContractsDir}/introspection/ERC165.sol`, 'utf8'),
      'IERC721.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC721/IERC721.sol`, 'utf8'),
      'IERC721Receiver.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC721/IERC721Receiver.sol`, 'utf8'),
      'IERC721Metadata.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC721/IERC721Metadata.sol`, 'utf8'),
      'ERC721Metadata.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC721/ERC721Metadata.sol`, 'utf8'),
      'ERC721.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC721/ERC721.sol`, 'utf8'),
      'IERC20.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC20/IERC20.sol`, 'utf8'),
      'ERC20.sol': fs.readFileSync(`${zeppelinContractsDir}/token/ERC20/ERC20.sol`, 'utf8'),
      'ownership/Ownable.sol': fs.readFileSync(`${zeppelinContractsDir}/ownership/Ownable.sol`, 'utf8'),
      'OathForge.sol': fs.readFileSync(`${__dirname}/node_modules/oathforge/OathForge.sol`, 'utf8'),
      'GCF0.sol': fs.readFileSync(`${__dirname}/GCF0.sol`, 'utf8'),
    }
  }, 1)
