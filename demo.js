const dialog = document.querySelector('#plan-dialog');
const link = document.querySelector('#plan-whatsapp');
const preview = document.querySelector('#message-preview');
let trigger;
const messages = {
 Basic:'Olá! Vi a demonstração do site da Elite Recovery e tenho interesse em conhecer o plano Basic da consultoria online. Quais são as condições reais de atendimento?',
 Performance:'Olá! Vi a demonstração do site da Elite Recovery e tenho interesse em conhecer o plano Performance da consultoria online. Como funcionam o acompanhamento por chamadas e as revisões?',
 Premium:'Olá! Vi a demonstração do site da Elite Recovery e tenho interesse em conhecer o plano Premium. Gostaria de consultar as condições reais e a elegibilidade pelo Wellhub (antigo Gympass).'
};
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
 const plan = button.dataset.plan;
 document.querySelector('#dialog-title').textContent = 'Interesse no plano '+plan;
 preview.textContent = messages[plan];
 link.href = 'https://wa.me/5511994878739?text='+encodeURIComponent(messages[plan]);
 trigger = button;
 dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.cancel-button').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('close', () => trigger?.focus());
dialog.addEventListener('click', event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });
