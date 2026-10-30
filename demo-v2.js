const dialog = document.querySelector('#plan-dialog');
const preview = document.querySelector('#message-preview');
const planLink = document.querySelector('#plan-whatsapp');
let lastPlan;
const messages = {
 Basic:'Olá! Vi a demonstração do site da Elite Recovery e tenho interesse no plano Basic da consultoria online. Quais são as condições reais de atendimento?',
 Performance:'Olá! Vi a demonstração do site da Elite Recovery e tenho interesse no plano Performance. Como funcionam as chamadas e as revisões periódicas?',
 Premium:'Olá! Vi a demonstração do site da Elite Recovery e tenho interesse no plano Premium. Quero consultar as condições reais e a elegibilidade pelo Wellhub (antigo Gympass).',
 consultoria:'Olá! Vim pelo site da Elite Recovery e tenho interesse na consultoria online. Como funcionam o acompanhamento por chamadas, as revisões periódicas e as condições de contratação?',
 duvidas:'Olá! Tenho algumas dúvidas sobre a consultoria online da Elite Recovery. Gostaria de entender o formato, a frequência das chamadas e as revisões antes de escolher um acompanhamento.',
 treino:'Olá! Vim pelo site da Elite Recovery e quero conhecer o treino individual. Quais são os formatos e a disponibilidade em São Paulo?',
 recovery:'Olá! Vim pelo site da Elite Recovery e gostaria de conhecer os atendimentos de crioterapia e pressoterapia. Pode me informar as condições e a disponibilidade?',
 massagem:'Olá! Vim pelo site da Elite Recovery e quero conhecer os atendimentos de sauna e massagem. Quais são os formatos e a disponibilidade?'
};
document.querySelectorAll('[data-contact]').forEach(link => { link.href='https://wa.me/5511994878739?text='+encodeURIComponent(messages[link.dataset.contact]); });
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
 const plan=button.dataset.plan;lastPlan=button;
 document.querySelector('#dialog-title').textContent='Interesse no plano '+plan;
 preview.textContent=messages[plan];planLink.href='https://wa.me/5511994878739?text='+encodeURIComponent(messages[plan]);
 dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.cancel-button').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('close',()=>lastPlan?.focus());
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
let pending=false;
function progress(){pending=false;const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--read',max>0?Math.min(scrollY/max,1):0);}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();

// GSAP is bundled locally. With no JS or failed libraries, all content stays visible.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.querySelector('#motion-toggle');
let paused=false;
let context;
function setupMotion(){
 context?.revert();context=undefined;
 motionButton.hidden=reduced.matches;
 motionButton.setAttribute('aria-pressed',String(paused));
 motionButton.textContent=paused?'Ativar movimentos':'Pausar movimentos';
 document.documentElement.dataset.motion=(!reduced.matches&&!paused)?'active':'reduced';
 if(reduced.matches||paused||!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 context=gsap.context(()=>{
   gsap.from('.hero-line',{y:35,opacity:0,stagger:.1,duration:.9,ease:'power3.out',clearProps:'transform,opacity'});
   gsap.from('.hero-enter',{y:20,opacity:0,stagger:.06,duration:.65,delay:.2,clearProps:'transform,opacity'});
   gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'transform,opacity'}));
   gsap.utils.toArray('.feature-card,.service-card,.plan-card').forEach((el,i)=>gsap.from(el,{y:45,opacity:0,duration:.75,delay:(i%3)*.06,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'transform,opacity'}));
   gsap.utils.toArray('.media-reveal').forEach(el=>gsap.from(el,{clipPath:'inset(8% 0% 8% 0%)',duration:1.1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true},clearProps:'clipPath'}));
   const mm=gsap.matchMedia();
   mm.add('(min-width: 651px)',()=>{
     gsap.to('.hero-image',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}});
     gsap.utils.toArray('.training-photo img,.online-photo img').forEach(el=>gsap.fromTo(el,{scale:1.12,yPercent:-3},{scale:1.02,yPercent:3,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:.8}}));
   });
   gsap.to('.ticker-track',{xPercent:-18,ease:'none',scrollTrigger:{trigger:'.ticker',start:'top bottom',end:'bottom top',scrub:.6}});
   gsap.to('.method-meter span',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.method-steps',start:'top 65%',end:'bottom 65%',scrub:.4}});
   gsap.utils.toArray('.method-step').forEach(el=>gsap.from(el,{opacity:.3,y:20,ease:'none',scrollTrigger:{trigger:el,start:'top 88%',end:'top 48%',scrub:.4}}));
 });
 ScrollTrigger.refresh();
}
motionButton.addEventListener('click',()=>{paused=!paused;setupMotion();});reduced.addEventListener('change',setupMotion);setupMotion();
document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
addEventListener('load',()=>window.ScrollTrigger?.refresh(),{once:true});
