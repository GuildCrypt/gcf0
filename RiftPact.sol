pragma solidity ^0.4.25;

import "OathForge.sol";
import "ERC721.sol";
import "ERC20.sol";
import "math/SafeMath.sol";

/// @title RiftPact: OathForge Token Fracturizer
/// @author GuildCrypt
contract RiftPact is ERC20 {

  using SafeMath for uint256;

  uint256 private _parentTokenId;
  uint256 private _auctionAllowedAt;
  address private _currencyAddress;
  address private _parentToken;
  uint256 private _minAuctionCompleteWait;
  uint256 private _minBidDeltaPermille;

  uint256 private _auctionStartedAt;
  uint256 private _auctionCompletedAt;

  uint256 private _minBid = 1;
  uint256 private _topBid;
  address private _topBidder;
  uint256 private _topBidSubmittedAt;

  /// @param __parentTokenId The id of the token on the OathForge contract
  /// @param __auctionAllowedAt The timestamp at which anyone can start an auction
  /// @param __currencyAddress The address of the DAI contract
  /// @param __parentToken The address of the OathForge contract
  /// @param __minAuctionCompleteWait The minimum amount of time (in seconds) between when a bid is placed and when an auction can be completed
  /// @param __minBidDeltaPermille The minimum increase (expressed as 1/1000ths of the current bid) that a subsequent bid must be
  /// @param __totalSupply The total supply
  constructor(
    uint256 __parentTokenId,
    uint256 __auctionAllowedAt,
    address __currencyAddress,
    address __parentToken,
    uint256 __minAuctionCompleteWait,
    uint256 __minBidDeltaPermille,
    uint256 __totalSupply
  ) public {
    _parentTokenId = __parentTokenId;
    _auctionAllowedAt = __auctionAllowedAt;

    _currencyAddress = __currencyAddress;
    _parentToken = __parentToken;
    _minAuctionCompleteWait = __minAuctionCompleteWait;
    _minBidDeltaPermille = __minBidDeltaPermille;

    _mint(msg.sender, __totalSupply);
  }

  /// @dev Emits when an auction is started
  event AuctionStarted();

  /// @dev Emits when the auction is completed
  /// @param bid The final bid price of the auction
  /// @param winner The winner of the auction
  event AuctionCompleted(address winner, uint256 bid);

  /// @dev Emits when there is a bid
  /// @param bid The bid
  /// @param bidder The address of the bidder
  event Bid(address bidder, uint256 bid);

  /// @dev Emits when there is a payout
  /// @param to The address of the account paying out
  /// @param balance The balance of `to` prior to the paying out
  event Payout(address to, uint256 balance);

  /// @dev Returns the DAI contract address.
  function currencyAddress() external view returns(address) {
    return _currencyAddress;
  }

  /// @dev Returns the OathForge contract address.
  function parentToken() external view returns(address) {
    return _parentToken;
  }

  /// @dev Returns the minimum amount of time (in seconds) between when a bid is placed and when an auction can be completed.
  function minAuctionCompleteWait() external view returns(uint256) {
    return _minAuctionCompleteWait;
  }

  /// @dev Returns the minimum increase (expressed as 1/1000ths of the current bid) that a subsequent bid must be
  function minBidDeltaPermille() external view returns(uint256) {
    return _minBidDeltaPermille;
  }

  /// @dev Returns the OathForge token id. **Does not imply RiftPact has ownership over token.**
  function parentTokenId() external view returns(uint256) {
    return _parentTokenId;
  }

  /// @dev Returns the timestamp at which anyone can start an auction by calling [`startAuction()`](#startAuction())
  function auctionAllowedAt() external view returns(uint256) {
    return _auctionAllowedAt;
  }

  /// @dev Returns the minimum bid in attoDAI (10^-18 DAI).
  function minBid() external view returns(uint256) {
    return _minBid;
  }

  /// @dev Returns the timestamp at which an auction was started or 0 if no auction has been started
  function auctionStartedAt() external view returns(uint256) {
    return _auctionStartedAt;
  }

  /// @dev Returns the timestamp at which an auction was completed or 0 if no auction has been completed
  function auctionCompletedAt() external view returns(uint256) {
    return _auctionCompletedAt;
  }

  /// @dev Returns the top bid or 0 if no bids have been placed
  function topBid() external view returns(uint256) {
    return _topBid;
  }

  /// @dev Returns the top bidder or `address(0)` if no bids have been placed
  function topBidder() external view returns(address) {
    return _topBidder;
  }

  /// @dev Start an auction
  function startAuction() external {
    require(_auctionStartedAt == 0);
    require(
      (now >= _auctionAllowedAt)
      || (OathForge(_parentToken).sunsetInitiatedAt(_parentTokenId) > 0)
    );
    emit AuctionStarted();
    _auctionStartedAt = now;
  }

  /// @dev Submit a bid. Must have sufficient funds approved in `DAI` contract (bid * totalSupply).
  /// @param bid Bid in attoDAI (10^-18 DAI)
  function submitBid(uint256 bid) external {
    require(_auctionStartedAt > 0);
    require(_auctionCompletedAt == 0);
    require (bid >= _minBid);
    emit Bid(msg.sender, bid);

    uint256 _totalSupply = totalSupply();

    if (_topBidder != address(0)) {
      require(ERC20(_currencyAddress).transfer(_topBidder, _topBid * _totalSupply));
    }
    require(ERC20(_currencyAddress).transferFrom(msg.sender, address(this), bid * _totalSupply));

    _topBid = bid;
    _topBidder = msg.sender;
    _topBidSubmittedAt = now;

    uint256 minBidNumerator = bid * _minBidDeltaPermille;
    uint256 minBidDelta = minBidNumerator / 1000;
    uint256 minBidRoundUp = 0;

    if((bid * _minBidDeltaPermille) % 1000 > 0) {
      minBidRoundUp = 1;
    }

    _minBid =  bid + minBidDelta + minBidRoundUp;
  }

  /// @dev Complete auction
  function completeAuction() external {
    require(_auctionCompletedAt == 0);
    require(_topBid > 0);
    require((_topBidSubmittedAt + _minAuctionCompleteWait) < now);
    emit AuctionCompleted(_topBidder, _topBid);
    _auctionCompletedAt = now;
  }

  /// @dev Payout `currency` after auction completed
  function payout() external {
    uint256 balance = balanceOf(msg.sender);
    require(balance > 0);
    require(_auctionCompletedAt > 0);
    emit Payout(msg.sender, balance);
    require(ERC20(_currencyAddress).transfer(msg.sender, balance * _topBid));
    _burn(msg.sender, balance);
  }


}
