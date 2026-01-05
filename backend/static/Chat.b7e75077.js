function e(e,a,s,t){Object.defineProperty(e,a,{get:s,set:t,enumerable:!0,configurable:!0})}var a=globalThis.parcelRequire10c2,s=a.register;s("g3Ulu",function(s,t){Object.defineProperty(s.exports,"__esModule",{value:!0,configurable:!0}),e(s.exports,"default",()=>o);var r=a("ayMG0"),i=a("acw62"),n=a("kqWnA"),l=a("gC2yi"),o=({sessionId:e,onBack:a})=>{let[s,t]=(0,i.useState)([]),[o,c]=(0,i.useState)(""),[d,m]=(0,i.useState)(!1),[x,g]=(0,i.useState)(null),p=(0,i.useRef)(null),h=(0,i.useRef)(null);(0,i.useEffect)(()=>{u()},[e]),(0,i.useEffect)(()=>{f()},[s]);let u=async()=>{if(e)try{m(!0);let a=await fetch(`/api/chats/${e}`);if(a.ok){let e=await a.json();t(e.messages||[]),g(null)}else g("Failed to load chat session")}catch(e){g(`Error loading chat: ${e.message}`)}finally{m(!1)}},f=()=>{p.current?.scrollIntoView({behavior:"smooth"})},v=e=>new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),b=async()=>{if(!o.trim()||d)return;let e={id:Date.now(),type:"user",content:o.trim(),timestamp:new Date};t(a=>[...a,e]),c(""),m(!0),g(null);try{setTimeout(()=>{let a={id:Date.now()+1,type:"ai",content:`This is a simulated response to: "${e.content}"

**Features to implement:**
- Real chat API integration
- Model selection
- Context management
- Rich text formatting

\`Code example:\`
\`\`\`
console.log('Hello, World!');
\`\`\``,timestamp:new Date};t(e=>[...e,a]),m(!1)},2e3)}catch(e){g(`Failed to send message: ${e.message}`),m(!1)}};return(0,r.jsxs)("div",{className:"chat-interface",children:[(0,r.jsxs)("div",{className:"chat-header",children:[(0,r.jsx)("button",{onClick:a,className:"back-button",children:"← Back to Sessions"}),(0,r.jsxs)("div",{className:"chat-info",children:[(0,r.jsx)("h3",{children:"Chat Session"}),(0,r.jsxs)("p",{children:["Session ID: ",e]})]})]}),(0,r.jsxs)("div",{className:"chat-container",children:[(0,r.jsx)("div",{className:"messages-area",children:0!==s.length||d?(0,r.jsxs)(r.Fragment,{children:[s.map(e=>(0,r.jsx)("div",{children:"user"===e.type?(0,r.jsxs)("div",{className:"message user-message",children:[(0,r.jsx)("div",{className:"message-content",children:(0,r.jsx)("p",{children:e.content})}),(0,r.jsx)("div",{className:"message-meta",children:(0,r.jsx)("span",{className:"timestamp",children:v(e.timestamp)})})]}):(0,r.jsxs)("div",{className:"message ai-message",children:[(0,r.jsxs)("div",{className:"message-header",children:[(0,r.jsx)("div",{className:"ai-avatar",children:"🤖"}),(0,r.jsx)("div",{className:"ai-info",children:(0,r.jsx)("span",{className:"ai-name",children:"AI Assistant"})})]}),(0,r.jsx)("div",{className:"message-content",children:(0,r.jsx)("div",{className:"answer-text",children:(0,r.jsx)(n.default,{content:e.content})})}),(0,r.jsx)("div",{className:"message-meta",children:(0,r.jsx)("span",{className:"timestamp",children:v(e.timestamp)})})]})},e.id)),d&&(0,r.jsxs)("div",{className:"message ai-message",children:[(0,r.jsxs)("div",{className:"message-header",children:[(0,r.jsx)("div",{className:"ai-avatar",children:"🤖"}),(0,r.jsx)("div",{className:"ai-info",children:(0,r.jsx)("span",{className:"ai-name",children:"AI Assistant"})})]}),(0,r.jsx)("div",{className:"message-content",children:(0,r.jsxs)("div",{className:"loading-indicator",children:[(0,r.jsx)(l.default,{width:"100%",height:"1rem"}),(0,r.jsx)(l.default,{width:"80%",height:"1rem"}),(0,r.jsx)(l.default,{width:"60%",height:"1rem"})]})})]}),x&&(0,r.jsx)("div",{className:"error-message",children:(0,r.jsxs)("span",{children:["⚠️ ",x]})}),(0,r.jsx)("div",{ref:p})]}):(0,r.jsxs)("div",{className:"welcome-message",children:[(0,r.jsx)("div",{className:"welcome-icon",children:"💬"}),(0,r.jsx)("h4",{children:"Start a conversation"}),(0,r.jsx)("p",{children:"Type your message below to begin chatting with the AI assistant."})]})}),(0,r.jsx)("div",{className:"input-area",children:(0,r.jsxs)("div",{className:"message-input-container",children:[(0,r.jsx)("textarea",{ref:h,value:o,onChange:e=>c(e.target.value),onKeyPress:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),b())},placeholder:"Type your message... (Enter to send, Shift+Enter for new line)",disabled:d,rows:3}),(0,r.jsx)("button",{onClick:b,disabled:!o.trim()||d,className:"send-button",children:d?"⏳":"📤"})]})})]}),(0,r.jsx)("style",{children:`
        .chat-interface {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-primary);
        }

        .back-button {
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .back-button:hover {
          background: #0056b3;
        }

        .chat-info h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .chat-info p {
          margin: 5px 0 0 0;
          color: var(--text-secondary);
          font-size: 14px;
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
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .welcome-message {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        .welcome-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .welcome-message h4 {
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }

        .message {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 80%;
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
          gap: 10px;
        }

        .ai-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .ai-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .message-content {
          padding: 16px;
          border-radius: 12px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px var(--shadow);
        }

        .user-message .message-content {
          background: var(--accent);
          color: white;
        }

        .answer-text {
          line-height: 1.6;
        }

        .loading-indicator {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .message-meta {
          font-size: 12px;
          color: var(--text-muted);
          padding: 0 4px;
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
          padding: 20px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
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

        @media (max-width: 768px) {
          .chat-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .message {
            max-width: 95%;
          }

          .message-input-container {
            flex-direction: column;
          }

          .message-input-container textarea {
            width: 100%;
          }
        }
      `})]})}}),s("kqWnA",function(s,t){e(s.exports,"default",()=>l);var r,i=a("ayMG0");let n=((r=a("acw62"))&&r.__esModule?r.default:r).memo(({content:e,isEditable:a=!1,onChange:s,placeholder:t="Type your message..."})=>{if(!a){let a=e?e.replace(/```([\s\S]*?)```/g,"<pre><code>$1</code></pre>").replace(/^### (.*$)/gim,"<h3>$1</h3>").replace(/^## (.*$)/gim,"<h2>$1</h2>").replace(/^# (.*$)/gim,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/^\* (.*$)/gim,"<li>$1</li>").replace(/^\d+\. (.*$)/gim,"<li>$1</li>").replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>").replace(/^---$/gm,"<hr>").replace(/^([^<].*?)(<|$)/gm,"<p>$1</p>$2"):"";return(0,i.jsx)("div",{className:"rich-text-display",dangerouslySetInnerHTML:{__html:a}})}return(0,i.jsx)("textarea",{value:e,onChange:e=>s(e.target.value),placeholder:t,className:"rich-text-editor",rows:4})});n.displayName="RichTextMessage";var l=n}),s("gC2yi",function(s,t){e(s.exports,"SkeletonText",()=>n),e(s.exports,"default",()=>l);var r=a("ayMG0");a("acw62");let i=({width:e="100%",height:a="1rem",className:s="",variant:t="text",animation:i="pulse"})=>{let n={text:"skeleton-text",rectangular:"skeleton-rectangular",circular:"skeleton-circular",avatar:"skeleton-avatar"},l={pulse:"skeleton-pulse",wave:"skeleton-wave"},o=["skeleton",n[t]||n.text,l[i]||l.pulse,s].filter(Boolean).join(" ");return(0,r.jsx)("div",{className:o,style:{width:e,height:a}})},n=({lines:e=1,width:a="100%",...s})=>(0,r.jsx)("div",{className:"skeleton-text-block",children:Array.from({length:e},(t,n)=>(0,r.jsx)(i,{width:n===e-1?"60%":a,height:"1rem",variant:"text",...s},n))});var l=i});
//# sourceMappingURL=Chat.b7e75077.js.map
