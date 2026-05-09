import { useState, useRef, useCallback, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOSc1f0ZH9BvjHIiy40syoIuIJq6ot7U0",
  authDomain: "eduquizproia.firebaseapp.com",
  projectId: "eduquizproia",
  storageBucket: "eduquizproia.firebasestorage.app",
  messagingSenderId: "555236721804",
  appId: "1:555236721804:web:86b955e642738cfcfb27a9"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const D = {
  bg:"#000",s1:"#0a0a0a",card:"#111",border:"#1e1e1e",
  sky:"#0ea5e9",skydim:"rgba(14,165,233,.1)",skyglow:"rgba(14,165,233,.25)",
  em:"#10b981",emdim:"rgba(16,185,129,.1)",
  ro:"#f43f5e",rodim:"rgba(244,63,94,.1)",
  am:"#f59e0b",
  pu:"#8b5cf6",
  text:"#fff",sub:"#e2e8f0",muted:"#94a3b8",line:"#1e1e2e",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#000;color:#fff;font-family:'Inter',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:linear-gradient(#0ea5e9,#8b5cf6);border-radius:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideR{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes pop{0%{transform:scale(.85);opacity:0}60%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(14,165,233,.3)}50%{box-shadow:0 0 40px rgba(14,165,233,.6)}}
.fu{animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both}
.fi{animation:fadeIn .3s ease both}
.sr{animation:slideR .35s cubic-bezier(.22,1,.36,1) both}
.pop{animation:pop .5s cubic-bezier(.22,1,.36,1) both}
input[type=text],input[type=email],input[type=password],textarea{width:100%;background:#0d0d0d;border:1.5px solid #1e1e2e;border-radius:12px;color:#fff;font-family:'Inter',sans-serif;font-size:14px;padding:14px 16px;outline:none;transition:all .2s}
textarea{resize:vertical;min-height:120px}
input::placeholder,textarea::placeholder{color:#475569}
input:focus,textarea:focus{border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.12)}
input.err{border-color:#f43f5e}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:12px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;transition:all .2s;white-space:nowrap}
.btn-sky{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;box-shadow:0 4px 24px rgba(14,165,233,.35)}
.btn-sky:hover{transform:translateY(-1px);box-shadow:0 8px 32px rgba(14,165,233,.45)}
.btn-sky:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-google{background:#fff;color:#1f1f1f;border:none;box-shadow:0 2px 12px rgba(0,0,0,.3)}
.btn-google:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,0,0,.4)}
.btn-outline{background:transparent;color:#e2e8f0;border:1.5px solid #1e1e2e}
.btn-outline:hover{border-color:#0ea5e9;color:#0ea5e9;background:rgba(14,165,233,.06)}
.btn-ghost{background:transparent;color:#94a3b8;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;font-size:13px;padding:8px;transition:all .2s;border-radius:8px}
.btn-ghost:hover{color:#0ea5e9;background:rgba(14,165,233,.08)}
.btn-full{width:100%}
.card{background:#0d0d0d;border:1.5px solid #1e1e2e;border-radius:20px;padding:28px;transition:border-color .2s}
.card:hover{border-color:#2d2d3e}
.glass{background:rgba(10,10,15,.95);backdrop-filter:blur(24px);border:1.5px solid rgba(255,255,255,.06);border-radius:20px;padding:32px}
.tab-bar{display:flex;background:#0a0a0f;border:1.5px solid #1e1e2e;border-radius:14px;padding:4px;gap:4px;margin-bottom:28px}
.tab{flex:1;padding:10px;border-radius:10px;border:none;background:transparent;color:#64748b;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s;text-align:center}
.tab.on{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;box-shadow:0 4px 16px rgba(14,165,233,.3)}
.field{margin-bottom:18px}
.field label{display:block;font-size:11px;font-weight:700;color:#64748b;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
.field-err{font-size:12px;color:#f43f5e;margin-top:6px}
.opt{width:100%;text-align:left;padding:15px 18px;border-radius:14px;border:1.5px solid #1e1e2e;background:#0a0a0f;color:#e2e8f0;font-family:'Inter',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:14px}
.opt:hover:not(:disabled){border-color:#0ea5e9;background:rgba(14,165,233,.06);transform:translateX(2px)}
.opt.chosen{border-color:#0ea5e9;background:rgba(14,165,233,.08)}
.opt.correct{border-color:#10b981;background:rgba(16,185,129,.08)}
.opt.wrong{border-color:#f43f5e;background:rgba(244,63,94,.08)}
.opt:disabled{cursor:default}
.letter{width:32px;height:32px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;border:1.5px solid #1e1e2e;background:#111;color:#94a3b8;transition:all .2s}
.opt.chosen .letter{border-color:#0ea5e9;background:rgba(14,165,233,.15);color:#0ea5e9}
.opt.correct .letter{border-color:#10b981;background:rgba(16,185,129,.15);color:#10b981}
.opt.wrong .letter{border-color:#f43f5e;background:rgba(244,63,94,.15);color:#f43f5e}
.prog-track{height:6px;border-radius:6px;background:#1e1e2e;overflow:hidden}
.prog-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,#0ea5e9,#8b5cf6);transition:width .6s cubic-bezier(.22,1,.36,1)}
.chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.04em}
.chip-sky{background:rgba(14,165,233,.12);color:#38bdf8;border:1px solid rgba(14,165,233,.2)}
.chip-am{background:rgba(245,158,11,.12);color:#fbbf24;border:1px solid rgba(245,158,11,.2)}
.chip-em{background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.2)}
.chip-dark{background:rgba(255,255,255,.05);color:#94a3b8;border:1px solid rgba(255,255,255,.08)}
.tog-group{display:flex;background:#0a0a0f;border:1.5px solid #1e1e2e;border-radius:14px;padding:4px;gap:4px}
.tog-item{flex:1;padding:10px 12px;border-radius:10px;border:none;background:transparent;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#64748b;cursor:pointer;transition:all .2s;text-align:center}
.tog-item.on{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;box-shadow:0 4px 16px rgba(14,165,233,.3)}
.spinner{width:20px;height:20px;border:2px solid #1e1e2e;border-top-color:#0ea5e9;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.drop{border:2px dashed #1e1e2e;border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;background:#0a0a0f;transition:all .2s}
.drop:hover,.drop.over{border-color:#0ea5e9;background:rgba(14,165,233,.04)}
.topbar{position:sticky;top:0;z-index:100;background:rgba(0,0,0,.92);backdrop-filter:blur(20px);border-bottom:1px solid #0f0f1a;padding:0 24px}
.topbar-inner{max-width:960px;margin:0 auto;display:flex;align-items:center;height:62px;gap:12px}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:300;padding:20px;animation:fadeIn .2s ease}
.modal{background:#0d0d0d;border:1.5px solid #1e1e2e;border-radius:24px;padding:32px;max-width:500px;width:100%;box-shadow:0 40px 100px rgba(0,0,0,.8);animation:slideUp .35s cubic-bezier(.22,1,.36,1)}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#0d0d0d;border:1.5px solid #1e1e2e;border-radius:14px;padding:14px 22px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;z-index:999;box-shadow:0 16px 48px rgba(0,0,0,.6);animation:fadeUp .35s ease;white-space:nowrap}
.stat-box{background:#0a0a0f;border:1.5px solid #1e1e2e;border-radius:16px;padding:20px;transition:all .2s}
.stat-box:hover{border-color:#2d2d3e}
.res-row{background:#0d0d0d;border:1.5px solid #1e1e2e;border-radius:14px;padding:15px 18px;display:flex;align-items:flex-start;gap:13px;cursor:pointer;transition:all .2s;width:100%;text-align:left;font-family:'Inter',sans-serif}
.res-row:hover{border-color:#2d2d3e;background:#111}
.fb-section{border-radius:14px;padding:16px 18px;margin-bottom:10px}
.fb-strengths{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2)}
.fb-improve{background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2)}
.fb-reco{background:rgba(14,165,233,.08);border:1px solid rgba(14,165,233,.2)}
.fb-answer{background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2)}
.fb-title{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.fb-text{font-size:13px;line-height:1.7;color:#e2e8f0}
.sticky-nav{position:sticky;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.95) 30%);padding:20px 0 24px;margin-top:16px}
input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:4px;background:#1e1e2e;outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#0284c7);box-shadow:0 0 12px rgba(14,165,233,.4);cursor:pointer}
.footer{text-align:center;padding:20px 16px;border-top:1px solid #0f0f1a}
.divider{display:flex;align-items:center;gap:12px;margin:20px 0}
.divider-line{flex:1;height:1px;background:#1e1e2e}
.divider-text{font-size:12px;color:#475569;font-weight:500}
@media(max-width:640px){
  .card,.glass{padding:18px;border-radius:16px}
  .modal{margin:0;border-radius:20px 20px 0 0;position:fixed;bottom:0;left:0;right:0;max-width:100%;max-height:90vh;overflow-y:auto}
  .modal-bg{align-items:flex-end;padding:0}
  .topbar{padding:0 12px}
  .topbar-inner{height:54px;gap:6px}
}
`;

const SK = { results:"eq:results" };
const LS = {
  get: k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} },
};
const getResults = () => LS.get(SK.results) || [];
const addResult = r => { const arr = [r, ...getResults()].slice(0,100); LS.set(SK.results, arr); };

const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY;

async function callClaude(messages, system, tools=null, model="claude-haiku-4-5-20251001") {
  const body = { model, max_tokens:4000, system, messages };
  if (tools) body.tools = tools;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key": API_KEY,
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true"
    },
    body:JSON.stringify(body),
  });
  const data = await res.json();
  return (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");
}

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-20250514";

function parseJSON(raw) { try { return JSON.parse(raw.replace(/```json|```/g,"").trim()); } catch { return null; } }
function parseFeedback(raw) {
  try { return JSON.parse(raw.replace(/```json|```/g,"").trim()); }
  catch { return { strengths:[], improve:[], recommendations:[], expected: raw.replace(/[#*`]/g,"").trim() }; }
}
function pctColor(p) { return p>=75?D.em:p>=50?D.am:D.ro; }
function fmtDate(ts) { return new Date(ts).toLocaleDateString("es-CL",{day:"2-digit",month:"short",year:"numeric"}); }
function cleanText(t) { return (t||"").replace(/[#*`_~]/g,"").trim(); }

function useToast() {
  const [t,setT] = useState(null);
  const show = (msg,type="ok") => { setT({msg,type}); setTimeout(()=>setT(null),3000); };
  const Toast = t ? (
    <div className="toast">
      <span style={{color: t.type==="ok"?D.em:t.type==="err"?D.ro:D.sky,fontWeight:700}}>{t.msg}</span>
    </div>
  ) : null;
  return {Toast, show};
}

function Logo({size=36, compact=false}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:size,height:size,borderRadius:10,background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px rgba(14,165,233,.4)",flexShrink:0}}>
        <span style={{color:"#fff",fontWeight:800,fontSize:size*.38,fontFamily:"'JetBrains Mono'"}}>EQ</span>
      </div>
      {!compact&&<div>
        <div style={{fontWeight:800,fontSize:14,lineHeight:1,color:"#fff",letterSpacing:"-.02em"}}>EduQuiz <span style={{background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>IA</span></div>
        <div style={{fontSize:9,color:"#475569",fontWeight:600,letterSpacing:".1em",marginTop:2}}>CREADO POR MANU</div>
      </div>}
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      <p style={{fontSize:11,color:"#334155",fontWeight:500}}>&copy; 2026 EduQuiz IA. Todos los derechos reservados.</p>
    </div>
  );
}

function StepBar({step}) {
  const labels = ["Contenido","Cuestionario","Resultados"];
  return (
    <div style={{display:"flex",alignItems:"center",maxWidth:360,margin:"0 auto 36px"}}>
      {labels.map((l,i) => (
        <div key={i} style={{display:"flex",alignItems:"center",flex:i<labels.length-1?1:"none"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
            <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,
              background:i<step?"linear-gradient(135deg,#10b981,#059669)":i===step?"linear-gradient(135deg,#0ea5e9,#0284c7)":"#1e1e2e",
              color:i<=step?"#fff":"#475569",transition:"all .4s",
              boxShadow:i===step?"0 0 16px rgba(14,165,233,.4)":"none"}}>
              {i<step?"ok":i+1}
            </div>
            <span style={{fontSize:10,fontWeight:600,color:i===step?"#0ea5e9":"#475569",whiteSpace:"nowrap"}}>{l}</span>
          </div>
          {i<labels.length-1&&<div style={{flex:1,height:2,background:i<step?"linear-gradient(90deg,#10b981,#059669)":"#1e1e2e",margin:"0 8px",marginBottom:18,transition:"background .4s",borderRadius:2}}/>}
        </div>
      ))}
    </div>
  );
}

function Auth({onLogin}) {
  const [loading,setLoading] = useState(false);
  const [loadingGuest,setLoadingGuest] = useState(false);
  const [error,setError] = useState("");

  const loginWithGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      onLogin({
        name: u.displayName || "Usuario",
        email: u.email,
        photo: u.photoURL,
        uid: u.uid,
        isGuest: false,
      });
    } catch(e) {
      setError("No se pudo iniciar sesion. Intenta de nuevo.");
      console.error(e);
    }
    setLoading(false);
  };

  const loginAsGuest = () => {
    setLoadingGuest(true);
    setTimeout(()=>{
      onLogin({
        name: "Invitado",
        email: "",
        photo: null,
        uid: "guest-"+Date.now(),
        isGuest: true,
      });
      setLoadingGuest(false);
    }, 600);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,.07),transparent 65%)"}}/>
        <div style={{position:"absolute",bottom:"-10%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.06),transparent 65%)"}}/>
      </div>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#0ea5e9,#8b5cf6,transparent)"}}/>
      <div className="fu" style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:32}}><Logo size={52}/></div>
        <div style={{textAlign:"center",marginBottom:24}}>
          <p style={{fontSize:13,color:"#475569"}}>Genera cuestionarios educativos con inteligencia artificial</p>
        </div>
        <div className="glass">
          <div style={{textAlign:"center",marginBottom:20}}>
            <h2 style={{fontSize:16,fontWeight:700,color:"#64748b",letterSpacing:".08em"}}>ACCESO A LOS CUESTIONARIOS</h2>
          </div>

          <button className="btn btn-google btn-full" onClick={loginWithGoogle} disabled={loading||loadingGuest} style={{height:52,fontSize:15,borderRadius:14,marginBottom:12}}>
            {loading?(
              <><div className="spinner" style={{borderTopColor:"#1f1f1f",borderColor:"#ddd"}}/>Iniciando sesion...</>
            ):(
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </>
            )}
          </button>

          <div className="divider">
            <div className="divider-line"/>
            <span className="divider-text">o continua como</span>
            <div className="divider-line"/>
          </div>

          <button className="btn btn-outline btn-full" onClick={loginAsGuest} disabled={loading||loadingGuest} style={{height:48,fontSize:14,borderRadius:14}}>
            {loadingGuest?<><div className="spinner"/>Entrando...</>:"Entrar como Invitado"}
          </button>

          <p style={{textAlign:"center",color:"#334155",fontSize:11,marginTop:16}}>El invitado puede hacer quizzes pero sin guardar historial</p>

          {error&&<p style={{textAlign:"center",color:D.ro,fontSize:12,marginTop:12}}>{error}</p>}
        </div>
        <p style={{textAlign:"center",color:"#334155",fontSize:11,marginTop:16}}>EduQuiz IA - Plataforma educativa con inteligencia artificial</p>
        <p style={{textAlign:"center",color:"#334155",fontSize:11,marginTop:6}}>&copy; 2026 EduQuiz IA. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

function TopBar({user,onNav,onLogout}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth<=640);
  useEffect(()=>{ const h=()=>setIsMobile(window.innerWidth<=640); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h); },[]);
  return (
    <div className="topbar">
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#0ea5e9,#8b5cf6,transparent)"}}/>
      <div className="topbar-inner">
        <Logo size={28} compact={isMobile}/>
        <div style={{flex:1}}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {user.photo?(
            <img src={user.photo} alt={user.name} style={{width:30,height:30,borderRadius:9,objectFit:"cover",border:"1px solid rgba(14,165,233,.3)",cursor:"pointer"}} onClick={()=>onNav("profile")}/>
          ):(
            <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,rgba(14,165,233,.2),rgba(139,92,246,.2))",border:"1px solid rgba(14,165,233,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#38bdf8",cursor:"pointer"}} onClick={()=>onNav("profile")}>{user.name.charAt(0).toUpperCase()}</div>
          )}
          <button className="btn-ghost" onClick={onLogout} style={{fontSize:12,padding:"5px 10px",color:"#64748b"}}>Salir</button>
        </div>
      </div>
    </div>
  );
}

function Home({user,onNav}) {
  const results = getResults();
  const stats = { total:results.length, avgPct:results.length?Math.round(results.reduce((a,r)=>a+r.pct,0)/results.length):0, best:results.length?Math.max(...results.map(r=>r.pct)):0 };
  const hour = new Date().getHours();
  const greeting = hour<12?"Buenos dias":hour<18?"Buenas tardes":"Buenas noches";
  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"36px 16px 40px"}} className="fu">
      <div style={{marginBottom:32}}>
        <h1 style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-.02em"}}>{greeting}, {user.name.split(" ")[0]}</h1>
        <p style={{color:"#475569",fontSize:13,marginTop:4}}>Listo para aprender hoy?</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
        {[
          {label:"Evaluaciones",val:stats.total||"0",color:"#38bdf8"},
          {label:"Promedio",val:stats.total?(stats.avgPct+"%"):"--",color:pctColor(stats.avgPct)},
          {label:"Mejor nota",val:stats.total?(stats.best+"%"):"--",color:"#34d399"},
        ].map((s,i)=>(
          <div key={i} className="stat-box">
            <div style={{fontFamily:"'JetBrains Mono'",fontSize:24,fontWeight:600,color:s.color,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:10,color:"#475569",marginTop:5,fontWeight:600,letterSpacing:".06em"}}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-sky btn-full" style={{fontSize:15,height:54,borderRadius:14,marginBottom:16}} onClick={()=>onNav("quiz")}>
        Generar nuevo cuestionario con IA
      </button>
      <div className="card">
        <h3 style={{fontWeight:700,fontSize:12,marginBottom:16,color:"#334155",letterSpacing:".08em"}}>ACCESO RAPIDO</h3>
        {[
          {label:"Nuevo cuestionario",sub:"Escribe o pega tu contenido educativo",action:"quiz",color:"#0ea5e9"},
          {label:"Mi historial",sub:stats.total+" evaluaciones completadas",action:"history",color:"#f59e0b"},
        ].map((a,i)=>(
          <button key={i} onClick={()=>onNav(a.action)} style={{all:"unset",cursor:"pointer",width:"100%",display:"block",marginBottom:i===0?10:0}}>
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"15px 16px",borderRadius:14,background:"#0a0a0f",border:"1.5px solid #1e1e2e",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a.color;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";}}>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:"#e2e8f0"}}>{a.label}</div><div style={{fontSize:12,color:"#475569",marginTop:2}}>{a.sub}</div></div>
              <span style={{color:"#334155",fontSize:18}}>{">"}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizInput({onGenerate}) {
  const [mode,setMode] = useState("text");
  const [text,setText] = useState("");
  const [imgData,setImgData] = useState(null);
  const [imgPrev,setImgPrev] = useState(null);
  const [numMC,setNumMC] = useState(8);
  const [numDev,setNumDev] = useState(2);
  const [drag,setDrag] = useState(false);
  const fileRef=useRef(); const camRef=useRef();
  const total=numMC+numDev;
  const canGo = mode==="text"?text.trim().length>20:!!imgData;
  const handleImg = f => { if(!f) return; const r=new FileReader(); r.onload=e=>{setImgPrev(e.target.result);setImgData(e.target.result.split(",")[1]);}; r.readAsDataURL(f); };
  const onDrop = useCallback(e=>{ e.preventDefault();setDrag(false); const f=e.dataTransfer.files[0]; if(f?.type.startsWith("image/")) handleImg(f); },[]);
  const sliders = [
    {label:"Seleccion Multiple",sub:"Opciones A, B, C, D",val:numMC,set:setNumMC,max:80,color:"#0ea5e9"},
    {label:"Desarrollo",sub:"Evaluacion con IA",val:numDev,set:setNumDev,max:20,color:"#f59e0b"},
  ];
  return (
    <div className="fu" style={{maxWidth:660,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <h1 style={{fontSize:28,fontWeight:800,marginBottom:8,color:"#fff",letterSpacing:"-.03em"}}>Nuevo cuestionario</h1>
        <p style={{color:"#475569",fontSize:14}}>Ingresa el contenido y la IA generara las preguntas</p>
      </div>
      <div className="card">
        <div className="tog-group" style={{marginBottom:24}}>
          <button className={"tog-item "+(mode==="text"?"on":"")} onClick={()=>setMode("text")}>Escribe el contenido</button>
          <button className={"tog-item "+(mode==="image"?"on":"")} onClick={()=>setMode("image")}>Foto del cuaderno</button>
        </div>
        {mode==="text"&&(
          <div>
            <textarea rows={9} placeholder="Escribe o pega aqui el contenido educativo..." value={text} onChange={e=>setText(e.target.value)} style={{fontSize:14,lineHeight:1.7}}/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}>
              <span style={{fontSize:11,color:"#334155"}}>{text.length} caracteres</span>
            </div>
          </div>
        )}
        {mode==="image"&&(imgPrev?(
          <div style={{position:"relative"}}>
            <img src={imgPrev} alt="prev" style={{width:"100%",borderRadius:14,maxHeight:240,objectFit:"cover"}}/>
            <button className="btn btn-outline" onClick={()=>{setImgData(null);setImgPrev(null);}} style={{position:"absolute",top:10,right:10,fontSize:12,padding:"7px 14px",background:"rgba(0,0,0,.8)"}}>Cambiar</button>
          </div>
        ):(
          <div className={"drop "+(drag?"over":"")} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>fileRef.current.click()}>
            <p style={{fontWeight:700,marginBottom:6,color:"#e2e8f0",fontSize:15}}>Arrastra la foto o haz clic aqui</p>
            <p style={{fontSize:13,color:"#475569",marginBottom:20}}>Cuaderno, pizarra, libro, apunte fotografiado</p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={e=>{e.stopPropagation();fileRef.current.click();}} className="btn btn-outline" style={{fontSize:13,padding:"9px 16px"}}>Galeria</button>
              <button onClick={e=>{e.stopPropagation();camRef.current.click();}} className="btn btn-outline" style={{fontSize:13,padding:"9px 16px"}}>Camara</button>
            </div>
          </div>
        ))}
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
        <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
        <div style={{marginTop:28,borderTop:"1px solid #1e1e2e",paddingTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <span style={{fontWeight:700,fontSize:15,color:"#e2e8f0"}}>Configurar preguntas</span>
              <p style={{fontSize:12,color:"#475569",marginTop:2}}>Ajusta la cantidad segun tus necesidades</p>
            </div>
            <div style={{textAlign:"right"}}>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:28,fontWeight:600,color:"#0ea5e9"}}>{total}</span>
              <span style={{fontSize:12,color:"#334155",marginLeft:4}}>preguntas</span>
            </div>
          </div>
          {sliders.map((s,i)=>(
            <div key={i} style={{marginBottom:16,padding:"16px 18px",borderRadius:14,border:"1.5px solid #1e1e2e",background:"#0a0a0f"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:"#e2e8f0"}}>{s.label}</div>
                  <div style={{fontSize:11,color:"#475569",marginTop:2}}>{s.sub}</div>
                </div>
                <span style={{fontFamily:"'JetBrains Mono'",fontSize:22,fontWeight:600,color:s.color}}>{s.val}</span>
              </div>
              <input type="range" min={0} max={s.max} value={s.val} style={{accentColor:s.color}} onChange={e=>{const v=+e.target.value;if(total-s.val+v<=100)s.set(v);}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#334155",marginTop:4}}><span>0</span><span>{s.max}</span></div>
            </div>
          ))}
        </div>
        <button className="btn btn-sky btn-full" disabled={!canGo||total===0} onClick={()=>onGenerate({mode,text,imgData,numMC,numDev})} style={{marginTop:20,height:52,fontSize:15,borderRadius:14}}>
          Generar cuestionario con IA
        </button>
      </div>
    </div>
  );
}

function Loading({phase}) {
  const phases=["Analizando el contenido...","Generando preguntas con IA...","Preparando tu cuestionario..."];
  return (
    <div style={{maxWidth:380,margin:"80px auto",textAlign:"center"}} className="fi">
      <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,rgba(14,165,233,.15),rgba(139,92,246,.15))",border:"1px solid rgba(14,165,233,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:24,fontWeight:800,color:"#0ea5e9",animation:"pulse 1.8s infinite"}}>IA</div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:8,color:"#fff"}}>{phases[phase]}</h2>
      <p style={{color:"#475569",fontSize:14,marginBottom:40}}>La IA esta trabajando para ti...</p>
      <div style={{display:"flex",flexDirection:"column",gap:14,textAlign:"left"}}>
        {phases.map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,background:i<=phase?"rgba(14,165,233,.06)":"#0a0a0f",border:"1px solid "+(i<=phase?"rgba(14,165,233,.15)":"#1e1e2e"),transition:"all .4s"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:i<phase?"linear-gradient(135deg,#10b981,#059669)":i===phase?"rgba(14,165,233,.2)":"#1e1e2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i<phase?"#fff":i===phase?"#0ea5e9":"#334155",flexShrink:0}}>
              {i<phase?"ok":i===phase?<div className="spinner" style={{width:12,height:12,borderWidth:2}}/>:i+1}
            </div>
            <span style={{fontSize:13,color:i<=phase?"#e2e8f0":"#334155",fontWeight:i===phase?600:400}}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBadge({score}) {
  const level = score<=1?"Insuficiente":score===2?"Basico":score<=4?"Bueno":"Excelente";
  const color = score<=1?D.ro:score===2?D.am:score<=4?D.sky:D.em;
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderRadius:14,background:color+"15",border:"1px solid "+color+"40",marginBottom:10}}>
      <div style={{textAlign:"center",minWidth:60}}>
        <div style={{fontFamily:"'JetBrains Mono'",fontSize:28,fontWeight:700,color,lineHeight:1}}>{score}<span style={{fontSize:14,color:"#475569"}}>/5</span></div>
        <div style={{fontSize:10,color:"#475569",marginTop:2,fontWeight:600}}>PUNTAJE</div>
      </div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:14,color}}>{level}</div>
        <div style={{fontSize:11,color:"#475569",marginTop:2}}>Evaluacion de desarrollo</div>
      </div>
    </div>
  );
}

function SourceBlock({q}) {
  const title = q.source_title || q.source || "Fuente no verificada. Revisar con material de estudio.";
  const url = q.source_url || "";
  const confidence = q.confidence || "";
  const confColor = confidence==="alto"?"#34d399":confidence==="medio"?"#fbbf24":"#94a3b8";
  return (
    <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(139,92,246,.08)",border:"1px solid rgba(139,92,246,.25)",marginTop:10}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
        <span style={{fontSize:10,fontWeight:700,color:"#a78bfa",letterSpacing:".06em"}}>FUENTE</span>
        {confidence&&<span style={{fontSize:9,fontWeight:700,color:confColor,background:confColor+"20",padding:"1px 6px",borderRadius:4}}>{confidence.toUpperCase()}</span>}
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#38bdf8",textDecoration:"underline",wordBreak:"break-all"}}>{title}</a>
      ) : (
        <span style={{fontSize:12,color:"#94a3b8"}}>{title}</span>
      )}
    </div>
  );
}

function FeedbackCard({fb, question}) {
  if(!fb) return null;
  const sourceBlock = question ? <SourceBlock q={question}/> : null;
  if(fb.correct===true) return (
    <div className="fu" style={{marginTop:16}}>
      <div className="fb-section fb-strengths">
        <div className="fb-title" style={{color:"#34d399"}}>Respuesta Correcta</div>
        <p className="fb-text">{cleanText(fb.explanation)}</p>
      </div>
      {sourceBlock}
    </div>
  );
  if(fb.correct===false) return (
    <div className="fu" style={{marginTop:16}}>
      <div className="fb-section fb-improve" style={{marginBottom:0}}>
        <div className="fb-title" style={{color:"#fbbf24"}}>Respuesta Incorrecta</div>
        <p className="fb-text">{cleanText(fb.explanation)}</p>
      </div>
      {sourceBlock}
    </div>
  );
  const parsed = fb.parsed || {};
  return (
    <div className="fu" style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
      {fb.isScored && parsed.score!==undefined && <ScoreBadge score={parsed.score}/>}
      {parsed.strengths?.length>0&&(<div className="fb-section fb-strengths"><div className="fb-title" style={{color:"#34d399"}}>Fortalezas</div>{parsed.strengths.map((s,i)=><p key={i} className="fb-text" style={{marginTop:i>0?4:0}}>{cleanText(s)}</p>)}</div>)}
      {parsed.improve?.length>0&&(<div className="fb-section fb-improve"><div className="fb-title" style={{color:"#fbbf24"}}>Aspectos a mejorar</div>{parsed.improve.map((s,i)=><p key={i} className="fb-text" style={{marginTop:i>0?4:0}}>{cleanText(s)}</p>)}</div>)}
      {parsed.recommendation&&(<div className="fb-section fb-reco"><div className="fb-title" style={{color:"#38bdf8"}}>Recomendacion de estudio</div><p className="fb-text">{cleanText(parsed.recommendation)}</p></div>)}
      {parsed.expected&&(<div className="fb-section fb-answer"><div className="fb-title" style={{color:"#a78bfa"}}>Respuesta esperada</div><p className="fb-text">{cleanText(parsed.expected)}</p></div>)}
      {!parsed.strengths&&!parsed.improve&&!parsed.recommendation&&!parsed.expected&&(<div className="fb-section fb-reco"><div className="fb-title" style={{color:"#38bdf8"}}>Retroalimentacion</div><p className="fb-text">{cleanText(fb.explanation)}</p></div>)}
      {sourceBlock}
    </div>
  );
}

function Quiz({quiz,resources,onFinish,onRestart}) {
  const [cur,setCur]=useState(0); const [answers,setAnswers]=useState({}); const [feedback,setFeedback]=useState({});
  const [devText,setDevText]=useState(""); const [checking,setChecking]=useState(false); const [showRes,setShowRes]=useState(false);
  const q=quiz[cur]; const answered=answers[cur]!==undefined; const fb=feedback[cur]; const isLast=cur===quiz.length-1;
  const correctCount=Object.values(feedback).filter(f=>f?.correct===true).length;
  const pct=Math.round(((cur+1)/quiz.length)*100);
  const setAns=(i,v)=>setAnswers(p=>({...p,[i]:v}));
  const setFB=(i,v)=>setFeedback(p=>({...p,[i]:v}));
  const handleMC=idx=>{if(answered)return;setAns(cur,idx);setFB(cur,{correct:idx===q.answer,explanation:q.explanation});};
  const handleDev=async()=>{
    if(!devText.trim()||checking)return;
    setChecking(true);setAns(cur,devText);
    try{
      const res=await callClaude([{role:"user",content:"Pregunta: \""+q.question+"\"
Respuesta del estudiante: \""+devText+"\"
Respuesta esperada: \""+q.answer+"\"

Evalua con escala 0-5:\n0=incorrecta, 1=muy incompleta, 2=parcialmente correcta, 3=correcta basica, 4=correcta y explicada, 5=excelente\n\nDevuelve SOLO JSON:\n{\"score\":0,\"level\":\"Insuficiente\",\"strengths\":[\"...\"],\"improve\":[\"...\"],\"expected\":\"...\",\"recommendation\":\"...\"}
Niveles: 0-1=Insuficiente, 2=Basico, 3-4=Bueno, 5=Excelente. Max 2 items por campo."}],"Profesor evaluador experto. Evalua con criterio pedagogico justo. Responde SOLO con JSON valido.",null,SONNET);
      const parsed=parseFeedback(res);
      setFB(cur,{correct:null,explanation:res,parsed,isScored:true});
    }
    catch{setFB(cur,{correct:null,explanation:q.explanation,parsed:{expected:q.explanation}});}
    setChecking(false);
  };
  const goNext=()=>{setCur(c=>c+1);setDevText("");window.scrollTo({top:0,behavior:"smooth"});};
  const goPrev=()=>{setCur(c=>c-1);setDevText("");window.scrollTo({top:0,behavior:"smooth"});};
  const typeMap={multiple:{label:"Seleccion Multiple",cls:"chip-sky"},development:{label:"Desarrollo",cls:"chip-am"}};
  return (
    <div style={{maxWidth:720,margin:"0 auto",paddingBottom:100}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button className="btn-ghost" onClick={onRestart} style={{padding:"6px 12px",fontSize:13}}>Salir</button>
            <span style={{color:"#475569",fontSize:13}}>Pregunta <span style={{color:"#e2e8f0",fontWeight:700}}>{cur+1}</span> de <span style={{color:"#e2e8f0",fontWeight:700}}>{quiz.length}</span></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{color:"#34d399",fontWeight:700,fontSize:13}}>{correctCount} correctas</span>
            {resources?.length>0&&<button className="btn btn-outline" style={{fontSize:11,padding:"6px 12px",height:32}} onClick={()=>setShowRes(true)}>Recursos</button>}
          </div>
        </div>
        <div className="prog-track"><div className="prog-fill" style={{width:pct+"%"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
          <span style={{fontSize:10,color:"#334155"}}>{pct}% completado</span>
          <span style={{fontSize:10,color:"#334155"}}>{quiz.length-cur-1} restantes</span>
        </div>
      </div>
      <div className="card sr" key={cur} style={{marginBottom:16}}>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
          <span className={"chip "+(typeMap[q.type]?.cls||"chip-dark")}>{typeMap[q.type]?.label||q.type}</span>
          {q.topic&&<span className="chip chip-dark">{q.topic}</span>}
        </div>
        <h2 style={{fontSize:18,fontWeight:600,lineHeight:1.6,marginBottom:24,color:"#f1f5f9"}}>{q.question}</h2>
        {q.type==="multiple"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {(q.options||[]).map((opt,i)=>{const isSel=answers[cur]===i,isOk=fb&&i===q.answer,isBad=fb&&isSel&&i!==q.answer;return(
              <button key={i} className={"opt "+(isOk?"correct":isBad?"wrong":isSel?"chosen":"")} onClick={()=>handleMC(i)} disabled={answered}>
                <span className="letter">{["A","B","C","D"][i]}</span>
                <span style={{flex:1,textAlign:"left",color:"#e2e8f0",lineHeight:1.5}}>{opt}</span>
                {isOk&&<span style={{color:"#34d399",fontWeight:700}}>OK</span>}
                {isBad&&<span style={{color:"#f87171",fontWeight:700}}>X</span>}
              </button>
            );})}
          </div>
        )}
        {q.type==="development"&&(
          <div>
            <textarea rows={5} placeholder="Escribe aqui tu respuesta..." value={devText} onChange={e=>setDevText(e.target.value)} disabled={answered} style={{marginBottom:12,lineHeight:1.7}}/>
            {!answered&&<button className="btn btn-sky" onClick={handleDev} disabled={!devText.trim()||checking} style={{height:44}}>
              {checking?<><div className="spinner" style={{borderTopColor:"#fff"}}/>Evaluando con IA...</>:"Verificar mi respuesta"}
            </button>}
          </div>
        )}
        <FeedbackCard fb={fb} question={q}/>
      </div>
      <div className="sticky-nav">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:720,margin:"0 auto"}}>
          <div>{cur>0&&<button className="btn btn-outline" onClick={goPrev} style={{height:46}}>Anterior</button>}</div>
          <div>
            {!isLast
              ?<button className="btn btn-sky" onClick={goNext} disabled={!answered} style={{height:46,minWidth:140}}>Siguiente</button>
              :<button className="btn btn-sky" onClick={()=>onFinish({feedback,correctCount})} disabled={!answered} style={{height:46,minWidth:160,background:"linear-gradient(135deg,#10b981,#059669)"}}>Ver resultados</button>
            }
          </div>
        </div>
      </div>
      {showRes&&(
        <div className="modal-bg" onClick={()=>setShowRes(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:17,fontWeight:700,color:"#fff"}}>Recursos relacionados</h2>
              <button className="btn-ghost" onClick={()=>setShowRes(false)}>X</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {resources.slice(0,5).map((r,i)=>(
                <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{display:"block",padding:"14px 16px",borderRadius:12,border:"1.5px solid #1e1e2e",background:"#0a0a0f",textDecoration:"none",transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#0ea5e9";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";}}>
                  <div style={{fontWeight:600,fontSize:13,color:"#e2e8f0",marginBottom:4}}>{r.title}</div>
                  <div style={{fontSize:12,color:"#475569",lineHeight:1.5}}>{r.snippet}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Results({quiz,result,onRestart,onHome}) {
  const [open,setOpen]=useState(null);
  const total=quiz.length, pct=Math.round((result.correctCount/total)*100), clr=pctColor(pct);
  const grade=pct>=90?"Sobresaliente":pct>=80?"Excelente":pct>=65?"Muy bien":pct>=50?"Regular":"A repasar";
  const motivational=pct>=80?"Excelente desempeno! Dominas muy bien este tema.":pct>=65?"Buen trabajo! Sigue practicando para mejorar.":pct>=50?"Vas por buen camino. Repasa los temas marcados.":"No te rindas. Revisa el contenido y vuelve a intentarlo.";
  const typeCount=t=>quiz.filter(q=>q.type===t).length;
  const typeOk=t=>quiz.reduce((a,q,i)=>q.type===t&&result.feedback[i]?.correct===true?a+1:a,0);
  const weakTopics=[...new Set(quiz.filter((q,i)=>result.feedback[i]?.correct===false).map(q=>q.topic).filter(Boolean))].slice(0,3);
  const strongTopics=[...new Set(quiz.filter((q,i)=>result.feedback[i]?.correct===true).map(q=>q.topic).filter(Boolean))].slice(0,3);
  return (
    <div className="fu" style={{maxWidth:680,margin:"0 auto",paddingBottom:40}}>
      <div className="card" style={{textAlign:"center",marginBottom:16}}>
        <div className="pop" style={{width:120,height:120,borderRadius:"50%",border:"3px solid "+clr,margin:"16px auto 20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:clr+"10",boxShadow:"0 0 30px "+clr+"30"}}>
          <span style={{fontFamily:"'JetBrains Mono'",fontSize:32,fontWeight:700,color:clr,lineHeight:1}}>{pct}%</span>
          <span style={{fontSize:11,color:"#475569",marginTop:4}}>{result.correctCount}/{total}</span>
        </div>
        <h2 style={{fontSize:24,fontWeight:800,color:clr,marginBottom:8}}>{grade}</h2>
        <p style={{color:"#94a3b8",fontSize:14,marginBottom:4}}>{result.correctCount} de {total} preguntas correctas</p>
        <p style={{color:"#64748b",fontSize:13,fontStyle:"italic",marginBottom:20}}>{motivational}</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
          <button className="btn btn-sky" onClick={onRestart} style={{flex:"1 1 140px",maxWidth:200,height:44,fontSize:14}}>Nuevo Quiz</button>
          <button className="btn btn-outline" onClick={onHome} style={{flex:"1 1 140px",maxWidth:200,height:44,fontSize:14}}>Volver al Inicio</button>
        </div>
        {(weakTopics.length>0||strongTopics.length>0)&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,textAlign:"left"}}>
            {strongTopics.length>0&&(<div style={{padding:"14px 16px",borderRadius:14,background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)"}}><div style={{fontSize:11,fontWeight:700,color:"#34d399",letterSpacing:".06em",marginBottom:8}}>FORTALEZAS</div>{strongTopics.map((t,i)=><div key={i} style={{fontSize:12,color:"#86efac",marginTop:i>0?4:0}}>{t}</div>)}</div>)}
            {weakTopics.length>0&&(<div style={{padding:"14px 16px",borderRadius:14,background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)"}}><div style={{fontSize:11,fontWeight:700,color:"#fbbf24",letterSpacing:".06em",marginBottom:8}}>REFORZAR</div>{weakTopics.map((t,i)=><div key={i} style={{fontSize:12,color:"#fde68a",marginTop:i>0?4:0}}>{t}</div>)}</div>)}
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginTop:20}}>
          {[{type:"multiple",label:"Seleccion",color:"#38bdf8"},{type:"development",label:"Desarrollo",color:"#fbbf24"}].filter(s=>typeCount(s.type)>0).map(s=>(
            <div key={s.type} className="stat-box" style={{textAlign:"center"}}>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:20,fontWeight:600,color:s.color}}>{typeOk(s.type)}/{typeCount(s.type)}</span>
              <span style={{fontSize:10,color:"#475569",marginTop:4,display:"block"}}>{s.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
      <h3 style={{fontSize:13,fontWeight:700,color:"#334155",letterSpacing:".06em",marginBottom:12,paddingLeft:4}}>DETALLE DE RESPUESTAS</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {quiz.map((q,i)=>{const fb=result.feedback[i],ok=fb?.correct===true,bad=fb?.correct===false;return(
          <button key={i} className="res-row" onClick={()=>setOpen(open===i?null:i)}>
            <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,background:ok?"rgba(16,185,129,.2)":bad?"rgba(244,63,94,.2)":"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:ok?"#34d399":bad?"#f87171":"#475569",marginTop:1}}>{ok?"V":bad?"X":"~"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:open===i?"normal":"nowrap",color:"#e2e8f0",lineHeight:1.5}}>{i+1}. {q.question}</div>
              {open===i&&fb?.explanation&&<div className="fu" style={{fontSize:12,color:"#94a3b8",marginTop:8,lineHeight:1.7}}>{cleanText(fb.explanation)}</div>}
              {open===i&&q.source_title&&<div style={{padding:"6px 10px",borderRadius:8,background:"rgba(139,92,246,.08)",border:"1px solid rgba(139,92,246,.2)",marginTop:6}}>{q.source_url?<a href={q.source_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#38bdf8",textDecoration:"underline"}}>{q.source_title}</a>:<span style={{fontSize:11,color:"#94a3b8"}}>{q.source_title}</span>}</div>}
            </div>
            <span style={{fontSize:12,color:"#334155",flexShrink:0,marginTop:2}}>{open===i?"^":"v"}</span>
          </button>
        );})}
      </div>
    </div>
  );
}

function History() {
  const results = getResults();
  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"36px 16px 40px"}} className="fu">
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:4,color:"#fff"}}>Mi historial</h1>
        <p style={{color:"#475569",fontSize:13}}>{results.length} evaluaciones completadas</p>
      </div>
      {results.length===0?(
        <div className="card" style={{textAlign:"center",padding:"56px 24px"}}>
          <p style={{fontWeight:700,marginBottom:6,color:"#e2e8f0",fontSize:16}}>Sin evaluaciones aun</p>
          <p style={{color:"#475569",fontSize:13}}>Genera tu primer cuestionario para ver tu historial aqui.</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {results.map((r,i)=>(
            <div key={i} style={{background:"#0d0d0d",border:"1.5px solid #1e1e2e",borderRadius:16,padding:"16px 20px",display:"flex",alignItems:"center",gap:16,transition:"border-color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#2d2d3e"} onMouseLeave={e=>e.currentTarget.style.borderColor="#1e1e2e"}>
              <div style={{width:52,height:52,borderRadius:"50%",border:"2.5px solid "+pctColor(r.pct),display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,background:pctColor(r.pct)+"10"}}>
                <span style={{fontFamily:"'JetBrains Mono'",fontSize:14,fontWeight:700,color:pctColor(r.pct),lineHeight:1}}>{r.pct}%</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#e2e8f0"}}>{r.topic}</div>
                <div style={{fontSize:12,color:"#475569"}}>{r.correct}/{r.total} correctas - {fmtDate(r.ts)}</div>
              </div>
              <span className={"chip "+(r.pct>=75?"chip-em":r.pct>=50?"chip-am":"chip-dark")}>{r.pct>=75?"Excelente":r.pct>=50?"Regular":"Repasar"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SCREEN = { AUTH:0, HOME:1, QUIZ_INPUT:2, QUIZ_LOADING:3, QUIZ_ACTIVE:4, RESULTS:5, HISTORY:6 };

export default function App() {
  const [user,setUser] = useState(null);
  const [screen,setScreen] = useState(SCREEN.AUTH);
  const [loading,setLoading] = useState(true);
  const [phase,setPhase] = useState(0);
  const [quiz,setQuiz] = useState(null);
  const [resources,setResources] = useState([]);
  const [result,setResult] = useState(null);
  const [topic,setTopic] = useState("");
  const {Toast,show} = useToast();

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u => {
      if(u) {
        setUser({name:u.displayName||"Usuario",email:u.email,photo:u.photoURL,uid:u.uid});
        setScreen(SCREEN.HOME);
      } else {
        setUser(null);
        setScreen(SCREEN.AUTH);
      }
      setLoading(false);
    });
    return ()=>unsub();
  },[]);

  const handleLogin = u => { setUser(u); setScreen(SCREEN.HOME); };
  const handleLogout = async () => { await signOut(auth); setUser(null); setScreen(SCREEN.AUTH); };

  const nav = p => {
    if(p==="home") setScreen(SCREEN.HOME);
    else if(p==="quiz") setScreen(SCREEN.QUIZ_INPUT);
    else if(p==="history") setScreen(SCREEN.HISTORY);
  };

  const handleGenerate = async ({mode,text,imgData,numMC,numDev}) => {
    setScreen(SCREEN.QUIZ_LOADING); setPhase(0);
    try {
      let content=text;
      if(mode==="image"&&imgData){
        content=await callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgData}},{type:"text",text:"Transcribe y resume todo el contenido educativo visible en la imagen."}]}],"Eres un experto en educacion. Transcribe el contenido de manera clara. Responde en espanol.");
      }
      setPhase(1);
      const prompt="Genera exactamente "+numMC+" preguntas de seleccion multiple y "+numDev+" preguntas de desarrollo sobre este contenido educativo.\n\nContenido:\n"+content+"\n\nDevuelve SOLO un JSON valido con esta estructura exacta:\n{\n  \"topic\": \"tema principal\",\n  \"questions\": [\n    {\n      \"type\": \"multiple\",\n      \"question\": \"pregunta clara con una sola respuesta correcta\",\n      \"options\": [\"opcion A\", \"opcion B\", \"opcion C\", \"opcion D\"],\n      \"answer\": 0,\n      \"explanation\": \"explicacion breve y factualmente correcta\",\n      \"topic\": \"subtema\",\n      \"source_title\": \"titulo de la fuente academica\",\n      \"source_url\": \"URL real o vacia si no hay\",\n      \"source_type\": \"oficial o academica o educativa\",\n      \"confidence\": \"alto o medio o bajo\"\n    }\n  ]\n}\n\nREGLAS CRITICAS:\n1. CADA pregunta DEBE tener source_title obligatoriamente.\n2. Para source_title usa SOLO fuentes reales: Curriculo Nacional MINEDUC, BCN - Biblioteca del Congreso Nacional, Memoria Chilena - DIBAM, Khan Academy, Britannica, NASA, NIH, UNESCO, o escribe: Fuente no verificada.\n3. Para source_url pon la URL real si la conoces con certeza, si no deja vacia.\n4. NO inventes informacion, fechas ni datos.\n5. Si una pregunta tiene ambiguedad, reformulala.\n6. Total exacto: "+(numMC+numDev)+" preguntas.";
      const raw=await callClaude([{role:"user",content:prompt}],"Eres un asistente academico especializado en educacion chilena de ensenanza media. Prioriza SIEMPRE precision y veracidad factual. Cada pregunta DEBE incluir source_title con una fuente real y verificable. No inventes informacion. Responde SOLO con JSON valido sin texto adicional.",null,HAIKU);
      const parsed=parseJSON(raw);
      if(!parsed?.questions?.length) throw new Error("Error al generar");
      setTopic(parsed.topic||"Cuestionario"); setQuiz(parsed.questions);
      setPhase(2);
      let webRes=[];
      try{const sr=await callClaude([{role:"user",content:"Busca recursos educativos sobre: \""+parsed.topic+"\""}],"Investigador educativo. SOLO JSON: [{\"title\":\"...\",\"url\":\"...\",\"snippet\":\"...\"}]",[{type:"web_search_20250305",name:"web_search"}]);const arr=parseJSON(sr);webRes=Array.isArray(arr)?arr:[];}catch{}
      setResources(webRes); setScreen(SCREEN.QUIZ_ACTIVE);
    } catch(e) {
      console.error(e); show("Error al generar. Intenta de nuevo.","err"); setScreen(SCREEN.QUIZ_INPUT);
    }
  };

  const handleFinish = r => {
    setResult(r);
    addResult({ts:Date.now(),topic,pct:Math.round((r.correctCount/quiz.length)*100),correct:r.correctCount,total:quiz.length});
    show("Resultado guardado","ok");
    setScreen(SCREEN.RESULTS);
  };

  const resetQuiz = () => { setScreen(SCREEN.QUIZ_INPUT); setQuiz(null); setResult(null); };
  const isQuizScreen = [SCREEN.QUIZ_INPUT,SCREEN.QUIZ_LOADING,SCREEN.QUIZ_ACTIVE,SCREEN.RESULTS].includes(screen);

  if(loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000"}}>
      <div style={{textAlign:"center"}}>
        <Logo size={48}/>
        <p style={{color:"#475569",fontSize:13,marginTop:16}}>Cargando...</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div style={{position:"fixed",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#0ea5e9,#8b5cf6,transparent)",zIndex:200}}/>
      {screen===SCREEN.AUTH && <Auth onLogin={handleLogin}/>}
      {user && screen!==SCREEN.AUTH && (
        <>
          <TopBar user={user} onNav={nav} onLogout={handleLogout}/>
          <div style={{minHeight:"100vh",paddingTop:62,paddingBottom:20}}>
            <div style={{maxWidth:960,margin:"0 auto",padding:"0 16px"}}>
              {isQuizScreen && screen!==SCREEN.QUIZ_LOADING && (
                <div style={{paddingTop:32}}>
                  <StepBar step={screen===SCREEN.QUIZ_INPUT?0:screen===SCREEN.QUIZ_ACTIVE?1:2}/>
                </div>
              )}
              {screen===SCREEN.HOME && <Home user={user} onNav={nav}/>}
              {screen===SCREEN.QUIZ_INPUT && <QuizInput onGenerate={handleGenerate}/>}
              {screen===SCREEN.QUIZ_LOADING && <Loading phase={phase}/>}
              {screen===SCREEN.QUIZ_ACTIVE && quiz && <Quiz quiz={quiz} resources={resources} onFinish={handleFinish} onRestart={resetQuiz}/>}
              {screen===SCREEN.RESULTS && quiz && result && <Results quiz={quiz} result={result} onRestart={resetQuiz} onHome={()=>setScreen(SCREEN.HOME)}/>}
              {screen===SCREEN.HISTORY && <History/>}
            </div>
          </div>
          <Footer/>
        </>
      )}
      {Toast}
    </>
  );
}



