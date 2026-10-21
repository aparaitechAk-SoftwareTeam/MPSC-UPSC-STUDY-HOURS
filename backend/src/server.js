require('dotenv').config();
const express=require('express'), cors=require('cors'),fs=require('fs'),path=require('path'),jwt=require('jsonwebtoken'),bcrypt=require('bcryptjs');
const app=express(); app.use(cors());app.use(express.json({limit:'1mb'}));
const file=path.join(__dirname,'../data/db.json');
const secret=process.env.JWT_SECRET||'development-only-change-this-secret';
function read(){return JSON.parse(fs.readFileSync(file,'utf8'))}
function save(x){fs.writeFileSync(file+'.tmp',JSON.stringify(x,null,2));fs.renameSync(file+'.tmp',file)}
function auth(role){return(req,res,next)=>{try{const t=(req.headers.authorization||'').replace(/^Bearer /,'');const u=jwt.verify(t,secret);if(role&&u.role!==role)return res.status(403).json({error:'Forbidden'});req.user=u;next()}catch{return res.status(401).json({error:'Authentication required'})}}}
function publicUser(u){const {passwordHash,...safe}=u;return safe}
app.get('/api/health',(req,res)=>res.json({ok:true,service:'Abhyas Tracker API'}));
app.post('/api/auth/register',(req,res)=>{const {name,email,password}=req.body;if(!name||!email||!password||password.length<8)return res.status(400).json({error:'Name, email, and password (8+ characters) required'});const db=read();if(db.users.some(u=>u.email===email.toLowerCase()))return res.status(409).json({error:'Email already registered'});const user={id:Date.now().toString(),name,email:email.toLowerCase(),role:'student',passwordHash:bcrypt.hashSync(password,10)};db.users.push(user);save(db);const token=jwt.sign({id:user.id,role:user.role},secret,{expiresIn:'7d'});res.status(201).json({token,user:publicUser(user)})});
app.post('/api/auth/login',(req,res)=>{const {email,password}=req.body;const user=read().users.find(x=>x.email===String(email||'').toLowerCase());if(!user||!bcrypt.compareSync(String(password||''),user.passwordHash))return res.status(401).json({error:'Invalid credentials'});res.json({token:jwt.sign({id:user.id,role:user.role},secret,{expiresIn:'7d'}),user:publicUser(user)})});
app.get('/api/me',auth(),(req,res)=>{const u=read().users.find(x=>x.id===req.user.id);res.json({user:publicUser(u)})});
app.get('/api/subjects',auth(),(req,res)=>res.json(read().subjects));
app.get('/api/plan',auth(),(req,res)=>res.json(read().plans.filter(x=>x.userId===req.user.id)));
app.post('/api/plan',auth(),(req,res)=>{const {title,minutes,date,subjectId}=req.body;if(!title||!Number.isFinite(Number(minutes))||Number(minutes)<=0)return res.status(400).json({error:'Title and positive minutes required'});const db=read();const obj={id:Date.now().toString(),userId:req.user.id,title,minutes:Number(minutes),date:date||new Date().toISOString().slice(0,10),subjectId:subjectId||null,done:false};db.plans.push(obj);save(db);res.status(201).json(obj)});
app.patch('/api/plan/:id',auth(),(req,res)=>{const db=read(),x=db.plans.find(x=>x.id===req.params.id&&x.userId===req.user.id);if(!x)return res.status(404).json({error:'Not found'});x.done=!!req.body.done;save(db);res.json(x)});
app.get('/api/sessions',auth(),(req,res)=>res.json(read().sessions.filter(x=>x.userId===req.user.id).sort((a,b)=>b.startedAt.localeCompare(a.startedAt))));
app.post('/api/sessions',auth(),(req,res)=>{const {subjectId,minutes,mode,focusScore}=req.body;const m=Number(minutes);if(!Number.isFinite(m)||m<=0||m>1440)return res.status(400).json({error:'Minutes must be 1–1440'});const db=read();const obj={id:Date.now().toString(),userId:req.user.id,subjectId:subjectId||null,minutes:m,mode:mode||'Pomodoro',focusScore:Math.min(100,Math.max(0,Number(focusScore)||90)),startedAt:new Date().toISOString()};db.sessions.push(obj);save(db);res.status(201).json(obj)});
app.get('/api/notifications',auth(),(req,res)=>res.json(read().notifications.filter(x=>x.userId===req.user.id||x.userId==='all')));
app.patch('/api/notifications/:id/read',auth(),(req,res)=>{const db=read(),n=db.notifications.find(x=>x.id===req.params.id&&(x.userId===req.user.id||x.userId==='all'));if(!n)return res.status(404).json({error:'Not found'});n.readBy=n.readBy||[];if(!n.readBy.includes(req.user.id))n.readBy.push(req.user.id);save(db);res.json(n)});
app.get('/api/analytics',auth(),(req,res)=>{const sessions=read().sessions.filter(s=>s.userId===req.user.id),minutes=sessions.reduce((a,x)=>a+x.minutes,0),focus=sessions.length?Math.round(sessions.reduce((a,x)=>a+x.focusScore,0)/sessions.length):0;res.json({sessionCount:sessions.length,totalMinutes:minutes,averageFocus:focus,weekly:sessions.slice(-7).map(s=>({date:s.startedAt.slice(0,10),minutes:s.minutes}))})});
app.get('/api/admin/overview',auth('admin'),(req,res)=>{const db=read();res.json({users:db.users.length,subjects:db.subjects.length,sessions:db.sessions.length,minutes:db.sessions.reduce((a,s)=>a+s.minutes,0)})});
app.get('/api/admin/users',auth('admin'),(req,res)=>res.json(read().users.map(publicUser)));
app.get('/api/admin/subjects',auth('admin'),(req,res)=>res.json(read().subjects));
app.post('/api/admin/subjects',auth('admin'),(req,res)=>{const {name,paper,topics}=req.body;if(!name)return res.status(400).json({error:'Name required'});const db=read(),x={id:Date.now().toString(),name,paper:paper||'GS Paper II',topics:Number(topics)||0,completed:0};db.subjects.push(x);save(db);res.status(201).json(x)});
app.delete('/api/admin/subjects/:id',auth('admin'),(req,res)=>{const db=read();db.subjects=db.subjects.filter(s=>s.id!==req.params.id);save(db);res.json({ok:true})});
app.post('/api/admin/notifications',auth('admin'),(req,res)=>{if(!req.body.title||!req.body.message)return res.status(400).json({error:'Title and message required'});const db=read(),x={id:Date.now().toString(),userId:'all',title:req.body.title,message:req.body.message,readBy:[],createdAt:new Date().toISOString()};db.notifications.unshift(x);save(db);res.status(201).json(x)});
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({error:'Server error'})});
const port=process.env.PORT||4000;app.listen(port,()=>console.log(`Abhyas API http://localhost:${port}`));
