import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  CHAINGPT_API_KEY?: string
  ALCHEMY_API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// ─── ChainGPT: Generate Smart Contract ────────────────────────────────────────
app.post('/api/chaingpt/generate-contract', async (c) => {
  const { prompt, contractType, network, apiKey } = await c.req.json()
  const key = apiKey || c.env?.CHAINGPT_API_KEY

  if (!key) {
    return c.json({ error: 'ChainGPT API key required', mock: true, contract: getMockContract(contractType) }, 200)
  }

  try {
    const res = await fetch('https://api.chaingpt.org/chat/stream/create-contract', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ChainGPT',
        messages: [{
          role: 'user',
          content: `Generate a production-ready Solidity smart contract for: ${prompt}. 
          Contract Type: ${contractType}. 
          Target Network: ${network}.
          Requirements:
          - Full Solidity ^0.8.20 with NatSpec documentation
          - Include all imports, events, modifiers
          - Implement flash loan arbitrage with Aave V3 IFlashLoanSimpleReceiver
          - Multi-DEX routing: Uniswap V2/V3, SushiSwap, Curve
          - Reentrancy guards, owner access controls
          - Emergency withdraw and profit extraction functions
          - Gas optimized with unchecked math where safe
          Return ONLY the Solidity code, no markdown.`
        }],
        stream: false
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      return c.json({ error: `ChainGPT API error: ${res.status}`, detail: errText, mock: true, contract: getMockContract(contractType) }, 200)
    }

    const data = await res.json() as any
    const contract = data?.choices?.[0]?.message?.content || data?.content || data?.text || getMockContract(contractType)
    return c.json({ contract, mock: false, model: 'ChainGPT' })
  } catch (err: any) {
    return c.json({ error: err.message, mock: true, contract: getMockContract(contractType) }, 200)
  }
})

// ─── ChainGPT: AI DeFi Advisor ────────────────────────────────────────────────
app.post('/api/chaingpt/advisor', async (c) => {
  const { message, context, apiKey } = await c.req.json()
  const key = apiKey || c.env?.CHAINGPT_API_KEY

  if (!key) {
    return c.json({ reply: getMockAdvisorReply(message), mock: true })
  }

  try {
    const res = await fetch('https://api.chaingpt.org/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ChainGPT',
        messages: [
          {
            role: 'system',
            content: `You are ChainGPT, an expert DeFi and blockchain AI assistant specializing in:
- Flash loan arbitrage strategies across Uniswap, SushiSwap, Curve, Balancer
- Smart contract security, gas optimization, MEV protection  
- Multi-chain DeFi operations (Ethereum, Arbitrum, Polygon, Base, Optimism)
- Real-time on-chain data analysis and opportunity detection
- Solidity best practices and audit findings
Provide concise, actionable, technically accurate advice. Use numbers and specifics.`
          },
          ...(context || []),
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    })

    if (!res.ok) {
      return c.json({ reply: getMockAdvisorReply(message), mock: true })
    }

    const data = await res.json() as any
    const reply = data?.choices?.[0]?.message?.content || getMockAdvisorReply(message)
    return c.json({ reply, mock: false })
  } catch (err: any) {
    return c.json({ reply: getMockAdvisorReply(message), mock: true, error: err.message })
  }
})

// ─── ChainGPT: Audit Contract ─────────────────────────────────────────────────
app.post('/api/chaingpt/audit', async (c) => {
  const { contractCode, apiKey } = await c.req.json()
  const key = apiKey || c.env?.CHAINGPT_API_KEY

  if (!key) {
    return c.json({ audit: getMockAudit(), mock: true })
  }

  try {
    const res = await fetch('https://api.chaingpt.org/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'ChainGPT',
        messages: [{
          role: 'user',
          content: `Perform a comprehensive security audit of this smart contract. 
Check for: reentrancy, integer overflow/underflow, access control, flash loan attack vectors, 
price oracle manipulation, front-running, gas griefing, unchecked external calls.
Return JSON with: { score: 0-100, issues: [{severity: "Critical|High|Medium|Low|Info", title, description, line, recommendation}], summary }

Contract:
${contractCode}`
        }],
        max_tokens: 2048,
        temperature: 0.2
      })
    })

    if (!res.ok) return c.json({ audit: getMockAudit(), mock: true })
    const data = await res.json() as any
    let auditText = data?.choices?.[0]?.message?.content || ''
    
    try {
      const jsonMatch = auditText.match(/\{[\s\S]*\}/)
      const audit = jsonMatch ? JSON.parse(jsonMatch[0]) : getMockAudit()
      return c.json({ audit, mock: false })
    } catch {
      return c.json({ audit: getMockAudit(), mock: true })
    }
  } catch (err: any) {
    return c.json({ audit: getMockAudit(), mock: true })
  }
})

// ─── Multi-DEX Route Calculator ───────────────────────────────────────────────
app.post('/api/dex/route', async (c) => {
  const { tokenIn, tokenOut, amountIn, chainId } = await c.req.json()

  // Simulate real DEX quotes with realistic spread data
  const routes = computeDEXRoutes(tokenIn, tokenOut, amountIn, chainId)
  return c.json({ routes, timestamp: Date.now() })
})

// ─── Arbitrage Scanner ────────────────────────────────────────────────────────
app.get('/api/arbitrage/scan', async (c) => {
  const chainId = c.req.query('chainId') || '1'
  const minProfit = parseFloat(c.req.query('minProfit') || '0.3')
  const opportunities = generateArbitrageOpps(chainId, minProfit)
  return c.json({ opportunities, timestamp: Date.now(), chainId })
})

// ─── Gas Oracle ───────────────────────────────────────────────────────────────
app.get('/api/gas/:chainId', async (c) => {
  const chainId = c.req.param('chainId')
  const gasData = getGasData(chainId)
  return c.json(gasData)
})

// ─── Token Prices (CoinGecko public) ─────────────────────────────────────────
app.get('/api/prices', async (c) => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,matic-network,chainlink,aave,uniswap,arbitrum,optimism,bnb&vs_currencies=usd&include_24hr_change=true',
      { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) throw new Error('CoinGecko error')
    const data = await res.json()
    return c.json(data)
  } catch {
    return c.json({ error: 'Price fetch failed', fallback: true })
  }
})

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (c) => c.json({ status: 'ok', version: '4.0.0', timestamp: Date.now() }))

// ─── Frontend Route ───────────────────────────────────────────────────────────
app.get('/', (c) => c.redirect('/static/'))
app.get('/static', (c) => c.redirect('/static/'))
app.get('/static/', serveStatic({ path: './public/static/index.html' }))

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getMockContract(type: string = 'flash_arbitrage'): string {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ⚠️ Demo mode — connect ChainGPT API for AI-generated contracts
import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn, uint amountOutMin,
        address[] calldata path, address to, uint deadline
    ) external returns (uint[] memory amounts);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn; address tokenOut; uint24 fee;
        address recipient; uint256 deadline;
        uint256 amountIn; uint256 amountOutMinimum; uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

/**
 * @title FlashArbitrageBot
 * @notice Production flash loan arbitrage bot using Aave V3 + multi-DEX routing
 * @dev Supports Uniswap V2/V3, SushiSwap, Curve triangular arbitrage
 * @custom:security-contact security@flasharb.ai
 */
contract FlashArbitrageBot is FlashLoanSimpleReceiverBase, ReentrancyGuard {
    address public immutable owner;
    IUniswapV2Router02 public immutable uniV2Router;
    IUniswapV2Router02 public immutable sushiRouter;
    IUniswapV3Router  public immutable uniV3Router;

    uint256 public totalProfit;
    uint256 public tradeCount;
    bool public paused;

    // DEX identifiers
    uint8 constant DEX_UNI_V2   = 1;
    uint8 constant DEX_SUSHI    = 2;
    uint8 constant DEX_UNI_V3   = 3;
    uint8 constant DEX_CURVE    = 4;

    struct TradeRoute {
        uint8 buyDex;
        uint8 sellDex;
        address tokenBorrow;
        address tokenMid;
        uint256 loanAmount;
        uint24  uniV3Fee;
    }

    event ArbitrageExecuted(
        address indexed token,
        uint256 loanAmount,
        uint256 profit,
        uint8 buyDex,
        uint8 sellDex,
        uint256 timestamp
    );
    event EmergencyWithdraw(address indexed token, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier notPaused() { require(!paused, "Paused"); _; }

    constructor(
        address _addressProvider,
        address _uniV2Router,
        address _sushiRouter,
        address _uniV3Router
    ) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = msg.sender;
        uniV2Router = IUniswapV2Router02(_uniV2Router);
        sushiRouter  = IUniswapV2Router02(_sushiRouter);
        uniV3Router  = IUniswapV3Router(_uniV3Router);
    }

    /// @notice Initiate flash loan arbitrage
    function executeArbitrage(
        address tokenBorrow,
        uint256 amount,
        address tokenMid,
        uint8   buyDex,
        uint8   sellDex,
        uint24  v3Fee
    ) external onlyOwner notPaused nonReentrant {
        bytes memory params = abi.encode(tokenBorrow, tokenMid, buyDex, sellDex, v3Fee);
        POOL.flashLoanSimple(address(this), tokenBorrow, amount, params, 0);
    }

    /// @inheritdoc IFlashLoanSimpleReceiver
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address, /* initiator */
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "Invalid caller");

        (address tokenBorrow, address tokenMid, uint8 buyDex, uint8 sellDex, uint24 v3Fee) =
            abi.decode(params, (address, address, uint8, uint8, uint24));

        uint256 balBefore = IERC20(asset).balanceOf(address(this));

        // Step 1: Buy tokenMid with borrowed asset on buyDex
        uint256 midReceived = _swap(buyDex, asset, tokenMid, amount, 0, v3Fee);

        // Step 2: Sell tokenMid back to asset on sellDex  
        uint256 assetReceived = _swap(sellDex, tokenMid, asset, midReceived, 0, v3Fee);

        uint256 totalOwed = amount + premium;
        require(assetReceived > totalOwed, "No profit");

        uint256 profit = assetReceived - totalOwed;
        unchecked {
            totalProfit += profit;
            tradeCount++;
        }

        // Repay flash loan
        IERC20(asset).approve(address(POOL), totalOwed);

        emit ArbitrageExecuted(asset, amount, profit, buyDex, sellDex, block.timestamp);
        return true;
    }

    function _swap(uint8 dex, address tokenIn, address tokenOut, uint256 amountIn, uint256 minOut, uint24 fee)
        internal returns (uint256)
    {
        IERC20(tokenIn).approve(_getDexRouter(dex), amountIn);

        if (dex == DEX_UNI_V3) {
            return uniV3Router.exactInputSingle(IUniswapV3Router.ExactInputSingleParams({
                tokenIn: tokenIn, tokenOut: tokenOut, fee: fee,
                recipient: address(this), deadline: block.timestamp + 300,
                amountIn: amountIn, amountOutMinimum: minOut, sqrtPriceLimitX96: 0
            }));
        }

        address[] memory path = new address[](2);
        path[0] = tokenIn; path[1] = tokenOut;
        IUniswapV2Router02 router = dex == DEX_SUSHI ? sushiRouter : uniV2Router;
        uint[] memory amounts = router.swapExactTokensForTokens(
            amountIn, minOut, path, address(this), block.timestamp + 300
        );
        return amounts[amounts.length - 1];
    }

    function _getDexRouter(uint8 dex) internal view returns (address) {
        if (dex == DEX_SUSHI)   return address(sushiRouter);
        if (dex == DEX_UNI_V3) return address(uniV3Router);
        return address(uniV2Router);
    }

    /// @notice Emergency token withdrawal
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 bal = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner, bal);
        emit EmergencyWithdraw(token, bal);
    }

    function setPaused(bool _paused) external onlyOwner { paused = _paused; }
    receive() external payable {}
}`
}

function getMockAdvisorReply(message: string): string {
  const msg = message.toLowerCase()
  if (msg.includes('mev') || msg.includes('front')) {
    return `**MEV Protection Strategies** 🛡️\n\n**1. Flashbots RPC** — Route txs to \`https://rpc.flashbots.net\` to avoid public mempool. Zero MEV exposure.\n\n**2. Commit-Reveal Scheme** — Two-phase execution hides arbitrage intent until block inclusion.\n\n**3. Private Mempool** — Use MEV Blocker (\`https://rpc.mevblocker.io\`) for automatic tx protection.\n\n**4. Slippage Limits** — Set max 0.5% slippage on Uniswap V3 to make sandwich attacks unprofitable.\n\n**5. Gas Bidding** — Bid 10-15% above base fee to get included quickly, reducing exposure window.\n\n💡 *Connect ChainGPT API for real-time MEV analysis and personalized recommendations.*`
  }
  if (msg.includes('gas') || msg.includes('cost')) {
    return `**Gas Optimization Guide** ⛽\n\n**Current Ethereum gas costs (estimated):**\n- Aave flash loan: ~180,000 gas\n- Uniswap V3 swap: ~130,000 gas\n- SushiSwap swap: ~110,000 gas\n- Total per arbitrage: ~420,000 gas\n\n**At 20 gwei:** ~0.0084 ETH ≈ $27\n**At 10 gwei:** ~0.0042 ETH ≈ $14\n\n**Optimization Tips:**\n1. Use Arbitrum — same logic costs ~$0.30-0.80\n2. Bundle multiple swaps in one tx using multicall\n3. Avoid ERC-20 approval txs by using permit2\n4. Minimum profit threshold: gas cost × 3 for safety\n\n💡 *Connect ChainGPT API for live gas forecasting.*`
  }
  return `**DeFi Arbitrage Intelligence** 🤖\n\nI'm analyzing your query: *"${message}"*\n\n**Key considerations:**\n- Flash loan fees: Aave V3 charges 0.05%, dYdX charges 0 (self-liquidations)\n- Minimum profitable spread after gas: 0.3-0.8% depending on loan size\n- Best opportunities: ETH/USDC, WBTC/ETH on Uniswap V3 vs SushiSwap\n- Testnet recommended for initial contract validation\n\n**Connect your ChainGPT API key** in settings for:\n✅ AI-powered contract generation\n✅ Real-time opportunity analysis\n✅ Security audit reports\n✅ Live market intelligence\n\n*This is a demo response. Connect ChainGPT API for full AI capabilities.*`
}

function getMockAudit() {
  return {
    score: 87,
    issues: [
      { severity: 'Medium', title: 'Missing slippage protection', description: 'The amountOutMin parameter is hardcoded to 0 in swap calls, allowing MEV bots to sandwich attack.', line: 78, recommendation: 'Calculate minimum expected output off-chain and pass as parameter.' },
      { severity: 'Low', title: 'Missing event emission', description: 'emergencyWithdraw function should emit an event for monitoring.', line: 112, recommendation: 'Add EmergencyWithdraw event and emit it.' },
      { severity: 'Info', title: 'Consider using SafeERC20', description: 'Some tokens do not return a boolean from transfer(). Use SafeERC20 for compatibility.', line: 45, recommendation: 'Import and use SafeERC20 from OpenZeppelin.' }
    ],
    summary: 'Contract is well-structured with proper access controls and reentrancy guards. Address medium severity slippage issue before mainnet deployment.'
  }
}

function computeDEXRoutes(tokenIn: string, tokenOut: string, amountIn: number, chainId: string) {
  const dexes = ['Uniswap V3', 'Uniswap V2', 'SushiSwap', 'Curve', 'Balancer', '1inch']
  const spread = 0.001 + Math.random() * 0.025
  return dexes.map((dex, i) => {
    const slippage = 0.0005 + Math.random() * 0.003
    const fee = dex === 'Uniswap V3' ? 0.0005 : dex === 'Curve' ? 0.0004 : 0.003
    const multiplier = 1 - fee - slippage + (i === 0 ? spread : 0) - (Math.random() * 0.005)
    return {
      dex,
      amountOut: amountIn * multiplier,
      fee: fee * 100,
      slippage: slippage * 100,
      liquidity: Math.floor(500000 + Math.random() * 50000000),
      priceImpact: (amountIn / (500000 + Math.random() * 10000000)) * 100,
      gasEstimate: dex.includes('V3') ? 130000 : dex === 'Curve' ? 180000 : 110000,
      route: tokenIn + ' → ' + tokenOut,
      recommended: i === 0
    }
  }).sort((a, b) => b.amountOut - a.amountOut)
}

function generateArbitrageOpps(chainId: string, minProfit: number) {
  const pairs = [
    { tokenA: 'WETH', tokenB: 'USDC', buyDex: 'Uniswap V3', sellDex: 'SushiSwap' },
    { tokenA: 'WBTC', tokenB: 'WETH', buyDex: 'Curve', sellDex: 'Uniswap V2' },
    { tokenA: 'LINK', tokenB: 'USDC', buyDex: 'SushiSwap', sellDex: 'Balancer' },
    { tokenA: 'AAVE', tokenB: 'WETH', buyDex: 'Uniswap V2', sellDex: 'Uniswap V3' },
    { tokenA: 'ARB', tokenB: 'USDC', buyDex: 'Camelot', sellDex: 'SushiSwap' },
    { tokenA: 'UNI', tokenB: 'WETH', buyDex: 'SushiSwap', sellDex: 'Uniswap V3' },
  ]

  return pairs.map((p, i) => {
    const profit = minProfit + Math.random() * 2.5
    const loanSize = 50000 + Math.random() * 500000
    const gasETH = 0.004 + Math.random() * 0.008
    const netProfit = (loanSize * profit / 100) - (gasETH * 3200)
    return {
      id: `opp_${chainId}_${i}_${Date.now()}`,
      ...p,
      profit: parseFloat(profit.toFixed(3)),
      loanSize: Math.floor(loanSize),
      netProfitUSD: parseFloat(netProfit.toFixed(2)),
      gasETH: parseFloat(gasETH.toFixed(5)),
      confidence: Math.floor(60 + Math.random() * 35),
      expiresIn: Math.floor(3 + Math.random() * 15),
      loanProvider: ['Aave V3', 'dYdX', 'Balancer'][i % 3],
      chainId,
      timestamp: Date.now()
    }
  }).filter(o => o.profit >= minProfit && o.netProfitUSD > 0)
    .sort((a, b) => b.profit - a.profit)
}

function getGasData(chainId: string) {
  const baseGas: Record<string, {low:number,mid:number,high:number}> = {
    '1':      {low:8, mid:12, high:20},
    '137':    {low:30, mid:60, high:120},
    '42161':  {low:0.01, mid:0.05, high:0.1},
    '10':     {low:0.001, mid:0.005, high:0.01},
    '8453':   {low:0.001, mid:0.003, high:0.008},
    '56':     {low:3, mid:5, high:8},
    '11155111':{low:5, mid:10, high:18},
  }
  const g = baseGas[chainId] || {low:10, mid:20, high:40}
  const jitter = () => 1 + (Math.random() - 0.5) * 0.3
  return {
    chainId,
    low:  parseFloat((g.low * jitter()).toFixed(4)),
    mid:  parseFloat((g.mid * jitter()).toFixed(4)),
    high: parseFloat((g.high * jitter()).toFixed(4)),
    unit: chainId === '137' ? 'gwei' : chainId === '42161' || chainId === '10' || chainId === '8453' ? 'gwei' : 'gwei',
    timestamp: Date.now()
  }
}

export default app
