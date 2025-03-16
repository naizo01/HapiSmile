// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HapiSmileToken is ERC20, Ownable {
    // トークン配布を許可されたアドレスのマッピング
    mapping(address => bool) public distributors;
    
    // イベント
    event DistributorAdded(address indexed distributor);
    event DistributorRemoved(address indexed distributor);
    event TokensDistributed(address indexed to, uint256 amount);

    constructor() ERC20("HapiSmile Token", "HAPI") Ownable(msg.sender) {
        // 初期供給量（例：1,000,000トークン）
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
    
    // ディストリビューターの追加（オーナーのみ）
    function addDistributor(address distributor) external onlyOwner {
        distributors[distributor] = true;
        emit DistributorAdded(distributor);
    }
    
    // ディストリビューターの削除（オーナーのみ）
    function removeDistributor(address distributor) external onlyOwner {
        distributors[distributor] = false;
        emit DistributorRemoved(distributor);
    }
    
    // 笑顔に応じてトークンを配布（ディストリビューターのみ）
    function distributeTokens(address to, uint256 amount) external {
        require(distributors[msg.sender], "Not authorized to distribute tokens");
        _mint(to, amount);
        emit TokensDistributed(to, amount);
    }
    
    // 追加のトークン発行（オーナーのみ）
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}