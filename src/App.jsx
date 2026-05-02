import { useState, useRef, useCallback, useEffect } from "react";
import * as mammoth from "mammoth";

const D = {
  bg:"#000",s1:"#0a0a0a",card:"#111",border:"#1e1e1e",
  sky:"#0ea5e9",skydim:"rgba(14,165,233,.1)",skyglow:"rgba(14,165,233,.22)",
  em:"#10b981",emdim:"rgba(16,185,129,.1)",
  ro:"#f43f5e",rodim:"rgba(244,63,94,.1)",
  am:"#f59e0b",amdim:"rgba(245,158,11,.1)",
  text:"#fff",sub:"#a1a1aa",muted:"#52525b",line:"#1a1a1a",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#000;color:#fff;font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:#0ea5e9;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pop{0%{transform:scale(.82);opacity:0}65%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both}
.sr{animation:slideR .32s cubic-bezier(.22,1,.36,1) both}
.pop{animation:pop .45s cubic-bezier(.22,1,.36,1) both}
input[type=text],input[type=email],input[type=password],textarea{width:100%;background:#0a0a0a;border:1px solid #1e1e1e;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;padding:13px 15px;outline:none;transition:border-color .18s,box-shadow .18s;}
textarea{resize:vertical}
input::placeholder,textarea::placeholder{color:#52525b}
input:focus,textarea:focus{border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.1)}
input.err{border-color:#f43f5e}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:12px 22px;border-radius:10px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:700;font-size:14px;transition:all .18s;white-space:nowrap}
.btn-sky{background:#0ea5e9;color:#000;box-shadow:0 0 20px rgba(14,165,233,.22)}
.btn-sky:hover{background:#38bdf8;box-shadow:0 0 32px rgba(14,165,233,.3);transform:translateY(-1px)}
.btn-sky:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
.btn-outline{background:transparent;color:#a1a1aa;border:1px solid #1e1e1e}
.btn-outline:hover{border-color:#0ea5e9;color:#0ea5e9;background:rgba(14,165,233,.08)}
.btn-ghost{background:transparent;color:#52525b;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;font-size:13px;padding:6px;transition:color .15s}
.btn-ghost:hover{color:#0ea5e9}
.btn-full{width:100%}
.card{background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:26px}
.glass{background:rgba(10,10,10,.92);backdrop-filter:blur(20px);border:1px solid #1e1e1e;border-radius:18px;padding:28px}
.tab-bar{display:flex;background:#0a0a0a;border:1px solid #1e1e1e;border-radius:10px;padding:3px;gap:3px;margin-bottom:24px}
.tab{flex:1;padding:9px;border-radius:7px;border:none;background:transparent;color:#52525b;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .18s;text-align:center}
.tab.on{background:#0ea5e9;color:#000;box-shadow:0 0 16px rgba(14,165,233,.2)}
.field{margin-bottom:15px}
.field label{display:block;font-size:11px;font-weight:700;color:#52525b;letter-spacing:.06em;margin-bottom:7px}
.field-err{font-size:11px;color:#f43f5e;margin-top:4px}
.opt{width:100%;text-align:left;padding:13px 16px;border-radius:10px;border:1px solid #1e1e1e;background:#0a0a0a;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .16s;display:flex;align-items:center;gap:12px}
.opt:hover:not(:disabled){border-color:#0ea5e9;background:rgba(14,165,233,.08)}
.opt.chosen{border-color:#0ea5e9;background:rgba(14,165,233,.08)}
.opt.correct{border-color:#10b981;background:rgba(16,185,129,.08)}
.opt.wrong{border-color:#f43f5e;background:rgba(244,63,94,.08)}
.opt:disabled{cursor:default}
.letter{width:28px;height:28px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;border:1px solid #1e1e1e;background:#1a1a1a;color:#52525b;transition:all .16s}
.opt.chosen .letter{border-color:#0ea5e9;background:#0ea5e9;color:#000}
.opt.correct .letter{border-color:#10b981;background:#10b981;color:#000}
.opt.wrong .letter{border-color:#f43f5e;background:#f43f5e;color:#fff}
.prog-track{height:3px;border-radius:2px;background:#1a1a1a;overflow:hidden}
.prog-fill{height:100%;border-radius:2px;background:#0ea5e9;transition:width .5s ease}
.chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.04em}
.chip-sky{background:rgba(14,165,233,.1);color:#0ea5e9;border:1px solid rgba(14,165,233,.2)}
.chip-em{background:rgba(16,185,129,.1);color:#10b981;border:1px solid rgba(16,185,129,.2)}
.chip-am{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2)}
.chip-dark{background:#1a1a1a;color:#52525b;border:1px solid #1e1e1e}
.tog-group{display:flex;background:#0a0a0a;border:1px solid #1e1e1e;border-radius:10px;padding:3px;gap:3px}
.tog-item{flex:1;padding:9px 10px;border-radius:7px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#52525b;cursor:pointer;transition:all .18s;text-align:center}
.tog-item.on{background:#0ea5e9;color:#000;box-shadow:0 0 14px rgba(14,165,233,.2)}
.spinner{width:20px;height:20px;border:2px solid #1e1e1e;border-top-color:#0ea5e9;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.drop{border:1.5px dashed #1e1e1e;border-radius:12px;padding:40px 20px;text-align:center;cursor:pointer;background:#0a0a0a;transition:all .18s}
.drop:hover,.drop.over{border-color:#0ea5e9;background:rgba(14,165,233,.06)}
.upload-fab{position:absolute;bottom:10px;right:10px;display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;border:1px solid #1e1e1e;background:#111;color:#52525b;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .18s;z-index:2}
.upload-fab:hover{border-color:#0ea5e9;color:#0ea5e9;background:rgba(14,165,233,.08)}
.textarea-wrap{position:relative}
.file-pill{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:9px;border:1px solid rgba(14,165,233,.25);background:rgba(14,165,233,.08);margin-bottom:10px;font-size:13px}
.topbar{position:sticky;top:0;z-index:100;background:rgba(0,0,0,.9);backdrop-filter:blur(16px);border-bottom:1px solid #1e1e1e;padding:0 20px}
.topbar-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;height:58px;gap:12px}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:300;padding:16px;animation:fadeIn .2s ease}
.modal{background:#111;border:1px solid #1e1e1e;border-radius:20px;padding:28px;max-width:480px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,.7);animation:slideUp .3s cubic-bezier(.22,1,.36,1)}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;border:1px solid #1e1e1e;border-radius:12px;padding:12px 20px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;z-index:999;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:fadeUp .3s ease;white-space:nowrap}
.stat-box{background:#0a0a0a;border:1px solid #1e1e1e;border-radius:12px;padding:18px}
.nav-btn{background:transparent;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;padding:6px 12px;border-radius:7px;transition:all .18s}
.res-row{background:#111;border:1px solid #1e1e1e;border-radius:12px;padding:13px 15px;display:flex;align-items:flex-start;gap:11px;cursor:pointer;width:100%;text-align:left;font-family:'DM Sans',sans-serif}
.r-link{display:block;padding:12px 14px;border-radius:10px;border:1px solid #1e1e1e;background:#0a0a0a;text-decoration:none;transition:all .16s}
.r-link:hover{border-color:#0ea5e9;background:rgba(14,165,233,.06)}
input[type=range]{-webkit-appearance:none;width:100%;height:3px;border-radius:2px;background:#1e1e1e;outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#0ea5e9;box-shadow:0 0 8px rgba(14,165,233,.3);cursor:pointer}
@media(max-width:600px){.card,.glass{padding:18px}.modal{margin:0;border-radius:16px 16px 0 0;position:fixed;bottom:0;left:0;right:0;max-width:100%}.modal-bg{align-items:flex-end}}
`;

const SK = { user:"eq:user", users:"eq:users", results:"eq:results" };
const LS = {
  get: k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} },
  del: k => { try { localStorage.removeItem(k); } catch {} },
};
const getUsers = () => LS.get(SK.users) || {};
const getMe = () => LS.get(SK.user);
const setMe = u => LS.set(SK.user, u);
const logout = () => LS.del(SK.user);
const getResults = () => LS.get(SK.results) || [];
const addResult = r => { const arr = [r, ...getResults()].slice(0,100); LS.set(SK.results, arr); };

// API Key desde variable de entorno o hardcoded como respaldo
const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY || "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";

async function callClaude(messages, system, tools=null) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages };
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

function parseJSON(raw) { try { return JSON.parse(raw.replace(/```json|```/g,"").trim()); } catch { return null; } }
function pctColor(p) { return p>=75?D.em:p>=50?D.am:D.ro; }
function fmtDate(ts) { return new Date(ts).toLocaleDateString("es-CL",{day:"2-digit",month:"short",year:"numeric"}); }

async function extractFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (["txt","md","csv"].includes(ext)) return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=rej; r.readAsText(file,"UTF-8"); });
  if (["doc","docx"].includes(ext)) { const buf=await file.arrayBuffer(); const result=await mammoth.extractRawText({arrayBuffer:buf}); return result.value; }
  if (ext==="pdf") {
    const b64=await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
    return callClaude([{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:"Extrae todo el contenido educativo de este PDF."}]}],"Extraes texto de PDFs. Responde en español.");
  }
  throw new Error(`Formato .${ext} no soportado. Usa PDF, Word o TXT.`);
}

function useToast() {
  const [t,setT] = useState(null);
  const show = (msg,type="ok") => { setT({msg,type}); setTimeout(()=>setT(null),2800); };
  const Toast = t ? (
    <div className="toast" style={{color: t.type==="ok"?D.em:t.type==="err"?D.ro:D.sky}}>
      <span style={{fontWeight:800}}>{t.type==="ok"?"✓":t.type==="err"?"✕":"ℹ"}</span>
      <span style={{color:D.text}}>{t.msg}</span>
    </div>
  ) : null;
  return {Toast, show};
}

function Logo({size=34}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:9}}>
      <div style={{width:size,height:size,borderRadius:9,background:D.sky,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px ${D.skyglow}`,flexShrink:0}}>
        <span style={{color:"#000",fontWeight:700,fontSize:size*.4,fontFamily:"'DM Mono'"}}>EQ</span>
      </div>
      <div>
        <div style={{fontWeight:700,fontSize:14,lineHeight:1}}>EduQuiz<span style={{color:D.sky}}>Pro</span></div>
        <div style={{fontSize:9,color:D.muted,fontWeight:600,letterSpacing:".1em"}}>Creado por Manu</div>
      </div>
    </div>
  );
}

function StepBar({step}) {
  const labels = ["Contenido","Cuestionario","Resultados"];
  return (
    <div style={{display:"flex",alignItems:"center",maxWidth:340,margin:"0 auto 32px"}}>
      {labels.map((l,i) => (
        <div key={i} style={{display:"flex",alignItems:"center",flex:i<labels.length-1?1:"none"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,
              background:i<step?D.em:i===step?D.sky:D.line,color:i<=step?"#000":D.muted,transition:"all .3s",
              boxShadow:i===step?`0 0 12px ${D.skyglow}`:"none"}}>
              {i<step?"✓":i+1}
            </div>
            <span style={{fontSize:10,fontWeight:600,color:i===step?D.sky:D.muted,whiteSpace:"nowrap"}}>{l}</span>
          </div>
          {i<labels.length-1&&<div style={{flex:1,height:1,background:i<step?D.em:D.border,margin:"0 7px",marginBottom:15,transition:"background .3s"}}/>}
        </div>
      ))}
    </div>
  );
}

function Auth({onLogin, showToast}) {
  const [tab,setTab] = useState("login");
  const [f,setF] = useState({name:"",email:"",pass:"",confirm:""});
  const [errs,setErrs] = useState({});
  const [loading,setLoading] = useState(false);
  const set = (k,v) => { setF(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:""})); };
  const validate = () => {
    const e={};
    if(tab==="register"&&!f.name.trim()) e.name="Ingresa tu nombre";
    if(!f.email.includes("@")) e.email="Email invalido";
    if(f.pass.length<6) e.pass="Minimo 6 caracteres";
    if(tab==="register"&&f.pass!==f.confirm) e.confirm="Las contrasenas no coinciden";
    setErrs(e); return Object.keys(e).length===0;
  };
  const submit = async () => {
    if(!validate()) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const users = getUsers();
    if(tab==="register") {
      if(users[f.email.toLowerCase()]) { setErrs({email:"Email ya registrado"}); setLoading(false); return; }
      const u={name:f.name.trim(),email:f.email.toLowerCase(),pass:f.pass,joinedAt:Date.now()};
      users[f.email.toLowerCase()]=u; LS.set(SK.users,users); setMe(u);
      showToast(`Bienvenido/a, ${u.name}!`,"ok"); onLogin(u);
    } else {
      const u=users[f.email.toLowerCase()];
      if(!u||u.pass!==f.pass) { setErrs({pass:"Email o contrasena incorrectos"}); setLoading(false); return; }
      setMe(u); showToast(`Hola de nuevo, ${u.name}!`,"ok"); onLogin(u);
    }
    setLoading(false);
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"-10%",right:"-5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,.09),transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"-5%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(16,185,129,.06),transparent 70%)"}}/>
      </div>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${D.sky},${D.em},transparent)`}}/>
      <div className="fu" style={{width:"100%",maxWidth:400,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:28}}><Logo size={42}/></div>
        <div style={{textAlign:"center",marginBottom:20}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:999,background:D.emdim,border:`1px solid rgba(16,185,129,.25)`,fontSize:12,fontWeight:700,color:D.em}}>
            100% GRATIS - Sin tarjeta, sin limites
          </span>
        </div>
        <div className="glass">
          <div className="tab-bar">
            <button className={`tab ${tab==="login"?"on":""}`} onClick={()=>setTab("login")}>Iniciar sesion</button>
            <button className={`tab ${tab==="register"?"on":""}`} onClick={()=>setTab("register")}>Registro gratis</button>
          </div>
          {tab==="register"&&(
            <div className="field">
              <label>NOMBRE COMPLETO</label>
              <input type="text" className={errs.name?"err":""} placeholder="Tu nombre" value={f.name} onChange={e=>set("name",e.target.value)}/>
              {errs.name&&<div className="field-err">! {errs.name}</div>}
            </div>
          )}
          <div className="field">
            <label>EMAIL</label>
            <input type="email" className={errs.email?"err":""} placeholder="tu@email.com" value={f.email} onChange={e=>set("email",e.target.value)}/>
            {errs.email&&<div className="field-err">! {errs.email}</div>}
          </div>
          <div className="field">
            <label>CONTRASENA</label>
            <input type="password" className={errs.pass?"err":""} placeholder="Minimo 6 caracteres" value={f.pass} onChange={e=>set("pass",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
            {errs.pass&&<div className="field-err">! {errs.pass}</div>}
          </div>
          {tab==="register"&&(
            <div className="field">
              <label>CONFIRMAR CONTRASENA</label>
              <input type="password" className={errs.confirm?"err":""} placeholder="Repite tu contrasena" value={f.confirm} onChange={e=>set("confirm",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
              {errs.confirm&&<div className="field-err">! {errs.confirm}</div>}
            </div>
          )}
          <button className="btn btn-sky btn-full" onClick={submit} disabled={loading} style={{marginTop:4}}>
            {loading?<><div className="spinner" style={{borderTopColor:"#000"}}/>Procesando...</>:tab==="login"?"Ingresar ->":"Crear cuenta gratis ->"}
          </button>
          {tab==="login"&&<div style={{textAlign:"center",marginTop:14}}><button className="btn-ghost" onClick={()=>setTab("register")}>No tienes cuenta? Registrate</button></div>}
        </div>
      </div>
    </div>
  );
}

function TopBar({user,page,onNav,onLogout}) {
  const pages=[{id:"home",label:"Inicio"},{id:"quiz",label:"Nuevo Quiz"},{id:"history",label:"Mi historial"}];
  return (
    <div className="topbar">
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${D.sky},${D.em},transparent)`}}/>
      <div className="topbar-inner">
        <Logo size={28}/>
        <div style={{display:"flex",gap:2,marginLeft:"auto"}}>
          {pages.map(p=>(
            <button key={p.id} className="nav-btn" style={{color:page===p.id?D.sky:D.muted,background:page===p.id?D.skydim:"transparent",border:page===p.id?`1px solid rgba(14,165,233,.15)`:"1px solid transparent"}} onClick={()=>onNav(p.id)}>{p.label}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:D.skydim,border:`1px solid rgba(14,165,233,.2)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:D.sky,cursor:"pointer"}} onClick={()=>onNav("profile")}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button className="btn-ghost" onClick={onLogout} style={{fontSize:12}}>Salir</button>
        </div>
      </div>
    </div>
  );
}

function Home({user,onNav}) {
  const results = getResults();
  const stats = {
    total: results.length,
    avgPct: results.length ? Math.round(results.reduce((a,r)=>a+r.pct,0)/results.length) : 0,
    best: results.length ? Math.max(...results.map(r=>r.pct)) : 0,
  };
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"32px 16px 60px"}} className="fu">
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:4}}>Hola, {user.name.split(" ")[0]}</h1>
        <p style={{color:D.muted,fontSize:14}}>Todo es gratis - sin limites, sin tarjeta.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
        {[
          {label:"Quizzes realizados",val:stats.total,color:D.sky},
          {label:"Promedio general",val:`${stats.avgPct}%`,color:pctColor(stats.avgPct)},
          {label:"Mejor puntaje",val:`${stats.best}%`,color:D.em},
        ].map((s,i)=>(
          <div key={i} className="stat-box">
            <div style={{fontFamily:"'DM Mono'",fontSize:26,fontWeight:500,color:s.color,lineHeight:1}}>{s.val||"0"}</div>
            <div style={{fontSize:10,color:D.muted,marginTop:4,fontWeight:600}}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-sky btn-full" style={{fontSize:16,padding:"16px",borderRadius:12,marginBottom:14}} onClick={()=>onNav("quiz")}>
        Generar nuevo cuestionario
      </button>
      <div className="card">
        <h3 style={{fontWeight:700,fontSize:14,marginBottom:14,color:D.muted,letterSpacing:".04em"}}>ACCESO RAPIDO</h3>
        {[
          {label:"Nuevo cuestionario",sub:"Desde texto, PDF, Word o foto",action:"quiz",color:D.sky},
          {label:"Mi historial",sub:`${stats.total} evaluaciones guardadas`,action:"history",color:D.am},
        ].map((a,i)=>(
          <button key={i} onClick={()=>onNav(a.action)} style={{all:"unset",cursor:"pointer",width:"100%",display:"block",marginBottom:i===0?10:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:11,background:D.s1,border:`1px solid ${D.border}`,transition:"all .16s"}}>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{a.label}</div><div style={{fontSize:12,color:D.muted}}>{a.sub}</div></div>
              <span style={{color:D.muted}}>-&gt;</span>
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
  const [numMC,setNumMC] = useState(10);
  const [numTF,setNumTF] = useState(5);
  const [numDev,setNumDev] = useState(3);
  const [drag,setDrag] = useState(false);
  const [file,setFile] = useState(null);
  const [extracting,setExtracting] = useState(false);
  const [extractErr,setExtractErr] = useState("");
  const fileRef=useRef(); const camRef=useRef(); const uploadRef=useRef();
  const total=numMC+numTF+numDev;
  const effectiveText = file?file.text:text;
  const canGo = mode==="text"?effectiveText.trim().length>20:!!imgData;
  const handleImg = f => { if(!f) return; const r=new FileReader(); r.onload=e=>{setImgPrev(e.target.result);setImgData(e.target.result.split(",")[1]);}; r.readAsDataURL(f); };
  const onDrop = useCallback(e=>{ e.preventDefault();setDrag(false); const f=e.dataTransfer.files[0]; if(f?.type.startsWith("image/")) handleImg(f); },[]);
  const handleDoc = async f => {
    if(!f) return;
    setExtractErr(""); setFile(null); setExtracting(true);
    try { const t=await extractFile(f); if(!t?.trim()) throw new Error("No se pudo extraer texto."); setFile({name:f.name,text:t}); setText(""); }
    catch(e) { setExtractErr(e.message); }
    setExtracting(false);
  };
  const sliders = [
    {label:"Seleccion Unica",sub:"A B C D",val:numMC,set:setNumMC,max:80,color:D.sky},
    {label:"Verdadero / Falso",sub:"Verificacion inmediata",val:numTF,set:setNumTF,max:60,color:D.em},
    {label:"Desarrollo",sub:"Evaluacion con IA",val:numDev,set:setNumDev,max:40,color:D.am},
  ];
  return (
    <div className="fu" style={{maxWidth:640,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <h1 style={{fontSize:26,fontWeight:800,marginBottom:6}}>Nuevo cuestionario</h1>
        <p style={{color:D.sub,fontSize:14}}>Ingresa el contenido y configura las preguntas</p>
      </div>
      <div className="card">
        <div className="tog-group" style={{marginBottom:20}}>
          <button className={`tog-item ${mode==="text"?"on":""}`} onClick={()=>setMode("text")}>Texto / Archivo</button>
          <button className={`tog-item ${mode==="image"?"on":""}`} onClick={()=>setMode("image")}>Foto del cuaderno</button>
        </div>
        {mode==="text"&&(
          <div>
            {file&&(
              <div className="file-pill">
                <span style={{color:D.sky,fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file.name}</span>
                <span style={{fontSize:11,color:D.em,fontWeight:700,flexShrink:0}}>Listo</span>
                <button onClick={()=>setFile(null)} style={{background:"none",border:"none",color:D.muted,cursor:"pointer",fontSize:16,lineHeight:1}}>x</button>
              </div>
            )}
            {extracting&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:9,background:D.s1,border:`1px solid ${D.border}`,fontSize:13,color:D.muted,marginBottom:10}}><div className="spinner" style={{width:16,height:16}}/> Leyendo archivo...</div>}
            {extractErr&&<div style={{padding:"10px 14px",borderRadius:9,background:D.rodim,border:`1px solid rgba(244,63,94,.2)`,color:D.ro,fontSize:13,marginBottom:10}}>! {extractErr}</div>}
            {!file&&(
              <div className="textarea-wrap">
                <textarea rows={7} placeholder="Pega aqui el texto de tu libro, apuntes, publicacion o cualquier contenido educativo..." value={text} onChange={e=>setText(e.target.value)} style={{paddingBottom:48}}/>
                <button className="upload-fab" onClick={()=>uploadRef.current.click()}>
                  Subir archivo
                </button>
              </div>
            )}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
              {["PDF","Word","TXT","MD"].map(f=>(
                <span key={f} style={{fontSize:10,fontWeight:600,color:D.muted,padding:"2px 7px",borderRadius:4,border:`1px solid ${D.border}`,background:D.s1}}>{f}</span>
              ))}
            </div>
            <input ref={uploadRef} type="file" accept=".pdf,.doc,.docx,.txt,.md,.csv" style={{display:"none"}} onChange={e=>handleDoc(e.target.files[0])}/>
          </div>
        )}
        {mode==="image"&&(imgPrev?(
          <div style={{position:"relative"}}>
            <img src={imgPrev} alt="prev" style={{width:"100%",borderRadius:10,maxHeight:230,objectFit:"cover"}}/>
            <button className="btn btn-outline" onClick={()=>{setImgData(null);setImgPrev(null);}} style={{position:"absolute",top:8,right:8,fontSize:12,padding:"6px 12px",background:D.card}}>Cambiar</button>
          </div>
        ):(
          <div className={`drop ${drag?"over":""}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>fileRef.current.click()}>
            <p style={{fontWeight:600,marginBottom:4}}>Arrastra la foto o haz clic</p>
            <p style={{fontSize:13,color:D.muted,marginBottom:16}}>Cuaderno, pizarra, libro, apunte...</p>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <button onClick={e=>{e.stopPropagation();fileRef.current.click();}} className="btn btn-outline" style={{fontSize:12,padding:"8px 13px"}}>Galeria</button>
              <button onClick={e=>{e.stopPropagation();camRef.current.click();}} className="btn btn-outline" style={{fontSize:12,padding:"8px 13px"}}>Camara</button>
            </div>
          </div>
        ))}
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
        <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
        <div style={{marginTop:24,borderTop:`1px solid ${D.line}`,paddingTop:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:18}}>
            <span style={{fontWeight:700,fontSize:15}}>Tipo de preguntas</span>
            <span style={{fontFamily:"'DM Mono'",fontSize:24,fontWeight:500,color:total>0?D.sky:D.muted}}>{total}<span style={{fontSize:12,color:D.muted,fontWeight:400}}>/100</span></span>
          </div>
          {sliders.map((s,i)=>(
            <div key={i} style={{marginBottom:14,padding:"13px 15px",borderRadius:12,border:`1px solid ${D.line}`,background:D.s1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontWeight:600,fontSize:13}}>{s.label}<div style={{fontSize:11,color:D.muted}}>{s.sub}</div></div>
                <span style={{fontFamily:"'DM Mono'",fontSize:20,fontWeight:500,color:s.color}}>{s.val}</span>
              </div>
              <input type="range" min={0} max={s.max} value={s.val} style={{accentColor:s.color}} onChange={e=>{const v=+e.target.value;if(total-s.val+v<=100)s.set(v);}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:D.muted,marginTop:2}}><span>0</span><span>{s.max}</span></div>
            </div>
          ))}
        </div>
        <button className="btn btn-sky btn-full" disabled={!canGo||total===0||extracting} onClick={()=>onGenerate({mode,text:effectiveText,imgData,numMC,numTF,numDev})} style={{marginTop:18,fontSize:15,padding:"14px",borderRadius:11}}>
          Generar cuestionario
        </button>
      </div>
    </div>
  );
}

function Loading({phase}) {
  const phases=["Leyendo el contenido...","Generando preguntas con IA...","Buscando recursos relacionados..."];
  return (
    <div style={{maxWidth:360,margin:"80px auto",textAlign:"center"}}>
      <div style={{width:68,height:68,borderRadius:16,background:D.skydim,border:`1px solid rgba(14,165,233,.2)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px",fontSize:28,color:D.sky,animation:"pulse 1.5s infinite"}}>...</div>
      <h2 style={{fontSize:19,fontWeight:700,marginBottom:6}}>{phases[phase]}</h2>
      <p style={{color:D.muted,fontSize:14}}>Unos segundos...</p>
    </div>
  );
}

function Quiz({quiz,resources,onFinish,onRestart}) {
  const [cur,setCur]=useState(0); const [answers,setAnswers]=useState({}); const [feedback,setFeedback]=useState({});
  const [devText,setDevText]=useState(""); const [checking,setChecking]=useState(false); const [showRes,setShowRes]=useState(false);
  const q=quiz[cur]; const answered=answers[cur]!==undefined; const fb=feedback[cur]; const isLast=cur===quiz.length-1;
  const correctCount=Object.values(feedback).filter(f=>f?.correct===true).length;
  const setAns=(i,v)=>setAnswers(p=>({...p,[i]:v}));
  const setFB=(i,v)=>setFeedback(p=>({...p,[i]:v}));
  const handleMC=idx=>{if(answered)return;setAns(cur,idx);setFB(cur,{correct:idx===q.answer,explanation:q.explanation});};
  const handleTF=val=>{if(answered)return;setAns(cur,val);setFB(cur,{correct:val===q.answer,explanation:q.explanation});};
  const handleDev=async()=>{
    if(!devText.trim()||checking)return;
    setChecking(true);setAns(cur,devText);
    try{const res=await callClaude([{role:"user",content:`Pregunta: "${q.question}" Respuesta: "${devText}" Criterios: "${q.answer}" Evalua en 3 oraciones.`}],"Profesor evaluador. Responde en español.");setFB(cur,{correct:null,explanation:res});}
    catch{setFB(cur,{correct:null,explanation:q.explanation});}
    setChecking(false);
  };
  const goNext=()=>{setCur(c=>c+1);setDevText("");};
  const goPrev=()=>{setCur(c=>c-1);setDevText("");};
  const typeMap={multiple:{label:"Seleccion Unica",cls:"chip-sky"},true_false:{label:"V / F",cls:"chip-em"},development:{label:"Desarrollo",cls:"chip-am"}};
  const fbInfo=fb?(fb.correct===true?{bg:D.emdim,bc:"rgba(16,185,129,.2)",color:D.em,label:"Correcto"}:fb.correct===false?{bg:D.rodim,bc:"rgba(244,63,94,.2)",color:D.ro,label:"Incorrecto"}:{bg:D.skydim,bc:"rgba(14,165,233,.2)",color:D.sky,label:"Retroalimentacion"}):null;
  return (
    <div style={{maxWidth:700,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <button className="btn-ghost" onClick={onRestart} style={{padding:"6px 10px",fontSize:13}}>Salir</button>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
            <span style={{color:D.muted,fontWeight:600}}>{cur+1} / {quiz.length}</span>
            <span style={{color:D.em,fontWeight:700}}>{correctCount} correctas</span>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{width:`${((cur+1)/quiz.length)*100}%`}}/></div>
        </div>
        {resources?.length>0&&<button className="btn btn-outline" style={{fontSize:11,padding:"6px 11px"}} onClick={()=>setShowRes(true)}>Recursos</button>}
      </div>
      <div className="card sr" key={cur} style={{marginBottom:11}}>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:15}}>
          <span className={`chip ${typeMap[q.type]?.cls}`}>{typeMap[q.type]?.label}</span>
          {q.topic&&<span className="chip chip-dark">{q.topic}</span>}
        </div>
        <h2 style={{fontSize:17,fontWeight:600,lineHeight:1.65,marginBottom:22}}>{q.question}</h2>
        {q.type==="multiple"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {(q.options||[]).map((opt,i)=>{const isSel=answers[cur]===i,isOk=fb&&i===q.answer,isBad=fb&&isSel&&i!==q.answer;return(
              <button key={i} className={`opt ${isOk?"correct":isBad?"wrong":isSel?"chosen":""}`} onClick={()=>handleMC(i)} disabled={answered}>
                <span className="letter">{["A","B","C","D"][i]}</span>
                <span style={{flex:1,textAlign:"left"}}>{opt}</span>
                {isOk&&<span style={{color:D.em,fontWeight:700}}>OK</span>}
                {isBad&&<span style={{color:D.ro,fontWeight:700}}>X</span>}
              </button>
            );})}
          </div>
        )}
        {q.type==="true_false"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["true","Verdadero",D.em],["false","Falso",D.ro]].map(([val,label,clr])=>{const isSel=answers[cur]===val,isOk=fb&&val===q.answer,isBad=fb&&isSel&&val!==q.answer;return(
              <button key={val} className={`opt ${isOk?"correct":isBad?"wrong":isSel?"chosen":""}`} onClick={()=>handleTF(val)} disabled={answered} style={{justifyContent:"center",fontWeight:600,fontSize:15,color:isSel?clr:undefined}}>{label}</button>
            );})}
          </div>
        )}
        {q.type==="development"&&(
          <div>
            <textarea rows={4} placeholder="Escribe tu respuesta aqui..." value={devText} onChange={e=>setDevText(e.target.value)} disabled={answered} style={{marginBottom:11}}/>
            {!answered&&<button className="btn btn-sky" onClick={handleDev} disabled={!devText.trim()||checking}>{checking?<><div className="spinner" style={{borderTopColor:"#000"}}/>Evaluando...</>:"Verificar respuesta"}</button>}
          </div>
        )}
        {fbInfo&&(
          <div className="fu" style={{marginTop:16,padding:"13px 15px",borderRadius:10,background:fbInfo.bg,border:`1px solid ${fbInfo.bc}`}}>
            <p style={{fontSize:11,fontWeight:700,color:fbInfo.color,marginBottom:5}}>{fbInfo.label}</p>
            <p style={{fontSize:14,color:D.sub,lineHeight:1.65}}>{fb.explanation}</p>
          </div>
        )}
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div>{cur>0&&<button className="btn btn-outline" onClick={goPrev}>Anterior</button>}</div>
        <div>{!isLast?<button className="btn btn-sky" onClick={goNext} disabled={!answered}>Siguiente</button>:<button className="btn btn-sky" onClick={()=>onFinish({feedback,correctCount})} disabled={!answered}>Ver resultados</button>}</div>
      </div>
      {showRes&&(
        <div className="modal-bg" onClick={()=>setShowRes(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h2 style={{fontSize:16,fontWeight:700}}>Recursos relacionados</h2>
              <button className="btn-ghost" onClick={()=>setShowRes(false)}>X</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {resources.slice(0,5).map((r,i)=>(
                <a key={i} href={r.url} target="_blank" rel="noreferrer" className="r-link">
                  <div style={{fontWeight:600,fontSize:13,color:D.text,marginBottom:2}}>{r.title}</div>
                  <div style={{fontSize:12,color:D.muted}}>{r.snippet}</div>
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
  const grade=pct>=80?"Excelente":pct>=65?"Muy bien":pct>=50?"Regular":"A repasar";
  const typeCount=t=>quiz.filter(q=>q.type===t).length;
  const typeOk=t=>quiz.reduce((a,q,i)=>q.type===t&&result.feedback[i]?.correct===true?a+1:a,0);
  return (
    <div className="fu" style={{maxWidth:660,margin:"0 auto"}}>
      <div className="card" style={{textAlign:"center",marginBottom:12}}>
        <div className="pop" style={{width:104,height:104,borderRadius:"50%",border:`2.5px solid ${clr}`,margin:"16px auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`${clr}08`}}>
          <span style={{fontFamily:"'DM Mono'",fontSize:28,fontWeight:500,color:clr,lineHeight:1}}>{pct}%</span>
          <span style={{fontSize:11,color:D.muted,marginTop:2}}>{result.correctCount}/{total}</span>
        </div>
        <h2 style={{fontSize:22,fontWeight:800,color:clr,marginBottom:4}}>{grade}</h2>
        <p style={{color:D.sub,fontSize:14}}>{result.correctCount} de {total} preguntas correctas</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginTop:18}}>
          {[{type:"multiple",label:"Seleccion",color:D.sky},{type:"true_false",label:"V / F",color:D.em},{type:"development",label:"Desarrollo",color:D.am}].filter(s=>typeCount(s.type)>0).map(s=>(
            <div key={s.type} className="stat-box"><span style={{fontFamily:"'DM Mono'",fontSize:18,fontWeight:500,color:s.color}}>{typeOk(s.type)}/{typeCount(s.type)}</span><span style={{fontSize:10,color:D.muted,marginTop:3,display:"block"}}>{s.label}</span></div>
          ))}
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"center",marginTop:20,flexWrap:"wrap"}}>
          <button className="btn btn-sky" style={{flex:1,maxWidth:200}} onClick={onRestart}>Nuevo quiz</button>
          <button className="btn btn-outline" style={{flex:1,maxWidth:200}} onClick={onHome}>Ir al inicio</button>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {quiz.map((q,i)=>{const fb=result.feedback[i],ok=fb?.correct===true,bad=fb?.correct===false;return(
          <button key={i} className="res-row" onClick={()=>setOpen(open===i?null:i)}>
            <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,background:ok?D.em:bad?D.ro:D.line,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:ok||bad?"#000":D.muted,marginTop:1}}>{ok?"V":bad?"X":"~"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:open===i?"normal":"nowrap"}}>{i+1}. {q.question}</div>
              {open===i&&fb?.explanation&&<div className="fu" style={{fontSize:12,color:D.sub,marginTop:6,lineHeight:1.65}}>{fb.explanation}</div>}
            </div>
            <span style={{fontSize:10,color:D.muted,flexShrink:0,marginTop:2}}>{open===i?"^":"v"}</span>
          </button>
        );})}
      </div>
    </div>
  );
}

function History() {
  const results = getResults();
  return (
    <div style={{maxWidth:660,margin:"0 auto",padding:"32px 16px 60px"}} className="fu">
      <h1 style={{fontSize:22,fontWeight:800,marginBottom:6}}>Mi historial</h1>
      <p style={{color:D.muted,fontSize:13,marginBottom:24}}>{results.length} evaluaciones guardadas</p>
      {results.length===0?(
        <div className="card" style={{textAlign:"center",padding:"48px 24px"}}>
          <p style={{fontWeight:700,marginBottom:4}}>Sin evaluaciones aun</p>
          <p style={{color:D.muted,fontSize:13}}>Genera tu primer cuestionario para ver tu historial aqui.</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {results.map((r,i)=>(
            <div key={i} style={{background:D.card,border:`1px solid ${D.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:46,height:46,borderRadius:"50%",border:`2.5px solid ${pctColor(r.pct)}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontFamily:"'DM Mono'",fontSize:13,fontWeight:500,color:pctColor(r.pct),lineHeight:1}}>{r.pct}%</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.topic}</div>
                <div style={{fontSize:12,color:D.muted}}>{r.correct}/{r.total} correctas - {fmtDate(r.ts)}</div>
              </div>
              <span className={`chip ${r.pct>=75?"chip-em":r.pct>=50?"chip-am":"chip-dark"}`}>{r.pct>=75?"Excelente":r.pct>=50?"Regular":"A repasar"}</span>
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
  const [phase,setPhase] = useState(0);
  const [quiz,setQuiz] = useState(null);
  const [resources,setResources] = useState([]);
  const [result,setResult] = useState(null);
  const [topic,setTopic] = useState("");
  const {Toast,show} = useToast();

  useEffect(()=>{ const u=getMe(); if(u){setUser(u);setScreen(SCREEN.HOME);} },[]);

  const handleLogin = u => { setUser(u); setScreen(SCREEN.HOME); };
  const handleLogout = () => { logout(); setUser(null); setScreen(SCREEN.AUTH); };

  const nav = p => {
    if(p==="home") setScreen(SCREEN.HOME);
    else if(p==="quiz") setScreen(SCREEN.QUIZ_INPUT);
    else if(p==="history") setScreen(SCREEN.HISTORY);
  };

  const handleGenerate = async ({mode,text,imgData,numMC,numTF,numDev}) => {
    setScreen(SCREEN.QUIZ_LOADING); setPhase(0);
    try {
      let content=text;
      if(mode==="image"&&imgData){
        content=await callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgData}},{type:"text",text:"Transcribe y resume todo el contenido educativo visible."}]}],"Extraes contenido de imagenes. Responde en español.");
      }
      setPhase(1);
      const prompt=`Genera exactamente: ${numMC} preguntas seleccion unica, ${numTF} verdadero/falso, ${numDev} desarrollo.
Contenido:\n${content}
JSON UNICO sin texto fuera:
{"topic":"tema","questions":[
{"type":"multiple","question":"...","options":["A","B","C","D"],"answer":0,"explanation":"...","topic":"subtema"},
{"type":"true_false","question":"...","answer":"true","explanation":"...","topic":"subtema"},
{"type":"development","question":"...","answer":"respuesta modelo","explanation":"criterios","topic":"subtema"}
]}
Total exacto: ${numMC+numTF+numDev} preguntas.`;
      const raw=await callClaude([{role:"user",content:prompt}],"Experto evaluacion educativa. SOLO JSON valido.");
      const parsed=parseJSON(raw);
      if(!parsed?.questions?.length) throw new Error("Error al generar");
      setTopic(parsed.topic||"Quiz"); setQuiz(parsed.questions);
      setPhase(2);
      let webRes=[];
      try{const sr=await callClaude([{role:"user",content:`Busca recursos educativos sobre: "${parsed.topic}"`}],"Investigador. Usa web_search. SOLO JSON: [{\"title\":\"...\",\"url\":\"...\",\"snippet\":\"...\"}]",[{type:"web_search_20250305",name:"web_search"}]);const arr=parseJSON(sr);webRes=Array.isArray(arr)?arr:[];}catch{}
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

  return (
    <>
      <style>{CSS}</style>
      <div style={{position:"fixed",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${D.sky},${D.em},transparent)`,zIndex:200}}/>
      {screen===SCREEN.AUTH && <Auth onLogin={handleLogin} showToast={show}/>}
      {user && screen!==SCREEN.AUTH && (
        <>
          <TopBar user={user} page={screen===SCREEN.HOME?"home":screen===SCREEN.HISTORY?"history":"quiz"} onNav={nav} onLogout={handleLogout}/>
          <div style={{minHeight:"100vh",paddingTop:58,paddingBottom:40}}>
            <div style={{maxWidth:900,margin:"0 auto",padding:"0 16px"}}>
              {isQuizScreen && screen!==SCREEN.QUIZ_LOADING && (
                <div style={{paddingTop:28}}>
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
        </>
      )}
      {Toast}
    </>
  );
}




