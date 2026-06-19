/* Tu Andalucía — simple access gate (client-side, pilot phase).
   NB: deterrent only, not real security: the source is public.
   To change the password: set HASH to the SHA-256 hex of the new word
   (node -e "console.log(require('crypto').createHash('sha256').update('NEWPASS').digest('hex'))"). */

/* Open the site in a specific language via ?lang=  e.g. ...?lang=es (en|it|es|de).
   Runs first on every page; sets mp_lang (the key all pages read) so the choice is
   applied site-wide and persists. Invalid/absent values are ignored (normal detection). */
(function(){try{var p=new URLSearchParams(location.search).get('lang');if(p){p=p.slice(0,2).toLowerCase();if(p==='en'||p==='it'||p==='es'||p==='de'){localStorage.setItem('mp_lang',p);}}}catch(e){}})();

(function(){
  var KEY='ta_gate_v1';
  var HASH='5a4852b82b0e17d0d8792b2a688bf7da8252e0c3f762252f077173a0b939e484'; /* larva2026 */
  try{ if(sessionStorage.getItem(KEY)==='1'){return;} }catch(e){}
  /* if crypto unavailable (very old browser / insecure context), don't lock people out */
  if(!(window.crypto&&crypto.subtle)){return;}

  var hide=document.createElement('style');
  hide.id='ta-gate-hide';
  hide.textContent=
    'body>*:not(#ta-gate){display:none!important}'+
    '#ta-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;'+
      'background:#FFFAF1;font-family:"Hanken Grotesk",system-ui,sans-serif;padding:24px}'+
    '#ta-gate .card{width:100%;max-width:380px;background:#fff;border:1.5px solid #F0E2C8;border-radius:22px;'+
      'padding:34px 30px;box-shadow:0 26px 60px -34px rgba(120,70,20,.28);text-align:center}'+
    '#ta-gate .logo{width:46px;height:46px;color:#E8431F;margin:0 auto 14px;display:block}'+
    '#ta-gate h1{font-family:"Big Shoulders Display",system-ui,sans-serif;font-weight:700;text-transform:uppercase;'+
      'font-size:1.6rem;line-height:.98;color:#23190D;margin:0 0 6px}'+
    '#ta-gate p{color:#7A6A52;font-size:.95rem;margin:0 0 20px;line-height:1.5}'+
    '#ta-gate input{width:100%;padding:14px 16px;border-radius:12px;border:1.5px solid #F0E2C8;background:#fff;'+
      'font:inherit;font-size:1rem;color:#23190D;text-align:center;letter-spacing:.04em}'+
    '#ta-gate input:focus{outline:none;border-color:#FFB527;box-shadow:0 0 0 3px rgba(255,181,39,.25)}'+
    '#ta-gate button{width:100%;margin-top:14px;padding:14px;border:none;border-radius:99px;cursor:pointer;'+
      'font:inherit;font-weight:800;color:#fff;background:#E8431F;transition:.2s}'+
    '#ta-gate button:hover{background:#ff5a2a}'+
    '#ta-gate .err{display:none;color:#C2380F;font-weight:700;font-size:.9rem;margin-top:12px}';
  (document.head||document.documentElement).appendChild(hide);

  function sha(str){
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function(buf){
      return Array.prototype.map.call(new Uint8Array(buf),function(b){return ('0'+b.toString(16)).slice(-2);}).join('');
    });
  }
  var T={
    en:{t:'Private preview',p:'This site is in its pilot phase. Enter the access word to continue.',ph:'Access word',b:'Enter',e:'Not quite — try again.'},
    it:{t:'Anteprima privata',p:'Il sito è in fase pilota. Inserisci la parola d’accesso per continuare.',ph:'Parola d’accesso',b:'Entra',e:'Non corretta — riprova.'},
    es:{t:'Vista previa privada',p:'El sitio está en fase piloto. Introduce la palabra de acceso para continuar.',ph:'Palabra de acceso',b:'Entrar',e:'No es correcta — inténtalo de nuevo.'},
    de:{t:'Private Vorschau',p:'Die Seite ist in der Pilotphase. Gib das Zugangswort ein, um fortzufahren.',ph:'Zugangswort',b:'Weiter',e:'Nicht ganz — versuch es erneut.'}
  };
  function lang(){
    var s=null; try{s=localStorage.getItem('mp_lang');}catch(e){}
    if(s&&T[s])return s;
    var n=(navigator.language||'en').slice(0,2).toLowerCase();
    return T[n]?n:'en';
  }
  function build(){
    var t=T[lang()];
    var g=document.createElement('div'); g.id='ta-gate';
    g.innerHTML=
      '<form class="card" autocomplete="off">'+
        '<svg class="logo" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 56 V32 a20 20 0 0 1 40 0 V56" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="27" r="8" fill="#FFB527"/><path d="M16 52 l8 -8 8 8 8 -9 8 9" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
        '<h1>'+t.t+'</h1>'+
        '<p>'+t.p+'</p>'+
        '<input type="password" inputmode="text" aria-label="'+t.ph+'" placeholder="'+t.ph+'" autofocus />'+
        '<button type="submit">'+t.b+'</button>'+
        '<div class="err">'+t.e+'</div>'+
      '</form>';
    document.body.appendChild(g);
    var inp=g.querySelector('input'), err=g.querySelector('.err');
    setTimeout(function(){try{inp.focus();}catch(e){}},30);
    g.querySelector('form').addEventListener('submit',function(e){
      e.preventDefault();
      sha((inp.value||'').trim()).then(function(h){
        if(h===HASH){
          try{sessionStorage.setItem(KEY,'1');}catch(e){}
          var s=document.getElementById('ta-gate-hide'); if(s)s.parentNode.removeChild(s);
          g.parentNode.removeChild(g);
        }else{
          err.style.display='block'; inp.value=''; inp.focus();
        }
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build);
  else build();
})();
