// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MineToken is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can do ....");
        _;
    }

    constructor(
        uint256 _cap,
        uint _supply,
        uint256 _reward,
        string memory _tokenName,
        string memory _tokenSymbol
    )
        ERC20(_tokenName, _tokenSymbol)
        ERC20Capped(_cap * (10 ** decimals()) )
    {
        owner = payable(msg.sender);
        blockReward = _reward * (10 ** decimals());
        _mint(msg.sender, _supply * (10 ** decimals()));
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20Capped, ERC20) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    function SetBlockReward(uint256 _reward) public onlyOwner {
        blockReward = _reward * (10 ** decimals());
    }

    function mintMinerReward() internal  {
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(address _from, address _to, uint256 _value) internal virtual override{
        if(_from != address(0) && _to != block.coinbase && block.coinbase != address(0)){
            mintMinerReward();
        }
        super._beforeTokenTransfer(_from, _to, _value);
    }

    function destroy() public onlyOwner{
        selfdestruct(owner);
        owner.transfer(address(this).balance);
    }
}
