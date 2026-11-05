# FlashArb AI (webapp)

Browser-side Aave V3 flash-loan arbitrage console (Uniswap V2 / SushiSwap / Uniswap V3) on a
Hono + Cloudflare Pages shell. The frontend talks to chains directly through the user's wallet
and public RPCs; the Hono backend only serves the static app and a few helper API routes.

> **This is experimental software that can lose real money.** On public mainnets, genuine
> uni<->sushi spreads are normally captured by MEV bots within the same block. Expect the scanner
> to find nothing most of the time. That is correct behaviour, not a bug.

## Layout
```
src/index.tsx            Hono backend (Cloudflare Pages worker)
public/static/app.js     Frontend logic (scanner, quoting, deploy, execution)
public/static/index.html UI
public/static/style.css  Styles
tests/browser/           Playwright tests (headless Chromium, live RPC)
tests/fork/              Mainnet-fork execution test (anvil + cast)
tests/rpc/               RPC / CORS verification scripts + verified RPC list
ecosystem.config.cjs     PM2 config used in the sandbox (app name flasharb-ai, port 3000)
```

## Run
```bash
npm install
npm run build
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000     # or: pm2 start ecosystem.config.cjs
# open http://localhost:3000/   (redirects to /static/index.html)
```
Deploy: `npm run deploy` (needs your own Cloudflare account / API token).
No server-side secrets are required; optional API keys (Alchemy, ChainGPT) are entered in the UI
and kept in the browser's localStorage only.

## Safety design (what the code does before it asks the wallet to sign)
1. Only opportunities from the **live on-chain scanner** (`source:'live'`) can execute. Simulated
   backend opportunities are blocked from real execution.
2. Before signing, both legs are **re-quoted on the exact venues that will execute**
   (V2 `getAmountsOut`, V3 QuoterV2). If a leg cannot be quoted, the flow aborts. No other DEX,
   router or LLM is ever substituted for a pre-sign check.
3. If the fresh on-chain return is <= loan + Aave premium (0.09%), it aborts before signing.
4. `eth_estimateGas` must succeed or it aborts (no doomed transaction is broadcast).
5. The contract itself reverts unless `out > owed` and `profit >= minProfit`; Aave reverts if
   the loan is not repaid. A failed arb costs gas only.
6. Contract is `onlyOwner`, pausable, `nonReentrant`.

## Test results (honest summary)

### 1. Real RPC read-only verification (done)
Public RPC list was tested from a browser-like (CORS) context; dead/blocked ones were removed
(ankr needs a key, llamarpc dead, polygon-rpc.com disabled, 1rpc.io 429). `tests/rpc/verified-rpcs.json`.
`eth_getCode` was checked for every router/quoter/Aave address; several wrong or truncated
addresses were fixed (Aave ETH PoolAddressesProvider, Base quoter, Sepolia V3 router/quoter,
V3 quoter on Polygon/Arbitrum/Optimism).

### 2. Headless browser test (done) - `tests/browser/ui.mjs`
Real Chromium + live RPC, no wallet: page loads, tabs switch, key functions defined, live scan
completes on chains 1/137/42161/10/8453/56 (0 opportunities, expected), fresh quotes return real
values for V2/Sushi/V3 on ETH, Polygon, Arbitrum, Base and Sepolia (Sushi on Sepolia: no router).
Only console noise is CoinGecko CORS/429 (price falls back).

### 3. Mainnet-fork execution (done, **no real funds**) - `tests/fork/run-fork-test.sh`
anvil forking Ethereum mainnet, real Aave V3 pool and real Uniswap/Sushi pools:
* Bot (V37 bytecode) deploys with the registry addresses; `owner()` and quoter read back correctly.
* At live prices the arb **reverts** (no spread). Non-owner reverts `Not owner`; paused reverts.
* After skewing SushiSwap on the fork, the same transaction **succeeds**: Aave flash loan of
  20,000 USDC, buy on Sushi, sell on Uniswap V2, repay, profit sent to owner, `tradeCount=1`,
  bot holds no residual tokens. (The profit is fabricated by the price manipulation. It proves
  the contract mechanics, not that profit exists on the real chain.)
* Driving the **real UI code path** (`scanOnChainOpps` -> `openSignModal` -> `confirmSign` ->
  `executeRealFlashLoan`) in Chromium against the fork with a mock wallet: the scanner found the
  skewed spread, the app re-quoted, estimated gas and sent `executeArbitrage` (selector `0x0da92ae6`).
  `tests/browser/fork-exec.mjs`. The simulated-opportunity guard blocked execution
  (0 transactions sent) in `tests/browser/sim-guard.mjs`.
* Sepolia fork: bot deploys against the real Aave Sepolia pool; flash-loan path is reachable,
  but Sepolia has no SushiSwap router and the Aave test reserves are tiny (USDC ~55), so a
  profitable testnet arb is not possible.

### 4. NOT done
* **No real transaction was signed or broadcast on any mainnet or testnet.** The sandbox has no
  funded wallet or key. Do the live run yourself using the runbook below.

## Runbook: first real run with your own wallet (smallest risk first)
1. Use a **fresh wallet** holding only what you can lose. Start on **Sepolia** (free faucet ETH):
   connect MetaMask, deploy the bot from the Deploy tab, confirm `owner()` is your address.
2. Testnet cannot produce a profitable arb (see above); expect "spread closed / aborted before
   signing". That confirms the guards, not profit.
3. Mainnet: pick a chain with cheap gas (Arbitrum/Base/Polygon). Budget the deploy gas + one failed
   tx worth of gas. Never fund the bot contract with anything other than gas ETH.
4. Add Flashbots Protect (`https://rpc.flashbots.net`) as the Ethereum RPC in MetaMask for private
   submission. (The app does not submit bundles itself.) BSC: `https://bsc.rpc.blxrbdn.com`.
5. Run the live scan; only a `Live On-Chain` opportunity can be executed. Expect aborts.

## Known limitations
* ChainGPT integration is **experimental and unverified** (endpoints written from memory); it is
  not used in any trade decision.
* Private mempool: only Ethereum (Flashbots Protect) and BSC (bloXroute) endpoints verified.
  Polygon/Arbitrum private endpoints were dead and removed.
* Testnets: Arbitrum Sepolia, Base Sepolia, Polygon Amoy registry entries are partly unverified or
  have no code at the router addresses; Sepolia has no Sushi router.
* Base/Optimism V2 pools are thin or mispriced; the scanner still quotes them correctly.
* Remote commit `5bee974` on GitHub was overwritten by an earlier force-push.

## Data / storage
No database. Browser localStorage holds deployed contract addresses (`flasharb_active_contract_<chainId>`)
and optional API keys.

## Status
Last updated 2026-11-05. Platform: Cloudflare Pages (Hono + TypeScript, vanilla JS frontend).
