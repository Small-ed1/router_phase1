function e(e,t,s,a){Object.defineProperty(e,t,{get:s,set:a,enumerable:!0,configurable:!0})}var t=globalThis.parcelRequire10c2,s=t.register;s("cc46N",function(s,a){Object.defineProperty(s.exports,"__esModule",{value:!0,configurable:!0}),e(s.exports,"default",()=>c);var n=t("ayMG0"),i=t("acw62"),r=t("lH95N"),o=t("luNHW"),c=()=>{let[e,t]=(0,i.useState)([]),[s,a]=(0,i.useState)("selector");return(0,n.jsx)("div",{className:"document-qa-tab",children:"selector"===s?(0,n.jsx)(r.default,{selectedDocuments:e,onSelectionChange:e=>{t(e),e.length>0&&a("qa")},maxSelections:5}):(0,n.jsx)(o.default,{selectedDocuments:e,onBack:()=>{a("selector")}})})}}),s("lH95N",function(s,a){e(s.exports,"default",()=>d);var n=t("ayMG0"),i=t("acw62"),r=t("gC2yi"),o=t("2zAJi"),c=t("6feOA");let l=(i&&i.__esModule?i.default:i).memo(({selectedDocuments:e,onSelectionChange:t,maxSelections:s=5})=>{let[a,l]=(0,i.useState)([]),[d,m]=(0,i.useState)(!0),[p,x]=(0,i.useState)(null),[u,h]=(0,i.useState)(""),[g,f]=(0,i.useState)("all");(0,i.useEffect)(()=>{v()},[]);let v=async()=>{try{m(!0);let e=await (0,o.cachedFetch)("/api/documents");l(e.documents||[]),x(null)}catch(e){x(e.message),l([{id:"doc1",filename:"research_paper.pdf",title:"Advances in Machine Learning",type:"pdf",size:2457600,uploadedAt:"2024-01-15T10:30:00Z",status:"processed",chunkCount:45},{id:"doc2",filename:"user_manual.docx",title:"System User Manual",type:"docx",size:512e3,uploadedAt:"2024-01-14T15:20:00Z",status:"processed",chunkCount:23},{id:"doc3",filename:"notes.txt",title:"Meeting Notes",type:"txt",size:16384,uploadedAt:"2024-01-13T09:15:00Z",status:"processed",chunkCount:8}])}finally{m(!1)}},y=a=>{let n=e.includes(a)?e.filter(e=>e!==a):[...e,a];n.length<=s&&t(n)},b=e=>{if(0===e)return"0 Bytes";let t=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,t)).toFixed(2))+" "+["Bytes","KB","MB","GB"][t]},j=e=>new Date(e).toLocaleDateString([],{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),w=a.filter(e=>{let t=e.filename.toLowerCase().includes(u.toLowerCase())||e.title&&e.title.toLowerCase().includes(u.toLowerCase()),s="all"===g||e.type===g;return t&&s}),N=e=>{switch(e){case"processed":return"#28a745";case"processing":return"#ffc107";case"failed":return"#dc3545";default:return"#6c757d"}};return d?(0,n.jsxs)("div",{className:"document-selector",children:[(0,n.jsxs)("div",{className:"selector-header",children:[(0,n.jsx)(r.default,{width:"200px",height:"1.5rem"}),(0,n.jsx)(r.default,{width:"120px",height:"1rem"})]}),(0,n.jsxs)("div",{className:"selector-controls",children:[(0,n.jsx)(r.default,{width:"100%",height:"2.5rem"}),(0,n.jsx)(r.default,{width:"120px",height:"2.5rem"})]}),(0,n.jsx)("div",{className:"documents-list",children:Array.from({length:4},(e,t)=>(0,n.jsxs)("div",{className:"document-item",children:[(0,n.jsx)(r.default,{width:"20px",height:"20px",variant:"circular",className:"document-checkbox"}),(0,n.jsxs)("div",{className:"document-info",children:[(0,n.jsxs)("div",{className:"document-header",children:[(0,n.jsx)(r.default,{width:"70%",height:"1rem"}),(0,n.jsx)("div",{className:"document-meta",children:(0,n.jsx)(r.default,{width:"50px",height:"1rem"})})]}),(0,n.jsx)(r.SkeletonText,{lines:2,width:"100%"}),(0,n.jsx)(r.default,{width:"80px",height:"0.8rem"})]})]},t))})]}):(0,n.jsxs)("div",{className:"document-selector",children:[(0,n.jsxs)("div",{className:"selector-header",children:[(0,n.jsx)("h3",{children:"Select Documents"}),(0,n.jsxs)("span",{className:"selection-count",children:[e.length,"/",s," selected"]})]}),(0,n.jsxs)("div",{className:"selector-controls",children:[(0,n.jsxs)("div",{className:"search-bar",children:[(0,n.jsx)("input",{type:"text",placeholder:"Search documents...",value:u,onChange:e=>h(e.target.value),className:"search-input"}),(0,n.jsx)("span",{className:"search-icon",children:"🔍"})]}),(0,n.jsx)("div",{className:"filter-controls",children:(0,n.jsxs)("label",{children:["Type:",(0,n.jsxs)("select",{value:g,onChange:e=>f(e.target.value),className:"type-filter",children:[(0,n.jsx)("option",{value:"all",children:"All Types"}),(0,n.jsx)("option",{value:"pdf",children:"PDF"}),(0,n.jsx)("option",{value:"docx",children:"Word"}),(0,n.jsx)("option",{value:"txt",children:"Text"})]})]})})]}),p&&(0,n.jsxs)("div",{className:"error-message",children:[(0,n.jsx)("span",{className:"error-icon",children:"⚠️"}),(0,n.jsx)("span",{children:p})]}),(0,n.jsx)("div",{className:"documents-list",children:0===w.length?(0,n.jsxs)("div",{className:"no-documents",children:[(0,n.jsx)("p",{children:u||"all"!==g?"No documents match your search.":"No documents uploaded yet."}),(0,n.jsx)("p",{children:"Upload documents in the Documents tab to get started."})]}):w.length>20?(0,n.jsx)(c.default,{items:w,itemHeight:100,containerHeight:400,renderItem:(t,a)=>(0,n.jsxs)("div",{className:`document-item ${e.includes(t.id)?"selected":""}`,onClick:()=>y(t.id),children:[(0,n.jsx)("div",{className:"document-checkbox",children:(0,n.jsx)("input",{type:"checkbox",checked:e.includes(t.id),onChange:()=>{},disabled:!e.includes(t.id)&&e.length>=s})}),(0,n.jsxs)("div",{className:"document-info",children:[(0,n.jsxs)("div",{className:"document-header",children:[(0,n.jsx)("h4",{className:"document-title",children:t.title||t.filename}),(0,n.jsxs)("div",{className:"document-meta",children:[(0,n.jsx)("span",{className:"document-type",children:t.type.toUpperCase()}),(0,n.jsxs)("span",{className:"document-status",style:{color:N(t.status)},children:["● ",t.status]})]})]}),(0,n.jsxs)("div",{className:"document-details",children:[(0,n.jsx)("span",{className:"document-filename",children:t.filename}),(0,n.jsx)("span",{className:"document-size",children:b(t.size)}),t.chunkCount&&(0,n.jsxs)("span",{className:"document-chunks",children:[t.chunkCount," chunks"]})]}),(0,n.jsxs)("div",{className:"document-date",children:["Uploaded ",j(t.uploadedAt)]})]})]},t.id)}):w.map(t=>(0,n.jsxs)("div",{className:`document-item ${e.includes(t.id)?"selected":""}`,onClick:()=>y(t.id),children:[(0,n.jsx)("div",{className:"document-checkbox",children:(0,n.jsx)("input",{type:"checkbox",checked:e.includes(t.id),onChange:()=>{},disabled:!e.includes(t.id)&&e.length>=s})}),(0,n.jsxs)("div",{className:"document-info",children:[(0,n.jsxs)("div",{className:"document-header",children:[(0,n.jsx)("h4",{className:"document-title",children:t.title||t.filename}),(0,n.jsxs)("div",{className:"document-meta",children:[(0,n.jsx)("span",{className:"document-type",children:t.type.toUpperCase()}),(0,n.jsxs)("span",{className:"document-status",style:{color:N(t.status)},children:["● ",t.status]})]})]}),(0,n.jsxs)("div",{className:"document-details",children:[(0,n.jsx)("span",{className:"document-filename",children:t.filename}),(0,n.jsx)("span",{className:"document-size",children:b(t.size)}),t.chunkCount&&(0,n.jsxs)("span",{className:"document-chunks",children:[t.chunkCount," chunks"]})]}),(0,n.jsxs)("div",{className:"document-date",children:["Uploaded ",j(t.uploadedAt)]})]})]},t.id))}),(0,n.jsx)("style",{children:`
        .document-selector {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          max-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .selector-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .selection-count {
          font-size: 14px;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 4px 8px;
          border-radius: 12px;
        }

        .selector-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-bar {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          font-size: 14px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-controls label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .type-filter {
          padding: 6px 10px;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          border-radius: 4px;
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .documents-list {
          flex: 1;
          overflow-y: auto;
          border: 1px solid var(--border-color);
          border-radius: 6px;
        }

        .document-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .document-item:last-child {
          border-bottom: none;
        }

        .document-item:hover {
          background: var(--bg-secondary);
        }

        .document-item.selected {
          background: rgba(0, 123, 255, 0.1);
          border-left: 3px solid var(--accent);
        }

        .document-checkbox {
          margin-right: 15px;
          margin-top: 2px;
        }

        .document-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .document-info {
          flex: 1;
          min-width: 0;
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          gap: 10px;
        }

        .document-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .document-meta {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .document-type {
          background: var(--accent);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
        }

        .document-status {
          font-size: 12px;
          font-weight: 500;
        }

        .document-details {
          display: flex;
          gap: 15px;
          margin-bottom: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .document-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .no-documents {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .no-documents p {
          margin: 10px 0;
        }

        .loading {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .selector-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .selector-controls {
            flex-direction: column;
            gap: 10px;
          }

          .search-bar {
            min-width: auto;
          }

          .document-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .document-meta {
            width: 100%;
            justify-content: space-between;
          }

          .document-details {
            flex-direction: column;
            gap: 4px;
          }
        }
      `})]})});l.displayName="DocumentSelector";var d=l}),s("gC2yi",function(s,a){e(s.exports,"SkeletonText",()=>r),e(s.exports,"default",()=>o);var n=t("ayMG0");t("acw62");let i=({width:e="100%",height:t="1rem",className:s="",variant:a="text",animation:i="pulse"})=>{let r={text:"skeleton-text",rectangular:"skeleton-rectangular",circular:"skeleton-circular",avatar:"skeleton-avatar"},o={pulse:"skeleton-pulse",wave:"skeleton-wave"},c=["skeleton",r[a]||r.text,o[i]||o.pulse,s].filter(Boolean).join(" ");return(0,n.jsx)("div",{className:c,style:{width:e,height:t}})},r=({lines:e=1,width:t="100%",...s})=>(0,n.jsx)("div",{className:"skeleton-text-block",children:Array.from({length:e},(a,r)=>(0,n.jsx)(i,{width:r===e-1?"60%":t,height:"1rem",variant:"text",...s},r))});var o=i}),s("2zAJi",function(t,s){e(t.exports,"cachedFetch",()=>n);let a=new class{constructor(){this.cache=new Map,this.pendingRequests=new Map}generateKey(e,t={}){const s=`${t.method||"GET"}:${e}`;return t.body&&(s+=`:${JSON.stringify(t.body)}`),s}get(e,t={},s=3e5){let a=this.generateKey(e,t),n=this.cache.get(a);return n&&Date.now()-n.timestamp<s?n.data:(n&&this.cache.delete(a),null)}set(e,t={},s){let a=this.generateKey(e,t);if(this.cache.set(a,{data:s,timestamp:Date.now()}),this.cache.size>100){let e=this.cache.keys().next().value;this.cache.delete(e)}}clear(e=null,t={}){if(e){let s=this.generateKey(e,t);this.cache.delete(s)}else this.cache.clear()}async dedupedFetch(e,t={}){let s=this.generateKey(e,t);if(this.pendingRequests.has(s))return this.pendingRequests.get(s);let a=this.fetchWithCache(e,t);this.pendingRequests.set(s,a);try{return await a}finally{this.pendingRequests.delete(s)}}async fetchWithCache(e,t={},s={}){let a,{useCache:n=!0,maxAge:i=3e5,retries:r=3,retryDelay:o=1e3}=s,c=t.method||"GET";if(n&&"GET"===c){let s=this.get(e,t,i);if(s)return s}for(let s=0;s<=r;s++)try{let a=await fetch(e,t);if(!a.ok){if(a.status>=500&&s<r){await new Promise(e=>setTimeout(e,o*Math.pow(2,s)));continue}throw Error(`HTTP ${a.status}: ${a.statusText}`)}let i=await a.json();return n&&"GET"===c&&this.set(e,t,i),i}catch(e){if(a=e,e.message.includes("HTTP 4")||s===r)break;s<r&&await new Promise(e=>setTimeout(e,o*Math.pow(2,s)))}throw a}},n=(e,t={},s={})=>a.dedupedFetch(e,t,s)}),s("6feOA",function(s,a){e(s.exports,"default",()=>r);var n=t("ayMG0"),i=t("acw62"),r=({items:e,itemHeight:t=60,containerHeight:s=400,renderItem:a,overscan:r=5,className:o=""})=>{let[c,l]=(0,i.useState)(0),[d,m]=(0,i.useState)(s),p=(0,i.useRef)(null),x=(0,i.useCallback)(e=>{l(e.target.scrollTop)},[]),u=Math.max(0,Math.floor(c/t)-r),h=Math.min(e.length-1,Math.ceil((c+d)/t)+r),g=e.length*t,f=u*t,v=e.slice(u,h+1);return(0,i.useEffect)(()=>{let e=()=>{p.current&&m(p.current.clientHeight)};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]),(0,n.jsx)("div",{ref:p,className:`virtualized-list ${o}`,style:{height:s,overflowY:"auto",position:"relative"},onScroll:x,children:(0,n.jsx)("div",{style:{height:g,position:"relative"},children:(0,n.jsx)("div",{style:{transform:`translateY(${f}px)`,position:"absolute",top:0,left:0,right:0},children:v.map((e,s)=>(0,n.jsx)("div",{style:{height:t},children:a(e,u+s)},u+s))})})})}}),s("luNHW",function(s,a){e(s.exports,"default",()=>r);var n=t("ayMG0"),i=t("acw62"),r=({selectedDocuments:e,onBack:t})=>{let[s,a]=(0,i.useState)([]),[r,o]=(0,i.useState)(""),[c,l]=(0,i.useState)(!1),[d,m]=(0,i.useState)(null),p=(0,i.useRef)(null);(0,i.useEffect)(()=>{p.current?.scrollIntoView({behavior:"smooth"})},[s]);let x=async t=>{if(t.preventDefault(),!r.trim()||c)return;let s=r.trim();o("");let n={id:Date.now().toString(),type:"user",content:s,timestamp:new Date};a(e=>[...e,n]),l(!0),m(null);try{let t=await fetch("/api/qa/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:s,document_ids:e,max_results:5})});if(!t.ok)throw Error("Failed to get answer");let n=await t.json(),i={id:(Date.now()+1).toString(),type:"ai",content:n.answer,sources:n.sources||[],confidence:n.confidence,timestamp:new Date};a(e=>[...e,i])}catch(t){m(t.message),setTimeout(()=>{let t=`Based on the ${e.length} selected document(s), here's what I found regarding "${s}":

This is a placeholder response. In the full implementation, this would contain actual answers extracted from the uploaded documents using vector similarity search and LLM synthesis.

Key points from the documents:
\u{2022} Point 1 from document analysis
\u{2022} Point 2 with source citations
\u{2022} Point 3 with confidence scoring

Sources: ${e.join(", ")}`,n={id:(Date.now()+1).toString(),type:"ai",content:t,sources:e.map(e=>({id:e,relevance:.85})),confidence:.78,timestamp:new Date};a(e=>[...e,n]),m(null)},2e3)}finally{l(!1)}},u=e=>e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return(0,n.jsxs)("div",{className:"document-qa",children:[(0,n.jsxs)("div",{className:"qa-header",children:[(0,n.jsx)("button",{onClick:t,className:"back-button",children:"← Back to Document Selection"}),(0,n.jsxs)("div",{className:"qa-info",children:[(0,n.jsx)("h3",{children:"Document Q&A"}),(0,n.jsxs)("p",{children:["Ask questions about your ",e.length," selected document(s)"]})]})]}),(0,n.jsxs)("div",{className:"chat-container",children:[(0,n.jsx)("div",{className:"messages-area",children:0===s.length?c?(0,n.jsxs)("div",{className:"loading-messages",children:[(0,n.jsxs)("div",{className:"message ai-message",children:[(0,n.jsxs)("div",{className:"message-header",children:[(0,n.jsx)(Skeleton,{width:"120px",height:"1rem"}),(0,n.jsx)(Skeleton,{width:"80px",height:"1rem"})]}),(0,n.jsx)("div",{className:"message-content",children:(0,n.jsx)(SkeletonText,{lines:3,width:"100%"})})]}),(0,n.jsx)("div",{className:"message user-message",children:(0,n.jsx)("div",{className:"message-content",children:(0,n.jsx)(SkeletonText,{lines:2,width:"80%"})})})]}):(0,n.jsxs)("div",{className:"welcome-message",children:[(0,n.jsx)("div",{className:"welcome-icon",children:"📚"}),(0,n.jsx)("h4",{children:"Welcome to Document Q&A"}),(0,n.jsx)("p",{children:"Ask me anything about your uploaded documents. I'll search through the content and provide relevant answers with source citations."}),(0,n.jsxs)("div",{className:"example-questions",children:[(0,n.jsx)("p",{children:(0,n.jsx)("strong",{children:"Example questions:"})}),(0,n.jsxs)("ul",{children:[(0,n.jsx)("li",{children:'"What are the main findings in this research paper?"'}),(0,n.jsx)("li",{children:'"Summarize the key points from chapter 3"'}),(0,n.jsx)("li",{children:'"What does the document say about machine learning?"'})]})]})]}):(0,n.jsxs)(n.Fragment,{children:[s.map(e=>(0,n.jsx)("div",{children:"user"===e.type?(0,n.jsxs)("div",{className:"message user-message",children:[(0,n.jsx)("div",{className:"message-content",children:(0,n.jsx)("p",{children:e.content})}),(0,n.jsx)("div",{className:"message-meta",children:(0,n.jsx)("span",{className:"timestamp",children:u(e.timestamp)})})]}):(0,n.jsxs)("div",{className:"message ai-message",children:[(0,n.jsxs)("div",{className:"message-header",children:[(0,n.jsx)("div",{className:"ai-avatar",children:"🤖"}),(0,n.jsxs)("div",{className:"ai-info",children:[(0,n.jsx)("span",{className:"ai-name",children:"Document Assistant"}),e.confidence&&(0,n.jsxs)("span",{className:"confidence-score",children:["Confidence: ",(100*e.confidence).toFixed(0),"%"]})]})]}),(0,n.jsxs)("div",{className:"message-content",children:[(0,n.jsx)("div",{className:"answer-text",children:e.content.split("\n").map((e,t)=>(0,n.jsx)("p",{children:e},t))}),e.sources&&e.sources.length>0&&(0,n.jsxs)("div",{className:"sources-section",children:[(0,n.jsx)("h5",{children:"Sources:"}),(0,n.jsx)("div",{className:"sources-list",children:e.sources.map((e,t)=>(0,n.jsxs)("div",{className:"source-item",children:[(0,n.jsx)("span",{className:"source-id",children:e.id}),e.relevance&&(0,n.jsxs)("span",{className:"source-relevance",children:[(100*e.relevance).toFixed(0),"% relevant"]})]},t))})]})]}),(0,n.jsx)("div",{className:"message-meta",children:(0,n.jsx)("span",{className:"timestamp",children:u(e.timestamp)})})]})},e.id)),c&&(0,n.jsxs)("div",{className:"message ai-message loading",children:[(0,n.jsxs)("div",{className:"message-header",children:[(0,n.jsx)("div",{className:"ai-avatar",children:"🤖"}),(0,n.jsxs)("div",{className:"ai-info",children:[(0,n.jsx)("span",{className:"ai-name",children:"Document Assistant"}),(0,n.jsx)("span",{className:"loading-text",children:"Searching documents..."})]})]}),(0,n.jsx)("div",{className:"message-content",children:(0,n.jsx)("div",{className:"loading-indicator",children:(0,n.jsxs)("div",{className:"typing-dots",children:[(0,n.jsx)("span",{}),(0,n.jsx)("span",{}),(0,n.jsx)("span",{})]})})})]}),(0,n.jsx)("div",{ref:p})]})}),d&&(0,n.jsxs)("div",{className:"error-banner",children:[(0,n.jsx)("span",{className:"error-icon",children:"⚠️"}),(0,n.jsx)("span",{children:d}),(0,n.jsx)("button",{onClick:()=>m(null),className:"dismiss-error",children:"×"})]}),(0,n.jsxs)("form",{onSubmit:x,className:"query-form",children:[(0,n.jsxs)("div",{className:"query-input-container",children:[(0,n.jsx)("textarea",{value:r,onChange:e=>o(e.target.value),placeholder:"Ask a question about your documents...",className:"query-input",rows:1,disabled:c,onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),x(e))}}),(0,n.jsx)("button",{type:"submit",className:"submit-button",disabled:!r.trim()||c,children:c?(0,n.jsx)("div",{className:"spinner"}):(0,n.jsx)("span",{className:"send-icon",children:"➤"})})]}),(0,n.jsx)("div",{className:"query-help",children:"Press Enter to send, Shift+Enter for new line"})]})]}),(0,n.jsx)("style",{children:`
        .document-qa {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-primary);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px var(--shadow);
        }

        .qa-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .back-button {
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .back-button:hover {
          background: #0056b3;
        }

        .qa-info h3 {
          margin: 0 0 5px 0;
          color: var(--text-primary);
        }

        .qa-info p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .welcome-message {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .welcome-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .welcome-message h4 {
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .example-questions {
          margin-top: 20px;
          text-align: left;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .example-questions ul {
          margin: 10px 0 0 0;
          padding-left: 20px;
        }

        .example-questions li {
          margin: 5px 0;
          font-size: 14px;
        }

        .message {
          max-width: 80%;
          animation: fadeIn 0.3s ease-in;
        }

        .user-message {
          align-self: flex-end;
          background: var(--accent);
          color: white;
          border-radius: 18px 18px 4px 18px;
          margin-left: auto;
        }

        .ai-message {
          align-self: flex-start;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 18px 18px 18px 4px;
          color: var(--text-primary);
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .ai-avatar {
          width: 32px;
          height: 32px;
          background: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .ai-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ai-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .confidence-score {
          font-size: 12px;
          color: var(--success);
          font-weight: 500;
        }

        .loading-text {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .message-content {
          line-height: 1.6;
        }

        .user-message .message-content {
          padding: 12px 16px;
        }

        .ai-message .message-content {
          padding: 0;
        }

        .answer-text p {
          margin: 8px 0;
        }

        .answer-text p:first-child {
          margin-top: 0;
        }

        .answer-text p:last-child {
          margin-bottom: 0;
        }

        .sources-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .sources-section h5 {
          margin: 0 0 8px 0;
          color: var(--text-primary);
          font-size: 14px;
        }

        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .source-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          font-size: 13px;
        }

        .source-id {
          font-family: monospace;
          color: var(--accent);
        }

        .source-relevance {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .message-meta {
          margin-top: 8px;
          text-align: right;
        }

        .user-message .message-meta {
          text-align: right;
        }

        .ai-message .message-meta {
          text-align: left;
        }

        .timestamp {
          font-size: 11px;
          color: var(--text-muted);
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          padding: 20px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: var(--text-secondary);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(220, 53, 69, 0.1);
          border-top: 1px solid var(--error);
          color: var(--text-primary);
        }

        .dismiss-error {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: var(--error);
        }

        .query-form {
          border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
        }

        .query-input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 20px;
        }

        .query-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          background: var(--bg-primary);
          color: var(--text-primary);
          resize: none;
          min-height: 20px;
          max-height: 120px;
          overflow-y: auto;
        }

        .query-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .query-input:disabled {
          background: var(--bg-secondary);
          cursor: not-allowed;
        }

        .submit-button {
          padding: 12px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          height: 48px;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .submit-button:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
        }

        .send-icon {
          font-size: 18px;
          transform: rotate(0deg);
          transition: transform 0.2s ease;
        }

        .submit-button:not(:disabled) .send-icon {
          transform: rotate(0deg);
        }

        .query-help {
          padding: 0 20px 12px;
          font-size: 12px;
          color: var(--text-secondary);
          text-align: center;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typing {
          0%, 60%, 100% { opacity: 0.4; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .qa-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .messages-area {
            padding: 15px;
          }

          .message {
            max-width: 90%;
          }

          .query-input-container {
            padding: 15px;
            gap: 8px;
          }

          .query-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .submit-button {
            min-width: 44px;
            height: 44px;
          }
        }
      `})]})}});
//# sourceMappingURL=DocumentQATab.192acbcc.js.map
