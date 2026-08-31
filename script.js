const $=id=>document.getElementById(id);
const input=$("input"), result=$("result"), style=$("style"), emoji=$("emoji"), intensity=$("intensity");
let history=JSON.parse(localStorage.getItem("cp-history")||"[]");

const emojiSets={
  chaotic:["💀","😭","💀","😭","🤨","👀","🗿","🙏","🔥","💥","🫵","🤯","💀","🗣️","❗","⁉️"],
  brainrot:["💀","😭","🗿","🍝","🗣️","🔥","👁️","👄","🫡","🤨","🙏","📈","📉","🧠"],
  dramatic:["😭","💔","🥀","😔","🌹","🕊️","⚠️","🎭","😩","🙏","💀"],
  flirty:["👀","😏","😉","🫦","💋","❤️","🔥","🥵","😳","🙈","💦"],
  insult:["💀","😭","🤡","🫵","😂","🙏","🥀","🤨","🔥","🗿"],
  npc:["🤖","⚠️","❌","🔴","💀","📢","🗿","👁️","🔊","😭"]
};

const endings={
 chaotic:["BRO 😭💀","I CANNOT DO THIS ANYMORE 💀","WHAT IS GOING ON 😭","NAHHHHH 🗿","THIS IS INSANE 💀"],
 brainrot:["chat is this real 🗣️🔥","bro has negative aura 💀","we are NOT beating the allegations 😭","absolute cinema 🎬","the brainrot has won 🧠💀"],
 dramatic:["and that was the moment everything changed. 🥀","history will remember this day. 😭","I will never recover from this. 💔","the silence was deafening. 🕊️"],
 flirty:["don't look at me like that 👀😏","you know exactly what you're doing 😏🔥","now come here, troublemaker 😉","okayyy, I see you 👀"],
 insult:["respectfully, what are you doing 💀","bro needs a software update 😭","I say this with love: absolutely not 🗿","you are NOT beating the allegations 💀"],
 npc:["ERROR: dignity not found. 🤖","SYSTEM FAILURE ⚠️💀","REBOOTING PERSONALITY...","CRITICAL LEVELS OF NONSENSE DETECTED."]
};

function pick(a){return a[Math.floor(Math.random()*a.length)]}
function getEmojiLevel(){
 const n=+emoji.value;
 return n===0?0:n===1?1:n===2?2:n===3?3:n===4?4:6;
}
function decorate(text){
 let s=text.trim();
 if(!s) return "Type something first... 👀";
 const st=style.value, level=getEmojiLevel(), end=intensity.value==="light"?1:intensity.value==="medium"?2:3;
 let words=s.split(/(\s+)/), out="";
 const set=emojiSets[st];
 words.forEach((w,i)=>{
   out+=w;
   if(w.trim() && level && Math.random() < Math.min(.11*level,.55)) out+=" "+pick(set);
 });
 let prefix="";
 if(intensity.value==="max"){
   const prefixes={
     chaotic:"YO 😭💀 LISTEN UP — ",
     brainrot:"CHAT 🗣️🔥 ",
     dramatic:"🚨 ATTENTION. THIS IS SERIOUS. 🚨 ",
     flirty:"okayyy 👀 ",
     insult:"BRO 😭 ",
     npc:"[SYSTEM MESSAGE] ⚠️ "
   };
   prefix=prefixes[st];
 }
 for(let i=0;i<end;i++) out+="\n\n"+pick(endings[st]);
 return prefix+out;
}
function generate(save=true){
 if(!input.value.trim()){toast("Write something first.");input.focus();return}
 result.textContent=decorate(input.value);
 if(save){history.unshift({text:result.textContent,style:style.value,time:Date.now()});history=history.slice(0,10);localStorage.setItem("cp-history",JSON.stringify(history));renderHistory()}
}
input.addEventListener("input",()=>{$("count").textContent=`${input.value.length} / 3000`});
$("generate").onclick=()=>generate();
$("clear").onclick=()=>{input.value="";result.textContent="Your masterpiece will appear here... 👀";$("count").textContent="0 / 3000"};
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText(result.textContent);toast("Copied! 🍝")}catch(e){toast("Copy failed.")}};
$("random").onclick=()=>{style.value=pick(["chaotic","brainrot","dramatic","flirty","insult","npc"]);generate()};
$("save").onclick=()=>{if(result.textContent&& !result.textContent.startsWith("Your masterpiece")){history.unshift({text:result.textContent,style:style.value,time:Date.now()});history=history.slice(0,10);localStorage.setItem("cp-history",JSON.stringify(history));renderHistory();toast("Saved! 💾")}else toast("Generate something first.")};
emoji.oninput=()=>{let n=+emoji.value;$("emojiLabel").textContent=["Off","Tiny","Low","Medium","High","MAX"][n]};
document.querySelectorAll(".preset-grid button").forEach(b=>b.onclick=()=>{style.value=b.dataset.style;generate()});
$("theme").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("cp-theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("cp-theme")==="dark")document.body.classList.add("dark");
$("clearHistory").onclick=()=>{history=[];localStorage.removeItem("cp-history");renderHistory();toast("History cleared.")};
function renderHistory(){
 const box=$("history");
 if(!history.length){box.innerHTML='<div class="empty">No saved copypastas yet.</div>';return}
 box.innerHTML=history.map((x,i)=>`<div class="history-item"><p>${esc(x.text)}</p><button onclick="useHistory(${i})">Use</button><button onclick="copyHistory(${i})">Copy</button></div>`).join("");
}
window.useHistory=i=>{input.value=history[i].text;style.value=history[i].style;input.dispatchEvent(new Event("input"));result.textContent=history[i].text;window.scrollTo({top:document.querySelector(".app").offsetTop-90,behavior:"smooth"})};
window.copyHistory=async i=>{await navigator.clipboard.writeText(history[i].text);toast("Copied!")};
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
let toastTimer;function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("show"),1700)}
renderHistory();
