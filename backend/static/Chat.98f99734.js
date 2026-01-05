function e(e,a,t,s){Object.defineProperty(e,a,{get:t,set:s,enumerable:!0,configurable:!0})}var a=globalThis.parcelRequire10c2,t=a.register;t("g3Ulu",function(t,s){Object.defineProperty(t.exports,"__esModule",{value:!0,configurable:!0}),e(t.exports,"default",()=>c);var r=a("ayMG0"),n=a("acw62"),i=a("kqWnA"),l=a("gC2yi"),c=({sessionId:e,onBack:a,onToggleResearch:t})=>{let[s,c]=(0,n.useState)([]),[o,p]=(0,n.useState)(""),[d,x]=(0,n.useState)(!1),[m,g]=(0,n.useState)(null),[h,u]=(0,n.useState)(!1),v=(0,n.useRef)(null),w=(0,n.useRef)(null);(0,n.useEffect)(()=>{f()},[e]),(0,n.useEffect)(()=>{b()},[s]);let f=async()=>{if(e)try{x(!0);let a=await fetch(`/api/chats/${e}`);if(a.ok){let e=await a.json();c(e.messages||[]),g(null)}else g("Failed to load chat session")}catch(e){g(`Error loading chat: ${e.message}`)}finally{x(!1)}},b=()=>{v.current?.scrollIntoView({behavior:"smooth"})},y=e=>new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),j=async()=>{if(!o.trim()||d)return;let e={id:Date.now(),type:"user",content:o.trim(),timestamp:new Date};c(a=>[...a,e]),p(""),x(!0),g(null);try{setTimeout(()=>{let a={id:Date.now()+1,type:"ai",content:`This is a simulated response to: "${e.content}"

**Features to implement:**
- Real chat API integration
- Model selection
- Context management
- Rich text formatting

\`Code example:\`
\`\`\`
console.log('Hello, World!');
\`\`\``,timestamp:new Date};c(e=>[...e,a]),x(!1)},2e3)}catch(e){g(`Failed to send message: ${e.message}`),x(!1)}};return(0,r.jsxs)("div",{className:"chat-interface",children:[(0,r.jsxs)("div",{className:"chat-header",children:[(0,r.jsx)("button",{onClick:a,className:"back-button",children:"← Back to Sessions"}),(0,r.jsxs)("div",{className:"chat-info",children:[(0,r.jsx)("h3",{children:"Chat Session"}),(0,r.jsxs)("p",{children:["Session ID: ",e]})]}),(0,r.jsx)("div",{className:"chat-controls",children:(0,r.jsxs)("label",{className:"research-toggle",children:[(0,r.jsx)("input",{type:"checkbox",checked:h,onChange:e=>u(e.target.checked)}),(0,r.jsx)("span",{className:"toggle-label",children:"Deep Research Mode"})]})})]}),(0,r.jsxs)("div",{className:"chat-container",children:[(0,r.jsx)("div",{className:"messages-area",children:0!==s.length||d?(0,r.jsxs)(r.Fragment,{children:[s.map(e=>(0,r.jsx)("div",{children:"user"===e.type?(0,r.jsxs)("div",{className:"message user-message",children:[(0,r.jsx)("div",{className:"message-content",children:(0,r.jsx)("p",{children:e.content})}),(0,r.jsx)("div",{className:"message-meta",children:(0,r.jsx)("span",{className:"timestamp",children:y(e.timestamp)})})]}):(0,r.jsxs)("div",{className:"message ai-message",children:[(0,r.jsxs)("div",{className:"message-header",children:[(0,r.jsx)("div",{className:"ai-avatar",children:"🤖"}),(0,r.jsx)("div",{className:"ai-info",children:(0,r.jsx)("span",{className:"ai-name",children:"AI Assistant"})})]}),(0,r.jsx)("div",{className:"message-content",children:(0,r.jsx)("div",{className:"answer-text",children:(0,r.jsx)(i.default,{content:e.content})})}),(0,r.jsx)("div",{className:"message-meta",children:(0,r.jsx)("span",{className:"timestamp",children:y(e.timestamp)})})]})},e.id)),d&&(0,r.jsxs)("div",{className:"message ai-message",children:[(0,r.jsxs)("div",{className:"message-header",children:[(0,r.jsx)("div",{className:"ai-avatar",children:"🤖"}),(0,r.jsx)("div",{className:"ai-info",children:(0,r.jsx)("span",{className:"ai-name",children:"AI Assistant"})})]}),(0,r.jsx)("div",{className:"message-content",children:(0,r.jsxs)("div",{className:"loading-indicator",children:[(0,r.jsx)(l.default,{width:"100%",height:"1rem"}),(0,r.jsx)(l.default,{width:"80%",height:"1rem"}),(0,r.jsx)(l.default,{width:"60%",height:"1rem"})]})})]}),m&&(0,r.jsx)("div",{className:"error-message",children:(0,r.jsxs)("span",{children:["⚠️ ",m]})}),(0,r.jsx)("div",{ref:v})]}):(0,r.jsxs)("div",{className:"welcome-message",children:[(0,r.jsx)("div",{className:"welcome-icon",children:"💬"}),(0,r.jsx)("h4",{children:"Start a conversation"}),(0,r.jsx)("p",{children:"Type your message below to begin chatting with the AI assistant."})]})}),(0,r.jsx)("div",{className:"input-area",children:(0,r.jsxs)("div",{className:"message-input-container",children:[(0,r.jsx)("textarea",{ref:w,value:o,onChange:e=>p(e.target.value),onKeyPress:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),j())},placeholder:"Type your message... (Enter to send, Shift+Enter for new line)",disabled:d,rows:3}),(0,r.jsx)("button",{onClick:j,disabled:!o.trim()||d,className:"send-button",children:d?"⏳":"📤"})]})})]}),(0,r.jsx)("style",{children:`
        .chat-interface {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: clamp(15px, 3vw, 20px);
          padding: clamp(15px, 3vw, 20px);
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-primary);
          flex-wrap: wrap;
        }

        .back-button {
          padding: clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px);
          background: var(--accent);
          color: white;
          border: none;
          border-radius: clamp(4px, 1vw, 6px);
          cursor: pointer;
          font-size: clamp(12px, 2.5vw, 14px);
          white-space: nowrap;
        }

        .back-button:hover {
          background: #0056b3;
        }

        .chat-info h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: clamp(16px, 3vw, 18px);
        }

        .chat-info p {
          margin: clamp(3px, 1vh, 5px) 0 0 0;
          color: var(--text-secondary);
          font-size: clamp(12px, 2.5vw, 14px);
        }

        .chat-controls {
          margin-left: auto;
        }

        .research-toggle {
          display: flex;
          align-items: center;
          gap: clamp(6px, 1.5vw, 8px);
          cursor: pointer;
          font-size: clamp(12px, 2.5vw, 14px);
          color: var(--text-secondary);
        }

        .research-toggle input[type="checkbox"] {
          width: clamp(14px, 3vw, 16px);
          height: clamp(14px, 3vw, 16px);
          accent-color: var(--accent);
        }

        .toggle-label {
          font-weight: 500;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: clamp(15px, 3vw, 20px);
          display: flex;
          flex-direction: column;
          gap: clamp(15px, 3vh, 20px);
        }

        .welcome-message {
          text-align: center;
          padding: clamp(40px, 15vh, 60px) clamp(15px, 5vw, 20px);
          color: var(--text-secondary);
        }

        .welcome-icon {
          font-size: clamp(32px, 10vw, 48px);
          margin-bottom: clamp(15px, 4vh, 20px);
        }

        .welcome-message h4 {
          margin: 0 0 clamp(8px, 2vh, 10px) 0;
          color: var(--text-primary);
          font-size: clamp(18px, 4vw, 20px);
        }

        .message {
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1.5vh, 8px);
          max-width: min(80%, 600px);
          width: 100%;
        }

        .user-message {
          align-self: flex-end;
          align-items: flex-end;
        }

        .ai-message {
          align-self: flex-start;
          align-items: flex-start;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: clamp(8px, 2vw, 10px);
        }

        .ai-avatar {
          width: clamp(28px, 6vw, 32px);
          height: clamp(28px, 6vw, 32px);
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(14px, 3vw, 16px);
        }

        .ai-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: clamp(14px, 2.5vw, 16px);
        }

        .message-content {
          padding: clamp(12px, 3vw, 16px);
          border-radius: clamp(8px, 2vw, 12px);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px var(--shadow);
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .user-message .message-content {
          background: var(--accent);
          color: white;
        }

        .answer-text {
          line-height: 1.6;
          font-size: clamp(14px, 2.5vw, 16px);
        }

        .loading-indicator {
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1.5vh, 8px);
        }

        .message-meta {
          font-size: clamp(10px, 2vw, 12px);
          color: var(--text-muted);
          padding: 0 clamp(3px, 1vw, 4px);
        }

        .user-message .message-meta {
          text-align: right;
        }

        .error-message {
          padding: 12px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          border-radius: 6px;
          color: var(--error);
          text-align: center;
        }

        .input-area {
          padding: clamp(15px, 3vw, 20px);
          border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
        }

        .message-input-container {
          display: flex;
          gap: clamp(8px, 2vw, 12px);
          align-items: flex-end;
          max-width: 800px;
          margin: 0 auto;
        }

        .message-input-container textarea {
          flex: 1;
          padding: clamp(10px, 2.5vw, 12px);
          border: 2px solid var(--border-color);
          border-radius: clamp(6px, 1.5vw, 8px);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: clamp(14px, 2.5vw, 16px);
          font-family: inherit;
          resize: vertical;
          min-height: clamp(40px, 8vh, 50px);
          max-height: 200px;
          box-sizing: border-box;
        }

        .message-input-container textarea:focus {
          outline: none;
          border-color: var(--accent);
        }

        .message-input-container textarea:disabled {
          background: var(--bg-tertiary);
          cursor: not-allowed;
        }

        .send-button {
          padding: clamp(10px, 2.5vw, 12px) clamp(14px, 3vw, 16px);
          background: var(--accent);
          color: white;
          border: none;
          border-radius: clamp(6px, 1.5vw, 8px);
          cursor: pointer;
          font-size: clamp(14px, 2.5vw, 16px);
          transition: all 0.2s ease;
          align-self: flex-start;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          background: #0056b3;
          transform: scale(1.05);
        }

        .send-button:disabled {
          background: var(--text-secondary);
          cursor: not-allowed;
        }

        .message-input-container {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .message-input-container textarea {
          flex: 1;
          padding: 12px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          background: var(--bg-primary);
          color: var(--text-primary);
          resize: vertical;
          min-height: 50px;
          max-height: 200px;
        }

        .message-input-container textarea:focus {
          outline: none;
          border-color: var(--accent);
        }

        .message-input-container textarea:disabled {
          background: var(--bg-tertiary);
          cursor: not-allowed;
        }

        .send-button {
          padding: 12px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s ease;
        }

        .send-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .send-button:disabled {
          background: var(--text-secondary);
          cursor: not-allowed;
        }

        /* Extra small screens (< 480px) */
        @media (max-width: 480px) {
          .chat-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
            padding: 12px;
          }

          .chat-controls {
            margin-left: 0;
            align-self: center;
          }

          .research-toggle {
            justify-content: center;
          }

          .messages-area {
            padding: 12px;
            gap: 12px;
          }

          .message {
            max-width: 100%;
          }

          .message-content {
            padding: 10px;
          }

          .input-area {
            padding: 12px;
          }

          .message-input-container {
            flex-direction: column;
            gap: 10px;
          }

          .message-input-container textarea {
            width: 100%;
            min-height: 80px;
          }

          .send-button {
            align-self: stretch;
            padding: 14px;
          }
        }

        /* Small screens (481px - 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
          .chat-header {
            flex-wrap: wrap;
            gap: 15px;
            padding: 15px;
          }

          .chat-controls {
            margin-left: auto;
          }

          .messages-area {
            padding: 15px;
          }

          .message-input-container {
            max-width: none;
          }
        }

        /* Medium screens (769px - 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .message-input-container {
            max-width: 700px;
          }
        }

        /* Large screens (1025px - 1440px) */
        @media (min-width: 1025px) and (max-width: 1440px) {
          .message-input-container {
            max-width: 800px;
          }
        }

        /* Extra large screens (> 1440px) */
        @media (min-width: 1441px) {
          .message-input-container {
            max-width: 1000px;
          }

          .chat-header {
            padding: 24px;
          }

          .messages-area {
            padding: 24px;
          }

          .input-area {
            padding: 24px;
          }
        }
      `})]})}}),t("kqWnA",function(t,s){e(t.exports,"default",()=>l);var r,n=a("ayMG0");let i=((r=a("acw62"))&&r.__esModule?r.default:r).memo(({content:e,isEditable:a=!1,onChange:t,placeholder:s="Type your message..."})=>{if(!a){let a=e?e.replace(/```([\s\S]*?)```/g,"<pre><code>$1</code></pre>").replace(/^### (.*$)/gim,"<h3>$1</h3>").replace(/^## (.*$)/gim,"<h2>$1</h2>").replace(/^# (.*$)/gim,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/^\* (.*$)/gim,"<li>$1</li>").replace(/^\d+\. (.*$)/gim,"<li>$1</li>").replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>").replace(/^---$/gm,"<hr>").replace(/^([^<].*?)(<|$)/gm,"<p>$1</p>$2"):"";return(0,n.jsx)("div",{className:"rich-text-display",dangerouslySetInnerHTML:{__html:a}})}return(0,n.jsx)("textarea",{value:e,onChange:e=>t(e.target.value),placeholder:s,className:"rich-text-editor",rows:4})});i.displayName="RichTextMessage";var l=i}),t("gC2yi",function(t,s){e(t.exports,"SkeletonText",()=>i),e(t.exports,"default",()=>l);var r=a("ayMG0");a("acw62");let n=({width:e="100%",height:a="1rem",className:t="",variant:s="text",animation:n="pulse"})=>{let i={text:"skeleton-text",rectangular:"skeleton-rectangular",circular:"skeleton-circular",avatar:"skeleton-avatar"},l={pulse:"skeleton-pulse",wave:"skeleton-wave"},c=["skeleton",i[s]||i.text,l[n]||l.pulse,t].filter(Boolean).join(" ");return(0,r.jsx)("div",{className:c,style:{width:e,height:a}})},i=({lines:e=1,width:a="100%",...t})=>(0,r.jsx)("div",{className:"skeleton-text-block",children:Array.from({length:e},(s,i)=>(0,r.jsx)(n,{width:i===e-1?"60%":a,height:"1rem",variant:"text",...t},i))});var l=n});
//# sourceMappingURL=Chat.98f99734.js.map
