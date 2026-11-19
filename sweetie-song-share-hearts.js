/* Independent, no-layout-impact share hearts for song cards. */
(() => {
  'use strict';
  const boot = () => {
    const catalog = new Map((window.JAHNTELLA_EXTRA_TRACKS || []).map(t => [t.key,t.title]));
    const songName = (key,card) => catalog.get(key) || card?.querySelector('h3')?.textContent?.trim() || key.replace(/-/g,' ').replace(/\b\w/g,ch=>ch.toUpperCase());
    const css = document.createElement('style');
    css.textContent = `
      [data-card].sweetie-share-card{position:relative!important}
      [data-card]>.sweetie-share-heart{position:absolute!important;z-index:8!important;top:8px!important;right:8px!important;display:grid!important;place-items:center!important;width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.85)!important;border-radius:50%!important;background:rgba(32,15,37,.80)!important;color:#ffbfdf!important;font:700 21px/1 Arial,sans-serif!important;cursor:pointer!important;box-shadow:0 2px 10px #0006!important;transform:none!important}
      [data-card]>.sweetie-share-heart:hover{background:#9d346b!important;color:white!important}
      [data-card]>.sweetie-share-heart:focus-visible{outline:3px solid #ffcae6!important;outline-offset:3px!important}
      #sweetieCardShareDialog[hidden]{display:none!important}
      #sweetieCardShareDialog{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(14,7,23,.80)}
      #sweetieCardShareDialog .sweetie-card-share-panel{position:relative;max-width:440px;width:100%;padding:26px 20px 22px;border:1px solid #efb5d9;border-radius:21px;background:#fff6fc;color:#4a1a38;box-shadow:0 16px 48px #0009;text-align:center}
      #sweetieCardShareDialog h2{font:700 1.5rem Georgia,serif;color:#70224b;margin:0 34px 14px}
      #sweetieCardShareDialog p{font:500 1rem/1.5 Arial,sans-serif;color:#542343;margin:0 0 18px}
      #sweetieCardShareDialog .sweetie-share-buttons{display:flex;flex-wrap:wrap;justify-content:center;gap:9px}
      #sweetieCardShareDialog .sweetie-share-buttons a,#sweetieCardShareDialog .sweetie-share-buttons button{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;min-height:42px;border:1px solid #b45d91;border-radius:99px;background:#a43e78;color:white;font:700 .88rem Arial,sans-serif;text-decoration:none;cursor:pointer}
      #sweetieCardShareDialog .sweetie-share-close{position:absolute;top:9px;right:11px;border:0;background:transparent;color:#70224b;cursor:pointer;font-size:27px}
      #sweetieCardShareDialog .sweetie-share-feedback{font-size:.8rem;margin-top:12px;min-height:1em}
      @media(max-width:600px){[data-card]>.sweetie-share-heart{top:6px!important;right:6px!important;width:32px!important;height:32px!important}}
    `;
    document.head.appendChild(css);
    const overlay = document.createElement('div');
    overlay.id = 'sweetieCardShareDialog';overlay.hidden = true;
    overlay.innerHTML = '<div class="sweetie-card-share-panel" role="dialog" aria-modal="true" aria-labelledby="sweetieCardShareTitle"><button class="sweetie-share-close" type="button" aria-label="Close sharing">×</button><h2 id="sweetieCardShareTitle">♡ Share your fave!</h2><p data-sweetie-share-caption></p><div class="sweetie-share-buttons"><a data-sweetie-share-facebook target="_blank" rel="noopener noreferrer">Facebook quick share</a><button data-sweetie-share-facebook-post type="button">Copy link + open Facebook</button><a data-sweetie-share-x target="_blank" rel="noopener noreferrer">X / Twitter</a><button data-sweetie-share-copy type="button">Copy caption + link</button><button data-sweetie-share-native type="button" hidden>More apps…</button></div><div class="sweetie-share-feedback" role="status" aria-live="polite"></div></div>';
    document.body.appendChild(overlay);
    let previousFocus=null, shareUrl='',shareCaption='';
    const close=()=>{overlay.hidden=true;previousFocus?.focus();};
    overlay.querySelector('.sweetie-share-close').addEventListener('click',close);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close();});
    overlay.querySelector('[data-sweetie-share-copy]').addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(shareCaption+' '+shareUrl);overlay.querySelector('.sweetie-share-feedback').textContent='Copied! ♡';}
      catch(e){window.prompt('Copy your message:',shareCaption+' '+shareUrl);}
    });
    overlay.querySelector('[data-sweetie-share-facebook-post]').addEventListener('click',async()=>{
      const feedback=overlay.querySelector('.sweetie-share-feedback');
      const facebook=window.open('https://www.facebook.com/','_blank','noopener,noreferrer');
      try{
        await navigator.clipboard.writeText(shareCaption+'\n'+shareUrl);
        feedback.textContent='Copied! In Facebook, choose Create post, paste, then press Post. ♡';
      }catch(e){
        feedback.textContent='Copy the song link below, then paste into a new Facebook post.';
        window.prompt('Copy your song link:',shareUrl);
      }
      if(!facebook)feedback.textContent+=' If Facebook did not open, allow pop-ups or open facebook.com.';
    });
    const native=overlay.querySelector('[data-sweetie-share-native]');
    if(typeof navigator.share==='function'){native.hidden=false;native.addEventListener('click',async()=>{try{await navigator.share({title:'Jahntella — my fave song',text:shareCaption,url:shareUrl});}catch(e){if(e.name!=='AbortError')overlay.querySelector('.sweetie-share-feedback').textContent='Try Copy caption + link.';}});}
    const open=(key,card,button)=>{
      previousFocus=button;
      const url=new URL('/songs/'+encodeURIComponent(key)+'.html',window.location.origin);
      shareUrl=url.toString();
      shareCaption='OMG 💗 My fave song right now is '+songName(key,card)+' by Jahntella! 🎶 Come listen with me!';
      overlay.querySelector('[data-sweetie-share-caption]').textContent=shareCaption;
      overlay.querySelector('[data-sweetie-share-facebook]').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(shareUrl);
      overlay.querySelector('[data-sweetie-share-x]').href='https://twitter.com/intent/tweet?text='+encodeURIComponent(shareCaption)+'&url='+encodeURIComponent(shareUrl);
      overlay.querySelector('.sweetie-share-feedback').textContent='';
      overlay.hidden=false;overlay.querySelector('.sweetie-share-close').focus();
    };
    const decorate=()=>{
      document.querySelectorAll('[data-card]').forEach(card=>{
        const key=card.getAttribute('data-card');
        if(!key||card.querySelector(':scope > .sweetie-share-heart')||(!card.querySelector('[data-track]')&&!card.querySelector('[data-shine-track]')))return;
        const btn=document.createElement('button');
        btn.type='button';btn.className='sweetie-share-heart';
        btn.textContent='♡';btn.setAttribute('aria-label','Share '+songName(key,card)+' by Jahntella');btn.title='Share '+songName(key,card);
        btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open(key,card,btn);});
        card.classList.add('sweetie-share-card');card.appendChild(btn);
      });
    };
    decorate();
    let scheduled=false;
    const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorate();});});
    observer.observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
