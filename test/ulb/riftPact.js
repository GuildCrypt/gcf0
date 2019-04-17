const ultralightbeam = require('./ultralightbeam')
const riftPactInfo = require('../../')
const oathForgeInfo = require('./oathForgeInfo')
const currencyInfo = require('./currencyInfo')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const accounts = require('./accounts')
const FailedTransactionError = require('ultralightbeam/lib/errors/FailedTransaction')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const BluebirdStub = require('bluebird-stub')
const testRiftPact = require('./testRiftPact')
const testCurrency = require('./testCurrency')
const riftPactStub = require('./riftPactStub')
const currencyStub = require('./currencyStub')
const amorphAscii = require('amorph-ascii')
const chai = require('chai')
const amorphBoolean = require('amorph-boolean')

describe('riftPact', () => {

  const name = Amorph.from(amorphAscii, 'GuildCrypt 0')
  const symbol = Amorph.from(amorphAscii, 'GC:0')

  const zero = Amorph.from(amorphNumber.unsigned, 0)
  const one = Amorph.from(amorphNumber.unsigned, 1)
  const two = Amorph.from(amorphNumber.unsigned, 2)
  const three = Amorph.from(amorphNumber.unsigned, 3)
  const four = Amorph.from(amorphNumber.unsigned, 4)
  const five = Amorph.from(amorphNumber.unsigned, 5)
  const seven = Amorph.from(amorphNumber.unsigned, 7)
  const eight = Amorph.from(amorphNumber.unsigned, 8)
  const eleven = Amorph.from(amorphNumber.unsigned, 1)
  const twelve = Amorph.from(amorphNumber.unsigned, 12)
  const thousand = Amorph.from(amorphNumber.unsigned, 1000)
  const tenThousand = Amorph.from(amorphNumber.unsigned, 10000)
  const hundredThousand = Amorph.from(amorphNumber.unsigned, 100000)
  const million = Amorph.from(amorphNumber.unsigned, 1000000)
  const billion = Amorph.from(amorphNumber.unsigned, 1000000000)
  const twoBillion = Amorph.from(amorphNumber.unsigned, 2000000000)
  const trillion = Amorph.from(amorphNumber.unsigned, 1000000000000)
  const hundred = Amorph.from(amorphNumber.unsigned, 100)
  const fiveThousand = Amorph.from(amorphNumber.unsigned, 5000)
  const empty = new Amorph((new Uint8Array(32)).fill(0))
  const amorphTrue = Amorph.from(amorphBoolean, true)
  const amorphFalse = Amorph.from(amorphBoolean, false)
  const nullAddress = new Amorph((new Uint8Array(20)).fill(0))
  const sevenDays = Amorph.from(amorphNumber.unsigned, 604800)

  const oathForgeToken = {
    id: zero,
    uri: Amorph.from(amorphAscii, 'https://uris.com/a'),
    sunsetLength: Amorph.from(amorphNumber.unsigned, 7776000), //90 days
    redemptionCodeHash: getRandomAmorph(32),
  }

  const auctionAllowedAt = Amorph.from(amorphNumber.unsigned, Math.floor((new Date).getTime() / 1000) + 31536000)

  let oathForge
  let riftPact
  let currency

  describe('setup oathForge', () => {
    it('should deploy oathForge', () => {
      return ultralightbeam.solDeploy(oathForgeInfo.code, oathForgeInfo.abi, [
        name,
        symbol
      ], {
        from: accounts[0]
      }).then((_oathForge) => {
        oathForge = _oathForge
      })
    })
    it('should create first token', () => {
      return oathForge.broadcast('mint(address,string,uint256)', [accounts[1].address, oathForgeToken.uri, oathForgeToken.sunsetLength], {
        from: accounts[0]
      }).getConfirmation()
    })
  })
  describe('setup currency', () => {
    it('should deploy currency', () => {
      return ultralightbeam.solDeploy(currencyInfo.code, currencyInfo.abi, [
        twoBillion
      ], {
        from: accounts[0]
      }).then((_currency) => {
        currency = _currency
        currencyStub.resolve(currency)
      })
    })
    it('transfer 1billion to accounts[3]', () => {
      return currency.broadcast('transfer(address,uint256)', [accounts[3].address, billion], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('transfer 1billion to accounts[4]', () => {
      return currency.broadcast('transfer(address,uint256)', [accounts[4].address, billion], {
        from: accounts[0]
      }).getConfirmation()
    })
  })
  describe('setup riftPact', () => {
    it('should deploy riftPact', () => {
      return ultralightbeam.solDeploy(riftPactInfo.code, riftPactInfo.abi, [
        oathForge.address,
        oathForgeToken.id,
        tenThousand,
        currency.address,
        auctionAllowedAt,
        sevenDays,
        five
      ], {
        from: accounts[1]
      }).then((_riftPact) => {
        riftPact = _riftPact
        riftPactStub.resolve(riftPact)
      })
    })
    it('riftPact should have correct parentTokenId', () => {
      return riftPact.fetch('parentTokenId()', []).should.eventually.amorphEqual(oathForgeToken.id)
    })
    it('riftPact should have correct auctionAllowedAt', () => {
      return riftPact.fetch('auctionAllowedAt()', []).should.eventually.amorphEqual(auctionAllowedAt)
    })
    it('riftPact should have correct currencyAddress', () => {
      return riftPact.fetch('currencyAddress()', []).should.eventually.amorphEqual(currency.address)
    })
    it('riftPact should have correct parentToken', () => {
      return riftPact.fetch('parentToken()', []).should.eventually.amorphEqual(oathForge.address)
    })
    it('riftPact should have correct minAuctionCompleteWait', () => {
      return riftPact.fetch('minAuctionCompleteWait()', []).should.eventually.amorphEqual(sevenDays)
    })
    it('riftPact should have correct minBidDeltaPermille', () => {
      return riftPact.fetch('minBidDeltaPermille()', []).should.eventually.amorphEqual(five)
    })
    it('riftPact should have correct totalSupply', () => {
      return riftPact.fetch('totalSupply()', []).should.eventually.amorphEqual(tenThousand)
    })
    it('riftPact should have balance of totalSupply', () => {
      return riftPact.fetch('balanceOf(address)', [accounts[1].address]).should.eventually.amorphEqual(tenThousand)
    })
    it('should have correct code', () => {
      return ultralightbeam.eth.getCode(riftPact.address).should.eventually.amorphEqual(riftPactInfo.runcode)
    })
    it('accounts[1] should have othforge token ownership', () => {
      return oathForge.fetch('ownerOf(uint256)', [oathForgeToken.id]).should.eventually.amorphEqual(accounts[1].address)
    })
    it('accounts[1] should transfer tokenA to riftPact', () => {
      return oathForge.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, riftPact.address, oathForgeToken.id], {
        from: accounts[1]
      }).getConfirmation()
    })
    it('riftPact should have token ownership', () => {
      return oathForge.fetch('ownerOf(uint256)', [oathForgeToken.id]).should.eventually.amorphEqual(riftPact.address)
    })
    testRiftPact(10000, [0, 10000, 0, 0, 0], 1, 0)
    testCurrency(0, [0, 0, 0, 1000000000, 1000000000])
  })
  describe('blacklisting', () => {
    it('accounts[2] should not be able to blacklist account 6', () => {
      return riftPact.broadcast('setIsBlacklisted(address,bool)', [accounts[6].address, amorphTrue], {
        from: accounts[2]
      }).getConfirmation().should.eventually.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[6] should not be blacklisted', () => {
      return riftPact.fetch('isBlacklisted(address)', [accounts[6].address]).should.eventually.amorphEqual(amorphFalse)
    })
    it('accounts[1] should not be able to blacklist account 6', () => {
      return riftPact.broadcast('setIsBlacklisted(address,bool)', [accounts[6].address, amorphTrue], {
        from: accounts[1]
      }).getConfirmation()
    })
    it('accounts[6] should be blacklisted', () => {
      return riftPact.fetch('isBlacklisted(address)', [accounts[6].address]).should.eventually.amorphEqual(amorphTrue)
    })
    it('accounts[1] should not be able to transfer to accounts[6]', () => {
      return riftPact.broadcast('transfer(address,uint256)', [accounts[6].address, one], {
        from: accounts[1]
      }).getConfirmation().should.eventually.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[1] should not be able to transferFrom to accounts[6]', () => {
      return riftPact.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, accounts[6].address, one], {
        from: accounts[1]
      }).getConfirmation().should.eventually.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[1] should not be able to approve accounts[6]', () => {
      return riftPact.broadcast('approve(address,uint256)', [accounts[6].address, one], {
        from: accounts[1]
      }).getConfirmation().should.eventually.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[1] should not be able to increaseAllowance to accounts[6]', () => {
      return riftPact.broadcast('increaseAllowance(address,uint256)', [accounts[6].address, one], {
        from: accounts[1]
      }).getConfirmation().should.eventually.be.rejectedWith(FailedTransactionError)
    })
  })
  describe('approve currency', () => {
    it('accounts[3] should approve 1trillion', () => {
      return currency.broadcast('approve(address,uint256)', [riftPact.address, trillion], {
        from: accounts[3]
      }).getConfirmation()
    })
    it('accounts[4] should approve 1trillion', () => {
      return currency.broadcast('approve(address,uint256)', [riftPact.address, trillion], {
        from: accounts[4]
      }).getConfirmation()
    })
    testCurrency(0, [0, 0, 0, 1000000000, 1000000000])
  })
  describe('first transfer', () => {
    it('account1 should transfer 5000 riftpact tokens to account2', () => {
      return riftPact.broadcast('transfer(address,uint256)', [accounts[2].address, fiveThousand], {
        from: accounts[1]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 5000, 5000, 0, 0], 1, 0)
    testCurrency(0, [0, 0, 0, 1000000000, 1000000000])
  })
  describe('start auction', () => {
    it('accounts[0] should NOT be able to start auction', () => {
      return riftPact.broadcast('startAuction()', [], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[1] should NOT be able to start auction', () => {
      return riftPact.broadcast('startAuction()', [], {
        from: accounts[1]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('should skip till after auctionAllowedAt', (done) => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [auctionAllowedAt.to(amorphNumber.unsigned) - Math.floor((new Date).getTime() /1000)],
        id: (new Date()).getTime()
      }, (err, results) => {
        done(err)
      })
    })
    it('should mine a block', () => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: (new Date()).getTime()
      }, () => {})

      return ultralightbeam.blockPoller.blockPromise
    })
    it('accounts[1] should start auction', () => {
      return riftPact.broadcast('startAuction()', [], {
        from: accounts[1]
      }).getConfirmation()
    })
    it('auctionStartedAt should be last block timestamp', () => {
      return ultralightbeam.getLatestBlock().then((block) => {
        return riftPact.fetch('auctionStartedAt()', []).should.eventually.amorphEqual(block.timestamp)
      })
    })
    it('topBidder should be nullAddress', () => {
      return riftPact.fetch('topBidder()', []).should.eventually.amorphEqual(nullAddress)
    })
    it('topBid should be zero', () => {
      return riftPact.fetch('topBid()', []).should.eventually.amorphEqual(zero)
    })
    it('minBid should be one', () => {
      return riftPact.fetch('minBid()', []).should.eventually.amorphEqual(one)
    })
    testRiftPact(10000, [0, 5000, 5000, 0, 0], 1, 0)
    testCurrency(0, [0, 0, 0, 1000000000, 1000000000])
  })
  describe('second transfer', () => {
    it('account1 should transfer 1000 riftpact tokens to account2', () => {
      return riftPact.broadcast('transfer(address,uint256)', [accounts[2].address, thousand], {
        from: accounts[1]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 1, 0)
    testCurrency(0, [0, 0, 0, 1000000000, 1000000000])
  })
  describe('first bid (1)', () => {
    it('accounts[3] should submit low bid and be rejected', () => {
      return riftPact.broadcast('submitBid(uint256)', [zero], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[3] should submit min bid', () => {
      return riftPact.broadcast('submitBid(uint256)', [one], {
        from: accounts[3]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 2, 1)
    testCurrency(10000, [0, 0, 0, 1000000000 - 10000, 1000000000])
  })
  describe('second bid (2)', () => {
    it('accounts[4] should NOT be able to min bid - 1', () => {
      return riftPact.broadcast('submitBid(uint256)', [one], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[4] should be able to min bid', () => {
      return riftPact.broadcast('submitBid(uint256)', [two], {
        from: accounts[4]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 3, 2)
    testCurrency(20000, [0, 0, 0, 1000000000, 1000000000 - 20000])
  })
  describe('third bid (3)', () => {
    it('accounts[3] should NOT be able to min bid - 1', () => {
      return riftPact.broadcast('submitBid(uint256)', [two], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[3] should be able to min bid', () => {
      return riftPact.broadcast('submitBid(uint256)', [three], {
        from: accounts[3]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 4, 3)
    testCurrency(30000, [0, 0, 0, 1000000000 - 30000, 1000000000])
  })
  describe('fourth bid (1000)', () => {
    it('accounts[4] should be able to 1000', () => {
      return riftPact.broadcast('submitBid(uint256)', [thousand], {
        from: accounts[4]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 1005, 1000)
    testCurrency(10000000, [0, 0, 0, 1000000000, 1000000000 - 10000000])
  })
  describe('fourth bid (1005)', () => {
    it('accounts[3] should NOT be able to min bid - 1', () => {
      return riftPact.broadcast('submitBid(uint256)', [Amorph.from(amorphNumber.unsigned, 1004)], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[3] should be able to min bid', () => {
      return riftPact.broadcast('submitBid(uint256)', [Amorph.from(amorphNumber.unsigned, 1005)], {
        from: accounts[3]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 1011, 1005)
    testCurrency(10050000, [0, 0, 0, 1000000000 - 10050000, 1000000000])
  })
  describe('fifth bid (1011, against self)', () => {
    it('accounts[3] should NOT be able to min bid - 1', () => {
      return riftPact.broadcast('submitBid(uint256)', [Amorph.from(amorphNumber.unsigned, 1010)], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[3] should be able to min bid', () => {
      return riftPact.broadcast('submitBid(uint256)', [Amorph.from(amorphNumber.unsigned, 1011)], {
        from: accounts[3]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 1017, 1011)
    testCurrency(10110000, [0, 0, 0, 1000000000 - 10110000, 1000000000])
  })
  describe('sixth bid (100k, (max liquidity))', () => {
    it('accounts[4] should be able to submit min bid', () => {
      return riftPact.broadcast('submitBid(uint256)', [hundredThousand], {
        from: accounts[4]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 100500, 100000)
    testCurrency(1000000000, [0, 0, 0, 1000000000, 0])
  })
  describe('seventh bid (> max liquidity)', () => {
    it('accounts[3] should NOT be able to min bid', () => {
      return riftPact.broadcast('submitBid(uint256)', [Amorph.from(amorphNumber.unsigned, 100500000)], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 100500, 100000)
    testCurrency(1000000000, [0, 0, 0, 1000000000, 0])
  })
  describe('complete auction', () => {
    it('accounts[0] should NOT be able to completeAuction', () => {
      return riftPact.broadcast('completeAuction()', [], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('accounts[4] should NOT be able to completeAuction', () => {
      return riftPact.broadcast('completeAuction()', [], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('should skip minAuctionCompleteWait', (done) => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [sevenDays.to(amorphNumber.unsigned)],
        id: (new Date()).getTime()
      }, (err, results) => {
        done(err)
      })
    })
    it('should mine a block', () => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: (new Date()).getTime()
      }, () => {})
      return ultralightbeam.blockPoller.blockPromise
    })
    it('accounts[1] should be able to completeAuction', () => {
      return riftPact.broadcast('completeAuction()', [], {
        from: accounts[0]
      }).getConfirmation()
    })
    testRiftPact(10000, [0, 4000, 6000, 0, 0], 100500, 100000)
    testCurrency(1000000000, [0, 0, 0, 1000000000, 0])
  })
  describe('first payout', () => {
    it('accounts[1] should be able to payout', () => {
      return riftPact.broadcast('payout(address)', [accounts[1].address], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('accounts[0] should NOT be able to payout again', () => {
      return riftPact.broadcast('payout(address)', [accounts[1].address], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testRiftPact(6000, [0, 0, 6000, 0, 0], 100500, 100000)
    testCurrency(600000000, [0, 400000000, 0, 1000000000, 0])
  })
  describe('second payout', () => {
    it('accounts[2] should be able to payout', () => {
      return riftPact.broadcast('payout(address)', [accounts[2].address], {
        from: accounts[2]
      }).getConfirmation()
    })
    testRiftPact(0, [0, 0, 0, 0, 0], 100500, 100000)
    testCurrency(0, [0, 400000000, 600000000, 1000000000, 0])
  })
})
