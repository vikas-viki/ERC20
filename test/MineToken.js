const { expect } = require("chai");
const hre = require("hardhat");

describe("Mine Token Contract", () => {
    var Token;
    var MineToken;
    var owner;
    var addr1;
    var addr2;
    var tokenCap = 100000000; // 100 m token - total amount.
    var tokenSupply = 70000000; // Total supply - after giving 30 m for miner rewards.
    var tokenBlockReward = 50;
    var tokenName = "MineToken";
    var tokenSymbol = "MNT";

    beforeEach(async () => {
        // Get the ContractFactory and Signers here.
        Token = await ethers.getContractFactory("MineToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        MineToken = await Token.deploy(tokenCap, tokenSupply, tokenBlockReward, tokenName, tokenSymbol);
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await MineToken.owner()).to.equal(owner.address);
        });

        it("Should set the token name", async function () {
            const token_name = await MineToken.name();
            expect(token_name).to.equal(tokenName);
        });

        it("Should set the token symbol", async function () {
            const token_symbol = await MineToken.symbol();
            expect(token_symbol).to.equal(tokenSymbol);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await MineToken.balanceOf(owner.address);
            expect(await MineToken.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the max capped supply to the argument provided during deployment", async function () {
            const cap = await MineToken.cap();
            expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
        });

        it("Should set the blockReward to the argument provided during deployment", async function () {
            const blockReward = await MineToken.blockReward();
            expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
        });
    });


    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await MineToken.transfer(addr1.address, 50);
            const addr1Balance = await MineToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await MineToken.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await MineToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await MineToken.balanceOf(owner.address);
            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                MineToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            // Owner balance shouldn't have changed.
            expect(await MineToken.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await MineToken.balanceOf(owner.address);

            // Transfer 100 tokens from owner to addr1.
            await MineToken.transfer(addr1.address, 100);



            // Transfer another 50 tokens from owner to addr2.
            await MineToken.transfer(addr2.address, 50);

            // Check balances.
            const finalOwnerBalance = await MineToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

            const addr1Balance = await MineToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await MineToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

    });

})

// mining
// Check if the miner got the right amount
// it("Should update miner's balance with the block reward after mining a block", async function () {
//     const initialMinerBalance = await MineToken.balanceOf(addr1.address);

//     // Mine a block by calling the `mine` function with the miner's address as the argument
//     await MineToken.connect(addr1).mine(addr1.address);

//     // Check if the miner received the correct block reward
//     const expectedMinerBalance = initialMinerBalance.add(tokenBlockReward);
//     const actualMinerBalance = await MineToken.balanceOf(addr1.address);
//     expect(actualMinerBalance).to.equal(expectedMinerBalance);
// });