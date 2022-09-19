import hre, { ethers } from "hardhat";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const rdxPerBlock = 1; // in decimals
  const startBlock = 0;

  const RDX = await ethers.getContractFactory("RDX");
  const rdx = await RDX.deploy();
  await rdx.deployed();
  console.log(`Token RDX deployed to ${rdx.address}`);
  await sleep(10 * 10000);

  //verify
  console.log(`Start verify token RDX`);
  await hre.run("verify:verify", {
    contract: "contracts/RDX.sol:RDX",
    address: rdx.address,
    constructorArguments: [],
  });

  const MC = await ethers.getContractFactory("MyMasterchef");
  const mc = await MC.deploy(rdx.address, rdxPerBlock, startBlock);
  await mc.deployed();
  console.log(`Token Masterchef deployed to ${mc.address}`);
  await sleep(10 * 10000);

  //verify
  console.log(`Start verify token Masterchef`);
  await hre.run("verify:verify", {
    address: mc.address,
    constructorArguments: [rdx.address, rdxPerBlock, startBlock],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
