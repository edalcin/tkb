import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const KnowledgeRegistry = await ethers.getContractFactory("KnowledgeRegistry");
  const registry = await KnowledgeRegistry.deploy();
  
  // Wait for deployment
  const deploymentTx = registry.deployTransaction;
  const receipt = await deploymentTx.wait();
  const contractAddress = receipt.contractAddress;

  console.log(`KnowledgeRegistry deployed to: ${contractAddress}`);

  // --- Populating with sample data (Seeding) ---
  console.log("Seeding blockchain with sample data...");

  // Create a contract instance at the deployed address
  const deployedRegistry = await ethers.getContractAt("KnowledgeRegistry", contractAddress);
  
  const tx1 = await deployedRegistry.registerKnowledge("QmXoW8...", "Comunidade Kayapó");
  await tx1.wait();
  console.log("Registered: Conhecimento sobre a planta A");

  const tx2 = await deployedRegistry.registerKnowledge("QmYp7Z...", "Comunidade Guarani");
  await tx2.wait();
  console.log("Registered: Técnica de plantio B");

  const tx3 = await deployedRegistry.registerKnowledge("QmZt9X...", "Comunidade Yanomami");
  await tx3.wait();
  console.log("Registered: Uso medicinal da casca C");

  console.log("Seeding complete.");
  // --- End of Seeding ---

  // --- Saving contract info ---
  const contractInfo = {
    address: contractAddress,
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "communityId",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "communityLead",
            "type": "address"
          }
        ],
        "name": "KnowledgeRegistered",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "getAllRecords",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "communityLead",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "communityId",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct KnowledgeRegistry.KnowledgeRecord[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_communityId",
            "type": "string"
          }
        ],
        "name": "registerKnowledge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "records",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "communityLead",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "communityId",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
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
