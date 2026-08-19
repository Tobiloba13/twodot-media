// CURSOR — only visible while scrolling
const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
let mx=0,my=0,fx=0,fy=0,scrollTimer;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx-4}px,${my-4}px)`;});
(function a(){fx+=(mx-fx)*.12;fy+=(my-fy)*.12;cur2.style.transform=`translate(${fx-16}px,${fy-16}px)`;requestAnimationFrame(a);})();
window.addEventListener('scroll',()=>{
  document.body.classList.add('is-scrolling');
  clearTimeout(scrollTimer);
  scrollTimer=setTimeout(()=>document.body.classList.remove('is-scrolling'),800);
  document.getElementById('mainNav').classList.toggle('scrolled',window.scrollY>60);
});

// LOGO
const li=document.getElementById('nav-logo-img'),lt=document.querySelector('.nav-logo-txt');
if(li){li.addEventListener('error',function(){this.style.display='none';if(lt)lt.style.display='block';});}

// MOBILE NAV
const hbg=document.getElementById('hbg'),mob=document.getElementById('mobMenu');
hbg.addEventListener('click',function(){this.classList.toggle('open');mob.classList.toggle('open');document.body.style.overflow=mob.classList.contains('open')?'hidden':'';});
function closeMob(){hbg.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';}

// SCROLL REVEAL
const revEls=document.querySelectorAll('.reveal');
const revObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
revEls.forEach(el=>revObs.observe(el));

// VIDEO
const vid=document.getElementById('mainVideo'),vOv=document.getElementById('vidOverlay');
window.addEventListener('DOMContentLoaded',()=>{if(vid){vid.muted=true;vid.play().catch(()=>{});}});
if(vid&&vOv){
  vid.addEventListener('playing',()=>{vOv.style.opacity='0';setTimeout(()=>{vOv.style.display='none';},400);});
  vid.addEventListener('pause',()=>{vOv.style.display='flex';setTimeout(()=>{vOv.style.opacity='1';},10);});
}
function togglePlay(){if(!vid)return;if(vid.paused){vid.play();vOv.style.opacity='0';setTimeout(()=>{vOv.style.display='none';},400);}else{vid.pause();vOv.style.display='flex';setTimeout(()=>{vOv.style.opacity='1';},10);}}
function toggleSound(){const m=document.getElementById('muteIco'),u=document.getElementById('unmuteIco');if(!vid)return;if(vid.muted){vid.muted=false;m.style.display='none';u.style.display='block';}else{vid.muted=true;m.style.display='block';u.style.display='none';}}

// COUNTDOWN
const tgt=new Date('2025-12-31T23:59:59');
function updCD(){const d=tgt-new Date();if(d<=0)return;const dy=Math.floor(d/86400000),hr=Math.floor((d%86400000)/3600000),mn=Math.floor((d%3600000)/60000),sc=Math.floor((d%60000)/1000);document.getElementById('cdd').textContent=String(dy).padStart(2,'0');document.getElementById('cdh').textContent=String(hr).padStart(2,'0');document.getElementById('cdm').textContent=String(mn).padStart(2,'0');document.getElementById('cds').textContent=String(sc).padStart(2,'0');}
updCD();setInterval(updCD,1000);

// TESTIMONIAL SLIDER
function scrollTesti(dir){const grid=document.getElementById('testiGrid');if(!grid)return;const card=grid.querySelector('.tcard2');const w=card?card.offsetWidth+24:360;grid.scrollBy({left:dir*w,behavior:'smooth'});}

// NOTIFY
function submitNotify(){const inp=document.getElementById('notifyEmail'),btn=inp.nextElementSibling;if(inp.value){btn.textContent=`✓ You're on the list`;btn.style.background='#2d6a4f';inp.value='';inp.placeholder='Thank you!';}}

// BOOKING
function selType(el,name){document.querySelectorAll('.stype').forEach(t=>t.classList.remove('active'));el.classList.add('active');const f=document.getElementById('bsession');if(f)f.value=name;}
function submitBook(){
  const n=document.getElementById('bname').value,
        e=document.getElementById('bemail').value,
        d=document.getElementById('bdate').value,
        t=document.getElementById('btime').value,
        btn=document.getElementById('bookBtn');
  if(!n||!e||!d||!t){
    btn.textContent='Please fill in all required fields';
    btn.style.background='#7f1d1d';btn.style.color='var(--white)';
    setTimeout(()=>{btn.textContent='Confirm Booking';btn.style.background='var(--gold)';btn.style.color='var(--ink)';},2500);
    return;
  }
  btn.textContent='&#10003; Booking Confirmed — We\'ll be in touch shortly';
  btn.style.background='#2d6a4f';btn.style.color='var(--white)';
}

// GALLERY
const galleryData={brands:[],bts:[],documentary:[],portraits:[],events:[],editorial:[]};
let activeCategory='brands',activeFolderIndex=null;
function renderGallery(cat){
  const container=document.getElementById('galleryPanels');container.innerHTML='';
  const data=galleryData[cat]||[];const grid=document.createElement('div');grid.className='gfolders';
  data.forEach((folder,i)=>{
    const fd=document.createElement('div');fd.className='gfolder';
    const thumbs=folder.images.slice(0,3);
    const thumbHtml=Array.from({length:3},(_,j)=>{
      if(thumbs[j])return'<div class="gfolder-thumb"><img src="'+thumbs[j].url+'" alt=""></div>';
      return'<div class="gfolder-thumb"><div class="gfolder-thumb-empty"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg></div></div>';
    }).join('');
    fd.innerHTML='<div class="gfolder-head"><div class="gfolder-name">'+folder.name+'</div><div class="gfolder-count">'+folder.images.length+' photo'+(folder.images.length!==1?'s':'')+'</div></div><div class="gfolder-preview">'+thumbHtml+'</div><div class="gfolder-foot"><button class="gfolder-view" onclick="openFolder(\''+cat+'\','+i+')">View All &rarr;</button></div>';
    grid.appendChild(fd);
  });
  container.appendChild(grid);
}
function switchTab(cat,btn){document.querySelectorAll('.gtab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');activeCategory=cat;renderGallery(cat);}
function openFolder(cat,idx){
  activeCategory=cat;activeFolderIndex=idx;
  const folder=galleryData[cat][idx];
  document.getElementById('fmTitle').textContent=folder.name;
  document.getElementById('fmCount').textContent=folder.images.length+' photo'+(folder.images.length!==1?'s':'');
  renderFolderModal(cat,idx);
  document.getElementById('folderModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function addToFolderModal(input){
  if(activeFolderIndex===null)return;
  const folder=galleryData[activeCategory][activeFolderIndex];
  Array.from(input.files).forEach(f=>{folder.images.push({url:URL.createObjectURL(f),file:f});});
  input.value='';renderFolderModal(activeCategory,activeFolderIndex);renderGallery(activeCategory);
}
function renderFolderModal(cat,idx){
  const folder=galleryData[cat][idx];const grid=document.getElementById('fmGrid');grid.innerHTML='';
  folder.images.forEach(img=>{const d=document.createElement('div');d.className='fm-img';d.innerHTML='<img src="'+img.url+'" alt="">';d.addEventListener('click',()=>openLightbox(img.url));grid.appendChild(d);});
  document.getElementById('fmCount').textContent=folder.images.length+' photo'+(folder.images.length!==1?'s':'');
}
function closeFolder(){document.getElementById('folderModal').classList.remove('open');document.body.style.overflow='';activeFolderIndex=null;}
function openLightbox(src){document.getElementById('lbImg').src=src;document.getElementById('lightbox').classList.add('open');document.body.style.overflow='hidden';}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');document.body.style.overflow='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();closeFolder();}});

// ADMIN: to add folders/images, open console and call:
// addAdminFolder('brands','Brand Name') then addAdminImages('brands',0,fileList)
function addAdminFolder(cat,name){if(!galleryData[cat])return;galleryData[cat].push({name,images:[]});renderGallery(activeCategory);}
function addAdminImages(cat,idx,files){Array.from(files).forEach(f=>galleryData[cat][idx].images.push({url:URL.createObjectURL(f),file:f}));renderGallery(cat);}

renderGallery('brands');