const root = document.documentElement;
const sections = [...document.querySelectorAll('.chapter')];
const navLinks = [...document.querySelectorAll('.chapter-nav a')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motion.matches) {
  root.classList.add('motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('visible'); observer.unobserve(entry.target);
    }
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
let framePending = false;
function updateReading() {
  framePending = false;
  const range = root.scrollHeight - innerHeight;
  root.style.setProperty('--progress', range > 0 ? Math.min(scrollY / range, 1) : 0);
  let current = 0;
  sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= innerHeight * .4) current = i; });
  if (range - scrollY < 20) current = sections.length - 1;
  navLinks.forEach((link, i) => { if (i === current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}
function scheduleReading() { if (!framePending) { framePending = true; requestAnimationFrame(updateReading); } }
addEventListener('scroll', scheduleReading, { passive:true }); addEventListener('resize', scheduleReading); updateReading();
const presenter = document.querySelector('#presenter');
const presenterHelp = document.querySelector('#presenter-help');
function setPresenter(active) { presenter.setAttribute('aria-pressed', String(active)); presenterHelp.hidden = !active; }
presenter.addEventListener('click', () => setPresenter(presenter.getAttribute('aria-pressed') !== 'true'));
document.querySelector('#exit-presenter').addEventListener('click', () => { setPresenter(false); presenter.focus(); });
addEventListener('keydown', event => {
  if (event.key === 'Escape') { setPresenter(false); return; }
  if (presenter.getAttribute('aria-pressed') !== 'true' || !['ArrowLeft','ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select,[contenteditable]')) return;
  event.preventDefault();
  const current = Math.max(0, navLinks.findIndex(link => link.hasAttribute('aria-current')));
  sections[Math.max(0, Math.min(sections.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)))].scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' });
});
document.querySelectorAll('[data-device]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#demo-frame').classList.toggle('mobile', button.dataset.device === 'mobile');
  document.querySelectorAll('[data-device]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
}));
const posts = {
 consultoria: { category:'CONSULTORIA ONLINE', title:'Seu treino.\nSeu acompanhamento.', description:'Chamadas e revisões periódicas para acompanhar sua rotina de treino.',cta:'Conheça a consultoria',role:'Apresentar a oferta',purpose:'Deixar claro que a Elite também oferece acompanhamento online e abrir uma conversa sobre o formato.',caption:'Um acompanhamento individual também pode acontecer à distância. Na consultoria online da Elite, as chamadas e as revisões periódicas fazem parte da proposta. Fale com a equipe para conhecer o formato e as condições.' },
 processo: { category:'COMO FUNCIONA',title:'A conversa\nfaz parte do treino.',description:'Conheça o papel das chamadas e das revisões no acompanhamento online.',cta:'Entenda o acompanhamento',role:'Explicar o processo',purpose:'Ajudar quem ainda tem dúvidas sobre um serviço online a entender o que pode perguntar antes de contratar.',caption:'O que acontece durante uma chamada? Como funcionam as revisões? Esses são pontos importantes para escolher um acompanhamento. Converse com a Elite sobre o formato, a frequência e as condições da consultoria online.' },
 equipe: {category:'ATENDIMENTO INDIVIDUAL',title:'Quem acompanha\nfaz diferença.',description:'Conheça o profissional e a proposta de acompanhamento da Elite.',cta:'Converse com a equipe',role:'Apresentar quem atende',purpose:'Criar espaço para uma apresentação real do responsável, com formação e experiência somente após confirmação.',caption:'Antes de escolher sua consultoria, conheça quem vai acompanhar você. Neste conteúdo, a Elite apresenta o profissional responsável, sua atuação e o formato do atendimento. As informações serão preenchidas e aprovadas pela equipe.' }
};
document.querySelectorAll('[data-post]').forEach(button => button.addEventListener('click', () => {
  const p = posts[button.dataset.post];
  for (const key of ['category','title','description','cta','role','purpose','caption']) document.querySelector('#post-'+key).textContent = p[key];
  document.querySelectorAll('[data-post]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
}));
const scenes = [
 ['ABERTURA','Como funciona uma consultoria online?','Profissional fala para a câmera. A pergunta aparece em legenda, sem introdução longa.','Edição: corte direto, título legível e identificação do profissional.'],
 ['EXPLICAÇÃO','Chamadas e revisões periódicas','O responsável explica, com suas próprias palavras, como organiza o acompanhamento e quais condições o interessado deve conhecer.','Edição: cortes de apoio com materiais reais e legendas sincronizadas.'],
 ['CONVITE','Vamos conversar sobre seu acompanhamento?','Encerramento com a marca e convite para conhecer a consultoria online no WhatsApp da Elite.','Edição: chamada final simples, contato e tempo suficiente para leitura.']
];
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => {
  const scene = scenes[Number(button.dataset.scene)];
  ['label','title','body','edit'].forEach((key,i) => document.querySelector('#scene-'+key).textContent = scene[i]);
  document.querySelectorAll('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
}));

// Real image concepts, with an accessible lightbox and downloadable originals.
const flyerDialog=document.querySelector('#flyer-dialog');
let lastFlyer;
document.querySelectorAll('.flyer-open').forEach(button=>button.addEventListener('click',()=>{
 lastFlyer=button;
 document.querySelector('#flyer-dialog-image').src=button.dataset.image;
 document.querySelector('#flyer-dialog-image').alt=button.dataset.caption;
 document.querySelector('#flyer-dialog-title').textContent=button.dataset.caption;
 document.querySelector('#flyer-download').href=button.dataset.image;
 flyerDialog.showModal();
}));
document.querySelector('.flyer-close')?.addEventListener('click',()=>flyerDialog.close());
flyerDialog?.addEventListener('close',()=>lastFlyer?.focus());

// Suggested commercial pricing. All amounts are in investimento.js, in reais.
const investmentList=document.querySelector('#investment-list');
const money=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const services=window.BEHI_INVESTIMENTO || [];
function updateInvestment(){
 const selected=services.filter(item=>document.querySelector('#service-'+item.id)?.checked);
 const setup=selected.filter(s=>s.periodo==='unico').reduce((sum,s)=>sum+s.valor,0);
 const monthly=selected.filter(s=>s.periodo==='mensal').reduce((sum,s)=>sum+s.valor,0);
 document.querySelector('#setup-total').textContent=money(setup);
 document.querySelector('#monthly-total').textContent=money(monthly);
 const message='Olá! Vi a proposta da Behi para a Elite Recovery e gostaria de conversar sobre '+(selected.length?selected.map(s=>s.nome).join(', '):'um escopo personalizado')+'. A simulação ficou em '+money(setup)+' de implantação e '+money(monthly)+' por mês. Podemos alinhar escopo, prazos e condições?';
 document.querySelector('#investment-contact').href='https://wa.me/5511916797661?text='+encodeURIComponent(message);
}
if(investmentList){
 services.forEach((item,i)=>{
  const row=document.createElement('article');row.className='investment-row';
  const label=document.createElement('label');label.htmlFor='service-'+item.id;
  const input=document.createElement('input');input.type='checkbox';input.id='service-'+item.id;input.checked=true;input.addEventListener('change',updateInvestment);
  const heading=document.createElement('span');heading.className='service-heading';heading.textContent=String(i+1).padStart(2,'0')+' / '+item.nome;
  label.append(input,heading);
  const price=document.createElement('div');price.className='service-price';const amount=document.createElement('strong');amount.textContent=money(item.valor);const period=document.createElement('span');period.textContent=item.rotulo;price.append(amount,period);
  const detail=document.createElement('div');detail.className='service-detail';const scope=document.createElement('p');scope.textContent=item.escopo;const note=document.createElement('p');note.className='service-note';note.textContent=item.observacao;detail.append(scope,note);
  row.append(label,price,detail);investmentList.append(row);
 });
 updateInvestment();
}
