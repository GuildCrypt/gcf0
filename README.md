# GCF0: NFT Token Fracturizer
Author: GuildCrypt


| Name | Type |
|---|---|
| [`allowance(address,address)`](#allowance(address,address)) | function (constant) |
| [`Approval(address,address,uint256)`](#Approval(address,address,uint256)) | event |
| [`approve(address,uint256)`](#approve(address,uint256)) | function (non-constant) |
| [`constructor(address,address,uint256,uint256,uint256,uint256,uint256,uint256)`](#constructor(address,address,uint256,uint256,uint256,uint256,uint256,uint256)) | constructor |
| [`auctionAllowedAt()`](#auctionAllowedAt()) | function (constant) |
| [`auctionCompletedAt()`](#auctionCompletedAt()) | function (constant) |
| [`auctionStartedAt()`](#auctionStartedAt()) | function (constant) |
| [`balanceOf(address)`](#balanceOf(address)) | function (constant) |
| [`completeAuction()`](#completeAuction()) | function (non-constant) |
| [`currencyAddress()`](#currencyAddress()) | function (constant) |
| [`decreaseAllowance(address,uint256)`](#decreaseAllowance(address,uint256)) | function (non-constant) |
| [`gc0Address()`](#gc0Address()) | function (constant) |
| [`gc0TokenId()`](#gc0TokenId()) | function (constant) |
| [`increaseAllowance(address,uint256)`](#increaseAllowance(address,uint256)) | function (non-constant) |
| [`isInSunsetBufferPeriod()`](#isInSunsetBufferPeriod()) | function (constant) |
| [`minAuctionCompleteWait()`](#minAuctionCompleteWait()) | function (constant) |
| [`minBid()`](#minBid()) | function (constant) |
| [`minBidDeltaMilliperun()`](#minBidDeltaMilliperun()) | function (constant) |
| [`payout()`](#payout()) | function (non-constant) |
| [`startAuction(uint256)`](#startAuction(uint256)) | function (non-constant) |
| [`submitBid(uint256)`](#submitBid(uint256)) | function (non-constant) |
| [`sunsetBuffer()`](#sunsetBuffer()) | function (constant) |
| [`sunsetInitiatedAt()`](#sunsetInitiatedAt()) | function (constant) |
| [`sunsetLength()`](#sunsetLength()) | function (constant) |
| [`topBid()`](#topBid()) | function (constant) |
| [`topBidder()`](#topBidder()) | function (constant) |
| [`topBidSubmittedAt()`](#topBidSubmittedAt()) | function (constant) |
| [`totalSupply()`](#totalSupply()) | function (constant) |
| [`Transfer(address,address,uint256)`](#Transfer(address,address,uint256)) | event |
| [`transfer(address,uint256)`](#transfer(address,uint256)) | function (non-constant) |
| [`transferFrom(address,address,uint256)`](#transferFrom(address,address,uint256)) | function (non-constant) |
#### <a name="allowance(address,address)"></a> `allowance(address,address)`
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
#### <a name="Approval(address,address,uint256)"></a> `Approval(address,address,uint256)`
##### Inputs
|  | Type | Name | Description | Indexed? |
|---|---|---|---|---|
| `0` | `address` | `owner` |  | `true` |
| `1` | `address` | `spender` |  | `true` |
| `2` | `uint256` | `value` |  | `false` |
---
#### <a name="approve(address,uint256)"></a> `approve(address,uint256)`
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
#### <a name="constructor(address,address,uint256,uint256,uint256,uint256,uint256,uint256)"></a> `constructor(address,address,uint256,uint256,uint256,uint256,uint256,uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `_currencyAddress` |  |
| `1` | `address` | `_gc0Address` |  |
| `2` | `uint256` | `_gc0TokenId` |  |
| `3` | `uint256` | `_totalSupply` |  |
| `4` | `uint256` | `_auctionAllowedAt` |  |
| `5` | `uint256` | `_sunsetBuffer` |  |
| `6` | `uint256` | `_minAuctionCompleteWait` |  |
| `7` | `uint256` | `_minBidDeltaMilliperun` |  |
---
#### <a name="auctionAllowedAt()"></a> `auctionAllowedAt()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="auctionCompletedAt()"></a> `auctionCompletedAt()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="auctionStartedAt()"></a> `auctionStartedAt()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="balanceOf(address)"></a> `balanceOf(address)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` | `owner` | The address to query the balance of. |
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="completeAuction()"></a> `completeAuction()`
---
#### <a name="currencyAddress()"></a> `currencyAddress()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="decreaseAllowance(address,uint256)"></a> `decreaseAllowance(address,uint256)`
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
#### <a name="gc0Address()"></a> `gc0Address()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="gc0TokenId()"></a> `gc0TokenId()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="increaseAllowance(address,uint256)"></a> `increaseAllowance(address,uint256)`
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
#### <a name="isInSunsetBufferPeriod()"></a> `isInSunsetBufferPeriod()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `bool` |  |  |
---
#### <a name="minAuctionCompleteWait()"></a> `minAuctionCompleteWait()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="minBid()"></a> `minBid()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="minBidDeltaMilliperun()"></a> `minBidDeltaMilliperun()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="payout()"></a> `payout()`
---
#### <a name="startAuction(uint256)"></a> `startAuction(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="submitBid(uint256)"></a> `submitBid(uint256)`
##### Inputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` | `_bid` | Amount in `currency` to bid |
---
#### <a name="sunsetBuffer()"></a> `sunsetBuffer()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="sunsetInitiatedAt()"></a> `sunsetInitiatedAt()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="sunsetLength()"></a> `sunsetLength()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="topBid()"></a> `topBid()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="topBidder()"></a> `topBidder()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `address` |  |  |
---
#### <a name="topBidSubmittedAt()"></a> `topBidSubmittedAt()`
##### Outputs
|  | Type | Name | Description |
|---|---|---|---|
| `0` | `uint256` |  |  |
---
#### <a name="totalSupply()"></a> `totalSupply()`
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