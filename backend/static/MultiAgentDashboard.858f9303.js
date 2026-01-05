var e=globalThis.parcelRequire10c2;(0,e.register)("li4wa",function(a,r){Object.defineProperty(a.exports,"__esModule",{value:!0,configurable:!0}),Object.defineProperty(a.exports,"default",{get:()=>i,set:void 0,enumerable:!0,configurable:!0});var t=e("ayMG0"),s=e("acw62");let n=(s&&s.__esModule?s.default:s).memo(()=>{let[e,a]=(0,s.useState)([]),[r,n]=(0,s.useState)(!0),[i,l]=(0,s.useState)(null),[o,d]=(0,s.useState)(!0);(0,s.useEffect)(()=>{if(o){c();let e=setInterval(c,5e3);return()=>clearInterval(e)}},[o]);let c=async()=>{try{n(!0);let e=await fetch("/api/agents/status");if(!e.ok)throw Error("Failed to load agent status");let r=await e.json();a(r.agents||[]),l(null)}catch(e){l(e.message)}finally{n(!1)}},p=e=>{switch(e){case"working":return"#28a745";case"idle":default:return"#6c757d";case"error":return"#dc3545";case"completed":return"#007bff";case"terminated":return"#ffc107"}};return r&&0===e.length?(0,t.jsxs)("div",{className:"multi-agent-dashboard loading",children:[(0,t.jsx)("div",{className:"spinner"}),(0,t.jsx)("p",{children:"Loading agent status..."})]}):(0,t.jsxs)("div",{className:"multi-agent-dashboard",children:[(0,t.jsxs)("div",{className:"dashboard-header",children:[(0,t.jsx)("h3",{children:"Multi-Agent Dashboard"}),(0,t.jsxs)("div",{className:"dashboard-controls",children:[(0,t.jsxs)("label",{className:"auto-refresh",children:[(0,t.jsx)("input",{type:"checkbox",checked:o,onChange:e=>d(e.target.checked)}),"Auto-refresh"]}),(0,t.jsx)("button",{onClick:c,className:"refresh-button",children:"↻ Refresh"})]})]}),i&&(0,t.jsxs)("div",{className:"error-message",children:[(0,t.jsx)("span",{className:"error-icon",children:"⚠️"}),(0,t.jsx)("span",{children:i})]}),0===e.length?(0,t.jsxs)("div",{className:"no-agents",children:[(0,t.jsx)("p",{children:"No active agents found."}),(0,t.jsx)("p",{children:"Start a research session to see agent activity."})]}):(0,t.jsx)("div",{className:"agents-grid",children:e.map(e=>(0,t.jsxs)("div",{className:"agent-card",children:[(0,t.jsxs)("div",{className:"agent-header",children:[(0,t.jsx)("div",{className:"agent-icon",children:(e=>{switch(e){case"overseer":return"👑";case"researcher":return"🔍";case"analyst":return"📊";case"synthesizer":return"🧠";case"validator":return"✅";default:return"🤖"}})(e.role)}),(0,t.jsxs)("div",{className:"agent-info",children:[(0,t.jsx)("h4",{className:"agent-id",children:e.id}),(0,t.jsx)("span",{className:"agent-role",children:e.role})]}),(0,t.jsx)("div",{className:"status-indicator",style:{backgroundColor:p(e.status)},title:`Status: ${e.status}`})]}),(0,t.jsxs)("div",{className:"agent-details",children:[(0,t.jsxs)("div",{className:"detail-row",children:[(0,t.jsx)("span",{className:"label",children:"Model:"}),(0,t.jsx)("span",{className:"value",children:e.model})]}),(0,t.jsxs)("div",{className:"detail-row",children:[(0,t.jsx)("span",{className:"label",children:"Status:"}),(0,t.jsx)("span",{className:"value status-text",style:{color:p(e.status)},children:e.status})]}),e.current_task&&(0,t.jsxs)("div",{className:"detail-row",children:[(0,t.jsx)("span",{className:"label",children:"Task:"}),(0,t.jsx)("span",{className:"value",children:e.current_task})]}),(0,t.jsxs)("div",{className:"detail-row",children:[(0,t.jsx)("span",{className:"label",children:"Last Active:"}),(0,t.jsx)("span",{className:"value",children:(e=>{if(!e)return"Never";let a=new Date(e),r=Math.floor((new Date-a)/6e4);if(r<1)return"Just now";if(r<60)return`${r}m ago`;let t=Math.floor(r/60);return t<24?`${t}h ago`:a.toLocaleDateString()})(e.last_active)})]})]}),e.performance_metrics&&Object.keys(e.performance_metrics).length>0&&(0,t.jsxs)("div",{className:"performance-metrics",children:[(0,t.jsx)("h5",{children:"Performance"}),(0,t.jsx)("div",{className:"metrics-grid",children:Object.entries(e.performance_metrics).map(([e,a])=>(0,t.jsxs)("div",{className:"metric",children:[(0,t.jsxs)("span",{className:"metric-label",children:[e.replace(/_/g," "),":"]}),(0,t.jsx)("span",{className:"metric-value",children:"number"==typeof a&&a%1!=0?a.toFixed(2):a})]},e))})]})]},e.id))}),(0,t.jsx)("style",{children:`
        .multi-agent-dashboard {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .dashboard-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .dashboard-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .auto-refresh {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .auto-refresh input[type="checkbox"] {
          margin: 0;
        }

        .refresh-button {
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-button:hover {
          background: #0056b3;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          border-radius: 4px;
          color: var(--error);
          margin-bottom: 15px;
        }

        .no-agents {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .no-agents p {
          margin: 10px 0;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }

        .agent-card {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          background: var(--bg-secondary);
          transition: box-shadow 0.2s ease;
        }

        .agent-card:hover {
          box-shadow: 0 4px 12px var(--shadow);
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .agent-icon {
          font-size: 24px;
        }

        .agent-info {
          flex: 1;
        }

        .agent-id {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .agent-role {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: capitalize;
          background: var(--bg-tertiary);
          padding: 2px 6px;
          border-radius: 10px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .agent-details {
          margin-bottom: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .label {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-text {
          text-transform: capitalize;
        }

        .performance-metrics {
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
        }

        .performance-metrics h5 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: var(--text-primary);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .metric-label {
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .metric-value {
          font-weight: 600;
          color: var(--accent);
        }

        .loading {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid var(--bg-tertiary);
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
          .agents-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dashboard-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `})]})});n.displayName="MultiAgentDashboard";var i=n});
//# sourceMappingURL=MultiAgentDashboard.858f9303.js.map
