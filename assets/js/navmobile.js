/* Tu Andalucía — menu mobile condiviso (hamburger + lingue a tendina con bandiere).
   Da includere sulle pagine interne (NON su index.html, che ha il suo). Generico:
   funziona su qualunque nav con .nav-links, #lang (button[data-lang]) e .nav-cta. */
(function(){
  var FLAG={en:'🇬🇧 EN',it:'🇮🇹 IT',es:'🇪🇸 ES',de:'🇩🇪 DE'};

  function injectCSS(){
    if(document.getElementById('navmobile-css'))return;
    var css=''+
    '.langpop{display:flex}#langcur{display:none}.navtoggle{display:none}.njm{display:none}'+
    '@media(max-width:900px){'+
      '.nav-links{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;gap:0;'+
        'background:rgba(255,250,241,.98);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);'+
        'border-bottom:1.5px solid var(--line);padding:6px 0;box-shadow:var(--sh2,0 14px 34px -22px rgba(120,70,20,.22))}'+
      'nav.menu-open .nav-links{display:flex}'+
      '.nav-links a{padding:14px 26px;font-size:1.05rem;opacity:1}'+
      '.nav-links a.njm{display:block;color:var(--terra);font-weight:800}'+
      '.nav-cta{display:none}'+
      '.navtoggle{display:inline-flex;align-items:center;justify-content:center;background:#fff;border:1.5px solid var(--line);'+
        'border-radius:10px;font-size:1.25rem;line-height:1;padding:4px 11px;cursor:pointer;color:var(--ink)}'+
      '.lang{position:relative;overflow:visible;border:none;background:transparent}'+
      '#langcur{display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--line);background:#fff;'+
        'border-radius:99px;font-family:inherit;font-weight:800;font-size:.82rem;padding:7px 12px;cursor:pointer;color:var(--ink)}'+
      '.lang .langpop{display:none;position:absolute;top:calc(100% + 8px);right:0;flex-direction:column;background:#fff;'+
        'border:1.5px solid var(--line);border-radius:14px;box-shadow:var(--sh,0 26px 60px -34px rgba(120,70,20,.28));overflow:hidden;min-width:128px;z-index:130}'+
      '.lang.open .langpop{display:flex}'+
      '.lang .langpop button{text-align:left;padding:12px 16px;font-size:.95rem;font-weight:700;color:var(--ink);background:#fff}'+
      '.lang .langpop button.on{background:var(--cream);color:var(--terra)}'+
    '}';
    var st=document.createElement('style'); st.id='navmobile-css'; st.textContent=css;
    document.head.appendChild(st);
  }

  function build(){
    injectCSS();
    var nav=document.querySelector('nav'); if(!nav)return;
    var lang=document.getElementById('lang');
    var navlinks=nav.querySelector('.nav-links');
    var right=nav.querySelector('.nav-right')||nav.querySelector('.nav-in')||nav;

    /* 1) lingue -> dropdown con bandiere (preserva i listener: spostiamo i nodi) */
    if(lang && !lang.querySelector('#langcur')){
      var btns=Array.prototype.slice.call(lang.querySelectorAll('button'));
      btns.forEach(function(b){ var l=b.getAttribute('data-lang')||b.getAttribute('data-l'); if(l&&FLAG[l]) b.textContent=FLAG[l]; });
      var cur=document.createElement('button');
      cur.type='button'; cur.className='langcur'; cur.id='langcur';
      cur.setAttribute('aria-haspopup','true'); cur.setAttribute('aria-expanded','false');
      var pop=document.createElement('div'); pop.className='langpop';
      btns.forEach(function(b){ pop.appendChild(b); }); /* moving keeps their click listeners */
      lang.insertBefore(cur, lang.firstChild);
      lang.appendChild(pop);
      function setCur(){
        var on=pop.querySelector('button.on');
        var l=on?(on.getAttribute('data-lang')||on.getAttribute('data-l')):null;
        if(!l){ var d=(document.documentElement.lang||'en').toLowerCase(); l=FLAG[d]?d:'en'; }
        cur.textContent=FLAG[l]||'EN';
      }
      setCur();
      cur.addEventListener('click',function(e){ e.stopPropagation(); var o=lang.classList.toggle('open'); cur.setAttribute('aria-expanded',o); });
      pop.addEventListener('click',function(){ lang.classList.remove('open'); setTimeout(setCur,40); });
      document.addEventListener('click',function(e){ if(!lang.contains(e.target)) lang.classList.remove('open'); });
    }

    /* 2) hamburger -> apre .nav-links come pannello; ci mettiamo dentro anche il Join */
    if(navlinks && !nav.querySelector('.navtoggle')){
      var cta=nav.querySelector('.nav-cta');
      if(cta && !navlinks.querySelector('.njm')){
        var j=cta.cloneNode(true); j.removeAttribute('id'); j.classList.add('njm'); j.classList.remove('nav-cta'); navlinks.appendChild(j);
      }
      var ht=document.createElement('button');
      ht.type='button'; ht.className='navtoggle'; ht.setAttribute('aria-label','Menu'); ht.setAttribute('aria-expanded','false'); ht.textContent='☰';
      right.appendChild(ht);
      ht.addEventListener('click',function(){ var o=nav.classList.toggle('menu-open'); ht.setAttribute('aria-expanded',o); });
      navlinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ nav.classList.remove('menu-open'); }); });
    }
  }

  if(document.readyState!=='loading') build();
  else document.addEventListener('DOMContentLoaded', build);
})();
