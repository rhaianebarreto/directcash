const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve('public');const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(root+path.sep)){res.writeHead(404).end();return;}try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/**',route=>route.fulfill({json:route.request().url().includes('/status')?{counts:[],account:{id:'123',username:'test'},licensingPaused:true}:route.request().url().includes('/rules')?[]:{data:[]}}));
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForLoadState('networkidle');
  await page.evaluate(()=>{document.querySelector('#login').hidden=true;document.querySelector('#shell').hidden=false;editMap({name:'Teste',trigger:'comment',keywords:'quero',flow:JSON.stringify({version:1,allPosts:true,map:{start:'a',nodes:[{id:'a',type:'message',text:'Olá',choices:[],links:[{title:'Receber 😊',url:'https://example.com'}],next:'b',x:0,y:0},{id:'b',type:'wait',minutes:120,choices:[],next:'',x:280,y:0}]}})});});
  const duplicated=await page.evaluate(()=>{const original=mapState.map.nodes[0];window.duplicateFlowBlock(original);const copy=mapState.map.nodes.at(-1);const retained=copy.links[0].title===original.links[0].title&&copy.next===original.next;copy.links[0].title='Outro';return {retained,independent:original.links[0].title==='Receber 😊',ids:copy.id!==original.id,numbers:copy.number!==original.number};});assert.deepEqual(duplicated,{retained:true,independent:true,ids:true,numbers:true});
  await page.locator('.sf-setup > summary').click();await page.locator('#next-post-map input').check();assert.equal(await page.evaluate(()=>!!mapState.nextPostAt&&!mapState.allPosts&&!mapState.media_id),true);
  await page.locator('#next-post-map input').uncheck();assert.equal(await page.locator('#flow-media').locator('..').getByRole('button').first().isVisible(),true);
  await page.evaluate(()=>{setEditorMode(false);selectedNode='b';renderInspector();});assert.equal(await page.locator('#node-fields select').first().inputValue(),'hours');
  await page.locator('#node-fields input[type=number]').fill('3');await page.locator('#node-fields input[type=number]').dispatchEvent('change');assert.equal(await page.evaluate(()=>mapState.map.nodes.find(n=>n.id==='b').minutes),180);
  await page.evaluate(()=>{selectedNode='a';renderInspector();});assert.ok(await page.locator('#node-fields .fp-button-row .fe-emoji-bar').count());
  const beforeEmoji=await page.evaluate(()=>mapState.map.nodes[0].links[0].title);
  await page.locator('#node-fields .fp-button-row .fe-emoji-bar button').first().click();await page.locator('.fe-full-emoji').first().click();
  assert.notEqual(await page.evaluate(()=>mapState.map.nodes[0].links[0].title),beforeEmoji);
  await page.evaluate(()=>setEditorMode(true));await page.locator('.sf-card[data-node="b"] .sf-card-head').first().getByRole('button',{name:'Editar',exact:true}).click();
  await page.locator('.sf-card[data-node="b"] .sf-fields select').first().selectOption('hours');
  assert.equal(await page.locator('.sf-card[data-node="b"] .sf-fields input[type=number]').first().inputValue(),'3');
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.locator('.sf-card-head').evaluateAll(heads=>heads.every(head=>head.scrollWidth<=head.clientWidth+1)),true);
  await page.evaluate(()=>newRule());await page.locator('#next-post-simple').check();assert.equal(await page.evaluate(()=>!!editorData().flow.nextPostAt&&editorData().media_id===''),true);
  await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('#next-post-simple').isVisible(),true);
  assert.deepEqual(errors,[]);console.log('PASS: duplication, independent settings, emoji controls, hours, next-post controls, mobile and no page errors');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
