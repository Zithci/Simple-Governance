const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
  const token = await GovernanceToken.deploy();
  await token.deployed();
  console.log("GovernanceToken:", token.address);

  const SimpleGovernor = await ethers.getContractFactory("SimpleGovernor");
  const governor = await SimpleGovernor.deploy(token.address);
  await governor.deployed();
  console.log("SimpleGovernor:", governor.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});