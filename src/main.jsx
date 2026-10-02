import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { api } from './api.js'

const nav = [
  ['overview', 'Mission Overview', '⌂'],
  ['indicators', 'Health Indicators', '⌁'],
  ['assessment', 'Self Assessment', '▣'],
  ['action', 'Action Plan', 'ϟ'],
  ['crew', 'Crew Setup', '♙'],
]

const quickStatus = [
  ['Cardiovascular', 'Normal', 'heart', 'pink'],
  ['Respiratory', 'Normal', 'lungs', 'rose'],
  ['Body Temperature', 'Normal', 'temp', 'violet'],
  ['Hydration', 'Good', 'drop', 'cyan'],
  ['Radiation Exposure', 'Low', 'radiation', 'amber'],
  ['Sleep Quality', 'Good', 'moon', 'blue'],
]

const highlights = [
  ['Sleep quality improved', '+12% vs. yesterday', 'moon', 'blue'],
  ['Hydration below target', 'Increase fluid intake', 'drop', 'amber'],
  ['Radiation exposure normal', 'Within safe limits', 'radiation', 'green'],
  ['Exercise completed', '30 min resistance training', 'run', 'cyan'],
]

function Icon({ type, className = '' }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    heart: <><path d="M20.8 8.6c0 5.4-8.8 10.2-8.8 10.2S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.5Z"/><path d="M7.3 10.3h2.1l1.1-2.2 2 4.4 1.2-2.2h2"/></>,
    lungs: <><path d="M12 5v15"/><path d="M11.7 9.5c-2-2.1-4.4-3.1-5.6-1.3-1 1.5-1.5 4.7-1.1 6.5.5 2.2 2.2 3.2 4.2 2.5 1.6-.6 2.5-2.2 2.5-4.2Z"/><path d="M12.3 9.5c2-2.1 4.4-3.1 5.6-1.3 1 1.5 1.5 4.7 1.1 6.5-.5 2.2-2.2 3.2-4.2 2.5-1.6-.6-2.5-2.2-2.5-4.2Z"/></>,
    temp: <><path d="M14 14.7V5a2 2 0 0 0-4 0v9.7a4 4 0 1 0 4 0Z"/><path d="M12 11V5"/></>,
    drop: <><path d="M12 3S6 9.4 6 14a6 6 0 0 0 12 0c0-4.6-6-11-6-11Z"/></>,
    radiation: <><circle cx="12" cy="12" r="2"/><path d="M12 2a10 10 0 0 1 8.7 5l-6 3.5A3 3 0 0 0 12 10Z"/><path d="M20.7 17A10 10 0 0 1 12 22v-7a3 3 0 0 0 2.6-1.5Z"/><path d="M3.3 17A10 10 0 0 1 3.3 7l6 3.5A3 3 0 0 0 9 12Z"/></>,
    moon: <path d="M20.5 15.7A8.7 8.7 0 0 1 8.3 3.5 8.7 8.7 0 1 0 20.5 15.7Z"/>,
    run: <><circle cx="14" cy="4.5" r="2"/><path d="m12 8-2 4 3 2 2 5"/><path d="m10 12-4 2"/><path d="m13 10 4 1 2 3"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.2 4.2"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8"/><path d="M10 21h4"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
  }
  return <svg {...common} className={className}>{paths[type]}</svg>
}

function Heartbeat() {
  return <div className="heartbeat-line" aria-label="live heartbeat waveform">
    <svg viewBox="0 0 440 90" preserveAspectRatio="none">
      <path className="ecg-shadow" d="M0 48 H60 L76 48 L87 39 L98 58 L109 48 H158 L170 48 L181 18 L193 74 L205 48 H252 L264 48 L275 38 L286 59 L297 48 H345 L357 48 L369 18 L381 74 L393 48 H440"/>
      <path className="ecg-path" d="M0 48 H60 L76 48 L87 39 L98 58 L109 48 H158 L170 48 L181 18 L193 74 L205 48 H252 L264 48 L275 38 L286 59 L297 48 H345 L357 48 L369 18 L381 74 L393 48 H440"/>
    </svg>
    <span className="ecg-scanner" />
  </div>
}

function AstronautVisual() {
  return <div className="astronaut-visual">
    <div className="astronaut-glow" />
    <svg viewBox="0 0 180 230" className="astronaut-svg" aria-label="astronaut health visualization">
      <defs>
        <linearGradient id="suit" x1="0" x2="1"><stop offset="0" stopColor="#c8f8ff" stopOpacity=".9"/><stop offset=".45" stopColor="#8edcf3" stopOpacity=".75"/><stop offset="1" stopColor="#526f8d" stopOpacity=".72"/></linearGradient>
        <filter id="blueGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g filter="url(#blueGlow)">
        <circle cx="90" cy="43" r="28" fill="url(#suit)" stroke="#6eefff" strokeWidth="2"/>
        <rect x="67" y="26" width="46" height="27" rx="12" fill="#08243d" stroke="#b9f9ff" strokeWidth="2"/>
        <circle cx="79" cy="38" r="3" fill="#8ff5ff"/><circle cx="98" cy="34" r="2" fill="#8ff5ff"/>
        <path d="M69 66 Q90 55 111 66 L126 120 Q124 142 110 153 L70 153 Q56 142 54 120Z" fill="url(#suit)" stroke="#72eaff" strokeWidth="2"/>
        <rect x="77" y="86" width="26" height="28" rx="4" fill="#0a3150" stroke="#a6f8ff" strokeWidth="1.5"/>
        <circle cx="90" cy="100" r="8" fill="#37e6ff" opacity=".25"/><path d="M90 92v16M82 100h16" stroke="#8ff5ff" strokeWidth="1"/>
        <path d="M58 74 38 118 51 125 73 90M122 74l20 44-13 7-22-35" fill="url(#suit)" stroke="#72eaff" strokeWidth="2"/>
        <path d="M72 149 59 204h22l10-48M108 149l13 55H99l-9-49" fill="url(#suit)" stroke="#72eaff" strokeWidth="2"/>
        <path d="M60 205h24l-3 9H55Z M99 205h24l4 9H101Z" fill="#8ddff2" stroke="#72eaff" strokeWidth="1.5"/>
        <circle cx="64" cy="105" r="3" fill="#42e8ff"/><circle cx="116" cy="105" r="3" fill="#42e8ff"/><circle cx="90" cy="128" r="4" fill="#42e8ff"/>
      </g>
    </svg>
    <div className="body-callout neural"><span>Neural</span><b>Good</b></div>
    <div className="body-callout cardio"><span>Cardiovascular</span><b>Optimal</b></div>
    <div className="body-callout resp"><span>Respiratory</span><b>Good</b></div>
    <div className="body-callout muscle"><span>Musculoskeletal</span><b>Monitoring</b></div>
  </div>
}

function MiniWave({ color='cyan', points='0,28 8,27 16,29 24,26 32,29 40,25 48,28 56,27 64,29 72,18 80,29 88,27 96,28' }) {
  return <svg viewBox="0 0 96 38" className={`mini-wave ${color}`} preserveAspectRatio="none"><polyline points={points}/></svg>
}

function Ring({ value = 82 }) {
  return <div className="readiness-ring" style={{ '--value': `${value * 3.6}deg` }}>
    <div className="ring-inner"><strong>{value}%</strong><span>READY</span></div>
  </div>
}

function Overview({ setPage, mission, planet }) {
  const [metric,setMetric]=useState('Heart Rate'); const [live,setLive]=useState(true); const [now,setNow]=useState(new Date()); const [pulse,setPulse]=useState(72)
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[])
  useEffect(()=>{if(!live)return;const t=setInterval(()=>setPulse(Math.round(72+(Math.random()*4-2))),1600);return()=>clearInterval(t)},[live])
  const h=now.getHours(), greeting=h<5?'Good Night':h<12?'Good Morning':h<18?'Good Afternoon':h<22?'Good Evening':'Good Night'
  const time=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})+' UTC'
  const metrics=['Heart Rate','SpO₂','Sleep','Stress','Temperature']
  return <>
    <section className="welcome-row"><div className="welcome-title"><span className="sun-icon">☼</span><div><h1>{greeting}, Commander</h1><p>Here’s your health status for Mission Day {mission.mission_day}</p></div></div><div className="top-info"><div className="info-chip"><Icon type="globe"/><div><small>Earth Time</small><b>{now.toLocaleDateString([], {month:'short',day:'numeric',year:'numeric'})} · {time}</b></div></div><div className="info-chip"><Icon type="clock"/><div><small>Mission Elapsed</small><b>{mission.mission_day} / {mission.duration} days</b><span className="progress"><i style={{width:`${Math.min(100,mission.mission_day/mission.duration*100)}%`}}/></span></div></div></div></section>
    <section className="hero-health"><div className="hero-main"><div className="nominal-pill">SYSTEM NOMINAL</div><div className="health-number">82<span>/100</span></div><div className="health-caption">Personal health readiness index</div><div className="health-meta"><b>+4.8%</b><span>vs. last week</span><span>Last sync 09:42 UTC</span></div></div><div className="hero-ecg"><Heartbeat/><div className="bpm"><span className="heart-beat">♥</span><strong>{pulse} bpm</strong><button className={live?'live-btn active':'live-btn'} onClick={()=>setLive(v=>!v)}>{live?'Live':'Paused'}</button></div></div><div className="ring-area"><Ring/><div className="ring-base"/></div><AstronautVisual/><div className="metric-row"><div className="metric-card"><div><small>CARDIO</small><strong><span className="metric-icon heart">♥</span>{pulse} bpm</strong><em>Optimal</em></div><MiniWave color="cyan"/></div><div className="metric-card"><div><small>O₂</small><strong><span className="metric-icon drop">●</span>98%</strong><em>Nominal</em></div><MiniWave color="blue" points="0,27 10,28 18,27 26,28 34,23 42,29 50,26 58,27 66,28 74,12 82,29 96,27"/></div><div className="metric-card"><div><small>SLEEP</small><strong><span className="metric-icon moon">☾</span>84%</strong><em>Good</em></div><MiniWave color="violet" points="0,28 8,28 16,27 24,29 32,27 40,26 48,27 56,25 64,27 72,17 80,26 88,23 96,27"/></div><div className="metric-card"><div><small>STRESS</small><strong><span className="metric-icon brain">✣</span>31</strong><em>Low</em></div><MiniWave color="cyan" points="0,27 8,24 16,26 24,28 32,26 40,27 48,21 56,28 64,26 72,27 80,23 88,26 96,25"/></div></div></section>
    <section className="lower-grid"><div className="panel trends-panel"><div className="panel-head"><div><h2>Health Trends</h2><span>Physiological telemetry · last 7 days</span></div><button className="select-btn">Last 7 Days⌄</button></div><div className="metric-tabs">{metrics.map(m=><button key={m} onClick={()=>setMetric(m)} className={metric===m?'selected':''}>{m}</button>)}</div><div className="chart-wrap"><div className="y-labels"><span>120</span><span>90</span><span>60</span><span>30</span></div><svg viewBox="0 0 620 240" className="health-chart" preserveAspectRatio="none">{[20,65,110,155,200].map(y=><line key={y} x1="0" x2="620" y1={y} y2={y} className="gridline"/>)}{[60,145,230,315,400,485,570].map(x=><line key={x} x1={x} x2={x} y1="0" y2="220" className="gridline"/>)}<path d="M0 126 C40 130 52 124 78 108 C100 94 115 90 138 102 C159 114 171 102 190 92 C211 82 225 88 244 101 C262 115 280 118 303 111 C326 104 340 92 359 98 C378 104 389 117 410 115 C433 113 445 100 464 106 C482 112 497 118 520 113 C542 108 556 98 577 104 C594 109 608 119 620 121" className="chart-line-shadow"/><path d="M0 126 C40 130 52 124 78 108 C100 94 115 90 138 102 C159 114 171 102 190 92 C211 82 225 88 244 101 C262 115 280 118 303 111 C326 104 340 92 359 98 C378 104 389 117 410 115 C433 113 445 100 464 106 C482 112 497 118 520 113 C542 108 556 98 577 104 C594 109 608 119 620 121" className="chart-line"/></svg><div className="x-labels"><span>Sep 24</span><span>Sep 25</span><span>Sep 26</span><span>Sep 27</span><span>Sep 28</span><span>Sep 29</span><span>Sep 30</span></div></div></div><div className="panel quick-panel"><div className="panel-head"><div><h2>Quick Status</h2><span>Current signal state</span></div></div><div className="quick-list">{quickStatus.map(([label,status,icon,color])=><div className="quick-row" key={label}><span className={`status-icon ${color}`}><Icon type={icon}/></span><span>{label}</span><b>{status}</b></div>)}</div></div><div className="panel highlights-panel"><div className="panel-head"><div><h2>Today’s Highlights</h2><span>Recent mission events</span></div></div><div className="highlight-list">{highlights.map(([title,sub,icon,color])=><button className="highlight-row" key={title} onClick={()=>setPage('action')}><span className={`highlight-icon ${color}`}><Icon type={icon}/></span><div><b>{title}</b><small>{sub}</small></div><Icon type="chevron" className="arrow"/></button>)}</div></div></section>
    <section className="lower-space-grid"><div className="panel live-card"><div className="card-title"><div><h3>Live cardiovascular telemetry</h3><span>ECG signal · current session</span></div><span className="signal-state pulse-text">● STREAMING</span></div><div className="telemetry-chart"><svg viewBox="0 0 800 180" preserveAspectRatio="none">{[30,70,110,150].map(y=><line key={y} x1="0" x2="800" y1={y} y2={y} className="chart-grid"/>)}<path className="chart-wave animated-wave" d="M0 92 H90 L112 92 L126 80 L139 106 L151 92 H250 L268 92 L282 45 L298 138 L314 92 H410 L430 92 L445 80 L458 106 L470 92 H565 L585 92 L600 51 L615 134 L630 92 H800"/></svg></div></div><div className="mission-dynamic panel"><div className="card-title"><div><h3>Mission & location</h3><span>Dynamic mission environment</span></div><button className="mini-config" onClick={()=>document.dispatchEvent(new CustomEvent('open-location'))}>Configure</button></div><div className="dynamic-stat"><span>MISSION</span><b>{mission.name}</b><small>Day {mission.mission_day} / {mission.duration}</small></div><div className="dynamic-stat"><span>LOCATION</span><b>{planet.name}</b><small>{planet.distance_mkm===0?'Current reference location':`${planet.distance_mkm} million km from Earth`} · gravity {planet.gravity_g}g</small></div><div className={`impact-note ${planet.impact?'attention':''}`}>{planet.impact}</div></div></section>
  </>
}


function Assessment({setPage}){
  const [form,setForm]=useState({
    age:38, sex:'', mission_day:142, sleep_hours:8, sleep_quality:8,
    heart_rate:72, systolic_bp:118, diastolic_bp:76, spo2:98, temperature:36.8,
    respiratory_rate:16, pain:0, chest_pain:false, breathing_difficulty:false,
    dizziness:false, headache:false, nausea:false, energy:8, mood:8, stress:3,
    focus:8, isolation:2, hydration:8, appetite:8, exercise_minutes:30,
    eva_exposure_hours:0, radiation_exposure_msv:42, medication_change:false,
    recent_illness:false, unusual_change:false
  })
  const [result,setResult]=useState(null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  const set=(key,value)=>setForm(v=>({...v,[key]:value}))
  const submit=async(e)=>{
    e.preventDefault(); setLoading(true); setError('')
    try {
      const r=await api.submitAssessment(form)
      setResult(r)
      window.scrollTo({top:0,behavior:'smooth'})
    } catch(err){ setError('Backend connection failed. Start the FastAPI server on port 8000.') }
    finally{ setLoading(false) }
  }

  if(result) return <section className="detail-page">
    <div className="detail-hero"><div><div className="eyebrow">ASSESSMENT COMPLETE // DECISION SUPPORT</div><h1>Self Assessment Result</h1><p>Your responses have been evaluated against the configured mission screening rules.</p></div><button className="action-btn" onClick={()=>setResult(null)}>New Assessment</button></div>
    <div className="panel" style={{padding:'24px'}}>
      <div className="health-number">{result.score}<span>/100</span></div>
      <div className="nominal-pill" style={{marginTop:12}}>{result.status}</div>
      <div className="signal-list" style={{marginTop:24}}>
        {result.findings.map((f,i)=><div className="signal-row" key={i}><div><b>{f.title}</b><small>{f.detail}</small></div><span className="status-pill">{f.severity.toUpperCase()}</span></div>)}
      </div>
      <div className="card-title" style={{marginTop:24}}><div><h3>Recommended actions</h3><span>Review with mission protocols when required</span></div></div>
      <div className="signal-list">{result.recommended_actions.map((a,i)=><div className="signal-row" key={i}><div><b>{i+1}. {a}</b></div></div>)}</div>
      <p className="empty-note" style={{marginTop:18}}>{result.disclaimer}</p>
      <button className="action-btn" style={{marginTop:14}} onClick={()=>setPage('action')}>Open Action Plan →</button>
    </div>
  </section>

  const field=(label,key,type='number',opts={})=><label className="crew-field"><small>{label}</small>{type==='select'?<select value={form[key]} onChange={e=>set(key,e.target.value)}>{opts.options.map(x=><option key={x}>{x}</option>)}</select>:<input type={type} value={form[key]} min={opts.min} max={opts.max} step={opts.step||1} onChange={e=>set(key,type==='number'?Number(e.target.value):e.target.value)}/>}</label>
  const check=(label,key)=><label className="toggle-row" style={{cursor:'pointer'}}><div><b>{label}</b></div><input type="checkbox" checked={form[key]} onChange={e=>set(key,e.target.checked)}/></label>

  return <section className="detail-page">
    <div className="detail-hero"><div><div className="eyebrow">GUIDED SELF ASSESSMENT // CREW INPUT</div><h1>How are you feeling?</h1><p>Enter current observations and mission context. ASTRA uses these inputs for screening and trend detection; it does not diagnose medical conditions.</p></div><div className="nominal-pill">STEP 1 · CREW CHECK-IN</div></div>
    {error&&<div className="panel" style={{padding:14,marginBottom:14,borderColor:'rgba(255,100,120,.5)'}}>{error}</div>}
    <form onSubmit={submit}>
      <div className="crew-grid">
        <div className="crew-card"><div className="card-title"><div><h3>Mission & baseline</h3><span>Identity and recovery context</span></div></div><div className="crew-fields">{field('Age','age')}{field('Mission day','mission_day')}{field('Sex / profile','sex','select',{options:['','Male','Female','Other / not specified']})}{field('Sleep hours','sleep_hours','number',{min:0,max:24,step:.5})}{field('Sleep quality · 0–10','sleep_quality','number',{min:0,max:10})}</div></div>
        <div className="crew-card"><div className="card-title"><div><h3>Vitals</h3><span>Current measured values</span></div></div><div className="crew-fields">{field('Heart rate · bpm','heart_rate')}{field('Systolic BP','systolic_bp')}{field('Diastolic BP','diastolic_bp')}{field('SpO₂ · %','spo2','number',{min:50,max:100})}{field('Temperature · °C','temperature','number',{min:30,max:45,step:.1})}{field('Respiratory rate','respiratory_rate')}</div></div>
      </div>
      <div className="crew-grid">
        <div className="crew-card"><div className="card-title"><div><h3>Symptoms</h3><span>Check anything present right now</span></div></div>{check('Chest pain','chest_pain')}{check('Breathing difficulty','breathing_difficulty')}{check('Dizziness / faintness','dizziness')}{check('Headache','headache')}{check('Nausea','nausea')}<div className="crew-field"><small>Pain level · 0–10</small><input type="number" min="0" max="10" value={form.pain} onChange={e=>set('pain',Number(e.target.value))}/></div></div>
        <div className="crew-card"><div className="card-title"><div><h3>Cognitive & behavioral</h3><span>Current self-ratings</span></div></div>{field('Energy · 0–10','energy')}{field('Mood · 0–10','mood')}{field('Stress · 0–10','stress')}{field('Focus · 0–10','focus')}{field('Isolation · 0–10','isolation')}</div>
      </div>
      <div className="crew-grid">
        <div className="crew-card"><div className="card-title"><div><h3>Recovery & exposure</h3><span>Mission environment factors</span></div></div>{field('Hydration · 0–10','hydration')}{field('Appetite · 0–10','appetite')}{field('Exercise · minutes','exercise_minutes')}{field('EVA exposure · hours','eva_exposure_hours','number',{min:0,max:24,step:.5})}{field('Radiation exposure · mSv','radiation_exposure_msv','number',{min:0,max:10000,step:.1})}</div>
        <div className="crew-card"><div className="card-title"><div><h3>Recent changes</h3><span>Important context for screening</span></div></div>{check('Medication changed recently','medication_change')}{check('Recent illness / infection','recent_illness')}{check('Unusual change from normal','unusual_change')}<div className="empty-note" style={{marginTop:16}}>For any severe or rapidly worsening symptom, follow the mission medical/emergency protocol rather than relying on this screening form.</div></div>
      </div>
      <button className="action-btn" type="submit" disabled={loading}>{loading?'Analyzing…':'Analyze Mission Health →'}</button>
    </form>
  </section>

}


function HealthIndicators(){
  const [data,setData]=useState([['Cardiovascular',72,'bpm','Optimal',72,'Heart rate and cardiovascular telemetry'],['Blood Oxygen',98,'%','Nominal',98,'Peripheral oxygen saturation'],['Respiratory Rate',16,'rpm','Normal',82,'Breaths per minute'],['Body Temperature',36.8,'°C','Normal',76,'Core temperature screening'],['Sleep Recovery',84,'%','Good',84,'Sleep duration and quality'],['Stress Load',31,'/100','Low',31,'Stress load estimate'],['Hydration',78,'%','Good',78,'Hydration recovery indicator'],['Radiation Exposure',42,'mSv','Within limit',42,'Cumulative mission exposure'],['Musculoskeletal',88,'%','Stable',88,'Exercise and recovery signal']])
  useEffect(()=>{const t=setInterval(()=>setData(prev=>prev.map(([n,v,u,s,p,d])=>{if(n==='Cardiovascular'){const nv=Math.round(72+Math.random()*4-2);return[n,nv,u,s,nv,d]}if(n==='Blood Oxygen'){const nv=Number((97.5+Math.random()*1.5).toFixed(1));return[n,nv,u,s,nv,d]}if(n==='Stress Load'){const nv=Math.round(29+Math.random()*7);return[n,nv,u,s,100-nv,d]}return[n,v,u,s,p,d]})),1800);return()=>clearInterval(t)},[])
  return <section className="detail-page"><div className="detail-hero"><div><div className="eyebrow">BIOSIGNAL ARRAY // LIVE TELEMETRY</div><h1>Health Indicators</h1><p>Detailed physiological signals, recovery markers and mission-environment indicators. Values animate as live telemetry simulations.</p></div><div className="nominal-pill pulse-pill">● LIVE STREAM</div></div><div className="indicator-grid">{data.map(([name,val,unit,status,pct,desc])=><div className="indicator-card indicator-live" key={name}><div className="indicator-top"><span className="indicator-name">{name}</span><span className="status-pill">{status}</span></div><div className="indicator-value"><span className="telemetry-number">{val}</span><span>{unit}</span></div><div className="indicator-bar"><i style={{width:`${Math.min(100,pct)}%`}}/></div><MiniWave color="cyan"/><p className="empty-note">{desc}</p><div className="indicator-foot"><span>Baseline tracking</span><span className="live-dot">● LIVE</span></div></div>)}</div><div className="split-grid"><div className="panel"><div className="card-title"><div><h3>Live cardiovascular telemetry</h3><span>ECG signal · current session</span></div><span className="signal-state pulse-text">● STREAMING</span></div><div className="telemetry-chart"><svg viewBox="0 0 800 180" preserveAspectRatio="none">{[30,70,110,150].map(y=><line key={y} x1="0" x2="800" y1={y} y2={y} className="chart-grid"/>)}<path className="chart-wave animated-wave" d="M0 92 H90 L112 92 L126 80 L139 106 L151 92 H250 L268 92 L282 45 L298 138 L314 92 H410 L430 92 L445 80 L458 106 L470 92 H565 L585 92 L600 51 L615 134 L630 92 H800"/></svg></div></div><div className="panel"><div className="card-title"><div><h3>Signal quality</h3><span>Sensor integrity</span></div></div><div className="signal-list"><div className="signal-row"><div><b>ECG / Heart rate</b><small>Continuous</small></div><span className="signal-state">98%</span></div><div className="signal-row"><div><b>SpO₂ sensor</b><small>Continuous</small></div><span className="signal-state">99%</span></div><div className="signal-row"><div><b>Sleep monitor</b><small>Last night</small></div><span className="signal-state">94%</span></div><div className="signal-row"><div><b>Environmental dosimeter</b><small>Continuous</small></div><span className="signal-state">100%</span></div></div></div></div></section>
}


function ActionPlan(){
  const [done,setDone]=useState([])
  const actions=[
    ['Hydration check','Increase fluid intake to meet today’s hydration target. Recheck hydration status after the next scheduled rest period.','HIGH','15 min'],
    ['Recovery window','Protect a consistent sleep opportunity tonight and avoid unnecessary workload close to sleep.','MEDIUM','Tonight'],
    ['Resistance exercise','Complete the planned resistance session if no pain or unusual fatigue is present.','MEDIUM','30 min'],
    ['Radiation review','Review cumulative exposure after the next dosimeter sync and keep exposure notes with the mission log.','LOW','Next sync'],
  ]
  return <section className="detail-page"><div className="detail-hero"><div><div className="eyebrow">MISSION SUPPORT // PERSONALIZED GUIDANCE</div><h1>Health Action Plan</h1><p>Recommended next actions generated from the current mission-health snapshot. Complete, defer or review each action with crew medical protocols when required.</p></div><div className="nominal-pill">3 / 4 ON TRACK</div></div><div className="action-grid">{actions.map(([title,desc,priority,time],i)=><div className={`action-card ${priority==='HIGH'?'urgent':''}`} key={title}><span className={`priority ${priority==='HIGH'?'high':'medium'}`}>{priority} PRIORITY</span><h3>{title}</h3><p>{desc}</p><div className="action-check"><input type="checkbox" checked={done.includes(i)} onChange={()=>setDone(done.includes(i)?done.filter(x=>x!==i):[...done,i])}/><span>{done.includes(i)?'Marked complete':'Mark as completed'}</span></div><div className="action-meta"><span>Suggested timing · {time}</span><button className="action-btn">View rationale</button></div></div>)}</div><div className="panel"><div className="card-title"><div><h3>Escalation guidance</h3><span>Use mission medical protocol for urgent symptoms</span></div></div><div className="signal-list"><div className="signal-row"><div><b>New chest pain, severe breathing difficulty, fainting or confusion</b><small>Stop activity and follow mission emergency procedures.</small></div><span className="status-pill">URGENT</span></div><div className="signal-row"><div><b>Persistent symptoms or repeated abnormal readings</b><small>Record the change and contact the designated medical support channel.</small></div><span className="status-pill">REVIEW</span></div></div></div></section>
}


function CrewSetup({activeProfile,setActiveProfile,onSaved}){
 const [form,setForm]=useState(activeProfile),[toggles,setToggles]=useState({alerts:!!activeProfile.alerts_enabled,sharing:!!activeProfile.medical_sync_enabled,night:!!activeProfile.quiet_hours_enabled}),[saving,setSaving]=useState(false),[saved,setSaved]=useState(false)
 useEffect(()=>{setForm(activeProfile);setToggles({alerts:!!activeProfile.alerts_enabled,sharing:!!activeProfile.medical_sync_enabled,night:!!activeProfile.quiet_hours_enabled})},[activeProfile])
 const set=(k,v)=>setForm(f=>({...f,[k]:v}))
 const save=async()=>{setSaving(true);try{const payload={...form,alerts_enabled:toggles.alerts,medical_sync_enabled:toggles.sharing,quiet_hours_enabled:toggles.night};const r=await api.updateCrew(payload);const updatedProfile=await api.updateProfile(form.id,payload);const next={...updatedProfile,...r,id:form.id};setActiveProfile(next);onSaved(next);setSaved(true);setTimeout(()=>setSaved(false),2200)}finally{setSaving(false)}}
 return <section className="detail-page"><div className="detail-hero"><div><div className="eyebrow">CREW OPERATIONS // PROFILE CONFIGURATION</div><h1>Crew Health Setup</h1><p>Configure the astronaut profile, mission baseline, alert behavior and health-data synchronization used by ASTRA.</p></div><button className="action-btn" onClick={save} disabled={saving}>{saving?'Saving…':saved?'✓ Saved':'Save configuration'}</button></div><div className="crew-grid"><div className="crew-card"><div className="crew-profile"><div className="crew-avatar">{(form.name||'AC').split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><h3>{form.name}</h3><p>Mission crew profile · {form.mission} · Mission Day {form.mission_day}</p></div></div><div className="crew-fields"><label className="crew-field"><small>Display name</small><input value={form.name||''} onChange={e=>set('name',e.target.value)}/></label><label className="crew-field"><small>Mission</small><input value={form.mission||''} onChange={e=>set('mission',e.target.value)}/></label><label className="crew-field"><small>Age</small><input type="number" value={form.age||''} onChange={e=>set('age',Number(e.target.value))}/></label><label className="crew-field"><small>Mission day</small><input type="number" value={form.mission_day||0} onChange={e=>set('mission_day',Number(e.target.value))}/></label><div className="crew-field"><small>Resting HR</small><b>{form.resting_hr_min}–{form.resting_hr_max} bpm</b></div><div className="crew-field"><small>Sleep target</small><b>{form.sleep_min}–{form.sleep_max} h</b></div><div className="crew-field"><small>SpO₂ baseline</small><b>{form.spo2_min}–{form.spo2_max}%</b></div><div className="crew-field"><small>Exercise target</small><b>{form.exercise_min}+ min/day</b></div></div></div><div className="crew-card"><div className="card-title"><div><h3>Monitoring preferences</h3><span>Personalized system behavior</span></div></div><div className="toggle-row"><div><b>Health alerts</b><p>Notify when readings cross configured thresholds.</p></div><button type="button" className={`toggle ${toggles.alerts?'on':''}`} onClick={()=>setToggles(t=>({...t,alerts:!t.alerts}))}><i/></button></div><div className="toggle-row"><div><b>Medical data sync</b><p>Synchronize approved health telemetry with mission support.</p></div><button type="button" className={`toggle ${toggles.sharing?'on':''}`} onClick={()=>setToggles(t=>({...t,sharing:!t.sharing}))}><i/></button></div><div className="toggle-row"><div><b>Quiet-hours mode</b><p>Reduce non-critical notifications during scheduled sleep.</p></div><button type="button" className={`toggle ${toggles.night?'on':''}`} onClick={()=>setToggles(t=>({...t,night:!t.night}))}><i/></button></div></div></div><div className="baseline-card"><div className="card-title"><div><h3>Configured baseline</h3><span>Reference ranges used for trend detection</span></div></div><div className="baseline-grid"><div className="baseline-item"><small>Heart rate</small><b>{form.resting_hr_min}–{form.resting_hr_max} bpm</b></div><div className="baseline-item"><small>SpO₂</small><b>{form.spo2_min}–{form.spo2_max}%</b></div><div className="baseline-item"><small>Temperature</small><b>36.2–37.4°C</b></div><div className="baseline-item"><small>Sleep</small><b>≥ {form.sleep_min} h</b></div><div className="baseline-item"><small>Stress</small><b>&lt; 50 / 100</b></div><div className="baseline-item"><small>Hydration</small><b>≥ 80%</b></div><div className="baseline-item"><small>Radiation</small><b>Mission limit</b></div><div className="baseline-item"><small>Exercise</small><b>≥ {form.exercise_min} min</b></div></div></div></section>
}


function SearchOverlay({query,setQuery,setPage,profile,mission,planet}){const results=[['Mission Overview','overview'],['Health Indicators','indicators'],['Self Assessment','assessment'],['Action Plan','action'],['Crew Setup','crew'],['Cardiovascular telemetry','indicators'],['Radiation exposure','indicators'],['Sleep recovery','indicators'],['Crew profile · '+profile.name,'crew'],['Mission · '+mission.name,'overview'],['Location · '+planet.name,'overview']];const filtered=query.trim()?results.filter(([x])=>x.toLowerCase().includes(query.toLowerCase())):[];return <div className="search-wrap"><div className="search"><Icon type="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search crew, mission data, or health indicators..." onKeyDown={e=>{if(e.key==='Escape')setQuery('')}}/></div>{query&&<div className="search-results">{filtered.length?filtered.map(([label,page])=><button key={label} onClick={()=>{setPage(page);setQuery('')}}><span>{label}</span><small>Open</small></button>):<div className="search-empty">No ASTRA records found for “{query}”</div>}</div>}</div>}
function NotificationPanel({open,setOpen}){const [items,setItems]=useState([{id:1,title:'Sleep quality improved',detail:'+12% vs. yesterday',time:'08:42 UTC',type:'good',read:false},{id:2,title:'Hydration below target',detail:'Increase fluid intake during next rest period',time:'09:05 UTC',type:'attention',read:false},{id:3,title:'Radiation exposure normal',detail:'Within current mission threshold',time:'09:21 UTC',type:'good',read:true},{id:4,title:'Exercise completed',detail:'30 min resistance training logged',time:'09:31 UTC',type:'good',read:true}]);const unread=items.filter(x=>!x.read).length;return open?<div className="notification-panel"><div className="notification-head"><div><b>Notifications</b><small>{unread} unread mission updates</small></div><button onClick={()=>setItems(x=>x.map(n=>({...n,read:true})))}>Mark all read</button></div>{items.map(n=><button className={`notification-row ${n.read?'read':''}`} key={n.id} onClick={()=>setItems(x=>x.map(a=>a.id===n.id?{...a,read:true}:a))}><span className={`notification-dot ${n.type}`}/><div><b>{n.title}</b><small>{n.detail}</small><em>{n.time}</em></div></button>)}</div>:null}
function ProfileMenu({profiles,profile,onSelect,onAdd,onClose}){return <div className="profile-menu"><div className="profile-menu-head"><b>Crew profiles</b><button onClick={onClose}>×</button></div>{profiles.map(p=><button className={`profile-option ${p.id===profile.id?'active-profile':''}`} key={p.id} onClick={()=>onSelect(p)}><span className="avatar small">{(p.name||'AC').split(' ').map(x=>x[0]).slice(0,2).join('')}</span><div><b>{p.name}</b><small>{p.mission} · Day {p.mission_day}</small></div><span>{p.id===profile.id?'✓':''}</span></button>)}<button className="add-profile-btn" onClick={onAdd}>＋ Add new crew profile</button></div>}
function AddProfileModal({onClose,onCreated}){const [form,setForm]=useState({name:'',mission:'Artemis-2',mission_day:1,mission_duration:180,age:30});const [saving,setSaving]=useState(false),[error,setError]=useState('');const set=(k,v)=>setForm(x=>({...x,[k]:v}));const submit=async e=>{e.preventDefault();setSaving(true);setError('');try{const r=await api.createProfile(form);onCreated(r)}catch(err){setError('Could not create profile. Is the backend running?')}finally{setSaving(false)}};return <div className="modal-backdrop"><form className="modal-card" onSubmit={submit}><div className="modal-head"><div><div className="eyebrow">CREW REGISTRY // NEW PROFILE</div><h2>Add crew profile</h2></div><button type="button" onClick={onClose}>×</button></div><div className="crew-fields"><label className="crew-field"><small>Full name</small><input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Dr. Maya Singh"/></label><label className="crew-field"><small>Mission</small><select value={form.mission} onChange={e=>set('mission',e.target.value)}><option>Artemis-2</option><option>ISS Expedition</option><option>Lunar Gateway</option><option>Mars Transit</option><option>Mars Surface</option></select></label><label className="crew-field"><small>Mission day</small><input type="number" min="0" value={form.mission_day} onChange={e=>set('mission_day',Number(e.target.value))}/></label><label className="crew-field"><small>Mission duration</small><input type="number" min="1" value={form.mission_duration} onChange={e=>set('mission_duration',Number(e.target.value))}/></label><label className="crew-field"><small>Age</small><input type="number" min="18" max="100" value={form.age} onChange={e=>set('age',Number(e.target.value))}/></label></div>{error&&<div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="action-btn" onClick={onClose}>Cancel</button><button type="submit" className="primary-action" disabled={saving}>{saving?'Creating…':'Create profile'}</button></div></form></div>}
function LocationPanel({mission,planet,setMission,setPlanet,onClose}){const missions=[['Artemis-1','Lunar orbit',180],['Artemis-2','Lunar flyby',210],['ISS Expedition','Low Earth orbit',180],['Lunar Gateway','Lunar orbit',365],['Mars Transit','Interplanetary transit',900],['Mars Surface','Mars surface operations',500]];const planets=[['Earth',0,1,'No direct gravity concern; microgravity/partial-gravity exposure is the main health consideration'],['Moon',0.384,0.165,'Partial gravity can affect bone, muscle and cardiovascular loading'],['Mars',225,0.378,'Reduced gravity can affect musculoskeletal and cardiovascular adaptation'],['Venus',41.4,0.905,'High gravity and extreme environment are important mission-health constraints'],['Mercury',91.7,0.378,'Reduced gravity can affect musculoskeletal loading; thermal environment is extreme']];return <div className="modal-backdrop"><div className="location-card"><div className="modal-head"><div><div className="eyebrow">MISSION ENVIRONMENT</div><h2>Mission & location</h2><p>Select the current mission and planetary environment.</p></div><button onClick={onClose}>×</button></div><div className="location-grid"><label className="crew-field"><small>Mission profile</small><select value={mission.name} onChange={e=>{const m=missions.find(x=>x[0]===e.target.value);setMission({name:m[0],description:m[1],duration:m[2],mission_day:Math.min(mission.mission_day,m[2])})}}>{missions.map(m=><option key={m[0]}>{m[0]}</option>)}</select></label><label className="crew-field"><small>Current planetary location</small><select value={planet.name} onChange={e=>{const x=planets.find(p=>p[0]===e.target.value);setPlanet({name:x[0],distance_mkm:x[1],gravity_g:x[2],impact:x[3]})}}>{planets.map(p=><option key={p[0]}>{p[0]}</option>)}</select></label></div><div className="planet-facts"><div><small>Distance from Earth · approximate</small><b>{planet.distance_mkm===0?'Reference location':`${planet.distance_mkm} million km`}</b></div><div><small>Surface gravity</small><b>{planet.gravity_g} g</b></div><div><small>Health relevance</small><b>{planet.impact}</b></div></div><button className="action-btn" onClick={onClose}>Apply environment</button></div></div>}

function App(){const [page,setPage]=useState('overview'),[mobile,setMobile]=useState(false),[query,setQuery]=useState(''),[notifications,setNotifications]=useState(false),[profileOpen,setProfileOpen]=useState(false),[addProfile,setAddProfile]=useState(false),[locationOpen,setLocationOpen]=useState(false);const [profiles,setProfiles]=useState([]),[profile,setProfile]=useState({id:1,name:'Cmdr. Alex Chen',mission:'Artemis-1',mission_day:142,mission_duration:180,age:38,resting_hr_min:60,resting_hr_max:80,spo2_min:95,spo2_max:100,sleep_min:7,sleep_max:9,exercise_min:30,alerts_enabled:1,medical_sync_enabled:1,quiet_hours_enabled:1});const [mission,setMission]=useState({name:'Artemis-1',description:'Lunar orbit',mission_day:142,duration:180});const [planet,setPlanet]=useState({name:'Earth',distance_mkm:0,gravity_g:1,impact:'No direct gravity concern; microgravity/partial-gravity exposure is the main health consideration'});useEffect(()=>{api.profiles().then(setProfiles).catch(()=>{});api.crew().then(r=>{setProfile(r);setMission({name:r.mission,description:'Mission operations',mission_day:r.mission_day,duration:r.mission_duration})}).catch(()=>{})},[]);useEffect(()=>{const a=()=>setLocationOpen(true),b=()=>setLocationOpen(false);document.addEventListener('open-location',a);document.addEventListener('close-location',b);return()=>{document.removeEventListener('open-location',a);document.removeEventListener('close-location',b)}},[]);const createProfile=async p=>{const r=await api.createProfile(p);setProfile(r);setProfiles(x=>[...x,r]);setMission({name:r.mission,description:'Mission operations',mission_day:r.mission_day,duration:r.mission_duration});setAddProfile(false);setProfileOpen(false);setPage('crew')};const selectProfile=async p=>{try{const r=await api.updateCrew(p);const active={...p,...r,id:p.id};setProfile(active);setProfiles(x=>x.map(a=>a.id===p.id?active:a));setMission({name:active.mission,description:'Mission operations',mission_day:active.mission_day,duration:active.mission_duration});setProfileOpen(false)}catch(e){}};const content=page==='overview'?<Overview setPage={setPage} mission={mission} planet={planet}/>:page==='assessment'?<Assessment setPage={setPage}/>:page==='indicators'?<HealthIndicators/>:page==='action'?<ActionPlan/>:<CrewSetup activeProfile={profile} setActiveProfile={setProfile} onSaved={p=>{setProfile(p);setMission(m=>({...m,name:p.mission,mission_day:p.mission_day,duration:p.mission_duration}))}}/>;return <div className="app-shell"><div className="space-bg"><div className="earth-glow"/><div className="earth"/><div className="star-field"/><div className="station-frame left"/><div className="station-frame right"/></div><header className="topbar"><div className="brand"><div className="brand-mark">△</div><div><b>ASTRA</b><span>Crew Health Monitor</span></div></div><SearchOverlay query={query} setQuery={setQuery} setPage={setPage} profile={profile} mission={mission} planet={planet}/><div className="top-actions"><button className="icon-btn" onClick={()=>{setNotifications(v=>!v);setProfileOpen(false)}}><Icon type="bell"/><i/></button><div className="profile-wrap"><button className="profile" onClick={()=>{setProfileOpen(v=>!v);setNotifications(false)}}><div className="avatar">{(profile.name||'AC').split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><b>{profile.name}</b><span>Mission Day {profile.mission_day}</span></div><span>⌄</span></button>{profileOpen&&<ProfileMenu profiles={profiles.length?profiles:[profile]} profile={profile} onClose={()=>setProfileOpen(false)} onSelect={selectProfile} onAdd={()=>setAddProfile(true)}/>}</div></div><button className="mobile-menu" onClick={()=>setMobile(v=>!v)}>☰</button></header><NotificationPanel open={notifications}/>{addProfile&&<AddProfileModal onClose={()=>setAddProfile(false)} onCreated={createProfile}/>} {locationOpen&&<LocationPanel mission={mission} planet={planet} setMission={setMission} setPlanet={setPlanet} onClose={()=>setLocationOpen(false)}/>}<div className="layout"><aside className={mobile?'sidebar open':'sidebar'}><div className="side-nav">{nav.map(([key,label,icon])=><button key={key} onClick={()=>{setPage(key);setMobile(false)}} className={page===key?'active':''}><span>{icon}</span>{label}{key==='indicators'&&<i className="alert-dot"/>}</button>)}</div><button className="mission-card mission-click" onClick={()=>setLocationOpen(true)}><small>MISSION</small><b>{mission.name}</b><span>Day {mission.mission_day} / {mission.duration}</span><div className="progress"><i style={{width:`${Math.min(100,mission.mission_day/mission.duration*100)}%`}}/></div><em>Configure mission →</em></button><button className="earth-card earth-click" onClick={()=>setLocationOpen(true)}><div className="mini-earth"/><div><b>{planet.name}</b><span>{planet.distance_mkm===0?'Reference location':`${planet.distance_mkm}M km · ${planet.gravity_g}g`}</span></div></button></aside><main className="main-content">{content}</main></div></div>}

createRoot(document.getElementById('root')).render(<App />)