const { expect } = require("chai");
const hre = require("hardhat");

describe("KazolToken contract", function () {
    let Token;
    let kazolToken;
    let owner;
    let addr1;
    let addr2;

    // Set values based on your constructor
    const tokenCap = 100_000_000; // 100 million total supply cap
    const tokenBlockReward = 50;

    beforeEach(async function () {
        // Get contract and test accounts
        Token = await hre.ethers.getContractFactory("KazolToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        // Deploy KazolToken with cap and blockReward
        kazolToken = await Token.deploy(tokenCap, tokenBlockReward);
        await kazolToken.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await kazolToken.owner()).to.equal(owner.address);
        });

        it("Should assign the initial 70M tokens to the owner", async function () {
            const ownerBalance = await kazolToken.balanceOf(owner.address);
            const expected = hre.ethers.parseUnits("70000000", 18);
            expect(ownerBalance).to.equal(expected);
        });

        it("Should set the cap correctly", async function () {
            const cap = await kazolToken.cap();
            expect(cap).to.equal(hre.ethers.parseUnits(tokenCap.toString(), 18));
        });

        it("Should set the block reward correctly", async function () {
            const reward = await kazolToken.blockReward();
            expect(reward).to.equal(hre.ethers.parseUnits(tokenBlockReward.toString(), 18));
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await kazolToken.transfer(addr1.address, 100);
            expect(await kazolToken.balanceOf(addr1.address)).to.equal(100);

            await kazolToken.connect(addr1).transfer(addr2.address, 50);
            expect(await kazolToken.balanceOf(addr2.address)).to.equal(50);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            await expect(
                kazolToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.reverted;
        });

        it("Should update balances after transfers", async function () {
            const initialBalance = await kazolToken.balanceOf(owner.address);

            await kazolToken.transfer(addr1.address, 100);
            await kazolToken.transfer(addr2.address, 200);

            const finalBalance = await kazolToken.balanceOf(owner.address);
            expect(finalBalance).to.equal(initialBalance - 300n);

            const addr1Balance = await kazolToken.balanceOf(addr1.address);
            const addr2Balance = await kazolToken.balanceOf(addr2.address);

            expect(addr1Balance).to.equal(100);
            expect(addr2Balance).to.equal(200);
        });
    });

    describe("Custom Features", function () {
        it("Should allow owner to change block reward", async function () {
            await kazolToken.setblockReward(100);
            const reward = await kazolToken.blockReward();
            expect(reward).to.equal(hre.ethers.parseUnits("100", 18));
        });

        it("Should not allow non-owners to change block reward", async function () {
            await expect(
                kazolToken.connect(addr1).setblockReward(100)
            ).to.be.revertedWith("Only owner can call this function");
        });
    });
});
