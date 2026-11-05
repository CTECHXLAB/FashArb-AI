import { chromium } from 'playwright';
import fs from 'fs';
const BOT = fs.readFileSync('../fork/bot.addr','utf8').split('=')[1].trim();
const ME = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const b = await chromium.launch(); const ctx = await b.newContext(); const page = await ctx.newPage();
const errs=[]; page.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await page.addInitScript(({ME})=>{
  window.__sent=[];
  window.ethereum = { isMetaMask:true, selectedAddress:ME,
    request: async ({method,params})=>{
      if(method==='wallet_switchEthereumChain') return null;
      if(method==='eth_requestAccounts'||method==='eth_accounts') return [ME];
      if(method==='eth_sendTransaction') window.__sent.push(params[0]);
      const r = await fetch('http://127.0.0.1:8545',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params:params||[]})});
      const d = await r.json(); if(d.error) throw Object.assign(new Error(d.error.message),{code:d.error.code}); return d.result; },
    on(){}, removeListener(){} };
},{ME});
await page.goto('http://localhost:3000/static/index.html',{waitUntil:'load'});
await page.waitForTimeout(1500);
await page.evaluate(()=>closeApiModal());
const out = await page.evaluate(async ({BOT,ME})=>{
  STATE.currentChainId='1';
  STATE.wallet={connected:true,address:ME,provider:'mock-anvil',balance:0,usdValue:0,sessionProfitUSD:0,sessionGasETH:0,sessionProfitETH:0};
  STATE.deployedContracts=[{chainId:'1',address:BOT,real:true,version:'v3.7'}];
  localStorage.setItem('flasharb_active_contract_1',BOT);
  const opps = await scanOnChainOpps('1');
  STATE.opportunities = opps;
  return opps.slice(0,5).map(o=>({pair:o.tokenPair,buy:o.buyDex,sell:o.sellDex,pct:o.profitPercent,loan:o.loanAmount,src:o.source,mid:o.midToken}));
},{BOT,ME});
console.log('SCAN on fork ->', JSON.stringify(out,null,1));
if(out.length){
  const res = await page.evaluate(async()=>{
    await openSignModal(0);
    try{ await confirmSign(); return {ok:true}; }catch(e){ return {ok:false,err:e.message}; }
  });
  await page.waitForTimeout(4000);
  console.log('EXECUTE result:', JSON.stringify(res));
  console.log('tx sent via wallet:', await page.evaluate(()=>window.__sent.length), (await page.evaluate(()=>window.__sent[0]?.data?.slice(0,10))));
  const log = await page.evaluate(()=>document.getElementById('terminal-log')?.innerText?.split('\n').filter(l=>l.includes('[arb]')||l.includes('[mev]')).slice(-14).join('\n')||'(no terminal element)');
  console.log(log);
}
console.log('page errors:',errs);
await b.close();
