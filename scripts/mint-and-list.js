const { ethers } = require("hardhat");
const contractAbi = require("../artifacts/contracts/NftMarketplace.sol/NftMarketplace.json")


const PRICE = ethers.parseEther("0.1");


async function mintAndList() {
    const contractAddress =  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const provider =  ethers.provider.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_WEBSOCKET}`)

    
    const nftMarketplace = await ethers.getContract(contractAddress, contractAbi, provider);
    const basicNftTwo = await ethers.getContract("BasicNftTwo");
    console.log("Minting...");
    const mintTx = await basicNftTwo.mintNft();

    

    const mintTxReceipt = await mintTx.wait(1);

    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log("Approving Nft....");

    const approvalTx = await basicNftTwo.approve(nftMarketplace.address, 0);
    await approvalTx.wait(1);
    console.log("Listing NFT....");
    const tx = await nftMarketplace.listItem(basicNftTwo.address, 0, PRICE);
    await tx.wait(1);
    console.log("Listed! :) :D");
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })