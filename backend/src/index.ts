import express from 'express';
import cors from 'cors';
import path from 'path';
import { ethers, Contract } from 'ethers';
import fs from 'fs/promises';
import { exec } from 'child_process';

const app = express();
const port = 3001;

// --- Type Definitions ---
interface KnowledgeRecord {
  id: string;
  ipfsHash: string;
  communityLead: string;
  communityId: string;
  timestamp: string;
}

// --- Blockchain Connection Setup ---
const CONTRACT_INFO_PATH = path.join(__dirname, '../data/contract-info.json');
const HARDHAT_RPC_URL = 'http://localhost:8545';

let contract: Contract;

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
    const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC_URL);
    contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider);
    console.log('Successfully connected to the smart contract at', contract.address);
  } catch (error) {
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
    const allRecords = await contract.getAllRecords();
    // Format the result to be more frontend-friendly (e.g., converting BigNumber)
    const formattedRecords: KnowledgeRecord[] = allRecords.map((record: any) => ({
      id: record.id.toString(),
      ipfsHash: record.ipfsHash,
      communityLead: record.communityLead,
      communityId: record.communityId,
      timestamp: new Date(record.timestamp * 1000).toISOString(),
    }));
    res.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching records from blockchain:', error);
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// --- Static File Serving ---
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend-build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-build', 'index.html'));
});

// --- Server Initialization ---
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  // Wait a moment for other services to be ready before connecting
  setTimeout(connectToContract, 5000);
});

