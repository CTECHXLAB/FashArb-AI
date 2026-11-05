#!/usr/bin/env bash
# Mainnet-fork execution test (no real funds). Requires foundry (anvil + cast) on PATH.
# Usage: ./tests/fork/run-fork-test.sh   (starts anvil on :8545 forking Ethereum mainnet)
set -euo pipefail
cd "$(dirname "$0")"
RPC=${FORK_URL:-https://ethereum-rpc.publicnode.com}; R=http://127.0.0.1:8545
PK=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80   # anvil default dev key - public, worthless
ME=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
USDC=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; WETH=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
UNI=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; SUSHI=0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F
SIG="executeArbitrage(address,uint256,address,uint8,uint8,uint24,uint256,uint256)"
pgrep -x anvil >/dev/null || { setsid -f anvil --fork-url "$RPC" --port 8545 --chain-id 1 > /tmp/anvil.log 2>&1 < /dev/null; sleep 6; }
# fresh fork state every run (undo any earlier price manipulation)
cast rpc anvil_reset "{\"forking\":{\"jsonRpcUrl\":\"$RPC\"}}" --rpc-url $R >/dev/null; sleep 2
# extract V37 bytecode from the app
node -e "const s=require('fs').readFileSync('../../public/static/app.js','utf8');require('fs').writeFileSync('bot.bin',s.match(/const FLASH_ARB_BYTECODE_V37 = '(0x[0-9a-f]+)'/)[1])"
ARGS=$(cast abi-encode "constructor(address,address,address,address,address,address)" 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e $UNI $SUSHI 0xE592427A0AEce92De3Edee1F18E0157C05861564 0x61fFE014bA17989E743c5F6cB21bF9697530B21e $ME)
cast rpc anvil_setBalance $ME 0x3635C9ADC5DEA00000000 --rpc-url $R >/dev/null
BOT=$(cast send --rpc-url $R --private-key $PK --create "$(cat bot.bin)${ARGS#0x}" --json | python3 -c "import json,sys;print(json.load(sys.stdin)['contractAddress'])")
echo "BOT=$BOT" > bot.addr; echo "deployed $BOT"
echo "[1] live prices -> must revert (no real spread)"; cast call $BOT "$SIG" $USDC 10000000000 $WETH 2 1 3000 0 1 --from $ME --rpc-url $R 2>&1 | head -1 || true
echo "[2] non-owner -> must revert"; cast call $BOT "$SIG" $USDC 10000000000 $WETH 2 1 3000 0 1 --from 0x000000000000000000000000000000000000dEaD --rpc-url $R 2>&1 | head -1 || true
echo "[3] engineer a spread on the fork: dump 8 WETH into SushiSwap"
cast send $WETH "deposit()" --value 100ether --private-key $PK --rpc-url $R >/dev/null
cast send $WETH "approve(address,uint256)" $SUSHI $(cast max-uint) --private-key $PK --rpc-url $R >/dev/null
cast send $SUSHI "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)" 8ether 0 "[$WETH,$USDC]" $ME 99999999999 --private-key $PK --rpc-url $R >/dev/null
echo "[4] execute flash-loan arb (buy SUSHI sell UNI, 20,000 USDC)"
cast send $BOT "$SIG" $USDC 20000000000 $WETH 2 1 3000 1 1 --private-key $PK --rpc-url $R --json | python3 -c "import json,sys;t=json.load(sys.stdin);print('status',t['status'],'gas',int(t['gasUsed'],16))"
echo "tradeCount=$(cast call $BOT 'tradeCount()(uint256)' --rpc-url $R) totalProfit(raw)=$(cast call $BOT 'totalProfit()(uint256)' --rpc-url $R)"
echo "[5] minProfit too high -> must revert"; cast call $BOT "$SIG" $USDC 20000000000 $WETH 2 1 3000 999999999999999 1 --from $ME --rpc-url $R 2>&1 | head -1 || true
