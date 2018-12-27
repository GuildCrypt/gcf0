pragma solidity ^0.4.25;

import "GC0.sol";
import "ERC721.sol";
import "ERC20.sol";
import "math/SafeMath.sol";

contract CTA0 is ERC20 {

  using SafeMath for uint256;

  address public currencyAddress;
  address public gc0Address;
  uint256 public gc0TokenId;
  uint256 private _sunsetInitiatedAt;

  uint256 public sunsetLength;
  uint256 public sunsetBuffer;
  uint256 public minAuctionCompleteWait;

  uint256 public auctionStartedAt;
  uint256 public auctionCompletedAt;
  uint256 public minBid;
  uint256 public minBidDeltaMilliperun;

  uint256 public topBid;
  address public topBidder;
  uint256 public topBidSubmittedAt;

  constructor(
    address _currencyAddress,
    address _gc0Address,
    uint256 _gc0TokenId,
    uint256 _totalSupply,
    uint256 _sunsetBuffer,
    uint256 _minAuctionCompleteWait,
    uint256 _minBidDeltaMilliperun
  ) public {
    currencyAddress = _currencyAddress;
    gc0Address = _gc0Address;
    gc0TokenId = _gc0TokenId;
    sunsetLength = GC0(_gc0Address).sunsetLength(_gc0TokenId);
    sunsetBuffer = _sunsetBuffer;
    minAuctionCompleteWait = _minAuctionCompleteWait;
    minBidDeltaMilliperun = _minBidDeltaMilliperun;

    _mint(msg.sender, _totalSupply);
  }

  function hasControl(address _address) public view returns(bool) {
    return balanceOf(_address) > (totalSupply() - balanceOf(_address));
  }

  function hasGc0TokenOwnership() public view returns(bool) {
    return GC0(gc0Address).ownerOf(gc0TokenId) == address(this);
  }

  function sunsetInitiatedAt() public view returns(uint256) {
    return GC0(gc0Address).sunsetInitiatedAt(gc0TokenId);
  }

  function isInSunsetBufferPeriod() public view returns(bool) {
    return (sunsetInitiatedAt() + sunsetLength - sunsetBuffer) > now;
  }

  function startAuction(uint256 _minBid) public {
    require(auctionStartedAt == 0);
    require(
      hasControl(msg.sender)
      || isInSunsetBufferPeriod()
    );
    auctionStartedAt = now;
    minBid = _minBid;
  }

  function cancelAuction() public {
    require(hasControl(msg.sender));
    require(isInSunsetBufferPeriod() == false);
    require(auctionStartedAt != 0);
    require(auctionCompletedAt == 0);
    require(topBidder == address(0));
    auctionStartedAt = 0;
    minBid = 0; //TODO: is this necessary?
  }

  function submitBid(uint256 _bid) public {
    require(auctionStartedAt > 0);
    require(auctionCompletedAt == 0);
    require (_bid >= minBid);
    if (topBidder != address(0)) {
      require(ERC20(currencyAddress).transfer(topBidder, topBid * totalSupply()));
    }
    require(ERC20(currencyAddress).transferFrom(msg.sender, address(this), _bid * totalSupply()));
    topBid = _bid;
    topBidder = msg.sender;
    topBidSubmittedAt = now;

    uint256 _minBidDeltaNumerator = _bid * minBidDeltaMilliperun;
    uint256 _minBidRoundUp = 0;

    if(_minBidDeltaNumerator % 1000 > 0) {
      _minBidRoundUp = 1;
    }

    minBid =  (
      _bid + _minBidRoundUp + (
      (
        _minBidDeltaNumerator / 1000
      )
     )
    );
  }

  function completeAuction() public {
    require(auctionCompletedAt == 0);
    require(topBid > 0);
    require((topBidSubmittedAt + minAuctionCompleteWait) < now);
    auctionCompletedAt = now;
  }

  function payout() public {
    require(balanceOf(msg.sender) > 0);
    require(auctionCompletedAt > 0);

    require(ERC20(currencyAddress).transfer(msg.sender, balanceOf(msg.sender) * topBid));
    _burn(msg.sender, balanceOf(msg.sender));
  }


}
