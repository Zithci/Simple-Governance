// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GovernanceToken.sol";

contract SimpleGovernor {
    GovernanceToken public token;
    
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 3 days;
    
    event ProposalCreated(uint256 proposalId, string description, uint256 deadline);
    event Voted(uint256 proposalId, address voter, bool support, uint256 weight);
    
    constructor(address _token) {
        token = GovernanceToken(_token);
    }
    
    function createProposal(string memory description) external returns (uint256) {
        require(token.balanceOf(msg.sender) > 0, "Must hold tokens to propose");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        proposal.description = description;
        proposal.deadline = block.timestamp + VOTING_PERIOD;
        proposal.executed = false;
        
        emit ProposalCreated(proposalId, description, proposal.deadline);
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        proposal.hasVoted[msg.sender] = true;
        emit Voted(proposalId, msg.sender, support, weight);
    }
    
    function getProposal(uint256 proposalId) external view returns (
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 deadline,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.deadline,
            proposal.executed
        );
    }
}