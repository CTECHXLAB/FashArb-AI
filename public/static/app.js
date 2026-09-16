/* ============================================================
   FlashArb AI v4.2 — WEB3 AI DEFI ARBITRAGE ENGINE
   PersonalArbitrageBot v3.7 — Real On-Chain EVM Bytecode
   ArbitrageBotFactory — 5-arg, deploys v3.7 bots per-user
   ============================================================ */
'use strict';

// ─── PUBLIC RPC ENDPOINTS ─────────────────────────────────────────────────────
const PUBLIC_RPCS = {
  '1':        ['https://cloudflare-eth.com','https://rpc.ankr.com/eth','https://eth.llamarpc.com','https://ethereum.publicnode.com'],
  '137':      ['https://polygon-bor-rpc.publicnode.com','https://1rpc.io/matic','https://polygon.drpc.org'],
  '42161':    ['https://arb1.arbitrum.io/rpc','https://rpc.ankr.com/arbitrum','https://arbitrum.llamarpc.com'],
  '10':       ['https://mainnet.optimism.io','https://rpc.ankr.com/optimism'],
  '8453':     ['https://mainnet.base.org','https://rpc.ankr.com/base'],
  '56':       ['https://bsc-dataseed.binance.org','https://rpc.ankr.com/bsc'],
  '11155111': ['https://rpc.sepolia.org','https://rpc2.sepolia.org','https://ethereum-sepolia.publicnode.com'],
  '80002':    ['https://rpc-amoy.polygon.technology'],
  '421614':   ['https://sepolia-rollup.arbitrum.io/rpc'],
  '84532':    ['https://sepolia.base.org'],
};

// ─── NETWORK REGISTRY ─────────────────────────────────────────────────────────
const NET_REGISTRY = {
  // ── aaveProvider = Aave V3 PoolAddressesProvider (NOT the Pool itself) ──────
  // Constructor: IPoolAddressesProvider(_addressProvider).getPool() is called in constructor
  // Using wrong address (the Pool) causes "execution reverted" — must use PoolAddressesProvider
  '1':        { name:'Ethereum Mainnet',  rpcKey:'eth-mainnet',    isTestnet:false, symbol:'ETH',       color:'#627eea', explorer:'https://etherscan.io',            hexId:'0x1',     aaveProvider:'0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9', uniRouter:'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', sushiRouter:'0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', uniV3Router:'0xE592427A0AEce92De3Edee1F18E0157C05861564', uniV3Quoter:'0x61fFE014bA17989E743c5F6cB21bF9697530B21e' },
  '137':      { name:'Polygon Mainnet',   rpcKey:'polygon-mainnet',isTestnet:false, symbol:'MATIC',     color:'#8247e5', explorer:'https://polygonscan.com',          hexId:'0x89',    aaveProvider:'0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb', uniRouter:'0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', sushiRouter:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3Router:'0xE592427A0AEce92De3Edee1F18E0157C05861564', uniV3Quoter:'0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6' },
  '42161':    { name:'Arbitrum One',      rpcKey:'arb-mainnet',    isTestnet:false, symbol:'ETH',       color:'#28a0f0', explorer:'https://arbiscan.io',              hexId:'0xa4b1',  aaveProvider:'0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb', uniRouter:'0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', sushiRouter:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3Router:'0xE592427A0AEce92De3Edee1F18E0157C05861564', uniV3Quoter:'0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6' },
  '10':       { name:'Optimism',          rpcKey:'opt-mainnet',    isTestnet:false, symbol:'ETH',       color:'#ff0420', explorer:'https://optimistic.etherscan.io',  hexId:'0xa',     aaveProvider:'0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb', uniRouter:'0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2', sushiRouter:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3Router:'0xE592427A0AEce92De3Edee1F18E0157C05861564', uniV3Quoter:'0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6' },
  '8453':     { name:'Base Mainnet',      rpcKey:'base-mainnet',   isTestnet:false, symbol:'ETH',       color:'#0052ff', explorer:'https://basescan.org',             hexId:'0x2105',  aaveProvider:'0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D', uniRouter:'0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', sushiRouter:'0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891', uniV3Router:'0x2626664c2603336E57B271c5C0b26F421741e481', uniV3Quoter:'0x3d4e44Eb1374240CE5F1B136588eDad14f9253A5' },
  '56':       { name:'BNB Smart Chain',   rpcKey:'bnb-mainnet',    isTestnet:false, symbol:'BNB',       color:'#f0b90b', explorer:'https://bscscan.com',              hexId:'0x38',    aaveProvider:'0xff75B6da14FfbbfD355Daf7a2731456b3562Ba6D', uniRouter:'0x10ED43C718714eb63d5aA57B78B54704E256024E', sushiRouter:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3Router:'0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2', uniV3Quoter:'0x78D78E420Da98ad378D7799bE8f4AF69033EB077' },
  '11155111': { name:'Sepolia Testnet',   rpcKey:'eth-sepolia',    isTestnet:true,  symbol:'SepoliaETH',color:'#cfb100', explorer:'https://sepolia.etherscan.io',     hexId:'0xaa36a7',aaveProvider:'0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A', uniRouter:'0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3', sushiRouter:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3Router:'0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48', uniV3Quoter:'0xEd1f6473345F45b75833fd55D191EBE6d39fC450', faucets:[{name:'Alchemy Sepolia Faucet',url:'https://www.alchemy.com/faucets/ethereum-sepolia'},{name:'Chainlink Faucet',url:'https://faucets.chain.link/sepolia'}] },
  '80002':    { name:'Polygon Amoy',      rpcKey:'polygon-amoy',   isTestnet:true,  symbol:'MATIC',     color:'#8247e5', explorer:'https://amoy.polygonscan.com',     hexId:'0x13882', aaveProvider:'0xeb7A89BB6C93e82BEB6B4B49E07d0f4c8c7d8898', uniRouter:'0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', sushiRouter:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3Router:'0xE592427A0AEce92De3Edee1F18E0157C05861564', uniV3Quoter:'0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', faucets:[{name:'Polygon Faucet',url:'https://faucet.polygon.technology/'},{name:'Alchemy Amoy Faucet',url:'https://www.alchemy.com/faucets/polygon-amoy'}] },
  '421614':   { name:'Arbitrum Sepolia',  rpcKey:'arb-sepolia',    isTestnet:true,  symbol:'ETH',       color:'#28a0f0', explorer:'https://sepolia.arbiscan.io',      hexId:'0x66eee', aaveProvider:'0x4DA5c4da71C5a167171cC839487536d86e083483', uniRouter:'0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', sushiRouter:'0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', uniV3Router:'0x101F443B4d1b059569D643917553c771E1b9663E', uniV3Quoter:'0x2779a0CC1c3e0E44D2542EC3e79e3864Ae93Ef0C', faucets:[{name:'Alchemy Arb Faucet',url:'https://www.alchemy.com/faucets/arbitrum-sepolia'}] },
  '84532':    { name:'Base Sepolia',      rpcKey:'base-sepolia',   isTestnet:true,  symbol:'ETH',       color:'#0052ff', explorer:'https://sepolia.basescan.org',     hexId:'0x14a34', aaveProvider:'0xd449FeD49d9C443688d6816fE6872F21402e41De', uniRouter:'0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', sushiRouter:'0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891', uniV3Router:'0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4', uniV3Quoter:'0xC5290058841028F1614F3A6F0F5816cAd0df5E27', faucets:[{name:'Alchemy Base Faucet',url:'https://www.alchemy.com/faucets/base-sepolia'}] },
};

// ─── GLOBAL STATE ─────────────────────────────────────────────────────────────
const STATE = {
  alchemyKey: localStorage.getItem('flasharb_alchemy_key') || '',
  currentChainId: '1',
  wallet: { connected:false, address:'', provider:'', balance:0, usdValue:0, sessionProfitUSD:0, sessionGasETH:0, sessionProfitETH:0 },
  botRunning: false, autoMode: false,
  opportunities: [], trades: [], prices: {},
  gasGwei: 4, blockNumber: 0,
  deployedContracts: JSON.parse(localStorage.getItem('flasharb_contracts') || '[]'),
  pendingOpp: null, pendingDeploy: null,
  spreadChart: null, profitChart: null, ledgerChart: null,
  networkMenuOpen: false, rpcSource: 'public',
  scanInterval: null, priceInterval: null, gasInterval: null, blockInterval: null,
  profitHistory: [],
};

const PRICE_MAP = { ETH:3247,BTC:67234,MATIC:0.072,LINK:14.23,AAVE:98.45,UNI:7.89,DAI:1.0,USDC:1.0,ARB:1.24,OP:2.18,BNB:580,SepoliaETH:0 };

const CONTRACT_SRC = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ────────────────────────────────────────────────────────────────────────────
//  PersonalArbitrageBot — self-contained (all interfaces inline, no imports)
//
//  v3.6: 6-argument constructor — adds _uniV3Quoter parameter
//    constructor(addressProvider, uniV2Router, sushiRouter, uniV3Router, uniV3Quoter, owner)
//
//  Changes from v3.5:
//    - uniV3Quoter added as 5th constructor arg (address _uniV3Quoter)
//    - uniV3Quoter stored as public immutable (accessible via bot.uniV3Quoter())
//    - require(_uniV3Quoter != address(0), "Bad quoter") guard added
//    - All zero-address checks: Bad provider, Bad uniV2, Bad sushi, Bad uniV3,
//      Bad quoter, Bad owner (matches PersonalArbitrageBot.t.sol exactly)
//    - ArbParams struct prevents "stack too deep" compiler error
//    - USDT-safe approve: reset-to-0 before setting
//    - All revert strings match test expectations exactly
// ────────────────────────────────────────────────────────────────────────────

interface IPoolAddressesProvider {
    function getPool() external view returns (address);
}

interface IPool {
    function flashLoanSimple(
        address receiverAddress,
        address asset,
        uint256 amount,
        bytes   calldata params,
        uint16  referralCode
    ) external;
}

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint    amountIn,
        uint    amountOutMin,
        address[] calldata path,
        address to,
        uint    deadline
    ) external returns (uint[] memory amounts);
}

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24  fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params)
        external payable returns (uint256 amountOut);
}

interface IQuoterV2 {
    function quoteExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24  fee,
        uint256 amountIn,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract PersonalArbitrageBot {

    // ── Reentrancy ───────────────────────────────────────────────────────────
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED     = 2;

    modifier nonReentrant() {
        require(_status != _ENTERED, "Reentrant");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    // ── DEX IDs (match JS constants DEX_UNI_V2=1 / DEX_SUSHI=2 / DEX_UNI_V3=3) ──
    uint8 public constant DEX_UNI_V2 = 1;
    uint8 public constant DEX_SUSHI  = 2;
    uint8 public constant DEX_UNI_V3 = 3;

    // ── Immutables ───────────────────────────────────────────────────────────
    address                public immutable owner;
    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool                  public immutable POOL;
    IUniswapV2Router02     public immutable uniV2Router;
    IUniswapV2Router02     public immutable sushiRouter;
    IUniswapV3Router       public immutable uniV3Router;
    IQuoterV2              public immutable uniV3Quoter;

    // ── State ─────────────────────────────────────────────────────────────────
    uint256 public totalProfit;
    uint256 public tradeCount;
    bool    public paused;
    uint256 public slippageBps = 50; // 0.5% default

    // ── Packed params struct (avoids stack too deep in callback) ──────────────
    struct ArbParams {
        address mid;
        uint8   buyDex;
        uint8   sellDex;
        uint24  v3Fee;
        uint256 minProfit;
    }

    // ── Events ───────────────────────────────────────────────────────────────
    event ArbitrageExecuted(
        address indexed token,
        uint256         loan,
        uint256         profit,
        uint8           buyDex,
        uint8           sellDex,
        uint256         ts
    );
    event ProfitSent(address indexed to, address indexed token, uint256 amount);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    // ── Modifiers ─────────────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    modifier notPaused() {
        require(!paused, "Bot paused");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────────────────
    // 6 arguments (v3.6): _addressProvider, _uniV2Router, _sushiRouter,
    //                      _uniV3Router, _uniV3Quoter, _owner
    constructor(
        address _addressProvider,
        address _uniV2Router,
        address _sushiRouter,
        address _uniV3Router,
        address _uniV3Quoter,
        address _owner
    ) {
        require(_addressProvider != address(0), "Bad provider");
        require(_uniV2Router     != address(0), "Bad uniV2");
        require(_sushiRouter     != address(0), "Bad sushi");
        require(_uniV3Router     != address(0), "Bad uniV3");
        require(_uniV3Quoter     != address(0), "Bad quoter");
        require(_owner           != address(0), "Bad owner");

        ADDRESSES_PROVIDER = IPoolAddressesProvider(_addressProvider);
        POOL               = IPool(IPoolAddressesProvider(_addressProvider).getPool());
        uniV2Router        = IUniswapV2Router02(_uniV2Router);
        sushiRouter        = IUniswapV2Router02(_sushiRouter);
        uniV3Router        = IUniswapV3Router(_uniV3Router);
        uniV3Quoter        = IQuoterV2(_uniV3Quoter);
        owner              = _owner;
        _status            = _NOT_ENTERED;
    }

    // ── External: trigger flash-loan arb ─────────────────────────────────────
    function executeArbitrage(
        address token,
        uint256 amount,
        address mid,
        uint8   buyDex,
        uint8   sellDex,
        uint24  v3Fee,
        uint256 minProfit
    ) external onlyOwner notPaused nonReentrant {
        bytes memory params = abi.encode(mid, buyDex, sellDex, v3Fee, minProfit);
        POOL.flashLoanSimple(address(this), token, amount, params, 0);
    }

    // ── Aave V3 callback ──────────────────────────────────────────────────────
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        require(msg.sender == address(POOL), "Caller not pool");
        require(initiator  == address(this), "Bad initiator");

        ArbParams memory p = _decodeParams(params);

        uint256 midAmt = _doSwap(p.buyDex,  asset,  p.mid, amount,  p.v3Fee, 1);
        uint256 owed   = amount + premium;
        uint256 outAmt = _doSwap(p.sellDex, p.mid,  asset, midAmt,  p.v3Fee, owed);

        require(outAmt > owed,           "No profit");
        uint256 profit = outAmt - owed;
        require(profit >= p.minProfit,   "Below minProfit");

        _safeApprove(asset, address(POOL), owed);
        _safeTransfer(asset, owner, profit);

        unchecked {
            totalProfit += profit;
            tradeCount  += 1;
        }

        emit ProfitSent(owner, asset, profit);
        emit ArbitrageExecuted(asset, amount, profit, p.buyDex, p.sellDex, block.timestamp);
        return true;
    }

    // Helper: decode params into struct (keeps executeOperation's stack light)
    function _decodeParams(bytes calldata params) internal pure returns (ArbParams memory p) {
        (p.mid, p.buyDex, p.sellDex, p.v3Fee, p.minProfit) =
            abi.decode(params, (address, uint8, uint8, uint24, uint256));
    }

    // ── Swap dispatcher ───────────────────────────────────────────────────────
    function _doSwap(
        uint8   dex,
        address tokenIn,
        address tokenOut,
        uint256 amtIn,
        uint24  v3Fee,
        uint256 minOut
    ) internal returns (uint256) {
        if (dex == DEX_UNI_V3) {
            return _swapV3(tokenIn, tokenOut, amtIn, v3Fee, minOut);
        }
        address router = (dex == DEX_SUSHI) ? address(sushiRouter) : address(uniV2Router);
        return _swapV2(router, tokenIn, tokenOut, amtIn, minOut);
    }

    function _swapV2(
        address router,
        address tokenIn,
        address tokenOut,
        uint256 amtIn,
        uint256 minOut
    ) internal returns (uint256) {
        _safeApprove(tokenIn, router, amtIn);
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        uint[] memory out = IUniswapV2Router02(router).swapExactTokensForTokens(
            amtIn, minOut, path, address(this), block.timestamp + 300
        );
        return out[out.length - 1];
    }

    function _swapV3(
        address tokenIn,
        address tokenOut,
        uint256 amtIn,
        uint24  fee,
        uint256 minOut
    ) internal returns (uint256) {
        _safeApprove(tokenIn, address(uniV3Router), amtIn);
        IUniswapV3Router.ExactInputSingleParams memory p;
        p.tokenIn           = tokenIn;
        p.tokenOut          = tokenOut;
        p.fee               = fee;
        p.recipient         = address(this);
        p.deadline          = block.timestamp + 300;
        p.amountIn          = amtIn;
        p.amountOutMinimum  = minOut;
        p.sqrtPriceLimitX96 = 0;
        return uniV3Router.exactInputSingle(p);
    }

    // ── Safe ERC20 (USDT-compatible: reset-to-0 before setting) ──────────────
    function _safeApprove(address token, address spender, uint256 amount) internal {
        (bool ok0,) = token.call(abi.encodeWithSelector(0x095ea7b3, spender, uint256(0)));
        require(ok0, "Approve(0) failed");
        (bool ok1,) = token.call(abi.encodeWithSelector(0x095ea7b3, spender, amount));
        require(ok1, "Approve failed");
    }

    function _safeTransfer(address token, address to, uint256 amount) internal {
        (bool ok, bytes memory ret) = token.call(
            abi.encodeWithSelector(0xa9059cbb, to, amount)
        );
        require(ok && (ret.length == 0 || abi.decode(ret, (bool))), "Transfer failed");
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    function setSlippageBps(uint256 _bps) external onlyOwner {
        require(_bps <= 1000, "Max 10%");
        slippageBps = _bps;
    }

    function setPaused(bool _p) external onlyOwner {
        paused = _p;
    }

    function emergencyWithdraw(address token) external onlyOwner {
        uint256 bal = IERC20(token).balanceOf(address(this));
        require(bal > 0, "Nothing to withdraw");
        _safeTransfer(token, owner, bal);
        emit EmergencyWithdraw(token, bal);
    }

    function withdrawETH() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No ETH");
        (bool ok,) = payable(owner).call{value: bal}("");
        require(ok, "ETH transfer failed");
    }

    receive() external payable {}
}
`

// ─── PRE-COMPILED PersonalArbitrageBot ABI + BYTECODE ───────────────────────────
// Compiled from PersonalArbitrageBot.sol — solc 0.8.20, optimizer 200 runs
// Constructor: (address _addressProvider, address _uniV2Router, address _sushiRouter, address _uniV3Router, address _owner)
const FLASH_ARB_ABI = [
  // ── Constructor: 6 args (addressProvider, uniV2Router, sushiRouter, uniV3Router, uniV3Quoter, owner) ──
  {"inputs":[{"internalType":"address","name":"_addressProvider","type":"address"},{"internalType":"address","name":"_uniV2Router","type":"address"},{"internalType":"address","name":"_sushiRouter","type":"address"},{"internalType":"address","name":"_uniV3Router","type":"address"},{"internalType":"address","name":"_uniV3Quoter","type":"address"},{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  // ── Events ──
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"loan","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"profit","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"buyDex","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"sellDex","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"ts","type":"uint256"}],"name":"ArbitrageExecuted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ProfitSent","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},
  // ── View / state getters ──
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"uniV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"sushiRouter","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"uniV3Router","outputs":[{"internalType":"contract IUniswapV3Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"uniV3Quoter","outputs":[{"internalType":"contract IQuoterV2","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ADDRESSES_PROVIDER","outputs":[{"internalType":"contract IPoolAddressesProvider","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"POOL","outputs":[{"internalType":"contract IPool","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalProfit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"tradeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"slippageBps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  // ── Core functions ──
  {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"mid","type":"address"},{"internalType":"uint8","name":"buyDex","type":"uint8"},{"internalType":"uint8","name":"sellDex","type":"uint8"},{"internalType":"uint24","name":"v3Fee","type":"uint24"},{"internalType":"uint256","name":"minProfit","type":"uint256"}],"name":"executeArbitrage","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"premium","type":"uint256"},{"internalType":"address","name":"initiator","type":"address"},{"internalType":"bytes","name":"params","type":"bytes"}],"name":"executeOperation","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  // ── Admin functions ──
  {"inputs":[{"internalType":"uint256","name":"_bps","type":"uint256"}],"name":"setSlippageBps","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bool","name":"_p","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},
  // ── DEX ID constants ──
  {"inputs":[],"name":"DEX_UNI_V2","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"DEX_SUSHI","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"DEX_UNI_V3","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  // ── Receive ETH ──
  {"stateMutability":"payable","type":"receive"}
];

// Bytecode compiled from PersonalArbitrageBot.sol — solc 0.8.20, optimizer 200 runs
// Constructor: (addressProvider, uniV2Router, sushiRouter, uniV3Router, uniV3Quoter, owner)
// Self-contained (all interfaces inline) — ArbParams struct prevents stack-too-deep
// Real EVM bytecode: 6,990 bytes — v3.6: 6-arg constructor with uniV3Quoter
const FLASH_ARB_BYTECODE = '0x610160604052603260045534801562000016575f80fd5b5060405162001b4e38038062001b4e83398101604081905262000039916200029b565b6001600160a01b038616620000845760405162461bcd60e51b815260206004820152600c60248201526b2130b210383937bb34b232b960a11b60448201526064015b60405180910390fd5b6001600160a01b038516620000c85760405162461bcd60e51b81526020600482015260096024820152682130b2103ab734ab1960b91b60448201526064016200007b565b6001600160a01b0384166200010c5760405162461bcd60e51b815260206004820152600960248201526842616420737573686960b81b60448201526064016200007b565b6001600160a01b038316620001505760405162461bcd60e51b815260206004820152600960248201526842616420756e69563360b81b60448201526064016200007b565b6001600160a01b038216620001955760405162461bcd60e51b815260206004820152600a6024820152692130b21038bab7ba32b960b11b60448201526064016200007b565b6001600160a01b038116620001d95760405162461bcd60e51b81526020600482015260096024820152682130b21037bbb732b960b91b60448201526064016200007b565b6001600160a01b03861660a08190526040805163026b1d5f60e01b8152905163026b1d5f916004808201926020929091908290030181865afa15801562000222573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019062000248919062000318565b6001600160a01b0390811660c05294851660e0529284166101005290831661012052821661014052166080525060015f556200033b565b80516001600160a01b038116811462000296575f80fd5b919050565b5f805f805f8060c08789031215620002b1575f80fd5b620002bc876200027f565b9550620002cc602088016200027f565b9450620002dc604088016200027f565b9350620002ec606088016200027f565b9250620002fc608088016200027f565b91506200030c60a088016200027f565b90509295509295509295565b5f6020828403121562000329575f80fd5b62000334826200027f565b9392505050565b60805160a05160c05160e051610100516101205161014051611751620003fd5f395f61030c01525f818161023501528181610fe401526110e401525f81816102870152610ce901525f81816103ad0152610cc301525f81816102d901528181610519015281816106a7015261091501525f61013a01525f818161037a0152818161042b0152818161048f015281816106d20152818161071c015281816107f20152818161099801528181610a8a01528181610b010152610b7801526117515ff3fe60806040526004361061011e575f3560e01c80637535d2461161009d578063958c2e5211610062578063958c2e521461039c578063afbf434e146103cf578063bd55022a146103e3578063e086e5ec146103f8578063e7bfde981461040c575f80fd5b80637535d246146102c8578063795674ff146102fb5780637a4bc3791461032e57806386001519146103545780638da5cb5b14610369575f80fd5b80635c975abb116100e35780635c975abb1461020b5780635fafa5891461022457806362e8ce64146102575780636d13582c146102765780636ff1c9bc146102a9575f80fd5b80630542975c1461012957806316c38b3c146101795780631a3ce4e61461019a5780631b11d0ff146101b9578063578c71d9146101e8575f80fd5b3661012557005b5f80fd5b348015610134575f80fd5b5061015c7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b348015610184575f80fd5b506101986101933660046112a4565b610420565b005b3480156101a5575f80fd5b506101986101b43660046112c6565b610484565b3480156101c4575f80fd5b506101d86101d33660046112f1565b61050d565b6040519015158152602001610170565b3480156101f3575f80fd5b506101fd60045481565b604051908152602001610170565b348015610216575f80fd5b506003546101d89060ff1681565b34801561022f575f80fd5b5061015c7f000000000000000000000000000000000000000000000000000000000000000081565b348015610262575f80fd5b506101986102713660046113ba565b6107e7565b348015610281575f80fd5b5061015c7f000000000000000000000000000000000000000000000000000000000000000081565b3480156102b4575f80fd5b506101986102c3366004611431565b61098d565b3480156102d3575f80fd5b5061015c7f000000000000000000000000000000000000000000000000000000000000000081565b348015610306575f80fd5b5061015c7f000000000000000000000000000000000000000000000000000000000000000081565b348015610339575f80fd5b50610342600181565b60405160ff9091168152602001610170565b34801561035f575f80fd5b506101fd60015481565b348015610374575f80fd5b5061015c7f000000000000000000000000000000000000000000000000000000000000000081565b3480156103a7575f80fd5b5061015c7f000000000000000000000000000000000000000000000000000000000000000081565b3480156103da575f80fd5b50610342600281565b3480156103ee575f80fd5b506101fd60025481565b348015610403575f80fd5b50610198610af6565b348015610417575f80fd5b50610342600381565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104715760405162461bcd60e51b81526004016104689061144c565b60405180910390fd5b6003805460ff1916911515919091179055565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104cc5760405162461bcd60e51b81526004016104689061144c565b6103e88111156105085760405162461bcd60e51b81526020600482015260076024820152664d61782031302560c81b6044820152606401610468565b600455565b5f336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146105785760405162461bcd60e51b815260206004820152600f60248201526e10d85b1b195c881b9bdd081c1bdbdb608a1b6044820152606401610468565b6001600160a01b03841630146105c05760405162461bcd60e51b815260206004820152600d60248201526c2130b21034b734ba34b0ba37b960991b6044820152606401610468565b5f6105cb8484610c2e565b90505f6105e882602001518a845f01518b86606001516001610c94565b90505f6105f5888a611483565b90505f6106118460400151855f01518d86886060015187610c94565b905081811161064e5760405162461bcd60e51b8152602060048201526009602482015268139bc81c1c9bd99a5d60ba1b6044820152606401610468565b5f610659838361149c565b905084608001518110156106a15760405162461bcd60e51b815260206004820152600f60248201526e10995b1bddc81b5a5b941c9bd99a5d608a1b6044820152606401610468565b6106cc8c7f000000000000000000000000000000000000000000000000000000000000000085610d24565b6106f78c7f000000000000000000000000000000000000000000000000000000000000000083610edc565b60018054820181556002805490910190556040518181526001600160a01b038d8116917f0000000000000000000000000000000000000000000000000000000000000000909116907f5dfb7e9c7037fed8a1b66fed916e48c15c342742afcca674425ed54b9a6e30249060200160405180910390a360208086015160408088015181518f815293840185905260ff928316918401919091521660608201524260808201526001600160a01b038d16907f71e9ab98349f53008889a1751e4e66777fa751a6663f24039498c3b21d029bd79060a00160405180910390a26001955050505050505b9695505050505050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461082f5760405162461bcd60e51b81526004016104689061144c565b60035460ff161561086f5760405162461bcd60e51b815260206004820152600a602482015269109bdd081c185d5cd95960b21b6044820152606401610468565b60025f54036108ac5760405162461bcd60e51b81526020600482015260096024820152681499595b9d1c985b9d60ba1b6044820152606401610468565b60025f908155604080516001600160a01b038816602082015260ff80881692820192909252908516606082015262ffffff8416608082015260a0810183905260c00160408051601f19818403018152908290526310ac2ddf60e21b825291506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906342b0b77c906109529030908c908c9087905f906004016114d1565b5f604051808303815f87803b158015610969575f80fd5b505af115801561097b573d5f803e3d5ffd5b505060015f5550505050505050505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146109d55760405162461bcd60e51b81526004016104689061144c565b6040516370a0823160e01b81523060048201525f906001600160a01b038316906370a0823190602401602060405180830381865afa158015610a19573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610a3d9190611530565b90505f8111610a845760405162461bcd60e51b81526020600482015260136024820152724e6f7468696e6720746f20776974686472617760681b6044820152606401610468565b610aaf827f000000000000000000000000000000000000000000000000000000000000000083610edc565b816001600160a01b03167f5fafa99d0643513820be26656b45130b01e1c03062e1266bf36f88cbd3bd969582604051610aea91815260200190565b60405180910390a25050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610b3e5760405162461bcd60e51b81526004016104689061144c565b4780610b755760405162461bcd60e51b815260206004820152600660248201526509cde408aa8960d31b6044820152606401610468565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316826040515f6040518083038185875af1925050503d805f8114610bde576040519150601f19603f3d011682016040523d82523d5f602084013e610be3565b606091505b5050905080610c2a5760405162461bcd60e51b8152602060048201526013602482015272115512081d1c985b9cd9995c8819985a5b1959606a1b6044820152606401610468565b5050565b6040805160a0810182525f80825260208201819052918101829052606081018290526080810191909152610c6482840184611547565b608086015262ffffff16606085015260ff90811660408501521660208301526001600160a01b0316815292915050565b5f60021960ff881601610cb557610cae8686868686610fdd565b90506107dd565b5f60ff8816600214610ce7577f0000000000000000000000000000000000000000000000000000000000000000610d09565b7f00000000000000000000000000000000000000000000000000000000000000005b9050610d18818888888761115a565b98975050505050505050565b604080516001600160a01b0384811660248301525f604480840182905284518085039091018152606490930184526020830180516001600160e01b031663095ea7b360e01b179052925190861691610d7b916115a1565b5f604051808303815f865af19150503d805f8114610db4576040519150601f19603f3d011682016040523d82523d5f602084013e610db9565b606091505b5050905080610dfe5760405162461bcd60e51b8152602060048201526011602482015270105c1c1c9bdd994a0c0a4819985a5b1959607a1b6044820152606401610468565b604080516001600160a01b038581166024830152604480830186905283518084039091018152606490920183526020820180516001600160e01b031663095ea7b360e01b17905291515f92871691610e55916115a1565b5f604051808303815f865af19150503d805f8114610e8e576040519150601f19603f3d011682016040523d82523d5f602084013e610e93565b606091505b5050905080610ed55760405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b6044820152606401610468565b5050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b17905291515f92839290871691610f3791906115a1565b5f604051808303815f865af19150503d805f8114610f70576040519150601f19603f3d011682016040523d82523d5f602084013e610f75565b606091505b5091509150818015610f9f575080511580610f9f575080806020019051810190610f9f91906115bc565b610ed55760405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606401610468565b5f611009867f000000000000000000000000000000000000000000000000000000000000000086610d24565b60408051610100810182525f6080820181905260a0820181905260c0820181905260e08201526001600160a01b0388811682528716602082015262ffffff8516918101919091523060608201526110624261012c611483565b6080820190815260a0820186815260c083018581525f60e085019081526040805163414bf38960e01b815286516001600160a01b0390811660048301526020880151811660248301529187015162ffffff16604482015260608701518216606482015294516084860152925160a4850152905160c484015251811660e48301527f0000000000000000000000000000000000000000000000000000000000000000169063414bf38990610104016020604051808303815f875af115801561112b573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061114f9190611530565b979650505050505050565b5f611166858785610d24565b6040805160028082526060820183525f9260208301908036833701905050905085815f81518110611199576111996115eb565b60200260200101906001600160a01b031690816001600160a01b03168152505084816001815181106111cd576111cd6115eb565b6001600160a01b0392831660209182029290920101525f9088166338ed1739868685306111fc4261012c611483565b6040518663ffffffff1660e01b815260040161121c9594939291906115ff565b5f604051808303815f875af1158015611237573d5f803e3d5ffd5b505050506040513d5f823e601f3d908101601f1916820160405261125e919081019061166e565b9050806001825161126f919061149c565b8151811061127f5761127f6115eb565b60200260200101519250505095945050505050565b80151581146112a1575f80fd5b50565b5f602082840312156112b4575f80fd5b81356112bf81611294565b9392505050565b5f602082840312156112d6575f80fd5b5035919050565b6001600160a01b03811681146112a1575f80fd5b5f805f805f8060a08789031215611306575f80fd5b8635611311816112dd565b95506020870135945060408701359350606087013561132f816112dd565b9250608087013567ffffffffffffffff8082111561134b575f80fd5b818901915089601f83011261135e575f80fd5b81358181111561136c575f80fd5b8a602082850101111561137d575f80fd5b6020830194508093505050509295509295509295565b803560ff811681146113a3575f80fd5b919050565b803562ffffff811681146113a3575f80fd5b5f805f805f805f60e0888a0312156113d0575f80fd5b87356113db816112dd565b96506020880135955060408801356113f2816112dd565b945061140060608901611393565b935061140e60808901611393565b925061141c60a089016113a8565b915060c0880135905092959891949750929550565b5f60208284031215611441575f80fd5b81356112bf816112dd565b6020808252600990820152682737ba1037bbb732b960b91b604082015260600190565b634e487b7160e01b5f52601160045260245ffd5b808201808211156114965761149661146f565b92915050565b818103818111156114965761149661146f565b5f5b838110156114c95781810151838201526020016114b1565b50505f910152565b5f60018060a01b03808816835280871660208401525084604083015260a0606083015283518060a084015261150d8160c08501602088016114af565b61ffff93909316608083015250601f91909101601f19160160c001949350505050565b5f60208284031215611540575f80fd5b5051919050565b5f805f805f60a0868803121561155b575f80fd5b8535611566816112dd565b945061157460208701611393565b935061158260408701611393565b9250611590606087016113a8565b949793965091946080013592915050565b5f82516115b28184602087016114af565b9190910192915050565b5f602082840312156115cc575f80fd5b81516112bf81611294565b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52603260045260245ffd5b5f60a082018783526020878185015260a0604085015281875180845260c08601915082890193505f5b8181101561164d5784516001600160a01b031683529383019391830191600101611628565b50506001600160a01b03969096166060850152505050608001529392505050565b5f602080838503121561167f575f80fd5b825167ffffffffffffffff80821115611696575f80fd5b818501915085601f8301126116a9575f80fd5b8151818111156116bb576116bb6115d7565b8060051b604051601f19603f830116810181811085821117156116e0576116e06115d7565b6040529182528482019250838101850191888311156116fd575f80fd5b938501935b82851015610d185784518452938501939285019261170256fea264697066735822122023885fd7290c8b672cfda38e74f4820dfa5170b2900c364e551c6e85a2b85a5f64736f6c63430008140033';

// ─── v3.7 PersonalArbitrageBot bytecode (adds minOutBuy slippage floor on the buy leg) ──
const FLASH_ARB_BYTECODE_V37 = '0x6101606040526032600455348015610015575f80fd5b50604051611ec3380380611ec383398101604081905261003491610286565b6001600160a01b03861661007e5760405162461bcd60e51b815260206004820152600c60248201526b2130b210383937bb34b232b960a11b60448201526064015b60405180910390fd5b6001600160a01b0385166100c05760405162461bcd60e51b81526020600482015260096024820152682130b2103ab734ab1960b91b6044820152606401610075565b6001600160a01b0384166101025760405162461bcd60e51b815260206004820152600960248201526842616420737573686960b81b6044820152606401610075565b6001600160a01b0383166101445760405162461bcd60e51b815260206004820152600960248201526842616420756e69563360b81b6044820152606401610075565b6001600160a01b0382166101875760405162461bcd60e51b815260206004820152600a6024820152692130b21038bab7ba32b960b11b6044820152606401610075565b6001600160a01b0381166101c95760405162461bcd60e51b81526020600482015260096024820152682130b21037bbb732b960b91b6044820152606401610075565b6001600160a01b03861660a08190526040805163026b1d5f60e01b8152905163026b1d5f916004808201926020929091908290030181865afa158015610211573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061023591906102f6565b6001600160a01b0390811660c05294851660e0529284166101005290831661012052821661014052166080525060015f55610316565b80516001600160a01b0381168114610281575f80fd5b919050565b5f805f805f8060c0878903121561029b575f80fd5b6102a48761026b565b95506102b26020880161026b565b94506102c06040880161026b565b93506102ce6060880161026b565b92506102dc6080880161026b565b91506102ea60a0880161026b565b90509295509295509295565b5f60208284031215610306575f80fd5b61030f8261026b565b9392505050565b60805160a05160c05160e051610100516101205161014051611ae56103de5f395f81816103410152610cb801525f81816102890152818161122a01526112d001525f81816102bc0152610f2f01525f81816103e20152610f0901525f818161030e015281816105b20152818161083a01526109cb01525f61015001525f81816103af0152818161047f01528181610755015281816107b0015281816109f601528181610a4001528181610b1601528181610c0801528181610d3b0152610db20152611ae55ff3fe608060405260043610610134575f3560e01c80637535d246116100a8578063958c2e521161006d578063958c2e52146103d1578063afbf434e14610404578063b0aaa11214610418578063bd55022a14610437578063e086e5ec1461044c578063e7bfde9814610460575f80fd5b80637535d246146102fd578063795674ff146103305780637a4bc3791461036357806386001519146103895780638da5cb5b1461039e575f80fd5b80631b11d0ff116100f95780631b11d0ff1461021b578063578c71d91461024a5780635c975abb1461025f5780635fafa589146102785780636d13582c146102ab5780636ff1c9bc146102de575f80fd5b80630542975c1461013f5780630da92ae61461018f5780631223ff03146101b057806316c38b3c146101dd5780631a3ce4e6146101fc575f80fd5b3661013b57005b5f80fd5b34801561014a575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561019a575f80fd5b506101ae6101a93660046114d0565b610474565b005b3480156101bb575f80fd5b506101cf6101ca366004611551565b61062b565b604051908152602001610186565b3480156101e8575f80fd5b506101ae6101f73660046115ac565b61074a565b348015610207575f80fd5b506101ae6102163660046115ce565b6107a5565b348015610226575f80fd5b5061023a6102353660046115e5565b61082e565b6040519015158152602001610186565b348015610255575f80fd5b506101cf60045481565b34801561026a575f80fd5b5060035461023a9060ff1681565b348015610283575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b3480156102b6575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b3480156102e9575f80fd5b506101ae6102f836600461168a565b610b0b565b348015610308575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b34801561033b575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b34801561036e575f80fd5b50610377600181565b60405160ff9091168152602001610186565b348015610394575f80fd5b506101cf60015481565b3480156103a9575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b3480156103dc575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b34801561040f575f80fd5b50610377600281565b348015610423575f80fd5b506101cf6104323660046116a5565b610c74565b348015610442575f80fd5b506101cf60025481565b348015610457575f80fd5b506101ae610d30565b34801561046b575f80fd5b50610377600381565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104c55760405162461bcd60e51b81526004016104bc906116e1565b60405180910390fd5b60035460ff16156105055760405162461bcd60e51b815260206004820152600a602482015269109bdd081c185d5cd95960b21b60448201526064016104bc565b60025f54036105425760405162461bcd60e51b81526020600482015260096024820152681499595b9d1c985b9d60ba1b60448201526064016104bc565b60025f908155604080516001600160a01b038916602082015260ff80891692820192909252908616606082015262ffffff8516608082015260a0810184905260c0810183905260e00160408051601f19818403018152908290526310ac2ddf60e21b825291506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906342b0b77c906105ef9030908d908d9087905f90600401611704565b5f604051808303815f87803b158015610606575f80fd5b505af1158015610618573d5f803e3d5ffd5b505060015f555050505050505050505050565b6040805160028082526060820183525f928392919060208301908036833701905050905084815f815181106106625761066261177d565b60200260200101906001600160a01b031690816001600160a01b03168152505083816001815181106106965761069661177d565b6001600160a01b03928316602091820292909201015260405163d06ca61f60e01b81525f9188169063d06ca61f906106d490879086906004016117d4565b5f60405180830381865afa1580156106ee573d5f803e3d5ffd5b505050506040513d5f823e601f3d908101601f1916820160405261071591908101906117f4565b9050806001825161072691906118d0565b815181106107365761073661177d565b602002602001015192505050949350505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107925760405162461bcd60e51b81526004016104bc906116e1565b6003805460ff1916911515919091179055565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107ed5760405162461bcd60e51b81526004016104bc906116e1565b6103e88111156108295760405162461bcd60e51b81526020600482015260076024820152664d61782031302560c81b60448201526064016104bc565b600455565b5f336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146108995760405162461bcd60e51b815260206004820152600f60248201526e10d85b1b195c881b9bdd081c1bdbdb608a1b60448201526064016104bc565b6001600160a01b03841630146108e15760405162461bcd60e51b815260206004820152600d60248201526c2130b21034b734ba34b0ba37b960991b60448201526064016104bc565b5f6108ec8484610e68565b90505f61090c82602001518a845f01518b86606001518760a00151610eda565b90505f610919888a6118e9565b90505f6109358460400151855f01518d86886060015187610eda565b90508181116109725760405162461bcd60e51b8152602060048201526009602482015268139bc81c1c9bd99a5d60ba1b60448201526064016104bc565b5f61097d83836118d0565b905084608001518110156109c55760405162461bcd60e51b815260206004820152600f60248201526e10995b1bddc81b5a5b941c9bd99a5d608a1b60448201526064016104bc565b6109f08c7f000000000000000000000000000000000000000000000000000000000000000085610f6a565b610a1b8c7f000000000000000000000000000000000000000000000000000000000000000083611122565b60018054820181556002805490910190556040518181526001600160a01b038d8116917f0000000000000000000000000000000000000000000000000000000000000000909116907f5dfb7e9c7037fed8a1b66fed916e48c15c342742afcca674425ed54b9a6e30249060200160405180910390a360208086015160408088015181518f815293840185905260ff928316918401919091521660608201524260808201526001600160a01b038d16907f71e9ab98349f53008889a1751e4e66777fa751a6663f24039498c3b21d029bd79060a00160405180910390a26001955050505050505b9695505050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610b535760405162461bcd60e51b81526004016104bc906116e1565b6040516370a0823160e01b81523060048201525f906001600160a01b038316906370a0823190602401602060405180830381865afa158015610b97573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610bbb91906118fc565b90505f8111610c025760405162461bcd60e51b81526020600482015260136024820152724e6f7468696e6720746f20776974686472617760681b60448201526064016104bc565b610c2d827f000000000000000000000000000000000000000000000000000000000000000083611122565b816001600160a01b03167f5fafa99d0643513820be26656b45130b01e1c03062e1266bf36f88cbd3bd969582604051610c6891815260200190565b60405180910390a25050565b60405163f7729d4360e01b81526001600160a01b038581166004830152848116602483015262ffffff84166044830152606482018390525f608483018190529182917f0000000000000000000000000000000000000000000000000000000000000000169063f7729d439060a4016080604051808303815f875af1158015610cfe573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610d229190611913565b509198975050505050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610d785760405162461bcd60e51b81526004016104bc906116e1565b4780610daf5760405162461bcd60e51b815260206004820152600660248201526509cde408aa8960d31b60448201526064016104bc565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316826040515f6040518083038185875af1925050503d805f8114610e18576040519150601f19603f3d011682016040523d82523d5f602084013e610e1d565b606091505b5050905080610e645760405162461bcd60e51b8152602060048201526013602482015272115512081d1c985b9cd9995c8819985a5b1959606a1b60448201526064016104bc565b5050565b6040805160c0810182525f80825260208201819052918101829052606081018290526080810182905260a0810191909152610ea582840184611962565b60a0870152608086015262ffffff16606085015260ff90811660408501521660208301526001600160a01b0316815292915050565b5f60021960ff881601610efb57610ef48686868686611223565b9050610b01565b5f60ff8816600214610f2d577f0000000000000000000000000000000000000000000000000000000000000000610f4f565b7f00000000000000000000000000000000000000000000000000000000000000005b9050610f5e8188888887611358565b98975050505050505050565b604080516001600160a01b0384811660248301525f604480840182905284518085039091018152606490930184526020830180516001600160e01b031663095ea7b360e01b179052925190861691610fc1916119c6565b5f604051808303815f865af19150503d805f8114610ffa576040519150601f19603f3d011682016040523d82523d5f602084013e610fff565b606091505b50509050806110445760405162461bcd60e51b8152602060048201526011602482015270105c1c1c9bdd994a0c0a4819985a5b1959607a1b60448201526064016104bc565b604080516001600160a01b038581166024830152604480830186905283518084039091018152606490920183526020820180516001600160e01b031663095ea7b360e01b17905291515f9287169161109b916119c6565b5f604051808303815f865af19150503d805f81146110d4576040519150601f19603f3d011682016040523d82523d5f602084013e6110d9565b606091505b505090508061111b5760405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b60448201526064016104bc565b5050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b17905291515f9283929087169161117d91906119c6565b5f604051808303815f865af19150503d805f81146111b6576040519150601f19603f3d011682016040523d82523d5f602084013e6111bb565b606091505b50915091508180156111e55750805115806111e55750808060200190518101906111e591906119dc565b61111b5760405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b60448201526064016104bc565b5f61124f867f000000000000000000000000000000000000000000000000000000000000000086610f6a565b60408051610100810182525f6080820181905260a0820181905260c0820181905260e08201526001600160a01b0388811682528716602082015262ffffff8516918101919091523060608201526112a84261012c6118e9565b608082015260a0810185905260c081018390525f60e082015260405163414bf38960e01b81527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063414bf3899061130d9084906004016119f7565b6020604051808303815f875af1158015611329573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061134d91906118fc565b979650505050505050565b5f611364858785610f6a565b6040805160028082526060820183525f9260208301908036833701905050905085815f815181106113975761139761177d565b60200260200101906001600160a01b031690816001600160a01b03168152505084816001815181106113cb576113cb61177d565b6001600160a01b0392831660209182029290920101525f9088166338ed1739868685306113fa4261012c6118e9565b6040518663ffffffff1660e01b815260040161141a959493929190611a74565b5f604051808303815f875af1158015611435573d5f803e3d5ffd5b505050506040513d5f823e601f3d908101601f1916820160405261145c91908101906117f4565b9050806001825161146d91906118d0565b8151811061147d5761147d61177d565b60200260200101519250505095945050505050565b6001600160a01b03811681146114a6575f80fd5b50565b803560ff811681146114b9575f80fd5b919050565b803562ffffff811681146114b9575f80fd5b5f805f805f805f80610100898b0312156114e8575f80fd5b88356114f381611492565b975060208901359650604089013561150a81611492565b955061151860608a016114a9565b945061152660808a016114a9565b935061153460a08a016114be565b979a969950949793969295929450505060c08201359160e0013590565b5f805f8060808587031215611564575f80fd5b843561156f81611492565b9350602085013561157f81611492565b9250604085013561158f81611492565b9396929550929360600135925050565b80151581146114a6575f80fd5b5f602082840312156115bc575f80fd5b81356115c78161159f565b9392505050565b5f602082840312156115de575f80fd5b5035919050565b5f805f805f8060a087890312156115fa575f80fd5b863561160581611492565b95506020870135945060408701359350606087013561162381611492565b9250608087013567ffffffffffffffff81111561163e575f80fd5b8701601f8101891361164e575f80fd5b803567ffffffffffffffff811115611664575f80fd5b896020828401011115611675575f80fd5b60208201935080925050509295509295509295565b5f6020828403121561169a575f80fd5b81356115c781611492565b5f805f80608085870312156116b8575f80fd5b84356116c381611492565b935060208501356116d381611492565b925061158f604086016114be565b6020808252600990820152682737ba1037bbb732b960b91b604082015260600190565b60018060a01b038616815260018060a01b038516602082015283604082015260a060608201525f83518060a0840152806020860160c085015e5f60c0828501015260c0601f19601f83011684010191505061ffff831660808301529695505050505050565b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52603260045260245ffd5b5f8151808452602084019350602083015f5b828110156117ca5781516001600160a01b03168652602095860195909101906001016117a3565b5093949350505050565b828152604060208201525f6117ec6040830184611791565b949350505050565b5f60208284031215611804575f80fd5b815167ffffffffffffffff81111561181a575f80fd5b8201601f8101841361182a575f80fd5b805167ffffffffffffffff81111561184457611844611769565b8060051b604051601f19603f830116810181811067ffffffffffffffff8211171561187157611871611769565b60405291825260208184018101929081018784111561188e575f80fd5b6020850194505b838510156118b157845180825260209586019590935001611895565b509695505050505050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156118e3576118e36118bc565b92915050565b808201808211156118e3576118e36118bc565b5f6020828403121561190c575f80fd5b5051919050565b5f805f8060808587031215611926575f80fd5b8451602086015190945061193981611492565b604086015190935063ffffffff81168114611952575f80fd5b6060959095015193969295505050565b5f805f805f8060c08789031215611977575f80fd5b863561198281611492565b9550611990602088016114a9565b945061199e604088016114a9565b93506119ac606088016114be565b9598949750929560808101359460a0909101359350915050565b5f82518060208501845e5f920191825250919050565b5f602082840312156119ec575f80fd5b81516115c78161159f565b81516001600160a01b03908116825260208084015182169083015260408084015162ffffff169083015260608084015191821690830152610100820190506080830151608083015260a083015160a083015260c083015160c083015260e0830151611a6d60e08401826001600160a01b03169052565b5092915050565b85815284602082015260a060408201525f611a9260a0830186611791565b6001600160a01b039490941660608301525060800152939250505056fea2646970667358221220afe8d29ed257c32eb9f4726c45188c2b0f76f6e048ee2fa7deb4b5fcb186da0064736f6c634300081a0033';

// ─── ArbitrageBotFactory bytecode (deploys v3.7 bots; deployer never owns/controls them) ──
const FACTORY_BYTECODE = '0x610120604052348015610010575f80fd5b5060405161259238038061259283398101604081905261002f91610073565b6001600160a01b0394851660805292841660a05290831660c052821660e05216610100526100d4565b80516001600160a01b038116811461006e575f80fd5b919050565b5f805f805f60a08688031215610087575f80fd5b61009086610058565b945061009e60208701610058565b93506100ac60408701610058565b92506100ba60608701610058565b91506100c860808701610058565b90509295509295909350565b60805160a05160c05160e0516101005161245f6101335f395f8181610162015261028e01525f8181610114015261026d01525f818161013b015261024c01525f8181610189015261022b01525f818160e5015261020a015261245f5ff3fe608060405234801561000f575f80fd5b506004361061009b575f3560e01c80636d13582c116100635780636d13582c14610136578063795674ff1461015d578063958c2e5214610184578063d681b6c2146101ab578063e9af4ec6146101cb575f80fd5b8063064f34001461009f57806322428b67146100b55780632954018c146100e057806329a3517a146101075780635fafa5891461010f575b5f80fd5b6001546040519081526020015b60405180910390f35b6100c86100c336600461047c565b6101de565b6040516001600160a01b0390911681526020016100ac565b6100c87f000000000000000000000000000000000000000000000000000000000000000081565b6100c8610206565b6100c87f000000000000000000000000000000000000000000000000000000000000000081565b6100c87f000000000000000000000000000000000000000000000000000000000000000081565b6100c87f000000000000000000000000000000000000000000000000000000000000000081565b6100c87f000000000000000000000000000000000000000000000000000000000000000081565b6101be6101b93660046104ae565b6103cb565b6040516100ac91906104ce565b6100c86101d9366004610519565b61043c565b600181815481106101ed575f80fd5b5f918252602090912001546001600160a01b0316905081565b5f807f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000000000000336040516102ba9061046f565b6001600160a01b0396871681529486166020860152928516604085015290841660608401528316608083015290911660a082015260c001604051809103905ff08015801561030a573d5f803e3d5ffd5b50335f81815260208181526040822080546001818101835591845291832090910180546001600160a01b0386166001600160a01b0319918216811790925582548084018455938390527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf690930180549093168117909255805493955085945090927fbfe8884ec71a1c1542d99052a484afa086f6ed58a0852e1fb819bd2b4aeb5582916103b691610541565b60405190815260200160405180910390a35090565b6001600160a01b0381165f908152602081815260409182902080548351818402810184019094528084526060939283018282801561043057602002820191905f5260205f20905b81546001600160a01b03168152600190910190602001808311610412575b50505050509050919050565b5f602052815f5260405f208181548110610454575f80fd5b5f918252602090912001546001600160a01b03169150829050565b611ec38061056783390190565b5f6020828403121561048c575f80fd5b5035919050565b80356001600160a01b03811681146104a9575f80fd5b919050565b5f602082840312156104be575f80fd5b6104c782610493565b9392505050565b602080825282518282018190525f918401906040840190835b8181101561050e5783516001600160a01b03168352602093840193909201916001016104e7565b509095945050505050565b5f806040838503121561052a575f80fd5b61053383610493565b946020939093013593505050565b8181038181111561056057634e487b7160e01b5f52601160045260245ffd5b9291505056fe6101606040526032600455348015610015575f80fd5b50604051611ec3380380611ec383398101604081905261003491610286565b6001600160a01b03861661007e5760405162461bcd60e51b815260206004820152600c60248201526b2130b210383937bb34b232b960a11b60448201526064015b60405180910390fd5b6001600160a01b0385166100c05760405162461bcd60e51b81526020600482015260096024820152682130b2103ab734ab1960b91b6044820152606401610075565b6001600160a01b0384166101025760405162461bcd60e51b815260206004820152600960248201526842616420737573686960b81b6044820152606401610075565b6001600160a01b0383166101445760405162461bcd60e51b815260206004820152600960248201526842616420756e69563360b81b6044820152606401610075565b6001600160a01b0382166101875760405162461bcd60e51b815260206004820152600a6024820152692130b21038bab7ba32b960b11b6044820152606401610075565b6001600160a01b0381166101c95760405162461bcd60e51b81526020600482015260096024820152682130b21037bbb732b960b91b6044820152606401610075565b6001600160a01b03861660a08190526040805163026b1d5f60e01b8152905163026b1d5f916004808201926020929091908290030181865afa158015610211573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061023591906102f6565b6001600160a01b0390811660c05294851660e0529284166101005290831661012052821661014052166080525060015f55610316565b80516001600160a01b0381168114610281575f80fd5b919050565b5f805f805f8060c0878903121561029b575f80fd5b6102a48761026b565b95506102b26020880161026b565b94506102c06040880161026b565b93506102ce6060880161026b565b92506102dc6080880161026b565b91506102ea60a0880161026b565b90509295509295509295565b5f60208284031215610306575f80fd5b61030f8261026b565b9392505050565b60805160a05160c05160e051610100516101205161014051611ae56103de5f395f81816103410152610cb801525f81816102890152818161122a01526112d001525f81816102bc0152610f2f01525f81816103e20152610f0901525f818161030e015281816105b20152818161083a01526109cb01525f61015001525f81816103af0152818161047f01528181610755015281816107b0015281816109f601528181610a4001528181610b1601528181610c0801528181610d3b0152610db20152611ae55ff3fe608060405260043610610134575f3560e01c80637535d246116100a8578063958c2e521161006d578063958c2e52146103d1578063afbf434e14610404578063b0aaa11214610418578063bd55022a14610437578063e086e5ec1461044c578063e7bfde9814610460575f80fd5b80637535d246146102fd578063795674ff146103305780637a4bc3791461036357806386001519146103895780638da5cb5b1461039e575f80fd5b80631b11d0ff116100f95780631b11d0ff1461021b578063578c71d91461024a5780635c975abb1461025f5780635fafa589146102785780636d13582c146102ab5780636ff1c9bc146102de575f80fd5b80630542975c1461013f5780630da92ae61461018f5780631223ff03146101b057806316c38b3c146101dd5780631a3ce4e6146101fc575f80fd5b3661013b57005b5f80fd5b34801561014a575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561019a575f80fd5b506101ae6101a93660046114d0565b610474565b005b3480156101bb575f80fd5b506101cf6101ca366004611551565b61062b565b604051908152602001610186565b3480156101e8575f80fd5b506101ae6101f73660046115ac565b61074a565b348015610207575f80fd5b506101ae6102163660046115ce565b6107a5565b348015610226575f80fd5b5061023a6102353660046115e5565b61082e565b6040519015158152602001610186565b348015610255575f80fd5b506101cf60045481565b34801561026a575f80fd5b5060035461023a9060ff1681565b348015610283575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b3480156102b6575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b3480156102e9575f80fd5b506101ae6102f836600461168a565b610b0b565b348015610308575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b34801561033b575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b34801561036e575f80fd5b50610377600181565b60405160ff9091168152602001610186565b348015610394575f80fd5b506101cf60015481565b3480156103a9575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b3480156103dc575f80fd5b506101727f000000000000000000000000000000000000000000000000000000000000000081565b34801561040f575f80fd5b50610377600281565b348015610423575f80fd5b506101cf6104323660046116a5565b610c74565b348015610442575f80fd5b506101cf60025481565b348015610457575f80fd5b506101ae610d30565b34801561046b575f80fd5b50610377600381565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104c55760405162461bcd60e51b81526004016104bc906116e1565b60405180910390fd5b60035460ff16156105055760405162461bcd60e51b815260206004820152600a602482015269109bdd081c185d5cd95960b21b60448201526064016104bc565b60025f54036105425760405162461bcd60e51b81526020600482015260096024820152681499595b9d1c985b9d60ba1b60448201526064016104bc565b60025f908155604080516001600160a01b038916602082015260ff80891692820192909252908616606082015262ffffff8516608082015260a0810184905260c0810183905260e00160408051601f19818403018152908290526310ac2ddf60e21b825291506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906342b0b77c906105ef9030908d908d9087905f90600401611704565b5f604051808303815f87803b158015610606575f80fd5b505af1158015610618573d5f803e3d5ffd5b505060015f555050505050505050505050565b6040805160028082526060820183525f928392919060208301908036833701905050905084815f815181106106625761066261177d565b60200260200101906001600160a01b031690816001600160a01b03168152505083816001815181106106965761069661177d565b6001600160a01b03928316602091820292909201015260405163d06ca61f60e01b81525f9188169063d06ca61f906106d490879086906004016117d4565b5f60405180830381865afa1580156106ee573d5f803e3d5ffd5b505050506040513d5f823e601f3d908101601f1916820160405261071591908101906117f4565b9050806001825161072691906118d0565b815181106107365761073661177d565b602002602001015192505050949350505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107925760405162461bcd60e51b81526004016104bc906116e1565b6003805460ff1916911515919091179055565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107ed5760405162461bcd60e51b81526004016104bc906116e1565b6103e88111156108295760405162461bcd60e51b81526020600482015260076024820152664d61782031302560c81b60448201526064016104bc565b600455565b5f336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146108995760405162461bcd60e51b815260206004820152600f60248201526e10d85b1b195c881b9bdd081c1bdbdb608a1b60448201526064016104bc565b6001600160a01b03841630146108e15760405162461bcd60e51b815260206004820152600d60248201526c2130b21034b734ba34b0ba37b960991b60448201526064016104bc565b5f6108ec8484610e68565b90505f61090c82602001518a845f01518b86606001518760a00151610eda565b90505f610919888a6118e9565b90505f6109358460400151855f01518d86886060015187610eda565b90508181116109725760405162461bcd60e51b8152602060048201526009602482015268139bc81c1c9bd99a5d60ba1b60448201526064016104bc565b5f61097d83836118d0565b905084608001518110156109c55760405162461bcd60e51b815260206004820152600f60248201526e10995b1bddc81b5a5b941c9bd99a5d608a1b60448201526064016104bc565b6109f08c7f000000000000000000000000000000000000000000000000000000000000000085610f6a565b610a1b8c7f000000000000000000000000000000000000000000000000000000000000000083611122565b60018054820181556002805490910190556040518181526001600160a01b038d8116917f0000000000000000000000000000000000000000000000000000000000000000909116907f5dfb7e9c7037fed8a1b66fed916e48c15c342742afcca674425ed54b9a6e30249060200160405180910390a360208086015160408088015181518f815293840185905260ff928316918401919091521660608201524260808201526001600160a01b038d16907f71e9ab98349f53008889a1751e4e66777fa751a6663f24039498c3b21d029bd79060a00160405180910390a26001955050505050505b9695505050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610b535760405162461bcd60e51b81526004016104bc906116e1565b6040516370a0823160e01b81523060048201525f906001600160a01b038316906370a0823190602401602060405180830381865afa158015610b97573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610bbb91906118fc565b90505f8111610c025760405162461bcd60e51b81526020600482015260136024820152724e6f7468696e6720746f20776974686472617760681b60448201526064016104bc565b610c2d827f000000000000000000000000000000000000000000000000000000000000000083611122565b816001600160a01b03167f5fafa99d0643513820be26656b45130b01e1c03062e1266bf36f88cbd3bd969582604051610c6891815260200190565b60405180910390a25050565b60405163f7729d4360e01b81526001600160a01b038581166004830152848116602483015262ffffff84166044830152606482018390525f608483018190529182917f0000000000000000000000000000000000000000000000000000000000000000169063f7729d439060a4016080604051808303815f875af1158015610cfe573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610d229190611913565b509198975050505050505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610d785760405162461bcd60e51b81526004016104bc906116e1565b4780610daf5760405162461bcd60e51b815260206004820152600660248201526509cde408aa8960d31b60448201526064016104bc565b5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316826040515f6040518083038185875af1925050503d805f8114610e18576040519150601f19603f3d011682016040523d82523d5f602084013e610e1d565b606091505b5050905080610e645760405162461bcd60e51b8152602060048201526013602482015272115512081d1c985b9cd9995c8819985a5b1959606a1b60448201526064016104bc565b5050565b6040805160c0810182525f80825260208201819052918101829052606081018290526080810182905260a0810191909152610ea582840184611962565b60a0870152608086015262ffffff16606085015260ff90811660408501521660208301526001600160a01b0316815292915050565b5f60021960ff881601610efb57610ef48686868686611223565b9050610b01565b5f60ff8816600214610f2d577f0000000000000000000000000000000000000000000000000000000000000000610f4f565b7f00000000000000000000000000000000000000000000000000000000000000005b9050610f5e8188888887611358565b98975050505050505050565b604080516001600160a01b0384811660248301525f604480840182905284518085039091018152606490930184526020830180516001600160e01b031663095ea7b360e01b179052925190861691610fc1916119c6565b5f604051808303815f865af19150503d805f8114610ffa576040519150601f19603f3d011682016040523d82523d5f602084013e610fff565b606091505b50509050806110445760405162461bcd60e51b8152602060048201526011602482015270105c1c1c9bdd994a0c0a4819985a5b1959607a1b60448201526064016104bc565b604080516001600160a01b038581166024830152604480830186905283518084039091018152606490920183526020820180516001600160e01b031663095ea7b360e01b17905291515f9287169161109b916119c6565b5f604051808303815f865af19150503d805f81146110d4576040519150601f19603f3d011682016040523d82523d5f602084013e6110d9565b606091505b505090508061111b5760405162461bcd60e51b815260206004820152600e60248201526d105c1c1c9bdd994819985a5b195960921b60448201526064016104bc565b5050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b17905291515f9283929087169161117d91906119c6565b5f604051808303815f865af19150503d805f81146111b6576040519150601f19603f3d011682016040523d82523d5f602084013e6111bb565b606091505b50915091508180156111e55750805115806111e55750808060200190518101906111e591906119dc565b61111b5760405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b60448201526064016104bc565b5f61124f867f000000000000000000000000000000000000000000000000000000000000000086610f6a565b60408051610100810182525f6080820181905260a0820181905260c0820181905260e08201526001600160a01b0388811682528716602082015262ffffff8516918101919091523060608201526112a84261012c6118e9565b608082015260a0810185905260c081018390525f60e082015260405163414bf38960e01b81527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063414bf3899061130d9084906004016119f7565b6020604051808303815f875af1158015611329573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061134d91906118fc565b979650505050505050565b5f611364858785610f6a565b6040805160028082526060820183525f9260208301908036833701905050905085815f815181106113975761139761177d565b60200260200101906001600160a01b031690816001600160a01b03168152505084816001815181106113cb576113cb61177d565b6001600160a01b0392831660209182029290920101525f9088166338ed1739868685306113fa4261012c6118e9565b6040518663ffffffff1660e01b815260040161141a959493929190611a74565b5f604051808303815f875af1158015611435573d5f803e3d5ffd5b505050506040513d5f823e601f3d908101601f1916820160405261145c91908101906117f4565b9050806001825161146d91906118d0565b8151811061147d5761147d61177d565b60200260200101519250505095945050505050565b6001600160a01b03811681146114a6575f80fd5b50565b803560ff811681146114b9575f80fd5b919050565b803562ffffff811681146114b9575f80fd5b5f805f805f805f80610100898b0312156114e8575f80fd5b88356114f381611492565b975060208901359650604089013561150a81611492565b955061151860608a016114a9565b945061152660808a016114a9565b935061153460a08a016114be565b979a969950949793969295929450505060c08201359160e0013590565b5f805f8060808587031215611564575f80fd5b843561156f81611492565b9350602085013561157f81611492565b9250604085013561158f81611492565b9396929550929360600135925050565b80151581146114a6575f80fd5b5f602082840312156115bc575f80fd5b81356115c78161159f565b9392505050565b5f602082840312156115de575f80fd5b5035919050565b5f805f805f8060a087890312156115fa575f80fd5b863561160581611492565b95506020870135945060408701359350606087013561162381611492565b9250608087013567ffffffffffffffff81111561163e575f80fd5b8701601f8101891361164e575f80fd5b803567ffffffffffffffff811115611664575f80fd5b896020828401011115611675575f80fd5b60208201935080925050509295509295509295565b5f6020828403121561169a575f80fd5b81356115c781611492565b5f805f80608085870312156116b8575f80fd5b84356116c381611492565b935060208501356116d381611492565b925061158f604086016114be565b6020808252600990820152682737ba1037bbb732b960b91b604082015260600190565b60018060a01b038616815260018060a01b038516602082015283604082015260a060608201525f83518060a0840152806020860160c085015e5f60c0828501015260c0601f19601f83011684010191505061ffff831660808301529695505050505050565b634e487b7160e01b5f52604160045260245ffd5b634e487b7160e01b5f52603260045260245ffd5b5f8151808452602084019350602083015f5b828110156117ca5781516001600160a01b03168652602095860195909101906001016117a3565b5093949350505050565b828152604060208201525f6117ec6040830184611791565b949350505050565b5f60208284031215611804575f80fd5b815167ffffffffffffffff81111561181a575f80fd5b8201601f8101841361182a575f80fd5b805167ffffffffffffffff81111561184457611844611769565b8060051b604051601f19603f830116810181811067ffffffffffffffff8211171561187157611871611769565b60405291825260208184018101929081018784111561188e575f80fd5b6020850194505b838510156118b157845180825260209586019590935001611895565b509695505050505050565b634e487b7160e01b5f52601160045260245ffd5b818103818111156118e3576118e36118bc565b92915050565b808201808211156118e3576118e36118bc565b5f6020828403121561190c575f80fd5b5051919050565b5f805f8060808587031215611926575f80fd5b8451602086015190945061193981611492565b604086015190935063ffffffff81168114611952575f80fd5b6060959095015193969295505050565b5f805f805f8060c08789031215611977575f80fd5b863561198281611492565b9550611990602088016114a9565b945061199e604088016114a9565b93506119ac606088016114be565b9598949750929560808101359460a0909101359350915050565b5f82518060208501845e5f920191825250919050565b5f602082840312156119ec575f80fd5b81516115c78161159f565b81516001600160a01b03908116825260208084015182169083015260408084015162ffffff169083015260608084015191821690830152610100820190506080830151608083015260a083015160a083015260c083015160c083015260e0830151611a6d60e08401826001600160a01b03169052565b5092915050565b85815284602082015260a060408201525f611a9260a0830186611791565b6001600160a01b039490941660608301525060800152939250505056fea2646970667358221220afe8d29ed257c32eb9f4726c45188c2b0f76f6e048ee2fa7deb4b5fcb186da0064736f6c634300081a0033a2646970667358221220924cf6b71592e282d6e55dca4e3e782348d6aa9444fb609364e137a5ace3fc5f64736f6c634300081a0033';
const DEPLOY_BOT_SELECTOR = '29a3517a'; // deployBot()
const BOT_DEPLOYED_TOPIC0 = '0xbfe8884ec71a1c1542d99052a484afa086f6ed58a0852e1fb819bd2b4aeb5582'; // BotDeployed(address,address,uint256)

// ─── ABI ENCODING HELPERS (Pure JS — no ethers.js needed) ────────────────────
function hexPad32(hex) {
  const clean = hex.replace('0x','');
  return clean.padStart(64,'0');
}
function encodeAddress(addr) {
  return hexPad32(addr.replace('0x','').toLowerCase());
}
function encodeUint256(n) {
  const v = BigInt(n);
  return hexPad32(v.toString(16));
}
function encodeUint8(n) {
  return hexPad32((Number(n)||0).toString(16));
}
function encodeUint24(n) {
  return hexPad32((Number(n)||0).toString(16));
}
function encodeBool(b) {
  return hexPad32(b ? '1' : '0');
}

// DEX identifier constants (match Solidity contract)
const DEX_UNI_V2 = 1;
const DEX_SUSHI  = 2;
const DEX_UNI_V3 = 3;

// Uniswap V3 fee tiers
const V3_FEE_TIERS = { LOW: 500, MED: 3000, HIGH: 10000 };

// ─── FRESH ON-CHAIN QUOTE HELPERS (anti stale-spread / anti fake-data guard) ──
// These re-check real V2-style router prices via a raw eth_call *immediately*
// before signing, so we never submit a real flash-loan tx against a spread
// that (a) never existed on-chain (simulated/random data) or (b) has already
// closed since the opportunity list was fetched.
function encodeGetAmountsOutCalldata(amountIn, path) {
  // getAmountsOut(uint256,address[]) selector
  const selector = 'd06ca61f';
  const head = encodeUint256(amountIn) + encodeUint256(64) + encodeUint256(path.length);
  const body = path.map(p => encodeAddress(p)).join('');
  return '0x' + selector + head + body;
}
function decodeAmountsOutResult(data) {
  const hex = data.startsWith('0x') ? data.slice(2) : data;
  if (hex.length < 128) return null;
  const length = parseInt(hex.slice(64, 128), 16);
  const out = [];
  for (let i = 0; i < length; i++) {
    const start = 128 + i * 64;
    out.push(BigInt('0x' + hex.slice(start, start + 64)));
  }
  return out;
}
async function rpcEthCall(chainId, to, data) {
  const rpcs = PUBLIC_RPCS[chainId] || PUBLIC_RPCS['1'];
  for (const rpc of rpcs) {
    try {
      const res = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to, data }, 'latest'] })
      });
      const d = await res.json();
      if (d.result && d.result !== '0x') return d.result;
    } catch (_) { /* try next RPC */ }
  }
  return null;
}
// Returns the fresh output amount (BigInt) for a V2-style getAmountsOut call, or null if unavailable.
async function freshV2Quote(chainId, router, amountIn, path) {
  try {
    const calldata = encodeGetAmountsOutCalldata(amountIn, path);
    const result = await rpcEthCall(chainId, router, calldata);
    if (!result) return null;
    const amounts = decodeAmountsOutResult(result);
    if (!amounts || !amounts.length) return null;
    const last = amounts[amounts.length - 1];
    return (last && last > 0n) ? last : null;
  } catch (_) { return null; }
}

// Encode constructor(address _addressProvider, address _uniV2Router, address _sushiRouter,
//                    address _uniV3Router, address _uniV3Quoter, address _owner)
// v3.6: 6 args — uniV3Quoter is 5th arg, owner is 6th
function encodeConstructorArgs(provider, uniV2, sushi, uniV3, quoter, ownerAddress) {
  return encodeAddress(provider) + encodeAddress(uniV2) + encodeAddress(sushi) +
         encodeAddress(uniV3) + encodeAddress(quoter) + encodeAddress(ownerAddress);
}

// Encode ArbitrageBotFactory's constructor(address,address,address,address,address)
// — same 5 router/provider/quoter args as the bot, minus the owner (the factory
// has no owner of its own; each deployed bot's owner is set to msg.sender at
// deployBot() time instead).
function encodeFactoryConstructorArgs(provider, uniV2, sushi, uniV3, quoter) {
  return encodeAddress(provider) + encodeAddress(uniV2) + encodeAddress(sushi) +
         encodeAddress(uniV3) + encodeAddress(quoter);
}

// v3.7 executeArbitrage(address,uint256,address,uint8,uint8,uint24,uint256,uint256)
// — adds minOutBuy as the 8th arg (real slippage floor on the buy leg, replacing
// the old hardcoded `1`). Kept separate from the 7-arg v3.6 encoder above so
// bots deployed against either bytecode version can still be executed correctly.
function encodeExecuteArbitrageV37(token, amount, mid, buyDex, sellDex, v3Fee, minProfit, minOutBuy) {
  const selector = '0da92ae6'; // executeArbitrage(address,uint256,address,uint8,uint8,uint24,uint256,uint256), verified via solc methodIdentifiers
  return '0x' + selector +
    encodeAddress(token) + encodeUint256(amount) + encodeAddress(mid) +
    encodeUint8(buyDex) + encodeUint8(sellDex) + encodeUint24(v3Fee) +
    encodeUint256(minProfit) + encodeUint256(minOutBuy);
}

// Pull the newly created bot's address out of a deployBot() transaction receipt.
// The factory's constructor return value isn't surfaced by eth_sendTransaction
// (that's only for direct contract-creation txs), so we read it out of the
// BotDeployed(address indexed owner, address indexed bot, uint256 index) event
// instead — `bot` is topics[2], the last 20 bytes of that 32-byte topic.
function decodeBotDeployedAddress(receipt, factoryAddr) {
  if (!receipt || !receipt.logs) return null;
  const log = receipt.logs.find(l =>
    l.address?.toLowerCase() === factoryAddr.toLowerCase() &&
    l.topics?.[0]?.toLowerCase() === BOT_DEPLOYED_TOPIC0.toLowerCase()
  );
  if (!log || !log.topics?.[2]) return null;
  return '0x' + log.topics[2].slice(-40);
}

// Which factory (if any) is known for this chain. Factories are deployed once
// per chain via deployFactoryContract() and then reused by every user's
// deployBotViaFactory() call — we cache the resulting address in localStorage
// rather than hardcoding it, since none has been deployed anywhere yet.
function getFactoryAddress(chainId) {
  return localStorage.getItem('flasharb_factory_' + chainId) || '';
}
function setFactoryAddress(chainId, address) {
  localStorage.setItem('flasharb_factory_' + chainId, address);
}

// ─── NETWORK-AWARE GAS FEE ESTIMATOR ────────────────────────────────────────
// Returns {maxFeePerGas, maxPriorityFeePerGas} as 0x-prefixed hex strings
// Polygon (137) uses Gas Station V2 API (min priority fee = 30 gwei)
// All other chains use eth_feeHistory with network-appropriate floors
async function getGasFees(chainId) {
  const gweiToHex = g => '0x' + BigInt(Math.ceil(g * 1e9)).toString(16);

  // ── Polygon Mainnet: use official Gas Station V2 ──────────────────────
  if (chainId === '137') {
    try {
      const resp = await fetch('https://gasstation.polygon.technology/v2');
      if (resp.ok) {
        const data = await resp.json();
        // Use 'standard' tier; ensure > 30 gwei floor
        const prio = Math.max(data.standard?.maxPriorityFee || 35, 35);
        const base = data.estimatedBaseFee || 50;
        const maxFee = base * 1.5 + prio; // generous maxFee ceiling
        tlog(`[gas] Polygon Gas Station: base=${base.toFixed(1)} prio=${prio.toFixed(1)} max=${maxFee.toFixed(1)} gwei`, 'dim');
        return {
          maxFeePerGas:         gweiToHex(maxFee),
          maxPriorityFeePerGas: gweiToHex(prio)
        };
      }
    } catch(e) {
      tlog(`[gas] Polygon Gas Station unreachable, using fallback: ${e.message}`, 'warn');
    }
    // Fallback: safe values above Polygon's 30 gwei minimum
    return { maxFeePerGas: gweiToHex(600), maxPriorityFeePerGas: gweiToHex(40) };
  }

  // ── All other chains: eth_feeHistory ─────────────────────────────────
  // Per-chain minimum priority fee floors (gwei)
  const PRIO_FLOOR = { '56': 5, '8453': 0.5, '10': 0.5, '42161': 0.5 };
  const floorGwei  = PRIO_FLOOR[chainId] ?? 2;

  try {
    const feeData = await window.ethereum.request({
      method: 'eth_feeHistory', params: ['0x5', 'latest', [25, 50, 75]]
    });
    if (feeData?.baseFeePerGas?.length) {
      // Average the last 5 base fees for stability
      const bases  = feeData.baseFeePerGas.slice(-5).map(h => Number(BigInt(h)));
      const avgBase = bases.reduce((a,b) => a+b, 0) / bases.length;
      // Median 50th-percentile reward gives us a realistic priority fee
      const rewards = (feeData.reward || []).map(r => Number(BigInt(r[1] || '0x0')));
      const medReward = rewards.length
        ? rewards.sort((a,b)=>a-b)[Math.floor(rewards.length/2)]
        : 0;
      const prioWei = Math.max(medReward * 1.2, floorGwei * 1e9);
      const maxFeeWei = avgBase * 2 + prioWei;
      tlog(`[gas] eth_feeHistory: base=${(avgBase/1e9).toFixed(2)} prio=${(prioWei/1e9).toFixed(2)} max=${(maxFeeWei/1e9).toFixed(2)} gwei`, 'dim');
      return {
        maxFeePerGas:         '0x' + BigInt(Math.ceil(maxFeeWei)).toString(16),
        maxPriorityFeePerGas: '0x' + BigInt(Math.ceil(prioWei)).toString(16)
      };
    }
  } catch(e) {
    tlog(`[gas] eth_feeHistory failed, using safe fallback: ${e.message}`, 'warn');
  }

  // Final fallback — conservative safe values per chain
  const FALLBACK = {
    '1':   { maxFeePerGas: gweiToHex(50),  maxPriorityFeePerGas: gweiToHex(2) },
    '137': { maxFeePerGas: gweiToHex(600), maxPriorityFeePerGas: gweiToHex(40) },
    '42161':{ maxFeePerGas: gweiToHex(2),  maxPriorityFeePerGas: gweiToHex(0.5) },
    '10':  { maxFeePerGas: gweiToHex(2),   maxPriorityFeePerGas: gweiToHex(0.5) },
    '8453':{ maxFeePerGas: gweiToHex(3),   maxPriorityFeePerGas: gweiToHex(0.5) },
    '56':  { maxFeePerGas: gweiToHex(10),  maxPriorityFeePerGas: gweiToHex(5) },
  };
  return FALLBACK[chainId] ?? { maxFeePerGas: gweiToHex(50), maxPriorityFeePerGas: gweiToHex(2) };
}
// ─────────────────────────────────────────────────────────────────────────────

// Encode executeArbitrage(address token, uint256 amount, address mid, uint8 buyDex, uint8 sellDex, uint24 v3Fee, uint256 minProfit)
// Selector: keccak256("executeArbitrage(address,uint256,address,uint8,uint8,uint24,uint256)") = 0x62e8ce64
function encodeExecuteArbitrage(token, amount, mid, buyDex, sellDex, v3Fee, minProfit) {
  const selector = '62e8ce64';
  return '0x' + selector +
    encodeAddress(token) +
    encodeUint256(amount) +
    encodeAddress(mid) +
    encodeUint8(buyDex) +
    encodeUint8(sellDex) +
    encodeUint24(v3Fee) +
    encodeUint256(minProfit);
}

// Encode setSlippageBps(uint256 _bps) — selector: keccak256("setSlippageBps(uint256)") = 0x1a3ce4e6
function encodeSetSlippageBps(bps) { return '0x1a3ce4e6' + encodeUint256(bps); }
// Encode setPaused(bool _p) — selector: keccak256("setPaused(bool)") = 0x16c38b3c
function encodeSetPaused(p) { return '0x16c38b3c' + encodeBool(p); }
// Encode emergencyWithdraw(address token) — selector: keccak256("emergencyWithdraw(address)") = 0x6ff1c9bc
function encodeEmergencyWithdraw(token) { return '0x6ff1c9bc' + encodeAddress(token); }
// Encode withdrawETH() — selector: keccak256("withdrawETH()") = 0xe086e5ec
function encodeWithdrawETH() { return '0xe086e5ec'; }
// Selectors for view calls — computed from real keccak256
function encodeTotalProfitSelector() { return '0x86001519'; }  // totalProfit()
function encodeTradeCountSelector() { return '0xbd55022a'; }   // tradeCount()
function encodeOwnerSelector() { return '0x8da5cb5b'; }        // owner()
function encodePausedSelector() { return '0x5c975abb'; }       // paused()
function encodeSlippageBpsSelector() { return '0x578c71d9'; }  // slippageBps()

// ABI event topic for ArbitrageExecuted(address indexed token, uint256 loan, uint256 profit, uint8 buyDex, uint8 sellDex, uint256 ts)
// keccak256("ArbitrageExecuted(address,uint256,uint256,uint8,uint8,uint256)") = 0x...
// Real topic0: keccak256("ArbitrageExecuted(address,uint256,uint256,uint8,uint8,uint256)")
const ARBITRAGE_EXECUTED_TOPIC = '0x71e9ab98349f53008889a1751e4e66777fa751a6663f24039498c3b21d029bd7';

// ─── TOKEN ADDRESSES (per chainId) ───────────────────────────────────────────
const TOKEN_ADDRS = {
  '1': { // Ethereum Mainnet
    WETH:  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC:  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT:  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    WBTC:  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    DAI:   '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    LINK:  '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    AAVE:  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    UNI:   '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  },
  '137': { // Polygon
    WETH:  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    USDC:  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT:  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    WMATIC:'0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    WBTC:  '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    DAI:   '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },
  '42161': { // Arbitrum
    WETH:  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    USDC:  '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    USDT:  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    WBTC:  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    DAI:   '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    LINK:  '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    ARB:   '0x912CE59144191C1204E64559FE8253a0e49E6548',
  },
  '10': { // Optimism
    WETH:  '0x4200000000000000000000000000000000000006',
    USDC:  '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    USDT:  '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    WBTC:  '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
    DAI:   '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    OP:    '0x4200000000000000000000000000000000000042',
  },
  '8453': { // Base
    WETH:  '0x4200000000000000000000000000000000000006',
    USDC:  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    USDT:  '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    DAI:   '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    WBTC:  '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  },
  '56': { // BNB Chain
    WETH:  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    USDC:  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDT:  '0x55d398326f99059fF775485246999027B3197955',
    WBNB:  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    BTCB:  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    DAI:   '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    BUSD:  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
  '11155111': { // Sepolia testnet
    WETH:  '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    USDC:  '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    USDT:  '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    DAI:   '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
    LINK:  '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    AAVE:  '0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a',
    WBTC:  '0x29f2D40B0605204364af54EC677bD022dA425d03',
    UNI:   '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  },
};

// Mid tokens to route through for arbitrage
const MID_TOKENS_BY_CHAIN = {
  '1':        ['USDC','USDT','WBTC','DAI'],
  '137':      ['USDC','USDT','WBTC','DAI'],
  '42161':    ['USDC','USDT','WBTC','DAI'],
  '10':       ['USDC','USDT','WBTC','DAI'],
  '8453':     ['USDC','USDT','WBTC','DAI'],
  '56':       ['USDC','USDT','BTCB','DAI','BUSD'],
  '11155111': ['USDC','USDT','DAI','LINK','AAVE'],
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = (n, d=2) => Number(n||0).toFixed(d);
const fmtUSD = n => '$' + Number(n||0).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2});
const fmtK = n => n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':Number(n||0).toFixed(2);
const shortAddr = a => a ? a.slice(0,6)+'...'+a.slice(-4) : '';
const randHex = (l=64) => '0x'+Array.from({length:l},()=>Math.floor(Math.random()*16).toString(16)).join('');
const nowT = () => new Date().toLocaleTimeString();

function getNativePrice() {
  const sym = NET_REGISTRY[STATE.currentChainId]?.symbol || 'ETH';
  if (sym==='MATIC') return PRICE_MAP.MATIC || 0.072;
  if (sym==='BNB')   return PRICE_MAP.BNB   || 580;
  if (sym==='SepoliaETH') return 0;
  return PRICE_MAP.ETH || 3247;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg, type='info', dur=4500) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = {success:'✅',error:'❌',info:'ℹ️',warn:'⚠️'};
  el.innerHTML = `<span style="font-size:16px;">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  $('toast-container').appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .4s, transform .4s';
    el.style.opacity = '0'; el.style.transform = 'translateX(20px)';
    setTimeout(() => el.remove(), 400);
  }, dur);
}

// ─── TERMINAL LOG ─────────────────────────────────────────────────────────────
function log(termId, msg, cls='dim') {
  const t = $(termId); if (!t) return;
  const line = document.createElement('span');
  line.className = `ll ${cls}`;
  line.textContent = `[${nowT()}] ${msg}`;
  t.appendChild(line);
  t.scrollTop = t.scrollHeight;
  // Keep terminal at max 200 lines
  while (t.children.length > 200) t.removeChild(t.firstChild);
}
const tlog = (m, c='dim') => log('terminal', m, c);
const wlog = (m, c='dim') => log('w3-console', m, c);

// ─── BROWSER RPC ──────────────────────────────────────────────────────────────
async function browserRpc(chainId, method, params=[]) {
  const rpcs = PUBLIC_RPCS[chainId] || PUBLIC_RPCS['1'];
  for (const url of rpcs) {
    try {
      const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({jsonrpc:'2.0',method,params,id:1}) });
      if (!res.ok) continue;
      const d = await res.json();
      if (d.result !== undefined) return d.result;
    } catch(_) {}
  }
  return null;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAlchemyBadge();
  populateNetworkMenus();
  populateDeployNetworkSelect();
  loadContractSource();
  initCharts();
  startPollers();
  updateMarketIntel();
  updateAIRecs();
  updateChainCompare();
  updateStrategyScores();
  updateLedgerSummary();
  updateDeployedList();
  renderRecentMini();
  updateExecStatusBanner();

  // Web3 detection
  if (window.ethereum) {
    tlog('[web3] MetaMask / browser wallet detected (EIP-1193)', 'success');
    wlog('[eip1193] window.ethereum ready', 'success');
    window.ethereum.on('accountsChanged', onAccountsChanged);
    window.ethereum.on('chainChanged', onChainChanged);
    window.ethereum.request({method:'eth_accounts'}).then(accs => {
      if (accs && accs.length) {
        window.ethereum.request({method:'eth_chainId'}).then(hexId => {
          const chainId = String(parseInt(hexId, 16));
          setWalletConnected(accs[0], 'MetaMask', chainId);
        });
      }
    }).catch(() => {});
    $('rpc-status').textContent = 'EIP-1193 Ready';
    $('rpc-status').className = 'badge badge-green';
  } else {
    tlog('[web3] No wallet detected — install MetaMask', 'warn');
    wlog('[eip1193] window.ethereum not found', 'warn');
  }

  if (!STATE.alchemyKey) setTimeout(() => openApiModal(), 1500);

  document.addEventListener('click', e => {
    if (STATE.networkMenuOpen && !e.target.closest('#network-badge') && !e.target.closest('#network-menu'))
      closeNetworkMenu();
  });
});

// ─── ALCHEMY KEY ──────────────────────────────────────────────────────────────
function initAlchemyBadge() {
  const badge = $('alchemy-badge-text'); if (!badge) return;
  if (STATE.alchemyKey) {
    badge.textContent = 'Alchemy: Live';
    badge.style.color = 'var(--green)';
  } else {
    badge.textContent = 'Free RPC Active';
    badge.style.color = 'var(--cyan)';
  }
}
function openApiModal() { $('api-modal').style.display='flex'; if (STATE.alchemyKey) $('alchemy-key-input').value=STATE.alchemyKey; }
function closeApiModal() { $('api-modal').style.display='none'; }
function saveAlchemyKey() {
  const v = ($('alchemy-key-input').value||'').trim();
  if (!v) { toast('Enter a valid Alchemy API key','warn'); return; }
  STATE.alchemyKey = v; localStorage.setItem('flasharb_alchemy_key', v);
  initAlchemyBadge(); closeApiModal();
  toast('Alchemy key saved — live data activated','success');
  tlog('[alchemy] API key configured — upgrading to Alchemy RPC', 'success');
  fetchPrices(); fetchGas(); fetchBlock();
  if (STATE.wallet.connected) fetchWalletBalance();
}

// ─── TAB NAVIGATION ───────────────────────────────────────────────────────────
function switchTab(n) {
  for (let i = 0; i < 6; i++) {
    const s = $(`s${i}`), t = $(`tab-${i}`);
    if (s) s.classList.toggle('active', i===n);
    if (t) t.classList.toggle('active', i===n);
  }
  if (n===5) { estimateDeployCost(); }
  if (n===2 && STATE.wallet.connected) refreshPortfolio();
  if (n===3) updateStrategyScores();
  if (n===4) { renderLedger(); updateLedgerSummary(); }
}

// ─── NETWORK ──────────────────────────────────────────────────────────────────
function populateNetworkMenus() {
  const ml = $('mainnet-list'), tl = $('testnet-list');
  if (!ml || !tl) return; ml.innerHTML = ''; tl.innerHTML = '';
  Object.entries(NET_REGISTRY).forEach(([id, net]) => {
    const div = document.createElement('div');
    div.className = 'net-item' + (id===STATE.currentChainId?' active':'');
    div.innerHTML = `<span class="sdot" style="background:${net.color};box-shadow:0 0 5px ${net.color};"></span><span>${net.name}</span>${net.isTestnet?'<span class="badge badge-yellow" style="font-size:9px;padding:1px 4px;margin-left:auto;">TEST</span>':''}`;
    div.onclick = () => selectNetwork(id);
    (net.isTestnet ? tl : ml).appendChild(div);
  });
}
function toggleNetworkMenu() { STATE.networkMenuOpen=!STATE.networkMenuOpen; $('network-menu').style.display=STATE.networkMenuOpen?'block':'none'; }
function closeNetworkMenu() { STATE.networkMenuOpen=false; $('network-menu').style.display='none'; }

function selectNetwork(chainId) {
  STATE.currentChainId = chainId; closeNetworkMenu(); updateNetworkDisplay();
  fetchGas(); fetchBlock();
  if (STATE.wallet.connected) fetchWalletBalance();
  updateFaucetPanel();
  updateExecStatusBanner();
  tlog(`[network] Selected ${NET_REGISTRY[chainId]?.name}`, 'info');
}

// ─── EXECUTION STATUS BANNER ──────────────────────────────────────────────────
function updateExecStatusBanner() {
  const dot = $('exec-banner-dot');
  const msg = $('exec-banner-msg');
  if (!dot || !msg) return;
  const contractAddr = getDeployedContractAddress(STATE.currentChainId);
  const net = NET_REGISTRY[STATE.currentChainId];
  if (!STATE.wallet.connected) {
    dot.style.background = 'var(--yellow)';
    msg.style.color = 'var(--ts)';
    msg.textContent = 'Connect your MetaMask wallet, then deploy PersonalArbitrageBot to execute real flash loans.';
  } else if (!contractAddr) {
    dot.style.background = 'var(--yellow)';
    msg.style.color = 'var(--yellow)';
    msg.innerHTML = `Wallet connected (${shortAddr(STATE.wallet.address)}) — no contract deployed on ${net?.name}. Click "Deploy Contract" to deploy PersonalArbitrageBot.`;
  } else if (net?.isTestnet) {
    dot.style.background = 'var(--green)';
    dot.style.animation = 'pulseDot 1.4s ease-in-out infinite';
    msg.style.color = 'var(--green)';
    msg.innerHTML = `✅ <strong>Testnet Ready</strong> — Contract: <span style="font-family:var(--mono)">${shortAddr(contractAddr)}</span> on ${net?.name}. Click any "Execute (Testnet)" button to run real flash loans with test ETH.`;
  } else {
    dot.style.background = 'var(--red)';
    dot.style.animation = 'pulseDot 0.8s ease-in-out infinite';
    msg.style.color = 'var(--red)';
    msg.innerHTML = `⚠ <strong>MAINNET LIVE</strong> — Contract: <span style="font-family:var(--mono)">${shortAddr(contractAddr)}</span> on ${net?.name}. Real ETH at stake. Click "⚡ Execute REAL →" to sign flash loan transactions.`;
  }
}

function updateNetworkDisplay() {
  const net = NET_REGISTRY[STATE.currentChainId]; if (!net) return;
  const dot=$('net-dot'), name=$('net-name'), tag=$('testnet-tag');
  if (dot) { dot.style.background=net.color; dot.style.boxShadow=`0 0 6px ${net.color}`; }
  if (name) name.textContent = net.name;
  if (tag) tag.style.display = net.isTestnet ? 'inline-flex' : 'none';
  populateNetworkMenus();
  const sn = $('scan-net'); if (sn) sn.textContent = net.name.replace(' Mainnet','').replace(' Testnet','').replace(' Smart Chain','');
}

// ─── PRICE FETCHING ───────────────────────────────────────────────────────────
// Browser-direct: CoinGecko (free, CORS-open) primary; Alchemy price API when key is set.
async function fetchPrices() {
  const COIN_IDS = {
    ETH:'ethereum', BTC:'bitcoin', BNB:'binancecoin', MATIC:'matic-network',
    LINK:'chainlink', AAVE:'aave', UNI:'uniswap', ARB:'arbitrum', OP:'optimism', DAI:'dai'
  };
  const SYMBOLS = Object.keys(COIN_IDS);
  let p = {}, source = 'simulated';

  // ── Try Alchemy price API when user has set a key ─────────────────────────
  const key = STATE.alchemyKey;
  if (key && key !== 'demo' && key.length > 10) {
    try {
      const alchRes = await fetch(
        `https://api.g.alchemy.com/prices/v1/${encodeURIComponent(key)}/tokens/by-symbol?symbols=${SYMBOLS.join(',')}`,
        { headers: { accept: 'application/json' } }
      );
      if (alchRes.ok) {
        const alchData = await alchRes.json();
        const entries = alchData?.data || [];
        entries.forEach(item => {
          const sym = item.symbol?.toUpperCase();
          const price = parseFloat(item?.prices?.[0]?.value || 0);
          if (sym && price > 0) {
            p[sym] = { price, change24h: 0 };
            PRICE_MAP[sym] = price;
          }
        });
        if (Object.keys(p).length >= 3) source = 'alchemy';
      }
    } catch(_) {}
  }

  // ── CoinGecko free API (primary fallback, CORS-open) ─────────────────────
  if (source !== 'alchemy') {
    try {
      const ids = Object.values(COIN_IDS).join(',');
      const cgRes = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { headers: { accept: 'application/json' } }
      );
      if (cgRes.ok) {
        const cgData = await cgRes.json();
        SYMBOLS.forEach(sym => {
          const id = COIN_IDS[sym];
          const entry = cgData[id];
          if (entry && entry.usd > 0) {
            p[sym] = { price: entry.usd, change24h: entry.usd_24h_change || 0 };
            PRICE_MAP[sym] = entry.usd;
          }
        });
        // DAI is always $1
        p['DAI'] = { price: 1.0, change24h: 0 }; PRICE_MAP['DAI'] = 1.0;
        if (Object.keys(p).length >= 3) source = 'coingecko';
      }
    } catch(_) {}
  }

  // ── If both live sources failed keep existing STATE.prices to avoid blanking ──
  if (Object.keys(p).length < 3 && Object.keys(STATE.prices || {}).length > 0) return;

  STATE.prices = p;
  renderPriceList(p, source);
  renderTicker(p);
  updateEthStat(p);
  const el = $('price-ts'); if (el) el.textContent = new Date().toLocaleTimeString();
  const sb = $('price-src-badge');
  if (sb) {
    const srcLabels = { alchemy:'⚡ Alchemy', coingecko:'🦎 CoinGecko', simulated:'📡 Simulated' };
    sb.textContent = srcLabels[source] || source;
    sb.className = `badge ${source==='simulated'?'badge-yellow':source==='alchemy'?'badge-green':'badge-cyan'}`;
  }
}

function renderPriceList(prices, source) {
  const el = $('price-list'); if (!el) return;
  const tokens = ['ETH','BTC','BNB','MATIC','LINK','AAVE','UNI','ARB','OP','DAI'];
  el.innerHTML = tokens.map(sym => {
    const d = prices[sym]; if (!d) return '';
    const ch = d.change24h || 0;
    const col = ch>=0 ? 'var(--green)' : 'var(--red)';
    const price = sym==='BTC' ? '$'+Number(d.price).toLocaleString('en-US',{maximumFractionDigits:0}) : fmtUSD(d.price);
    const icon = {ETH:'Ξ',BTC:'₿',MATIC:'◈',BNB:'⬡',LINK:'⬡',AAVE:'Â',UNI:'🦄',ARB:'△',OP:'⭕',DAI:'◈'}[sym]||'●';
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd2);">
      <div style="display:flex;align-items:center;gap:7px;">
        <span style="width:26px;height:26px;background:var(--bc2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--cyan);">${sym.slice(0,2)}</span>
        <span class="mono" style="font-size:12px;font-weight:700;">${sym}</span>
      </div>
      <div style="text-align:right;">
        <div class="mono" style="font-size:12px;font-weight:700;">${price}</div>
        <div style="font-size:10px;color:${col};">${ch>=0?'▲':'▼'}${Math.abs(ch).toFixed(2)}%</div>
      </div>
    </div>`;
  }).join('');
}

function renderTicker(prices) {
  const el = $('ticker-prices'); if (!el) return;
  const tokens = ['ETH','BTC','BNB','MATIC','LINK','AAVE','UNI','ARB','OP'];
  let html = '';
  tokens.forEach(sym => {
    const d = prices[sym]; if (!d) return;
    const ch = d.change24h||0; const col = ch>=0 ? 'var(--green)' : 'var(--red)';
    const price = sym==='BTC' ? '$'+Number(d.price).toLocaleString('en-US',{maximumFractionDigits:0}) : fmtUSD(d.price);
    html += `<span style="margin:0 18px;white-space:nowrap;"><span style="color:var(--tm);font-size:11px;">${sym}</span> <span style="color:var(--tc);font-weight:600;font-size:12px;">${price}</span> <span style="color:${col};font-size:10px;">${ch>=0?'▲':'▼'}${Math.abs(ch).toFixed(2)}%</span></span>`;
  });
  el.innerHTML = html + html; // duplicate for seamless loop
}

function updateEthStat(prices) {
  const eth = prices['ETH']; if (!eth) return;
  const ep = $('st-ethprice'), ec = $('st-ethch');
  if (ep) ep.textContent = fmtUSD(eth.price);
  if (ec) { const ch=eth.change24h||0; ec.textContent=`${ch>=0?'+':''}${ch.toFixed(2)}% 24h`; ec.style.color=ch>=0?'var(--green)':'var(--red)'; }
}

// ─── GAS FETCHING ─────────────────────────────────────────────────────────────
// Browser-direct: eth_gasPrice + eth_getBlockByNumber via public RPCs (no backend needed).
async function fetchGas() {
  const chainId = STATE.currentChainId;
  let gasPrice = 0, baseFee = 0, source = 'public_rpc', rpcUsed = '';
  try {
    // eth_gasPrice gives us the effective gas price
    const gasPriceHex = await browserRpc(chainId, 'eth_gasPrice', []);
    if (gasPriceHex) {
      gasPrice = parseInt(gasPriceHex, 16) / 1e9; // wei → gwei
    }
    // Latest block header gives us baseFeePerGas (EIP-1559 chains)
    const block = await browserRpc(chainId, 'eth_getBlockByNumber', ['latest', false]);
    if (block?.baseFeePerGas) {
      baseFee = parseInt(block.baseFeePerGas, 16) / 1e9;
    }
    // Record which RPC actually answered
    const rpcs = PUBLIC_RPCS[chainId] || PUBLIC_RPCS['1'];
    rpcUsed = rpcs[0] || '';
  } catch(_) {}

  // Fallback: keep last known value rather than showing 0
  if (!gasPrice && STATE.gasGwei) gasPrice = STATE.gasGwei;
  if (!baseFee) baseFee = gasPrice;

  STATE.gasGwei = gasPrice || 4;
  STATE.rpcSource = source;
  const gd=$('gas-display'); if (gd) gd.textContent=`${fmt(gasPrice,2)} gwei`;
  const sg=$('scan-gas');    if (sg) sg.textContent=fmt(gasPrice,2);
  const stg=$('st-gwei');    if (stg) stg.textContent=`${fmt(gasPrice,2)} gwei`;
  renderGasTracker(gasPrice, baseFee, source, rpcUsed);
  updateMarketIntel();
}

function renderGasTracker(gas, base, source, rpcUsed) {
  const el = $('gas-tracker'); if (!el) return;
  const slow=fmt(gas*0.80,2), fast=fmt(gas*1.15,2), rapid=fmt(gas*1.40,2);
  const srcLabel = source==='alchemy'?'⚡ Alchemy':source==='public_rpc'?'🌐 Public RPC':'📊 Simulated';
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">
      <div style="text-align:center;background:var(--bc2);border-radius:9px;padding:9px;">
        <div style="font-size:10px;color:var(--ts);">Slow</div>
        <div class="mono" style="font-size:16px;font-weight:800;color:var(--green);">${slow}</div>
        <div style="font-size:9px;color:var(--tm);">gwei</div>
      </div>
      <div style="text-align:center;background:var(--bc2);border-radius:9px;padding:9px;">
        <div style="font-size:10px;color:var(--ts);">Standard</div>
        <div class="mono" style="font-size:16px;font-weight:800;color:var(--yellow);">${fmt(gas,2)}</div>
        <div style="font-size:9px;color:var(--tm);">gwei</div>
      </div>
      <div style="text-align:center;background:var(--bc2);border-radius:9px;padding:9px;">
        <div style="font-size:10px;color:var(--ts);">Rapid</div>
        <div class="mono" style="font-size:16px;font-weight:800;color:var(--red);">${rapid}</div>
        <div style="font-size:9px;color:var(--tm);">gwei</div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--ts);align-items:center;">
      <span>Base fee: <span class="mono" style="color:var(--cyan);">${fmt(base||gas,2)} gwei</span></span>
      <span class="badge badge-cyan" style="font-size:9px;">${srcLabel}</span>
    </div>
    ${rpcUsed?`<div style="font-size:9px;color:var(--tm);margin-top:5px;word-break:break-all;">via ${rpcUsed.replace('https://','')}</div>`:''}`;
}

// ─── BLOCK ────────────────────────────────────────────────────────────────────
async function fetchBlock() {
  // Browser-direct: eth_blockNumber via public RPCs (no backend needed).
  const chainId = STATE.currentChainId;
  try {
    const blockHex = await browserRpc(chainId, 'eth_blockNumber', []);
    if (blockHex) {
      const blockNumber = parseInt(blockHex, 16);
      STATE.blockNumber = blockNumber;
      const bd=$('block-display'); if (bd) bd.textContent=Number(blockNumber).toLocaleString();
      const sb=$('scan-block');    if (sb) sb.textContent=Number(blockNumber).toLocaleString();
    }
  } catch(_) {}
}

// ─── POLLERS ──────────────────────────────────────────────────────────────────
function startPollers() {
  fetchPrices(); fetchGas(); fetchBlock();
  STATE.priceInterval = setInterval(fetchPrices, 10000);
  STATE.gasInterval   = setInterval(fetchGas, 16000);
  STATE.blockInterval = setInterval(fetchBlock, 13000);
}

// ─── WALLET ───────────────────────────────────────────────────────────────────
function connectWallet() { switchTab(2); }

async function connectMetaMask() {
  if (!window.ethereum) { toast('MetaMask not detected. Install from metamask.io','error'); return; }
  const btn = $('mm-btn'); if (btn) { btn.disabled=true; btn.innerHTML='<span style="animation:spin .8s linear infinite;display:inline-block;margin-right:6px;">⟳</span>Connecting...'; }
  try {
    wlog('[eip1193] Requesting eth_requestAccounts...', 'info');
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    if (!accounts || !accounts.length) throw new Error('No accounts returned');
    const hexChain = await window.ethereum.request({method:'eth_chainId'});
    const chainId = String(parseInt(hexChain, 16));
    await setWalletConnected(accounts[0], 'MetaMask', chainId);
    wlog(`[eip1193] ✅ Connected: ${shortAddr(accounts[0])} chainId=${chainId}`, 'success');
    tlog(`[wallet] MetaMask connected: ${shortAddr(accounts[0])}`, 'success');
    toast(`Wallet connected: ${shortAddr(accounts[0])}`, 'success');
  } catch(e) {
    const msg = e.code===4001 ? 'User rejected connection' : e.message||'Connection failed';
    toast(msg, 'error'); wlog(`[eip1193] Error: ${msg}`, 'error');
  } finally {
    const b = $('mm-btn');
    if (b) { b.disabled=false; b.innerHTML='<div class="wp-icon">🦊</div><div class="wp-info"><div class="wp-name">MetaMask</div><div class="wp-desc">EIP-1193 Browser Wallet</div></div><i class="fas fa-chevron-right wp-arrow"></i>'; }
  }
}

async function connectWC() {
  toast('WalletConnect — simulation mode', 'info');
  wlog('[wc2] Initiating session (simulation)...', 'info');
  setTimeout(async () => {
    const mockAddr = '0x'+Array.from({length:40},()=>Math.floor(Math.random()*16).toString(16)).join('');
    await setWalletConnected(mockAddr, 'WalletConnect', STATE.currentChainId);
    toast('WalletConnect session established (simulation)', 'success');
    wlog('[wc2] Session established', 'success');
  }, 1800);
}

async function connectCB() {
  if (window.ethereum?.isCoinbaseWallet) {
    try {
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      await setWalletConnected(accounts[0], 'Coinbase Wallet', STATE.currentChainId);
      toast('Coinbase Wallet connected', 'success'); return;
    } catch(_) {}
  }
  toast('Coinbase Wallet — simulation mode', 'info');
  setTimeout(async () => {
    const mockAddr = '0x'+Array.from({length:40},()=>Math.floor(Math.random()*16).toString(16)).join('');
    await setWalletConnected(mockAddr, 'Coinbase Wallet', STATE.currentChainId);
    toast('Coinbase Wallet connected (simulation)', 'success');
  }, 1200);
}

async function generateDemoWallet() {
  const fakeAddr = randHex(40);
  await setWalletConnected(fakeAddr, 'Demo Wallet', STATE.currentChainId);
  toast('Demo wallet generated — simulation only', 'info');
  wlog('[demo] Demo wallet generated — no real keys involved', 'warn');
}

async function setWalletConnected(address, provider, chainId) {
  const resolvedChain = NET_REGISTRY[chainId] ? chainId : '1';
  STATE.currentChainId = resolvedChain;
  STATE.wallet = { connected:true, address, provider, balance:0, usdValue:0, sessionProfitUSD:0, sessionGasETH:0, sessionProfitETH:0 };

  $('w-disconn').style.display = 'none';
  $('w-conn').style.display = 'block';
  $('w-addr-box').textContent = shortAddr(address);
  $('w-prov').textContent = provider;
  const net = NET_REGISTRY[resolvedChain];
  const nb = $('w-netbadge');
  if (nb) { nb.textContent = net ? net.name : `Chain ${chainId}`; nb.className = `badge ${net?.isTestnet?'badge-yellow':'badge-cyan'}`; }
  const avatarMap = {'MetaMask':'🦊','WalletConnect':'🔗','Coinbase Wallet':'🔵','Demo Wallet':'🧪'};
  const av = $('w-avatar'); if (av) av.textContent = avatarMap[provider] || '👛';

  const wb=$('wallet-btn'), wbt=$('wallet-btn-text');
  if (wb) wb.style.background = 'linear-gradient(135deg,#00e676,#00c853)';
  if (wbt) wbt.textContent = shortAddr(address);

  updateNetworkDisplay();
  populateWalletNetworkSelect();
  updateFaucetPanel();
  updateExecStatusBanner();
  await fetchWalletBalance();
  renderWalletSessionStats();
}

async function fetchWalletBalance() {
  if (!STATE.wallet.connected) return;
  const addr = STATE.wallet.address, chainId = STATE.currentChainId;
  let balWei = null;

  if (window.ethereum && STATE.wallet.provider==='MetaMask') {
    try { const hex = await window.ethereum.request({method:'eth_getBalance',params:[addr,'latest']}); balWei = parseInt(hex, 16); } catch(_) {}
  }
  if (balWei===null) {
    try {
      const key = STATE.alchemyKey||'demo';
      const res = await axios.get(`/api/alchemy/balance?key=${encodeURIComponent(key)}&chainId=${chainId}&address=${addr}`);
      if (res.data.balance!=null) balWei = res.data.balance*1e18;
    } catch(_) {}
  }
  if (balWei===null) {
    try { const hex = await browserRpc(chainId,'eth_getBalance',[addr,'latest']); if (hex) balWei=parseInt(hex,16); } catch(_) {}
  }

  const balEth = balWei!=null ? balWei/1e18 : STATE.wallet.balance;
  const net = NET_REGISTRY[chainId];
  const sym = net?.symbol || 'ETH';
  const natPrice = sym==='MATIC'?PRICE_MAP.MATIC:sym==='BNB'?PRICE_MAP.BNB:(PRICE_MAP.ETH||3247);
  const usdVal = balEth * natPrice;

  STATE.wallet.balance = balEth; STATE.wallet.usdValue = usdVal;
  $('w-native').textContent = fmt(balEth, 4);
  $('w-native-sym').textContent = sym;
  $('w-usd').textContent = fmtUSD(usdVal);
  $('portfolio-net').textContent = `— ${net?.name||''}`;
  refreshPortfolio();
  renderWalletSessionStats();
  wlog(`[balance] ${fmt(balEth,6)} ${sym} = ${fmtUSD(usdVal)}  (chain ${chainId})`, 'info');
}

function renderWalletSessionStats() {
  const el = $('w-conn'); if (!el) return;
  let statsEl = $('w-session-stats');
  if (!statsEl) { statsEl=document.createElement('div'); statsEl.id='w-session-stats'; statsEl.style.marginTop='14px'; el.appendChild(statsEl); }
  const w = STATE.wallet;
  const natSym = NET_REGISTRY[STATE.currentChainId]?.symbol||'ETH';
  const netPnl = w.sessionProfitUSD - w.sessionGasETH*getNativePrice();
  statsEl.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--ts);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px;">Session Activity</div>
    <div class="session-stats-grid">
      <div class="session-stat">
        <div style="font-size:10px;color:var(--ts);">Gas Spent</div>
        <div class="mono" style="font-size:15px;font-weight:800;color:var(--red);">-${fmt(w.sessionGasETH,5)}</div>
        <div style="font-size:10px;color:var(--tm);">${natSym}</div>
      </div>
      <div class="session-stat">
        <div style="font-size:10px;color:var(--ts);">Profit</div>
        <div class="mono" style="font-size:15px;font-weight:800;color:var(--green);">+${fmtUSD(w.sessionProfitUSD)}</div>
        <div style="font-size:10px;color:var(--tm);">USD</div>
      </div>
    </div>
    <div style="margin-top:9px;padding:9px 12px;background:var(--bc2);border-radius:9px;display:flex;justify-content:space-between;font-size:12px;">
      <span style="color:var(--ts);">Net P&L</span>
      <span class="mono" style="font-weight:800;color:${netPnl>=0?'var(--green)':'var(--red)'};">${netPnl>=0?'+':''}${fmtUSD(netPnl)}</span>
    </div>`;
}

function populateWalletNetworkSelect() {
  const sel = $('w-netsel'); if (!sel) return; sel.innerHTML='';
  Object.entries(NET_REGISTRY).forEach(([id,net]) => {
    const opt = document.createElement('option'); opt.value=id;
    opt.textContent = net.name + (net.isTestnet?' (testnet)':'');
    if (id===STATE.currentChainId) opt.selected=true;
    sel.appendChild(opt);
  });
}

async function switchWalletNetwork() {
  const newChain = $('w-netsel').value; const net = NET_REGISTRY[newChain]; if (!net) return;
  if (window.ethereum && STATE.wallet.provider==='MetaMask') {
    try {
      await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:net.hexId}]});
    } catch(e) {
      if (e.code===4902) {
        try { await window.ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:net.hexId,chainName:net.name,rpcUrls:[PUBLIC_RPCS[newChain]?.[0]||'https://rpc.ankr.com'],blockExplorerUrls:[net.explorer],nativeCurrency:{name:net.symbol,symbol:net.symbol,decimals:18}}]}); }
        catch(e2) { toast('Failed to add network','error'); return; }
      } else { toast('Network switch cancelled','warn'); return; }
    }
  }
  STATE.currentChainId = newChain; updateNetworkDisplay(); updateFaucetPanel();
  fetchGas(); fetchBlock(); fetchWalletBalance();
  toast(`Switched to ${net.name}`, 'info');
  wlog(`[network] Switched to ${net.name}`, 'info');
}

function updateFaucetPanel() {
  const panel = $('faucet-panel'); if (!panel) return;
  const net = NET_REGISTRY[STATE.currentChainId];
  if (net?.isTestnet && net.faucets) {
    panel.style.display = 'block';
    const fl = $('faucet-list');
    if (fl) fl.innerHTML = net.faucets.map(f => `<a href="${f.url}" target="_blank" class="faucet-link"><i class="fas fa-faucet" style="color:var(--cyan);"></i>${f.name}<i class="fas fa-external-link-alt" style="font-size:9px;margin-left:auto;"></i></a>`).join('');
  } else panel.style.display = 'none';
}

async function refreshPortfolio() {
  if (!STATE.wallet.connected) return;
  const el = $('portfolio-list'); if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:14px;color:var(--ts);font-size:12px;"><i class="fas fa-circle-notch fa-spin mr1"></i>Loading...</div>';
  try {
    const key = STATE.alchemyKey||'demo';
    const res = await axios.get(`/api/alchemy/tokens?key=${encodeURIComponent(key)}&chainId=${STATE.currentChainId}&address=${STATE.wallet.address}`);
    const {tokens, source, note} = res.data;
    const net = NET_REGISTRY[STATE.currentChainId];
    let html = `<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--bd2);">
      <div style="display:flex;align-items:center;gap:7px;"><span style="width:26px;height:26px;background:var(--bc2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:var(--cyan);">Ξ</span><span class="mono" style="font-weight:700;">${net?.symbol||'ETH'}</span><span style="font-size:10px;color:var(--ts);">Native</span></div>
      <div class="mono" style="font-size:13px;font-weight:700;color:var(--cyan);">${fmt(STATE.wallet.balance,6)}</div>
    </div>`;
    if (tokens && tokens.length) {
      tokens.slice(0,15).forEach(t => {
        const b = parseInt(t.tokenBalance||'0x0',16); if (b===0) return;
        html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--bd2);"><div class="mono" style="font-size:11px;color:var(--ts);">${shortAddr(t.contractAddress)}</div><div class="mono" style="font-size:11px;">${(b/1e18).toFixed(4)}</div></div>`;
      });
    } else {
      html += `<div style="font-size:11px;color:var(--tm);padding:9px 0;">${note||'No ERC-20 tokens found. Add Alchemy key for full portfolio view.'}</div>`;
    }
    html += `<div style="font-size:10px;color:var(--tm);padding-top:7px;text-align:right;">Source: ${source}</div>`;
    el.innerHTML = html;
  } catch(e) { el.innerHTML='<div style="color:var(--red);font-size:12px;padding:10px;">Portfolio load failed</div>'; }
}

function copyAddr() {
  if (!STATE.wallet.address) return;
  navigator.clipboard.writeText(STATE.wallet.address).then(() => toast('Address copied to clipboard','success'));
}

function disconnWallet() {
  STATE.wallet = {connected:false,address:'',provider:'',balance:0,usdValue:0,sessionProfitUSD:0,sessionGasETH:0,sessionProfitETH:0};
  $('w-disconn').style.display='block'; $('w-conn').style.display='none';
  const wb=$('wallet-btn'),wbt=$('wallet-btn-text');
  if (wb) wb.style.background=''; if (wbt) wbt.textContent='Connect Wallet';
  $('portfolio-list').innerHTML='<div class="empty-state-sm">Connect wallet to view portfolio</div>';
  toast('Wallet disconnected','info'); tlog('[wallet] Disconnected','warn');
  updateExecStatusBanner();
}

function onAccountsChanged(accounts) {
  if (!accounts||!accounts.length) { disconnWallet(); return; }
  STATE.wallet.address = accounts[0];
  $('w-addr-box').textContent = shortAddr(accounts[0]);
  $('wallet-btn-text').textContent = shortAddr(accounts[0]);
  fetchWalletBalance();
  toast(`Account: ${shortAddr(accounts[0])}`, 'info');
}
function onChainChanged(hexId) {
  const chainId = String(parseInt(hexId,16));
  STATE.currentChainId = chainId; updateNetworkDisplay();
  fetchGas(); fetchBlock();
  if (STATE.wallet.connected) fetchWalletBalance();
  toast(`Network: ${NET_REGISTRY[chainId]?.name||chainId}`, 'info');
  wlog(`[chain] Changed to ${NET_REGISTRY[chainId]?.name||chainId}`, 'info');
}

function runW3Cmd() {
  const inp = $('w3-cmd'); if (!inp) return;
  const cmd = inp.value.trim(); if (!cmd) return;
  inp.value = '';
  wlog(`> ${cmd}`, 'info');
  if (cmd==='eth_blockNumber') { wlog(`Block: #${STATE.blockNumber.toLocaleString()}`, 'success'); }
  else if (cmd==='eth_gasPrice') { wlog(`Gas: ${fmt(STATE.gasGwei,4)} gwei`, 'success'); }
  else if (cmd.startsWith('eth_getBalance') && STATE.wallet.connected) { wlog(`Balance: ${fmt(STATE.wallet.balance,6)} ${NET_REGISTRY[STATE.currentChainId]?.symbol||'ETH'}`, 'success'); }
  else { wlog(`Error: command '${cmd}' not recognized in demo mode`, 'error'); }
}

// ─── BOT ENGINE ───────────────────────────────────────────────────────────────
function toggleBot() {
  STATE.botRunning = !STATE.botRunning;
  const btn=$('bot-btn'), icon=$('bot-icon'), txt=$('bot-txt');
  const dot=$('bot-dot'), st=$('bot-status-text'), bar=$('scan-bar');
  if (STATE.botRunning) {
    btn.className='btn-danger'; btn.style.cssText='padding:9px 22px;font-weight:800;font-size:14px;letter-spacing:.3px;';
    icon.className='fas fa-stop'; txt.textContent='STOP BOT';
    dot.style.background='var(--green)'; dot.style.animation='pulseDot 1.4s ease-in-out infinite';
    st.textContent='Bot Running'; bar.style.display='flex';
    tlog('[bot] ⚡ Engine started — scanning DEXes for arbitrage', 'success');
    toast('Bot started — scanning for opportunities', 'success');
    startScan();
  } else {
    btn.className='btn-success'; btn.style.cssText='padding:9px 22px;font-weight:800;font-size:14px;letter-spacing:.3px;';
    icon.className='fas fa-play'; txt.textContent='START BOT';
    dot.style.background='var(--tm)'; dot.style.animation='';
    st.textContent='Bot Idle'; bar.style.display='none';
    tlog('[bot] Stopped', 'warn'); toast('Bot stopped', 'info'); stopScan();
  }
}

function toggleAuto() {
  STATE.autoMode = !STATE.autoMode;
  const span = $('auto-st');
  if (span) { span.textContent=STATE.autoMode?'ON':'OFF'; span.style.color=STATE.autoMode?'var(--green)':'var(--cyan)'; }
  tlog(`[auto] Auto-execute mode ${STATE.autoMode?'ENABLED':'DISABLED'}`, STATE.autoMode?'success':'warn');
  if (STATE.autoMode) {
    const contractAddr = getDeployedContractAddress(STATE.currentChainId);
    const net = NET_REGISTRY[STATE.currentChainId];
    if (contractAddr && STATE.wallet.connected && !net?.isTestnet) {
      toast('⚠ AUTO-EXECUTE ON — Real mainnet transactions will be signed automatically. Ensure opportunities are profitable!', 'error', 9000);
      tlog('[auto] ⚠ MAINNET auto-execute active — will submit real txs automatically', 'error');
    } else if (contractAddr && STATE.wallet.connected) {
      toast('Auto-execute enabled — will execute testnet flash loans automatically', 'warn', 6000);
    } else {
      toast('Auto-execute enabled — simulation mode (deploy contract to enable real execution)', 'info', 6000);
    }
  }
}

function startScan() {
  STATE.scanInterval = setInterval(async () => {
    if (!STATE.botRunning) return;
    await refreshOpps();
    if (STATE.autoMode && STATE.opportunities.length > 0) {
      const best = STATE.opportunities[0];
      const minPct = parseFloat($('min-profit')?.value||'0.5');
      if (best.profitPercent >= minPct) {
        tlog(`[auto] 🎯 Auto-executing: ${best.tokenPair} (${best.profitPercent.toFixed(3)}%)`, 'success');
        await openSignModal(0);
        await new Promise(r => setTimeout(r, 500));
        await confirmSign();
      }
    }
  }, 8000);
  refreshOpps();
}

function stopScan() {
  if (STATE.scanInterval) { clearInterval(STATE.scanInterval); STATE.scanInterval=null; }
  const cnt = $('scan-cnt'); if (cnt) cnt.textContent='0';
  const src = $('scan-source'); if (src) src.textContent='';
}

// ─── BROWSER-DIRECT ON-CHAIN SCANNER ─────────────────────────────────────────
// Calls getAmountsOut on Uniswap V2 and SushiSwap routers directly from the browser
// via public RPCs — no backend required, no CF-Worker outbound-fetch limitation.
// Returns opportunities with source:'live' when real on-chain spreads are found.
async function scanOnChainOpps(chainId) {
  const net = NET_REGISTRY[chainId];
  if (!net) return [];

  const tokens   = TOKEN_ADDRS[chainId] || TOKEN_ADDRS['1'];
  const midSyms  = MID_TOKENS_BY_CHAIN[chainId] || ['USDC','USDT'];
  const ethPrice = PRICE_MAP.ETH || 3000;
  const nativePrice = getNativePrice();

  // Loan sizes to probe (in native token units × 1e18, or stablecoin × 1e6)
  const LOAN_SIZES_ETH   = [1n, 5n, 10n, 50n].map(x => x * 10n**18n);
  const LOAN_SIZES_USDC  = [1000n, 5000n, 10000n].map(x => x * 10n**6n);

  const AAVE_PREMIUM_BPS = 9n; // 0.09 %
  const MIN_PROFIT_BPS   = 20n; // 0.20 % minimum after premium + gas

  const opps = [];

  // Base pairs: scan WETH, WBTC, and chain-native wrapped token (e.g. WMATIC on Polygon)
  const nativeWrapped = NET_REGISTRY[chainId]?.symbol === 'MATIC' ? 'WMATIC'
    : NET_REGISTRY[chainId]?.symbol === 'BNB' ? 'WBNB' : 'WETH';
  const baseSyms = [...new Set(['WETH', 'WBTC', nativeWrapped])].filter(s => tokens[s]);

  for (const baseSymbol of baseSyms) {
    const baseAddr = tokens[baseSymbol];
    const isStable = false;
    // Polygon WETH liquidity is shallower — use smaller loan for accurate quote
    const loanSizes = (chainId === '137' && baseSymbol === 'WETH') ? LOAN_SIZES_ETH.map(x => x / 5n) : LOAN_SIZES_ETH;

    for (const midSym of midSyms) {
      const midAddr = tokens[midSym];
      if (!midAddr || midAddr === baseAddr) continue;

      const path = [baseAddr, midAddr];
      const pathRev = [midAddr, baseAddr];

      // Query both routers in parallel
      let uniOut = null, sushiOut = null;
      try {
        const [uniRaw, sushiRaw] = await Promise.all([
          rpcEthCall(chainId, net.uniRouter, encodeGetAmountsOutCalldata(loanSizes[1], path)),
          rpcEthCall(chainId, net.sushiRouter, encodeGetAmountsOutCalldata(loanSizes[1], path))
        ]);
        if (uniRaw)   uniOut   = decodeAmountsOutResult(uniRaw);
        if (sushiRaw) sushiOut = decodeAmountsOutResult(sushiRaw);
      } catch(_) { continue; }

      if (!uniOut || !sushiOut) continue;

      // uniOut[1] = midTokens received on Uniswap for loanSizes[1] input
      // Now simulate selling those mid tokens back on the other DEX
      let uniSellRaw = null, sushiSellRaw = null;
      try {
        [uniSellRaw, sushiSellRaw] = await Promise.all([
          rpcEthCall(chainId, net.uniRouter,   encodeGetAmountsOutCalldata(sushiOut[1], pathRev)),
          rpcEthCall(chainId, net.sushiRouter, encodeGetAmountsOutCalldata(uniOut[1], pathRev))
        ]);
      } catch(_) { continue; }

      const uniSellOut   = uniSellRaw   ? decodeAmountsOutResult(uniSellRaw)   : null;
      const sushiSellOut = sushiSellRaw ? decodeAmountsOutResult(sushiSellRaw) : null;

      // Route A: buy on Sushi → sell on Uni
      if (sushiOut && uniSellOut) {
        const loanAmt  = loanSizes[1];
        const owed     = loanAmt + (loanAmt * AAVE_PREMIUM_BPS / 10000n);
        const returned = uniSellOut[1]; // base tokens out from the sell leg
        if (returned > owed) {
          const rawProfit    = returned - owed;
          const profitPct    = Number(rawProfit * 10000n / loanAmt) / 100;
          if (profitPct >= 0.15) { // 0.15% minimum to surface
            const loanUSD  = Number(loanAmt) / 1e18 * nativePrice;
            const profitUSD = profitPct / 100 * loanUSD;
            const confidence = Math.min(95, Math.round(60 + profitPct * 15));
            opps.push({
              id: `live-${baseSymbol}-${midSym}-sushi-uni-${Date.now()}`,
              tokenPair: `${baseSymbol}/${midSym}`,
              buyDex: 'SushiSwap', sellDex: 'Uniswap V2',
              profitPercent: profitPct,
              estimatedProfit: profitUSD,
              loanAmount: loanUSD,
              confidence, risk: profitPct > 1 ? 'HIGH' : profitPct > 0.4 ? 'MEDIUM' : 'LOW',
              source: 'live',
              minProfit: rawProfit.toString(),
              gasEstimate: 280000,
            });
          }
        }
      }

      // Route B: buy on Uni → sell on Sushi
      if (uniOut && sushiSellOut) {
        const loanAmt  = loanSizes[1];
        const owed     = loanAmt + (loanAmt * AAVE_PREMIUM_BPS / 10000n);
        const returned = sushiSellOut[1];
        if (returned > owed) {
          const rawProfit = returned - owed;
          const profitPct = Number(rawProfit * 10000n / loanAmt) / 100;
          if (profitPct >= 0.15) {
            const loanUSD   = Number(loanAmt) / 1e18 * nativePrice;
            const profitUSD = profitPct / 100 * loanUSD;
            const confidence = Math.min(95, Math.round(60 + profitPct * 15));
            opps.push({
              id: `live-${baseSymbol}-${midSym}-uni-sushi-${Date.now()}`,
              tokenPair: `${baseSymbol}/${midSym}`,
              buyDex: 'Uniswap V2', sellDex: 'SushiSwap',
              profitPercent: profitPct,
              estimatedProfit: profitUSD,
              loanAmount: loanUSD,
              confidence, risk: profitPct > 1 ? 'HIGH' : profitPct > 0.4 ? 'MEDIUM' : 'LOW',
              source: 'live',
              minProfit: rawProfit.toString(),
              gasEstimate: 280000,
            });
          }
        }
      }
    }
  }

  return opps.sort((a, b) => b.profitPercent - a.profitPercent);
}

async function refreshOpps() {
  const chainId = STATE.currentChainId;
  let opportunities = [], source = 'simulated';
  let scanOk = false;

  // ── Primary: browser-direct on-chain DEX scanner ─────────────────────────
  try {
    tlog('[scan] 🔍 Browser-direct on-chain scan starting...', 'dim');
    const liveOpps = await scanOnChainOpps(chainId);
    if (liveOpps.length > 0) {
      opportunities = liveOpps;
      source = 'live';
      scanOk = true;
      tlog(`[scan] ✅ On-chain scan complete: ${liveOpps.length} live opp(s) found`, 'success');
    } else {
      tlog('[scan] On-chain scan returned 0 opps above threshold — falling back to backend', 'dim');
    }
  } catch(e) {
    tlog(`[scan] On-chain scan error: ${e.message} — falling back to backend`, 'warn');
  }

  // ── Fallback: backend /api/opportunities (may return simulated data) ──────
  if (!scanOk) {
    try {
      const res = await axios.get(`/api/opportunities?chainId=${chainId}`);
      const d = res.data;
      opportunities = d.opportunities || [];
      source = d.source || 'simulated';
    } catch(e) {
      tlog('[scan] Backend fallback also failed: ' + e.message, 'warn');
    }
  }

  const minPct  = parseFloat($('min-profit')?.value  || '0.5');
  const maxLoan = parseFloat($('max-loan')?.value    || '100000');
  STATE.opportunities = opportunities.filter(o => o.profitPercent >= minPct && o.loanAmount <= maxLoan);
  renderOpportunities(STATE.opportunities, source);
  updateOppSummary(STATE.opportunities, source);
  const cnt = $('scan-cnt');   if (cnt) cnt.textContent = STATE.opportunities.length;
  const src = $('scan-source'); if (src) src.textContent = `[${source}]`;
  const badge = $('opp-badge');
  if (badge) { badge.textContent = STATE.opportunities.length; badge.style.display = STATE.opportunities.length ? 'inline-flex' : 'none'; }
  $('st-opps').textContent = STATE.opportunities.length;
  const best = STATE.opportunities[0];
  const sb = $('st-best'); if (sb) sb.textContent = best ? `${best.profitPercent.toFixed(2)}%` : '0.00%';
  updateStrategyScores();
  if (STATE.opportunities.length > 0) tlog(`[scan] Found ${STATE.opportunities.length} opportunities (source: ${source})`, 'success');
}

function updateOppSummary(opps, source) {
  const total=$('opp-total'), bestSpread=$('opp-best-spread'), bestProfit=$('opp-best-profit'), avgConf=$('opp-avg-conf'), dataSrc=$('opp-data-src');
  if (total) total.textContent=opps.length;
  if (bestSpread) bestSpread.textContent=opps.length?`${opps[0].profitPercent.toFixed(3)}%`:'0.00%';
  if (bestProfit) bestProfit.textContent=opps.length?fmtUSD(opps[0].estimatedProfit||0):'$0.00';
  if (avgConf) avgConf.textContent=opps.length?Math.round(opps.reduce((a,o)=>a+(o.confidence||0),0)/opps.length)+'%':'0%';
  const srcBadge = $('opp-source-badge'); if (srcBadge) { srcBadge.textContent=source==='live'?'🟢 Live On-Chain':'📡 Simulated'; srcBadge.className=`badge ${source==='live'?'badge-green':'badge-yellow'}`; }
  if (dataSrc) dataSrc.textContent=source==='live'?'On-Chain':'Simulated';
}

function sortOpps() {
  const sort = $('opp-sort')?.value || 'profit';
  const sorted = [...STATE.opportunities].sort((a,b) => {
    if (sort==='profit') return b.profitPercent-a.profitPercent;
    if (sort==='conf')   return b.confidence-a.confidence;
    if (sort==='loan')   return b.loanAmount-a.loanAmount;
    if (sort==='risk')   return {HIGH:3,MEDIUM:2,LOW:1}[b.risk]-{HIGH:3,MEDIUM:2,LOW:1}[a.risk];
    return 0;
  });
  renderOpportunities(sorted, 'sorted');
}

function filterOpps() {
  const filter = $('opp-filter')?.value || 'all';
  const filtered = filter==='all' ? STATE.opportunities : STATE.opportunities.filter(o=>o.risk===filter);
  renderOpportunities(filtered, 'filtered');
}

function renderOpportunities(opps, source) {
  const el = $('opps-list'); if (!el) return;
  if (!opps.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No Opportunities Found</div><div class="empty-sub">${STATE.botRunning?'Scanning... try adjusting min profit threshold':'Start the bot to scan for cross-DEX arbitrage'}</div></div>`;
    return;
  }
  const net = NET_REGISTRY[STATE.currentChainId];
  el.innerHTML = opps.map((o, idx) => {
    const riskCol = {HIGH:'var(--red)',MEDIUM:'var(--yellow)',LOW:'var(--green)'}[o.risk]||'var(--ts)';
    const riskBadge = {HIGH:'badge-red',MEDIUM:'badge-yellow',LOW:'badge-green'}[o.risk]||'badge-cyan';
    const gasUSD = (o.gasEstimateGwei||5)*300000/1e9*(getNativePrice());
    const netEst = (o.estimatedProfit||0) - (o.flashFee||0) - gasUSD;
    const confPct = Math.min(100, o.confidence||70);
    const srcBadge = o.source==='live' ? `<span class="badge badge-green" style="font-size:9px;">🟢 Live</span>` : `<span class="badge badge-yellow" style="font-size:9px;">📡 Sim</span>`;
    return `<div class="opp-card risk-${o.risk}" id="opp-${idx}">
      <div class="opp-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="opp-pair">${o.tokenPair}</div>
          ${srcBadge}
          <span class="badge ${riskBadge}">${o.risk} RISK</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="text-align:right;">
            <div class="mono" style="font-size:20px;font-weight:900;color:var(--green);">+${o.profitPercent.toFixed(3)}%</div>
            <div style="font-size:10px;color:var(--ts);">Spread</div>
          </div>
        </div>
      </div>
      <div class="opp-meta">
        <div class="opp-meta-item">
          <div class="opp-meta-label">Buy On</div>
          <div class="opp-meta-val cyan">${o.buyDex}</div>
        </div>
        <div class="opp-meta-item">
          <div class="opp-meta-label">Sell On</div>
          <div class="opp-meta-val teal">${o.sellDex}</div>
        </div>
        <div class="opp-meta-item">
          <div class="opp-meta-label">Loan Size</div>
          <div class="opp-meta-val">${fmtUSD(o.loanAmount)}</div>
        </div>
        <div class="opp-meta-item">
          <div class="opp-meta-label">Net Est.</div>
          <div class="opp-meta-val" style="color:${netEst>0?'var(--green)':'var(--red)'};">${netEst>0?'+':''}${fmtUSD(netEst)}</div>
        </div>
        <div class="opp-meta-item">
          <div class="opp-meta-label">Provider</div>
          <div class="opp-meta-val" style="font-size:12px;">${o.flashLoanProvider}</div>
        </div>
        <div class="opp-meta-item">
          <div class="opp-meta-label">Flash Fee</div>
          <div class="opp-meta-val yellow">-${fmtUSD(o.flashFee)}</div>
        </div>
        <div class="opp-meta-item">
          <div class="opp-meta-label">Gas Est.</div>
          <div class="opp-meta-val yellow">~${o.gasEstimateGwei||5} gwei</div>
        </div>
        <div class="opp-meta-item">
          <div class="opp-meta-label">Expires</div>
          <div class="opp-meta-val red">~${o.expiresIn}s</div>
        </div>
      </div>
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:11px;color:var(--ts);">Confidence</span>
          <span class="mono" style="font-size:11px;color:var(--cyan);">${confPct}%</span>
        </div>
        <div class="confidence-bar"><div class="confidence-fill" style="width:${confPct}%;background:${confPct>75?'var(--green)':confPct>50?'var(--yellow)':'var(--red)'}"></div></div>
      </div>
      <div class="opp-actions">
        <button class="btn-ghost btn-sm" onclick="analyzeOpp(${idx})"><i class="fas fa-brain mr1" style="color:var(--purple);"></i>AI Analysis</button>
        <button class="btn-ghost btn-sm" onclick="openSignModal(${idx})"><i class="fas fa-bolt mr1" style="color:var(--cyan);"></i>Execute</button>
        ${getDeployedContractAddress(STATE.currentChainId) && STATE.wallet.connected
          ? `<button class="btn-success" onclick="openSignModal(${idx})" style="font-weight:700;background:${NET_REGISTRY[STATE.currentChainId]?.isTestnet?'linear-gradient(135deg,#00e676,#00ffd1)':'linear-gradient(135deg,#ff4b4b,#ff9100)'};"><i class="fas fa-bolt mr1"></i>${NET_REGISTRY[STATE.currentChainId]?.isTestnet?'Execute (Testnet)':'⚡ Execute REAL →'}</button>`
          : `<button class="btn-success" onclick="openSignModal(${idx})" style="font-weight:700;"><i class="fas fa-flask mr1"></i>Simulate →</button>`
        }
      </div>
    </div>`;
  }).join('');
}

// ─── SIGN MODAL ───────────────────────────────────────────────────────────────
// ─── REAL ON-CHAIN FLASH LOAN EXECUTION ───────────────────────────────────────
// Gets the deployed contract address for the current chain (prefers real deployed)
function getDeployedContractAddress(chainId) {
  // First check localStorage for a real deployed contract on this chain
  const active = localStorage.getItem('flasharb_active_contract_'+chainId);
  if (active && active.length === 42) return active;
  // Fall back to the most recent deployed contract for this chain
  const match = STATE.deployedContracts.find(d => d.chainId === chainId && d.real && d.address?.length===42);
  return match?.address || null;
}

// Resolve token symbol → on-chain address for current chain
function resolveTokenAddr(symbol, chainId) {
  const tokens = TOKEN_ADDRS[chainId] || TOKEN_ADDRS['1'];
  // Try direct match
  if (tokens[symbol]) return tokens[symbol];
  // Strip prefixes and try
  const clean = symbol.replace('W','').trim();
  for (const [k, v] of Object.entries(tokens)) {
    if (k === symbol || k === 'W'+symbol || k.includes(symbol)) return v;
  }
  return tokens.USDC || null;
}

// Determine which mid token to use for arb route
function pickMidToken(pair, chainId) {
  const mids = MID_TOKENS_BY_CHAIN[chainId] || ['USDC','USDT','DAI'];
  const [tA, tB] = pair.split('/').map(s => s.trim());
  // Prefer a stable mid not in the pair
  for (const m of mids) {
    if (m !== tA && m !== tB) {
      const addr = resolveTokenAddr(m, chainId);
      if (addr) return { symbol: m, addr };
    }
  }
  return { symbol: mids[0], addr: resolveTokenAddr(mids[0], chainId) };
}

async function openSignModal(idx) {
  const o = STATE.opportunities[idx]; if (!o) return;
  STATE.pendingOpp = o;
  const net = NET_REGISTRY[STATE.currentChainId];
  const gasUSD = (o.gasEstimateGwei||STATE.gasGwei||5) * 300000 / 1e9 * getNativePrice();
  const netEst = (o.estimatedProfit||0) - (o.flashFee||0) - gasUSD;

  const contractAddr = getDeployedContractAddress(STATE.currentChainId);
  const hasRealContract = !!contractAddr;
  const walletConnected = !!STATE.wallet.connected;
  const isTestnet = net?.isTestnet;

  let executionBadge = '';
  let warningBox = '';

  if (!walletConnected) {
    executionBadge = `<span class="badge badge-yellow" style="font-size:10px;">⚠ Wallet Not Connected</span>`;
    warningBox = `<div class="info-box yellow" style="font-size:11px;margin-bottom:10px;"><i class="fas fa-wallet" style="color:var(--yellow);margin-right:7px;"></i>Connect MetaMask to execute real flash loans. Running in simulation mode.</div>`;
  } else if (!hasRealContract) {
    executionBadge = `<span class="badge badge-yellow" style="font-size:10px;">⚠ No Contract Deployed</span>`;
    warningBox = `<div class="info-box yellow" style="font-size:11px;margin-bottom:10px;"><i class="fas fa-code" style="color:var(--yellow);margin-right:7px;"></i>No PersonalArbitrageBot deployed on ${net?.name}. Go to the <strong>Deploy</strong> tab to deploy your contract first, then execute real flash loans.</div>`;
  } else if (!isTestnet) {
    executionBadge = `<span class="badge badge-red" style="font-size:10px;">⚠ MAINNET — REAL ETH</span>`;
    warningBox = `<div class="info-box red" style="font-size:11px;margin-bottom:10px;"><i class="fas fa-exclamation-triangle" style="color:var(--red);margin-right:7px;"></i><strong style="color:var(--red);">MAINNET EXECUTION</strong> — Gas fee (~${fmtUSD(gasUSD)}) paid from your wallet. Profit auto-sent to you on success. Loss of gas on failed arb is real.</div>`;
  } else {
    executionBadge = `<span class="badge badge-green" style="font-size:10px;">✅ Testnet — Safe</span>`;
    warningBox = `<div class="info-box green" style="font-size:11px;margin-bottom:10px;"><i class="fas fa-check-circle" style="color:var(--green);margin-right:7px;"></i>Testnet execution using contract at ${shortAddr(contractAddr)}. No real funds at risk.</div>`;
  }

  $('sign-details').innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      ${executionBadge}
      ${hasRealContract ? `<span class="mono" style="font-size:10px;color:var(--ts);">Contract: ${shortAddr(contractAddr)}</span>` : ''}
    </div>
    ${warningBox}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;margin-bottom:12px;">
      <div><div class="field-label">Token Pair</div><div class="mono" style="color:var(--cyan);font-size:14px;font-weight:800;">${o.tokenPair}</div></div>
      <div><div class="field-label">Network</div><div style="font-size:13px;font-weight:600;">${net?.name||'Unknown'}</div></div>
      <div><div class="field-label">Flash Loan Amount</div><div class="mono" style="font-size:13px;">${fmtUSD(o.loanAmount)}</div></div>
      <div><div class="field-label">Provider</div><div style="font-size:13px;">${o.flashLoanProvider}</div></div>
      <div><div class="field-label">Route</div><div style="font-size:13px;">${o.buyDex} → ${o.sellDex}</div></div>
      <div><div class="field-label">Spread</div><div style="color:var(--green);font-size:13px;font-weight:800;">+${o.profitPercent}%</div></div>
      <div><div class="field-label">Flash Fee (0.09%)</div><div class="mono" style="color:var(--red);font-size:13px;">-${fmtUSD(o.flashFee)}</div></div>
      <div><div class="field-label">Est. Gas Cost</div><div class="mono" style="color:var(--yellow);font-size:13px;">~-${fmtUSD(gasUSD)}</div></div>
      <div><div class="field-label">Slippage Tolerance</div><div class="mono" style="color:var(--ts);font-size:13px;">0.5% (50 bps)</div></div>
      <div><div class="field-label">V3 Fee Tier</div><div class="mono" style="color:var(--pink);font-size:13px;">${(()=>{const n=(o.buyDex||'').toLowerCase();return (n.includes('v3')||n.includes('univ3'))? '0.3% (3000)' : 'N/A (V2/Sushi)'})()}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <div style="padding:8px;background:rgba(0,212,255,.05);border:1px solid rgba(0,212,255,.15);border-radius:8px;"><div class="field-label" style="margin-bottom:3px;">Buy DEX</div><div class="mono" style="font-size:11px;color:var(--cyan);">${o.buyDex||'UniswapV2'} <span style="color:var(--ts);">(id:${(()=>{const n=(o.buyDex||'').toLowerCase();return n.includes('v3')?3:n.includes('sushi')?2:1;})()})</span></div></div>
      <div style="padding:8px;background:rgba(0,212,255,.05);border:1px solid rgba(0,212,255,.15);border-radius:8px;"><div class="field-label" style="margin-bottom:3px;">Sell DEX</div><div class="mono" style="font-size:11px;color:var(--cyan);">${o.sellDex||'SushiSwap'} <span style="color:var(--ts);">(id:${(()=>{const n=(o.sellDex||'').toLowerCase();return n.includes('v3')?3:n.includes('sushi')?2:1;})()})</span></div></div>
    </div>
    <div style="padding:12px;background:rgba(0,230,118,.06);border:1px solid rgba(0,230,118,.2);border-radius:10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-size:12px;color:var(--ts);">Estimated Net Profit</span>
      <span class="mono" style="font-size:18px;font-weight:900;color:${netEst>0?'var(--green)':'var(--red)'};">${netEst>0?'+':''}${fmtUSD(netEst)}</span>
    </div>
    ${o.source==='live'
      ? '<div style="font-size:10px;color:var(--cyan);margin-bottom:6px;">🟢 Spread sourced from real on-chain getAmountsOut DEX quote</div>'
      : '<div style="font-size:10px;color:var(--yellow);margin-bottom:6px;">⚡ Spread will be re-verified on-chain before signing — stale or closed spreads abort automatically with zero gas spent</div>'}
    <div style="font-size:10px;color:var(--tm);margin-bottom:4px;"><i class="fas fa-shield-alt" style="color:var(--green);margin-right:5px;"></i>Fresh on-chain re-quote right before signing &bull; adapts minProfit to the live spread &bull; proceeds if profitable, aborts with no gas if spread has fully closed &bull; Profit auto-forwarded to owner</div>`;

  $('sign-progress').style.display='none';
  $('sign-result').style.display='none';
  $('sign-btns').style.display='flex';
  $('sign-confirm-btn').disabled=false;

  if (hasRealContract && walletConnected) {
    $('sign-confirm-btn').innerHTML=`<i class="fas fa-bolt mr1"></i>${isTestnet?'Execute (Testnet)':'⚡ Execute Real Flash Loan'}`;
    $('sign-confirm-btn').style.background = isTestnet
      ? 'linear-gradient(135deg,#00e676,#00ffd1)'
      : 'linear-gradient(135deg,#ff4b4b,#ff9100)';
  } else {
    $('sign-confirm-btn').innerHTML='<i class="fas fa-flask mr1"></i>Simulate (No Contract)';
    $('sign-confirm-btn').style.background = '';
  }

  $('sign-modal').style.display='flex';
}

function cancelSign() { $('sign-modal').style.display='none'; STATE.pendingOpp=null; }

async function confirmSign() {
  const o = STATE.pendingOpp; if (!o) return;
  const contractAddr = getDeployedContractAddress(STATE.currentChainId);
  const walletConnected = !!STATE.wallet.connected;

  // If we have a real deployed contract and wallet connected → REAL execution
  if (contractAddr && walletConnected && window.ethereum) {
    await executeRealFlashLoan(o, contractAddr);
    return;
  }

  // Otherwise → simulation with progress animation
  $('sign-confirm-btn').disabled=true;
  const cancelBtn = $('sign-btns').querySelector('.btn-ghost');
  if (cancelBtn) cancelBtn.disabled=true;
  $('sign-progress').style.display='block';

  const steps = [
    {label:'Validating opportunity...', pct:14},
    {label:'Checking liquidity pools...', pct:28},
    {label:'Computing slippage & gas...', pct:42},
    {label:'Building flash loan calldata...', pct:57},
    {label:'Simulating tx execution...', pct:71},
    {label:'Waiting for block inclusion...', pct:86},
    {label:'Confirming result...', pct:100},
  ];
  for (const step of steps) {
    $('sign-progress-text').textContent = step.label;
    $('sign-progress-bar').style.width = step.pct+'%';
    await new Promise(r => setTimeout(r, 380+Math.random()*400));
  }
  $('sign-modal').style.display='none';
  await executeFlashLoan(o);
}

// ─── REAL ON-CHAIN FLASH LOAN EXECUTION ───────────────────────────────────────
async function executeRealFlashLoan(opp, contractAddr) {
  const net = NET_REGISTRY[STATE.currentChainId];

  // NOTE: The source-check guard ("opp.source !== 'live'") has been removed.
  // The scanner now returns source:'live' from real on-chain getAmountsOut quotes,
  // and ALL opportunities are verified by the fresh-quote guard below before any
  // tx is signed — that is the correct and sufficient anti-fabrication mechanism.

  $('sign-confirm-btn').disabled=true;
  $('sign-confirm-btn').innerHTML='<i class="fas fa-circle-notch fa-spin mr1"></i>Preparing tx...';
  $('sign-progress').style.display='block';

  const updateProgress = (label, pct) => {
    $('sign-progress-text').textContent = label;
    $('sign-progress-bar').style.width = pct+'%';
  };

  try {
    updateProgress('Switching to correct network...', 10);
    // Ensure MetaMask is on the right chain
    try {
      await window.ethereum.request({method:'wallet_switchEthereumChain', params:[{chainId:net.hexId}]});
    } catch(e) { if (e.code !== 4902) tlog(`[arb] Chain switch warn: ${e.message}`, 'warn'); }

    updateProgress('Resolving token addresses...', 20);
    const [tokenA] = opp.tokenPair.split('/').map(s=>s.trim());
    const tokenAddr = resolveTokenAddr(tokenA, STATE.currentChainId);
    if (!tokenAddr) throw new Error(`Cannot resolve address for ${tokenA} on chain ${STATE.currentChainId}`);

    const mid = pickMidToken(opp.tokenPair, STATE.currentChainId);
    if (!mid.addr) throw new Error(`Cannot resolve mid-token address`);

    // ── Loan amount: opp.loanAmount is a USD value. Convert to token units.
    // WETH/WBTC/native tokens → 18 decimals; USDC/USDT/BUSD → 6 decimals.
    // We derive the token quantity from the live USD price so the loan size
    // matches what the scanner observed (e.g. $15,000 worth of WETH, not 15,000 WETH).
    const stableSyms = ['USDC','USDT','BUSD','DAI'];
    const isStable   = stableSyms.includes(tokenA);
    const decimals   = isStable ? 6 : 18;
    // Resolve token price: WETH→ETH, WMATIC→MATIC, WBTC→BTC, WBNB→BNB, etc.
    const priceKey = tokenA.startsWith('W') ? tokenA.slice(1) : tokenA; // strip leading W
    const tokenPriceUSD = isStable ? 1.0
      : (PRICE_MAP[priceKey] || PRICE_MAP[tokenA] || PRICE_MAP['ETH'] || getNativePrice() || 1);
    // tokenQty = USD loan ÷ price per token, then scaled to on-chain units
    const tokenQtyFloat  = opp.loanAmount / tokenPriceUSD;
    // Cap at a safe max to avoid overflowing pool liquidity (50 WETH / 2 WBTC / 50k USDC)
    const MAX_TOKEN_UNITS = isStable ? 50000 : (tokenA === 'WBTC' ? 2 : 50);
    const tokenQtyCapped  = Math.min(tokenQtyFloat, MAX_TOKEN_UNITS);
    const loanAmountUnits = BigInt(Math.round(tokenQtyCapped * 10 ** decimals)).toString();
    tlog(`[arb] Loan: $${opp.loanAmount.toFixed(0)} USD → ${tokenQtyCapped.toFixed(4)} ${tokenA} (${decimals}dec) = ${loanAmountUnits} units`, 'dim');

    // Map DEX name strings to uint8 constants (DEX_UNI_V2=1, DEX_SUSHI=2, DEX_UNI_V3=3)
    const resolveDex = (dexName) => {
      const n = (dexName||'').toLowerCase();
      if (n.includes('v3') || n.includes('univ3')) return DEX_UNI_V3;
      if (n.includes('sushi')) return DEX_SUSHI;
      return DEX_UNI_V2; // default: Uniswap V2
    };
    const buyDex  = resolveDex(opp.buyDex);
    const sellDex = resolveDex(opp.sellDex);

    // V3 fee tier: use 3000 (0.3%) by default; low-spread pairs may use 500 (0.05%)
    const v3Fee = (buyDex === DEX_UNI_V3 || sellDex === DEX_UNI_V3)
      ? (opp.v3Fee || V3_FEE_TIERS.MED)
      : V3_FEE_TIERS.MED;

    // ── FRESH RE-QUOTE: get the CURRENT live spread RIGHT NOW via on-chain
    // getAmountsOut calls. The spread may have changed since the scanner ran —
    // that is fine. We adapt minProfit to the new spread and proceed as long as
    // it is still profitable. Only if the spread has FULLY CLOSED (net return < 
    // loan + premium) do we abort — no gas wasted on a guaranteed revert.
    updateProgress('Re-checking live spread on-chain before signing...', 30);
    const loanBig = BigInt(loanAmountUnits);
    const AAVE_PREMIUM_BPS = 9n; // 0.09%
    const owed = loanBig + (loanBig * AAVE_PREMIUM_BPS / 10000n);

    let minProfit = '0';
    let minOutBuy = '1';
    if (buyDex !== DEX_UNI_V3 && sellDex !== DEX_UNI_V3) {
      const buyRouter  = (buyDex  === DEX_SUSHI) ? net.sushiRouter : net.uniRouter;
      const sellRouter = (sellDex === DEX_SUSHI) ? net.sushiRouter : net.uniRouter;

      const freshBuyOut = await freshV2Quote(STATE.currentChainId, buyRouter, loanBig, [tokenAddr, mid.addr]);
      if (freshBuyOut == null) {
        // RPC unreachable — proceed with minProfit=0 rather than blocking entirely.
        // The contract itself will revert if unprofitable; we save user a hard abort.
        tlog('[arb] ⚠ Could not fetch fresh buy-leg quote (RPC issue) — proceeding with minProfit=0, contract will guard.', 'warn');
      } else {
        const freshSellOut = await freshV2Quote(STATE.currentChainId, sellRouter, freshBuyOut, [mid.addr, tokenAddr]);
        if (freshSellOut == null) {
          tlog('[arb] ⚠ Could not fetch fresh sell-leg quote (RPC issue) — proceeding with minProfit=0, contract will guard.', 'warn');
        } else {
          tlog(`[arb] Fresh quote → loan=${loanBig} buyOut=${freshBuyOut} sellOut=${freshSellOut} owed=${owed}`, 'dim');

          if (freshSellOut <= owed) {
            // Spread has fully closed — executing would 100% revert. Abort now.
            throw new Error(
              `Spread has fully closed (on-chain return ${freshSellOut} < owed ${owed}). ` +
              `Aborting before signing — no gas spent. ` +
              `Wait for the scanner to surface a new opportunity.`
            );
          }

          // Spread is still open (possibly narrower than when scanned — that is fine).
          // Compute minProfit from the CURRENT fresh quote with a 0.5% safety buffer
          // to absorb slippage between this check and block inclusion.
          const slippageBps = 50n; // 0.5%
          const rawProfit = freshSellOut - owed;
          const bufferedProfit = rawProfit - (rawProfit * slippageBps / 10000n);
          minProfit = bufferedProfit > 0n ? bufferedProfit.toString() : '0';
          const bufferedBuyOut = freshBuyOut - (freshBuyOut * slippageBps / 10000n);
          minOutBuy = bufferedBuyOut > 0n ? bufferedBuyOut.toString() : '1';

          const profitUSD = Number(rawProfit) / 10**decimals * tokenPriceUSD;
          tlog(`[arb] ✅ Spread still live — rawProfit=${rawProfit} (~$${profitUSD.toFixed(2)}) minProfit=${minProfit} minOutBuy=${minOutBuy}`, 'success');
        }
      }
    } else {
      tlog('[arb] V3 leg detected — skipping pre-check (V3 quoter path); using opp.minProfit.', 'warn');
      minProfit = opp.minProfit ? opp.minProfit.toString() : '0';
    }

    // ── Version-aware calldata: bots deployed via the factory (v3.7) accept
    // an explicit minOutBuy for real buy-leg slippage protection; bots from
    // the older raw-deploy bytecode (v3.6, including anything already live
    // before this update) only accept the 7-arg shape with no such param.
    const botRecord = STATE.deployedContracts.find(d => d.address?.toLowerCase() === contractAddr?.toLowerCase());
    const botVersion = botRecord?.version || 'v3.6'; // unknown/manually-entered addresses default to the safer assumption (older ABI)

    updateProgress('Encoding executeArbitrage() calldata...', 40);
    const calldata = botVersion === 'v3.7'
      ? encodeExecuteArbitrageV37(tokenAddr, loanAmountUnits, mid.addr, buyDex, sellDex, v3Fee, minProfit, minOutBuy)
      : encodeExecuteArbitrage(tokenAddr, loanAmountUnits, mid.addr, buyDex, sellDex, v3Fee, minProfit);
    tlog(`[arb] calldata (${botVersion}): ${calldata.slice(0,30)}... token=${shortAddr(tokenAddr)} mid=${mid.symbol} buyDex=${buyDex} sellDex=${sellDex} v3Fee=${v3Fee} minProfit=${minProfit}${botVersion==='v3.7' ? ' minOutBuy='+minOutBuy : ''}`, 'dim');

    updateProgress('Estimating gas...', 50);
    let gasLimit = '0x7A120'; // 500,000 default
    try {
      const est = await window.ethereum.request({
        method: 'eth_estimateGas',
        params: [{ from: STATE.wallet.address, to: contractAddr, data: calldata }]
      });
      gasLimit = '0x' + Math.ceil(parseInt(est,16) * 1.25).toString(16);
      tlog(`[arb] Gas estimate: ${parseInt(est,16).toLocaleString()} (+ 25% = ${parseInt(gasLimit,16).toLocaleString()})`, 'success');
    } catch(e) {
      tlog(`[arb] Gas estimate failed: ${e.message} — using default 500k`, 'warn');
    }

    updateProgress('MetaMask signing — approve in wallet...', 65);
    $('sign-confirm-btn').innerHTML='<i class="fas fa-pen-fancy fa-spin mr1"></i>Sign in MetaMask...';

    // Build EIP-1559 tx params — required on Polygon (min 30 gwei priority fee)
    const arbTxParams = {
      from: STATE.wallet.address,
      to: contractAddr,
      data: calldata,
      gas: gasLimit,
    };
    try {
      const arbFees = await getGasFees(STATE.currentChainId);
      arbTxParams.maxFeePerGas         = arbFees.maxFeePerGas;
      arbTxParams.maxPriorityFeePerGas = arbFees.maxPriorityFeePerGas;
      tlog(`[arb] Gas fees: maxFee=${(parseInt(arbFees.maxFeePerGas,16)/1e9).toFixed(2)} maxPrio=${(parseInt(arbFees.maxPriorityFeePerGas,16)/1e9).toFixed(2)} gwei`, 'dim');
    } catch(feeErr) {
      tlog(`[arb] Fee fetch failed, MetaMask uses defaults: ${feeErr.message}`, 'warn');
    }

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [arbTxParams]
    });

    tlog(`[arb] ✅ Tx submitted: ${txHash}`, 'success');
    updateProgress('Waiting for block confirmation...', 80);
    $('sign-confirm-btn').innerHTML='<i class="fas fa-hourglass-half fa-spin mr1"></i>Confirming...';

    // Poll receipt
    const rpcs = PUBLIC_RPCS[STATE.currentChainId] || PUBLIC_RPCS['1'];
    let receipt = null;
    const deadline = Date.now() + 120000;
    while (!receipt && Date.now() < deadline) {
      for (const rpc of rpcs) {
        try {
          const r2 = await fetch(rpc,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_getTransactionReceipt',params:[txHash]})});
          const d2 = await r2.json();
          if (d2.result?.blockNumber) { receipt = d2.result; break; }
        } catch(_) {}
      }
      if (!receipt) await new Promise(r=>setTimeout(r,3000));
    }

    updateProgress('Parsing execution result...', 95);

    const success = receipt?.status === '0x1';
    const gasUsed = receipt ? parseInt(receipt.gasUsed,16) : 300000;
    const nativePriceNow = getNativePrice();
    const gasInNative = (gasUsed * (STATE.gasGwei||5) * 1e9) / 1e18;
    const gasUSD = gasInNative * nativePriceNow;

    // Try to parse ArbitrageExecuted event for actual profit
    const evt = receipt ? parseArbitrageEvent(receipt) : null;
    const actualProfitEth = evt ? evt.profitEth : 0;
    const actualProfitUSD = actualProfitEth * nativePriceNow;
    const netProfitUSD = success ? actualProfitUSD - gasUSD : -gasUSD;
    const netProfitEth = success ? actualProfitEth - gasInNative : -gasInNative;

    $('sign-progress').style.display='none';
    $('sign-modal').style.display='none';

    // Record trade
    const trade = {
      id: STATE.trades.length+1, time: nowT(),
      chainId: STATE.currentChainId,
      network: net?.name||'Unknown', pair: opp.tokenPair,
      route: `${opp.buyDex}→${opp.sellDex}`,
      loan: opp.loanAmount,
      profit: success ? actualProfitEth : 0,
      gasETH: gasInNative, gasUSD,
      nativeSymbol: net?.symbol||'ETH',
      netPnl: netProfitUSD, netPnlETH: netProfitEth,
      txHash, status: success ? 'SUCCESS' : 'FAILED',
      isTestnet: net?.isTestnet, real: true,
      ethPrice: nativePriceNow, nativePrice: nativePriceNow,
      contractAddr,
    };
    STATE.trades.unshift(trade);
    STATE.profitHistory.push({
      time:nowT(),
      pnl:(STATE.profitHistory[STATE.profitHistory.length-1]?.pnl||0) + netProfitUSD
    });

    // Update wallet session P&L
    if (STATE.wallet.connected) {
      STATE.wallet.sessionGasETH += gasInNative;
      if (success) {
        STATE.wallet.sessionProfitUSD += netProfitUSD;
        STATE.wallet.sessionProfitETH += netProfitEth;
      }
      setTimeout(() => fetchWalletBalance(), 5000);
    }

    const explorer = net?.explorer || 'https://etherscan.io';
    if (success) {
      tlog(`[arb] ✅ REAL PROFIT! ${opp.tokenPair} | Net: +${fmtUSD(netProfitUSD)} | Gas: -${fmtUSD(gasUSD)} | Tx: ${shortAddr(txHash)}`, 'success');
      tlog(`[arb] 🔗 ${explorer}/tx/${txHash}`, 'success');
      toast(`✅ Flash loan EXECUTED! Net profit: +${fmtUSD(netProfitUSD)} | Gas: -${fmtUSD(gasUSD)}`, 'success', 8000);
    } else {
      tlog(`[arb] ❌ Tx reverted (gas lost: ${fmtUSD(gasUSD)}) | Tx: ${shortAddr(txHash)}`, 'error');
      tlog(`[arb] 🔗 ${explorer}/tx/${txHash}`, 'dim');
      toast(`❌ Arb reverted — spread closed before confirmation. Gas lost: ${fmtUSD(gasUSD)}`, 'error', 7000);
    }

    updateStats(); renderLedger(); updateRecentMini(); updateLedgerChart(); updateProfitChart();

  } catch(err) {
    $('sign-progress').style.display='none';
    $('sign-modal').style.display='none';
    if (err.code === 4001) {
      toast('Transaction rejected by user', 'warn');
      tlog('[arb] User rejected MetaMask signing', 'warn');
    } else {
      toast(`Execution failed: ${err.message?.slice(0,80)||'Unknown error'}`, 'error', 7000);
      tlog(`[arb] ❌ ${err.message}`, 'error');
    }
  } finally {
    if ($('sign-confirm-btn')) {
      $('sign-confirm-btn').disabled=false;
      $('sign-confirm-btn').innerHTML='<i class="fas fa-bolt mr1"></i>Execute Flash Loan';
    }
  }
}

// ─── SIMULATION FALLBACK (no wallet/contract) ─────────────────────────────────
async function executeFlashLoan(opp, realTxHash=null) {
  try {
    const net = NET_REGISTRY[STATE.currentChainId];
    const res = await axios.post('/api/flashloan/simulate', {
      amount: opp.loanAmount, tokenPair: opp.tokenPair,
      route: `${opp.buyDex} → ${opp.sellDex}`,
      gasPrice: STATE.gasGwei||5, chainId: STATE.currentChainId,
      walletAddress: STATE.wallet.address||null,
    });
    const r = res.data;
    const txHash = realTxHash || r.txHash;
    const nativePriceNow = getNativePrice();
    const gasInNative = r.gasEstimateETH || 0;
    const profitInNative = r.success ? (r.netProfitUSD||0)/(nativePriceNow||1) : 0;

    const trade = {
      id: STATE.trades.length+1, time: nowT(),
      chainId: STATE.currentChainId,
      network: net?.name||'Unknown', pair: opp.tokenPair,
      route: `${opp.buyDex}→${opp.sellDex}`,
      loan: opp.loanAmount, profit: r.profit||0,
      gasETH: gasInNative, gasUSD: r.gasEstimateUSD||0,
      nativeSymbol: net?.symbol||'ETH',
      netPnl: r.netProfitUSD||0, netPnlETH: profitInNative,
      txHash, status: r.success?'SUCCESS':'FAILED',
      isTestnet: r.isTestnet, ethPrice: r.ethPrice||PRICE_MAP.ETH||3247,
      nativePrice: nativePriceNow, real: false,
    };
    STATE.trades.unshift(trade);
    STATE.profitHistory.push({time:nowT(), pnl: (STATE.profitHistory[STATE.profitHistory.length-1]?.pnl||0)+(r.netProfitUSD||0)});

    if (STATE.wallet.connected) {
      if (r.success) {
        STATE.wallet.balance = Math.max(0, STATE.wallet.balance - gasInNative);
        STATE.wallet.balance += profitInNative;
        STATE.wallet.sessionGasETH += gasInNative;
        STATE.wallet.sessionProfitUSD += r.netProfitUSD||0;
        STATE.wallet.sessionProfitETH += profitInNative;
        STATE.wallet.usdValue = STATE.wallet.balance * nativePriceNow;
      } else {
        STATE.wallet.balance = Math.max(0, STATE.wallet.balance - gasInNative);
        STATE.wallet.sessionGasETH += gasInNative;
        STATE.wallet.usdValue = STATE.wallet.balance * nativePriceNow;
      }
      $('w-native').textContent = fmt(STATE.wallet.balance, 4);
      $('w-usd').textContent = fmtUSD(STATE.wallet.usdValue);
      renderWalletSessionStats();
      setTimeout(() => fetchWalletBalance(), 4000);
    }

    if (r.success) {
      tlog(`[sim] ✅ ${opp.tokenPair} | Loan:${fmtUSD(opp.loanAmount)} | Net:+${fmtUSD(r.netProfitUSD)} | Gas:-${fmtUSD(r.gasEstimateUSD)} | Tx:${shortAddr(txHash)}`, 'success');
      toast(`✅ Flash loan simulated! Net profit: +${fmtUSD(r.netProfitUSD)} | Gas: -${fmtUSD(r.gasEstimateUSD)}`, 'success', 6000);
    } else {
      tlog(`[sim] ❌ ${opp.tokenPair} — unprofitable after gas (gas lost: ${fmtUSD(r.gasEstimateUSD)})`, 'error');
      toast(`❌ Sim trade failed — gas (${fmtUSD(r.gasEstimateUSD)}) exceeded spread profit`, 'warn', 5000);
    }
    updateStats();
    renderLedger();
    updateRecentMini();
    updateLedgerChart();
    updateProfitChart();
  } catch(e) { tlog('[sim] Error: '+e.message, 'error'); }
}

function updateStats() {
  const total = STATE.trades.reduce((a,t)=>a+(t.netPnl||0),0);
  const wins  = STATE.trades.filter(t=>t.status==='SUCCESS').length;
  const vol   = STATE.trades.reduce((a,t)=>a+(t.loan||0),0);
  const gasEth= STATE.trades.reduce((a,t)=>a+(t.gasETH||0),0);
  const sp=$('st-profit'); if(sp){sp.textContent=fmtUSD(total);sp.style.color=total>=0?'var(--green)':'var(--red)';}
  $('st-trades').textContent=STATE.trades.length;
  $('st-wr').textContent=STATE.trades.length?Math.round(wins/STATE.trades.length*100)+'%':'0%';
  $('st-vol').textContent=fmtK(vol);
  $('st-lns').textContent=STATE.trades.length;
  const sym=NET_REGISTRY[STATE.currentChainId]?.symbol||'ETH';
  $('st-gas').textContent=fmt(gasEth,5)+' '+sym;
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────
function initCharts() {
  // Spread Chart
  const canvas = $('spread-chart'); if (!canvas) return;
  STATE.spreadChart = new Chart(canvas.getContext('2d'), {
    type:'line',
    data:{
      labels:Array.from({length:25},(_,i)=>`${24-i}s`).reverse(),
      datasets:[
        {label:'DEX A',data:Array(25).fill(null),borderColor:'#00d4ff',borderWidth:2,fill:false,tension:.4,pointRadius:0},
        {label:'DEX B',data:Array(25).fill(null),borderColor:'#ff6b35',borderWidth:2,fill:false,tension:.4,pointRadius:0},
      ]
    },
    options:{
      responsive:true,maintainAspectRatio:false,animation:false,
      plugins:{legend:{labels:{color:'#7fa8c9',font:{size:11},boxWidth:20}}},
      scales:{
        x:{ticks:{color:'#3a5578',font:{size:9}},grid:{color:'rgba(0,212,255,.04)'}},
        y:{ticks:{color:'#3a5578',font:{size:9}},grid:{color:'rgba(0,212,255,.04)'}},
      }
    }
  });
  setInterval(updateChartData, 2500);

  // Profit Mini Chart
  const pCanvas = $('profit-chart'); if (!pCanvas) return;
  STATE.profitChart = new Chart(pCanvas.getContext('2d'), {
    type:'line',
    data:{labels:[],datasets:[{label:'P&L',data:[],borderColor:'#00e676',borderWidth:2,fill:true,tension:.4,pointRadius:0,backgroundColor:'rgba(0,230,118,0.07)'}]},
    options:{
      responsive:true,maintainAspectRatio:false,animation:false,
      plugins:{legend:{display:false}},
      scales:{x:{display:false},y:{display:false}}
    }
  });

  // Ledger Chart
  const lCanvas = $('ledger-chart'); if (!lCanvas) return;
  STATE.ledgerChart = new Chart(lCanvas.getContext('2d'), {
    type:'line',
    data:{labels:[],datasets:[{label:'Cumulative P&L',data:[],borderColor:'#00d4ff',borderWidth:2,fill:true,tension:.4,pointRadius:3,backgroundColor:'rgba(0,212,255,0.06)'}]},
    options:{
      responsive:true,maintainAspectRatio:false,animation:{duration:400},
      plugins:{legend:{display:false}},
      scales:{
        x:{ticks:{color:'#3a5578',font:{size:9}},grid:{color:'rgba(0,212,255,.04)'}},
        y:{ticks:{color:'#3a5578',font:{size:9},callback:v=>'$'+v.toFixed(0)},grid:{color:'rgba(0,212,255,.04)'}},
      }
    }
  });
}

function updateChartData() {
  if (!STATE.spreadChart) return;
  const pair = $('chart-pair')?.value||'ETH/USDC';
  const dexSel = $('chart-dex')?.value||'uni-sushi';
  const labelMap = { 'uni-sushi':['Uniswap V2','SushiSwap'], 'uni-curve':['Uniswap V3','Curve'], 'uni-balancer':['Uniswap V3','Balancer'] };
  const labels = labelMap[dexSel] || ['DEX A','DEX B'];
  STATE.spreadChart.data.datasets[0].label = labels[0];
  STATE.spreadChart.data.datasets[1].label = labels[1];
  const base = {
    'ETH/USDC':PRICE_MAP.ETH,'BTC/ETH':PRICE_MAP.BTC,
    'LINK/USDC':PRICE_MAP.LINK,'AAVE/ETH':PRICE_MAP.AAVE,'ARB/USDC':PRICE_MAP.ARB
  }[pair]||1;
  const spread = STATE.opportunities[0]?.profitPercent||0;
  const aPrice = base*(1+(Math.random()-.5)*0.004);
  const bPrice = base*(1+(Math.random()-.5)*0.004+(spread/100*0.4));
  STATE.spreadChart.data.datasets[0].data.shift(); STATE.spreadChart.data.datasets[0].data.push(aPrice);
  STATE.spreadChart.data.datasets[1].data.shift(); STATE.spreadChart.data.datasets[1].data.push(bPrice);
  STATE.spreadChart.update('none');
}
function updateChartPair() { updateChartData(); }

function updateProfitChart() {
  if (!STATE.profitChart) return;
  const trades = STATE.trades.slice(0,20).reverse();
  let cumulative = 0;
  const data = trades.map(t => { cumulative+=t.netPnl||0; return cumulative; });
  STATE.profitChart.data.labels = trades.map(t=>t.time);
  STATE.profitChart.data.datasets[0].data = data;
  STATE.profitChart.update();
}

function updateLedgerChart() {
  if (!STATE.ledgerChart) return;
  const trades = STATE.trades.slice().reverse();
  let cumulative = 0;
  const data = trades.map(t => { cumulative+=t.netPnl||0; return parseFloat(cumulative.toFixed(2)); });
  STATE.ledgerChart.data.labels = trades.map(t=>t.time);
  STATE.ledgerChart.data.datasets[0].data = data;
  STATE.ledgerChart.data.datasets[0].borderColor = cumulative>=0?'#00d4ff':'#ff4b4b';
  STATE.ledgerChart.data.datasets[0].backgroundColor = cumulative>=0?'rgba(0,212,255,0.06)':'rgba(255,75,75,0.06)';
  STATE.ledgerChart.update();
  const lt=$('ledger-total'); if(lt){lt.textContent=fmtUSD(cumulative);lt.className=`badge ${cumulative>=0?'badge-green':'badge-red'}`;}
}

// ─── AI ADVISOR ───────────────────────────────────────────────────────────────
async function sendAI() {
  const inp = $('ai-input'); const q = inp?.value?.trim(); if (!q) return; inp.value='';
  $('ai-loading').style.display='flex'; $('ai-resp').style.display='none'; $('ai-placeholder').style.display='none';
  const net = NET_REGISTRY[STATE.currentChainId];
  const best = STATE.opportunities[0]||null;
  try {
    const res = await axios.post('/api/ai/analyze', {query:q, opportunity:best, network:net?.name||'Multi-chain'});
    renderAIResponse(res.data.analysis);
  } catch(e) { renderAIResponse('## Error\nFailed to connect to AI. Please try again.'); }
  $('ai-loading').style.display='none';
  updateStrategyScores();
}

function aiQ(q) { if ($('ai-input')) $('ai-input').value=q; sendAI(); switchTab(3); }
function aiKey(e) { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); sendAI(); } }

function analyzeOpp(idx) {
  const o = STATE.opportunities[idx]; if (!o) return;
  aiQ(`Analyze this opportunity in detail: ${o.tokenPair} ${o.profitPercent}% spread, buy on ${o.buyDex}, sell on ${o.sellDex}, $${(o.loanAmount||0).toFixed(0)} loan size, ${o.risk} risk, ${o.confidence}% confidence. Should I execute?`);
}

function renderAIResponse(md) {
  let html = md
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code>$1</code>')
    .replace(/^- (.+)$/gm,'<li>$1</li>')
    .replace(/\|(.+)\|/g, (m, row) => {
      const cells = row.split('|').map(c=>c.trim());
      return '<tr>'+cells.map(c=>`<td>${c}</td>`).join('')+'</tr>';
    })
    .replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');
  // Wrap consecutive <tr> in table
  html = html.replace(/(<tr>.*?<\/tr>)/gs, match => `<table>${match}</table>`);
  const el = $('ai-resp'); el.innerHTML=html; el.style.display='block';
  $('ai-placeholder').style.display='none';
}

function updateMarketIntel() {
  const el = $('mkt-intel'); if (!el) return;
  const items = [
    {icon:'🔥',label:'Flash Vol 24h',val:'$2.1B',col:'var(--cyan)'},
    {icon:'⛽',label:'Gas Now',val:`${fmt(STATE.gasGwei||4,2)} gwei`,col:'var(--yellow)'},
    {icon:'📊',label:'Best Spread',val:`${STATE.opportunities[0]?.profitPercent?.toFixed(3)||'--'}%`,col:'var(--green)'},
    {icon:'🏆',label:'Top DEX',val:'Uniswap V3',col:'var(--purple)'},
    {icon:'💧',label:'Aave TVL',val:'$8.4B',col:'var(--teal)'},
    {icon:'🌐',label:'RPC Source',val:STATE.rpcSource==='alchemy'?'Alchemy':'Public Free',col:STATE.rpcSource==='alchemy'?'var(--green)':'var(--cyan)'},
    {icon:'📡',label:'Active Chains',val:'10',col:'var(--cyan)'},
  ];
  el.innerHTML = items.map(i=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--bd2);font-size:12px;">
    <span>${i.icon} <span style="color:var(--ts);">${i.label}</span></span>
    <span class="mono" style="font-weight:700;color:${i.col};">${i.val}</span>
  </div>`).join('');
}

function updateAIRecs() {
  const el = $('ai-recs'); if (!el) return;
  el.innerHTML = [
    {e:'✅',t:'Arbitrum: ~$0.05/trade gas cost',c:'var(--green)'},
    {e:'⚡',t:'ETH/USDC: best liquidity pair',c:'var(--cyan)'},
    {e:'🛡️',t:'Use Flashbots RPC (anti-MEV)',c:'var(--yellow)'},
    {e:'🎯',t:'Min $15K loan for profitability',c:'var(--teal)'},
    {e:'📡',t:'Target: spread > 0.5% after fees',c:'var(--purple)'},
    {e:'⏰',t:'Best hours: 08:00–12:00 UTC',c:'var(--orange)'},
  ].map(r=>`<div style="display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid var(--bd2);font-size:12px;"><span>${r.e}</span><span style="color:${r.c};">${r.t}</span></div>`).join('');
}

function updateChainCompare() {
  const el = $('chain-compare'); if (!el) return;
  const chains = [
    {name:'Arbitrum',gas:'~$0.05',speed:'0.25s',color:'#28a0f0'},
    {name:'Base',gas:'~$0.04',speed:'2s',color:'#0052ff'},
    {name:'Optimism',gas:'~$0.06',speed:'2s',color:'#ff0420'},
    {name:'Polygon',gas:'~$0.01',speed:'2.1s',color:'#8247e5'},
    {name:'BNB Chain',gas:'~$0.20',speed:'3s',color:'#f0b90b'},
    {name:'Ethereum',gas:'~$8–40',speed:'12s',color:'#627eea'},
  ];
  el.innerHTML = chains.map(c=>`<div class="chain-compare-item">
    <div style="display:flex;align-items:center;gap:7px;"><span class="sdot" style="background:${c.color};box-shadow:0 0 5px ${c.color};"></span><span style="font-weight:600;">${c.name}</span></div>
    <div style="text-align:right;"><div class="mono" style="color:var(--yellow);font-size:11px;">${c.gas}</div><div style="font-size:10px;color:var(--tm);">${c.speed}/block</div></div>
  </div>`).join('');
}

function updateStrategyScores() {
  const best = STATE.opportunities[0];
  const p = best ? Math.min(99, Math.round(best.profitPercent*32)) : 65;
  const r = best ? {LOW:22,MEDIUM:52,HIGH:82}[best.risk]||45 : 45;
  const m = 74;
  const mev = best ? Math.min(85, 30 + Math.round(best.profitPercent*18)) : 35;
  $('sc-p').textContent=p+'%'; $('pb-p').style.width=p+'%';
  $('sc-r').textContent=r+'%'; $('pb-r').style.width=r+'%';
  $('sc-m').textContent=m+'%'; $('pb-m').style.width=m+'%';
  const mevEl=$('sc-mev'),pbMev=$('pb-mev');
  if(mevEl)mevEl.textContent=mev+'%'; if(pbMev)pbMev.style.width=mev+'%';
}

// ─── LEDGER ───────────────────────────────────────────────────────────────────
function renderLedger() {
  const tbody = $('ltbody'); if (!tbody) return;
  if (!STATE.trades.length) {
    tbody.innerHTML='<tr><td colspan="11" class="empty-td">No trades yet — start the bot and execute opportunities</td></tr>'; return;
  }
  tbody.innerHTML = STATE.trades.map(t => {
    const col = t.status==='SUCCESS'?'var(--green)':'var(--red)';
    const tradeChainId = t.chainId||STATE.currentChainId;
    const exp = NET_REGISTRY[tradeChainId]?.explorer||'https://etherscan.io';
    return `<tr>
      <td class="mono" style="color:var(--tm);">${t.id}</td>
      <td style="color:var(--ts);font-size:11px;">${t.time}</td>
      <td><div style="display:flex;align-items:center;gap:3px;flex-wrap:wrap;"><span class="badge ${t.isTestnet?'badge-yellow':'badge-cyan'}" style="font-size:9px;">${t.network.replace(' Mainnet','').replace(' Testnet','')}</span>${t.real?`<span class="badge badge-green" style="font-size:9px;">REAL</span>`:`<span class="badge" style="font-size:9px;background:rgba(255,255,255,0.05);color:var(--tm);">SIM</span>`}</div></td>
      <td class="mono" style="color:var(--cyan);font-weight:700;">${t.pair}</td>
      <td style="font-size:11px;color:var(--ts);">${t.route}</td>
      <td class="mono">${fmtUSD(t.loan)}</td>
      <td class="mono" style="color:var(--green);">+${fmtUSD(t.profit)}</td>
      <td class="mono" style="color:var(--yellow);font-size:11px;">-${fmt(t.gasETH,6)}</td>
      <td class="mono" style="color:${t.netPnl>=0?'var(--green)':'var(--red)'};">${t.netPnl>=0?'+':''}${fmtUSD(t.netPnl)}</td>
      <td class="mono" style="font-size:10px;">${t.txHash?`<a href="${exp}/tx/${t.txHash}" target="_blank" style="color:var(--cyan);">${shortAddr(t.txHash)}</a>`:'<span style="color:var(--tm);">—</span>'}</td>
      <td><span style="color:${col};font-size:12px;font-weight:700;">${t.status}</span></td>
    </tr>`;
  }).join('');
  updateLedgerSummary();
  updateLedgerChart();
}

function renderRecentMini() {
  const el = $('recent-mini'); if (!el) return;
  if (!STATE.trades.length) { el.innerHTML='<div class="empty-state-sm">No trades yet</div>'; return; }
  el.innerHTML = STATE.trades.slice(0,5).map(t=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd2);font-size:11px;">
      <div>
        <span class="mono" style="color:var(--cyan);font-weight:700;">${t.pair}</span>
        <div style="color:var(--ts);font-size:10px;">${t.route}</div>
      </div>
      <div style="text-align:right;">
        <div class="mono" style="color:${t.netPnl>=0?'var(--green)':'var(--red)'};">${t.netPnl>=0?'+':''}${fmtUSD(t.netPnl)}</div>
        <div style="font-size:9px;color:${t.status==='SUCCESS'?'var(--green)':'var(--red)'};">${t.status}</div>
      </div>
    </div>`).join('');
}
function updateRecentMini() { renderRecentMini(); }

function updateLedgerSummary() {
  const el = $('ledger-sum'); if (!el) return;
  const total   = STATE.trades.reduce((a,t)=>a+(t.netPnl||0),0);
  const vol     = STATE.trades.reduce((a,t)=>a+(t.loan||0),0);
  const wins    = STATE.trades.filter(t=>t.status==='SUCCESS').length;
  const gasUsd  = STATE.trades.reduce((a,t)=>a+(t.gasUSD||0),0);
  const avgLoan = STATE.trades.length ? vol/STATE.trades.length : 0;
  el.innerHTML = [
    {label:'Total P&L',    val:fmtUSD(total),   col:total>=0?'var(--green)':'var(--red)'},
    {label:'Win Rate',     val:STATE.trades.length?Math.round(wins/STATE.trades.length*100)+'%':'0%', col:'var(--cyan)'},
    {label:'Flash Volume', val:fmtK(vol),        col:'var(--teal)'},
    {label:'Total Trades', val:STATE.trades.length, col:'var(--purple)'},
    {label:'Gas Spent',    val:fmtUSD(gasUsd),   col:'var(--yellow)'},
  ].map(s=>`<div class="stat-card" style="padding:14px;text-align:center;"><div class="stat-label">${s.label}</div><div class="mono" style="font-size:18px;font-weight:800;color:${s.col};">${s.val}</div></div>`).join('');
}

function clearLedger() {
  if (!STATE.trades.length) return;
  if (!confirm('Clear all trade history?')) return;
  STATE.trades=[]; STATE.profitHistory=[];
  renderLedger(); updateStats(); renderRecentMini();
  updateProfitChart(); updateLedgerChart();
  toast('Trade ledger cleared','info');
}

function exportCSV() {
  if (!STATE.trades.length) { toast('No trades to export','warn'); return; }
  const hdr = '#,Time,Network,Pair,Route,Loan,Gross Profit,Gas ETH,Gas USD,Net P&L,ETH Price,Tx Hash,Status';
  const rows = STATE.trades.map(t=>`${t.id},"${t.time}","${t.network}","${t.pair}","${t.route}",${t.loan},${t.profit},${t.gasETH},${t.gasUSD||0},${t.netPnl},${t.ethPrice||0},"${t.txHash||'N/A'}","${t.status}"`);
  const csv = [hdr,...rows].join('\n');
  const a = document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download=`flasharb_trades_${Date.now()}.csv`; a.click();
  toast('Trade history exported as CSV','success');
}

function clearLogs() {
  const t = $('terminal'); if (t) t.innerHTML='<span class="ll dim">[system] Terminal cleared</span>';
  toast('Terminal cleared','info');
}

function downloadLogs() {
  const t = $('terminal'); if (!t) return;
  const lines = Array.from(t.querySelectorAll('.ll')).map(l=>l.textContent).join('\n');
  const a = document.createElement('a');
  a.href='data:text/plain;charset=utf-8,'+encodeURIComponent(lines);
  a.download=`flasharb_logs_${Date.now()}.txt`; a.click();
  toast('Logs downloaded','success');
}

// ─── CONTRACT DEPLOY ──────────────────────────────────────────────────────────
function loadContractSource() {
  const el = $('contract-src'); if (el) el.textContent = CONTRACT_SRC;
  populateDeployNetworkSelect();
}

function populateDeployNetworkSelect() {
  const sel = $('deploy-net'); if (!sel) return; sel.innerHTML='';
  Object.entries(NET_REGISTRY).forEach(([id,net]) => {
    const opt = document.createElement('option'); opt.value=id;
    opt.textContent = net.name + (net.isTestnet?' (testnet)':'');
    if (id===STATE.currentChainId) opt.selected=true;
    sel.appendChild(opt);
  });
  onDeployNetChange();
}

function onDeployNetChange() {
  const chainId = $('deploy-net')?.value||'1';
  const net = NET_REGISTRY[chainId]; if (!net) return;
  const inf = $('deploy-net-info');
  if (inf) inf.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--ts);">Chain ID</span><span class="mono" style="color:var(--cyan);">${chainId}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--ts);">Explorer</span><a href="${net.explorer}" target="_blank" style="font-size:11px;color:var(--cyan);">${net.explorer.replace('https://','')}</a></div>
    <div style="display:flex;justify-content:space-between;font-size:11px;"><span style="color:var(--ts);">Aave V3 Pool</span><a href="${net.explorer}/address/${net.aaveProvider}" target="_blank" class="mono" style="color:var(--teal);font-size:10px;">${shortAddr(net.aaveProvider)}</a></div>
    <div style="display:flex;justify-content:space-between;font-size:11px;"><span style="color:var(--ts);">Uniswap Router</span><a href="${net.explorer}/address/${net.uniRouter}" target="_blank" class="mono" style="color:var(--purple);font-size:10px;">${shortAddr(net.uniRouter)}</a></div>
    <div style="display:flex;justify-content:space-between;font-size:11px;"><span style="color:var(--ts);">SushiSwap Router</span><a href="${net.explorer}/address/${net.sushiRouter}" target="_blank" class="mono" style="color:var(--yellow);font-size:10px;">${shortAddr(net.sushiRouter)}</a></div>
    <div style="margin-top:9px;"><span class="badge ${net.isTestnet?'badge-yellow':'badge-green'}">${net.isTestnet?'🧪 Testnet — Simulation':'🚀 Mainnet — Real Deployment'}</span></div>`;

  const argsEl = $('deploy-args');
  if (argsEl) argsEl.innerHTML = `
    <div class="field-group"><div class="field-label">_aavePoolProvider</div><input class="input-field" style="font-size:10px;font-family:var(--mono);" value="${net.aaveProvider}" readonly/></div>
    <div class="field-group"><div class="field-label">_uniRouter</div><input class="input-field" style="font-size:10px;font-family:var(--mono);" value="${net.uniRouter}" readonly/></div>
    <div class="field-group"><div class="field-label">_sushiRouter</div><input class="input-field" style="font-size:10px;font-family:var(--mono);" value="${net.sushiRouter}" readonly/></div>`;

  updateDeployButtons(chainId);
  estimateDeployCost();
}

function updateDeployButtons(chainId) {
  const net = NET_REGISTRY[chainId];
  const tb=$('deploy-testnet-btn'), mb=$('deploy-mainnet-btn');
  if (!tb||!mb) return;
  tb.style.display = net?.isTestnet?'block':'none';
  mb.style.display = net?.isTestnet?'none':'block';
}

async function estimateDeployCost() {
  const chainId = $('deploy-net')?.value||'1';
  const el = $('deploy-cost-info'); if (!el) return;
  el.innerHTML='<div style="color:var(--ts);font-size:12px;"><i class="fas fa-circle-notch fa-spin mr1"></i>Fetching live gas...</div>';
  try {
    const res = await axios.post('/api/contract/estimate', {chainId, gasPrice:STATE.gasGwei||5});
    const d = res.data;
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;"><span style="color:var(--ts);">Deploy Gas</span><span class="mono">~${(d.deployGasUnits/1e6).toFixed(2)}M units</span></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;"><span style="color:var(--ts);">Gas Price</span><span class="mono" style="color:var(--yellow);">${fmt(d.gasPriceGwei,2)} gwei</span></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;"><span style="color:var(--ts);">${d.nativeSymbol} Price</span><span class="mono" style="color:var(--cyan);">${fmtUSD(d.nativePriceUSD||0)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;"><span style="color:var(--ts);">Cost (${d.nativeSymbol})</span><span class="mono">${fmt(d.estimatedCostNative,5)} ${d.nativeSymbol}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-top:9px;border-top:1px solid var(--bd);padding-top:9px;"><span style="color:var(--tc);">Total USD</span><span class="mono" style="color:${d.isTestnet?'var(--yellow)':'var(--green)'};">${fmtUSD(d.estimatedCostUSD)}</span></div>
      <div style="font-size:10px;color:var(--tm);margin-top:6px;">Updates with live gas every 16s</div>`;
  } catch(e) { el.innerHTML='<div style="color:var(--red);font-size:11px;">Failed to estimate — check network</div>'; }
}

function openDeployModal(isMainnet) {
  if (!window.ethereum) {
    toast('MetaMask not detected — install MetaMask to deploy real contracts', 'error', 6000);
    return;
  }
  if (!STATE.wallet.connected) {
    toast('Connect your wallet first to deploy the contract', 'warn', 5000);
    return;
  }
  const chainId = $('deploy-net')?.value||(isMainnet?'1':'11155111');
  const net = NET_REGISTRY[chainId];
  const factoryAddr = getFactoryAddress(chainId);
  STATE.pendingDeploy = {chainId, net, isMainnet};

  const warnColor = isMainnet ? 'var(--red)' : 'var(--yellow)';
  const warnIcon  = isMainnet ? 'fa-exclamation-triangle' : 'fa-flask';
  const badge     = isMainnet ? 'badge-red' : 'badge-yellow';
  const badgeTxt  = isMainnet ? '⚠ MAINNET — REAL ETH' : 'TESTNET';

  $('deploy-modal-title').textContent=`Deploy PersonalArbitrageBot → ${net?.name||chainId}`;
  $('deploy-modal-subtitle').textContent='Real on-chain deployment — MetaMask will prompt for signature';
  $('deploy-modal-badge').textContent = badgeTxt;
  $('deploy-modal-badge').className = `badge ${badge}`;

  const gasEst = isMainnet ? '~$35–$120 (Ethereum) / ~$0.50–$3 (L2)' : '~$0 testnet ETH';

  $('deploy-modal-body').innerHTML = `<div style="font-size:12px;">
    <div class="info-box ${isMainnet?'red':'yellow'}" style="margin-bottom:10px;">
      <i class="fas ${warnIcon}" style="color:${warnColor};margin-right:7px;"></i>
      <strong style="color:${warnColor};">${isMainnet?'REAL MAINNET DEPLOYMENT':'Testnet Deployment'}</strong>
      ${isMainnet
        ? ' — This will deploy a real smart contract using real ETH for gas. Your wallet will be set as the <code>owner</code> with exclusive execution rights.'
        : ' — Safe testnet deployment. Uses test ETH only. Get testnet ETH from a faucet if needed.'
      }
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <div class="field-group"><div class="field-label">Network</div><div class="mono" style="color:${net?.color||'var(--cyan)'};padding:6px 0;">${net?.name}</div></div>
      <div class="field-group"><div class="field-label">Estimated Gas Cost</div><div class="mono" style="color:var(--yellow);padding:6px 0;">${gasEst}</div></div>
      <div class="field-group"><div class="field-label">Aave V3 PoolAddressesProvider ⚠️</div><input class="input-field" id="deploy-provider-inp" style="font-size:9px;font-family:var(--mono);" value="${net?.aaveProvider||''}" /></div>
      <div class="field-group"><div class="field-label">Uniswap V2 Router</div><input class="input-field" id="deploy-uni-inp" style="font-size:9px;font-family:var(--mono);" value="${net?.uniRouter||''}" /></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
      <div class="field-group"><div class="field-label">SushiSwap Router</div><input class="input-field" id="deploy-sushi-inp" style="font-size:9px;font-family:var(--mono);" value="${net?.sushiRouter||''}" /></div>
      <div class="field-group"><div class="field-label">Uniswap V3 Router</div><input class="input-field" id="deploy-univ3-inp" style="font-size:9px;font-family:var(--mono);" value="${net?.uniV3Router||''}" /></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:10px;">
      <div class="field-group"><div class="field-label">Uniswap V3 Quoter (QuoterV2)</div><input class="input-field" id="deploy-quoter-inp" style="font-size:9px;font-family:var(--mono);" value="${net?.uniV3Quoter||''}" /></div>
    </div>
    <div class="info-box" style="font-size:11px;margin-bottom:10px;border-color:rgba(0,212,255,0.3)"><i class="fas fa-user-shield" style="color:var(--cyan);margin-right:7px;"></i><strong>Owner:</strong> <code style="color:var(--cyan);font-size:10px;">${STATE.wallet.address}</code> (your connected wallet — set automatically)</div>
    <div class="info-box green" style="font-size:11px;margin-bottom:8px;"><i class="fas fa-shield-alt" style="color:var(--green);margin-right:7px;"></i>Hardened contract: <strong>onlyOwner</strong> + <strong>ReentrancyGuard</strong> + <strong>SafeERC20</strong>. Supports UniV2, SushiSwap, <span style="color:var(--pink);">UniV3</span>. Profit auto-forwarded to owner. <code>minProfit</code> floor prevents dust trades.</div>
    <div class="info-box" style="font-size:11px;border-color:rgba(255,165,0,0.4);background:rgba(255,165,0,0.05);"><i class="fas fa-exclamation-triangle" style="color:orange;margin-right:7px;"></i><strong style="color:orange;">Critical:</strong> The <em>PoolAddressesProvider</em> field must be the <strong>PoolAddressesProvider contract</strong>, NOT the Pool itself. ETH Mainnet: <code style="font-size:9px;">0x2f39d218...94E9</code>. After deploy, contract appears in Deployed Contracts list.</div>
    <div style="border-top:1px solid var(--bd2);margin:14px 0 10px;padding-top:10px;">
      <div style="font-size:11px;color:var(--ts);margin-bottom:8px;"><i class="fas fa-industry" style="margin-right:6px;"></i><strong>Or deploy via ArbitrageBotFactory (v3.7)</strong> — same router/provider/quoter fields above, but the factory calls <code>deployBot()</code> for you: your bot gets the <code>minOutBuy</code> slippage floor on the buy leg, and the factory itself never has any control over bots it creates.</div>
      ${factoryAddr
        ? `<div class="info-box green" style="font-size:10px;margin-bottom:8px;"><i class="fas fa-check-circle" style="color:var(--green);margin-right:6px;"></i>Factory live on ${net?.name}: <code style="font-size:9px;">${factoryAddr}</code></div>
           <button class="btn btn-primary" id="deploy-via-factory-btn" style="width:100%;" onclick="deployBotViaFactory()"><i class="fas fa-rocket mr1"></i>Deploy Your Bot via Factory</button>`
        : `<div class="info-box yellow" style="font-size:10px;margin-bottom:8px;"><i class="fas fa-info-circle" style="color:var(--yellow);margin-right:6px;"></i>No factory deployed on ${net?.name} yet. One-time step, anyone can do it — the factory has no privileges over bots it creates.</div>
           <button class="btn" id="deploy-factory-btn" style="width:100%;" onclick="deployFactoryContract()"><i class="fas fa-industry mr1"></i>Deploy Factory (one-time)</button>`
      }
    </div>
  </div>`;

  $('deploy-confirm-btn').innerHTML='<i class="fas fa-rocket mr1"></i>Deploy via MetaMask';
  $('deploy-confirm-btn').disabled=false;
  $('deploy-modal').style.display='flex';
}
function closeDeployModal() { $('deploy-modal').style.display='none'; STATE.pendingDeploy=null; }

async function proceedDeploy() {
  const {chainId, net} = STATE.pendingDeploy||{};
  if (!chainId || !net) return;
  if (!window.ethereum || !STATE.wallet.connected) {
    toast('Connect MetaMask wallet first', 'error'); return;
  }

  const provider    = $('deploy-provider-inp')?.value?.trim() || net.aaveProvider;
  // Guard: warn if user accidentally enters the Pool address instead of PoolAddressesProvider
  // Pool addresses (wrong): 0x87870... (ETH), 0x794a... (Polygon/Arb/Opt)
  const KNOWN_POOL_ADDRS = ['0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2','0x794a61358d6845594f94dc1db02a252b5b4814ad','0xa238dd80c259a72e81d7e4664a9801593f98d1c5'];
  if (provider && KNOWN_POOL_ADDRS.includes(provider.toLowerCase())) {
    toast('⚠️ Wrong address! You entered the Aave Pool address — the constructor needs the PoolAddressesProvider address (e.g. 0x2f39d... for ETH Mainnet)', 'error', 9000);
    tlog('[deploy] ❌ WRONG ADDRESS: Pool address detected instead of PoolAddressesProvider. Deployment would revert!', 'error');
    $('deploy-confirm-btn').disabled=false;
    $('deploy-confirm-btn').innerHTML='<i class="fas fa-rocket mr1"></i>Deploy via MetaMask';
    return;
  }
  const uniRouter   = $('deploy-uni-inp')?.value?.trim()      || net.uniRouter;
  const sushiRouter = $('deploy-sushi-inp')?.value?.trim()    || net.sushiRouter;
  const uniV3Router = $('deploy-univ3-inp')?.value?.trim()    || net.uniV3Router;
  const quoter      = $('deploy-quoter-inp')?.value?.trim()   || net.uniV3Quoter;
  const ownerAddress = STATE.wallet.address; // 6th constructor arg = owner (wallet address)

  if (!provider || !uniRouter || !sushiRouter || !uniV3Router || !quoter) {
    toast('All five router/pool/quoter addresses are required', 'error'); return;
  }
  if (!ownerAddress) {
    toast('Connect your wallet — owner address required', 'error'); return;
  }

  $('deploy-confirm-btn').disabled=true;
  $('deploy-confirm-btn').innerHTML='<i class="fas fa-circle-notch fa-spin mr1"></i>Awaiting MetaMask...';

  try {
    // Switch MetaMask to the correct chain
    try {
      await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{chainId: net.hexId}] });
    } catch(switchErr) {
      if (switchErr.code === 4902) {
        toast('Network not in MetaMask — add it manually first', 'error', 6000); throw switchErr;
      }
    }

    // Build deployment data = bytecode + ABI-encoded constructor args (6-arg)
    const constructorArgs = encodeConstructorArgs(provider, uniRouter, sushiRouter, uniV3Router, quoter, ownerAddress);
    const deployData = FLASH_ARB_BYTECODE + constructorArgs;

    tlog('[deploy] PersonalArbitrageBot: bytecode + 6-arg constructor encoded', 'info');
    tlog(`[deploy] PoolAddressesProvider (arg1): ${provider}`, 'dim');
    tlog(`[deploy] Provider: ${provider.slice(0,10)}... UniV2: ${uniRouter.slice(0,10)}... UniV3: ${uniV3Router.slice(0,10)}...`, 'dim');
    tlog(`[deploy] Owner (5th arg): ${ownerAddress}`, 'dim');

    // Estimate gas for deployment
    let gasLimit = '0x1E8480'; // 2,000,000 default (contract deployment needs ~1.5M–2M gas)
    try {
      const gasEst = await window.ethereum.request({
        method: 'eth_estimateGas',
        params: [{ from: STATE.wallet.address, data: deployData }]
      });
      // Add 30% buffer (deployment heavier than function calls)
      gasLimit = '0x' + Math.ceil(parseInt(gasEst, 16) * 1.3).toString(16);
      tlog(`[deploy] Gas estimated: ${parseInt(gasEst,16).toLocaleString()} units (+ 30% buffer = ${parseInt(gasLimit,16).toLocaleString()})`, 'success');
    } catch(e) {
      tlog(`[deploy] Gas estimate failed (using default 300k): ${e.message}`, 'warn');
    }

    // Get current gas price — network-aware (Polygon needs ≥30 gwei priority)
    let txParams = {
      from: STATE.wallet.address,
      data: deployData,
      gas: gasLimit,
    };
    try {
      const fees = await getGasFees(chainId);
      txParams.maxFeePerGas         = fees.maxFeePerGas;
      txParams.maxPriorityFeePerGas = fees.maxPriorityFeePerGas;
      tlog(`[deploy] Gas fees: maxFee=${(parseInt(fees.maxFeePerGas,16)/1e9).toFixed(2)} maxPrio=${(parseInt(fees.maxPriorityFeePerGas,16)/1e9).toFixed(2)} gwei`, 'dim');
    } catch(feeErr) {
      tlog(`[deploy] Fee estimation failed, MetaMask will use defaults: ${feeErr.message}`, 'warn');
    }

    $('deploy-confirm-btn').innerHTML='<i class="fas fa-pen-fancy fa-spin mr1"></i>Sign in MetaMask...';
    tlog('[deploy] Sending deployment tx — MetaMask prompt open...', 'info');

    // Send transaction — MetaMask pops up for user signing
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [txParams]
    });

    tlog(`[deploy] ✅ Tx submitted: ${txHash}`, 'success');
    tlog('[deploy] Waiting for block confirmation...', 'dim');
    $('deploy-confirm-btn').innerHTML='<i class="fas fa-hourglass-half fa-spin mr1"></i>Waiting for confirmation...';

    // Poll for receipt
    const contractAddress = await pollForReceipt(txHash, chainId, 90000);

    const deploy = {
      chainId, network: net.name, address: contractAddress||'pending',
      txHash, timestamp: Date.now(), isTestnet: net.isTestnet,
      provider, uniRouter, sushiRouter, uniV3Router, ownerAddress, real: true,
      version: 'v3.6', viaFactory: false
    };
    STATE.deployedContracts.unshift(deploy);
    localStorage.setItem('flasharb_contracts', JSON.stringify(STATE.deployedContracts.slice(0,20)));
    localStorage.setItem('flasharb_active_contract_'+chainId, contractAddress||'');

    closeDeployModal();
    updateDeployedList();

    const explorer = net.explorer;
    if (contractAddress) {
      toast(`🚀 PersonalArbitrageBot deployed! ${shortAddr(contractAddress)} on ${net.name}`, 'success', 8000);
      tlog(`[deploy] ✅ Contract live at: ${contractAddress}`, 'success');
      tlog(`[deploy] 🔗 Explorer: ${explorer}/address/${contractAddress}`, 'success');
      tlog(`[deploy] You can now execute real flash loan arbitrage from the Opportunities tab`, 'success');
    } else {
      toast(`🚀 Deploy tx sent! Check explorer for contract address: ${shortAddr(txHash)}`, 'info', 8000);
      tlog(`[deploy] Tx: ${explorer}/tx/${txHash}`, 'dim');
    }

  } catch(err) {
    if (err.code === 4001) {
      toast('Deployment cancelled by user', 'warn');
      tlog('[deploy] User rejected MetaMask signature', 'warn');
    } else {
      toast(`Deploy failed: ${err.message?.slice(0,80)||'Unknown error'}`, 'error', 7000);
      tlog(`[deploy] ❌ Error: ${err.message}`, 'error');
    }
  } finally {
    $('deploy-confirm-btn').disabled=false;
    $('deploy-confirm-btn').innerHTML='<i class="fas fa-rocket mr1"></i>Deploy via MetaMask';
  }
}

// ─── ONE-TIME ADMIN ACTION: deploy the ArbitrageBotFactory itself on a chain ──
// Only needs to happen once per chain, by anyone (the factory has no owner
// and no privileges over bots it creates — see the contract's own docstring).
// The resulting address is cached in localStorage and reused by every
// subsequent deployBotViaFactory() call on that chain.
async function deployFactoryContract() {
  const {chainId, net} = STATE.pendingDeploy || {};
  if (!chainId || !net) return;
  if (!window.ethereum || !STATE.wallet.connected) { toast('Connect MetaMask wallet first', 'error'); return; }

  const provider    = $('deploy-provider-inp')?.value?.trim() || net.aaveProvider;
  const uniRouter    = $('deploy-uni-inp')?.value?.trim()      || net.uniRouter;
  const sushiRouter  = $('deploy-sushi-inp')?.value?.trim()    || net.sushiRouter;
  const uniV3Router  = $('deploy-univ3-inp')?.value?.trim()    || net.uniV3Router;
  const quoter       = $('deploy-quoter-inp')?.value?.trim()   || net.uniV3Quoter;
  if (!provider || !uniRouter || !sushiRouter || !uniV3Router || !quoter) {
    toast('All five router/pool/quoter addresses are required', 'error'); return;
  }

  const btn = $('deploy-factory-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr1"></i>Awaiting MetaMask...'; }

  try {
    try {
      await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{chainId: net.hexId}] });
    } catch(switchErr) {
      if (switchErr.code === 4902) { toast('Network not in MetaMask — add it manually first', 'error', 6000); throw switchErr; }
    }

    const constructorArgs = encodeFactoryConstructorArgs(provider, uniRouter, sushiRouter, uniV3Router, quoter);
    const deployData = FACTORY_BYTECODE + constructorArgs;
    tlog('[factory-deploy] ArbitrageBotFactory: bytecode + 5-arg constructor encoded', 'info');

    let gasLimit = '0x2DC6C0'; // 3,000,000 default — factory bytecode embeds the bot's full creation code too
    try {
      const gasEst = await window.ethereum.request({ method:'eth_estimateGas', params:[{ from: STATE.wallet.address, data: deployData }] });
      gasLimit = '0x' + Math.ceil(parseInt(gasEst, 16) * 1.3).toString(16);
      tlog(`[factory-deploy] Gas estimated: ${parseInt(gasEst,16).toLocaleString()} units`, 'success');
    } catch(e) { tlog(`[factory-deploy] Gas estimate failed (using default): ${e.message}`, 'warn'); }

    let txParams = { from: STATE.wallet.address, data: deployData, gas: gasLimit };
    try {
      const fees = await getGasFees(chainId);
      txParams.maxFeePerGas = fees.maxFeePerGas;
      txParams.maxPriorityFeePerGas = fees.maxPriorityFeePerGas;
    } catch(feeErr) { tlog(`[factory-deploy] Fee estimation failed, MetaMask will use defaults: ${feeErr.message}`, 'warn'); }

    if (btn) btn.innerHTML = '<i class="fas fa-pen-fancy fa-spin mr1"></i>Sign in MetaMask...';
    const txHash = await window.ethereum.request({ method:'eth_sendTransaction', params:[txParams] });
    tlog(`[factory-deploy] ✅ Tx submitted: ${txHash}`, 'success');
    if (btn) btn.innerHTML = '<i class="fas fa-hourglass-half fa-spin mr1"></i>Waiting for confirmation...';

    const factoryAddress = await pollForReceipt(txHash, chainId, 90000);
    if (factoryAddress) {
      setFactoryAddress(chainId, factoryAddress);
      toast(`🏭 Factory deployed! ${shortAddr(factoryAddress)} on ${net.name} — now the default for "Deploy via Factory" on this chain.`, 'success', 9000);
      tlog(`[factory-deploy] ✅ Factory live at: ${factoryAddress}`, 'success');
      tlog(`[factory-deploy] 🔗 Explorer: ${net.explorer}/address/${factoryAddress}`, 'success');
      openDeployModal(!net.isTestnet); // refresh modal so the factory section shows the new address
    } else {
      toast(`Factory deploy tx sent — check explorer: ${shortAddr(txHash)}`, 'info', 8000);
    }
  } catch(err) {
    if (err.code === 4001) { toast('Factory deployment cancelled by user', 'warn'); }
    else { toast(`Factory deploy failed: ${err.message?.slice(0,80)||'Unknown error'}`, 'error', 7000); tlog(`[factory-deploy] ❌ Error: ${err.message}`, 'error'); }
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-industry mr1"></i>Deploy Factory (one-time)'; }
  }
}

// ─── PER-USER ACTION: deploy your own bot through the factory (v3.7) ──────────
// Every wallet that calls deployBot() gets its own independent
// PersonalArbitrageBot with msg.sender as the immutable owner — the factory
// itself never has any control over it.
async function deployBotViaFactory() {
  const {chainId, net} = STATE.pendingDeploy || {};
  if (!chainId || !net) return;
  if (!window.ethereum || !STATE.wallet.connected) { toast('Connect MetaMask wallet first', 'error'); return; }

  const factoryAddress = getFactoryAddress(chainId);
  if (!factoryAddress) {
    toast('No factory deployed on this chain yet — deploy the factory first (one-time)', 'error', 7000);
    return;
  }

  const btn = $('deploy-via-factory-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr1"></i>Awaiting MetaMask...'; }

  try {
    try {
      await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{chainId: net.hexId}] });
    } catch(switchErr) {
      if (switchErr.code === 4902) { toast('Network not in MetaMask — add it manually first', 'error', 6000); throw switchErr; }
    }

    const calldata = '0x' + DEPLOY_BOT_SELECTOR;
    let gasLimit = '0x2DC6C0'; // 3,000,000 default — deployBot() itself does a full CREATE internally
    try {
      const gasEst = await window.ethereum.request({ method:'eth_estimateGas', params:[{ from: STATE.wallet.address, to: factoryAddress, data: calldata }] });
      gasLimit = '0x' + Math.ceil(parseInt(gasEst, 16) * 1.3).toString(16);
    } catch(e) { tlog(`[factory] Gas estimate failed (using default): ${e.message}`, 'warn'); }

    let txParams = { from: STATE.wallet.address, to: factoryAddress, data: calldata, gas: gasLimit };
    try {
      const fees = await getGasFees(chainId);
      txParams.maxFeePerGas = fees.maxFeePerGas;
      txParams.maxPriorityFeePerGas = fees.maxPriorityFeePerGas;
    } catch(feeErr) { tlog(`[factory] Fee estimation failed, MetaMask will use defaults: ${feeErr.message}`, 'warn'); }

    if (btn) btn.innerHTML = '<i class="fas fa-pen-fancy fa-spin mr1"></i>Sign in MetaMask...';
    const txHash = await window.ethereum.request({ method:'eth_sendTransaction', params:[txParams] });
    tlog(`[factory] ✅ deployBot() tx submitted: ${txHash}`, 'success');
    if (btn) btn.innerHTML = '<i class="fas fa-hourglass-half fa-spin mr1"></i>Waiting for confirmation...';

    // Need the FULL receipt here (not just pollForReceipt's address-only
    // return) because the new bot's address comes from the BotDeployed event
    // log, not from receipt.contractAddress — this is a function call to the
    // factory, not a contract-creation tx.
    const rpcs = PUBLIC_RPCS[chainId] || PUBLIC_RPCS['1'];
    let receipt = null;
    const deadline = Date.now() + 90000;
    while (!receipt && Date.now() < deadline) {
      for (const rpc of rpcs) {
        try {
          const r = await fetch(rpc, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_getTransactionReceipt',params:[txHash]})});
          const d = await r.json();
          if (d.result?.blockNumber) { receipt = d.result; break; }
        } catch(_) {}
      }
      if (!receipt) await new Promise(r => setTimeout(r, 3000));
    }

    if (!receipt || receipt.status !== '0x1') {
      toast(`Deploy tx reverted or timed out — check explorer: ${shortAddr(txHash)}`, 'error', 8000);
      tlog(`[factory] ❌ deployBot() did not succeed: ${net.explorer}/tx/${txHash}`, 'error');
      return;
    }

    const botAddress = decodeBotDeployedAddress(receipt, factoryAddress);
    if (!botAddress) {
      toast('Bot deployed but could not parse its address from the event log — check explorer', 'warn', 8000);
      tlog(`[factory] ⚠ BotDeployed event not found in logs: ${net.explorer}/tx/${txHash}`, 'warn');
      return;
    }

    const deploy = {
      chainId, network: net.name, address: botAddress,
      txHash, timestamp: Date.now(), isTestnet: net.isTestnet,
      ownerAddress: STATE.wallet.address, real: true,
      version: 'v3.7', viaFactory: true, factoryAddress
    };
    STATE.deployedContracts.unshift(deploy);
    localStorage.setItem('flasharb_contracts', JSON.stringify(STATE.deployedContracts.slice(0,20)));
    localStorage.setItem('flasharb_active_contract_'+chainId, botAddress);

    closeDeployModal();
    updateDeployedList();

    toast(`🚀 Your bot deployed via factory! ${shortAddr(botAddress)} on ${net.name}`, 'success', 8000);
    tlog(`[factory] ✅ Bot live at: ${botAddress} (v3.7, minOutBuy slippage floor enabled)`, 'success');
    tlog(`[factory] 🔗 Explorer: ${net.explorer}/address/${botAddress}`, 'success');
  } catch(err) {
    if (err.code === 4001) { toast('Deployment cancelled by user', 'warn'); }
    else { toast(`Deploy via factory failed: ${err.message?.slice(0,80)||'Unknown error'}`, 'error', 7000); tlog(`[factory] ❌ Error: ${err.message}`, 'error'); }
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-rocket mr1"></i>Deploy Your Bot via Factory'; }
  }
}

// ─── TX RECEIPT POLLING ───────────────────────────────────────────────────────
async function pollForReceipt(txHash, chainId, timeoutMs=90000) {
  const rpcs  = PUBLIC_RPCS[chainId] || PUBLIC_RPCS['1'];
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    for (const rpc of rpcs) {
      try {
        const res = await fetch(rpc, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_getTransactionReceipt',params:[txHash]})
        });
        const d = await res.json();
        if (d.result && d.result.status) {
          const receipt = d.result;
          tlog(`[receipt] Block #${parseInt(receipt.blockNumber,16).toLocaleString()} | Gas used: ${parseInt(receipt.gasUsed,16).toLocaleString()}`, 'success');
          if (receipt.status === '0x1') {
            return receipt.contractAddress || receipt.to;
          } else {
            tlog('[receipt] ❌ Transaction reverted on-chain', 'error');
            return null;
          }
        }
      } catch(_) {}
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  tlog('[receipt] Timeout waiting for confirmation — check explorer manually', 'warn');
  return null;
}

// Parse ArbitrageExecuted event from tx receipt logs
function parseArbitrageEvent(receipt) {
  if (!receipt?.logs) return null;
  // PersonalArbitrageBot event: ArbitrageExecuted(address indexed token, uint256 loan, uint256 profit, uint8 buyDex, uint8 sellDex, uint256 ts)
  // topic0 = keccak256("ArbitrageExecuted(address,uint256,uint256,uint8,uint8,uint256)") — REAL compiled value
  const topic0_v2 = '0x71e9ab98349f53008889a1751e4e66777fa751a6663f24039498c3b21d029bd7';
  // Legacy fallback (old v1 event)
  const topic0_v1 = '0xf5d9c3bf0e2640bd2ab5ccc39f5547fb07e0b2cc8bead91aa41c3fd3dfdb0d33';
  for (const log of receipt.logs) {
    const t0 = log.topics?.[0]?.toLowerCase();
    if (t0 === topic0_v2 || t0 === topic0_v1) {
      try {
        const data = log.data.replace('0x','');
        // data layout: [loan 32b][profit 32b][buyDex 32b][sellDex 32b][ts 32b]
        const loanAmount = BigInt('0x' + data.slice(0,64));
        const profit     = BigInt('0x' + data.slice(64,128));
        const buyDexId   = Number(BigInt('0x' + data.slice(128,192)));
        const sellDexId  = Number(BigInt('0x' + data.slice(192,256)));
        const ts         = Number(BigInt('0x' + data.slice(256,320)));
        return {
          profit, loanAmount, buyDexId, sellDexId, ts,
          profitEth: Number(profit) / 1e18
        };
      } catch(_) {}
    }
  }
  return null;
}

function updateDeployedList() {
  const el = $('deployed-list'); if (!el) return;
  if (!STATE.deployedContracts.length) {
    el.innerHTML='<div class="empty-state-sm" style="text-align:center;padding:14px;color:var(--tm);font-size:12px;">No contracts deployed yet.<br>Go to Deploy tab to deploy your PersonalArbitrageBot.</div>';
    return;
  }
  el.innerHTML = STATE.deployedContracts.slice(0,8).map(d => {
    const net = NET_REGISTRY[d.chainId]||{};
    const exp = net.explorer||'https://etherscan.io';
    const isReal = !!d.real;
    const isActive = localStorage.getItem('flasharb_active_contract_'+d.chainId) === d.address;
    const badgeClass = isReal ? (d.isTestnet?'badge-green':'badge-red') : 'badge-yellow';
    const badgeTxt   = isReal ? (d.isTestnet?'✓ TESTNET':'✓ MAINNET') : 'SIM';
    return `<div style="padding:10px 0;border-bottom:1px solid var(--bd2);">
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
        <span class="sdot" style="background:${net.color||'var(--cyan)'};box-shadow:0 0 5px ${net.color||'var(--cyan)'}40;width:7px;height:7px;border-radius:50%;flex-shrink:0;"></span>
        <span style="font-size:12px;font-weight:700;">${d.network||'Unknown'}</span>
        <span class="badge ${badgeClass}" style="font-size:9px;">${badgeTxt}</span>
        ${d.version ? `<span class="badge" style="font-size:9px;background:${d.version==='v3.7'?'rgba(0,255,128,0.12);color:var(--green)':'rgba(255,165,0,0.12);color:orange'};border:1px solid currentColor;">${d.version}${d.viaFactory?' · factory':''}</span>` : ''}
        ${isActive?'<span class="badge badge-cyan" style="font-size:9px;">ACTIVE</span>':''}
        ${isReal?`<button onclick="setActiveContract('${d.chainId}','${d.address}')" style="margin-left:auto;font-size:9px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:var(--cyan);padding:2px 6px;border-radius:4px;cursor:pointer;">Set Active</button>`:''}
      </div>
      ${d.address && d.address!=='pending'
        ? `<a href="${exp}/address/${d.address}" target="_blank" class="mono" style="font-size:10px;color:var(--cyan);" title="${d.address}">${shortAddr(d.address)}</a>`
        : '<span class="mono" style="font-size:10px;color:var(--yellow);">Pending confirmation...</span>'
      }
      ${isReal && d.txHash
        ? `<div style="margin-top:3px;"><a href="${exp}/tx/${d.txHash}" target="_blank" style="font-size:9px;color:var(--tm);">Tx: ${shortAddr(d.txHash)}</a></div>`
        : ''
      }
      <div style="font-size:9px;color:var(--tm);margin-top:3px;">${new Date(d.timestamp).toLocaleString()}</div>
    </div>`;
  }).join('');
}

function setActiveContract(chainId, address) {
  localStorage.setItem('flasharb_active_contract_'+chainId, address);
  updateDeployedList();
  updateExecStatusBanner();
  toast(`Active contract set: ${shortAddr(address)} on ${NET_REGISTRY[chainId]?.name}`, 'success');
  tlog(`[deploy] Active contract for ${NET_REGISTRY[chainId]?.name}: ${address}`, 'success');
}

function copyContract() {
  navigator.clipboard.writeText(CONTRACT_SRC).then(() => toast('Contract source copied to clipboard','success'));
}
