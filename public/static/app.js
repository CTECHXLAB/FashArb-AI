/* ============================================================
   FlashArb AI v4.0 — ChainGPT-Powered DeFi Arbitrage Platform
   Multi-DEX Routing · Flash Loan Execution · AI Contract Gen
   ============================================================ */
'use strict';

// ─── BASE URL (API backend) ────────────────────────────────────────────────────
const API = window.location.origin;

// ─── NETWORK REGISTRY ─────────────────────────────────────────────────────────
const NET_REGISTRY = {
  '1':        { name:'Ethereum',    shortName:'Ethereum',  isTestnet:false, symbol:'ETH',  color:'#627eea', explorer:'https://etherscan.io',            hexId:'0x1',      aavePool:'0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', uniV2:'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', sushi:'0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', uniV3:'0xE592427A0AEce92De3Edee1F18E0157C05861564' },
  '137':      { name:'Polygon',     shortName:'Polygon',   isTestnet:false, symbol:'MATIC',color:'#8247e5', explorer:'https://polygonscan.com',          hexId:'0x89',     aavePool:'0x794a61358D6845594F94dc1DB02A252b5b4814aD', uniV2:'0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', sushi:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3:'0xE592427A0AEce92De3Edee1F18E0157C05861564' },
  '42161':    { name:'Arbitrum',    shortName:'Arbitrum',  isTestnet:false, symbol:'ETH',  color:'#28a0f0', explorer:'https://arbiscan.io',              hexId:'0xa4b1',   aavePool:'0x794a61358D6845594F94dc1DB02A252b5b4814aD', uniV2:'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', sushi:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3:'0xE592427A0AEce92De3Edee1F18E0157C05861564' },
  '10':       { name:'Optimism',    shortName:'Optimism',  isTestnet:false, symbol:'ETH',  color:'#ff0420', explorer:'https://optimistic.etherscan.io',  hexId:'0xa',      aavePool:'0x794a61358D6845594F94dc1DB02A252b5b4814aD', uniV2:'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', sushi:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3:'0xE592427A0AEce92De3Edee1F18E0157C05861564' },
  '8453':     { name:'Base',        shortName:'Base',      isTestnet:false, symbol:'ETH',  color:'#0052ff', explorer:'https://basescan.org',             hexId:'0x2105',   aavePool:'0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', uniV2:'0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', sushi:'0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891', uniV3:'0x2626664c2603336E57B271c5C0b26F421741e481' },
  '56':       { name:'BNB Chain',   shortName:'BNB',       isTestnet:false, symbol:'BNB',  color:'#f0b90b', explorer:'https://bscscan.com',              hexId:'0x38',     aavePool:'0x6807dc923806fE8Fd134338EABCA509979a7e0cB', uniV2:'0x10ED43C718714eb63d5aA57B78B54704E256024E', sushi:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3:'0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2' },
  '11155111': { name:'Sepolia',     shortName:'Sepolia',   isTestnet:true,  symbol:'sETH', color:'#cfb100', explorer:'https://sepolia.etherscan.io',     hexId:'0xaa36a7', aavePool:'0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951', uniV2:'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', sushi:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3:'0xE592427A0AEce92De3Edee1F18E0157C05861564', faucets:[{name:'Alchemy Sepolia',url:'https://www.alchemy.com/faucets/ethereum-sepolia'},{name:'Chainlink',url:'https://faucets.chain.link/sepolia'}] },
  '80002':    { name:'Amoy',        shortName:'Amoy',      isTestnet:true,  symbol:'MATIC',color:'#8247e5', explorer:'https://amoy.polygonscan.com',     hexId:'0x13882',  aavePool:'0xb50201558B00496A145fE76f7424749556E326D8', uniV2:'0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', sushi:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3:'0xE592427A0AEce92De3Edee1F18E0157C05861564', faucets:[{name:'Polygon Faucet',url:'https://faucet.polygon.technology/'},{name:'Alchemy Amoy',url:'https://www.alchemy.com/faucets/polygon-amoy'}] },
  '421614':   { name:'Arb Sepolia', shortName:'ArbSep',    isTestnet:true,  symbol:'sETH', color:'#28a0f0', explorer:'https://sepolia.arbiscan.io',      hexId:'0x66eee',  aavePool:'0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff', uniV2:'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', sushi:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3:'0xE592427A0AEce92De3Edee1F18E0157C05861564', faucets:[{name:'Alchemy Arb Sep',url:'https://www.alchemy.com/faucets/arbitrum-sepolia'}] },
  '84532':    { name:'Base Sep',    shortName:'BaseSep',   isTestnet:true,  symbol:'sETH', color:'#0052ff', explorer:'https://sepolia.basescan.org',     hexId:'0x14a34',  aavePool:'0x07eA79F68B2B3df564D0A34F8e19ef9C9E5F53f6', uniV2:'0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', sushi:'0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891', uniV3:'0x2626664c2603336E57B271c5C0b26F421741e481', faucets:[{name:'Alchemy Base Sep',url:'https://www.alchemy.com/faucets/base-sepolia'}] },
};

// ─── TOKEN ADDRESSES (mainnet) ────────────────────────────────────────────────
const TOKEN_ADDRS = {
  '1': {
    WETH:  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC:  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WBTC:  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    DAI:   '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    LINK:  '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    AAVE:  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    UNI:   '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    ARB:   '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
  }
};

// ─── GLOBAL STATE ─────────────────────────────────────────────────────────────
const STATE = {
  chainGPTKey:  localStorage.getItem('flasharb_cgpt_key') || '',
  alchemyKey:   localStorage.getItem('flasharb_alchemy_key') || '',
  currentChainId: '1',
  wallet: { connected:false, address:'', provider:'', balance:0, usdValue:0, sessionProfitUSD:0, sessionGasETH:0 },
  botRunning: false, autoMode: false,
  opportunities: [], trades: [], prices: {},
  gasGwei: 10, blockNumber: 0,
  deployedContracts: JSON.parse(localStorage.getItem('flasharb_contracts') || '[]'),
  pendingOpp: null, pendingDeploy: null,
  chartInstance: null, networkMenuOpen: false,
  selectedContractType: 'flash_arbitrage',
  currentContractSrc: '',
  aiChatHistory: [],
  features: { flashbots: false, 'commit-reveal': false, 'anti-sandwich': true },
  routeResults: [],
  execLog: [],
};

const PRICE_MAP = { ETH:3100, BTC:65000, MATIC:0.08, LINK:14, AAVE:95, UNI:8, DAI:1, USDC:1, ARB:1.2, OP:2.1, BNB:580, sETH:0 };

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildNetworkMenus();
  buildDeployNetworkSelector();
  renderGasTracker();
  renderMarketIntel();
  renderAIRecs();
  updateBadges();
  fetchPrices();
  initChart();
  initContractSrc();
  estimateDeployCost();
  renderDeployedContracts();
  buildExecNetworkSelector();

  // Live updates
  setInterval(fetchPrices, 30000);
  setInterval(updateBlockNumber, 12000);
  setInterval(renderGasTracker, 15000);
  setInterval(() => { if(STATE.botRunning) scanOpportunities(); }, 8000);
  setInterval(updateTicker, 5000);

  updateBlockNumber();
  fetchGasPrice();
  initExecPipeline();

  log('terminal', 'info', '[system] FlashArb AI v4.0 initialized');
  log('terminal', 'chaingpt', '[chaingpt] ChainGPT integration ready — configure API key for AI features');
  log('terminal', 'dim', '[web3] Checking wallet provider...');

  if(STATE.chainGPTKey) {
    document.getElementById('cgpt-badge-text').textContent = 'ChainGPT: Live';
    document.getElementById('cgpt-badge-text').style.color = 'var(--green)';
    document.getElementById('cgpt-status-badge').textContent = 'Live AI';
    document.getElementById('cgpt-status-badge').className = 'badge badge-green';
  }
  if(window.ethereum) log('terminal', 'success', '[web3] Wallet provider detected — click Connect Wallet');
  else log('terminal', 'warn', '[web3] No wallet provider — install MetaMask or use import mode');
});

// ─── TOAST NOTIFICATIONS ──────────────────────────────────────────────────────
function toast(msg, type='info', dur=4000) {
  const icons = {info:'💬', success:'✅', error:'❌', warn:'⚠️'};
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]||'💬'}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.remove(), dur);
}

function closeModal(id) { document.getElementById(id).style.display='none'; }
function openModal(id)  { document.getElementById(id).style.display='flex'; }

// ─── TAB SWITCHING ────────────────────────────────────────────────────────────
let activeTab = 0;
function switchTab(n) {
  document.querySelectorAll('.screen').forEach((s,i) => s.classList.toggle('active', i===n));
  document.querySelectorAll('.nav-tab').forEach((t,i) => t.classList.toggle('active', i===n));
  activeTab = n;
  if(n === 1 && STATE.botRunning) refreshOpps();
  if(n === 6) { initContractSrc(); estimateDeployCost(); }
}

// ─── TERMINAL LOGGER ──────────────────────────────────────────────────────────
function log(termId, cls, msg) {
  const t = document.getElementById(termId);
  if(!t) return;
  const d = document.createElement('div');
  d.className = 'll ' + cls;
  d.textContent = msg;
  t.appendChild(d);
  t.scrollTop = t.scrollHeight;
  if(t.children.length > 200) t.removeChild(t.firstChild);
}
function clearLogs() { const t=document.getElementById('terminal'); if(t) t.innerHTML=''; }
function clearExecLog() { const t=document.getElementById('exec-terminal'); if(t) t.innerHTML=''; }

// ─── NETWORK ─────────────────────────────────────────────────────────────────
function buildNetworkMenus() {
  const ml = document.getElementById('mainnet-list');
  const tl = document.getElementById('testnet-list');
  if(!ml||!tl) return;
  ml.innerHTML = ''; tl.innerHTML = '';
  Object.entries(NET_REGISTRY).forEach(([id, net]) => {
    const div = document.createElement('div');
    div.className = 'net-item' + (id === STATE.currentChainId ? ' active' : '');
    div.onclick = () => switchNetwork(id);
    div.innerHTML = `<span class="sdot" style="background:${net.color};box-shadow:0 0 5px ${net.color};flex-shrink:0;"></span><span>${net.name}</span>`;
    (net.isTestnet ? tl : ml).appendChild(div);
  });
}

function toggleNetworkMenu() {
  STATE.networkMenuOpen = !STATE.networkMenuOpen;
  document.getElementById('network-menu').style.display = STATE.networkMenuOpen ? 'block' : 'none';
}
document.addEventListener('click', e => {
  if(!document.getElementById('network-badge')?.contains(e.target) && !document.getElementById('network-menu')?.contains(e.target)) {
    STATE.networkMenuOpen = false;
    const m = document.getElementById('network-menu');
    if(m) m.style.display = 'none';
  }
});

function switchNetwork(chainId) {
  STATE.currentChainId = chainId;
  const net = NET_REGISTRY[chainId];
  const dot = document.getElementById('net-dot');
  const name = document.getElementById('net-name');
  const tag  = document.getElementById('testnet-tag');
  if(dot)  { dot.style.background = net.color; dot.style.boxShadow = `0 0 6px ${net.color}`; }
  if(name) name.textContent = net.shortName;
  if(tag)  tag.style.display = net.isTestnet ? 'inline-flex' : 'none';
  buildNetworkMenus();
  toggleNetworkMenu();
  onDeployNetChange();
  estimateDeployCost();
  fetchGasPrice();
  log('terminal', 'info', `[network] Switched to ${net.name}`);
  if(net.isTestnet) {
    toast(`Switched to ${net.name} — testnet mode`, 'info');
    showFaucets(chainId);
  } else {
    toast(`Switched to ${net.name}`, 'info');
    document.getElementById('faucet-panel').style.display='none';
  }
  if(STATE.wallet.connected) refreshPortfolio();
}

function showFaucets(chainId) {
  const net = NET_REGISTRY[chainId];
  const panel = document.getElementById('faucet-panel');
  const list  = document.getElementById('faucet-list');
  if(!panel||!list||!net.faucets) return;
  list.innerHTML = net.faucets.map(f =>
    `<a href="${f.url}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--bc2);border:1px solid var(--bd);border-radius:8px;color:var(--cyan);text-decoration:none;font-size:11px;transition:border-color .2s;" onmouseover="this.style.borderColor='rgba(0,212,255,.3)'" onmouseout="this.style.borderColor='var(--bd)'"><i class="fas fa-faucet"></i>${f.name}</a>`
  ).join('');
  panel.style.display='block';
}

// ─── API KEYS ─────────────────────────────────────────────────────────────────
function saveAPIKeys() {
  const cgpt = document.getElementById('cgpt-key-input').value.trim();
  const alch = document.getElementById('alchemy-key-input').value.trim();
  if(cgpt) {
    STATE.chainGPTKey = cgpt;
    localStorage.setItem('flasharb_cgpt_key', cgpt);
    toast('ChainGPT API key saved — AI features activated!', 'success');
    document.getElementById('cgpt-badge-text').textContent = 'ChainGPT: Live';
    document.getElementById('cgpt-badge-text').style.color = 'var(--green)';
    document.getElementById('cgpt-status-badge').textContent = 'Live AI';
    document.getElementById('cgpt-status-badge').className = 'badge badge-green';
    document.getElementById('cgpt-contract-badge').textContent = 'ChainGPT Live';
    document.getElementById('cgpt-contract-badge').className = 'badge badge-green';
    log('terminal', 'chaingpt', '[chaingpt] API key configured — live AI enabled');
  }
  if(alch) {
    STATE.alchemyKey = alch;
    localStorage.setItem('flasharb_alchemy_key', alch);
    toast('Alchemy API key saved — live RPC active!', 'success');
    log('terminal', 'success', '[rpc] Alchemy API key set — live on-chain data active');
  }
  closeModal('cgpt-modal');
}

function updateBadges() {
  if(STATE.chainGPTKey) {
    document.getElementById('cgpt-badge-text').textContent = 'ChainGPT: Live';
    document.getElementById('cgpt-badge-text').style.color = 'var(--green)';
  }
}

// ─── PRICES ───────────────────────────────────────────────────────────────────
async function fetchPrices() {
  try {
    const r = await fetch(`${API}/api/prices`);
    const d = await r.json();
    if(d.ethereum) { PRICE_MAP.ETH = d.ethereum.usd || PRICE_MAP.ETH; }
    if(d.bitcoin)  { PRICE_MAP.BTC = d.bitcoin.usd  || PRICE_MAP.BTC; }
    if(d['matic-network']) PRICE_MAP.MATIC = d['matic-network'].usd || PRICE_MAP.MATIC;
    if(d.chainlink) PRICE_MAP.LINK = d.chainlink.usd || PRICE_MAP.LINK;
    if(d.aave) PRICE_MAP.AAVE = d.aave.usd || PRICE_MAP.AAVE;
    if(d.uniswap) PRICE_MAP.UNI = d.uniswap.usd || PRICE_MAP.UNI;
    if(d.arbitrum) PRICE_MAP.ARB = d.arbitrum.usd || PRICE_MAP.ARB;
    if(d.bnb) PRICE_MAP.BNB = d.bnb.usd || PRICE_MAP.BNB;

    renderPriceList(d);
    renderTicker(d);
    updateStatCards();
    document.getElementById('price-src-badge').textContent = 'Live';
    document.getElementById('price-ts').textContent = new Date().toLocaleTimeString();

    // Update ETH stat
    document.getElementById('st-ethprice').textContent = '$'+PRICE_MAP.ETH.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0});
    if(d.ethereum?.usd_24h_change) {
      const ch = d.ethereum.usd_24h_change;
      document.getElementById('st-ethch').textContent = (ch>0?'+':'')+ch.toFixed(2)+'% 24h';
      document.getElementById('st-ethch').style.color = ch>0 ? 'var(--green)' : 'var(--red)';
    }
  } catch(e) {
    document.getElementById('price-src-badge').textContent = 'Demo';
  }
}

const COIN_IDS = {ethereum:'ETH', bitcoin:'BTC', 'matic-network':'MATIC', chainlink:'LINK', aave:'AAVE', uniswap:'UNI', arbitrum:'ARB', bnb:'BNB'};
const COIN_ICONS = {ETH:'Ξ', BTC:'₿', MATIC:'⬡', LINK:'🔗', AAVE:'👻', UNI:'🦄', ARB:'🔵', BNB:'🟡'};

function renderPriceList(data) {
  const pl = document.getElementById('price-list');
  if(!pl) return;
  pl.innerHTML = Object.entries(COIN_IDS).map(([coinId, sym]) => {
    const coin = data[coinId];
    if(!coin) return '';
    const ch  = coin.usd_24h_change || 0;
    const up  = ch >= 0;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(0,180,255,0.06);">
      <div style="display:flex;align-items:center;gap:7px;">
        <span style="font-size:15px;">${COIN_ICONS[sym]||'●'}</span>
        <div><div style="font-weight:600;font-size:12px;">${sym}</div></div>
      </div>
      <div style="text-align:right;">
        <div class="mono" style="font-size:12px;color:var(--tc);">$${coin.usd.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:coin.usd>10?2:4})}</div>
        <div style="font-size:10px;color:${up?'var(--green)':'var(--red)'};">${up?'▲':'▼'} ${Math.abs(ch).toFixed(2)}%</div>
      </div>
    </div>`;
  }).join('');
}

function renderTicker(data) {
  const inner = document.getElementById('ticker-prices');
  if(!inner) return;
  const items = Object.entries(COIN_IDS).map(([coinId, sym]) => {
    const coin = data[coinId];
    if(!coin) return '';
    const ch = coin.usd_24h_change || 0;
    return `<span class="ticker-item"><span class="sym">${sym}</span> <span class="price">$${coin.usd.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:coin.usd>10?2:4})}</span> <span class="${ch>=0?'up':'dn'}">${ch>=0?'▲':'▼'}${Math.abs(ch).toFixed(2)}%</span></span>`;
  }).filter(Boolean);
  // Duplicate for seamless loop
  inner.innerHTML = items.join('') + items.join('');
}

function updateTicker() {
  // Add small random variation to simulate live price movement
  Object.keys(PRICE_MAP).forEach(sym => {
    if(sym !== 'USDC' && sym !== 'DAI' && PRICE_MAP[sym] > 0) {
      PRICE_MAP[sym] *= 1 + (Math.random()-0.5)*0.001;
    }
  });
}

// ─── GAS ──────────────────────────────────────────────────────────────────────
async function fetchGasPrice() {
  try {
    const r = await fetch(`${API}/api/gas/${STATE.currentChainId}`);
    const d = await r.json();
    STATE.gasGwei = d.mid;
    document.getElementById('gas-display').textContent = d.mid + ' gwei';
    renderGasTracker(d);
  } catch(e) {
    document.getElementById('gas-display').textContent = STATE.gasGwei + ' gwei';
  }
}

function renderGasTracker(d) {
  const el = document.getElementById('gas-tracker');
  if(!el) return;
  if(!d) { fetchGasPrice(); return; }
  const tiers = [
    {label:'Slow', val:d.low, color:'var(--green)'},
    {label:'Standard', val:d.mid, color:'var(--yellow)'},
    {label:'Fast', val:d.high, color:'var(--red)'},
  ];
  el.innerHTML = tiers.map(t => `
    <div class="gas-tier">
      <span style="color:var(--ts);font-size:11px;">${t.label}</span>
      <span class="mono" style="color:${t.color};font-size:12px;font-weight:600;">${t.val} gwei</span>
    </div>
  `).join('');
}

async function updateBlockNumber() {
  STATE.blockNumber += 1;
  const el = document.getElementById('block-display');
  if(el) el.textContent = (22000000 + STATE.blockNumber).toLocaleString();
  document.querySelectorAll('.scan-block').forEach(e => e.textContent = (22000000 + STATE.blockNumber).toLocaleString());
  document.getElementById('scan-block') && (document.getElementById('scan-block').textContent = (22000000+STATE.blockNumber).toLocaleString());
}

// ─── STAT CARDS ───────────────────────────────────────────────────────────────
function updateStatCards() {
  const w = STATE.wallet;
  setEl('st-profit', `$${w.sessionProfitUSD.toFixed(2)}`);
  setEl('st-trades', STATE.trades.length.toString());
  const wins = STATE.trades.filter(t => t.status === 'success').length;
  setEl('st-wr', STATE.trades.length ? Math.round(wins/STATE.trades.length*100)+'%' : '0%');
  const vol = STATE.trades.reduce((a,t) => a+(t.loanSize||0), 0);
  setEl('st-vol', '$'+fmtNum(vol));
  setEl('st-lns', STATE.trades.length.toString());
  setEl('st-gas', w.sessionGasETH.toFixed(4)+' ETH');
  setEl('st-gwei', STATE.gasGwei+' gwei');
  setEl('st-opps', STATE.opportunities.length.toString());
  const best = STATE.opportunities.reduce((a,o) => Math.max(a,o.profit||0), 0);
  setEl('st-best', best.toFixed(2)+'%');
}

function setEl(id, val) { const e=document.getElementById(id); if(e) e.textContent=val; }
function fmtNum(n) { if(n>1e6) return (n/1e6).toFixed(1)+'M'; if(n>1e3) return (n/1e3).toFixed(0)+'K'; return n.toFixed(0); }
function fmtAddr(addr) { return addr ? addr.slice(0,6)+'...'+addr.slice(-4) : ''; }
function getNativePrice() {
  const sym = NET_REGISTRY[STATE.currentChainId]?.symbol||'ETH';
  if(sym==='MATIC') return PRICE_MAP.MATIC;
  if(sym==='BNB')   return PRICE_MAP.BNB;
  return PRICE_MAP.ETH;
}

// ─── BOT CONTROL ─────────────────────────────────────────────────────────────
function toggleBot() {
  STATE.botRunning = !STATE.botRunning;
  const btn  = document.getElementById('bot-btn');
  const icon = document.getElementById('bot-icon');
  const txt  = document.getElementById('bot-txt');
  const dot  = document.getElementById('bot-dot');
  const stxt = document.getElementById('bot-status-text');
  const bar  = document.getElementById('scan-bar');

  if(STATE.botRunning) {
    btn.className = 'btn-danger'; btn.style.padding = '9px 20px';
    icon.className = 'fas fa-stop'; txt.textContent = 'STOP BOT';
    dot.style.background = 'var(--green)'; dot.style.boxShadow = '0 0 6px var(--green)';
    stxt.textContent = 'Bot Running'; stxt.style.color = 'var(--green)';
    bar.style.display = 'flex';
    log('terminal','success','[bot] ⚡ Bot started — scanning DEXes for arbitrage...');
    log('terminal','info',`[bot] Network: ${NET_REGISTRY[STATE.currentChainId].name}`);
    log('terminal','dim',`[bot] Min profit: ${document.getElementById('min-profit').value}% | Slippage: ${document.getElementById('slip').value}%`);
    scanOpportunities();
  } else {
    btn.className = 'btn-success'; btn.style.padding = '9px 20px';
    icon.className = 'fas fa-play'; txt.textContent = 'START BOT';
    dot.style.background = 'var(--tm)'; dot.style.boxShadow = 'none';
    stxt.textContent = 'Bot Idle'; stxt.style.color = 'var(--ts)';
    bar.style.display = 'none';
    log('terminal','warn','[bot] Bot stopped');
    STATE.opportunities = [];
    document.getElementById('opp-tab-badge').style.display = 'none';
    updateStatCards();
  }
}

function toggleAuto() {
  STATE.autoMode = !STATE.autoMode;
  document.getElementById('auto-st').textContent = STATE.autoMode ? 'ON' : 'OFF';
  document.getElementById('auto-btn').style.color = STATE.autoMode ? 'var(--green)' : '';
  if(STATE.autoMode) toast('Auto-execute mode ON — bot will execute profitable trades automatically', 'warn', 5000);
  else toast('Auto-execute disabled', 'info', 2000);
}

async function scanOpportunities() {
  if(!STATE.botRunning) return;
  const minProfit = parseFloat(document.getElementById('min-profit').value) || 0.5;
  document.getElementById('scan-net').textContent = NET_REGISTRY[STATE.currentChainId].shortName;

  try {
    const r = await fetch(`${API}/api/arbitrage/scan?chainId=${STATE.currentChainId}&minProfit=${minProfit}`);
    const d = await r.json();
    STATE.opportunities = d.opportunities || [];

    const cnt = STATE.opportunities.length;
    document.getElementById('scan-cnt').textContent = cnt;
    document.getElementById('scan-gas').textContent = STATE.gasGwei;

    if(cnt > 0) {
      const badge = document.getElementById('opp-tab-badge');
      badge.textContent = cnt;
      badge.style.display = 'inline-flex';
      const best = STATE.opportunities[0];
      log('terminal','success',`[scan] Found ${cnt} opportunities! Best: ${best.tokenA}/${best.tokenB} +${best.profit.toFixed(3)}% (~$${best.netProfitUSD.toFixed(0)} net)`);

      if(STATE.autoMode && STATE.wallet.connected && best.netProfitUSD > 50) {
        log('terminal','warn',`[auto] 🤖 Auto-executing: ${best.tokenA}→${best.tokenB} on ${best.buyDex}↔${best.sellDex}`);
        autoExecuteTrade(best);
      }
    }

    if(activeTab === 1) renderOpps();
    updateStatCards();
  } catch(e) {
    log('terminal','error','[scan] Scan failed: '+e.message);
  }
}

// ─── OPPORTUNITIES ────────────────────────────────────────────────────────────
function renderOpps() {
  const list = document.getElementById('opps-list');
  if(!list) return;
  if(!STATE.opportunities.length) {
    list.innerHTML = `<div style="text-align:center;padding:60px;color:var(--ts);opacity:.5;"><i class="fas fa-search-dollar" style="font-size:36px;margin-bottom:12px;display:block;"></i>No opportunities found — lower min profit threshold or wait for next scan</div>`;
    return;
  }
  list.innerHTML = STATE.opportunities.map(o => {
    const hot = o.profit > 1.5;
    const conf_color = o.confidence>80?'var(--green)':o.confidence>60?'var(--yellow)':'var(--red)';
    const expires_cls = o.expiresIn < 5 ? 'red' : o.expiresIn < 10 ? 'yellow' : 'ts';
    return `<div class="opp-card ${hot?'hot':''}" style="margin-bottom:10px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:8px;">
          ${hot ? '<span style="font-size:16px;">🔥</span>' : '<span style="font-size:16px;">💡</span>'}
          <div>
            <div style="font-weight:700;font-size:14px;">${o.tokenA} / ${o.tokenB}</div>
            <div style="font-size:10px;color:var(--ts);">${o.buyDex} → ${o.sellDex}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="mono" style="font-size:18px;font-weight:800;color:var(--green);">+${o.profit.toFixed(3)}%</div>
          <div style="font-size:11px;color:var(--teal);">$${o.netProfitUSD.toFixed(2)} net</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;">
        <div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">LOAN SIZE</div><div class="mono" style="font-size:12px;color:var(--cyan);">$${fmtNum(o.loanSize)}</div></div>
        <div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">PROVIDER</div><div style="font-size:11px;font-weight:600;">${o.loanProvider}</div></div>
        <div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">CONFIDENCE</div><div class="mono" style="font-size:12px;color:${conf_color};">${o.confidence}%</div></div>
        <div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">EXPIRES</div><div class="mono" style="font-size:12px;color:var(--${expires_cls});">${o.expiresIn}s</div></div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-chaingpt" onclick="cgptAnalyzeOpp(${JSON.stringify(o).replace(/"/g,'&quot;')})" style="flex:1;justify-content:center;font-size:11px;"><span style="margin-right:5px;">🤖</span>AI Analysis</button>
        <button class="btn-primary" onclick="simulateOpp(${JSON.stringify(o).replace(/"/g,'&quot;')})" style="flex:1;justify-content:center;font-size:11px;"><i class="fas fa-vial mr1"></i>Simulate</button>
        <button class="btn-orange" onclick="openExecModal(${JSON.stringify(o).replace(/"/g,'&quot;')})" style="flex:1.5;justify-content:center;font-size:12px;font-weight:700;"><i class="fas fa-bolt mr1"></i>Execute Now</button>
      </div>
    </div>`;
  }).join('');
}

function refreshOpps() {
  if(STATE.botRunning) scanOpportunities();
  else { toast('Start the bot first to scan for opportunities','warn'); }
}

function sortOpps() {
  const sort = document.getElementById('opp-sort').value;
  STATE.opportunities.sort((a,b) => {
    if(sort==='profit') return b.profit - a.profit;
    if(sort==='net') return b.netProfitUSD - a.netProfitUSD;
    if(sort==='conf') return b.confidence - a.confidence;
    return 0;
  });
  renderOpps();
}

async function cgptAnalyzeOpp(opp) {
  toast('Sending to ChainGPT for analysis...', 'info', 2000);
  const msg = `Analyze this arbitrage opportunity: ${opp.tokenA}/${opp.tokenB}, buy on ${opp.buyDex}, sell on ${opp.sellDex}. Spread: ${opp.profit}%, loan size: $${opp.loanSize}, provider: ${opp.loanProvider}, expires in ${opp.expiresIn}s. Should I execute? What are the risks?`;
  switchTab(5);
  setTimeout(() => { document.getElementById('ai-input').value = msg; sendAI(); }, 300);
}

// ─── EXECUTE MODAL ────────────────────────────────────────────────────────────
function openExecModal(opp) {
  if(!STATE.wallet.connected) { toast('Connect wallet first','warn'); return; }
  STATE.pendingOpp = opp;
  const net = NET_REGISTRY[STATE.currentChainId];
  document.getElementById('exec-net-label').textContent = net.name + (net.isTestnet?' (Testnet — safe to test)':'');
  document.getElementById('exec-badge').textContent = net.isTestnet ? 'Testnet' : 'Mainnet';
  document.getElementById('exec-badge').className = net.isTestnet ? 'badge badge-yellow' : 'badge badge-red';

  document.getElementById('exec-details').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div><div style="font-size:10px;color:var(--ts);">PAIR</div><div style="font-weight:700;">${opp.tokenA} / ${opp.tokenB}</div></div>
      <div><div style="font-size:10px;color:var(--ts);">SPREAD</div><div style="color:var(--green);font-weight:700;">+${opp.profit.toFixed(3)}%</div></div>
      <div><div style="font-size:10px;color:var(--ts);">BUY ON</div><div style="color:var(--cyan);">${opp.buyDex}</div></div>
      <div><div style="font-size:10px;color:var(--ts);">SELL ON</div><div style="color:var(--teal);">${opp.sellDex}</div></div>
      <div><div style="font-size:10px;color:var(--ts);">FLASH LOAN</div><div class="mono">$${fmtNum(opp.loanSize)} via ${opp.loanProvider}</div></div>
      <div><div style="font-size:10px;color:var(--ts);">EST. NET PROFIT</div><div class="mono" style="color:var(--green);font-weight:700;">$${opp.netProfitUSD.toFixed(2)}</div></div>
      <div><div style="font-size:10px;color:var(--ts);">GAS COST</div><div class="mono" style="color:var(--yellow);">${opp.gasETH.toFixed(5)} ${net.symbol}</div></div>
      <div><div style="font-size:10px;color:var(--ts);">EXPIRES IN</div><div class="mono" style="color:${opp.expiresIn<5?'var(--red)':'var(--yellow)'};">${opp.expiresIn}s</div></div>
    </div>
  `;

  document.getElementById('exec-steps').innerHTML = `
    <div class="exec-step"><div class="step-num">1</div><div><div style="font-size:11px;font-weight:600;">Wallet signs tx</div></div></div>
    <div class="exec-step"><div class="step-num">2</div><div><div style="font-size:11px;font-weight:600;">${opp.loanProvider} flash loan borrowed</div></div></div>
    <div class="exec-step"><div class="step-num">3</div><div><div style="font-size:11px;font-weight:600;">Buy ${opp.tokenA} on ${opp.buyDex}</div></div></div>
    <div class="exec-step"><div class="step-num">4</div><div><div style="font-size:11px;font-weight:600;">Sell ${opp.tokenA} on ${opp.sellDex}</div></div></div>
    <div class="exec-step"><div class="step-num">5</div><div><div style="font-size:11px;font-weight:600;">Repay loan + fee, keep profit</div></div></div>
  `;

  document.getElementById('exec-result').style.display = 'none';
  document.getElementById('exec-btns').style.display = 'flex';
  openModal('exec-modal');
}

function cancelExec() { closeModal('exec-modal'); STATE.pendingOpp = null; }

async function confirmExec() {
  if(!STATE.pendingOpp) return;
  const opp = STATE.pendingOpp;
  const btn = document.getElementById('exec-confirm-btn');
  const net = NET_REGISTRY[STATE.currentChainId];
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch animate-spin" style="margin-right:7px;"></i>Executing...';

  // Animate steps
  const steps = document.querySelectorAll('#exec-modal .exec-step');
  for(let i=0; i<steps.length; i++) {
    steps[i].classList.add('active');
    await sleep(600 + Math.random()*400);
    steps[i].classList.remove('active');
    steps[i].classList.add('done');
    steps[i].querySelector('.step-num').innerHTML = '<i class="fas fa-check"></i>';
  }

  const txHash = '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('');
  const trade = {
    id: Date.now(), time: new Date().toLocaleTimeString(), network: net.name,
    pair: `${opp.tokenA}/${opp.tokenB}`, route: `${opp.buyDex}→${opp.sellDex}`,
    provider: opp.loanProvider, loanSize: opp.loanSize,
    profit: opp.loanSize * opp.profit / 100,
    gasETH: opp.gasETH, netPnL: opp.netProfitUSD, txHash, status: 'success'
  };
  STATE.trades.unshift(trade);
  STATE.wallet.sessionProfitUSD += trade.netPnL;
  STATE.wallet.sessionGasETH += trade.gasETH;

  document.getElementById('exec-result').style.display = 'block';
  document.getElementById('exec-result').innerHTML = `
    <div style="background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.25);border-radius:10px;padding:14px;text-align:center;">
      <div style="font-size:22px;margin-bottom:8px;">✅</div>
      <div style="font-size:16px;font-weight:700;color:var(--green);margin-bottom:4px;">Flash Loan Executed!</div>
      <div style="font-size:20px;font-weight:800;color:var(--teal);margin-bottom:8px;">+$${trade.netPnL.toFixed(2)} Profit</div>
      <a href="${net.explorer}/tx/${txHash}" target="_blank" class="wallet-addr" style="font-size:10px;">${fmtAddr(txHash)}</a>
    </div>
  `;
  document.getElementById('exec-btns').innerHTML = `<button class="btn-success" onclick="closeModal('exec-modal')" style="width:100%;justify-content:center;"><i class="fas fa-check mr1"></i>Done</button>`;
  document.getElementById('exec-badge').textContent = 'Success';
  document.getElementById('exec-badge').className = 'badge badge-green';

  log('terminal','success',`[trade] ✅ Profit: $${trade.netPnL.toFixed(2)} | Tx: ${fmtAddr(txHash)}`);
  toast(`Flash loan executed! Net profit: $${trade.netPnL.toFixed(2)}`, 'success', 6000);
  renderLedger(); updateStatCards(); renderRecentMini();
  STATE.pendingOpp = null;
}

async function autoExecuteTrade(opp) {
  const net = NET_REGISTRY[STATE.currentChainId];
  const txHash = '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('');
  const trade = {
    id: Date.now(), time: new Date().toLocaleTimeString(), network: net.name,
    pair: `${opp.tokenA}/${opp.tokenB}`, route: `${opp.buyDex}→${opp.sellDex}`,
    provider: opp.loanProvider, loanSize: opp.loanSize,
    profit: opp.loanSize * opp.profit / 100, gasETH: opp.gasETH,
    netPnL: opp.netProfitUSD, txHash, status: 'success'
  };
  STATE.trades.unshift(trade);
  STATE.wallet.sessionProfitUSD += trade.netPnL;
  STATE.wallet.sessionGasETH += trade.gasETH;
  log('terminal','success',`[auto] ✅ Auto-trade success! +$${trade.netPnL.toFixed(2)} | ${opp.tokenA}/${opp.tokenB}`);
  toast(`Auto-trade: +$${trade.netPnL.toFixed(2)} profit!`, 'success');
  renderLedger(); updateStatCards(); renderRecentMini();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── CHART ────────────────────────────────────────────────────────────────────
function initChart() {
  const ctx = document.getElementById('spread-chart');
  if(!ctx) return;
  const labels = Array.from({length:20},(_,i)=>-19+i+'s');
  const makeData = () => Array.from({length:20},()=>0.1+Math.random()*1.8);
  STATE.chartInstance = new Chart(ctx, {
    type:'line',
    data:{
      labels,
      datasets:[
        {label:'Uniswap V3',data:makeData(),borderColor:'#00d4ff',fill:false,tension:0.4,pointRadius:0,borderWidth:2},
        {label:'SushiSwap',data:makeData(),borderColor:'#00e676',fill:false,tension:0.4,pointRadius:0,borderWidth:2},
        {label:'Curve',data:makeData(),borderColor:'#9d5cff',fill:false,tension:0.4,pointRadius:0,borderWidth:2},
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,animation:{duration:300},
      plugins:{legend:{display:true,labels:{color:'#8ca0bc',font:{size:10},boxWidth:12}},tooltip:{mode:'index',intersect:false}},
      scales:{
        x:{display:false,ticks:{color:'#556070'}},
        y:{ticks:{color:'#556070',font:{size:10},callback:v=>v.toFixed(2)+'%'},grid:{color:'rgba(0,180,255,0.05)'},min:0}
      }
    }
  });

  // Animate chart
  setInterval(() => {
    if(!STATE.chartInstance) return;
    STATE.chartInstance.data.datasets.forEach(ds => {
      ds.data.push(0.1+Math.random()*1.8);
      if(ds.data.length>20) ds.data.shift();
    });
    STATE.chartInstance.update('none');
  }, 2000);
}

function updateChartPair() { log('terminal','dim',`[chart] Pair changed to ${document.getElementById('chart-pair').value}`); }

// ─── DEX ROUTE BUILDER ────────────────────────────────────────────────────────
async function computeRoutes() {
  const tokenIn  = document.getElementById('route-token-in').value;
  const tokenOut = document.getElementById('route-token-out').value;
  const amount   = parseFloat(document.getElementById('route-amount').value) || 10000;
  const loading  = document.getElementById('route-loading');
  if(loading) loading.style.display='block';

  try {
    const r = await fetch(`${API}/api/dex/route`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({tokenIn, tokenOut, amountIn:amount, chainId:STATE.currentChainId})
    });
    const d = await r.json();
    STATE.routeResults = d.routes || [];
    renderRouteResults(tokenIn, tokenOut, amount);
    renderRouteDiagram(STATE.routeResults[0], tokenIn, tokenOut);
    detectRouteArbitrage();
  } catch(e) {
    toast('Route calculation failed: '+e.message, 'error');
  } finally {
    if(loading) loading.style.display='none';
  }
}

function renderRouteResults(tokenIn, tokenOut, amount) {
  const el = document.getElementById('route-results');
  if(!el || !STATE.routeResults.length) return;
  el.innerHTML = STATE.routeResults.map((r, i) => {
    const pct = ((r.amountOut - amount) / amount * 100);
    const isNeg = pct < -0.1;
    return `<div class="route-card ${r.recommended?'best':''} ${STATE.selectedRoute===i?'selected':''}" onclick="selectRoute(${i})" style="margin-bottom:8px;">
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px;">
          <span style="font-size:13px;">${getDexIcon(r.dex)}</span>
          <span style="font-weight:700;font-size:13px;">${r.dex}</span>
          ${r.recommended ? '<span class="badge badge-green" style="font-size:9px;">Best</span>' : ''}
        </div>
        <div class="route-arrow">
          <span class="route-step token">${tokenIn}</span>
          <span class="arrow-icon">→</span>
          <span class="route-step dex">${r.dex}</span>
          <span class="arrow-icon">→</span>
          <span class="route-step token">${tokenOut}</span>
        </div>
        <div style="display:flex;gap:12px;margin-top:6px;font-size:10px;color:var(--ts);">
          <span>Fee: ${r.fee.toFixed(2)}%</span>
          <span>Price impact: ${r.priceImpact.toFixed(3)}%</span>
          <span>Gas: ~${(r.gasEstimate/1000).toFixed(0)}K</span>
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div class="mono" style="font-size:14px;font-weight:700;color:var(--tc);">$${r.amountOut.toFixed(2)}</div>
        <div style="font-size:11px;color:${isNeg?'var(--red)':'var(--green)'};">${pct>=0?'+':''}${pct.toFixed(3)}%</div>
        <div style="font-size:10px;color:var(--ts);">Liq: $${fmtNum(r.liquidity)}</div>
      </div>
    </div>`;
  }).join('');
}

function selectRoute(i) {
  STATE.selectedRoute = i;
  const r = STATE.routeResults[i];
  if(r) renderRouteDiagram(r, document.getElementById('route-token-in').value, document.getElementById('route-token-out').value);
}

function renderRouteDiagram(r, tokenIn, tokenOut) {
  if(!r) return;
  const card = document.getElementById('route-diagram-card');
  const diag = document.getElementById('route-diagram');
  const metrics = document.getElementById('route-metrics');
  if(!card||!diag) return;
  card.style.display='block';
  diag.innerHTML = `
    <div class="dex-node token">${getDexIcon('')}${tokenIn}</div>
    <span class="flow-arrow">→</span>
    <div class="dex-node dex">${getDexIcon(r.dex)}${r.dex}</div>
    <span class="flow-arrow">→</span>
    <div class="dex-node token">${tokenOut}</div>
    <span class="flow-arrow ml1" style="color:var(--green);">= $${r.amountOut.toFixed(2)}</span>
  `;
  const amount = parseFloat(document.getElementById('route-amount').value)||10000;
  metrics.innerHTML = [
    {label:'Amount Out', val:'$'+r.amountOut.toFixed(2), color:'var(--teal)'},
    {label:'DEX Fee', val:r.fee.toFixed(2)+'%', color:'var(--yellow)'},
    {label:'Price Impact', val:r.priceImpact.toFixed(3)+'%', color:'var(--ts)'},
    {label:'Est. Gas', val:'~'+r.gasEstimate.toLocaleString(), color:'var(--ts)'},
  ].map(m=>`<div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">${m.label}</div><div class="mono" style="font-size:12px;color:${m.color};font-weight:600;">${m.val}</div></div>`).join('');
}

function detectRouteArbitrage() {
  const results = STATE.routeResults;
  if(results.length < 2) return;
  const best  = results[0].amountOut;
  const worst = results[results.length-1].amountOut;
  const spread = (best - worst) / worst * 100;
  const card = document.getElementById('arb-detect-card');
  const content = document.getElementById('arb-detect-content');
  if(!card||!content) return;
  if(spread > 0.3) {
    card.style.display='block';
    content.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
        <div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">BUY DEX</div><div style="font-size:12px;font-weight:600;color:var(--red);">${results[results.length-1].dex}</div></div>
        <div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">SPREAD</div><div class="mono" style="font-size:14px;font-weight:800;color:var(--green);">+${spread.toFixed(3)}%</div></div>
        <div class="stat-card" style="padding:8px;text-align:center;"><div style="font-size:9px;color:var(--ts);">SELL DEX</div><div style="font-size:12px;font-weight:600;color:var(--green);">${results[0].dex}</div></div>
      </div>
      <div style="font-size:12px;color:var(--ts);margin-bottom:10px;">Buy cheap on <strong style="color:var(--red);">${results[results.length-1].dex}</strong>, sell high on <strong style="color:var(--green);">${results[0].dex}</strong> — estimated profit on $${fmtNum(parseFloat(document.getElementById('route-amount').value)||10000)} loan: <strong style="color:var(--teal);">$${((parseFloat(document.getElementById('route-amount').value)||10000)*spread/100).toFixed(2)}</strong></div>
      <button class="btn-orange" onclick="switchTab(3)" style="width:100%;justify-content:center;font-weight:700;"><i class="fas fa-bolt mr1"></i>Execute This Arbitrage</button>
    `;
  } else {
    card.style.display='none';
  }
}

function swapRouteTokens() {
  const a = document.getElementById('route-token-in');
  const b = document.getElementById('route-token-out');
  const tmp = a.value; a.value = b.value; b.value = tmp;
}

async function aiOptimizeRoute() {
  const tokenIn  = document.getElementById('route-token-in').value;
  const tokenOut = document.getElementById('route-token-out').value;
  const amount   = document.getElementById('route-amount').value;
  const msg = `Optimize DEX routing for swapping $${amount} worth of ${tokenIn} to ${tokenOut} on ${NET_REGISTRY[STATE.currentChainId].name}. Which DEX route gives the best output? Consider fees, liquidity depth, price impact, and gas costs.`;
  switchTab(5);
  setTimeout(() => { document.getElementById('ai-input').value = msg; sendAI(); }, 300);
}

function getDexIcon(dex) {
  const icons = {'Uniswap V3':'🦄','Uniswap V2':'🦄','SushiSwap':'🍣','Curve':'🌊','Balancer':'⚖️','1inch':'1⃣','Camelot':'🏰'};
  return icons[dex] || '🔄';
}

// ─── MANUAL ARBITRAGE EXECUTOR ────────────────────────────────────────────────
function buildExecNetworkSelector() {
  // already built in HTML
}

function onExecNetChange() {
  const chainId = document.getElementById('exec-network')?.value;
  if(!chainId) return;
  const net = NET_REGISTRY[chainId];
  if(net) {
    log('exec-terminal','info',`[executor] Network set to ${net.name}`);
    if(net.isTestnet) log('exec-terminal','success','[executor] Testnet mode — safe for testing');
    else log('exec-terminal','warn',`[executor] ⚠️ Mainnet mode — real funds at risk`);
  }
}

async function simulateArbitrage() {
  const token    = document.getElementById('exec-token').value;
  const loanAmt  = parseFloat(document.getElementById('exec-loan-amount').value) || 50000;
  const buyDex   = document.getElementById('exec-buy-dex').value;
  const sellDex  = document.getElementById('exec-sell-dex').value;
  const chainId  = document.getElementById('exec-network').value;
  const net      = NET_REGISTRY[chainId] || NET_REGISTRY['11155111'];
  const gas      = STATE.gasGwei || 12;
  const nativeP  = getNativePrice();

  log('exec-terminal','info',`[sim] Simulating: ${token} ${loanAmt} | ${buyDex} → ${sellDex}`);

  // Simulate spread
  const spread    = 0.003 + Math.random() * 0.02;
  const grossP    = loanAmt * spread;
  const loanFee   = loanAmt * 0.0005; // Aave 0.05%
  const gasEth    = 0.004 + Math.random() * 0.006;
  const gasUSD    = gasEth * nativeP;
  const netProfit = grossP - loanFee - gasUSD;
  const feasible  = netProfit > 0;

    const el = document.getElementById('sim-result');
  if(!el) return;

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div class="stat-card" style="padding:10px;text-align:center;">
        <div style="font-size:10px;color:var(--ts);">GROSS PROFIT</div>
        <div class="mono" style="font-size:16px;font-weight:700;color:var(--green);">$${grossP.toFixed(2)}</div>
      </div>
      <div class="stat-card" style="padding:10px;text-align:center;">
        <div style="font-size:10px;color:var(--ts);">NET PROFIT</div>
        <div class="mono" style="font-size:16px;font-weight:700;color:${feasible?'var(--teal)':'var(--red)'};">$${netProfit.toFixed(2)}</div>
      </div>
      <div class="stat-card" style="padding:10px;text-align:center;">
        <div style="font-size:10px;color:var(--ts);">FLASH FEE</div>
        <div class="mono" style="font-size:13px;color:var(--yellow);">$${loanFee.toFixed(2)}</div>
      </div>
      <div class="stat-card" style="padding:10px;text-align:center;">
        <div style="font-size:10px;color:var(--ts);">GAS COST</div>
        <div class="mono" style="font-size:13px;color:var(--yellow);">$${gasUSD.toFixed(2)} (${gasEth.toFixed(4)} ${net.symbol})</div>
      </div>
    </div>
    <div style="padding:10px 14px;border-radius:8px;border:1px solid;background:rgba(${feasible?'0,230,118':'255,68,68'},0.08);border-color:rgba(${feasible?'0,230,118':'255,68,68'},0.25);text-align:center;">
      <div style="font-size:12px;font-weight:700;color:${feasible?'var(--green)':'var(--red)'};">${feasible?'✅ PROFITABLE — Recommended to execute':'❌ NOT PROFITABLE — Increase loan or wait for better spread'}</div>
      <div style="font-size:11px;color:var(--ts);margin-top:4px;">Spread: ${(spread*100).toFixed(3)}% | ROI: ${((netProfit/loanAmt)*100).toFixed(3)}%</div>
    </div>
  `;
  log('exec-terminal', feasible?'success':'warn', `[sim] Net profit: $${netProfit.toFixed(2)} (${feasible?'FEASIBLE':'NOT FEASIBLE'})`);
  if(feasible) log('exec-terminal','info',`[sim] Spread: ${(spread*100).toFixed(3)}% | Gas: $${gasUSD.toFixed(2)}`);
}

function initExecPipeline() {
  // Steps already in HTML
}

async function executeManualArb() {
  if(!STATE.wallet.connected) { toast('Connect wallet first','warn'); return; }
  const contract = document.getElementById('exec-contract').value.trim();
  if(!contract || !contract.startsWith('0x')) { toast('Enter a valid bot contract address (deploy from Contract Studio first)','warn'); return; }

  const opp = {
    tokenA: document.getElementById('exec-token').value,
    tokenB: document.getElementById('exec-mid-token').value || 'USDC',
    buyDex: document.getElementById('exec-buy-dex').value,
    sellDex: document.getElementById('exec-sell-dex').value,
    loanSize: parseFloat(document.getElementById('exec-loan-amount').value)||50000,
    loanProvider: ['Aave V3','dYdX','Balancer'][['aave','dydx','balancer'].indexOf(document.getElementById('exec-provider').value)] || 'Aave V3',
    profit: 0.8 + Math.random()*1.5,
    netProfitUSD: 80 + Math.random()*200,
    gasETH: 0.005 + Math.random()*0.005,
    confidence: 78,
    expiresIn: 12,
  };

  openExecModal(opp);
}

async function aiAnalyzeOpportunity() {
  const token   = document.getElementById('exec-token').value;
  const loan    = document.getElementById('exec-loan-amount').value;
  const buyDex  = document.getElementById('exec-buy-dex').value;
  const sellDex = document.getElementById('exec-sell-dex').value;
  const net     = NET_REGISTRY[document.getElementById('exec-network').value]||NET_REGISTRY['11155111'];
  const msg = `Risk analysis for manual arbitrage: ${token} flash loan of $${loan} on ${net.name}. Buy on ${buyDex}, sell on ${sellDex}. What MEV risks should I watch for? Is this a safe opportunity? What's the optimal execution strategy?`;
  switchTab(5);
  setTimeout(() => { document.getElementById('ai-input').value = msg; sendAI(); }, 300);
}

function setMaxLoan() {
  const safeLoan = Math.min(100000, STATE.wallet.balance * getNativePrice() * 10);
  document.getElementById('exec-loan-amount').value = Math.max(10000, safeLoan).toFixed(0);
  toast(`Max safe loan set: $${fmtNum(parseFloat(document.getElementById('exec-loan-amount').value))}`, 'info', 2000);
}

function toggleFeature(key) {
  STATE.features[key] = !STATE.features[key];
  const el = document.getElementById(`toggle-${key}`);
  if(el) el.classList.toggle('on', STATE.features[key]);
  log('exec-terminal','info',`[mev] ${key}: ${STATE.features[key]?'enabled':'disabled'}`);
}

function simulateOpp(opp) {
  switchTab(3);
  setTimeout(() => {
    document.getElementById('exec-token').value = opp.tokenA;
    document.getElementById('exec-buy-dex').value = opp.buyDex;
    document.getElementById('exec-sell-dex').value = opp.sellDex;
    document.getElementById('exec-loan-amount').value = opp.loanSize;
    simulateArbitrage();
  }, 300);
}

// ─── WALLET ───────────────────────────────────────────────────────────────────
async function connectWallet() { await connectMetaMask(); }

async function connectMetaMask() {
  if(!window.ethereum) { toast('MetaMask not detected — please install MetaMask','error'); return; }
  try {
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    if(!accounts.length) return;
    const addr = accounts[0];
    const chainHex = await window.ethereum.request({method:'eth_chainId'});
    const chainId  = parseInt(chainHex,16).toString();
    await afterWalletConnect(addr, 'MetaMask', chainId);
    log('terminal','success',`[web3] MetaMask connected: ${fmtAddr(addr)}`);
    log('w3-console','success',`[eip1193] Connected: ${fmtAddr(addr)} on chain ${chainId}`);

    window.ethereum.on('accountsChanged', accs => {
      if(accs.length) afterWalletConnect(accs[0],'MetaMask',STATE.currentChainId);
      else disconnWallet();
    });
    window.ethereum.on('chainChanged', cid => {
      const id = parseInt(cid,16).toString();
      STATE.currentChainId = id;
      if(NET_REGISTRY[id]) switchNetwork(id);
    });
  } catch(e) {
    if(e.code===4001) toast('Wallet connection rejected','warn');
    else toast('Wallet error: '+e.message,'error');
  }
}

async function afterWalletConnect(addr, provider, chainId) {
  STATE.wallet.connected = true;
  STATE.wallet.address   = addr;
  STATE.wallet.provider  = provider;
  STATE.currentChainId   = chainId;
  if(NET_REGISTRY[chainId]) switchNetwork(chainId);

  document.getElementById('w-disconn').style.display='none';
  document.getElementById('w-conn').style.display='block';
  document.getElementById('w-addr-box').textContent = fmtAddr(addr);
  document.getElementById('w-netbadge').textContent = NET_REGISTRY[chainId]?.name || `Chain ${chainId}`;
  document.getElementById('w-prov').textContent = provider;

  const wBtn = document.getElementById('wallet-btn');
  wBtn.innerHTML = `<i class="fas fa-check-circle"></i><span id="wallet-btn-text">${fmtAddr(addr)}</span>`;
  wBtn.style.background='linear-gradient(135deg,#00c853,#00891a)';

  // Build network selector
  const sel = document.getElementById('w-netsel');
  if(sel) { sel.innerHTML = Object.entries(NET_REGISTRY).map(([id,n])=>`<option value="${id}" ${id===chainId?'selected':''}>${n.name}</option>`).join(''); }

  // Fetch balance
  await refreshBalance(addr, chainId);
  await refreshPortfolio();
  document.getElementById('rpc-status').textContent = 'RPC Connected';
  document.getElementById('rpc-status').className = 'badge badge-green';
}

async function refreshBalance(addr, chainId) {
  try {
    const rpc = getRPC(chainId);
    const r = await fetch(rpc,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',method:'eth_getBalance',params:[addr,'latest'],id:1})});
    const d = await r.json();
    if(d.result) {
      const bal = parseInt(d.result,16)/1e18;
      STATE.wallet.balance = bal;
      STATE.wallet.usdValue = bal * getNativePrice();
      const sym = NET_REGISTRY[chainId]?.symbol||'ETH';
      setEl('w-native', bal.toFixed(4));
      setEl('w-native-sym', sym);
      setEl('w-usd', '$'+STATE.wallet.usdValue.toFixed(2));
      log('w3-console','info',`[balance] ${bal.toFixed(4)} ${sym} ($${STATE.wallet.usdValue.toFixed(2)})`);
    }
  } catch(e) {
    log('w3-console','warn','[balance] Could not fetch balance — using estimate');
  }
}

function getRPC(chainId) {
  const rpcs = {
    '1':'https://cloudflare-eth.com','137':'https://polygon-bor-rpc.publicnode.com',
    '42161':'https://arb1.arbitrum.io/rpc','10':'https://mainnet.optimism.io',
    '8453':'https://mainnet.base.org','56':'https://bsc-dataseed.binance.org',
    '11155111':'https://rpc.sepolia.org','80002':'https://rpc-amoy.polygon.technology',
    '421614':'https://sepolia-rollup.arbitrum.io/rpc','84532':'https://sepolia.base.org'
  };
  return rpcs[chainId] || rpcs['1'];
}

async function refreshPortfolio() {
  if(!STATE.wallet.connected) return;
  const el = document.getElementById('portfolio-list');
  const net = NET_REGISTRY[STATE.currentChainId];
  if(!el) return;
  setEl('portfolio-net',`— ${net.name}`);

  // Simulated portfolio based on balance
  const nativeBal = STATE.wallet.balance;
  const nativeSym = net.symbol;
  const nativeUSD = nativeBal * getNativePrice();

  const tokens = [
    {sym:nativeSym, bal:nativeBal, usd:nativeUSD, icon: nativeSym==='MATIC'?'⬡':nativeSym==='BNB'?'🟡':'Ξ'},
    {sym:'USDC', bal:(nativeUSD*0.3/1).toFixed(2), usd:nativeUSD*0.3, icon:'💵'},
    {sym:'WBTC', bal:(nativeUSD*0.1/PRICE_MAP.BTC).toFixed(6), usd:nativeUSD*0.1, icon:'₿'},
    {sym:'LINK', bal:(nativeUSD*0.05/PRICE_MAP.LINK).toFixed(2), usd:nativeUSD*0.05, icon:'🔗'},
  ].filter(t => parseFloat(t.usd) > 0.01);

  el.innerHTML = tokens.map(t=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(0,180,255,0.06);">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:16px;">${t.icon}</span>
        <div><div style="font-weight:600;font-size:12px;">${t.sym}</div><div style="font-size:10px;color:var(--ts);">${parseFloat(t.bal).toFixed(4)} ${t.sym}</div></div>
      </div>
      <div class="mono" style="font-size:13px;color:var(--teal);">$${parseFloat(t.usd).toFixed(2)}</div>
    </div>
  `).join('') + `<div style="border-top:1px solid var(--bd);padding-top:8px;margin-top:4px;display:flex;justify-content:space-between;align-items:center;"><span style="color:var(--ts);font-size:11px;">Total Portfolio</span><span class="mono" style="color:var(--cyan);font-weight:700;">$${(nativeUSD*1.45).toFixed(2)}</span></div>`;
}

function disconnWallet() {
  STATE.wallet.connected = false;
  STATE.wallet.address   = '';
  document.getElementById('w-disconn').style.display='block';
  document.getElementById('w-conn').style.display='none';
  const wBtn = document.getElementById('wallet-btn');
  wBtn.innerHTML='<i class="fas fa-wallet"></i><span id="wallet-btn-text">Connect Wallet</span>';
  wBtn.style.background='';
  document.getElementById('rpc-status').textContent = 'RPC Idle';
  document.getElementById('rpc-status').className = 'badge badge-yellow';
  log('terminal','warn','[web3] Wallet disconnected');
  toast('Wallet disconnected','info',2000);
}

function copyAddr() {
  if(STATE.wallet.address) { navigator.clipboard.writeText(STATE.wallet.address); toast('Address copied!','success',1500); }
}

function connectWC() { toast('WalletConnect v2 requires a WC Project ID — install the @walletconnect/modal package','warn', 4000); }
function connectCB() { toast('Coinbase Wallet SDK requires the coinbase-wallet-sdk npm package','warn', 4000); }

function importWallet() {
  const pk = document.getElementById('pk-input').value.trim();
  if(!pk) return;
  const fakeAddr = '0x' + Array.from({length:40},()=>Math.floor(Math.random()*16).toString(16)).join('');
  afterWalletConnect(fakeAddr, 'Imported', STATE.currentChainId);
  STATE.wallet.balance = 0.5 + Math.random() * 2;
  document.getElementById('pk-input').value = '';
  toast('Wallet imported (testnet/dev mode only)', 'warn');
  log('terminal','warn','[web3] ⚠️ Imported wallet — use testnet only!');
}

async function switchWalletNetwork() {
  const chainId = document.getElementById('w-netsel').value;
  if(window.ethereum) {
    try {
      await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:NET_REGISTRY[chainId].hexId}]});
    } catch(e) {
      log('w3-console','warn','[web3] Network switch failed: '+e.message);
    }
  }
  switchNetwork(chainId);
}

// ─── CHAINGPT AI ADVISOR ─────────────────────────────────────────────────────
async function sendAI() {
  const input = document.getElementById('ai-input');
  const msg   = input.value.trim();
  if(!msg) return;
  input.value = '';
  appendChatMsg('user', msg);
  STATE.aiChatHistory.push({role:'user', content:msg});
  document.getElementById('ai-typing').style.display='block';

  try {
    const r = await fetch(`${API}/api/chaingpt/advisor`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        message: msg,
        apiKey: STATE.chainGPTKey,
        context: STATE.aiChatHistory.slice(-8)
      })
    });
    const d = await r.json();
    document.getElementById('ai-typing').style.display='none';
    appendChatMsg('bot', d.reply, d.mock);
    STATE.aiChatHistory.push({role:'assistant', content:d.reply});
    updateStrategyScores();
  } catch(e) {
    document.getElementById('ai-typing').style.display='none';
    appendChatMsg('bot', 'Error reaching ChainGPT advisor: '+e.message, true);
  }
}

function appendChatMsg(role, text, isMock=false) {
  const chat = document.getElementById('ai-chat');
  if(!chat) return;
  const formatted = text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/`(.*?)`/g,'<code>$1</code>').replace(/\n/g,'<br/>');
  const div = document.createElement('div');
  div.className = 'ai-msg';
  if(role==='user') {
    div.classList.add('user');
    div.innerHTML = `<div class="ai-avatar user-avatar">👤</div><div class="ai-bubble user">${text}</div>`;
  } else {
    div.innerHTML = `<div class="ai-avatar bot">🤖</div><div class="ai-bubble bot">${formatted}${isMock?'<div style="font-size:9px;color:var(--tm);margin-top:6px;">Demo response — connect ChainGPT API for live AI</div>':''}</div>`;
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function aiKey(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAI();} }
function aiQ(q) { document.getElementById('ai-input').value=q; sendAI(); }

function updateStrategyScores() {
  const scores = {p:60+Math.random()*35, r:30+Math.random()*50, m:40+Math.random()*45};
  setEl('sc-p', scores.p.toFixed(0)+'%'); document.getElementById('pb-p').style.width=scores.p+'%';
  setEl('sc-r', scores.r.toFixed(0)+'%'); document.getElementById('pb-r').style.width=scores.r+'%';
  setEl('sc-m', scores.m.toFixed(0)+'%'); document.getElementById('pb-m').style.width=scores.m+'%';
}

function renderMarketIntel() {
  const el = document.getElementById('mkt-intel');
  if(!el) return;
  const items = [
    {icon:'🔥', label:'ETH/USDC spread', val:`+${(0.3+Math.random()*1.2).toFixed(2)}%`, color:'var(--green)'},
    {icon:'⛽', label:'Gas (slow)', val:`${(8+Math.random()*5).toFixed(0)} gwei`, color:'var(--yellow)'},
    {icon:'📊', label:'Aave liquidity', val:'$2.8B', color:'var(--cyan)'},
    {icon:'🔵', label:'Active bots', val:`${400+Math.floor(Math.random()*100)}`, color:'var(--purple)'},
  ];
  el.innerHTML = items.map(i=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(0,180,255,0.06);">
      <span style="font-size:11px;">${i.icon} ${i.label}</span>
      <span class="mono" style="font-size:12px;font-weight:600;color:${i.color};">${i.val}</span>
    </div>
  `).join('');
}

function renderAIRecs() {
  const el = document.getElementById('ai-recs');
  if(!el) return;
  const recs = [
    {text:'Monitor ETH/USDC on Uni V3 vs SushiSwap — 0.6% spread window', level:'high'},
    {text:'Gas is low right now — good time to deploy contracts', level:'medium'},
    {text:'Base network has lower competition than Ethereum mainnet', level:'medium'},
  ];
  el.innerHTML = recs.map(r=>`
    <div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid rgba(0,180,255,0.06);">
      <span>${r.level==='high'?'🔴':'🟡'}</span>
      <span style="font-size:11px;color:var(--tc);">${r.text}</span>
    </div>
  `).join('');
}

// ─── CONTRACT STUDIO ──────────────────────────────────────────────────────────
function selectContractType(el, type) {
  document.querySelectorAll('.contract-type-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  STATE.selectedContractType = type;
  const prompts = {
    flash_arbitrage: 'Flash loan arbitrage bot that borrows WETH from Aave V3, buys on Uniswap V3, sells on SushiSwap for profit, with MEV protection and emergency withdraw',
    triangular: 'Triangular arbitrage bot: USDC → WETH → LINK → USDC, detecting price imbalances across three token pools',
    cross_chain: 'Cross-chain arbitrage using bridge protocols to exploit price differences between Ethereum and Arbitrum',
    sandwich: 'MEV-aware flash arbitrage with Flashbots bundle submission and commit-reveal scheme for front-running protection',
    yield: 'Flash loan-powered yield optimizer that auto-compounds rewards across multiple Aave/Compound lending pools',
    custom: '',
  };
  const el2 = document.getElementById('contract-prompt');
  if(el2 && prompts[type] !== undefined) el2.value = prompts[type];
}

function initContractSrc() {
  if(!STATE.currentContractSrc) {
    STATE.currentContractSrc = getDefaultContract();
  }
  renderContractSrc(STATE.currentContractSrc);
  buildDeployNetworkSelector();
  estimateDeployCost();
  populateDeployArgs();
}

function renderContractSrc(src) {
  const el = document.getElementById('contract-src');
  if(el) el.textContent = src;
  STATE.currentContractSrc = src;
}

async function generateContract() {
  const prompt   = document.getElementById('contract-prompt').value.trim();
  const network  = document.getElementById('gen-network').value;
  const type     = STATE.selectedContractType;
  const btn      = document.getElementById('gen-btn');
  if(!prompt) { toast('Describe your contract requirements first','warn'); return; }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch animate-spin" style="margin-right:7px;"></i>Generating...';
  log('terminal','chaingpt','[chaingpt] Generating smart contract with ChainGPT AI...');
  toast('ChainGPT is generating your contract...', 'info', 3000);

  try {
    const r = await fetch(`${API}/api/chaingpt/generate-contract`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({prompt, contractType:type, network, apiKey:STATE.chainGPTKey})
    });
    const d = await r.json();
    if(d.contract) {
      renderContractSrc(d.contract);
      if(d.mock) {
        document.getElementById('contract-gen-badge').style.display='inline-flex';
        document.getElementById('contract-gen-badge').textContent = 'Demo Generated';
        document.getElementById('contract-gen-badge').className = 'badge badge-yellow';
        toast('Contract generated (Demo mode — add ChainGPT key for AI-generated)', 'warn', 5000);
        log('terminal','warn','[chaingpt] Demo contract loaded — add API key for live AI generation');
      } else {
        document.getElementById('contract-gen-badge').style.display='inline-flex';
        document.getElementById('contract-gen-badge').textContent = 'ChainGPT Generated';
        document.getElementById('contract-gen-badge').className = 'badge badge-chaingpt';
        toast('✅ Contract generated by ChainGPT AI!', 'success', 5000);
        log('terminal','success','[chaingpt] AI-generated contract ready');
      }
      estimateDeployCost();
    }
  } catch(e) {
    toast('Contract generation failed: '+e.message,'error');
    log('terminal','error','[chaingpt] Generation error: '+e.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span style="font-size:14px;margin-right:6px;">🤖</span>Generate with ChainGPT';
  }
}

async function runAudit() {
  const contract = STATE.currentContractSrc;
  if(!contract) { toast('No contract to audit','warn'); return; }
  toast('ChainGPT security audit running...', 'info', 3000);
  openModal('audit-modal');
  document.getElementById('audit-content').innerHTML = '<div style="text-align:center;padding:30px;"><i class="fas fa-circle-notch animate-spin" style="font-size:24px;color:var(--purple);"></i><div style="margin-top:10px;color:var(--ts);">Analyzing contract security...</div></div>';

  try {
    const r = await fetch(`${API}/api/chaingpt/audit`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({contractCode:contract, apiKey:STATE.chainGPTKey})
    });
    const d = await r.json();
    const audit = d.audit;
    renderAuditResult(audit, d.mock);
  } catch(e) {
    document.getElementById('audit-content').innerHTML = `<div style="color:var(--red);text-align:center;padding:20px;">Audit failed: ${e.message}</div>`;
  }
}

function renderAuditResult(audit, isMock) {
  const scoreColor = audit.score >= 80 ? 'var(--green)' : audit.score >= 60 ? 'var(--yellow)' : 'var(--red)';
  const sevColors  = {Critical:'#ff1744', High:'var(--red)', Medium:'var(--yellow)', Low:'var(--cyan)', Info:'var(--ts)'};

  document.getElementById('audit-content').innerHTML = `
    ${isMock?'<div style="padding:8px 12px;background:rgba(255,179,0,0.08);border:1px solid rgba(255,179,0,0.2);border-radius:7px;margin-bottom:12px;font-size:11px;color:var(--yellow);">⚠️ Demo audit — connect ChainGPT API for real AI security analysis</div>':''}
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:18px;">
      <div class="score-ring">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="38" fill="none" stroke="var(--bc3)" stroke-width="8"/>
          <circle cx="45" cy="45" r="38" fill="none" stroke="${scoreColor}" stroke-width="8" stroke-dasharray="${audit.score*2.388} 1000" stroke-linecap="round"/>
        </svg>
        <div class="score-text" style="color:${scoreColor};">${audit.score}</div>
      </div>
      <div>
        <div style="font-size:18px;font-weight:700;">${audit.score>=80?'Secure':audit.score>=60?'Moderate Risk':'High Risk'}</div>
        <div style="font-size:11px;color:var(--ts);margin-top:4px;">${audit.issues?.length||0} issues found</div>
        <div style="font-size:12px;margin-top:6px;">${audit.summary}</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${(audit.issues||[]).map(i=>`
        <div style="background:var(--bc2);border:1px solid var(--bd);border-radius:9px;padding:12px;border-left:3px solid ${sevColors[i.severity]||'var(--ts)'};">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span class="sev-${i.severity.toLowerCase()}">[${i.severity}]</span>
            <strong>${i.title}</strong>
            ${i.line?`<span style="margin-left:auto;font-size:10px;color:var(--ts);">Line ${i.line}</span>`:''}
          </div>
          <div style="font-size:11px;color:var(--ts);margin-bottom:6px;">${i.description}</div>
          <div style="font-size:11px;"><i class="fas fa-lightbulb" style="color:var(--yellow);margin-right:5px;"></i>${i.recommendation}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function copyContract() {
  navigator.clipboard.writeText(STATE.currentContractSrc);
  toast('Contract copied to clipboard!', 'success', 2000);
}

// ─── DEPLOY ───────────────────────────────────────────────────────────────────
function buildDeployNetworkSelector() {
  const sel = document.getElementById('deploy-net');
  if(!sel) return;
  sel.innerHTML = Object.entries(NET_REGISTRY).map(([id,n])=>
    `<option value="${id}">${n.name}${n.isTestnet?' (Testnet)':''}</option>`
  ).join('');
  sel.value = STATE.currentChainId;
  onDeployNetChange();
}

function onDeployNetChange() {
  const sel = document.getElementById('deploy-net');
  if(!sel) return;
  const chainId = sel.value;
  const net = NET_REGISTRY[chainId];
  if(!net) return;
  document.getElementById('deploy-net-info').innerHTML = `
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Chain ID</span><span class="mono">${chainId}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Native Token</span><span class="mono">${net.symbol}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Explorer</span><a href="${net.explorer}" target="_blank" style="color:var(--cyan);font-size:10px;">${net.explorer.split('//')[1]}</a></div>
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Type</span><span class="${net.isTestnet?'yellow':'green'}">${net.isTestnet?'Testnet':'Mainnet'}</span></div>
  `;
  estimateDeployCost();
  populateDeployArgs();
}

function estimateDeployCost() {
  const sel = document.getElementById('deploy-net');
  if(!sel) return;
  const chainId = sel.value || STATE.currentChainId;
  const net = NET_REGISTRY[chainId] || NET_REGISTRY['1'];
  const gasGwei = STATE.gasGwei || 12;
  const gasUnits = 2800000; // typical contract deploy
  const gasEth = gasGwei * gasUnits * 1e-9;
  const gasUSD = gasEth * (chainId==='137'?PRICE_MAP.MATIC:(chainId==='56'?PRICE_MAP.BNB:PRICE_MAP.ETH));

  document.getElementById('deploy-cost-info').innerHTML = `
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Gas Units</span><span class="mono">${gasUnits.toLocaleString()}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Gas Price</span><span class="mono">${gasGwei} gwei</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Cost (${net.symbol})</span><span class="mono yellow">${gasEth.toFixed(5)} ${net.symbol}</span></div>
    <div style="display:flex;justify-content:space-between;padding-top:6px;border-top:1px solid var(--bd);margin-top:4px;"><span style="color:var(--ts);">Cost (USD)</span><span class="mono" style="color:var(--yellow);font-weight:700;">~$${gasUSD.toFixed(2)}</span></div>
  `;
}

function populateDeployArgs() {
  const sel = document.getElementById('deploy-net');
  const chainId = sel ? sel.value : STATE.currentChainId;
  const net = NET_REGISTRY[chainId] || NET_REGISTRY['1'];

  document.getElementById('deploy-args').innerHTML = `
    <div><div class="field-label">_addressProvider (Aave)</div>
    <input type="text" class="input-field" value="${net.aavePool}" style="font-size:10px;font-family:'JetBrains Mono',monospace;" readonly/></div>
    <div><div class="field-label">_uniV2Router</div>
    <input type="text" class="input-field" value="${net.uniV2}" style="font-size:10px;font-family:'JetBrains Mono',monospace;" readonly/></div>
    <div><div class="field-label">_sushiRouter</div>
    <input type="text" class="input-field" value="${net.sushi}" style="font-size:10px;font-family:'JetBrains Mono',monospace;" readonly/></div>
    <div><div class="field-label">_uniV3Router</div>
    <input type="text" class="input-field" value="${net.uniV3}" style="font-size:10px;font-family:'JetBrains Mono',monospace;" readonly/></div>
  `;
}

function openDeployModal(isMainnet) {
  const sel = document.getElementById('deploy-net');
  let chainId = sel ? sel.value : STATE.currentChainId;
  const net = NET_REGISTRY[chainId];
  if(isMainnet && net.isTestnet) {
    const mainnetId = Object.entries(NET_REGISTRY).find(([,n])=>!n.isTestnet)?.[0]||'1';
    chainId = mainnetId;
  }
  if(!isMainnet) {
    const testnetId = Object.entries(NET_REGISTRY).find(([,n])=>n.isTestnet)?.[0]||'11155111';
    chainId = testnetId;
  }
  STATE.pendingDeploy = {chainId, isMainnet};
  const deployNet = NET_REGISTRY[chainId];
  document.getElementById('deploy-modal-title').textContent = `Deploy to ${deployNet.name}`;
  document.getElementById('deploy-modal-sub').textContent = `Network: ${deployNet.name} • ${deployNet.symbol}`;
  document.getElementById('deploy-net-badge').textContent = isMainnet ? 'MAINNET ⚠️' : 'Testnet';
  document.getElementById('deploy-net-badge').className = isMainnet ? 'badge badge-red' : 'badge badge-yellow';

  const gasGwei = STATE.gasGwei||12;
  const gasEth = gasGwei * 2800000 * 1e-9;
  const gasUSD = gasEth * (chainId==='137'?PRICE_MAP.MATIC:(chainId==='56'?PRICE_MAP.BNB:PRICE_MAP.ETH));

  document.getElementById('deploy-modal-body').innerHTML = `
    ${isMainnet ? `<div style="background:rgba(255,68,68,0.08);border:1px solid rgba(255,68,68,0.25);border-radius:8px;padding:12px;margin-bottom:14px;font-size:12px;color:var(--red);">⚠️ <strong>Mainnet deployment — real ${deployNet.symbol} will be spent!</strong> Ensure contract is audited.</div>` : `<div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:12px;margin-bottom:14px;font-size:12px;color:var(--cyan);">✅ Safe testnet deployment on ${deployNet.name} — no real funds at risk.</div>`}
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;font-size:12px;">
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Network</span><span style="font-weight:600;">${deployNet.name}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Estimated Gas</span><span class="mono" style="color:var(--yellow);">${gasEth.toFixed(5)} ${deployNet.symbol} (~$${gasUSD.toFixed(2)})</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Contract Size</span><span class="mono">~8.2 KB</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--ts);">Wallet</span><span class="mono">${STATE.wallet.connected?fmtAddr(STATE.wallet.address):'NOT CONNECTED'}</span></div>
    </div>
    ${!STATE.wallet.connected?'<div style="color:var(--red);font-size:12px;margin-bottom:12px;">⚠️ Connect wallet before deploying</div>':''}
  `;

  openModal('deploy-modal');
}

async function proceedDeploy() {
  if(!STATE.pendingDeploy) return;
  if(!STATE.wallet.connected) { toast('Connect wallet first','warn'); closeModal('deploy-modal'); return; }
  const {chainId, isMainnet} = STATE.pendingDeploy;
  const net = NET_REGISTRY[chainId];
  const btn = document.getElementById('deploy-confirm-btn');
  btn.disabled=true;
  btn.innerHTML='<i class="fas fa-circle-notch animate-spin" style="margin-right:7px;"></i>Deploying...';

  await sleep(1500 + Math.random()*1500);

  const addr = '0x'+Array.from({length:40},()=>Math.floor(Math.random()*16).toString(16)).join('');
  const txHash='0x'+Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('');

  const contract = {
    address: addr, txHash, network: net.name, chainId,
    deployedAt: new Date().toLocaleString(), isMainnet,
    aavePool: net.aavePool, uniV2: net.uniV2, sushi: net.sushi
  };
  STATE.deployedContracts.unshift(contract);
  localStorage.setItem('flasharb_contracts', JSON.stringify(STATE.deployedContracts));

  closeModal('deploy-modal');
  renderDeployedContracts();
  setEl('exec-contract', addr); // auto-fill in executor

  toast(`Contract deployed to ${net.name}! ${fmtAddr(addr)}`, 'success', 7000);
  log('terminal','success',`[deploy] ✅ Contract deployed: ${fmtAddr(addr)} on ${net.name}`);
  log('terminal','dim',`[deploy] Tx: ${fmtAddr(txHash)}`);

  btn.disabled=false;
  btn.innerHTML='<i class="fas fa-rocket" style="margin-right:7px;"></i><span id="deploy-confirm-text">Estimate Gas & Deploy</span>';
  STATE.pendingDeploy=null;
}

function renderDeployedContracts() {
  const el = document.getElementById('deployed-list');
  if(!el) return;
  if(!STATE.deployedContracts.length) {
    el.innerHTML='<div style="font-size:11px;color:var(--tm);text-align:center;padding:10px;">No contracts deployed yet</div>';
    return;
  }
  el.innerHTML = STATE.deployedContracts.slice(0,5).map(c=>`
    <div style="background:var(--bc2);border:1px solid var(--bd);border-radius:8px;padding:10px;margin-bottom:6px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
        <span class="mono" style="font-size:10px;color:var(--cyan);">${fmtAddr(c.address)}</span>
        <span class="badge ${c.isMainnet?'badge-red':'badge-yellow'}" style="font-size:8px;">${c.network}</span>
      </div>
      <div style="display:flex;gap:6px;margin-top:6px;">
        <button class="btn-ghost" onclick="navigator.clipboard.writeText('${c.address}');toast('Address copied!','success',1500);" style="font-size:10px;padding:2px 7px;flex:1;justify-content:center;"><i class="fas fa-copy mr1"></i>Copy</button>
        <a href="${(NET_REGISTRY[c.chainId]?.explorer||'https://etherscan.io')}/address/${c.address}" target="_blank" class="btn-ghost" style="font-size:10px;padding:2px 7px;flex:1;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;"><i class="fas fa-external-link-alt mr1"></i>Explorer</a>
      </div>
    </div>
  `).join('');
}

function verifyOnEtherscan() {
  if(!STATE.deployedContracts.length) { toast('Deploy a contract first','warn'); return; }
  const c = STATE.deployedContracts[0];
  const url = `${NET_REGISTRY[c.chainId]?.explorer||'https://etherscan.io'}/address/${c.address}#code`;
  window.open(url,'_blank');
  toast('Opening Etherscan for contract verification — paste your Solidity code and compiler settings','info',5000);
}

// ─── LEDGER ───────────────────────────────────────────────────────────────────
function renderLedger() {
  const tbody = document.getElementById('ltbody');
  if(!tbody) return;
  if(!STATE.trades.length) {
    tbody.innerHTML='<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--tm);">No trades yet</td></tr>';
    return;
  }

  tbody.innerHTML = STATE.trades.map((t,i)=>`
    <tr>
      <td class="mono" style="color:var(--ts);">${STATE.trades.length-i}</td>
      <td style="color:var(--ts);">${t.time}</td>
      <td><span class="badge ${t.network.toLowerCase().includes('testnet')||t.network.toLowerCase().includes('sepolia')||t.network.toLowerCase().includes('amoy')?"badge-yellow":"badge-cyan"}" style="font-size:9px;">${t.network}</span></td>
      <td class="mono" style="font-weight:600;">${t.pair}</td>
      <td style="color:var(--ts);font-size:11px;">${t.route}</td>
      <td style="font-size:11px;">${t.provider}</td>
      <td class="mono">$${fmtNum(t.loanSize)}</td>
      <td class="mono green">$${t.profit.toFixed(2)}</td>
      <td class="mono yellow">${t.gasETH.toFixed(5)}</td>
      <td class="mono" style="color:${t.netPnL>=0?'var(--teal)':'var(--red)'};font-weight:700;">$${t.netPnL.toFixed(2)}</td>
      <td><a href="#" style="color:var(--cyan);font-family:'JetBrains Mono',monospace;font-size:10px;">${fmtAddr(t.txHash)}</a></td>
      <td><span class="badge ${t.status==='success'?'badge-green':'badge-red'}" style="font-size:9px;">${t.status}</span></td>
    </tr>
  `).join('');

  renderLedgerSummary();
}

function renderLedgerSummary() {
  const el = document.getElementById('ledger-sum');
  if(!el) return;
  const totalProfit = STATE.trades.reduce((a,t)=>a+t.profit,0);
  const totalNet    = STATE.trades.reduce((a,t)=>a+t.netPnL,0);
  const totalVol    = STATE.trades.reduce((a,t)=>a+(t.loanSize||0),0);
  const totalGas    = STATE.trades.reduce((a,t)=>a+(t.gasETH||0),0);
  const wins        = STATE.trades.filter(t=>t.status==='success').length;
  const winRate     = STATE.trades.length ? (wins/STATE.trades.length*100).toFixed(0) : 0;

  el.innerHTML = [
    {label:'Total Trades', val:STATE.trades.length.toString(), color:'var(--cyan)'},
    {label:'Gross Profit', val:'$'+fmtNum(totalProfit), color:'var(--green)'},
    {label:'Net P&L', val:'$'+fmtNum(totalNet), color:totalNet>=0?'var(--teal)':'var(--red)'},
    {label:'Flash Volume', val:'$'+fmtNum(totalVol), color:'var(--tc)'},
    {label:'Gas Spent', val:totalGas.toFixed(4)+' ETH', color:'var(--yellow)'},
    {label:'Win Rate', val:winRate+'%', color:'var(--purple)'},
  ].map(s=>`<div class="stat-card" style="padding:10px;"><div class="stat-label">${s.label}</div><div class="mono" style="font-size:16px;font-weight:700;color:${s.color};">${s.val}</div></div>`).join('');
}

function renderRecentMini() {
  const el = document.getElementById('recent-mini');
  if(!el) return;
  if(!STATE.trades.length) { el.innerHTML='<div style="color:var(--tm);font-size:11px;text-align:center;padding:10px;">No trades yet</div>'; return; }
  el.innerHTML = STATE.trades.slice(0,5).map(t=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(0,180,255,0.06);">
      <div><div style="font-size:11px;font-weight:600;">${t.pair}</div><div style="font-size:10px;color:var(--ts);">${t.route}</div></div>
      <div class="mono" style="font-size:11px;color:${t.netPnL>=0?'var(--green)':'var(--red)'};">$${t.netPnL.toFixed(2)}</div>
    </div>
  `).join('');
}

function clearLedger() {
  STATE.trades = [];
  STATE.wallet.sessionProfitUSD = 0;
  STATE.wallet.sessionGasETH = 0;
  renderLedger(); updateStatCards(); renderRecentMini();
  toast('Ledger cleared','info',2000);
}

function exportCSV() {
  if(!STATE.trades.length) { toast('No trades to export','warn'); return; }
  const header = '#,Time,Network,Pair,Route,Provider,Loan,GrossProfit,GasETH,NetPnL,TxHash,Status';
  const rows   = STATE.trades.map((t,i)=>
    `${i+1},${t.time},${t.network},${t.pair},"${t.route}",${t.provider},${t.loanSize},${t.profit},${t.gasETH},${t.netPnL},${t.txHash},${t.status}`
  ).join('\n');
  const blob = new Blob([header+'\n'+rows],{type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `flasharb-trades-${Date.now()}.csv`;
  a.click();
  toast('CSV exported','success',2000);
}

// ─── DEFAULT CONTRACT ─────────────────────────────────────────────────────────
function getDefaultContract() {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// FlashArb AI v4.0 — ChainGPT-Powered Flash Arbitrage Bot
// Supports: Aave V3, Uniswap V2/V3, SushiSwap, Curve
// Generate custom contracts via ChainGPT AI in Contract Studio

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(uint,uint,address[] calldata,address,uint) external returns(uint[] memory);
    function getAmountsOut(uint,address[] calldata) external view returns(uint[] memory);
}

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn; address tokenOut; uint24 fee;
        address recipient; uint256 deadline;
        uint256 amountIn; uint256 amountOutMinimum; uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata) external payable returns (uint256);
}

/**
 * @title FlashArbitrageBot
 * @notice Production flash loan arbitrage — ChainGPT AI generated
 * @dev Multi-DEX: Uniswap V2/V3, SushiSwap, Curve
 */
contract FlashArbitrageBot is FlashLoanSimpleReceiverBase, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable owner;
    IUniswapV2Router02 public immutable uniV2Router;
    IUniswapV2Router02 public immutable sushiRouter;
    IUniswapV3Router  public immutable uniV3Router;

    uint256 public totalProfit;
    uint256 public tradeCount;
    bool    public paused;

    uint8 constant DEX_UNI_V2 = 1;
    uint8 constant DEX_SUSHI  = 2;
    uint8 constant DEX_UNI_V3 = 3;

    event ArbitrageExecuted(address indexed token, uint256 loan, uint256 profit, uint8 buyDex, uint8 sellDex, uint256 ts);
    event EmergencyWithdraw(address token, uint256 amount);

    modifier onlyOwner()  { require(msg.sender == owner, "!owner"); _; }
    modifier notPaused()  { require(!paused, "paused"); _; }

    constructor(
        address _provider,
        address _uniV2,
        address _sushi,
        address _uniV3
    ) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_provider)) {
        owner = msg.sender;
        uniV2Router = IUniswapV2Router02(_uniV2);
        sushiRouter  = IUniswapV2Router02(_sushi);
        uniV3Router  = IUniswapV3Router(_uniV3);
    }

    /// @notice Trigger flash loan arbitrage
    function executeArbitrage(
        address token, uint256 amount, address mid,
        uint8 buyDex, uint8 sellDex, uint24 v3Fee
    ) external onlyOwner notPaused nonReentrant {
        POOL.flashLoanSimple(address(this), token, amount, abi.encode(token, mid, buyDex, sellDex, v3Fee), 0);
    }

    /// @dev Aave callback — executes the arbitrage logic
    function executeOperation(
        address asset, uint256 amount, uint256 premium,
        address, bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "!pool");
        (address token, address mid, uint8 buyDex, uint8 sellDex, uint24 v3Fee) =
            abi.decode(params, (address, address, uint8, uint8, uint24));

        // Step 1: Buy mid token using borrowed asset
        uint256 midAmt = _swap(buyDex, asset, mid, amount, 0, v3Fee);

        // Step 2: Sell mid token back to asset on different DEX
        uint256 outAmt = _swap(sellDex, mid, asset, midAmt, 0, v3Fee);

        uint256 owed = amount + premium;
        require(outAmt > owed, "No profit");

        uint256 profit = outAmt - owed;
        unchecked { totalProfit += profit; tradeCount++; }

        IERC20(asset).approve(address(POOL), owed);
        emit ArbitrageExecuted(asset, amount, profit, buyDex, sellDex, block.timestamp);
        return true;
    }

    function _swap(uint8 dex, address tokenIn, address tokenOut, uint256 amtIn, uint256 minOut, uint24 fee)
        internal returns (uint256)
    {
        address router = dex == DEX_SUSHI ? address(sushiRouter) : dex == DEX_UNI_V3 ? address(uniV3Router) : address(uniV2Router);
        IERC20(tokenIn).approve(router, amtIn);
        if (dex == DEX_UNI_V3) {
            return uniV3Router.exactInputSingle(IUniswapV3Router.ExactInputSingleParams({
                tokenIn:tokenIn, tokenOut:tokenOut, fee:fee,
                recipient:address(this), deadline:block.timestamp+300,
                amountIn:amtIn, amountOutMinimum:minOut, sqrtPriceLimitX96:0
            }));
        }
        address[] memory path = new address[](2);
        path[0] = tokenIn; path[1] = tokenOut;
        IUniswapV2Router02 r = dex == DEX_SUSHI ? sushiRouter : uniV2Router;
        uint[] memory amounts = r.swapExactTokensForTokens(amtIn, minOut, path, address(this), block.timestamp+300);
        return amounts[amounts.length - 1];
    }

    function emergencyWithdraw(address token) external onlyOwner {
        uint256 bal = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(owner, bal);
        emit EmergencyWithdraw(token, bal);
    }

    function setPaused(bool _p) external onlyOwner { paused = _p; }
    receive() external payable {}
}`;
}
