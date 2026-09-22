const $ = (selector) => document.querySelector(selector);
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = motionPreference.matches;
let scheduled = false;
const hero = $('.hero');
const art = $('.hero-art');
const portfolio = $('.portfolio-grid');
const motionButton = $('.motion-toggle');
const stemifyProject = $('.stemify-project');
const portrait = $('.portrait-card');
const consult = $('.consult');
const introStrip = $('.intro-strip');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let pointerX = 0;
let pointerY = 0;

function visibleProgress(element, property, finishAt = .7) {
  const bounds = element.getBoundingClientRect();
  if (bounds.bottom > 0 && bounds.top < innerHeight) {
    element.style.setProperty(property, Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight * finishAt))).toFixed(4));
  }
}

function paintMotion() {
  scheduled = false;
  if (motionPaused || document.hidden) return;
  const heroBounds = hero.getBoundingClientRect();
  if (heroBounds.bottom > 0 && heroBounds.top < innerHeight) {
    art.style.setProperty('--hero-progress', Math.max(0, Math.min(1, -heroBounds.top / heroBounds.height)).toFixed(4));
    art.style.setProperty('--pointer-x', pointerX.toFixed(3));
    art.style.setProperty('--pointer-y', pointerY.toFixed(3));
  }
  visibleProgress(stemifyProject, '--stem-progress', 1);
  visibleProgress(portrait, '--portrait-progress', 1.3);
  visibleProgress(consult, '--consult-progress', 1.5);
  visibleProgress(introStrip, '--strip-progress', 1.2);
  const gridBounds = portfolio.getBoundingClientRect();
  if (gridBounds.bottom > 0 && gridBounds.top < innerHeight) {
    portfolio.style.setProperty('--gather', Math.max(0, Math.min(1, (innerHeight - gridBounds.top) / (innerHeight * .6))).toFixed(4));
  }
}
function requestMotion() { if (!scheduled && !motionPaused) { scheduled = true; requestAnimationFrame(paintMotion); } }
function setMotion(paused) {
  motionPaused = paused;
  document.documentElement.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume animation' : 'Pause animation';
  if (!paused) requestMotion();
}
motionButton.hidden = false;
motionButton.addEventListener('click', () => setMotion(!motionPaused));
motionPreference.addEventListener('change', e => setMotion(e.matches));
window.addEventListener('scroll', requestMotion, {passive:true});
window.addEventListener('resize', requestMotion, {passive:true});
document.addEventListener('visibilitychange', requestMotion);
setMotion(motionPaused);
art.addEventListener('pointermove', e => {
  if (motionPaused || !finePointer.matches) return;
  const bounds = art.getBoundingClientRect();
  pointerX = (e.clientX - bounds.left) / bounds.width * 2 - 1;
  pointerY = (e.clientY - bounds.top) / bounds.height * 2 - 1;
  requestMotion();
}, {passive:true});
art.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; requestMotion(); });
document.fonts.ready.then(requestMotion);
window.addEventListener('load', requestMotion, {once:true});

if ('IntersectionObserver' in window && !motionPreference.matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), {threshold:.12});
  document.querySelectorAll('.service-row').forEach(row => { row.classList.add('reveal-ready'); observer.observe(row); });
  document.querySelectorAll('.section-intro, .work-heading, .stemify-copy, .portrait-card, .approach-copy h2, .steps li, .consult-copy, .faq h2').forEach(element => {
    element.classList.add('section-reveal');
    observer.observe(element);
  });
  document.querySelectorAll('.steps li').forEach((element, index) => element.style.setProperty('--reveal-delay', `${index * 60}ms`));
}

const menu = $('.menu-toggle');
const navigation = $('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(isOpen)); menu.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu'); navigation.classList.toggle('is-open', isOpen);
});
navigation.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
matchMedia('(min-width:621px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  $('#service-select').value = link.dataset.service;
  $('#email-result').hidden = true;
}));

const form = $('#consult-form');
let draft = '';
function prepareDraft() {
  const fields = new FormData(form);
  const name = String(fields.get('name')).trim();
  const business = String(fields.get('business')).trim();
  const subject = `Social media enquiry: ${business.replace(/[\r\n]+/g, ' ')}`;
  draft = `Hi Megha,\n\nI’d love to talk about social media support for my business.\n\nName: ${name}\nEmail: ${String(fields.get('email')).trim()}\nBusiness / Instagram: ${business}\nSupport: ${fields.get('service')}\n\nMy goals:\n${String(fields.get('goals')).trim()}\n\nThanks,\n${name}`;
  return `mailto:jain.megha0104@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const mailto = prepareDraft();
  $('#email-draft').href = mailto;
  $('#email-result').hidden = false;
  $('#form-status').textContent = 'Your enquiry is ready to review below. Open your email app to send it to Megha, or copy or save it. Nothing has been sent yet.';
  $('#draft-preview').value = draft;
  $('#email-result').focus({preventScroll:true});
});
$('#copy-enquiry').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(draft); $('#form-status').textContent = 'Enquiry copied. Paste it into an email to jain.megha0104@gmail.com and send when you’re ready.'; }
  catch { $('#form-status').textContent = 'Your browser could not copy the enquiry. Use Save enquiry to download a text copy instead.'; }
});
$('#download-enquiry').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([`To: jain.megha0104@gmail.com\n\n${draft}`], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'my-enquiry-for-megha.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#form-status').textContent = 'Your enquiry file is ready to save. Email its contents to jain.megha0104@gmail.com when you’re ready.';
});
form.addEventListener('input', () => { $('#email-result').hidden = true; });
$('#form-fields').disabled = false;
$('#year').textContent = new Date().getFullYear();
