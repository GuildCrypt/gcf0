# RiftPact: OathForge Token Fracturizer
Author: GuildCrypt


Documentation generated by [@GuildCrypt/solspecdown](https://github.com/GuildCrypt/solspecdown)


| Name | Type |
|---|---|
| [`allowance(address,address)`](#allowance(address,address)) | function (constant) |
| [`constructor(address,uint256,uint256,address,uint256,uint256,uint256)`](#constructor(address,uint256,uint256,address,uint256,uint256,uint256)) | constructor |
| [`Approval(address,address,uint256)`](#Approval(address,address,uint256)) | event |
| [`approve(address,uint256)`](#approve(address,uint256)) | function (non-constant) |
| [`auctionAllowedAt()`](#auctionAllowedAt()) | function (constant) |
| [`AuctionCompleted(address,uint256)`](#AuctionCompleted(address,uint256)) | event |
| [`auctionCompletedAt()`](#auctionCompletedAt()) | function (constant) |
| [`AuctionStarted()`](#AuctionStarted()) | event |
| [`auctionStartedAt()`](#auctionStartedAt()) | function (constant) |
| [`balanceOf(address)`](#balanceOf(address)) | function (constant) |
| [`Bid(address,uint256)`](#Bid(address,uint256)) | event |
| [`completeAuction()`](#completeAuction()) | function (non-constant) |
| [`currencyAddress()`](#currencyAddress()) | function (constant) |
| [`decreaseAllowance(address,uint256)`](#decreaseAllowance(address,uint256)) | function (non-constant) |
| [`increaseAllowance(address,uint256)`](#increaseAllowance(address,uint256)) | function (non-constant) |
| [`isBlacklisted(address)`](#isBlacklisted(address)) | function (constant) |
| [`isOwner()`](#isOwner()) | function (constant) |
| [`minAuctionCompleteWait()`](#minAuctionCompleteWait()) | function (constant) |
| [`minBid()`](#minBid()) | function (constant) |
| [`minBidDeltaPermille()`](#minBidDeltaPermille()) | function (constant) |
| [`owner()`](#owner()) | function (constant) |
| [`OwnershipTransferred(address,address)`](#OwnershipTransferred(address,address)) | event |
| [`parentToken()`](#parentToken()) | function (constant) |
| [`parentTokenId()`](#parentTokenId()) | function (constant) |
| [`PayoutTokenHolder(address,uint256)`](#PayoutTokenHolder(address,uint256)) | event |
| [`payoutTokenHolder(address)`](#payoutTokenHolder(address)) | function (non-constant) |
| [`payoutWinner()`](#payoutWinner()) | function (non-constant) |
| [`PayoutWinner()`](#PayoutWinner()) | event |
| [`renounceOwnership()`](#renounceOwnership()) | function (non-constant) |
| [`setIsBlacklisted(address,bool)`](#setIsBlacklisted(address,bool)) | function (non-constant) |
| [`startAuction()`](#startAuction()) | function (non-constant) |
| [`submitBid(uint256)`](#submitBid(uint256)) | function (non-constant) |
| [`topBid()`](#topBid()) | function (constant) |
| [`topBidder()`](#topBidder()) | function (constant) |
| [`totalSupply()`](#totalSupply()) | function (constant) |
| [`Transfer(address,address,uint256)`](#Transfer(address,address,uint256)) | event |
| [`transfer(address,uint256)`](#transfer(address,uint256)) | function (non-constant) |
| [`transferFrom(address,address,uint256)`](#transferFrom(address,address,uint256)) | function (non-constant) |
| [`transferOwnership(address)`](#transferOwnership(address)) | function (non-constant) |
#### <a name="allowance(address,address)"></a> `allowance(address,address)`
Function to check the amount of tokens that an owner allowed to a spender.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` | address The address which owns the funds. |
| `1` | `address` | `spender` | address The address which will spend the funds. |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="constructor(address,uint256,uint256,address,uint256,uint256,uint256)"></a> `constructor(address,uint256,uint256,address,uint256,uint256,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `__parentToken` |  |
| `1` | `uint256` | `__parentTokenId` |  |
| `2` | `uint256` | `__totalSupply` |  |
| `3` | `address` | `__currencyAddress` |  |
| `4` | `uint256` | `__auctionAllowedAt` |  |
| `5` | `uint256` | `__minAuctionCompleteWait` |  |
| `6` | `uint256` | `__minBidDeltaPermille` |  |
---
#### <a name="Approval(address,address,uint256)"></a> `Approval(address,address,uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `owner` |  | `true` |
| `1` | `address` | `spender` |  | `true` |
| `2` | `uint256` | `value` |  | `false` |
---
#### <a name="approve(address,uint256)"></a> `approve(address,uint256)`
Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `spender` | The address which will spend the funds. |
| `1` | `uint256` | `value` | The amount of tokens to be spent. |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="auctionAllowedAt()"></a> `auctionAllowedAt()`
Returns the timestamp at which anyone can start an auction by calling [`startAuction()`](#startAuction())
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="AuctionCompleted(address,uint256)"></a> `AuctionCompleted(address,uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `winner` |  | `false` |
| `1` | `uint256` | `bid` |  | `false` |
---
#### <a name="auctionCompletedAt()"></a> `auctionCompletedAt()`
Returns the timestamp at which an auction was completed or 0 if no auction has been completed
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="AuctionStarted()"></a> `AuctionStarted()`
---
#### <a name="auctionStartedAt()"></a> `auctionStartedAt()`
Returns the timestamp at which an auction was started or 0 if no auction has been started
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="balanceOf(address)"></a> `balanceOf(address)`
Gets the balance of the specified address.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` | The address to query the balance of. |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="Bid(address,uint256)"></a> `Bid(address,uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `bidder` |  | `false` |
| `1` | `uint256` | `bid` |  | `false` |
---
#### <a name="completeAuction()"></a> `completeAuction()`
Complete auction
---
#### <a name="currencyAddress()"></a> `currencyAddress()`
Returns the currency contract address.
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="decreaseAllowance(address,uint256)"></a> `decreaseAllowance(address,uint256)`
Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `spender` | The address which will spend the funds. |
| `1` | `uint256` | `subtractedValue` | The amount of tokens to decrease the allowance by. |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="increaseAllowance(address,uint256)"></a> `increaseAllowance(address,uint256)`
Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `spender` | The address which will spend the funds. |
| `1` | `uint256` | `addedValue` | The amount of tokens to increase the allowance by. |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="isBlacklisted(address)"></a> `isBlacklisted(address)`
Returns if an address is blacklisted
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `to` | The address to check |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="isOwner()"></a> `isOwner()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="minAuctionCompleteWait()"></a> `minAuctionCompleteWait()`
Returns the minimum amount of time (in seconds) between when a bid is placed and when an auction can be completed.
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="minBid()"></a> `minBid()`
Returns the minimum bid in currency
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="minBidDeltaPermille()"></a> `minBidDeltaPermille()`
Returns the minimum increase (expressed as 1/1000ths of the current bid) that a subsequent bid must be
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="owner()"></a> `owner()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="OwnershipTransferred(address,address)"></a> `OwnershipTransferred(address,address)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `previousOwner` |  | `true` |
| `1` | `address` | `newOwner` |  | `true` |
---
#### <a name="parentToken()"></a> `parentToken()`
Returns the OathForge contract address. **UI should check for phishing.**.
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="parentTokenId()"></a> `parentTokenId()`
Returns the OathForge token id. **Does not imply RiftPact has ownership over token.**
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="PayoutTokenHolder(address,uint256)"></a> `PayoutTokenHolder(address,uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `tokenHolder` |  | `false` |
| `1` | `uint256` | `balance` |  | `false` |
---
#### <a name="payoutTokenHolder(address)"></a> `payoutTokenHolder(address)`
Payout token holder (with currency) after auction completed
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `tokenHolder` |  |
---
#### <a name="payoutWinner()"></a> `payoutWinner()`
Payout winner (with parent token) after auction completed
---
#### <a name="PayoutWinner()"></a> `PayoutWinner()`
---
#### <a name="renounceOwnership()"></a> `renounceOwnership()`
Allows the current owner to relinquish control of the contract.
---
#### <a name="setIsBlacklisted(address,bool)"></a> `setIsBlacklisted(address,bool)`
Set if an address is blacklisted
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `to` | The address to change |
| `1` | `bool` | `__isBlacklisted` | True if the address should be blacklisted, false otherwise |
---
#### <a name="startAuction()"></a> `startAuction()`
Start an auction
---
#### <a name="submitBid(uint256)"></a> `submitBid(uint256)`
Submit a bid. Must have sufficient funds approved in currency contract (bid * totalSupply).
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `bid` | Bid in currency |
---
#### <a name="topBid()"></a> `topBid()`
Returns the top bid or 0 if no bids have been placed
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="topBidder()"></a> `topBidder()`
Returns the top bidder or `address(0)` if no bids have been placed
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="totalSupply()"></a> `totalSupply()`
Total number of tokens in existence
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="Transfer(address,address,uint256)"></a> `Transfer(address,address,uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `from` |  | `true` |
| `1` | `address` | `to` |  | `true` |
| `2` | `uint256` | `value` |  | `false` |
---
#### <a name="transfer(address,uint256)"></a> `transfer(address,uint256)`
Transfer token for a specified address
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `to` | The address to transfer to. |
| `1` | `uint256` | `value` | The amount to be transferred. |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="transferFrom(address,address,uint256)"></a> `transferFrom(address,address,uint256)`
Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `from` | address The address which you want to send tokens from |
| `1` | `address` | `to` | address The address which you want to transfer to |
| `2` | `uint256` | `value` | uint256 the amount of tokens to be transferred |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="transferOwnership(address)"></a> `transferOwnership(address)`
Allows the current owner to transfer control of the contract to a newOwner.
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `newOwner` | The address to transfer ownership to. |
---