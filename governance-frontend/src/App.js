import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ProposalList from './components/ProposalList';
import CreateProposal from './components/CreateProposal';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setProvider(null);
        }
      });
    }
  }, []);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setProvider(provider);
    } else {
      alert("Install MetaMask");
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Governance</h1>
        <button 
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      
      {!account ? (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <div className="connected">
            {account.slice(0,6)}...{account.slice(-4)}
          </div>
          <CreateProposal 
            provider={provider} 
            onCreated={() => setRefresh(refresh + 1)} 
          />
          <ProposalList provider={provider} key={refresh} />
        </div>
      )}
    </div>
  );
}

export default App;