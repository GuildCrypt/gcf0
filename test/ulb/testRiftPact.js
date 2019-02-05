const accounts = require('./accounts')
const riftPactStub = require('./riftPactStub')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const amorphBoolean = require('amorph-boolean')

module.exports = function testGcf(totalSupply, balances, minBid, topBid) {
  describe('riftPact state', () => {
    it(`should have totalSupply of ${totalSupply}`, () => {
      return riftPactStub.promise.then((riftPact) => {
        return riftPact.fetch('totalSupply()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, totalSupply))
      })
    })
    accounts.forEach((account, index) => {
      let balance = balances[index] || 0
      it(`account ${index} should have balance of ${balance}`, () => {
        return riftPactStub.promise.then((riftPact) => {
          return riftPact.fetch('balanceOf(address)', [account.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, balance))
        })
      })
    })
    it(`should have top bid of ${topBid}`, () => {
      return riftPactStub.promise.then((riftPact) => {
        return riftPact.fetch('topBid()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, topBid))
      })
    })
    it(`should have min bid of ${minBid}`, () => {
      return riftPactStub.promise.then((riftPact) => {
        return riftPact.fetch('minBid()', []).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, minBid))
      })
    })
  })
}
