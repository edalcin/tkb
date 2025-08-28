import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TraditionalKnowledgeRegistry
  const TraditionalKnowledgeRegistry = await ethers.getContractFactory("TraditionalKnowledgeRegistry");
  const registry = await TraditionalKnowledgeRegistry.deploy();
  
  // Wait for deployment
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();

  console.log(`TraditionalKnowledgeRegistry deployed to: ${registryAddress}`);

  // Deploy ExampleTraditionalKnowledge
  const ExampleContract = await ethers.getContractFactory("ExampleTraditionalKnowledge");
  const example = await ExampleContract.deploy(registryAddress);
  
  await example.waitForDeployment();
  const exampleAddress = await example.getAddress();

  console.log(`ExampleTraditionalKnowledge deployed to: ${exampleAddress}`);

  // --- Populating with sample data (Seeding) ---
  console.log("Seeding blockchain with sample data...");

  // Add deployer as validator
  const registryInstance = await ethers.getContractAt("TraditionalKnowledgeRegistry", registryAddress);
  const txValidator = await registryInstance.addValidator(deployer.address);
  await txValidator.wait();
  console.log("Deployer added as validator");

  // Populate with example data
  const tx1 = await example.populateExamples();
  await tx1.wait();
  console.log("Example traditional knowledge records populated");

  // Verify some records
  const tx2 = await example.verifyExampleRecords();
  await tx2.wait();
  console.log("Example records verified");

  console.log("Seeding complete.");
  // --- End of Seeding ---

  // --- Saving contract info ---
  const contractInfo = {
    registryAddress: registryAddress,
    exampleAddress: exampleAddress,
    contracts: {
      TraditionalKnowledgeRegistry: {
        address: registryAddress,
        name: "TraditionalKnowledgeRegistry"
      },
      ExampleTraditionalKnowledge: {
        address: exampleAddress,
        name: "ExampleTraditionalKnowledge"
      }
    },
    deployedAt: new Date().toISOString()
  };

  const dataDir = "/app/data";
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dataDir, "contract-info.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract info saved to /app/data/contract-info.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
