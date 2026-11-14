(() => {
  const main = document.querySelector('main');
  const header = main.querySelector('header');
  const sections = [...main.querySelectorAll('section')];
  const cards = [...main.querySelectorAll('article')];
  const storageKey = 'europa-2027-favoritas';
  let favorites = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));
  const controls = document.createElement('div');
  controls.innerHTML = `
    <div class="toolbar" aria-label="Ferramentas do guia">
      <input class="search" type="search" placeholder="Buscar atração ou cidade…" aria-label="Buscar atração ou cidade">
      <select class="filter" aria-label="Filtrar por país"><option value="">Todos os países</option></select>
      <select class="filter city-filter" aria-label="Filtrar por cidade"><option value="">Todas as cidades</option></select>
      <select class="filter saved-filter" aria-label="Filtrar atrações salvas"><option value="all">Todas as atrações</option><option value="saved">Minhas salvas</option></select>
    </div>
    <div class="summary" aria-live="polite"><span class="pill dark count"></span><span class="pill budget"></span><span class="pill saved-count"></span></div>`;
  header.after(controls);
  const countrySelect = controls.querySelector('[aria-label="Filtrar por país"]');
  const citySelect = controls.querySelector('.city-filter');
  const searchInput = controls.querySelector('input');
  const savedFilter = controls.querySelector('.saved-filter');
  const fmt = n => new Intl.NumberFormat('pt-BR').format(n);
  const keyFor = card => `${card.querySelector('b')?.textContent.trim()}|${card.querySelector('.city b')?.textContent.trim()}`;
  sections.forEach(section => {
    const name = section.querySelector('h2')?.textContent.trim() || '';
    const option = document.createElement('option'); option.value = name; option.textContent = name;
    countrySelect.append(option);
  });
  const cities = [...new Set(cards.map(card => card.querySelector('.city b')?.textContent.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  cities.forEach(city => { const o=document.createElement('option');o.value=city;o.textContent=city;citySelect.append(o); });
  cards.forEach(card => {
    const btn = document.createElement('button'); btn.className='save'; btn.type='button'; btn.title='Salvar atração'; btn.setAttribute('aria-label','Salvar atração');
    btn.addEventListener('click', () => { const key=keyFor(card); favorites.has(key)?favorites.delete(key):favorites.add(key); localStorage.setItem(storageKey,JSON.stringify([...favorites])); update(); });
    card.append(btn);
  });
  function update(){
    const q=searchInput.value.trim().toLocaleLowerCase('pt-BR'), country=countrySelect.value, city=citySelect.value, onlySaved=savedFilter.value==='saved';
    let visible=0,low=0,high=0;
    cards.forEach(card=>{
      const section=card.closest('section'); const cardCity=card.querySelector('.city b')?.textContent.trim()||'';
      const text=card.textContent.toLocaleLowerCase('pt-BR'); const saved=favorites.has(keyFor(card));
      const show=(!q||text.includes(q))&&(!country||section.querySelector('h2').textContent.trim()===country)&&(!city||cardCity===city)&&(!onlySaved||saved);
      card.classList.toggle('is-hidden',!show); if(show)visible++;
      if(saved){const m=card.querySelector('span')?.textContent.match(/R\$\s*([\d.]+)(?:[–-]([\d.]+))?/);if(m){low+=Number(m[1].replaceAll('.',''));high+=Number((m[2]||m[1]).replaceAll('.',''));}}
      const btn=card.querySelector('.save'); btn.setAttribute('aria-pressed',String(saved));btn.textContent=saved?'♥':'♡';btn.title=saved?'Remover das salvas':'Salvar atração';btn.setAttribute('aria-label',btn.title);
    });
    sections.forEach(section=>section.classList.toggle('is-hidden',!section.querySelector('article:not(.is-hidden)')));
    controls.querySelector('.count').textContent=`${visible} atraç${visible===1?'ão':'ões'} exibida${visible===1?'':'s'}`;
    controls.querySelector('.budget').textContent=favorites.size?`Estimativa das salvas: R$ ${fmt(low)}–${fmt(high)} por adulto`:'Salve atrações para estimar o orçamento por adulto';
    controls.querySelector('.saved-count').textContent=`${favorites.size} salva${favorites.size===1?'':'s'}`;
  }
  [searchInput,countrySelect,citySelect,savedFilter].forEach(el=>el.addEventListener('input',update));
  update();
  const note=main.querySelector('.note');
  if(note) note.innerHTML='<b>Como usar:</b> explore por país ou cidade, pesquise atrações e toque no coração para montar sua lista. Suas escolhas ficam salvas apenas neste navegador.';
  const finalNote=[...main.querySelectorAll('.note')].at(-1);
  if(finalNote) finalNote.innerHTML='<b>Estimativas:</b> valores em reais para atrações e hospedagem, sujeitos a alteração e disponibilidade. Confirme preços, horários e regras nos sites oficiais antes de reservar.';
  const subtitle=document.createElement('p');subtitle.textContent='Sete países · agosto de 2027 · ideias, favoritos e estimativas em um só lugar';header.append(subtitle);
  const countdown=document.createElement('div');countdown.className='countdown';countdown.setAttribute('aria-live','polite');countdown.innerHTML='<span class="countdown-label">Contagem regressiva para 13 de agosto de 2027</span><span class="countdown-value"></span>';header.append(countdown);
  const countdownValue=countdown.querySelector('.countdown-value');
  function updateCountdown(){
    const now=new Date(), target=new Date(2027,7,13), remaining=Math.max(0,target-now);
    if(remaining===0){countdownValue.textContent='Chegou o grande dia!';return;}
    const days=Math.floor(remaining/86400000), hours=Math.floor(remaining%86400000/3600000), minutes=Math.floor(remaining%3600000/60000), seconds=Math.floor(remaining%60000/1000);
    countdownValue.textContent=`${days} dias · ${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m ${String(seconds).padStart(2,'0')}s`;
  }
  updateCountdown();setInterval(updateCountdown,1000);
  const footer=document.createElement('footer');footer.textContent='Planejamento Europa 2027 · Valores e informações podem mudar até a viagem.';main.append(footer);
})();
