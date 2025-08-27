import { ethers } from "hardhat";

async function main() {
  const KnowledgeRegistry = await ethers.getContractFactory("KnowledgeRegistry");
  const registry = await KnowledgeRegistry.deploy();

  await registry.deployed();

  console.log(`KnowledgeRegistry deployed to: ${registry.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
