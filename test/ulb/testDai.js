const accounts = require('./accounts')
const daiStub = require('./daiStub')
const riftPactStub = require('./riftPactStub')
const Amorph = require('amorph')
const amorphNumber = require('amorph-number')
const amorphBoolean = require('amorph-boolean')

module.exports = function testCta(riftPactBalance, balances) {
  describe('dai state', () => {
    it(`riftPact should have balance of ${riftPactBalance}`, () => {
      return riftPactStub.promise.then((riftPact) => {
        return daiStub.promise.then((dai) => {
          return dai.fetch('balanceOf(address)', [riftPact.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, riftPactBalance))
        })
      })
    })
    accounts.forEach((account, index) => {
      it(`account ${index} should have balance of ${balances[index]}`, () => {
        return daiStub.promise.then((dai) => {
          return dai.fetch('balanceOf(address)', [account.address]).should.eventually.amorphEqual(Amorph.from(amorphNumber.unsigned, balances[index]))
        })
      })
    })
  })
}
