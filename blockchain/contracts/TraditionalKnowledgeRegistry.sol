// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TraditionalKnowledgeRegistry
 * @dev Comprehensive registry for traditional knowledge about species and their uses
 */
contract TraditionalKnowledgeRegistry {
    
    struct TraditionalKnowledgeRecord {
        uint256 id;
        
        // 1. Species Identification
        string scientificName;
        string commonName;
        string speciesType; // "Plant", "Animal", "Fungus"
        string habitat;
        
        // 2. Traditional Use
        string useTo; // "Medicinal", "Food", "Craft", "Ritual", "Construction"
        string partsUsed; // "Root", "Leaf", "Fruit", "Bark", "Flower", "Whole Animal", "Skin", "Bone"
        string preparationMethods; // "Tea", "Infusion", "Decoction", "Ointment", "Raw", "Drying", "Fermentation"
        string useToRemarks;
        string traditionalRecipeHash; // IPFS hash for detailed recipe/instructions
        string culturalSignificanceHash; // IPFS hash for cultural importance description
        
        // 3. Community Information
        string communityId;
        string communityName;
        string communityLocationHash; // IPFS hash for location info (if public and consented)
        address communityContactAddress;
        
        // 4. Attribution and Provenance
        address contributorAddress;
        uint256 dateRecorded;
        uint256 lastUpdated;
        VerificationStatus verificationStatus;
        
        // 5. Intellectual Property and Access
        AccessPermission accessPermissions;
        string licensingInformationHash; // IPFS hash for licensing terms
        
        // 6. Validators
        address validatorId;
    }
    
    enum VerificationStatus {
        Pending,
        VerifiedByCommunity,
        ValidatedByExpert
    }
    
    enum AccessPermission {
        Public,
        RestrictedToCommunity,
        PermissionOnly
    }
    
    struct EditProposal {
        uint256 recordId;
        address proposer;
        string proposedChangesHash; // IPFS hash with proposed changes
        uint256 timestamp;
        bool approved;
        bool executed;
    }
    
    // State variables
    uint256 private _recordCounter;
    uint256 private _proposalCounter;
    
    mapping(uint256 => TraditionalKnowledgeRecord) public records;
    mapping(uint256 => EditProposal) public editProposals;
    mapping(address => bool) public authorizedValidators;
    mapping(uint256 => mapping(address => bool)) public accessGranted;
    mapping(string => uint256[]) public speciesRecords; // scientificName => recordIds
    mapping(string => uint256[]) public communityRecords; // communityId => recordIds
    
    // Events
    event KnowledgeAdded(uint256 indexed recordId, string scientificName, string communityId, address contributor);
    event KnowledgeUpdated(uint256 indexed recordId, address updater);
    event KnowledgeVerified(uint256 indexed recordId, address validator, VerificationStatus status);
    event EditProposed(uint256 indexed proposalId, uint256 indexed recordId, address proposer);
    event EditApproved(uint256 indexed proposalId, address approver);
    event AccessGranted(uint256 indexed recordId, address grantee);
    event OwnershipTransferred(uint256 indexed recordId, address from, address to);
    
    // Modifiers
    modifier onlyContributor(uint256 recordId) {
        require(records[recordId].contributorAddress == msg.sender, "Not the contributor");
        _;
    }
    
    modifier onlyCommunityOrContributor(uint256 recordId) {
        require(
            records[recordId].contributorAddress == msg.sender || 
            records[recordId].communityContactAddress == msg.sender,
            "Not authorized to update"
        );
        _;
    }
    
    modifier onlyValidator(uint256 recordId) {
        require(
            authorizedValidators[msg.sender] || 
            records[recordId].validatorId == msg.sender ||
            records[recordId].communityContactAddress == msg.sender,
            "Not authorized validator"
        );
        _;
    }
    
    modifier hasAccess(uint256 recordId) {
        TraditionalKnowledgeRecord memory record = records[recordId];
        if (record.accessPermissions == AccessPermission.Public) {
            _;
        } else if (record.accessPermissions == AccessPermission.RestrictedToCommunity) {
            require(
                record.communityContactAddress == msg.sender ||
                record.contributorAddress == msg.sender,
                "Access restricted to community"
            );
            _;
        } else {
            require(
                accessGranted[recordId][msg.sender] ||
                record.contributorAddress == msg.sender ||
                record.communityContactAddress == msg.sender,
                "Access not granted"
            );
            _;
        }
    }
    
    /**
     * @dev Add new traditional knowledge record
     */
    function addTraditionalKnowledge(
        string memory _scientificName,
        string memory _commonName,
        string memory _speciesType,
        string memory _habitat,
        string memory _useTo,
        string memory _partsUsed,
        string memory _preparationMethods,
        string memory _useToRemarks,
        string memory _traditionalRecipeHash,
        string memory _culturalSignificanceHash,
        string memory _communityId,
        string memory _communityName,
        string memory _communityLocationHash,
        address _communityContactAddress,
        AccessPermission _accessPermissions,
        string memory _licensingInformationHash,
        address _validatorId
    ) public returns (uint256) {
        uint256 newId = _recordCounter;
        
        TraditionalKnowledgeRecord memory newRecord = TraditionalKnowledgeRecord({
            id: newId,
            scientificName: _scientificName,
            commonName: _commonName,
            speciesType: _speciesType,
            habitat: _habitat,
            useTo: _useTo,
            partsUsed: _partsUsed,
            preparationMethods: _preparationMethods,
            useToRemarks: _useToRemarks,
            traditionalRecipeHash: _traditionalRecipeHash,
            culturalSignificanceHash: _culturalSignificanceHash,
            communityId: _communityId,
            communityName: _communityName,
            communityLocationHash: _communityLocationHash,
            communityContactAddress: _communityContactAddress,
            contributorAddress: msg.sender,
            dateRecorded: block.timestamp,
            lastUpdated: block.timestamp,
            verificationStatus: VerificationStatus.Pending,
            accessPermissions: _accessPermissions,
            licensingInformationHash: _licensingInformationHash,
            validatorId: _validatorId
        });
        
        records[newId] = newRecord;
        speciesRecords[_scientificName].push(newId);
        communityRecords[_communityId].push(newId);
        
        _recordCounter++;
        
        emit KnowledgeAdded(newId, _scientificName, _communityId, msg.sender);
        return newId;
    }
    
    /**
     * @dev Update existing traditional knowledge record
     */
    function updateTraditionalKnowledge(
        uint256 recordId,
        string memory _useToRemarks,
        string memory _traditionalRecipeHash,
        string memory _culturalSignificanceHash,
        string memory _licensingInformationHash
    ) public onlyCommunityOrContributor(recordId) {
        require(recordId < _recordCounter, "Record does not exist");
        
        TraditionalKnowledgeRecord storage record = records[recordId];
        record.useToRemarks = _useToRemarks;
        record.traditionalRecipeHash = _traditionalRecipeHash;
        record.culturalSignificanceHash = _culturalSignificanceHash;
        record.licensingInformationHash = _licensingInformationHash;
        record.lastUpdated = block.timestamp;
        
        emit KnowledgeUpdated(recordId, msg.sender);
    }
    
    /**
     * @dev Get knowledge records by species
     */
    function getKnowledgeBySpecies(string memory scientificName) 
        public view returns (uint256[] memory) {
        return speciesRecords[scientificName];
    }
    
    /**
     * @dev Get knowledge records by community
     */
    function getKnowledgeByCommunity(string memory communityId) 
        public view returns (uint256[] memory) {
        return communityRecords[communityId];
    }
    
    /**
     * @dev Verify knowledge record
     */
    function verifyKnowledge(uint256 recordId, VerificationStatus status) 
        public onlyValidator(recordId) {
        require(recordId < _recordCounter, "Record does not exist");
        
        records[recordId].verificationStatus = status;
        
        emit KnowledgeVerified(recordId, msg.sender, status);
    }
    
    /**
     * @dev Propose edit to existing record
     */
    function proposeEdit(uint256 recordId, string memory proposedChangesHash) 
        public returns (uint256) {
        require(recordId < _recordCounter, "Record does not exist");
        
        uint256 proposalId = _proposalCounter;
        
        editProposals[proposalId] = EditProposal({
            recordId: recordId,
            proposer: msg.sender,
            proposedChangesHash: proposedChangesHash,
            timestamp: block.timestamp,
            approved: false,
            executed: false
        });
        
        _proposalCounter++;
        
        emit EditProposed(proposalId, recordId, msg.sender);
        return proposalId;
    }
    
    /**
     * @dev Approve edit proposal
     */
    function approveEdit(uint256 proposalId) public {
        EditProposal storage proposal = editProposals[proposalId];
        require(proposal.recordId < _recordCounter, "Invalid proposal");
        require(!proposal.approved, "Already approved");
        
        TraditionalKnowledgeRecord storage record = records[proposal.recordId];
        require(
            record.contributorAddress == msg.sender || 
            record.communityContactAddress == msg.sender,
            "Not authorized to approve"
        );
        
        proposal.approved = true;
        
        emit EditApproved(proposalId, msg.sender);
    }
    
    /**
     * @dev Grant access to restricted record
     */
    function grantAccess(uint256 recordId, address grantee) 
        public onlyCommunityOrContributor(recordId) {
        require(recordId < _recordCounter, "Record does not exist");
        
        accessGranted[recordId][grantee] = true;
        
        emit AccessGranted(recordId, grantee);
    }
    
    /**
     * @dev Transfer ownership of record
     */
    function transferOwnership(uint256 recordId, address newOwner) 
        public onlyContributor(recordId) {
        require(recordId < _recordCounter, "Record does not exist");
        require(newOwner != address(0), "Invalid new owner");
        
        address oldOwner = records[recordId].contributorAddress;
        records[recordId].contributorAddress = newOwner;
        
        emit OwnershipTransferred(recordId, oldOwner, newOwner);
    }
    
    /**
     * @dev Add authorized validator
     */
    function addValidator(address validator) public {
        // In a real implementation, this should have proper access control
        authorizedValidators[validator] = true;
    }
    
    /**
     * @dev Get record details with access control
     */
    function getRecord(uint256 recordId) 
        public view hasAccess(recordId) returns (TraditionalKnowledgeRecord memory) {
        require(recordId < _recordCounter, "Record does not exist");
        return records[recordId];
    }
    
    /**
     * @dev Get total number of records
     */
    function getTotalRecords() public view returns (uint256) {
        return _recordCounter;
    }
}