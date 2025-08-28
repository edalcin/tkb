// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TraditionalKnowledgeRegistry.sol";

/**
 * @title ExampleTraditionalKnowledge
 * @dev Example contract showing how to populate the TraditionalKnowledgeRegistry
 */
contract ExampleTraditionalKnowledge {
    TraditionalKnowledgeRegistry public registry;
    
    constructor(address _registryAddress) {
        registry = TraditionalKnowledgeRegistry(_registryAddress);
    }
    
    /**
     * @dev Populate registry with example traditional knowledge records
     */
    function populateExamples() public {
        // Example 1: Turmeric (Curcuma longa) - Medicinal use
        registry.addTraditionalKnowledge(
            "Curcuma longa", // scientificName
            "Açafrão-da-terra, Cúrcuma", // commonName
            "Plant", // speciesType
            "Tropical regions, cultivated in gardens", // habitat
            "Medicinal", // useTo
            "Root, Rhizome", // partsUsed
            "Tea, Powder, Paste", // preparationMethods
            "Used for inflammation, wound healing, digestive problems", // useToRemarks
            "QmExample1RecipeHash", // traditionalRecipeHash (IPFS)
            "QmExample1CulturalHash", // culturalSignificanceHash (IPFS)
            "COMM001", // communityId
            "Quilombo do Cafundó", // communityName
            "QmExample1LocationHash", // communityLocationHash (IPFS)
            address(0x1234567890123456789012345678901234567890), // communityContactAddress
            TraditionalKnowledgeRegistry.AccessPermission.Public, // accessPermissions
            "QmExample1LicenseHash", // licensingInformationHash (IPFS)
            address(0x9876543210987654321098765432109876543210) // validatorId
        );
        
        // Example 2: Copaiba (Copaifera spp.) - Medicinal use
        registry.addTraditionalKnowledge(
            "Copaifera spp.", // scientificName
            "Copaíba, Pau-d'óleo", // commonName
            "Plant", // speciesType
            "Amazon Forest, Cerrado", // habitat
            "Medicinal", // useTo
            "Resin, Oil", // partsUsed
            "Direct application, Oil extraction", // preparationMethods
            "Anti-inflammatory, wound healing, pain relief", // useToRemarks
            "QmExample2RecipeHash", // traditionalRecipeHash (IPFS)
            "QmExample2CulturalHash", // culturalSignificanceHash (IPFS)
            "COMM002", // communityId
            "Comunidade Indígena Xingu", // communityName
            "QmExample2LocationHash", // communityLocationHash (IPFS)
            address(0x2345678901234567890123456789012345678901), // communityContactAddress
            TraditionalKnowledgeRegistry.AccessPermission.RestrictedToCommunity, // accessPermissions
            "QmExample2LicenseHash", // licensingInformationHash (IPFS)
            address(0x8765432109876543210987654321098765432109) // validatorId
        );
        
        // Example 3: Jatobá (Hymenaea courbaril) - Multiple uses
        registry.addTraditionalKnowledge(
            "Hymenaea courbaril", // scientificName
            "Jatobá, Jutaí", // commonName
            "Plant", // speciesType
            "Atlantic Forest, Cerrado, Amazon", // habitat
            "Food", // useTo
            "Fruit, Seed", // partsUsed
            "Raw consumption, Flour production", // preparationMethods
            "Nutritious fruit, seed flour for bread making", // useToRemarks
            "QmExample3RecipeHash", // traditionalRecipeHash (IPFS)
            "QmExample3CulturalHash", // culturalSignificanceHash (IPFS)
            "COMM003", // communityId
            "Comunidade Ribeirinha do Tapajós", // communityName
            "QmExample3LocationHash", // communityLocationHash (IPFS)
            address(0x3456789012345678901234567890123456789012), // communityContactAddress
            TraditionalKnowledgeRegistry.AccessPermission.Public, // accessPermissions
            "QmExample3LicenseHash", // licensingInformationHash (IPFS)
            address(0x7654321098765432109876543210987654321098) // validatorId
        );
        
        // Example 4: Andiroba (Carapa guianensis) - Craft and medicinal
        registry.addTraditionalKnowledge(
            "Carapa guianensis", // scientificName
            "Andiroba", // commonName
            "Plant", // speciesType
            "Amazon rainforest, wetland areas", // habitat
            "Craft", // useTo
            "Seed, Oil", // partsUsed
            "Oil extraction, Candle making", // preparationMethods
            "Traditional candles for insect repelling, medicinal oil", // useToRemarks
            "QmExample4RecipeHash", // traditionalRecipeHash (IPFS)
            "QmExample4CulturalHash", // culturalSignificanceHash (IPFS)
            "COMM004", // communityId
            "Comunidade Cabocla do Solimões", // communityName
            "QmExample4LocationHash", // communityLocationHash (IPFS)
            address(0x4567890123456789012345678901234567890123), // communityContactAddress
            TraditionalKnowledgeRegistry.AccessPermission.PermissionOnly, // accessPermissions
            "QmExample4LicenseHash", // licensingInformationHash (IPFS)
            address(0x6543210987654321098765432109876543210987) // validatorId
        );
        
        // Example 5: Tucumã (Astrocaryum aculeatum) - Food and construction
        registry.addTraditionalKnowledge(
            "Astrocaryum aculeatum", // scientificName
            "Tucumã", // commonName
            "Plant", // speciesType
            "Amazon rainforest", // habitat
            "Construction", // useTo
            "Fiber, Leaves", // partsUsed
            "Fiber extraction, Weaving", // preparationMethods
            "Roof thatching, basket weaving, traditional textiles", // useToRemarks
            "QmExample5RecipeHash", // traditionalRecipeHash (IPFS)
            "QmExample5CulturalHash", // culturalSignificanceHash (IPFS)
            "COMM005", // communityId
            "Comunidade Indígena Tikuna", // communityName
            "QmExample5LocationHash", // communityLocationHash (IPFS)
            address(0x5678901234567890123456789012345678901234), // communityContactAddress
            TraditionalKnowledgeRegistry.AccessPermission.RestrictedToCommunity, // accessPermissions
            "QmExample5LicenseHash", // licensingInformationHash (IPFS)
            address(0x5432109876543210987654321098765432109876) // validatorId
        );
    }
    
    /**
     * @dev Example of how to verify knowledge records
     */
    function verifyExampleRecords() public {
        // Verify records (assuming caller is authorized validator)
        registry.verifyKnowledge(0, TraditionalKnowledgeRegistry.VerificationStatus.VerifiedByCommunity);
        registry.verifyKnowledge(1, TraditionalKnowledgeRegistry.VerificationStatus.ValidatedByExpert);
        registry.verifyKnowledge(2, TraditionalKnowledgeRegistry.VerificationStatus.VerifiedByCommunity);
    }
    
    /**
     * @dev Example of how to grant access to restricted records
     */
    function grantExampleAccess(address user) public {
        // Grant access to the Andiroba record (record ID 3) which has PermissionOnly access
        // Note: This should be called by the community contact address or contributor
        registry.grantAccess(3, user);
    }
    
    /**
     * @dev Example of how to propose edits
     */
    function proposeExampleEdit() public returns (uint256) {
        // Propose an edit to the Turmeric record (record ID 0)
        return registry.proposeEdit(0, "QmExampleEditProposalHash");
    }
}