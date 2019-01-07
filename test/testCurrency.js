const accounts = require('./accounts')
const currencyStub = require('./currencyStub')
const riftPactStub = require('./riftPactStub')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const amorphBoolean = require('amorph-boolean')

module.exports = function testCta(ctaBalance, balances) {
  describe('currency state', () => {
    it(`cta0 should have balance of ${ctaBalance}`, () => {
      return riftPactStub.promise.then((cta0) => {
        return currencyStub.promise.then((currency) => {
          return currency.fetch('balanceOf(address)', [cta0.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, ctaBalance))
        })
      })
    })
    accounts.forEach((account, index) => {
      it(`account ${index} should have balance of ${balances[index]}`, () => {
        return currencyStub.promise.then((currency) => {
          return currency.fetch('balanceOf(address)', [account.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, balances[index]))
        })
      })
    })
  })
}
