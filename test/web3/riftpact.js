const _ = require('lodash')
const Account = require('ultralightbeam/lib/Account')
const amorphHex = require('amorph-hex')
const Web3 = require('web3')
const ganache = require('ganache-cli')
const output = require('../../output')
const daiOutput = require('./daiOutput')
const Artifactor = require('truffle-artifactor')
const Resolver = require('truffle-resolver')
const assert = require('assert')
const Bn = require('bn.js')

const artifactsDirectory = `${__dirname}/artifacts`

const artifactor = new Artifactor(artifactsDirectory)
const resolver = new Resolver({
  'working_directory': artifactsDirectory,
  'contracts_build_directory': artifactsDirectory
})
const accounts = [
  Account.generate(),
  Account.generate(),
  Account.generate(),
  Account.generate(),
  Account.generate(),
  Account.generate(),
  Account.generate()
]
const addresses = accounts.map((account) => {
  return account.address.to(amorphHex.prefixed)
})

const two = new Bn('2', 10)
const four = new Bn('4', 10)
const nine = new Bn('9', 10)
const ten = new Bn('10', 10)
const eighteen = new Bn('18', 10)
const tenThousand = ten.pow(four)
const tenE18 = ten.pow(eighteen)

const provider = ganache.provider({
  gasPrice: 20000000000,
  gasLimit: 8000000,
  blocktime: 2,
  accounts: accounts.map((account) => {
    return {
      secretKey: account.privateKey.to(amorphHex.prefixed),
      balance: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    }
  })
})

async function testRevert(func) {
  let error
  try {
    await func();
  } catch(_error) {
    error = _error
  }
  assert.equal(error.message, revertMessage)
}

const revertMessage = 'VM Exception while processing transaction: revert'

const web3 = new Web3(provider)
web3.eth.defaultAccount = addresses[0]

let OathForge
let oathforge
let RiftPact
let riftpact
let Dai
let dai

describe('OathForge Contract', async () => {
  before(() => {
    return artifactor.save({
      contractName: 'OathForge',
      abi: JSON.parse(output.contracts['OathForge.sol:OathForge'].interface),
      unlinked_binary: `0x${output.contracts['OathForge.sol:OathForge'].bytecode}`
    }).then(() => {
      OathForge = resolver.require('OathForge')
      OathForge.setProvider(provider)
    })
  })
  it('Should correctly initialize constructor values of oathForge Contract', async () => {
    oathforge = await OathForge.new('OathForge', 'OathForge', { from: addresses[0] })
    let owner = await oathforge.owner.call();
    assert.equal(owner.toLowerCase(), addresses[0]);
  });
})

describe('Dai Contract', async () => {
  before(() => {
    return artifactor.save({
      contractName: 'DAITOKEN',
      abi: JSON.parse(daiOutput.interface),
      unlinked_binary: `0x${daiOutput.bytecode}`
    }).then(() => {
      Dai = resolver.require('DAITOKEN')
      Dai.setProvider(provider)
    })
  })
  it('Should correctly initialize constructor values of Dai Token Contract', async () => {
    dai = await Dai.new(addresses[0],{ from: addresses[0] });
    let owner = await dai.owner.call();
    assert.equal(owner.toLowerCase(), addresses[0]);

  });

  it('Should issue Dai token to addresses[0],[1],[2],[3]', async () => {
    await dai.releaseTokens(addresses[0],1,{ from: addresses[0] });
    await dai.releaseTokens(addresses[1],2,{ from: addresses[0] });
    await dai.releaseTokens(addresses[2],3,{ from: addresses[0] });
    await dai.releaseTokens(addresses[3],4,{ from: addresses[0] });
    let balance1 = await dai.balanceOf(addresses[0]);
    let balance2 = await dai.balanceOf(addresses[1]);
    let balance3 = await dai.balanceOf(addresses[2]);
    let balance4 = await dai.balanceOf(addresses[3]);
    assert.equal(balance1.div(tenE18),1);
    assert.equal(balance2.div(tenE18),2);
    assert.equal(balance3.div(tenE18),3);
    assert.equal(balance4.div(tenE18),4);

  });
})

describe('RiftPact', () => {
  before(() => {
    return artifactor.save({
      contractName: 'RiftPact',
      abi: JSON.parse(output.contracts['RiftPact.sol:RiftPact'].interface),
      unlinked_binary: `0x${output.contracts['RiftPact.sol:RiftPact'].bytecode}`
    }).then(() => {
      RiftPact = resolver.require('RiftPact')
      RiftPact.setProvider(provider)
    })
  })

  it('Should Not initialize constructor values of RiftPack Contract of TokenID that is not minted from OathForge(Test Case Failed)', async () => {

    riftPact = await RiftPact.new(20,100,dai.address,oathforge.address, { from: addresses[0] });
  });

  it('Should correctly initialize constructor values of RiftPack Contract', async () => {

    riftPact = await RiftPact.new(0,100,dai.address,oathforge.address, { from: addresses[0] });
  });

  it('Should be able to check Correct DAI Token Address', async () => {

    let daiAddress = await riftPact.daiAddress();
    assert.equal(daiAddress,dai.address);

  });

  it('Should be able to check Correct oathForge Contract Address', async () => {

    let oathForgeAddress = await riftPact.oathForgeAddress();
    assert.equal(oathForgeAddress,oathforge.address);

  });

  it('Should be able to check Correct OathForgeToken ID', async () => {

    let tokenID = await riftPact.oathForgeTokenId();
    assert.equal(tokenID.toNumber(),0);

  });

  it('Should be able to check Minimum BID', async () => {

    let minBid = await riftPact.minBid();
    assert.equal(minBid.toNumber(),1);

  });

  it('Should be able to check Auction Allowed Time', async () => {

    let auctionStart = await riftPact.auctionAllowedAt();
    assert.equal(auctionStart.toNumber(),100);

  });

  it('Should Check Aucton completed or not', async () => {

    let auctionStatus = await riftPact.auctionCompletedAt();
    assert.equal(auctionStatus.toNumber(),0);
  });

  it('Should start Auction', async () => {

    let auctionStarted = await riftPact.auctionStartedAt();
    assert.equal(auctionStarted,0);
    await riftPact.startAuction({ from: addresses[0] });

  });

  it('Should check Auction Started at', async () => {
    //TODO: assertions
    let auctionStarted = await riftPact.auctionStartedAt();
    //console.log(auctionStarted.toNumber());
  });

  it('Should Approve Auction/RiftPact contract to transfer DAI tokens on the behalf of Bidder addresses[1]', async () => {

    await dai.approve(riftPact.address,tenE18,{from :  addresses[1]});
    let allowance = await dai.allowance(addresses[1],riftPact.address);
    assert.equal(allowance.div(tenE18).toNumber(),1);
  });

  it('Should participate in a Auction by addresses[1]', async () => {
    const bid = ten.pow(nine)
    let balanceAccountOneBefore = await dai.balanceOf(addresses[1]);
    assert.equal(balanceAccountOneBefore.div(tenE18).toNumber(),2);
    await riftPact.submitBid(bid,{from : addresses[1]});
    let balanceAccountOneAfter = await dai.balanceOf(addresses[1]);
    assert.equal(balanceAccountOneAfter.toString(),tenE18.mul(two).sub(bid.mul(tenTh))).toString());

  });

  it('Should be able to get Top Bid After Auction started and participation', async () => {

    let topBid = await riftPact.topBid();
    assert.equal(topBid.toNumber(),ten.pow(nine));
  });

  it('Should be able to get Top Bidder After Auction started and participation', async () => {

    let topBidder = await riftPact.topBidder();
    assert.equal(topBidder.toLowerCase(),addresses[1]);
  });

  it('Should Approve Auction/RiftPact contract to transfer DAI tokens on the behalf of Bidder addresses[2] ', async () => {

    await dai.approve(riftPact.address,tenE18,{from :  addresses[2]});
    let allowance = await dai.allowance(addresses[2],riftPact.address);
    assert.equal(allowance.div(tenE18).toNumber(),1);
  });

  it('Should participate in a Auction by addresses[2]', async () => {
    const bid = ten.pow(ten).mul(two)

    let balanceAccountTwo = await dai.balanceOf(addresses[2]);
    assert.equal(balanceAccountTwo.div(tenE18).toNumber(),3);
    await riftPact.submitBid(bid,{from : addresses[2]});
    let balanceAccountTwoLater = await dai.balanceOf(addresses[2]);
    assert.equal(balanceAccountTwoLater.toString(),balanceAccountTwo.sub(bid.mul(tenThousand)).toString());
    let balanceDaiContract = await dai.balanceOf(riftPact.address);
    assert.equal(balanceDaiContract.toString(),bid.mul(tenThousand).toString());
    let topBid = await riftPact.topBid();
    assert.equal(topBid.toString(),bid.toString());
  });

  it('Should Not be able participate in a Auction by addresses[3] by submiting bid less than minimum Bid', async () => {
    try{
      await riftPact.submitBid(new Bn('20000', 10),{from : addresses[2]});
    }catch(error){
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }
  });

  it(" Should be able to transfer Tokens ", async () => {

    let balancebefore = await riftPact.balanceOf(addresses[6]);
    assert.equal(balancebefore.toNumber(), 0, 'balance of beneficery(reciever)');
    await riftPact.transfer(addresses[6], 100, { from: addresses[0], gas: 5000000 });
    let balanceRecieverAfter = await riftPact.balanceOf.call(addresses[6]);
    assert.equal(balanceRecieverAfter.toNumber(), 100, 'balance of beneficery(reciever)');
  });

  it('Should Complete Auction', async () => {

    let auctionStatus = await riftPact.auctionCompletedAt();
    assert.equal(auctionStatus.toNumber(),0);
    await riftPact.completeAuction({
      from: addresses[1]
    });
  });

  it('Should Payout DAI Token After auction is completed', async () => {
    let balanceRiftPActInDai = await dai.balanceOf(riftPact.address);
    assert.equal(balanceRiftPActInDai.toNumber()/10**18,0.0002);
    let balanceAccountOneInDai = await dai.balanceOf(addresses[6]);
    assert.equal(balanceAccountOneInDai.toNumber(),0);
    await riftPact.payout({from : addresses[6]});
    let balanceRiftPActInDaiLater = await dai.balanceOf(riftPact.address);
    assert.equal(balanceRiftPActInDaiLater.toNumber()/10**18,0.000198);
    let balanceAccountOneInDaiLater = await dai.balanceOf(addresses[6]);
    assert.equal(balanceAccountOneInDaiLater.toNumber()/10**18,0.000002);

  });


  it('Should Payout DAI Token After auction is completed', async () => {
    let balanceRiftPActInDai = await dai.balanceOf(riftPact.address);
    assert.equal(balanceRiftPActInDai.toNumber(),198000000000000);
    let balanceAccountZeroInDai = await dai.balanceOf(addresses[0]);
    assert.equal(balanceAccountZeroInDai.toNumber()/10**18,1);
    await riftPact.payout({from : addresses[0]});
    let balanceRiftPActInDaiLater = await dai.balanceOf(riftPact.address);
    assert.equal(balanceRiftPActInDaiLater.toNumber(),0);
    let balanceAccountZeroInDaiLater = await dai.balanceOf(addresses[0]);
    assert.equal(balanceAccountZeroInDaiLater.toNumber()/10**18,1.000198);


  });

  it('Should Not be able to Complete Auction When it is already Finish', async () => {
    try{
      await riftPact.completeAuction({from : addresses[1]});
    }catch(error){
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }
    });

  it("should Approve address to spend specific token ", async () => {

    riftPact.approve(addresses[7], 100, { from: addresses[6] });
    let allowance = await riftPact.allowance.call(addresses[6], addresses[7]);
    assert.equal(allowance.toNumber(), 100, "allowance is wrong when approve");

  });

  it("should increase Approval ", async () => {

    let allowance1 = await riftPact.allowance.call(addresses[6], addresses[7]);
    assert.equal(allowance1, 100, "allowance is wrong when increase approval");
    riftPact.increaseAllowance(addresses[7], 100, { from: addresses[6] });
    let allowanceNew = await riftPact.allowance.call(addresses[6], addresses[7]);
    assert.equal(allowanceNew, 200, "allowance is wrong when increase approval done");

  });

  it("should decrease Approval ", async () => {

    let allowance1 = await riftPact.allowance.call(addresses[6], addresses[7]);
    assert.equal(allowance1, 200, "allowance is wrong when increase approval");
    riftPact.decreaseAllowance(addresses[7], 100, { from: addresses[6] });
    let allowanceNew = await riftPact.allowance.call(addresses[6], addresses[7]);
    assert.equal(allowanceNew, 100, "allowance is wrong when increase approval done");

  });

  it("should not increase Approval for Negative Tokens", async () => {

    try{
      riftPact.increaseAllowance(addresses[7], -100, { from: addresses[6] });
    }catch(error){
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }
  });

})
