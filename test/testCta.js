const accounts = require('./accounts')
const cta0Stub = require('./cta0Stub')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const amorphBoolean = require('amorph-boolean')

module.exports = function testCta(totalSupply, balances, hasControls, minBid, topBid) {
  describe('cta state', () => {
    it(`should have totalSupply of ${totalSupply}`, () => {
      return cta0Stub.promise.then((cta0) => {
        return cta0.fetch('totalSupply()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, totalSupply))
      })
    })
    accounts.forEach((account, index) => {
      it(`account ${index} should have balance of ${balances[index]}`, () => {
        return cta0Stub.promise.then((cta0) => {
          return cta0.fetch('balanceOf(address)', [account.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, balances[index]))
        })
      })
    })
    accounts.forEach((account, index) => {
      it(`account ${index} ${hasControls[index] ? 'should' : 'should NOT' } have control`, () => {
        return cta0Stub.promise.then((cta0) => {
          return cta0.fetch('hasControl(address)', [account.address]).should.eventually.amorphEqual(Amorph.from(amorphBoolean, hasControls[index]))
        })
      })
    })
    it(`should have top bid of ${topBid}`, () => {
      return cta0Stub.promise.then((cta0) => {
        return cta0.fetch('topBid()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, topBid))
      })
    })
    it(`should have min bid of ${minBid}`, () => {
      return cta0Stub.promise.then((cta0) => {
        return cta0.fetch('minBid()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, minBid))
      })
    })
  })
}
