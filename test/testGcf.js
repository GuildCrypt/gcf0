const accounts = require('./accounts')
const gcf0Stub = require('./gcf0Stub')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const amorphBoolean = require('amorph-boolean')

module.exports = function testGcf(totalSupply, balances, minBid, topBid) {
  describe('gcf state', () => {
    it(`should have totalSupply of ${totalSupply}`, () => {
      return gcf0Stub.promise.then((gcf0) => {
        return gcf0.fetch('totalSupply()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, totalSupply))
      })
    })
    accounts.forEach((account, index) => {
      it(`account ${index} should have balance of ${balances[index]}`, () => {
        return gcf0Stub.promise.then((gcf0) => {
          return gcf0.fetch('balanceOf(address)', [account.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, balances[index]))
        })
      })
    })
    it(`should have top bid of ${topBid}`, () => {
      return gcf0Stub.promise.then((gcf0) => {
        return gcf0.fetch('topBid()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, topBid))
      })
    })
    it(`should have min bid of ${minBid}`, () => {
      return gcf0Stub.promise.then((gcf0) => {
        return gcf0.fetch('minBid()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, minBid))
      })
    })
  })
}
