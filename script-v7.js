
(()=>{"use strict";
const nav=document.getElementById("mainNav");
document.getElementById("mainMenu").onclick=()=>nav.classList.toggle("open");
const layer=document.getElementById("siteSparkles");
layer.innerHTML=Array.from({length:70},()=>`<i style="left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s"></i>`).join("");
})();
