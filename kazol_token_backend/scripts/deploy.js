const hre = require("hardhat");

async function main() {
    const cap = 100000000;
    const reward = 50;

    const KazolToken = await hre.ethers.getContractFactory("KazolToken");
    const token = await KazolToken.deploy(cap, reward);

    await token.waitForDeployment();
    console.log("KazolToken deployed to:", token.target);
}

main().catch((error) => {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
});


// 0x93a0E81E52C06CF35D11d8098482c7141AC23b15