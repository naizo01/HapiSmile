// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./HappySmileToken.sol";

contract HappySmileNFT is ERC721URIStorage, Ownable {
    // Countersの代わりに単純なuint256を使用
    uint256 private _tokenIds;
    
    // HappySmileトークンのコントラクト
    HappySmileToken public hapiToken;
    
    // NFTタイプごとの価格設定
    mapping(uint256 => uint256) public nftPrices;
    
    // NFTタイプごとのメタデータURI
    mapping(uint256 => string) public nftTypeURIs;
    
    // NFTタイプ
    uint256 public constant LIMITED_VIDEO_NFT = 1; // 限定動画NFT (10トークン)
    uint256 public constant COLLECTION_NFT = 2;    // コレクションNFT (50トークン)
    uint256 public constant EVENT_NFT = 3;         // イベント参加NFT (100トークン)
    
    // イベント
    event NFTMinted(address indexed owner, uint256 indexed tokenId, uint256 nftType);
    event NFTPriceUpdated(uint256 nftType, uint256 price);
    
    constructor(address _tokenAddress) ERC721("HappySmile NFT", "HAPINFT") Ownable(msg.sender) {
        hapiToken = HappySmileToken(_tokenAddress);
        
        // 初期価格設定
        nftPrices[LIMITED_VIDEO_NFT] = 10 * 10 ** 18; // 10トークン
        nftPrices[COLLECTION_NFT] = 50 * 10 ** 18;    // 50トークン
        nftPrices[EVENT_NFT] = 100 * 10 ** 18;        // 100トークン
        
        // 初期メタデータURI設定
        nftTypeURIs[LIMITED_VIDEO_NFT] = "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/limited-video";
        nftTypeURIs[COLLECTION_NFT] = "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/collection";
        nftTypeURIs[EVENT_NFT] = "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/event";
    }
    
    // NFT価格の更新（オーナーのみ）
    function updateNFTPrice(uint256 nftType, uint256 price) external onlyOwner {
        require(nftType >= 1 && nftType <= 3, "Invalid NFT type");
        nftPrices[nftType] = price;
        emit NFTPriceUpdated(nftType, price);
    }
    
    // NFTタイプのメタデータURIの更新（オーナーのみ）
    function updateNFTTypeURI(uint256 nftType, string memory uri) external onlyOwner {
        require(nftType >= 1 && nftType <= 3, "Invalid NFT type");
        nftTypeURIs[nftType] = uri;
    }
    
    // トークンを使用してNFTをミント
    function mintNFT(uint256 nftType) external returns (uint256) {
        require(nftType >= 1 && nftType <= 3, "Invalid NFT type");
        uint256 price = nftPrices[nftType];
        
        // トークンの転送
        require(hapiToken.transferFrom(msg.sender, address(this), price), "Token transfer failed");
        
        // NFTのミント
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;
        
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, nftTypeURIs[nftType]);
        
        emit NFTMinted(msg.sender, newItemId, nftType);
        
        return newItemId;
    }
    
    // カスタムNFTのミント（オーナーのみ）
    function mintCustomNFT(address recipient, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;
        
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        return newItemId;
    }
    
    // トークンの引き出し（オーナーのみ）
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(hapiToken.transfer(owner(), amount), "Token transfer failed");
    }
}