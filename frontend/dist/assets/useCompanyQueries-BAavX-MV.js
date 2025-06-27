import{r as d,a1 as C,a2 as z,a3 as S,a4 as D}from"./index-p34BVjv6.js";import{c as v}from"./company.service-yom-wa_-.js";let J={data:""},O=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||J,I=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Q=/\/\*[^]*?\*\/|  +/g,A=/\n+/g,g=(e,t)=>{let r="",o="",s="";for(let a in e){let i=e[a];a[0]=="@"?a[1]=="i"?r=a+" "+i+";":o+=a[1]=="f"?g(i,a):a+"{"+g(i,a[1]=="k"?"":t)+"}":typeof i=="object"?o+=g(i,t?t.replace(/([^,])+/g,n=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,n):n?n+" "+l:l)):a):i!=null&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=g.p?g.p(a,i):a+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+o},y={},K=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+K(e[r]);return t}return e},_=(e,t,r,o,s)=>{let a=K(e),i=y[a]||(y[a]=(l=>{let p=0,u=11;for(;p<l.length;)u=101*u+l.charCodeAt(p++)>>>0;return"go"+u})(a));if(!y[i]){let l=a!==e?e:(p=>{let u,h,x=[{}];for(;u=I.exec(p.replace(Q,""));)u[4]?x.shift():u[3]?(h=u[3].replace(A," ").trim(),x.unshift(x[0][h]=x[0][h]||{})):x[0][u[1]]=u[2].replace(A," ").trim();return x[0]})(e);y[i]=g(s?{["@keyframes "+i]:l}:l,r?"":"."+i)}let n=r&&y.g?y.g:null;return r&&(y.g=y[i]),((l,p,u,h)=>{h?p.data=p.data.replace(h,l):p.data.indexOf(l)===-1&&(p.data=u?l+p.data:p.data+l)})(y[i],t,o,n),i},P=(e,t,r)=>e.reduce((o,s,a)=>{let i=t[a];if(i&&i.call){let n=i(r),l=n&&n.props&&n.props.className||/^go/.test(n)&&n;i=l?"."+l:n&&typeof n=="object"?n.props?"":g(n,""):n===!1?"":n}return o+s+(i??"")},"");function $(e){let t=this||{},r=e.call?e(t.p):e;return _(r.unshift?r.raw?P(r,[].slice.call(arguments,1),t.p):r.reduce((o,s)=>Object.assign(o,s&&s.call?s(t.p):s),{}):r,O(t.target),t.g,t.o,t.k)}let M,q,F;$.bind({g:1});let f=$.bind({k:1});function T(e,t,r,o){g.p=t,M=e,q=r,F=o}function b(e,t){let r=this||{};return function(){let o=arguments;function s(a,i){let n=Object.assign({},a),l=n.className||s.className;r.p=Object.assign({theme:q&&q()},n),r.o=/ *go\d+/.test(l),n.className=$.apply(r,o)+(l?" "+l:"");let p=e;return e[0]&&(p=n.as||e,delete n.as),F&&p[0]&&F(n),M(p,n)}return s}}var B=e=>typeof e=="function",j=(e,t)=>B(e)?e(t):e,L=(()=>{let e=0;return()=>(++e).toString()})(),U=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),H=20,N=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,H)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===t.toast.id?{...a,...t.toast}:a)};case 2:let{toast:r}=t;return N(e,{type:e.toasts.find(a=>a.id===r.id)?1:0,toast:r});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(a=>a.id===o||o===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+s}))}}},V=[],E={toasts:[],pausedAt:void 0},k=e=>{E=N(E,e),V.forEach(t=>{t(E)})},W=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||L()}),w=e=>(t,r)=>{let o=W(t,e,r);return k({type:2,toast:o}),o.id},c=(e,t)=>w("blank")(e,t);c.error=w("error");c.success=w("success");c.loading=w("loading");c.custom=w("custom");c.dismiss=e=>{k({type:3,toastId:e})};c.remove=e=>k({type:4,toastId:e});c.promise=(e,t,r)=>{let o=c.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(s=>{let a=t.success?j(t.success,s):void 0;return a?c.success(a,{id:o,...r,...r==null?void 0:r.success}):c.dismiss(o),s}).catch(s=>{let a=t.error?j(t.error,s):void 0;a?c.error(a,{id:o,...r,...r==null?void 0:r.error}):c.dismiss(o)}),e};var Y=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Z=f`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,G=f`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Y} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Z} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,X=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ee=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${X} 1s linear infinite;
`,te=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,re=f`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ae=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${te} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${re} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,oe=b("div")`
  position: absolute;
`,se=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ie=f`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ne=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ie} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,le=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?d.createElement(ne,null,t):t:r==="blank"?null:d.createElement(se,null,d.createElement(ee,{...o}),r!=="loading"&&d.createElement(oe,null,r==="error"?d.createElement(R,{...o}):d.createElement(ae,{...o})))},ce=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,pe=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,de="0%{opacity:0;} 100%{opacity:1;}",ue="0%{opacity:1;} 100%{opacity:0;}",me=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ye=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,fe=(e,t)=>{let r=e.includes("top")?1:-1,[o,s]=U()?[de,ue]:[ce(r),pe(r)];return{animation:t?`${f(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};d.memo(({toast:e,position:t,style:r,children:o})=>{let s=e.height?fe(e.position||t||"top-center",e.visible):{opacity:0},a=d.createElement(le,{toast:e}),i=d.createElement(ye,{...e.ariaProps},j(e.message,e));return d.createElement(me,{className:e.className,style:{...s,...r,...e.style}},typeof o=="function"?o({icon:a,message:i}):d.createElement(d.Fragment,null,a,i))});T(d.createElement);$`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;const m={all:["companies"],lists:()=>[...m.all,"list"],list:e=>[...m.lists(),{filters:e}],details:()=>[...m.all,"detail"],detail:e=>[...m.details(),e],my:()=>[...m.all,"my"]},he=e=>C({queryKey:m.list({}),queryFn:async()=>{try{return await v.getAllCompanies()||[]}catch(t){return console.error("Failed to fetch companies:",t),[]}}}),xe=e=>C({queryKey:m.detail(e),queryFn:async()=>{try{return await v.getCompanyById(e)||null}catch(t){return console.error("Error fetching company with id:",e,t),null}},enabled:!!e}),ve=()=>C({queryKey:m.my(),queryFn:async()=>{var e;try{return await v.getMyCompany()||null}catch(t){return((e=t.response)==null?void 0:e.status)!==404&&console.error("Error fetching my company:",t),null}},retry:(e,t)=>{var r;return((r=t.response)==null?void 0:r.status)!==404&&e<3}}),we=e=>C({queryKey:["companyJobs",e],queryFn:async()=>{if(!e)throw new Error("Company ID is required");const t=await D.getJobsByCompany(e);return console.log("Jobs query response: ",t),Array.isArray(t.jobs)?t.jobs:[]},enabled:!!e}),Ce=()=>{const e=z();return S({mutationFn:t=>v.createCompany(t),onSuccess:()=>{c.success("Company profile created successfully"),e.invalidateQueries({queryKey:m.all})},onError:()=>{c.error("Failed to create company profile")}})},$e=()=>{const e=z();return S({mutationFn:({id:t,data:r})=>v.updateCompany(t,r),onSuccess:()=>{c.success("Company profile updated successfully"),e.invalidateQueries({queryKey:m.all})},onError:()=>{c.error("Failed to update company profile")}})};export{he as a,xe as b,we as c,c as d,Ce as e,$e as f,ve as u};
