function isoDate(d){return d.toISOString().slice(0,10)}
function parseDate(s){const [y,m,day]=s.split("-").map(Number);return new Date(y,m-1,day)}
function diffDays(a,b){return Math.round((b-a)/86400000)}
function periodDates(){return Object.entries(data.records).filter(([d,r])=>r.flow).map(([d])=>d).sort()}
function cycleStarts(){return periodDates().filter((d,i,arr)=>i===0||diffDays(parseDate(arr[i-1]),parseDate(d))>14)}
function cycleLengths(){const starts=cycleStarts();return starts.slice(1).map((d,i)=>diffDays(parseDate(starts[i]),parseDate(d)))}
function periodLengths(){const starts=cycleStarts();return starts.map((s,i)=>{let n=0;for(const [d,r] of Object.entries(data.records)){if(r.flow&&diffDays(parseDate(s),parseDate(d))>=0&&diffDays(parseDate(s),parseDate(d))<12)n=Math.max(n,diffDays(parseDate(s),parseDate(d))+1)}return n||1})}
function average(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:null}
function cycleInfo(){const starts=cycleStarts();if(!starts.length)return null;const start=parseDate(starts.at(-1));const today=new Date();const day=Math.max(1,diffDays(start,today)+1);const lengths=cycleLengths();const typical=average(lengths)||Number(data.profile.typicalCycle)||28;const next=new Date(start);next.setDate(next.getDate()+Math.round(typical));let phase="Menstrual phase";if(day>5&&day<14)phase="Follicular phase";else if(day>=14&&day<17)phase="Around ovulation";else if(day>=17)phase="Luteal phase";const fertileStart=new Date(start);fertileStart.setDate(fertileStart.getDate()+Math.max(1,Math.round(typical)-18));const fertileEnd=new Date(start);fertileEnd.setDate(fertileEnd.getDate()+Math.max(1,Math.round(typical)-12));return{day,phase,typical,next,fertileStart,fertileEnd,start,starts}}
function fmt(d){return d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}
