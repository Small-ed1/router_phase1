function e(e,t,s,a){Object.defineProperty(e,t,{get:s,set:a,enumerable:!0,configurable:!0})}var t=globalThis.parcelRequire10c2,s=t.register;s("gKJEP",function(s,a){Object.defineProperty(s.exports,"__esModule",{value:!0,configurable:!0}),e(s.exports,"default",()=>o);var i=t("ayMG0"),r=t("acw62"),n=t("gC2yi");let l=(r&&r.__esModule?r.default:r).memo(({onSettingsChange:e})=>{let[t,s]=(0,r.useState)({}),[a,l]=(0,r.useState)([]),[o,c]=(0,r.useState)(!0),[d,h]=(0,r.useState)(!1),[x,p]=(0,r.useState)(null),[g,m]=(0,r.useState)(!1);(0,r.useEffect)(()=>{u(),v()},[]);let u=async()=>{try{let e=await fetch("/api/settings");if(e.ok){let t=await e.json();s(t)}}catch(e){console.error("Failed to load settings:",e)}},v=async()=>{try{let e=await fetch("/api/models");if(e.ok){let t=await e.json();l(t.items||[])}}catch(e){console.error("Failed to load models:",e)}finally{c(!1)}},j=(a,i)=>{let r={...t,[a]:i};s(r),e&&e(r)},b=async()=>{h(!0),p(null),m(!1);try{if((await fetch("/api/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).ok)m(!0),setTimeout(()=>m(!1),3e3);else throw Error("Failed to save settings")}catch(e){p(e.message)}finally{h(!1)}};return o?(0,i.jsxs)("div",{className:"settings-panel",children:[(0,i.jsxs)("div",{className:"panel-header",children:[(0,i.jsx)(n.default,{width:"150px",height:"1.5rem"}),(0,i.jsx)(n.default,{width:"120px",height:"2.5rem",className:"skeleton-button"})]}),(0,i.jsxs)("div",{className:"settings-sections",children:[(0,i.jsxs)("div",{className:"settings-section",children:[(0,i.jsx)(n.default,{width:"200px",height:"1.2rem",className:"skeleton-section-title"}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)(n.default,{width:"120px",height:"1rem"}),(0,i.jsx)(n.default,{width:"100%",height:"2.5rem"})]}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)(n.default,{width:"100px",height:"1rem"}),(0,i.jsx)(n.default,{width:"150px",height:"2.5rem"})]})]}),(0,i.jsxs)("div",{className:"settings-section",children:[(0,i.jsx)(n.default,{width:"150px",height:"1.2rem",className:"skeleton-section-title"}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)(n.default,{width:"80px",height:"1rem"}),(0,i.jsx)(n.default,{width:"120px",height:"2.5rem"})]}),(0,i.jsx)("div",{className:"setting-group checkbox",children:(0,i.jsx)(n.default,{width:"150px",height:"1rem"})})]})]})]}):(0,i.jsxs)("div",{className:"settings-panel",children:[(0,i.jsxs)("div",{className:"panel-header",children:[(0,i.jsx)("h3",{children:"Settings"}),(0,i.jsx)("button",{onClick:b,disabled:d,className:"save-button",children:d?"Saving...":"Save Settings"})]}),x&&(0,i.jsxs)("div",{className:"error-message",children:[(0,i.jsx)("span",{className:"error-icon",children:"⚠️"}),(0,i.jsx)("span",{children:x})]}),g&&(0,i.jsxs)("div",{className:"success-message",children:[(0,i.jsx)("span",{className:"success-icon",children:"✅"}),(0,i.jsx)("span",{children:"Settings saved successfully!"})]}),(0,i.jsxs)("div",{className:"settings-sections",children:[(0,i.jsxs)("div",{className:"settings-section",children:[(0,i.jsx)("h4",{children:"Model Configuration"}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"defaultModel",children:"Default Model"}),(0,i.jsxs)("select",{id:"defaultModel",value:t.defaultModel||"",onChange:e=>j("defaultModel",e.target.value),children:[(0,i.jsx)("option",{value:"",children:"Auto-select"}),a.map(e=>(0,i.jsx)("option",{value:e,children:e},e))]})]}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"temperature",children:"Temperature"}),(0,i.jsxs)("div",{className:"slider-group",children:[(0,i.jsx)("input",{type:"range",id:"temperature",min:"0",max:"2",step:"0.1",value:t.temperature||.7,onChange:e=>j("temperature",parseFloat(e.target.value))}),(0,i.jsx)("span",{className:"slider-value",children:t.temperature||.7})]}),(0,i.jsx)("small",{children:"Controls randomness: 0 = deterministic, 2 = very random"})]}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"contextTokens",children:"Context Window (tokens)"}),(0,i.jsx)("input",{type:"number",id:"contextTokens",min:"1000",max:"32768",value:t.contextTokens||8e3,onChange:e=>j("contextTokens",parseInt(e.target.value))})]})]}),(0,i.jsxs)("div",{className:"settings-section",children:[(0,i.jsx)("h4",{children:"Interface"}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"theme",children:"Theme"}),(0,i.jsxs)("select",{id:"theme",value:t.theme||"dark",onChange:e=>j("theme",e.target.value),children:[(0,i.jsx)("option",{value:"light",children:"Light"}),(0,i.jsx)("option",{value:"dark",children:"Dark"})]})]}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"fontSize",children:"Font Size"}),(0,i.jsxs)("select",{id:"fontSize",value:t.fontSize||"medium",onChange:e=>j("fontSize",e.target.value),children:[(0,i.jsx)("option",{value:"small",children:"Small"}),(0,i.jsx)("option",{value:"medium",children:"Medium"}),(0,i.jsx)("option",{value:"large",children:"Large"})]})]}),(0,i.jsx)("div",{className:"setting-group checkbox",children:(0,i.jsxs)("label",{children:[(0,i.jsx)("input",{type:"checkbox",checked:!1!==t.animations,onChange:e=>j("animations",e.target.checked)}),"Enable animations"]})}),(0,i.jsx)("div",{className:"setting-group checkbox",children:(0,i.jsxs)("label",{children:[(0,i.jsx)("input",{type:"checkbox",checked:t.showArchived||!1,onChange:e=>j("showArchived",e.target.checked)}),"Show archived chats"]})})]}),(0,i.jsxs)("div",{className:"settings-section",children:[(0,i.jsx)("h4",{children:"Research"}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"researchDepth",children:"Default Research Depth"}),(0,i.jsxs)("select",{id:"researchDepth",value:t.researchDepth||"standard",onChange:e=>j("researchDepth",e.target.value),children:[(0,i.jsx)("option",{value:"quick",children:"Quick (Fast results, basic analysis)"}),(0,i.jsx)("option",{value:"standard",children:"Standard (Balanced depth and speed)"}),(0,i.jsx)("option",{value:"deep",children:"Deep (Comprehensive analysis, slower)"})]})]}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"maxToolCalls",children:"Max Tool Calls per Session"}),(0,i.jsx)("input",{type:"number",id:"maxToolCalls",min:"1",max:"50",value:t.maxToolCalls||10,onChange:e=>j("maxToolCalls",parseInt(e.target.value))})]})]}),(0,i.jsxs)("div",{className:"settings-section",children:[(0,i.jsx)("h4",{children:"Advanced"}),(0,i.jsx)("div",{className:"setting-group checkbox",children:(0,i.jsxs)("label",{children:[(0,i.jsx)("input",{type:"checkbox",checked:!1!==t.enableStreaming,onChange:e=>j("enableStreaming",e.target.checked)}),"Enable streaming responses"]})}),(0,i.jsx)("div",{className:"setting-group checkbox",children:(0,i.jsxs)("label",{children:[(0,i.jsx)("input",{type:"checkbox",checked:t.autoModelSwitch||!1,onChange:e=>j("autoModelSwitch",e.target.checked)}),"Auto-switch models based on task"]})}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"citationFormat",children:"Citation Format"}),(0,i.jsxs)("select",{id:"citationFormat",value:t.citationFormat||"inline",onChange:e=>j("citationFormat",e.target.value),children:[(0,i.jsx)("option",{value:"inline",children:"Inline citations"}),(0,i.jsx)("option",{value:"footnotes",children:"Footnotes"}),(0,i.jsx)("option",{value:"endnotes",children:"Endnotes"})]})]}),(0,i.jsx)("div",{className:"setting-group checkbox",children:(0,i.jsxs)("label",{children:[(0,i.jsx)("input",{type:"checkbox",checked:t.debugMode||!1,onChange:e=>j("debugMode",e.target.checked)}),"Enable debug mode"]})}),(0,i.jsxs)("div",{className:"setting-group",children:[(0,i.jsx)("label",{htmlFor:"memoryLimit",children:"Memory Limit (GB)"}),(0,i.jsx)("input",{type:"number",id:"memoryLimit",min:"1",max:"32",value:t.memoryLimit||10,onChange:e=>j("memoryLimit",parseInt(e.target.value))})]})]})]}),(0,i.jsx)("style",{children:`
        .settings-panel {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          max-width: 800px;
          margin: 20px auto;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .panel-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .save-button {
          padding: 10px 20px;
          background: var(--success);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .save-button:hover:not(:disabled) {
          background: #218838;
        }

        .save-button:disabled {
          background: var(--text-secondary);
          cursor: not-allowed;
        }

        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          color: var(--text-primary);
        }

        .success-message {
          background: rgba(40, 167, 69, 0.1);
          border: 1px solid var(--success);
          color: var(--text-primary);
        }

        .settings-sections {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .settings-section h4 {
          margin: 0 0 15px 0;
          color: var(--text-primary);
          font-size: 18px;
          border-bottom: 2px solid var(--accent);
          padding-bottom: 5px;
        }

        .setting-group {
          margin-bottom: 15px;
        }

        .setting-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .setting-group input,
        .setting-group select {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .setting-group input:focus,
        .setting-group select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .slider-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .slider-group input[type="range"] {
          flex: 1;
        }

        .slider-value {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: var(--accent);
        }

        .setting-group small {
          display: block;
          margin-top: 3px;
          color: var(--text-muted);
          font-size: 12px;
        }

        .checkbox label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: normal;
        }

        .checkbox input[type="checkbox"] {
          width: auto;
          margin: 0;
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
          .settings-panel {
            margin: 10px;
            padding: 15px;
          }

          .panel-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .slider-group {
            flex-direction: column;
            align-items: stretch;
          }

          .settings-sections {
            gap: 20px;
          }
        }
      `})]})});l.displayName="SettingsPanel";var o=l}),s("gC2yi",function(s,a){e(s.exports,"SkeletonText",()=>n),e(s.exports,"default",()=>l);var i=t("ayMG0");t("acw62");let r=({width:e="100%",height:t="1rem",className:s="",variant:a="text",animation:r="pulse"})=>{let n={text:"skeleton-text",rectangular:"skeleton-rectangular",circular:"skeleton-circular",avatar:"skeleton-avatar"},l={pulse:"skeleton-pulse",wave:"skeleton-wave"},o=["skeleton",n[a]||n.text,l[r]||l.pulse,s].filter(Boolean).join(" ");return(0,i.jsx)("div",{className:o,style:{width:e,height:t}})},n=({lines:e=1,width:t="100%",...s})=>(0,i.jsx)("div",{className:"skeleton-text-block",children:Array.from({length:e},(a,n)=>(0,i.jsx)(r,{width:n===e-1?"60%":t,height:"1rem",variant:"text",...s},n))});var l=r});
//# sourceMappingURL=SettingsPanel.75495363.js.map
