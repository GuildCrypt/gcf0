const ultralightbeam = require('./ultralightbeam')
const cta0Info = require('../cta0Info')
const gc0Info = require('../gc0Info')
const currencyInfo = require('./currencyInfo')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const accounts = require('./accounts')
const FailedTransactionError = require('ultralightbeam/lib/errors/FailedTransaction')
const getRandomAmorph = require('ultralightbeam/lib/getRandomAmorph')
const BluebirdStub = require('bluebird-stub')
const testCta = require('./testCta')
const testCurrency = require('./testCurrency')
const cta0Stub = require('./cta0Stub')
const currencyStub = require('./currencyStub')
const amorphAscii = require('amorph-ascii')
const chai = require('chai')
const amorphBoolean = require('amorph-boolean')

describe('cta', () => {

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
  const million = Amorph.from(amorphNumber.unsigned, 1000000)
  const hundred = Amorph.from(amorphNumber.unsigned, 100)
  const fiveHundred = Amorph.from(amorphNumber.unsigned, 500)
  const empty = new Amorph((new Uint8Array(32)).fill(0))
  const amorphTrue = Amorph.from(amorphBoolean, true)
  const amorphFalse = Amorph.from(amorphBoolean, false)
  const nullAddress = new Amorph((new Uint8Array(20)).fill(0))
  const oneDay = Amorph.from(amorphNumber.unsigned, 86400)

  const wholeTokens = {
    a: {
      id: zero,
      uri: Amorph.from(amorphAscii, 'https://uris.com/a'),
      sunsetLength: Amorph.from(amorphNumber.unsigned, 7776000), //90 days
      redemptionCodeHash: getRandomAmorph(32),
    },
    b: {
      id: one,
      uri: Amorph.from(amorphAscii, 'https://uris.com/b'),
      sunsetLength: Amorph.from(amorphNumber.unsigned, 31536000), //1 year
      redemptionCodeHash: getRandomAmorph(32)
    },
    c: {
      id: two,
      uri: Amorph.from(amorphAscii, 'https://uris.com/c'),
      sunsetLength: Amorph.from(amorphNumber.unsigned, 31536000), //1 year
      redemptionCodeHash: getRandomAmorph(32)
    },
  }

  const fracturedTokens = {
    a0: {
      totalSupply: thousand,
      auctionAllowedAt: Amorph.from(amorphNumber.unsigned, Math.floor((new Date).getTime() / 1000) + 31536000),
      sunsetBuffer: Amorph.from(amorphNumber.unsigned, 2592000), // 30 days
      minAuctionCompleteWait: oneDay,
      minBidDeltaMilliperun: fiveHundred
    }
  }

  console.log(fracturedTokens.a0.auctionAllowedAt.to(amorphNumber.unsigned))



  let gc0
  let cta0
  let currency

  describe('setup gc0', () => {
    it('should deploy gc0', () => {
      return ultralightbeam.solDeploy(gc0Info.code, gc0Info.abi, [
        name,
        symbol
      ], {
        from: accounts[0]
      }).then((_gc0) => {
        gc0 = _gc0
      })
    })
    it('should create first token', () => {
      return gc0.broadcast('mint(address,string,uint256)', [accounts[1].address, wholeTokens.a.uri, wholeTokens.a.sunsetLength], {
        from: accounts[0]
      }).getConfirmation()
    })
  })
  describe('setup currency', () => {
    it('should deploy currency', () => {
      return ultralightbeam.solDeploy(currencyInfo.code, currencyInfo.abi, [
        million
      ], {
        from: accounts[0]
      }).then((_currency) => {
        currency = _currency
        currencyStub.resolve(currency)
      })
    })
    it('transfer 10k to accounts[3]', () => {
      return currency.broadcast('transfer(address,uint256)', [accounts[3].address, tenThousand], {
        from: accounts[0]
      }).getConfirmation()
    })
    it('transfer 10k to accounts[4]', () => {
      return currency.broadcast('transfer(address,uint256)', [accounts[4].address, tenThousand], {
        from: accounts[0]
      }).getConfirmation()
    })
  })
  describe('setup cta0', () => {
    it('should deploy cta0', () => {
      return ultralightbeam.solDeploy(cta0Info.code, cta0Info.abi, [
        currency.address,
        gc0.address,
        wholeTokens.a.id,
        fracturedTokens.a0.totalSupply,
        fracturedTokens.a0.auctionAllowedAt,
        fracturedTokens.a0.sunsetBuffer,
        fracturedTokens.a0.minAuctionCompleteWait,
        fracturedTokens.a0.minBidDeltaMilliperun
      ], {
        from: accounts[1]
      }).then((_cta0) => {
        cta0 = _cta0
        cta0Stub.resolve(cta0)
      })
    })
    it('cta0 accounts[1] should have correct gc0Address', () => {
      return cta0.fetch('gc0Address()', []).should.eventually.amorphEqual(gc0.address)
    })
    it('cta0 accounts[1] should have correct gc0TokenId', () => {
      return cta0.fetch('gc0TokenId()', []).should.eventually.amorphEqual(wholeTokens.a.id)
    })
    it('cta0 accounts[1] should have correct auctionAllowedAt', () => {
      return cta0.fetch('auctionAllowedAt()', []).should.eventually.amorphEqual(fracturedTokens.a0.auctionAllowedAt)
    })
    it('cta0 accounts[1] should have balance of totalSupply', () => {
      return cta0.fetch('balanceOf(address)', [accounts[1].address]).should.eventually.amorphEqual(fracturedTokens.a0.totalSupply)
    })
    it('should have correct code', () => {
      return ultralightbeam.eth.getCode(cta0.address).should.eventually.amorphEqual(cta0Info.runcode)
    })
    it('should NOT have token ownership', () => {
      return cta0.fetch('hasGc0TokenOwnership()', []).should.eventually.amorphEqual(amorphFalse)
    })
    it('account[1] should transfer tokenA to cta0A0', () => {
      return gc0.broadcast('transferFrom(address,address,uint256)', [accounts[1].address, cta0.address, wholeTokens.a.id], {
        from: accounts[1]
      }).getConfirmation()
    })
    it('should have token ownership', () => {
      return cta0.fetch('hasGc0TokenOwnership()', []).should.eventually.amorphEqual(amorphTrue)
    })
    testCta(1000, [0, 1000, 0, 0, 0], 1, 0)
    testCurrency(0, [980000, 0, 0, 10000, 10000])
  })
  describe('approve currency', () => {
    it('accounts[3] should approve 1million', () => {
      return currency.broadcast('approve(address,uint256)', [cta0.address, million], {
        from: accounts[3]
      }).getConfirmation()
    })
    it('accounts[4] should approve 1million', () => {
      return currency.broadcast('approve(address,uint256)', [cta0.address, million], {
        from: accounts[4]
      }).getConfirmation()
    })
    testCurrency(0, [980000, 0, 0, 10000, 10000])
  })
  describe('first transfer', () => {
    it('account1 should transfer 500 aa to account2', () => {
      return cta0.broadcast('transfer(address,uint256)', [accounts[2].address, fiveHundred], {
        from: accounts[1]
      }).getConfirmation()
    })
    it('account1 should have balance of 500', () => {
      return cta0.fetch('balanceOf(address)', [accounts[1].address]).should.eventually.amorphEqual(fiveHundred)
    })
    it('account2 should have balance of 500', () => {
      return cta0.fetch('balanceOf(address)', [accounts[2].address]).should.eventually.amorphEqual(fiveHundred)
    })
    testCta(1000, [0, 500, 500, 0, 0], 1, 0)
    testCurrency(0, [980000, 0, 0, 10000, 10000])
  })
  describe('start auction', () => {
    it('account[0] should NOT be able to start auction', () => {
      return cta0.broadcast('startAuction(uint256)', [one], {
        from: accounts[0]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[1] should NOT be able to start auction', () => {
      return cta0.broadcast('startAuction(uint256)', [one], {
        from: accounts[1]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('should skip till after auctionAllowedAt', (done) => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [fracturedTokens.a0.auctionAllowedAt.to(amorphNumber.unsigned) - Math.floor((new Date).getTime() /1000)],
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
    it('account[1] should start auction', () => {
      return cta0.broadcast('startAuction(uint256)', [two], {
        from: accounts[1]
      }).getConfirmation()
    })
    it('auctionStartedAt should be last block timestamp', () => {
      return ultralightbeam.getLatestBlock().then((block) => {
        return cta0.fetch('auctionStartedAt()', []).should.eventually.amorphEqual(block.timestamp)
      })
    })
    it('topBidder should be nullAddress', () => {
      return cta0.fetch('topBidder()', []).should.eventually.amorphEqual(nullAddress)
    })
    it('topBid should be zero', () => {
      return cta0.fetch('topBid()', []).should.eventually.amorphEqual(zero)
    })
    it('minBid should be one', () => {
      return cta0.fetch('minBid()', []).should.eventually.amorphEqual(one)
    })
    testCta(1000, [0, 500, 500, 0, 0], 1, 0)
    testCurrency(0, [980000, 0, 0, 10000, 10000])
  })
  describe('second transfer', () => {
    it('account1 should transfer 100 aa to account2', () => {
      return cta0.broadcast('transfer(address,uint256)', [accounts[2].address, hundred], {
        from: accounts[1]
      }).getConfirmation()
    })
    testCta(1000, [0, 400, 600, 0, 0], 1, 0)
    testCurrency(0, [980000, 0, 0, 10000, 10000])
  })
  describe('first bid', () => {
    it('account[3] should submit low bid and be rejected', () => {
      return cta0.broadcast('submitBid(uint256)', [zero], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[3] should submit min bid', () => {
      return cta0.broadcast('submitBid(uint256)', [one], {
        from: accounts[3]
      }).getConfirmation()
    })
    testCta(1000, [0, 400, 600, 0, 0], 2, 1)
    testCurrency(1000, [980000, 0, 0, 9000, 10000])
  })
  describe('second bid', () => {
    it('account[4] should NOT be able to min bid - 1', () => {
      return cta0.broadcast('submitBid(uint256)', [one], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[4] should be able to min bid', () => {
      return cta0.broadcast('submitBid(uint256)', [two], {
        from: accounts[4]
      }).getConfirmation()
    })
    testCta(1000, [0, 400, 600, 0, 0], 3, 2)
    testCurrency(2000, [980000, 0, 0, 10000, 8000])
  })
  describe('third bid', () => {
    it('account[3] should NOT be able to min bid - 1', () => {
      return cta0.broadcast('submitBid(uint256)', [two], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[3] should be able to min bid', () => {
      return cta0.broadcast('submitBid(uint256)', [three], {
        from: accounts[3]
      }).getConfirmation()
    })
    testCta(1000, [0, 400, 600, 0, 0], 5, 3)
    testCurrency(3000, [980000, 0, 0, 7000, 10000])
  })
  describe('fourth bid', () => {
    it('account[4] should NOT be able to min bid - 1', () => {
      return cta0.broadcast('submitBid(uint256)', [four], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[4] should be able to min bid', () => {
      return cta0.broadcast('submitBid(uint256)', [five], {
        from: accounts[4]
      }).getConfirmation()
    })
    testCta(1000, [0, 400, 600, 0, 0], 8, 5)
    testCurrency(5000, [980000, 0, 0, 10000, 5000])
  })
  describe('fifth bid', () => {
    it('account[3] should NOT be able to min bid - 1', () => {
      return cta0.broadcast('submitBid(uint256)', [seven], {
        from: accounts[3]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[3] should be able to min bid', () => {
      return cta0.broadcast('submitBid(uint256)', [eight], {
        from: accounts[3]
      }).getConfirmation()
    })
    testCta(1000, [0, 400, 600, 0, 0], 12, 8)
    testCurrency(8000, [980000, 0, 0, 2000, 10000])
  })
  describe('sixth bid', () => {
    it('account[4] should NOT be able to min bid - 1', () => {
      return cta0.broadcast('submitBid(uint256)', [eleven], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[4] should be NOT able to min bid (liquidity)', () => {
      return cta0.broadcast('submitBid(uint256)', [twelve], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    testCta(1000, [0, 400, 600, 0, 0], 12, 8)
    testCurrency(8000, [980000, 0, 0, 2000, 10000])
  })
  describe('complete auction', () => {
    it('account[0] should NOT be able to completeAuction', () => {
      return cta0.broadcast('completeAuction()', [], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('account[4] should NOT be able to completeAuction', () => {
      return cta0.broadcast('completeAuction()', [], {
        from: accounts[4]
      }).getConfirmation().should.be.rejectedWith(FailedTransactionError)
    })
    it('should skip minAuctionCompleteWait', (done) => {
      ultralightbeam.provider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [fracturedTokens.a0.minAuctionCompleteWait.to(amorphNumber.unsigned)],
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
    it('account[0] should be able to completeAuction', () => {
      return cta0.broadcast('completeAuction()', [], {
        from: accounts[0]
      }).getConfirmation()
    })
    testCta(1000, [0, 400, 600, 0, 0], 12, 8)
    testCurrency(8000, [980000, 0, 0, 2000, 10000])
  })
  describe('first payout', () => {
    it('account[1] should be able to payout', () => {
      return cta0.broadcast('payout()', [], {
        from: accounts[1]
      }).getConfirmation()
    })
    testCta(600, [0, 0, 600, 0, 0], 12, 8)
    testCurrency(4800, [980000, 3200, 0, 2000, 10000])
  })
  describe('second payout', () => {
    it('account[2] should be able to payout', () => {
      return cta0.broadcast('payout()', [], {
        from: accounts[2]
      }).getConfirmation()
    })
    testCta(0, [0, 0, 0, 0, 0], 12, 8)
    testCurrency(0, [980000, 3200, 4800, 2000, 10000])
  })
})
