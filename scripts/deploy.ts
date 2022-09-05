import { ethers } from "hardhat";

async function main() {
  const rdxPerBlock = 1; // in decimals
  const startBlock = 0;

  // const RDX = await ethers.getContractFactory("RDX");
  // const rdx = await RDX.deploy();
  // await rdx.deployed();
  // console.log(`Token RDX deployed to ${rdx.address}`);

  // const KCP = await ethers.getContractFactory("KCP");
  // const kcp = await KCP.deploy();
  // await kcp.deployed();
  // console.log(`Token KCP deployed to ${kcp.address}`);

  const MC = await ethers.getContractFactory("MyMasterchef");
  const mc = await MC.deploy('0x96B1e0ee133a20114f1311D90FcF3E27D56d57d2', rdxPerBlock, startBlock);
  await mc.deployed();
  console.log(`Token Masterchef deployed to ${mc.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
