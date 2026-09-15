import {boundedText,seal,unseal} from './core';
import {now,type AppEnv} from './meta';
export type License={student:string;accountId:string;expires:number|null};
export function parseRemoteLicense(data:Record<string,unknown>,accountId:string):License|null{
  if(data.ok!==true||data.product!=='directcash'||data.instagramId!==accountId||typeof data.customerName!=='string'||data.customerName.length>160||typeof data.isLifetime!=='boolean')return null;
  const expires=data.isLifetime?null:typeof data.expiresAt==='string'?Math.floor(Date.parse(data.expiresAt)/1000):NaN;
  if(expires!==null&&(!Number.isFinite(expires)||expires<=now()))return null;
  return {student:data.customerName,accountId,expires};
}
export async function remoteLicense(env:AppEnv,code:string,accountId:string,activate=false):Promise<License|null>{
  const url=new URL(env.LICENSE_SERVER_URL);if(url.protocol!=='https:'||url.username||url.password)throw Error('Servidor de licenças inválido.');
  const result=await fetch(new URL(activate?'/activate':'/heartbeat',url),{method:'POST',redirect:'error',headers:{'Content-Type':'application/json','x-livecash-tool':'directcash'},body:JSON.stringify({app:'directcash',key:code,instagramId:accountId}),signal:AbortSignal.timeout(8000)});
  if(!result.ok)return null;
  return parseRemoteLicense(JSON.parse(await boundedText(result,16384)),accountId);
}
export async function cacheLicense(env:AppEnv,license:License){await env.DB.prepare("INSERT INTO settings(key,value) VALUES('license-cache',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(JSON.stringify({license,until:Math.min(now()+300,license.expires??Infinity)})).run();}
export async function activateLicense(env:AppEnv,code:string,accountId:string){
  if(!/^DC-[A-F0-9]{32}$/.test(code))return null;
  const license=await remoteLicense(env,code,accountId,true);if(!license)return null;
  await env.DB.batch([env.DB.prepare("INSERT INTO settings(key,value) VALUES('license-online',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(await seal(code,env.APP_KEY)),env.DB.prepare("DELETE FROM settings WHERE key IN ('license','license-cache')")]);
  await cacheLicense(env,license);return license;
}
export async function licenseFor(env:AppEnv,accountId:string):Promise<License|null>{
  const row=await env.DB.prepare("SELECT value FROM settings WHERE key='license-online'").first<{value:string}>();if(!row)return null;
  const cached=await env.DB.prepare("SELECT value FROM settings WHERE key='license-cache'").first<{value:string}>();
  if(cached){try{const {license,until}=JSON.parse(cached.value);if(license.accountId===accountId&&until>now()&&(license.expires===null||license.expires>now()))return license;}catch{/* validate online */}}
  try{const license=await remoteLicense(env,await unseal(row.value,env.APP_KEY),accountId);if(license){await cacheLicense(env,license);return license;}}catch{/* Fail closed after cache expiration. */}
  await env.DB.prepare("DELETE FROM settings WHERE key='license-cache'").run();return null;
}
