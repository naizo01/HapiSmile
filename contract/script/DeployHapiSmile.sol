// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HappySmileToken} from "../src/HappySmileToken.sol";
import {HappySmileNFT} from "../src/HappySmileNFT.sol";

contract DeployHappySmile is Script {
    HappySmileToken public token;
    HappySmileNFT public nft;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // まずトークンをデプロイ
        token = new HappySmileToken();
        console.log("HappySmileToken deployed at:", address(token));

        // 次にNFTをデプロイ（トークンのアドレスを渡す）
        nft = new HappySmileNFT(address(token));
        console.log("HappySmileNFT deployed at:", address(nft));

        // NFTコントラクトをディストリビューターとして追加
        token.addDistributor(address(nft));
        console.log("Added NFT contract as distributor");

        vm.stopBroadcast();
    }
}