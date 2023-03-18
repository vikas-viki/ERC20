const hre = require("hardhat");

async function main() {

  const MineToken = await hre.ethers.getContractFactory("MineToken");
  const mineToken = await MineToken.deploy(100000000, 70000000, 50, "MineToken", "MNT");

  await mineToken.deployed();
  console.log("Mine token deployed at address: " + mineToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
