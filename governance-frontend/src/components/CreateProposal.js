import { useState } from 'react';
import { ethers } from 'ethers';
import { SIMPLE_GOVERNOR_ADDRESS } from '../config';
import GovernorABI from '../contracts/SimpleGovernor.json';


function CreateProposal({ provider, onCreated }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

const createProposal = async() => {
  setLoading(true);
  try{
    const signer = await provider.getSigner(window.ethereum.selectedAddress);
    const governor = new ethers.Contract(SIMPLE_GOVERNOR_ADDRESS, GovernorABI.abi, signer);

    const tx = await governor.createProposal(description);
    await tx.wait();

    alert('proposal created successfully');
    setDescription('');
    onCreated();
  }catch (error){
    if(error.code === 4001 || error.code === "ACTION_REJECTED"){
      console.log("User rejected the transaction");
    }else{
    alert(" ❌ Error creating proposal: " + error.message);
  }
}
  setLoading(false);
};

return (
 <div className="create-section">
    <h2>Create Proposal</h2>
    <div className="form-group">
      <label htmlFor="description">Description</label>
      <div className="input-wrapper">
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Allocate 10 ETH for marketing"
          maxLength={200}
        />
        <button onClick={createProposal} disabled={loading}>
          {loading && <span className="loading"></span>}
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  </div>
);
}

export default CreateProposal;