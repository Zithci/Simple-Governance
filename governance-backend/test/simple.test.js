const hre = require("hardhat");

describe("Basic Deploy Test", function () {
  it("Should deploy contracts", async function () {
    const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
    const token = await GovernanceToken.deploy();
    await token.deployed();
    
    console.log("Token:", token.address);
    
    const SimpleGovernor = await hre.ethers.getContractFactory("SimpleGovernor");
    const governor = await SimpleGovernor.deploy(token.address);
    await governor.deployed();
    
    console.log("Governor:", governor.address);
  });
});