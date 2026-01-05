function e(e,t,a,s){Object.defineProperty(e,t,{get:a,set:s,enumerable:!0,configurable:!0})}var t=globalThis.parcelRequire10c2,a=t.register;a("3ayU3",function(a,s){Object.defineProperty(a.exports,"__esModule",{value:!0,configurable:!0}),e(a.exports,"default",()=>c);var i=t("ayMG0"),r=t("acw62"),o=t("2zAJi");let n=(r&&r.__esModule?r.default:r).memo(({isOpen:e,onToggle:t,activeMode:a,onModeChange:s,currentChatSessionId:n,onChatSessionSelect:c,selectedModel:d,onModelChange:l,onSettingsClick:h})=>{let[p,x]=(0,r.useState)([]),[b,m]=(0,r.useState)([]),[u,g]=(0,r.useState)(!1);(0,r.useEffect)(()=>{e&&(v(),f())},[e,u]);let v=async()=>{try{let e=await (0,o.cachedFetch)("/api/chats");x(e||[])}catch(e){console.error("Failed to load sessions:",e)}},f=async()=>{try{let e=await (0,o.cachedFetch)("/api/models");m(e.items||[])}catch(e){console.error("Failed to load models:",e)}},y=async()=>{try{let e=await fetch("/api/chats",{method:"POST"});if(e.ok){let t=await e.json();c(t.id),await v()}}catch(e){console.error("Failed to create session:",e)}};return(0,i.jsxs)(i.Fragment,{children:[e&&(0,i.jsx)("div",{className:"sidebar-overlay",onClick:t}),(0,i.jsxs)("div",{className:`main-sidebar ${e?"open":""}`,children:[(0,i.jsx)("div",{className:"sidebar-header",children:(0,i.jsxs)("div",{className:"sidebar-title",children:[(0,i.jsx)("h2",{children:"Router Phase 1"}),(0,i.jsx)("button",{className:"sidebar-close",onClick:t,"aria-label":"Close sidebar",children:"✕"})]})}),(0,i.jsxs)("div",{className:"sidebar-content",children:[(0,i.jsxs)("div",{className:"sidebar-section",children:[(0,i.jsx)("h3",{children:"Current Model"}),(0,i.jsxs)("select",{value:d||"",onChange:e=>l(e.target.value),className:"model-select",children:[(0,i.jsx)("option",{value:"",children:"Select Model..."}),b.map(e=>(0,i.jsx)("option",{value:e,children:e},e))]})]}),(0,i.jsxs)("div",{className:"sidebar-section",children:[(0,i.jsx)("h3",{children:"Modes"}),(0,i.jsx)("div",{className:"mode-buttons",children:[{id:"home",label:"Home",icon:"🏠"},{id:"chat",label:"Chat",icon:"💬"},{id:"research",label:"Deep Research",icon:"🔬"},{id:"qa",label:"Documents",icon:"📚"},{id:"dashboard",label:"Dashboard",icon:"📊"}].map(e=>(0,i.jsxs)("button",{className:`mode-button ${a===e.id?"active":""}`,onClick:()=>s(e.id),children:[(0,i.jsx)("span",{className:"mode-icon",children:e.icon}),(0,i.jsx)("span",{className:"mode-label",children:e.label})]},e.id))})]}),(0,i.jsxs)("div",{className:"sidebar-section",children:[(0,i.jsxs)("div",{className:"section-header",children:[(0,i.jsx)("h3",{children:"Chat Sessions"}),(0,i.jsx)("button",{className:"new-session-btn",onClick:y,title:"New Chat",children:"+"})]}),(0,i.jsx)("div",{className:"archive-toggle",children:(0,i.jsxs)("label",{children:[(0,i.jsx)("input",{type:"checkbox",checked:u,onChange:e=>g(e.target.checked)}),"Show archived"]})}),(0,i.jsx)("div",{className:"sessions-list",children:p.filter(e=>u||!e.archived).map(e=>(0,i.jsxs)("div",{className:`session-item ${n===e.id?"active":""}`,onClick:()=>c(e.id),children:[(0,i.jsx)("div",{className:"session-title",children:e.title||"Untitled Chat"}),(0,i.jsx)("div",{className:"session-date",children:new Date(e.created_at).toLocaleDateString()}),e.archived&&(0,i.jsx)("div",{className:"session-archived",children:"Archived"})]},e.id))})]}),(0,i.jsx)("div",{className:"sidebar-section",children:(0,i.jsx)("button",{className:"settings-button",onClick:h,children:"⚙️ Settings"})})]})]}),(0,i.jsx)("style",{children:`
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block;
          }
        }

        .main-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 320px;
          height: 100vh;
          background: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          box-shadow: 2px 0 10px var(--shadow);
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .main-sidebar.open {
          transform: translateX(0);
        }

        @media (min-width: 769px) {
          .main-sidebar {
            position: relative;
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: none !important;
          }
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .sidebar-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-title h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 600;
        }

        .sidebar-close {
          background: none;
          border: none;
          font-size: 20px;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .sidebar-close:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        @media (min-width: 769px) {
          .sidebar-close {
            display: none;
          }
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-section h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .model-select {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
        }

        .model-select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .mode-buttons {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mode-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .mode-button:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .mode-button.active {
          background: var(--accent);
          color: white;
        }

        .mode-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .new-session-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .new-session-btn:hover {
          background: #0056b3;
          transform: scale(1.1);
        }

        .archive-toggle {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .archive-toggle input[type="checkbox"] {
          margin-right: 6px;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 300px;
          overflow-y: auto;
        }

        .session-item {
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .session-item:hover {
          background: var(--bg-tertiary);
        }

        .session-item.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .session-title {
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .session-date {
          font-size: 12px;
          opacity: 0.7;
        }

        .session-archived {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          margin-top: 4px;
          display: inline-block;
        }

        .settings-button {
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .settings-button:hover {
          background: var(--bg-secondary);
          border-color: var(--accent);
        }
      `})]})});n.displayName="MainSidebar";var c=n}),a("2zAJi",function(t,a){e(t.exports,"cachedFetch",()=>i);let s=new class{constructor(){this.cache=new Map,this.pendingRequests=new Map}generateKey(e,t={}){const a=`${t.method||"GET"}:${e}`;return t.body&&(a+=`:${JSON.stringify(t.body)}`),a}get(e,t={},a=3e5){let s=this.generateKey(e,t),i=this.cache.get(s);return i&&Date.now()-i.timestamp<a?i.data:(i&&this.cache.delete(s),null)}set(e,t={},a){let s=this.generateKey(e,t);if(this.cache.set(s,{data:a,timestamp:Date.now()}),this.cache.size>100){let e=this.cache.keys().next().value;this.cache.delete(e)}}clear(e=null,t={}){if(e){let a=this.generateKey(e,t);this.cache.delete(a)}else this.cache.clear()}async dedupedFetch(e,t={}){let a=this.generateKey(e,t);if(this.pendingRequests.has(a))return this.pendingRequests.get(a);let s=this.fetchWithCache(e,t);this.pendingRequests.set(a,s);try{return await s}finally{this.pendingRequests.delete(a)}}async fetchWithCache(e,t={},a={}){let s,{useCache:i=!0,maxAge:r=3e5,retries:o=3,retryDelay:n=1e3}=a,c=t.method||"GET";if(i&&"GET"===c){let a=this.get(e,t,r);if(a)return a}for(let a=0;a<=o;a++)try{let s=await fetch(e,t);if(!s.ok){if(s.status>=500&&a<o){await new Promise(e=>setTimeout(e,n*Math.pow(2,a)));continue}throw Error(`HTTP ${s.status}: ${s.statusText}`)}let r=await s.json();return i&&"GET"===c&&this.set(e,t,r),r}catch(e){if(s=e,e.message.includes("HTTP 4")||a===o)break;a<o&&await new Promise(e=>setTimeout(e,n*Math.pow(2,a)))}throw s}},i=(e,t={},a={})=>s.dedupedFetch(e,t,a)});
//# sourceMappingURL=MainSidebar.0b0e40fe.js.map
