import express from 'express';
import cors from 'cors';
import path from 'path';
import { ethers, Contract } from 'ethers';
import * as fs from 'fs/promises';
import { exec } from 'child_process';
// import { create } from 'ipfs-http-client'; // Temporarily disabled due to CommonJS compatibility issues

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
const HARDHAT_RPC_URLS = [
  'http://localhost:8545',    // Localhost primary
  'http://127.0.0.1:8545',    // IP fallback
  'http://hardhat:8545'       // Docker internal network (fallback)
];

let contract: Contract;
let ipfs: any; // IPFS client instance

async function deployContract(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Contract info not found. Attempting to deploy...');
    const deployProcess = exec(
      'npx hardhat run scripts/deploy.ts --network localhost',
      { cwd: '/app/blockchain' }
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
    
    // Use the registry address from the new contract structure
    const registryAddress = contractInfo.registryAddress || contractInfo.contracts?.TraditionalKnowledgeRegistry?.address;
    if (!registryAddress) {
      throw new Error('Registry address not found in contract info');
    }
    
    // Try connecting to Hardhat with multiple URLs
    let provider = null;
    let lastError = null;
    
    for (const rpcUrl of HARDHAT_RPC_URLS) {
      try {
        console.log(`Trying to connect to Hardhat at ${rpcUrl}...`);
        const testProvider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Test the connection
        await testProvider.getNetwork();
        provider = testProvider;
        console.log(`✅ Successfully connected to Hardhat at ${rpcUrl}`);
        break;
      } catch (error: any) {
        console.log(`❌ Failed to connect to ${rpcUrl}:`, error.message || error);
        lastError = error;
        continue;
      }
    }
    
    if (!provider) {
      throw lastError || new Error('Failed to connect to any Hardhat RPC URL');
    }
    
    // Create contract instance with correct ABI for the methods we need
    const abi = [
      "function getTotalRecords() view returns (uint256)",
      "function getRecord(uint256 recordId) view returns (tuple(uint256 id, string scientificName, string commonName, string speciesType, string habitat, string useTo, string partsUsed, string preparationMethods, string useToRemarks, string traditionalRecipeHash, string culturalSignificanceHash, string communityId, string communityName, string communityLocationHash, address communityContactAddress, address contributorAddress, uint256 dateRecorded, uint256 lastUpdated, uint8 verificationStatus, uint8 accessPermissions, string licensingInformationHash, address validatorId))"
    ];
    
    contract = new ethers.Contract(registryAddress, abi, provider);
    console.log('Successfully connected to TraditionalKnowledgeRegistry at', registryAddress);
  } catch (error: any) {
    console.error('Contract connection error:', error.message || error);
    // Retry connection attempt after a delay - hardhat should deploy automatically
    setTimeout(connectToContract, 5000);
  }
}

async function connectToIPFS() {
  try {
    // ipfs = create({ url: 'http://localhost:5001' });
    // const version = await ipfs.version();
    console.log('IPFS connection temporarily disabled - focusing on blockchain connectivity');
  } catch (error) {
    console.error('Failed to connect to IPFS node:', error);
    // Retry connecting to IPFS
    setTimeout(connectToIPFS, 5000);
  }
}

// Configure CORS to allow external access
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8111',
  'http://192.168.1.10:8111',
  'http://192.168.1.10:8113',
  'http://tkb.dalc.in:8111',
  'http://tkb.dalc.in:8113',
  'https://tkb.dalc.in',
  'http://tkb.dalc.in',
];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin 
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// --- API Routes ---
app.get('/api/hello', (req, res) => {
  res.send({ message: 'TKB Backend is running!' });
});

// Test CORS endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS test successful',
    origin: req.headers.origin,
    host: req.headers.host,
    userAgent: req.headers['user-agent']?.slice(0, 50) + '...'
  });
});

// Debug endpoint to check blockchain connection status
app.get('/api/debug', async (req, res) => {
  const debug = {
    contractAvailable: !!contract,
    contractAddress: null as string | null,
    hardhatConnection: null as string | null,
    totalRecordsTest: null as string | null,
    timestamp: new Date().toISOString()
  };
  
  if (contract) {
    try {
      debug.contractAddress = await contract.getAddress();
      debug.hardhatConnection = 'Connected';
      
      // Test getTotalRecords() directly
      try {
        const totalRecords = await contract.getTotalRecords();
        debug.totalRecordsTest = `Success: ${totalRecords.toString()}`;
      } catch (recordError: any) {
        debug.totalRecordsTest = `Error: ${recordError.message}`;
      }
      
    } catch (err) {
      debug.hardhatConnection = err instanceof Error ? err.message : 'Unknown error';
    }
  } else {
    debug.hardhatConnection = 'Contract not initialized';
  }
  
  res.json(debug);
});

// Force redeploy endpoint for debugging
app.post('/api/redeploy', async (req, res) => {
  try {
    console.log('Force redeploying contract...');
    await deployContract();
    // Wait a bit and try to reconnect
    setTimeout(connectToContract, 5000);
    res.json({ message: 'Redeploy initiated. Check logs and /api/debug for status.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint with mock data
app.get('/api/knowledge-test', async (req, res) => {
  const mockRecord = {
    id: "0",
    scientificName: "Test Species",
    commonName: "Test Plant",
    speciesType: "Plant",
    habitat: "Test Habitat",
    useTo: "Medicinal",
    partsUsed: "Leaf",
    preparationMethods: "Tea",
    useToRemarks: "Test usage for debugging",
    traditionalRecipeHash: "QmTest123",
    culturalSignificanceHash: "QmCultural123",
    communityId: "test-community",
    communityName: "Test Community",
    communityLocationHash: "QmLocation123",
    communityContactAddress: "0x742d35Cc6635C0532925a3b8D6f9E4e4E8BBf68F",
    contributorAddress: "0x742d35Cc6635C0532925a3b8D6f9E4e4E8BBf68F",
    dateRecorded: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    verificationStatus: 0,
    accessPermissions: 0,
    licensingInformationHash: "QmLicense123",
    validatorId: "0x742d35Cc6635C0532925a3b8D6f9E4e4E8BBf68F"
  };
  res.json([mockRecord]);
});

app.get('/api/knowledge', async (req, res) => {
  if (!contract) {
    return res.status(503).json({ error: 'Smart contract not available. Still connecting...' });
  }
  try {
    console.log('Fetching total records from contract...');
    const totalRecords = await contract.getTotalRecords();
    console.log(`Total records found: ${totalRecords}`);
    
    // If no records, return empty array
    if (Number(totalRecords) === 0) {
      console.log('No records found in the contract');
      return res.json([]);
    }
    
    const records: TraditionalKnowledgeRecord[] = [];
    let accessibleCount = 0;
    let restrictedCount = 0;
    
    // Fetch all records individually
    for (let i = 0; i < Number(totalRecords); i++) {
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
          dateRecorded: new Date(Number(record.dateRecorded) * 1000).toISOString(),
          lastUpdated: new Date(Number(record.lastUpdated) * 1000).toISOString(),
          verificationStatus: Number(record.verificationStatus),
          accessPermissions: Number(record.accessPermissions),
          licensingInformationHash: record.licensingInformationHash,
          validatorId: record.validatorId,
        };
        records.push(formattedRecord);
        accessibleCount++;
      } catch (recordError: any) {
        restrictedCount++;
        if (recordError.reason === 'Access restricted to community') {
          console.log(`Record ${i}: Access restricted to community - skipping`);
        } else {
          console.error(`Error fetching record ${i}:`, recordError.reason || recordError.message);
        }
        // Skip records that can't be accessed due to permissions
      }
    }
    
    console.log(`Successfully fetched ${accessibleCount} accessible records, ${restrictedCount} restricted`);
    res.json(records);
  } catch (error: any) {
    console.error('Error fetching records from blockchain:', error);
    console.error('Error details:', {
      code: error.code,
      reason: error.reason,
      message: error.message,
      data: error.data,
      info: error.info
    });
    
    // If this is a contract connection issue, return 503
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('connection')) {
      return res.status(503).json({ error: 'Blockchain connection unavailable. Please try again later.' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch records: ' + (error.reason || error.message),
      details: {
        code: error.code,
        reason: error.reason
      }
    });
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server listening at http://0.0.0.0:${port}`);
  // Wait a moment for other services to be ready before connecting
  setTimeout(connectToContract, 10000);
  setTimeout(connectToIPFS, 5000);
});


