import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const KnowledgeRegistry = await ethers.getContractFactory("KnowledgeRegistry");
  const registry = await KnowledgeRegistry.deploy();

  console.log(`KnowledgeRegistry deployed to: ${registry.address}`);

  // --- Populating with sample data (Seeding) ---
  console.log("Seeding blockchain with sample data...");

  const tx1 = await registry.registerKnowledge("QmXoW8...", "Comunidade Kayapó");
  await tx1.wait();
  console.log("Registered: Conhecimento sobre a planta A");

  const tx2 = await registry.registerKnowledge("QmYp7Z...", "Comunidade Guarani");
  await tx2.wait();
  console.log("Registered: Técnica de plantio B");

  const tx3 = await registry.registerKnowledge("QmZt9X...", "Comunidade Yanomami");
  await tx3.wait();
  console.log("Registered: Uso medicinal da casca C");

  console.log("Seeding complete.");
  // --- End of Seeding ---

  // --- Saving contract info ---
  const contractInfo = {
    address: registry.address,
    abi: JSON.parse(registry.interface.format('json') as string),
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
