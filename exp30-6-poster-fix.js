(() => {
  const section=document.getElementById('downloads');
  section?.classList.add('visible');
  document.querySelectorAll('#downloads .poster-image img').forEach(img=>{
    img.loading='eager';
    img.decoding='sync';
    if(!img.complete || img.naturalWidth===0){
      const src=img.getAttribute('src');
      img.src=`${src}${src.includes('?')?'&':'?'}v=30.6`;
    }
  });
})();
