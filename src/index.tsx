import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()
app.use('*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// ─── NETWORK CONFIGS ─────────────────────────────────────────────────────────
const NETWORKS: Record<string, any> = {
  '1': {
    name: 'Ethereum Mainnet', rpcKey: 'eth-mainnet', isTestnet: false, symbol: 'ETH', color: '#627eea',
    explorer: 'https://etherscan.io',
    publicRpcs: ['https://ethereum.publicnode.com','https://rpc.ankr.com/eth','https://cloudflare-eth.com','https://eth.llamarpc.com'],
    aavePool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    uniRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    sushiRouter: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
  },
  '137': {
    name: 'Polygon Mainnet', rpcKey: 'polygon-mainnet', isTestnet: false, symbol: 'MATIC', color: '#8247e5',
    explorer: 'https://polygonscan.com',
    publicRpcs: ['https://polygon-bor-rpc.publicnode.com','https://1rpc.io/matic','https://polygon.drpc.org'],
    aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    uniRouter: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    sushiRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  '42161': {
    name: 'Arbitrum One', rpcKey: 'arb-mainnet', isTestnet: false, symbol: 'ETH', color: '#28a0f0',
    explorer: 'https://arbiscan.io',
    publicRpcs: ['https://arb1.arbitrum.io/rpc','https://rpc.ankr.com/arbitrum','https://arbitrum.llamarpc.com'],
    aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    uniRouter: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
    sushiRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  '10': {
    name: 'Optimism', rpcKey: 'opt-mainnet', isTestnet: false, symbol: 'ETH', color: '#ff0420',
    explorer: 'https://optimistic.etherscan.io',
    publicRpcs: ['https://mainnet.optimism.io','https://rpc.ankr.com/optimism','https://optimism.llamarpc.com'],
    aavePool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    uniRouter: '0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2',
    sushiRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  '8453': {
    name: 'Base Mainnet', rpcKey: 'base-mainnet', isTestnet: false, symbol: 'ETH', color: '#0052ff',
    explorer: 'https://basescan.org',
    publicRpcs: ['https://mainnet.base.org','https://rpc.ankr.com/base','https://base.llamarpc.com'],
    aavePool: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
    uniRouter: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
    sushiRouter: '0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891',
  },
  '56': {
    name: 'BNB Smart Chain', rpcKey: 'bnb-mainnet', isTestnet: false, symbol: 'BNB', color: '#f0b90b',
    explorer: 'https://bscscan.com',
    publicRpcs: ['https://bsc-dataseed.binance.org','https://rpc.ankr.com/bsc','https://bsc.llamarpc.com'],
    aavePool: '0x6807dc923806fE8Fd134338EABCA509979a7e0cB',
    uniRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    sushiRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  '11155111': {
    name: 'Sepolia Testnet', rpcKey: 'eth-sepolia', isTestnet: true, symbol: 'SepoliaETH', color: '#cfb100',
    explorer: 'https://sepolia.etherscan.io',
    publicRpcs: ['https://rpc.sepolia.org','https://rpc2.sepolia.org','https://ethereum-sepolia.publicnode.com'],
    aavePool: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
    uniRouter: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
    sushiRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  '80002': {
    name: 'Polygon Amoy', rpcKey: 'polygon-amoy', isTestnet: true, symbol: 'MATIC', color: '#8247e5',
    explorer: 'https://amoy.polygonscan.com',
    publicRpcs: ['https://rpc-amoy.polygon.technology','https://polygon-amoy.drpc.org'],
    aavePool: '0xb50201558B00496A145fE76f7424749556E326D8',
    uniRouter: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    sushiRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  '421614': {
    name: 'Arbitrum Sepolia', rpcKey: 'arb-sepolia', isTestnet: true, symbol: 'ETH', color: '#28a0f0',
    explorer: 'https://sepolia.arbiscan.io',
    publicRpcs: ['https://sepolia-rollup.arbitrum.io/rpc','https://arbitrum-sepolia.drpc.org'],
    aavePool: '0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff',
    uniRouter: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
    sushiRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  '84532': {
    name: 'Base Sepolia', rpcKey: 'base-sepolia', isTestnet: true, symbol: 'ETH', color: '#0052ff',
    explorer: 'https://sepolia.basescan.org',
    publicRpcs: ['https://sepolia.base.org','https://base-sepolia.drpc.org'],
    aavePool: '0x07eA79F68B2B3df564D0A34F8e19ef9C9E5F53f6',
    uniRouter: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
    sushiRouter: '0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891',
  },
}

// ─── SERVER-SIDE PRICE CACHE ──────────────────────────────────────────────────
let priceCache: { data: Record<string, any>; source: string; ts: number } | null = null
const CACHE_TTL_MS = 60_000

// ─── RPC HELPER ───────────────────────────────────────────────────────────────
async function rpcCall(chainId: string, method: string, params: any[], alchemyKey?: string): Promise<any> {
  const net = NETWORKS[chainId]
  if (!net) throw new Error('Unknown chain')
  const rpcs: string[] = []
  if (alchemyKey && alchemyKey !== 'demo') rpcs.push(`https://${net.rpcKey}.g.alchemy.com/v2/${alchemyKey}`)
  rpcs.push(...(net.publicRpcs || []))
  for (const url of rpcs) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) continue
      const data: any = await res.json()
      if (data.result !== undefined && data.result !== null) return { result: data.result, rpc: url }
    } catch (_) {}
  }
  throw new Error(`All RPCs failed for ${method} on chain ${chainId}`)
}

// ─── TOKEN ADDRESSES ─────────────────────────────────────────────────────────
const TOKENS: Record<string, Record<string, string>> = {
  '1':     { WETH:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', USDC:'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', USDT:'0xdAC17F958D2ee523a2206206994597C13D831ec7', DAI:'0x6B175474E89094C44Da98b954EedeAC495271d0F' },
  '137':   { WMATIC:'0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', USDC:'0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', DAI:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' },
  '42161': { WETH:'0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', USDC:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831', DAI:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1' },
  '10':    { WETH:'0x4200000000000000000000000000000000000006', USDC:'0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', DAI:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1' },
  '8453':  { WETH:'0x4200000000000000000000000000000000000006', USDC:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', DAI:'0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' },
  '56':    { WBNB:'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', USDT:'0x55d398326f99059fF775485246999027B3197955', BUSD:'0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' },
}
const TOKEN_DECIMALS: Record<string, number> = { WETH:18, WMATIC:18, WBNB:18, USDC:6, USDT:6, DAI:18, BUSD:18 }
const NATIVE_WRAPPED: Record<string, string> = { '1':'WETH','137':'WMATIC','42161':'WETH','10':'WETH','8453':'WETH','56':'WBNB' }

function encAddr(addr: string) { return addr.toLowerCase().replace('0x','').padStart(64,'0') }
function encUint(n: bigint) { return n.toString(16).padStart(64,'0') }
function encodeGetAmountsOut(amountIn: bigint, path: string[]) {
  return '0x' + 'd06ca61f' + encUint(amountIn) + encUint(64n) + encUint(BigInt(path.length)) + path.map(encAddr).join('')
}
function decodeAmountsOut(data: string): bigint[] {
  const hex = data.startsWith('0x') ? data.slice(2) : data
  if (hex.length < 128) throw new Error('Malformed response')
  const length = parseInt(hex.slice(64, 128), 16)
  const out: bigint[] = []
  for (let i = 0; i < length; i++) {
    const start = 128 + i * 64
    out.push(BigInt('0x' + hex.slice(start, start + 64)))
  }
  return out
}

async function getDexQuote(chainId: string, router: string, amountIn: bigint, path: string[]): Promise<bigint | null> {
  try {
    const calldata = encodeGetAmountsOut(amountIn, path)
    const { result } = await rpcCall(chainId, 'eth_call', [{ to: router, data: calldata }, 'latest'])
    if (!result || result === '0x') return null
    const amounts = decodeAmountsOut(result)
    const last = amounts[amounts.length - 1]
    return last && last > 0n ? last : null
  } catch (_) { return null }
}

// Aave V3 flash loan premium, matches the constant used in app.js's pre-flight check
const AAVE_PREMIUM_BPS = 9n // 0.09%

// Evaluate the REAL 2-leg arbitrage profit at a given loan size: buy on the
// cheaper DEX, sell on the dearer one, subtract the loan + Aave's premium.
// Returns null if either quote fails.
async function evaluateSizeProfit(
  chainId: string, path: string[], sizeUnits: bigint,
  cheapDexRouter: string, dearDexRouter: string
): Promise<{ sizeUnits: bigint; netProfit: bigint } | null> {
  const midOut = await getDexQuote(chainId, cheapDexRouter, sizeUnits, path)
  if (midOut == null) return null
  const sellOut = await getDexQuote(chainId, dearDexRouter, midOut, [path[1], path[0]])
  if (sellOut == null) return null
  const owed = sizeUnits + (sizeUnits * AAVE_PREMIUM_BPS / 10000n)
  return { sizeUnits, netProfit: sellOut - owed }
}

async function findRealOpportunities(chainId: string): Promise<any[]> {
  const net = NETWORKS[chainId]
  const tokens = TOKENS[chainId]
  if (!net || net.isTestnet || !tokens) return []
  const nativeSym = NATIVE_WRAPPED[chainId]
  const nativeAddr = nativeSym ? tokens[nativeSym] : null
  if (!nativeAddr) return []
  const quoteSymbols = Object.keys(tokens).filter(s => s !== nativeSym)

  // Cheap probe (1 native token) just to see whether the two DEXes disagree
  // on price at all, and by how much — this alone can't tell us a size is
  // tradeable, only that a spread EXISTS at negligible size.
  const probeSize = 10n ** 18n

  const results = await Promise.all(quoteSymbols.map(async (qSym) => {
    const qAddr = tokens[qSym]
    const qDecimals = TOKEN_DECIMALS[qSym] ?? 18
    const path = [nativeAddr, qAddr]
    const [uniProbe, sushiProbe] = await Promise.all([
      getDexQuote(chainId, net.uniRouter, probeSize, path),
      getDexQuote(chainId, net.sushiRouter, probeSize, path),
    ])
    if (uniProbe == null || sushiProbe == null) return null
    const uniPrice = Number(uniProbe) / 10 ** qDecimals
    const sushiPrice = Number(sushiProbe) / 10 ** qDecimals
    const high = Math.max(uniPrice, sushiPrice)
    const low = Math.min(uniPrice, sushiPrice)
    if (low <= 0) return null
    const probeSpreadPct = ((high - low) / low) * 100
    if (probeSpreadPct < 0.03) return null

    const sellDexIsUni = uniPrice >= sushiPrice
    const cheapRouter = sellDexIsUni ? net.sushiRouter : net.uniRouter
    const dearRouter  = sellDexIsUni ? net.uniRouter   : net.sushiRouter
    const buyDex  = sellDexIsUni ? 'SushiSwap'   : 'Uniswap V2'
    const sellDex = sellDexIsUni ? 'Uniswap V2'  : 'SushiSwap'

    // Real pools have finite depth: a spread visible at 1-token size can
    // shrink or vanish at real trade size. Search a geometrically spaced
    // range of sizes (anchored to the probe, not a fixed dollar/token
    // figure) and pick whichever ACTUALLY nets the most profit after the
    // Aave premium — rather than assuming any fixed size just works.
    const candidateMultipliers = [1n, 10n, 100n, 1000n, 10000n]
    const evaluations = await Promise.all(
      candidateMultipliers.map(m => evaluateSizeProfit(chainId, path, probeSize * m, cheapRouter, dearRouter))
    )
    const viable = evaluations.filter((e): e is NonNullable<typeof e> => e !== null && e.netProfit > 0n)
    if (viable.length === 0) return null // spread doesn't survive the Aave fee + price impact at any size we tried

    const best = viable.reduce((a, b) => (b.netProfit > a.netProfit ? b : a))
    const loanAmount = Number(best.sizeUnits / 10n ** 18n) // whole-token count; safe, candidates are 1..10000
    const netProfitTokens = Number(best.netProfit) / 1e18
    const spreadPct = (netProfitTokens / loanAmount) * 100
    const confidence = Math.min(94, Math.round(48 + spreadPct * 35))

    return {
      id: `live-${chainId}-${qSym}-${Date.now()}`,
      tokenPair: `${nativeSym.replace('W','')}/${qSym}`,
      buyDex, sellDex,
      priceOnBuy: parseFloat(low.toFixed(6)),
      priceOnSell: parseFloat(high.toFixed(6)),
      profitPercent: parseFloat(spreadPct.toFixed(4)),
      loanAmount,
      estimatedProfit: parseFloat(netProfitTokens.toFixed(6)), // net of Aave's 0.09% premium, at the size that actually maximizes it
      gasEstimateGwei: 5,
      confidence,
      risk: spreadPct > 1 ? 'HIGH' : spreadPct > 0.3 ? 'MEDIUM' : 'LOW',
      flashLoanProvider: 'Aave V3',
      expiresIn: 12,
      slippage: 0.3,
      flashFee: parseFloat((loanAmount * 0.0009).toFixed(6)),
      source: 'live',
    }
  }))
  return results.filter((r): r is NonNullable<typeof r> => r !== null)
}

// ─── SIMULATED FALLBACK DATA ──────────────────────────────────────────────────
function getSimulatedPrices(): Record<string, any> {
  const base = { ETH:3247,BTC:67234,MATIC:0.072,LINK:14.23,AAVE:98.45,UNI:7.89,DAI:1.0,USDC:1.0,ARB:1.24,OP:2.18,BNB:580 }
  const out: Record<string, any> = {}
  for (const [sym, price] of Object.entries(base)) {
    const drift = (Math.random() - 0.5) * 0.02
    out[sym] = { price: price * (1 + drift), change24h: (Math.random() - 0.48) * 6 }
  }
  return out
}

function generateOpportunities(ethPrice: number): any[] {
  const pairs = [
    { pair:'ETH/USDC', buy:'Uniswap V3', sell:'SushiSwap', base:ethPrice },
    { pair:'ETH/USDT', buy:'SushiSwap', sell:'Curve', base:ethPrice },
    { pair:'ETH/DAI',  buy:'Balancer', sell:'Uniswap V3', base:ethPrice },
    { pair:'WBTC/ETH', buy:'Uniswap V3', sell:'Curve', base:18.7 },
    { pair:'LINK/USDC',buy:'SushiSwap', sell:'Uniswap V3', base:14.23 },
    { pair:'AAVE/ETH', buy:'Uniswap V3', sell:'Balancer', base:0.031 },
    { pair:'ARB/USDC', buy:'Camelot', sell:'SushiSwap', base:1.24 },
    { pair:'OP/USDC',  buy:'Velodrome', sell:'Uniswap V3', base:2.18 },
  ]
  return pairs.slice(0, 4 + Math.floor(Math.random() * 4)).map((p, i) => {
    const spread = 0.08 + Math.random() * 1.8
    const loanAmount = 15000 + Math.floor(Math.random() * 85000)
    const gross = loanAmount * spread / 100
    const flashFee = loanAmount * 0.0009
    const gasUSD = 3 + Math.random() * 12
    const net = gross - flashFee - gasUSD
    return {
      id: `sim-${i}-${Date.now()}`,
      tokenPair: p.pair,
      buyDex: p.buy,
      sellDex: p.sell,
      priceOnBuy: parseFloat((p.base * (1 - spread/200)).toFixed(6)),
      priceOnSell: parseFloat((p.base * (1 + spread/200)).toFixed(6)),
      profitPercent: parseFloat(spread.toFixed(4)),
      loanAmount,
      estimatedProfit: parseFloat(gross.toFixed(2)),
      netProfit: parseFloat(net.toFixed(2)),
      gasEstimateGwei: 4 + Math.floor(Math.random() * 8),
      gasEstimateUSD: parseFloat(gasUSD.toFixed(2)),
      confidence: Math.min(95, 42 + Math.round(spread * 28)),
      risk: spread > 1.2 ? 'HIGH' : spread > 0.5 ? 'MEDIUM' : 'LOW',
      flashLoanProvider: ['Aave V3','Balancer','dYdX'][Math.floor(Math.random()*3)],
      expiresIn: 8 + Math.floor(Math.random() * 20),
      slippage: 0.3,
      flashFee: parseFloat(flashFee.toFixed(2)),
      source: 'simulated',
    }
  })
}

// ─── MULTI-SOURCE PRICE FETCHER ───────────────────────────────────────────────
async function fetchLivePrices(): Promise<{ source: string; data: Record<string, any> }> {
  // 1. CoinGecko free tier
  try {
    const cgIds = 'ethereum,bitcoin,matic-network,chainlink,aave,uniswap,dai,usd-coin,arbitrum,optimism,binancecoin'
    const cgMap: Record<string, string> = {
      'ethereum':'ETH','bitcoin':'BTC','matic-network':'MATIC','chainlink':'LINK',
      'aave':'AAVE','uniswap':'UNI','dai':'DAI','usd-coin':'USDC','arbitrum':'ARB',
      'optimism':'OP','binancecoin':'BNB',
    }
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`,
      { headers: { 'Accept': 'application/json', 'User-Agent': 'FlashArbBot/3.2' }, signal: AbortSignal.timeout(6000) }
    )
    if (res.ok) {
      const raw: any = await res.json()
      if (!raw.status?.error_code) {
        const out: Record<string, any> = {}
        for (const [id, sym] of Object.entries(cgMap)) {
          if ((raw as any)[id]?.usd) out[sym] = { price: (raw as any)[id].usd, change24h: (raw as any)[id].usd_24h_change || 0 }
        }
        if (Object.keys(out).length >= 5) return { source: 'coingecko', data: out }
      }
    }
  } catch (_) {}

  // 2. CryptoCompare
  try {
    const fsyms = 'ETH,BTC,MATIC,LINK,AAVE,UNI,DAI,USDC,ARB,OP,BNB'
    const res = await fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=USD`,
      { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(6000) }
    )
    if (res.ok) {
      const raw: any = await res.json()
      const display = raw.RAW || {}
      const out: Record<string, any> = {}
      for (const sym of fsyms.split(',')) {
        const d = display[sym]?.USD
        if (d?.PRICE) out[sym] = { price: d.PRICE, change24h: d.CHANGEPCT24HOUR || 0 }
      }
      if (Object.keys(out).length >= 5) return { source: 'cryptocompare', data: out }
    }
  } catch (_) {}

  // 3. Kraken
  try {
    const krakenPairs = 'XETHZUSD,XXBTZUSD,LINKUSD,AAVEUSD,UNIUSD,BNBUSD,MATICUSD'
    const res = await fetch(
      `https://api.kraken.com/0/public/Ticker?pair=${krakenPairs}`,
      { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(6000) }
    )
    if (res.ok) {
      const raw: any = await res.json()
      const r = raw.result || {}
      const out: Record<string, any> = { DAI:{price:1.0001,change24h:0.01}, USDC:{price:0.9999,change24h:-0.01}, ARB:{price:1.24,change24h:0}, OP:{price:2.18,change24h:0} }
      const map: Record<string, string> = { XETHZUSD:'ETH',XXBTZUSD:'BTC',LINKUSD:'LINK',AAVEUSD:'AAVE',UNIUSD:'UNI',BNBUSD:'BNB',MATICUSD:'MATIC' }
      for (const [pair, sym] of Object.entries(map)) {
        const t = r[pair]
        if (t?.c?.[0]) out[sym] = { price: parseFloat(t.c[0]), change24h: 0 }
      }
      if (out.ETH) return { source: 'kraken', data: out }
    }
  } catch (_) {}

  // 4. Simulated fallback
  return { source: 'simulated', data: getSimulatedPrices() }
}

async function getLiveEthPrice(): Promise<number> {
  if (priceCache && (Date.now() - priceCache.ts) < CACHE_TTL_MS) return priceCache.data['ETH']?.price || 3247
  try {
    const { data } = await fetchLivePrices()
    priceCache = { data, source: 'live', ts: Date.now() }
    return data['ETH']?.price || 3247
  } catch (_) { return 3247 }
}

// ─── AI ANALYSIS ENGINE ───────────────────────────────────────────────────────
function generateAIAnalysis(query: string, opportunity: any, network: string): string {
  const q = (query || '').toLowerCase()
  const opp = opportunity || {}
  const net = network || 'Multi-chain'

  // Detect query intent
  if (q.includes('risk') || q.includes('safe')) {
    return `## Risk Assessment — ${net}

**Risk Level:** ${opp.risk || 'MEDIUM'} | **Confidence:** ${opp.confidence || 72}%

### Primary Risk Factors

**1. Execution Risk** — Flash loans must complete in a single transaction. If prices move between submission and execution (even 1–2 blocks), the trade fails and you only lose gas. On ${net}, current block time is ~${net.includes('Arbitrum')?'0.25s':net.includes('Polygon')?'2.1s':'12s'}.

**2. MEV / Sandwich Attacks** — Arbitrage transactions in the public mempool are visible to MEV bots. A searcher can front-run your buy and back-run your sell, extracting your profit. **Mitigation:** Use Flashbots Protect RPC (Ethereum) or equivalent private mempools on other chains.

**3. Gas Price Volatility** — Flash loan execution consumes 250K–450K gas. A gas spike from ${opp.gasEstimateGwei || 5} → ${((opp.gasEstimateGwei || 5) * 3).toFixed(0)} gwei can consume your entire margin. Set a **max gas price** limit in your contract.

**4. Slippage & Liquidity Depth** — ${opp.tokenPair || 'This pair'} with a $${(opp.loanAmount || 20000).toLocaleString()} loan may face ${opp.slippage || 0.3}% slippage. Ensure the AMM pool has >10× your trade size in TVL.

**5. Flash Loan Fee** — Aave V3 charges 0.09% ($${(opp.flashFee || 18).toFixed(2)} on this trade). This is deducted from gross profit before gas.

### AI Verdict
${(opp.profitPercent || 0) > 0.8 ? '✅ **Viable** — spread exceeds fees + gas buffer. Proceed with MEV protection.' : '⚠️ **Marginal** — spread barely covers fees. Recommend waiting for a cleaner opportunity (>0.8% spread).'}

> *This analysis is educational. No real transaction is executed.*`
  }

  if (q.includes('gas') || q.includes('fee')) {
    return `## Gas Optimization Guide

### Current Gas Landscape — ${net}

Flash loan arbitrage on ${net} requires **~280,000–420,000 gas units** per execution. Here's how to minimize costs:

**Estimated Gas Cost Breakdown:**
- Flash loan borrow: ~85,000 gas
- DEX swap #1 (buy): ~110,000 gas
- DEX swap #2 (sell): ~110,000 gas
- Flash loan repay: ~45,000 gas
- **Total:** ~350,000 gas

**At current ${opp.gasEstimateGwei || 5} gwei:**
\`Cost = 350,000 × ${opp.gasEstimateGwei || 5} gwei = ${((350000 * (opp.gasEstimateGwei || 5)) / 1e9 * 3247).toFixed(2)} USD\`

### Optimization Strategies

1. **Use Layer 2** — Arbitrum (~$0.05/trade), Base (~$0.04), Optimism (~$0.06) vs Ethereum (~$8–40)
2. **Gas price oracle** — Set maxFeePerGas based on 10th percentile historical gas
3. **Batch calldata** — Pre-approve tokens to save ~40K gas per trade
4. **Contract optimization** — Remove redundant storage writes, use assembly for inner loops
5. **EIP-1559 tips** — Set priority fee at 1.5 gwei (fast) vs 2+ gwei (rapid)

### Break-Even Loan Size at ${opp.gasEstimateGwei || 5} gwei
Assuming 0.5% spread: **minimum $${Math.round((350000 * (opp.gasEstimateGwei || 5) / 1e9 * 3247) / 0.005).toLocaleString()} loan** to break even.`
  }

  if (q.includes('aave') || q.includes('flash loan') || q.includes('provider')) {
    return `## Flash Loan Providers — Comparison

### Aave V3 (Recommended)
- **Fee:** 0.09% (9 bps) — lowest in the market
- **Networks:** Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche
- **Max loan:** Up to full pool liquidity (often $100M+ for USDC/ETH)
- **Interface:** \`POOL.flashLoanSimple()\` or \`flashLoan()\` for multi-asset
- **Security:** Battle-tested, $8.4B TVL, audited by Certik + Trail of Bits

### Balancer (Flash Loans)
- **Fee:** 0% (protocol fees waived, you pay gas only)
- **Networks:** Ethereum, Polygon, Arbitrum
- **Max loan:** Vault balance (~$1.8B ETH pool)
- **Use case:** Best for near-zero-cost loans when your margin is extremely thin
- **Interface:** \`IVault.flashLoan()\`

### dYdX (v3 legacy)
- **Fee:** $0 (gas only) — but limited asset support
- **Networks:** Ethereum only
- **Max loan:** $500M USDC, $80M ETH
- **Limitation:** Being sunset; use dYdX v4 for perpetuals

### AI Recommendation for ${net}
${net.includes('Arbitrum') || net.includes('Base') || net.includes('Optimism') ? '**Use Aave V3** — lowest fee, deepest liquidity on L2s. Balancer is also available but less liquid.' : '**Use Balancer** on Ethereum for tiny-margin trades (0-fee). Switch to **Aave V3** for larger loans with reliable liquidity.'}

> *Always verify contract addresses on official protocol documentation before use.*`
  }

  if (q.includes('strategy') || q.includes('best') || q.includes('recommend')) {
    return `## AI Strategy Recommendations — ${new Date().toLocaleDateString()}

### Top Strategies for Current Market Conditions

**🥇 Strategy 1: L2 Stablecoin Triangular Arbitrage**
- **Route:** USDC → USDT → DAI → USDC across Curve + Uniswap on Arbitrum
- **Expected spread:** 0.05–0.3% (but near-zero gas cost)
- **Minimum profitable loan:** ~$50,000
- **Risk:** VERY LOW — stablecoins rarely depeg >0.5%

**🥈 Strategy 2: ETH/USDC on Ethereum — Classic**
- **Route:** Buy ETH cheap on SushiSwap → sell on Uniswap V3 (or vice versa)
- **Current spread:** ~${(opp.profitPercent || 0.4).toFixed(2)}%
- **Target loan:** $${(opp.loanAmount || 50000).toLocaleString()}
- **Risk:** MEDIUM — gas ($10–40) eats thin margins

**🥉 Strategy 3: Cross-Chain Price Lag (not flash loan)**
- **Route:** ETH price lags 30–90s between chains
- **Method:** Bridge + spot arb (not flash loan)
- **Risk:** HIGH — bridge delays can eliminate the spread

### Current Best Opportunity
${opp.tokenPair ? `**${opp.tokenPair}** — ${opp.profitPercent?.toFixed(3)}% spread
- Buy: ${opp.buyDex} | Sell: ${opp.sellDex}
- Loan: $${(opp.loanAmount || 0).toLocaleString()} | Est. profit: $${(opp.estimatedProfit || 0).toFixed(2)}
- Confidence: ${opp.confidence}% | Risk: ${opp.risk}` : 'No live opportunity loaded — start the bot to scan.'}

### Market Timing Signals
- 🕐 **Best hours:** 08:00–12:00 UTC (EU/US overlap — highest volume)
- 📈 **Bull run spreads:** 0.3–2.0% (high volatility = more arb)
- 📉 **Bear market:** 0.05–0.4% (tighter spreads, lower gas)
- ⚡ **Flash crash:** 1–5% for ~5 minutes — highest opportunity window`
  }

  if (q.includes('contract') || q.includes('solidity') || q.includes('deploy')) {
    return `## Smart Contract Deployment Guide

### FlashArbitrageBot — Architecture

\`\`\`solidity
contract FlashArbitrageBot is FlashLoanSimpleReceiverBase {
    // Inherits from Aave V3's base receiver
    // Auto-handles loan repayment logic
}
\`\`\`

### Deployment Checklist

1. **Compile** — Use Solidity 0.8.20+, enable optimizer (200 runs)
2. **Test on fork** — \`npx hardhat test --fork https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY\`
3. **Deploy to testnet first** — Sepolia, Arbitrum Sepolia, or Base Sepolia
4. **Verify on Etherscan** — Builds trust + helps debug
5. **Fund the contract** — It needs ETH for gas buffer
6. **Whitelist caller** — Only your wallet should call \`executeArbitrage()\`

### Security Considerations

- ✅ **onlyOwner modifier** — restricts execution to deployer
- ✅ **Require(bal >= repay)** — reverts if trade is unprofitable
- ✅ **msg.sender == POOL check** — prevents malicious loan callbacks
- ⚠️ **No upgradeability** — use proxy pattern for production
- ⚠️ **Approve MAX** — minimize on-chain approvals but watch for approval exploits

### Estimated Deploy Costs (${net})
| Network | Gas Est. | Cost USD |
|---------|----------|----------|
| Ethereum | 1.8M gas | ~$35–150 |
| Arbitrum | 1.8M gas | ~$0.50–2 |
| Polygon | 1.8M gas | ~$0.03–0.15 |
| Base | 1.8M gas | ~$0.40–1.50 |`
  }

  // Default general analysis
  return `## FlashArb AI Analysis

### Query: "${query}"

**Network:** ${net} | **Timestamp:** ${new Date().toISOString()}

${opp.tokenPair ? `
### Current Opportunity Analysis
**Pair:** ${opp.tokenPair}
**Spread:** ${opp.profitPercent?.toFixed(4)}% | **Route:** ${opp.buyDex} → ${opp.sellDex}
**Loan:** $${(opp.loanAmount || 0).toLocaleString()} | **Gross Profit:** $${(opp.estimatedProfit || 0).toFixed(2)}
**Flash Fee (0.09%):** -$${(opp.flashFee || 0).toFixed(2)} | **Confidence:** ${opp.confidence}%

### Profitability Breakdown
\`Gross = $${(opp.estimatedProfit || 0).toFixed(2)}\`
\`- Flash fee = $${(opp.flashFee || 0).toFixed(2)}\`
\`- Est gas = $${((opp.gasEstimateGwei || 5) * 300000 / 1e9 * 3247).toFixed(2)}\`
\`= Net ≈ $${((opp.estimatedProfit || 0) - (opp.flashFee || 0) - ((opp.gasEstimateGwei || 5) * 300000 / 1e9 * 3247)).toFixed(2)}\`
` : ''}

### General DeFi Flash Loan Tips

1. **Always simulate first** — Use \`eth_call\` to simulate the entire tx before broadcasting
2. **Monitor mempool** — High pending tx count = gas spike incoming
3. **Use Flashbots RPC** — Submit bundles to avoid front-running on Ethereum
4. **Track spreads over time** — Build a historical database to find recurring patterns
5. **Set profit floor** — Never execute if net profit < $5 (gas risk not worth it)

### Useful Resources
- [Aave Flash Loans Docs](https://docs.aave.com/developers/guides/flash-loans)
- [Uniswap V3 White Paper](https://uniswap.org/whitepaper-v3.pdf)
- [Flashbots Protect](https://protect.flashbots.net/)
- [EigenPhi Arb Analytics](https://eigenphi.io/)

> *FlashArb AI provides educational analysis only. No financial advice.*`
}

// ─── PRICE ENDPOINT ───────────────────────────────────────────────────────────
app.get('/api/alchemy/prices', async (c) => {
  const apiKey = c.req.query('key') || 'demo'
  if (apiKey && apiKey !== 'demo') {
    try {
      const symbols = ['ETH','BTC','MATIC','LINK','AAVE','UNI','DAI','USDC','ARB','OP','BNB']
      const url = `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-symbol?symbols=${symbols.join(',')}`
      const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(6000) })
      if (res.ok) {
        const raw: any = await res.json()
        const items: any[] = raw.data || []
        const out: Record<string, any> = {}
        for (const item of items) {
          const usd = (item.prices || []).find((p: any) => p.currency === 'usd')
          if (usd) out[item.symbol] = { price: parseFloat(usd.value), change24h: 0 }
        }
        if (Object.keys(out).length >= 5) {
          priceCache = { data: out, source: 'alchemy', ts: Date.now() }
          return c.json({ source: 'alchemy', data: out, timestamp: Date.now(), cached: false })
        }
      }
    } catch (_) {}
  }
  const now = Date.now()
  if (priceCache && (now - priceCache.ts) < CACHE_TTL_MS) {
    return c.json({ source: priceCache.source, data: priceCache.data, timestamp: priceCache.ts, cached: true, cacheAgeSeconds: Math.floor((now - priceCache.ts) / 1000) })
  }
  const { source, data } = await fetchLivePrices()
  priceCache = { data, source, ts: now }
  return c.json({ source, data, timestamp: now, cached: false })
})

// ─── GAS ENDPOINT ─────────────────────────────────────────────────────────────
app.get('/api/alchemy/gas', async (c) => {
  const apiKey = c.req.query('key') || 'demo'
  const chainId = c.req.query('chainId') || '1'
  const net = NETWORKS[chainId]
  if (!net) return c.json({ error: 'Unknown chain' }, 400)
  try {
    const { result: gasPriceHex, rpc } = await rpcCall(chainId, 'eth_gasPrice', [], apiKey)
    const gasPriceGwei = parseInt(gasPriceHex, 16) / 1e9
    let baseFee = gasPriceGwei * 0.85
    try {
      const { result: fh } = await rpcCall(chainId, 'eth_feeHistory', ['0x4','latest',[10,50,90]], apiKey)
      if (fh?.baseFeePerGas?.length) baseFee = parseInt(fh.baseFeePerGas[fh.baseFeePerGas.length - 1], 16) / 1e9
    } catch (_) {}
    return c.json({ source: rpc?.includes('alchemy.com') ? 'alchemy' : 'public_rpc', rpcUsed: rpc, gasPrice: gasPriceGwei, baseFee, priorityFee: 1.5, timestamp: Date.now() })
  } catch (_) {}
  const defaults: Record<string, number> = { '1':4,'137':30,'42161':0.1,'10':0.05,'8453':0.05,'56':3,'11155111':3,'80002':30,'421614':0.1,'84532':0.05 }
  const base = defaults[chainId] || 5
  return c.json({ source: 'simulated', gasPrice: base + Math.random() * 0.5, baseFee: base * 0.85, priorityFee: 1.5, timestamp: Date.now() })
})

// ─── BLOCK ENDPOINT ───────────────────────────────────────────────────────────
app.get('/api/alchemy/block', async (c) => {
  const apiKey = c.req.query('key') || 'demo'
  const chainId = c.req.query('chainId') || '1'
  if (!NETWORKS[chainId]) return c.json({ error: 'Unknown chain' }, 400)
  try {
    const { result, rpc } = await rpcCall(chainId, 'eth_blockNumber', [], apiKey)
    return c.json({ source: rpc?.includes('alchemy.com') ? 'alchemy' : 'public_rpc', blockNumber: parseInt(result, 16), rpcUsed: rpc, timestamp: Date.now() })
  } catch (_) {}
  const fallbacks: Record<string, number> = { '1':22500000,'137':58000000,'42161':220000000,'10':120000000,'8453':15000000,'56':40000000 }
  return c.json({ source: 'simulated', blockNumber: (fallbacks[chainId] || 10000000) + Math.floor(Math.random() * 100), timestamp: Date.now() })
})

// ─── BALANCE ENDPOINT ─────────────────────────────────────────────────────────
app.get('/api/alchemy/balance', async (c) => {
  const apiKey = c.req.query('key') || 'demo'
  const chainId = c.req.query('chainId') || '1'
  const address = c.req.query('address') || ''
  if (!NETWORKS[chainId] || !address) return c.json({ error: 'Missing params' }, 400)
  try {
    const { result, rpc } = await rpcCall(chainId, 'eth_getBalance', [address,'latest'], apiKey)
    return c.json({ source: rpc?.includes('alchemy.com') ? 'alchemy' : 'public_rpc', balance: parseInt(result, 16) / 1e18, balanceWei: result, rpcUsed: rpc, timestamp: Date.now() })
  } catch (_) { return c.json({ source: 'error', balance: 0, timestamp: Date.now() }) }
})

// ─── TOKEN BALANCES ───────────────────────────────────────────────────────────
app.get('/api/alchemy/tokens', async (c) => {
  const apiKey = c.req.query('key') || 'demo'
  const chainId = c.req.query('chainId') || '1'
  const address = c.req.query('address') || ''
  const net = NETWORKS[chainId]
  if (!net || !address) return c.json({ error: 'Missing params' }, 400)
  if (apiKey && apiKey !== 'demo') {
    try {
      const rpcUrl = `https://${net.rpcKey}.g.alchemy.com/v2/${apiKey}`
      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc:'2.0', method:'alchemy_getTokenBalances', params:[address,'erc20'], id:1 }),
      })
      if (res.ok) {
        const data: any = await res.json()
        return c.json({ source: 'alchemy', tokens: data.result?.tokenBalances || [], timestamp: Date.now() })
      }
    } catch (_) {}
  }
  return c.json({ source: 'public', tokens: [], note: 'Add Alchemy key for full ERC-20 portfolio', timestamp: Date.now() })
})

// ─── OPPORTUNITIES ENDPOINT ───────────────────────────────────────────────────
app.get('/api/opportunities', async (c) => {
  const chainId = c.req.query('chainId') || '1'
  let ethPrice = 3247
  try { ethPrice = await getLiveEthPrice() } catch (_) {}
  let opportunities: any[] = []
  let source: 'live' | 'simulated' = 'simulated'
  try {
    const live = await findRealOpportunities(chainId)
    if (live.length) {
      let gasGwei = 5
      try { const { result } = await rpcCall(chainId, 'eth_gasPrice', []); gasGwei = parseInt(result, 16) / 1e9 } catch (_) {}
      opportunities = live.map(o => ({ ...o, gasEstimateGwei: Math.round(gasGwei) }))
      source = 'live'
    }
  } catch (_) {}
  if (!opportunities.length) {
    opportunities = generateOpportunities(ethPrice).map(o => ({ ...o, source: 'simulated' }))
    source = 'simulated'
  }
  return c.json({ opportunities, source, chainId, timestamp: Date.now() })
})

// ─── AI ANALYSIS ──────────────────────────────────────────────────────────────
app.post('/api/ai/analyze', async (c) => {
  const body = await c.req.json()
  const analysis = generateAIAnalysis(body.query, body.opportunity, body.network)
  return c.json({ analysis, timestamp: Date.now() })
})

// ─── FLASH LOAN SIMULATION ────────────────────────────────────────────────────
app.post('/api/flashloan/simulate', async (c) => {
  const body = await c.req.json()
  const { amount, tokenPair, route, gasPrice = 5, chainId = '11155111', walletAddress } = body
  const net = NETWORKS[chainId]
  const isTestnet = net?.isTestnet ?? true
  let ethPrice = 3247, nativePrice = 3247
  try {
    if (!priceCache || (Date.now() - priceCache.ts) >= CACHE_TTL_MS) {
      const fresh = await fetchLivePrices()
      priceCache = { data: fresh.data, source: fresh.source, ts: Date.now() }
    }
    ethPrice = priceCache.data['ETH']?.price || 3247
    const symMap: Record<string, string> = { MATIC:'MATIC', BNB:'BNB', ETH:'ETH', SepoliaETH:'ETH' }
    const nativeSym = symMap[net?.symbol || 'ETH'] || 'ETH'
    nativePrice = priceCache.data[nativeSym]?.price || ethPrice
  } catch (_) {}

  const loanAmt = parseFloat(amount) || 10000
  const gasPriceGwei = parseFloat(gasPrice) || 5
  const gasUnits = 320000 + Math.floor(Math.random() * 80000)
  const gasNative = (gasPriceGwei * gasUnits) / 1e9
  const gasUSD = gasNative * nativePrice
  const flashFee = loanAmt * 0.0009
  const grossProfit = loanAmt * (0.2 + Math.random() * 1.4) / 100
  const netProfit = grossProfit - flashFee - gasUSD
  const success = netProfit > 0 && Math.random() > 0.15
  const txHash = `0x${Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`

  return c.json({
    success,
    txHash,
    chainId,
    isTestnet,
    network: net?.name || 'Unknown',
    pair: tokenPair,
    route,
    loanAmount: loanAmt,
    profit: parseFloat(grossProfit.toFixed(2)),
    flashFee: parseFloat(flashFee.toFixed(2)),
    gasEstimateETH: parseFloat(gasNative.toFixed(8)),
    gasEstimateUSD: parseFloat(gasUSD.toFixed(2)),
    gasUnits,
    gasPriceGwei: parseFloat(gasPriceGwei.toFixed(3)),
    netProfitUSD: success ? parseFloat(netProfit.toFixed(2)) : 0,
    ethPrice,
    nativePrice,
    walletAddress: walletAddress || null,
    walletImpact: {
      gasDeductedNative: parseFloat(gasNative.toFixed(8)),
      gasDeductedUSD: parseFloat(gasUSD.toFixed(2)),
      profitAddedUSD: success ? parseFloat(netProfit.toFixed(2)) : 0,
    },
    timestamp: Date.now(),
  })
})

// ─── CONTRACT ESTIMATION ──────────────────────────────────────────────────────
app.post('/api/contract/estimate', async (c) => {
  const body = await c.req.json()
  const { chainId = '1', gasPrice } = body
  const net = NETWORKS[chainId]
  if (!net) return c.json({ error: 'Unknown chain' }, 400)

  let gasPriceGwei = parseFloat(gasPrice) || 5
  try {
    const { result } = await rpcCall(chainId, 'eth_gasPrice', [])
    gasPriceGwei = parseInt(result, 16) / 1e9
  } catch (_) {}

  const nativePriceMap: Record<string, number> = { ETH: priceCache?.data?.ETH?.price || 3247, MATIC: priceCache?.data?.MATIC?.price || 0.07, BNB: priceCache?.data?.BNB?.price || 580, SepoliaETH: 0 }
  const nativeSym = net.symbol
  const nativePriceUSD = nativePriceMap[nativeSym] || (nativePriceMap['ETH'])
  const deployGasUnits = 1800000
  const estimatedCostNative = (gasPriceGwei * deployGasUnits) / 1e9
  const estimatedCostUSD = estimatedCostNative * nativePriceUSD

  return c.json({ chainId, network: net.name, isTestnet: net.isTestnet, gasPriceGwei, deployGasUnits, nativeSymbol: nativeSym, nativePriceUSD, estimatedCostNative, estimatedCostUSD, timestamp: Date.now() })
})

// ─── SERVE INDEX.HTML ─────────────────────────────────────────────────────────
app.get('/', (c) => {
  return c.redirect('/static/index.html')
})

export default app
