import express from 'express';
import cors from 'cors';
import path from 'path';
import { ethers, Contract } from 'ethers';
import * as fs from 'fs/promises';
import { exec } from 'child_process';
import { create } from 'ipfs-http-client';

const app = express();
const port = 3001;

// --- Type Definitions ---
interface TraditionalKnowledgeRecord {
  id: string;
  scientificName: string;
  commonName: string;
  speciesType: string;
  habitat: string;
  useTo: string;
  partsUsed: string;
  preparationMethods: string;
  useToRemarks: string;
  traditionalRecipeHash: string;
  culturalSignificanceHash: string;
  communityId: string;
  communityName: string;
  communityLocationHash: string;
  communityContactAddress: string;
  contributorAddress: string;
  dateRecorded: string;
  lastUpdated: string;
  verificationStatus: number;
  accessPermissions: number;
  licensingInformationHash: string;
  validatorId: string;
}

// --- Blockchain Connection Setup ---
const CONTRACT_INFO_PATH = path.join(__dirname, '../../data/contract-info.json');
const HARDHAT_RPC_URL = 'http://127.0.0.1:8545';

let contract: Contract;
let ipfs: any; // IPFS client instance

async function deployContract(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Contract info not found. Attempting to deploy...');
    const deployProcess = exec(
      'npx hardhat run scripts/deploy.ts --network localhost',
      { cwd: path.join(__dirname, '../../blockchain') }
    );

    deployProcess.stdout?.on('data', (data) => console.log(`[Deploy Script]: ${data}`.trim()));
    deployProcess.stderr?.on('data', (data) => console.error(`[Deploy Script ERROR]: ${data}`.trim()));

    deployProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('Contract deployment script finished successfully.');
        resolve();
      } else {
        reject(new Error(`Deployment script exited with code ${code}`));
      }
    });
  });
}

async function connectToContract() {
  try {
    // First, try to read the file
    const contractInfo = JSON.parse(await fs.readFile(CONTRACT_INFO_PATH, 'utf8'));
    const provider = new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
    
    // Use the registry address from the new contract structure
    const registryAddress = contractInfo.registryAddress || contractInfo.contracts?.TraditionalKnowledgeRegistry?.address;
    if (!registryAddress) {
      throw new Error('Registry address not found in contract info');
    }
    
    // Create contract instance with minimal ABI for the methods we need
    const abi = [
      "function getTotalRecords() view returns (uint256)",
      "function getRecord(uint256) view returns (tuple(uint256 id, string scientificName, string commonName, string speciesType, string habitat, string useTo, string partsUsed, string preparationMethods, string useToRemarks, string traditionalRecipeHash, string culturalSignificanceHash, string communityId, string communityName, string communityLocationHash, address communityContactAddress, address contributorAddress, uint256 dateRecorded, uint256 lastUpdated, uint8 verificationStatus, uint8 accessPermissions, string licensingInformationHash, address validatorId))"
    ];
    
    contract = new ethers.Contract(registryAddress, abi, provider);
    console.log('Successfully connected to TraditionalKnowledgeRegistry at', registryAddress);
  } catch (error) {
    console.error('Contract connection error:', error);
    // If reading fails (e.g., file not found), run deployment
    try {
      await deployContract();
      // Retry connecting after deployment
      setTimeout(connectToContract, 1000); // Short delay to allow file system to sync
    } catch (deployError) {
      console.error('Failed to deploy contract:', deployError);
      // Retry connection attempt after a longer delay
      setTimeout(connectToContract, 10000);
    }
  }
}

async function connectToIPFS() {
  try {
    ipfs = create({ url: 'http://localhost:5001' });
    const version = await ipfs.version();
    console.log('Connected to IPFS node, version:', version.version);
  } catch (error) {
    console.error('Failed to connect to IPFS node:', error);
    // Retry connecting to IPFS
    setTimeout(connectToIPFS, 5000);
  }
}

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.get('/api/hello', (req, res) => {
  res.send({ message: 'TKB Backend is running!' });
});

app.get('/api/knowledge', async (req, res) => {
  if (!contract) {
    return res.status(503).json({ error: 'Smart contract not available. Still connecting...' });
  }
  try {
    const totalRecords = await contract.getTotalRecords();
    const records: TraditionalKnowledgeRecord[] = [];
    
    // Fetch all records individually
    for (let i = 0; i < totalRecords.toNumber(); i++) {
      try {
        const record = await contract.getRecord(i);
        const formattedRecord: TraditionalKnowledgeRecord = {
          id: record.id.toString(),
          scientificName: record.scientificName,
          commonName: record.commonName,
          speciesType: record.speciesType,
          habitat: record.habitat,
          useTo: record.useTo,
          partsUsed: record.partsUsed,
          preparationMethods: record.preparationMethods,
          useToRemarks: record.useToRemarks,
          traditionalRecipeHash: record.traditionalRecipeHash,
          culturalSignificanceHash: record.culturalSignificanceHash,
          communityId: record.communityId,
          communityName: record.communityName,
          communityLocationHash: record.communityLocationHash,
          communityContactAddress: record.communityContactAddress,
          contributorAddress: record.contributorAddress,
          dateRecorded: new Date(record.dateRecorded * 1000).toISOString(),
          lastUpdated: new Date(record.lastUpdated * 1000).toISOString(),
          verificationStatus: record.verificationStatus,
          accessPermissions: record.accessPermissions,
          licensingInformationHash: record.licensingInformationHash,
          validatorId: record.validatorId,
        };
        records.push(formattedRecord);
      } catch (recordError) {
        console.error(`Error fetching record ${i}:`, recordError);
        // Skip records that can't be accessed due to permissions
      }
    }
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching records from blockchain:', error);
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// --- Static File Serving ---
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../frontend-build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend-build', 'index.html'));
});

// --- Server Initialization ---
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  // Wait a moment for other services to be ready before connecting
  setTimeout(connectToContract, 10000);
  setTimeout(connectToIPFS, 5000);
});


