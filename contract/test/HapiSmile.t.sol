// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {HapiSmileToken} from "../src/HapiSmileToken.sol";
import {HapiSmileNFT} from "../src/HapiSmileNFT.sol";

contract HapiSmileTest is Test {
    HapiSmileToken public token;
    HapiSmileNFT public nft;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    function setUp() public {
        vm.startPrank(owner);
        
        // トークンをデプロイ
        token = new HapiSmileToken();
        
        // NFTをデプロイ
        nft = new HapiSmileNFT(address(token));
        
        // NFTコントラクトをディストリビューターとして追加
        token.addDistributor(address(nft));
        
        // ユーザーにトークンを配布
        token.transfer(user1, 1000 * 10**18);
        token.transfer(user2, 500 * 10**18);
        
        vm.stopPrank();
    }
    
    // トークンの基本機能テスト
    function testTokenBasics() public {
        assertEq(token.name(), "HapiSmile Token");
        assertEq(token.symbol(), "HAPI");
        assertEq(token.decimals(), 18);
        
        // 初期供給量の確認
        assertEq(token.totalSupply(), 1_000_000 * 10**18);
        
        // ユーザーの残高確認
        assertEq(token.balanceOf(user1), 1000 * 10**18);
        assertEq(token.balanceOf(user2), 500 * 10**18);
    }
    
    // ディストリビューター機能のテスト
    function testDistributorFunctionality() public {
        // オーナーがディストリビューターを追加できることを確認
        vm.startPrank(owner);
        token.addDistributor(user1);
        vm.stopPrank();
        
        assertTrue(token.distributors(user1));
        
        // ディストリビューターがトークンを配布できることを確認
        vm.startPrank(user1);
        token.distributeTokens(user2, 100 * 10**18);
        vm.stopPrank();
        
        assertEq(token.balanceOf(user2), 600 * 10**18);
        
        // オーナーがディストリビューターを削除できることを確認
        vm.startPrank(owner);
        token.removeDistributor(user1);
        vm.stopPrank();
        
        assertFalse(token.distributors(user1));
        
        // 削除されたディストリビューターがトークンを配布できないことを確認
        vm.startPrank(user1);
        vm.expectRevert("Not authorized to distribute tokens");
        token.distributeTokens(user2, 100 * 10**18);
        vm.stopPrank();
    }
    
    // NFTの基本機能テスト
    function testNFTBasics() public {
        assertEq(nft.name(), "HapiSmile NFT");
        assertEq(nft.symbol(), "HAPINFT");
        
        // NFTタイプの価格確認
        assertEq(nft.nftPrices(nft.LIMITED_VIDEO_NFT()), 10 * 10**18);
        assertEq(nft.nftPrices(nft.COLLECTION_NFT()), 50 * 10**18);
        assertEq(nft.nftPrices(nft.EVENT_NFT()), 100 * 10**18);
    }
    
    // NFTミント機能のテスト
    function testNFTMinting() public {
        // ユーザーがトークンをNFTコントラクトに承認
        vm.startPrank(user1);
        token.approve(address(nft), 100 * 10**18);
        
        // ユーザーがNFTをミント
        uint256 tokenId = nft.mintNFT(nft.LIMITED_VIDEO_NFT());
        vm.stopPrank();
        
        // NFTの所有権確認
        assertEq(nft.ownerOf(tokenId), user1);
        
        // トークン残高の確認（10トークンが引かれているはず）
        assertEq(token.balanceOf(user1), 990 * 10**18);
        assertEq(token.balanceOf(address(nft)), 10 * 10**18);
    }
    
    // カスタムNFTミントのテスト
    function testCustomNFTMint() public {
        vm.startPrank(owner);
        uint256 tokenId = nft.mintCustomNFT(user2, "ipfs://custom-uri");
        vm.stopPrank();
        
        assertEq(nft.ownerOf(tokenId), user2);
        assertEq(nft.tokenURI(tokenId), "ipfs://custom-uri");
        
        // 非オーナーがカスタムNFTをミントできないことを確認
        vm.startPrank(user1);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1)
        );
        nft.mintCustomNFT(user2, "ipfs://another-uri");
        vm.stopPrank();
    }
    
    // トークン引き出し機能のテスト
    function testWithdrawTokens() public {
        // まずNFTをミントしてトークンをNFTコントラクトに送る
        vm.startPrank(user1);
        token.approve(address(nft), 100 * 10**18);
        nft.mintNFT(nft.LIMITED_VIDEO_NFT());
        vm.stopPrank();
        
        uint256 ownerBalanceBefore = token.balanceOf(owner);
        
        // オーナーがトークンを引き出す
        vm.startPrank(owner);
        nft.withdrawTokens(10 * 10**18);
        vm.stopPrank();
        
        // オーナーの残高が増えていることを確認
        assertEq(token.balanceOf(owner), ownerBalanceBefore + 10 * 10**18);
        
        // 非オーナーがトークンを引き出せないことを確認
        vm.startPrank(user1);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1)
        );
        nft.withdrawTokens(10 * 10**18);
        vm.stopPrank();
    }
}