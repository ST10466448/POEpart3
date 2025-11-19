document.addEventListener('DOMContentLoaded', ()=>{


  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  function getBookItems(){
    return Array.from(document.querySelectorAll('.book-item'));
  }

  function applyFilter(){
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const items = getBookItems();
    items.forEach(item=>{
      const title = item.querySelector('h3')?.innerText.toLowerCase()||'';
      const author = item.querySelector('.author')?.innerText.toLowerCase()||'';
      item.style.display = (title.includes(q) || author.includes(q)) ? '' : 'none';
    });
  }

  if(searchInput) searchInput.addEventListener('input', applyFilter);
  if(sortSelect){
    sortSelect.addEventListener('change', ()=>{
      const grid = document.querySelector('.book-list');
      const items = getBookItems().filter(i=>i.style.display !== 'none');
      const mode = sortSelect.value;
      items.sort((a,b)=>{
        if(mode==='price-asc'){
          return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        } else if(mode==='price-desc'){
          return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        } else {
          return a.querySelector('h3').innerText.localeCompare(b.querySelector('h3').innerText);
        }
      });
      items.forEach(i=>grid.appendChild(i));
    });
  }

  
  document.querySelectorAll('[data-tab-button]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const target = btn.dataset.tabButton;
      document.querySelectorAll('[data-tab-panel]').forEach(p=>p.hidden=true);
      document.querySelector(`[data-tab-panel="${target}"]`).hidden=false;
      document.querySelectorAll('[data-tab-button]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  function openModal(html){
    if(!modal) return;
    modalContent.innerHTML = html;
    modal.classList.add('open');
  }
  function closeModal(){ if(modal) modal.classList.remove('open'); }
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-view-details]');
    if(btn){
      const card = btn.closest('.book-item');
      const title = card.querySelector('h3').innerText;
      const author = card.querySelector('.author')?.innerText||'';
      const price = card.dataset.price;
      const img = card.querySelector('img')?.src||'';
      openModal(`<div style="text-align:left">
        <img src="${img}" alt="${title}" style="width:100%;border-radius:8px;margin-bottom:12px">
        <h3>${title}</h3><p class="small">${author}</p><p><strong>Price: R${price}</strong></p>
        <p>Lorem ipsum: book description placeholder. Add real summary here.</p>
        <div style="margin-top:12px"><button class="button" onclick="document.getElementById('modal').classList.remove('open')">Close</button></div>
      </div>`);
    }
    if(e.target.matches('#modal') || e.target.closest('.modal-close')) closeModal();
  });


  document.querySelectorAll('.accordion .accordion-head').forEach(h=>{
    h.addEventListener('click', ()=>{
      const p = h.nextElementSibling;
      const open = h.classList.contains('open');
      document.querySelectorAll('.accordion .accordion-head').forEach(x=>x.classList.remove('open'));
      document.querySelectorAll('.accordion .accordion-body').forEach(b=>b.style.maxHeight = null);
      if(!open){ h.classList.add('open'); p.style.maxHeight = p.scrollHeight + 'px'; }
    });
  });


  document.querySelectorAll('.lightbox-link').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const src = link.href;
      const lb = document.getElementById('lightbox');
      lb.querySelector('img').src = src;
      lb.classList.add('open');
    });
  });
  document.getElementById('lightbox')?.addEventListener('click', e=>{
    if(e.target.id==='lightbox' || e.target.classList.contains('close')) e.currentTarget.classList.remove('open');
  });

  if(document.getElementById('map')){
    
    try{
      const map = L.map('map').setView([-26.2041,28.0473], 11); 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([-26.2041,28.0473]).addTo(map).bindPopup('Book Haven (sample location)').openPopup();
    }catch(err){
      console.warn('Leaflet not available, ensure CDN scripts are included.');
    }
  }

});