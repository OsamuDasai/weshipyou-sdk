var c=class{constructor(e){this.httpClient=e;this.categoryCache=new Map}async getRates(e,t="en-US"){return(await this.httpClient.request({method:"POST",url:"/api/v1/shipments/rates",body:e,headers:{"Accept-Language":t}})).data}async createShipment(e,t="en-US"){return(await this.httpClient.request({method:"POST",url:"/api/v1/shipments",body:e,headers:{"Accept-Language":t}})).data}async updateShipment(e,t,n="en-US"){return(await this.httpClient.request({method:"PUT",url:`/api/v1/shipments/${encodeURIComponent(e)}`,body:t,headers:{"Accept-Language":n}})).data}async getCountryCategories(e,t="en-US"){let n=`${e}:${t}`,a=this.categoryCache.get(n);if(a&&a.expires>Date.now())return a.data;let r=await this.httpClient.request({method:"GET",url:`/api/v1/shipments/country-categories?countryCode=${encodeURIComponent(e)}`,headers:{"Accept-Language":t}});return this.categoryCache.set(n,{data:r.data,expires:Date.now()+3e5}),r.data}};var m=class{constructor(e,t){this.authService=e;this.shipmentService=t}async execute(e,t,n,a,r="en-US"){return await this.authService.authenticate(e,t,r),this.shipmentService.updateShipment(n,a,r)}};import{randomUUID as E}from"crypto";import I from"better-sqlite3";var d=class{constructor(e=":memory:"){this.db=new I(e),this.db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        aggregate_id TEXT NOT NULL,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        version INTEGER NOT NULL
      )
    `),this.db.exec("CREATE INDEX IF NOT EXISTS idx_aggregate ON events(aggregate_id)"),this.db.exec("CREATE INDEX IF NOT EXISTS idx_timestamp ON events(timestamp)")}async append(e,t){let n=this.db.prepare(`
      INSERT OR IGNORE INTO events (id, aggregate_id, type, payload, timestamp, version)
      VALUES (@id, @aggregateId, @type, @payload, @timestamp, @version)
    `);this.db.transaction(r=>{for(let i of r)n.run({id:i.eventId||E(),aggregateId:i.aggregateId,type:i.type,payload:JSON.stringify(i.payload),timestamp:i.timestamp,version:i.version})})(t)}async getByAggregate(e,t=0){return this.db.prepare(`
      SELECT * FROM events
      WHERE aggregate_id = ? AND version >= ?
      ORDER BY version ASC
    `).all(e,t).map(a=>({...a,payload:JSON.parse(a.payload)}))}async replay(e,t){let n=e?"SELECT * FROM events WHERE timestamp >= ? ORDER BY timestamp ASC":"SELECT * FROM events ORDER BY timestamp ASC",a=this.db.prepare(n),r=e?a.all(e):a.all();if(!t)return;let i=100;for(let o=0;o<r.length;o+=i){let y=r.slice(o,o+i).map(p=>{let h={...p,payload:JSON.parse(p.payload)};return t(h).catch(v=>{console.error(`Replay error for event ${p.id}:`,v)})});await Promise.allSettled(y)}}close(){this.db.close()}};var g=class{constructor(e,t,n,a=new Date().toISOString(),r=1){this.eventId=e;this.aggregateId=t;this.payload=n;this.timestamp=a;this.version=r;this.type="shipment.created"}},u=class{constructor(e,t,n,a=new Date().toISOString(),r=1){this.eventId=e;this.aggregateId=t;this.payload=n;this.timestamp=a;this.version=r;this.type="shipment.status_changed"}},l=class{constructor(e,t,n,a=new Date().toISOString(),r=1){this.eventId=e;this.aggregateId=t;this.payload=n;this.timestamp=a;this.version=r;this.type="shipment.updated"}};export{c as a,m as b,d as c,g as d,u as e,l as f};
//# sourceMappingURL=chunk-KT3VLIZI.mjs.map