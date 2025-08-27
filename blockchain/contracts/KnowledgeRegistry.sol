// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KnowledgeRegistry
 * @dev Stores and manages traditional knowledge records.
 */
contract KnowledgeRegistry {
    struct KnowledgeRecord {
        uint256 id;
        string ipfsHash; // Hash from IPFS pointing to the actual data
        address communityLead; // Address of the community representative
        string communityId; // Identifier for the traditional community
        uint256 timestamp; // Registration timestamp
    }

    uint256 private _recordCounter;
    mapping(uint256 => KnowledgeRecord) public records;
    
    event KnowledgeRegistered(uint256 indexed id, string ipfsHash, string communityId, address communityLead);

    /**
     * @dev Registers a new piece of traditional knowledge.
     * @param _ipfsHash The hash of the data stored on IPFS.
     * @param _communityId The identifier of the community.
     */
    function registerKnowledge(string memory _ipfsHash, string memory _communityId) public {
        uint256 newId = _recordCounter;
        records[newId] = KnowledgeRecord({
            id: newId,
            ipfsHash: _ipfsHash,
            communityLead: msg.sender, // The one who registers
            communityId: _communityId,
            timestamp: block.timestamp
        });

        _recordCounter++;

        emit KnowledgeRegistered(newId, _ipfsHash, _communityId, msg.sender);
    }

    /**
     * @dev Returns all registered knowledge records.
     * @return An array of all records.
     */
    function getAllRecords() public view returns (KnowledgeRecord[] memory) {
        KnowledgeRecord[] memory allRecords = new KnowledgeRecord[](_recordCounter);
        for (uint i = 0; i < _recordCounter; i++) {
            allRecords[i] = records[i];
        }
        return allRecords;
    }
