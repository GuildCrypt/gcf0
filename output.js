const parseSolcOutput = require('ultralightbeam/lib/parseSolcOutput')
const solc = require('solc')
const fs = require('fs')
const path = require('path')

const zeppelinDir = path.dirname(require.resolve('openzeppelin-solidity/package.json'))
const zeppelinContractsDir = `${zeppelinDir}/contracts`

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
      'utils/ReentrancyGuard.sol': fs.readFileSync(`${zeppelinContractsDir}/utils/ReentrancyGuard.sol`, 'utf8'),
      'ownership/Ownable.sol': fs.readFileSync(`${zeppelinContractsDir}/ownership/Ownable.sol`, 'utf8'),
      'OathForge.sol': fs.readFileSync(`${__dirname}/node_modules/oathforge/OathForge.sol`, 'utf8'),
      'RiftPact.sol': fs.readFileSync(`${__dirname}/RiftPact.sol`, 'utf8'),
    }
  }, 1)
