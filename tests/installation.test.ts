import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {platformError} from '../src/platform-errors';
test('updater config preserves existing identity, database, vars and is repeatable',()=>{
 const dir=mkdtempSync(join(tmpdir(),'directcash-install-'));try{
 const config={name:'aluna-example',d1_databases:[{binding:'DB',database_name:'aluna-db',database_id:'student-private-id'}],vars:{CUSTOM:'preserve'},assets:{directory:'./public',binding:'ASSETS'}};
 const file=join(dir,'wrangler.jsonc');writeFileSync(file,JSON.stringify(config));
 for(let i=0;i<2;i++)execFileSync(process.execPath,[resolve('scripts/update-config.mjs'),file]);
 const updated=JSON.parse(readFileSync(file,'utf8'));assert.equal(updated.name,config.name);assert.deepEqual(updated.d1_databases,config.d1_databases);assert.deepEqual(updated.vars,config.vars);assert.equal(updated.main,'src/worker.ts');assert.equal(updated.migrations.length,1);assert.equal(updated.keep_vars,true);assert.deepEqual(updated.triggers.crons,['*/5 * * * *']);
 assert.equal(readFileSync('public/atualizar-directcash.yml','utf8'),readFileSync('.github/workflows/atualizar-directcash.yml','utf8'));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('explicit D1 daily quota gives actionable message, other failures do not',()=>{
 assert.equal(platformError(new Error('D1_ERROR',{cause:new Error("Your account has exceeded D1’s free tier daily row read limit.")}))?.code,'D1_DAILY_LIMIT');
 assert.equal(platformError(new Error("Your account has exceeded D1's free tier daily row write limit."))?.code,'D1_DAILY_LIMIT');
 assert.equal(platformError(new Error('SQL syntax error')),null);
});
test('parent lookup preserves ordering and reduces reads with large sent history',async()=>{
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:'export default {fetch(){return new Response("ok")}}',compatibilityDate:'2026-09-15',d1Databases:['DB']}));try{
 const db=await mf.getD1Database('DB');await db.exec('CREATE TABLE jobs(id TEXT PRIMARY KEY,status TEXT,parent TEXT,created INTEGER); CREATE INDEX jobs_pending ON jobs(status,created);');
 await db.prepare("INSERT INTO jobs SELECT 'sent'||value,'sent',NULL,value FROM json_each(?)").bind(JSON.stringify(Array.from({length:2000},(_,i)=>i))).run();
 await db.exec("INSERT INTO jobs VALUES('ready','pending','sent5',1),('root','pending',NULL,2),('blocked','pending','missing',3);");
 const prefix="SELECT id FROM jobs WHERE status='pending' AND (parent IS NULL OR ";
 const old=await db.prepare(prefix+"parent IN (SELECT id FROM jobs WHERE status='sent')) ORDER BY created,id").all();
 const next=await db.prepare(prefix+"EXISTS (SELECT 1 FROM jobs AS parent_job WHERE parent_job.id=jobs.parent AND parent_job.status='sent')) ORDER BY created,id").all();
 assert.deepEqual(next.results,old.results);assert.deepEqual(next.results,[{id:'ready'},{id:'root'}]);assert.ok(next.meta.rows_read<old.meta.rows_read/10,JSON.stringify({old:old.meta,next:next.meta}));console.log('Rows read:',old.meta.rows_read,'→',next.meta.rows_read);
 }finally{await mf.dispose();}
});
