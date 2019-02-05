const accounts = require('./accounts')
const currencyStub = require('./currencyStub')
const riftPactStub = require('./riftPactStub')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const amorphBoolean = require('amorph-boolean')

module.exports = function testCta(riftPactBalance, balances) {
  describe('currency state', () => {
    it(`riftPact should have balance of ${riftPactBalance}`, () => {
      return riftPactStub.promise.then((riftPact) => {
        return currencyStub.promise.then((currency) => {
          return currency.fetch('balanceOf(address)', [riftPact.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, riftPactBalance))
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
