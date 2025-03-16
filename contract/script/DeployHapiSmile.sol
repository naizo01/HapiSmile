// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HapiSmileToken} from "../src/HapiSmileToken.sol";
import {HapiSmileNFT} from "../src/HapiSmileNFT.sol";

contract DeployHapiSmile is Script {
    HapiSmileToken public token;
    HapiSmileNFT public nft;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // まずトークンをデプロイ
        token = new HapiSmileToken();
        console.log("HapiSmileToken deployed at:", address(token));

        // 次にNFTをデプロイ（トークンのアドレスを渡す）
        nft = new HapiSmileNFT(address(token));
        console.log("HapiSmileNFT deployed at:", address(nft));

        // NFTコントラクトをディストリビューターとして追加
        token.addDistributor(address(nft));
        console.log("Added NFT contract as distributor");

        vm.stopBroadcast();
    }
}