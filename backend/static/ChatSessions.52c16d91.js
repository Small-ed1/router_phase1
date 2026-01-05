function e(e,s,t,i){Object.defineProperty(e,s,{get:t,set:i,enumerable:!0,configurable:!0})}var s=globalThis.parcelRequire10c2,t=s.register;t("7nx9Q",function(t,i){Object.defineProperty(t.exports,"__esModule",{value:!0,configurable:!0}),e(t.exports,"default",()=>l);var a=s("ayMG0"),n=s("acw62"),r=s("gC2yi"),o=s("2zAJi");let c=(n&&n.__esModule?n.default:n).memo(({onSessionSelect:e,currentSessionId:s})=>{let[t,i]=(0,n.useState)([]),[c,l]=(0,n.useState)(!0),[d,h]=(0,n.useState)(null),[p,x]=(0,n.useState)(!1);(0,n.useEffect)(()=>{u()},[p]);let u=async()=>{try{l(!0);let e=await (0,o.cachedFetch)("/api/chats");i(e||[]),h(null)}catch(e){h(e.message)}finally{l(!1)}},m=async()=>{try{let s=await fetch("/api/chats",{method:"POST"});if(!s.ok)throw Error("Failed to create session");let t=await s.json();e&&e(t.id),await u()}catch(e){h(`Failed to create session: ${e.message}`)}},g=async e=>{if(confirm("Are you sure you want to archive this session?"))try{if(!(await fetch(`/api/chats/${e}/archive`,{method:"POST"})).ok)throw Error("Failed to archive session");await u()}catch(e){h(`Failed to archive session: ${e.message}`)}},f=async e=>{if(confirm("Are you sure you want to permanently delete this session? This action cannot be undone."))try{if(!(await fetch(`/api/chats/${e}`,{method:"DELETE"})).ok)throw Error("Failed to delete session");await u()}catch(e){h(`Failed to delete session: ${e.message}`)}},w=t.filter(e=>p||!e.archived);return c?(0,a.jsxs)("div",{className:"chat-sessions",children:[(0,a.jsxs)("div",{className:"sessions-header",children:[(0,a.jsx)(r.default,{width:"150px",height:"1.2rem"}),(0,a.jsxs)("div",{className:"header-actions",children:[(0,a.jsx)(r.default,{width:"100px",height:"2rem"}),(0,a.jsx)(r.default,{width:"100px",height:"2rem"})]})]}),(0,a.jsx)("div",{className:"sessions-list",children:Array.from({length:3},(e,s)=>(0,a.jsx)("div",{className:"session-item",children:(0,a.jsxs)("div",{className:"document-info",children:[(0,a.jsxs)("div",{className:"session-title-row",children:[(0,a.jsx)(r.default,{width:"80%",height:"1rem"}),(0,a.jsxs)("div",{className:"session-actions",children:[(0,a.jsx)(r.default,{width:"24px",height:"24px",variant:"circular"}),(0,a.jsx)(r.default,{width:"24px",height:"24px",variant:"circular"})]})]}),(0,a.jsx)(r.SkeletonText,{lines:2,width:"100%"}),(0,a.jsx)("div",{className:"session-meta",children:(0,a.jsx)(r.default,{width:"60px",height:"0.8rem"})})]})},s))})]}):(0,a.jsxs)("div",{className:"chat-sessions",children:[(0,a.jsxs)("div",{className:"sessions-header",children:[(0,a.jsx)("h3",{children:"Chat Sessions"}),(0,a.jsxs)("div",{className:"header-actions",children:[(0,a.jsxs)("label",{className:"archive-toggle",children:[(0,a.jsx)("input",{type:"checkbox",checked:p,onChange:e=>x(e.target.checked)}),"Show archived"]}),(0,a.jsx)("button",{onClick:m,className:"new-session-button",children:"+ New Chat"})]})]}),d&&(0,a.jsxs)("div",{className:"error-message",children:[(0,a.jsx)("span",{className:"error-icon",children:"⚠️"}),(0,a.jsx)("span",{children:d}),(0,a.jsx)("button",{onClick:()=>h(null),className:"dismiss-error",children:"×"})]}),0===w.length?(0,a.jsxs)("div",{className:"no-sessions",children:[(0,a.jsx)("p",{children:p?"No archived sessions found.":"No chat sessions found."}),(0,a.jsx)("p",{children:"Start a new conversation to see it here."})]}):(0,a.jsx)("div",{className:"sessions-list",children:w.map(t=>(0,a.jsx)("div",{className:`session-item ${t.id===s?"active":""} ${t.archived?"archived":""}`,onClick:()=>e&&e(t.id),children:(0,a.jsxs)("div",{className:"session-content",children:[(0,a.jsxs)("div",{className:"session-title-row",children:[(0,a.jsx)("h4",{className:"session-title",children:t.title||"Untitled Chat"}),(0,a.jsxs)("div",{className:"session-actions",children:[!t.archived&&(0,a.jsx)("button",{onClick:e=>{e.stopPropagation(),g(t.id)},className:"archive-button",title:"Archive session",children:"📁"}),(0,a.jsx)("button",{onClick:e=>{e.stopPropagation(),f(t.id)},className:"delete-button",title:"Delete session",children:"🗑️"})]})]}),(0,a.jsx)("p",{className:"session-preview",children:(e=>{if(e.summary)return e.summary;if(e.messages&&e.messages.length>0){let s=e.messages[e.messages.length-1];return s.content?s.content.substring(0,100)+"...":"Empty message"}return"New conversation"})(t)}),(0,a.jsxs)("div",{className:"session-meta",children:[(0,a.jsx)("span",{className:"session-date",children:(e=>{if(!e)return"Unknown";let s=new Date(e),t=(new Date-s)/36e5;return t<24?s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):t<168?s.toLocaleDateString([],{weekday:"short",hour:"2-digit",minute:"2-digit"}):s.toLocaleDateString()})(t.created_at)}),t.archived&&(0,a.jsx)("span",{className:"archived-badge",children:"Archived"})]})]})},t.id))}),(0,a.jsx)("style",{children:`
        .chat-sessions {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .sessions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .sessions-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .archive-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .archive-toggle input[type="checkbox"] {
          margin: 0;
        }

        .new-session-button {
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .new-session-button:hover {
          background: #0056b3;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          color: #721c24;
          margin-bottom: 15px;
        }

        .dismiss-error {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #721c24;
        }

        .no-sessions {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-sessions p {
          margin: 10px 0;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .session-item {
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f8f9fa;
        }

        .session-item:hover {
          box-shadow: 0 2px 8px var(--shadow);
        }

        .session-item.selected {
          border-color: var(--accent);
        }

        .session-item.active {
          border-color: #007bff;
          background: #e7f3ff;
        }

        .session-item.archived {
          opacity: 0.7;
          border-style: dashed;
        }

        .session-content {
          width: 100%;
        }

        .session-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .session-title {
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .session-actions {
          display: flex;
          gap: 5px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .session-item:hover .session-actions {
          opacity: 1;
        }

        .archive-button,
        .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 3px;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .archive-button:hover {
          background: #e9ecef;
        }

        .delete-button:hover {
          background: #f8d7da;
        }

        .session-preview {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .session-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .session-date {
          color: #999;
        }

        .archived-badge {
          background: #ffc107;
          color: #856404;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 500;
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
          .sessions-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .session-title-row {
            flex-direction: column;
            gap: 10px;
          }

          .session-actions {
            opacity: 1;
            justify-content: flex-end;
          }

          .session-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `})]})});c.displayName="ChatSessions";var l=c}),t("gC2yi",function(t,i){e(t.exports,"SkeletonText",()=>r),e(t.exports,"default",()=>o);var a=s("ayMG0");s("acw62");let n=({width:e="100%",height:s="1rem",className:t="",variant:i="text",animation:n="pulse"})=>{let r={text:"skeleton-text",rectangular:"skeleton-rectangular",circular:"skeleton-circular",avatar:"skeleton-avatar"},o={pulse:"skeleton-pulse",wave:"skeleton-wave"},c=["skeleton",r[i]||r.text,o[n]||o.pulse,t].filter(Boolean).join(" ");return(0,a.jsx)("div",{className:c,style:{width:e,height:s}})},r=({lines:e=1,width:s="100%",...t})=>(0,a.jsx)("div",{className:"skeleton-text-block",children:Array.from({length:e},(i,r)=>(0,a.jsx)(n,{width:r===e-1?"60%":s,height:"1rem",variant:"text",...t},r))});var o=n}),t("2zAJi",function(s,t){e(s.exports,"cachedFetch",()=>a);let i=new class{constructor(){this.cache=new Map,this.pendingRequests=new Map}generateKey(e,s={}){const t=`${s.method||"GET"}:${e}`;return s.body&&(t+=`:${JSON.stringify(s.body)}`),t}get(e,s={},t=3e5){let i=this.generateKey(e,s),a=this.cache.get(i);return a&&Date.now()-a.timestamp<t?a.data:(a&&this.cache.delete(i),null)}set(e,s={},t){let i=this.generateKey(e,s);if(this.cache.set(i,{data:t,timestamp:Date.now()}),this.cache.size>100){let e=this.cache.keys().next().value;this.cache.delete(e)}}clear(e=null,s={}){if(e){let t=this.generateKey(e,s);this.cache.delete(t)}else this.cache.clear()}async dedupedFetch(e,s={}){let t=this.generateKey(e,s);if(this.pendingRequests.has(t))return this.pendingRequests.get(t);let i=this.fetchWithCache(e,s);this.pendingRequests.set(t,i);try{return await i}finally{this.pendingRequests.delete(t)}}async fetchWithCache(e,s={},t={}){let i,{useCache:a=!0,maxAge:n=3e5,retries:r=3,retryDelay:o=1e3}=t,c=s.method||"GET";if(a&&"GET"===c){let t=this.get(e,s,n);if(t)return t}for(let t=0;t<=r;t++)try{let i=await fetch(e,s);if(!i.ok){if(i.status>=500&&t<r){await new Promise(e=>setTimeout(e,o*Math.pow(2,t)));continue}throw Error(`HTTP ${i.status}: ${i.statusText}`)}let n=await i.json();return a&&"GET"===c&&this.set(e,s,n),n}catch(e){if(i=e,e.message.includes("HTTP 4")||t===r)break;t<r&&await new Promise(e=>setTimeout(e,o*Math.pow(2,t)))}throw i}},a=(e,s={},t={})=>i.dedupedFetch(e,s,t)});
//# sourceMappingURL=ChatSessions.52c16d91.js.map
