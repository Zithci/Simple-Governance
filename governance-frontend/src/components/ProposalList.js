import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SIMPLE_GOVERNOR_ADDRESS } from '../config';
import GovernorABI from '../contracts/SimpleGovernor.json';

function ProposalList({ provider }) {
  const [proposals, setProposals] = useState([]);
  const [loading,setloading] = useState(false);


  useEffect(() => {
    if (provider) loadProposals();
  }, [provider]);

  const loadProposals = async () => {
    if(loading) return;
    setloading(true);
    console.log("Loading proposals ...");
    console.log("Provider : ", provider);
    console.log("Governor Address :", SIMPLE_GOVERNOR_ADDRESS);
    const governor = new ethers.Contract(
      SIMPLE_GOVERNOR_ADDRESS,
      GovernorABI.abi,
      provider
    );

    const count = await governor.proposalCount();
    const proposalList = [];

    // fetching each proposal
    const countNum = Number(count)
    for (let i = 0; i < countNum; i++) {
       const proposal = await governor.getProposal(i);
      console.log(`Proposal ${i}:`, proposal);  
      
      proposalList.push({
        id: i,
        description: proposal[0],
        forVotes: ethers.formatEther(proposal[1]),
        againstVotes: ethers.formatEther(proposal[2]),
        deadline: new Date(Number(proposal[3]) * 1000).toLocaleString(),
        executed: proposal[4]
      });
    }
    setProposals(proposalList);
  };

   const vote = async (proposalID, support ) => {
      try{
        const signer = await provider.getSigner();
        const governor =  new ethers.Contract(SIMPLE_GOVERNOR_ADDRESS, GovernorABI.abi, signer);

        const tx = await governor.vote(proposalID, support);
        await tx.wait();

        alert("Vote cast successfully!");
      }catch(error){
        if(error.code  === 4001  || error.code === "ACTION_REJECTED"){
          console.log("User rejected the transaction");
          alert(" tx Rejected by user")
        }else{
         alert('❌ ' + error.message.split('(')[0]);
      }
    }
    }
return (
  <div>
    <h2>Proposals</h2>
    {proposals.map((p) => {
      const totalVotes = parseFloat(p.forVotes) + parseFloat(p.againstVotes);
      const forPercent = totalVotes > 0 ? (parseFloat(p.forVotes) / totalVotes * 100) : 50;
      
      return (
        <div key={p.id} className="proposal-card">
          <div className="proposal-header">
            <h3>{p.description}</h3>
            <span className="proposal-id">#{p.id}</span>
          </div>
          
          <div className="proposal-stats">
            <div className="stat">
              <div className="stat-label">For</div>
              <div className="stat-value for">{parseFloat(p.forVotes).toFixed(0)}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Against</div>
              <div className="stat-value against">{parseFloat(p.againstVotes).toFixed(0)}</div>
            </div>
          </div>
          
          <div className="vote-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${forPercent}%`}}></div>
            </div>
            <div className="progress-labels">
              <span>{forPercent.toFixed(1)}% For</span>
              <span>{(100-forPercent).toFixed(1)}% Against</span>
            </div>
          </div>
          
          <div className="deadline">{p.deadline}</div>
          
          <div className="vote-buttons">
            <button onClick={() => vote(p.id, true)}>Vote YES</button>
            <button onClick={() => vote(p.id, false)}>Vote NO</button>
          </div>
        </div>
      );
    })}
  </div>
);

} //end block contract

export default ProposalList;