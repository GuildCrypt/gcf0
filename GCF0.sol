pragma solidity ^0.4.25;

import "OathForge.sol";
import "ERC721.sol";
import "ERC20.sol";
import "math/SafeMath.sol";

/// @title GCF0: NFT Token Fracturizer
/// @author GuildCrypt
contract GCF0 is ERC20 {

  using SafeMath for uint256;

  address public currencyAddress;
  address public oathForgeAddress;
  uint256 public oathForgeTokenId;
  uint256 public auctionAllowedAt;
  uint256 private _sunsetInitiatedAt;

  uint256 public sunsetLength;
  uint256 public sunsetBuffer;
  uint256 public minAuctionCompleteWait;

  uint256 public auctionStartedAt;
  uint256 public auctionCompletedAt;
  uint256 public minBid = 1;
  uint256 public minBidDeltaMilliperun;

  uint256 public topBid;
  address public topBidder;
  uint256 public topBidSubmittedAt;


  /// @param _currencyAddress The address of the ERC20 contract used as a currency during auctioning
  /// @param _oathForgeAddress The address of the OathForge contract that has the token
  /// @param _oathForgeTokenId The id of the token on the OathForge contract
  /// @param _totalSupply Number of fractured tokens
  /// @param _auctionAllowedAt Time after which anyone can start an auction
  /// @param _sunsetBuffer Amount of time before a sunset period ends in which anyone can start an auction
  /// @param _minAuctionCompleteWait Amount of time between the last bid and when an auction can be completed
  /// @param _minBidDeltaMilliperun Minimum difference between a bid and the next bid. Expressed in 1/1000ths (.1%).
  constructor(
    address _currencyAddress,
    address _oathForgeAddress,
    uint256 _oathForgeTokenId,
    uint256 _totalSupply,
    uint256 _auctionAllowedAt,
    uint256 _sunsetBuffer,
    uint256 _minAuctionCompleteWait,
    uint256 _minBidDeltaMilliperun
  ) public {
    currencyAddress = _currencyAddress;
    oathForgeAddress = _oathForgeAddress;
    oathForgeTokenId = _oathForgeTokenId;
    auctionAllowedAt = _auctionAllowedAt;
    sunsetLength = OathForge(_oathForgeAddress).sunsetLength(_oathForgeTokenId);
    sunsetBuffer = _sunsetBuffer;
    minAuctionCompleteWait = _minAuctionCompleteWait;
    minBidDeltaMilliperun = _minBidDeltaMilliperun;

    _mint(msg.sender, _totalSupply);
  }

  /// @dev Get `sunsetInitiatedAt` of the `OathForge` token
  function sunsetInitiatedAt() public view returns(uint256) {
    return OathForge(oathForgeAddress).sunsetInitiatedAt(oathForgeTokenId);
  }

  /// @dev Determine if in sunset buffer period (and thus anyone can start an auction)
  function isInSunsetBufferPeriod() public view returns(bool) {
    return (sunsetInitiatedAt() + sunsetLength - sunsetBuffer) > now;
  }

  /// @dev Start an auction
  function startAuction(uint256) public {
    require(auctionStartedAt == 0);
    require(
      auctionAllowedAt < now
      || isInSunsetBufferPeriod()
    );
    auctionStartedAt = now;
  }

  /// @dev Submit a bid. Must have sufficient funds approved in `currency` contract
  /// @param _bid Amount in `currency` to bid
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

  /// @dev Complete auction
  function completeAuction() public {
    require(auctionCompletedAt == 0);
    require(topBid > 0);
    require((topBidSubmittedAt + minAuctionCompleteWait) < now);
    auctionCompletedAt = now;
  }

  /// @dev Payout `currency` after auction completed
  function payout() public {
    require(balanceOf(msg.sender) > 0);
    require(auctionCompletedAt > 0);
    require(ERC20(currencyAddress).transfer(msg.sender, balanceOf(msg.sender) * topBid));
    _burn(msg.sender, balanceOf(msg.sender));
  }


}
