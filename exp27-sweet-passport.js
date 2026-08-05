
/* EXP 26 — Sweetville interactive hub. Existing content remains intact. */
.exp260-hub{padding:clamp(5rem,8vw,8rem) 3vw 2rem}
.exp260-hub-shell{max-width:1320px;margin:auto}
.exp260-hub-head{display:flex;justify-content:space-between;gap:2rem;align-items:end;margin-bottom:1.2rem}
.exp260-hub-head h1{margin:.3rem 0;font-family:"Playfair Display",serif;font-size:clamp(3rem,7vw,6.5rem);line-height:.95}
.exp260-hub-head em{font-family:"Sacramento",cursive;color:#ff74bd;font-weight:400}
.exp260-view-controls{display:flex;gap:.55rem;flex-wrap:wrap}
.exp260-view-controls button{padding:.8rem 1rem;border:1px solid rgba(255,128,198,.55);border-radius:999px;background:#ffffff0d;color:white;cursor:pointer}
.exp260-view-controls button.active{background:linear-gradient(135deg,#ff2e9c,#9e26ff)}
.exp260-map-wrap{position:relative;min-height:720px;overflow:hidden;border:1px solid rgba(255,116,190,.48);border-radius:32px;background:linear-gradient(160deg,#25002c,#08000b);box-shadow:0 28px 80px rgba(0,0,0,.45)}
.exp260-map-sky{position:absolute;inset:0;background:radial-gradient(circle at 70% 15%,rgba(255,143,203,.28),transparent 24%),radial-gradient(circle at 22% 78%,rgba(91,95,255,.24),transparent 25%)}
.exp260-map-water{position:absolute;left:40%;top:-10%;width:18%;height:120%;transform:rotate(8deg);background:linear-gradient(90deg,rgba(80,113,255,.08),rgba(80,222,255,.28),rgba(80,113,255,.08));filter:blur(1px)}
.exp260-map-path{position:absolute;height:16px;border-radius:999px;background:rgba(255,186,220,.2);box-shadow:0 0 20px rgba(255,89,180,.22)}
.path-a{left:7%;right:8%;top:48%;transform:rotate(-8deg)}.path-b{left:16%;right:12%;top:58%;transform:rotate(19deg)}
.exp260-map-train{position:absolute;left:8%;bottom:7%;font-size:2.2rem;animation:exp260Train 14s linear infinite}
.exp260-pin{position:absolute;z-index:2;min-width:170px;padding:.95rem 1rem;border:1px solid rgba(255,145,205,.58);border-radius:20px;background:rgba(14,0,17,.9);color:#fff;text-align:left;text-decoration:none;cursor:pointer;box-shadow:0 15px 38px rgba(0,0,0,.36);transition:.22s}
.exp260-pin:hover,.exp260-pin:focus-visible{transform:translateY(-6px) scale(1.03);box-shadow:0 20px 48px rgba(0,0,0,.42),0 0 30px rgba(255,71,172,.28)}
.exp260-pin span{display:block;font-size:1.8rem}.exp260-pin strong,.exp260-pin small{display:block}.exp260-pin small{margin-top:.2rem;color:#dcbfd1}
.pin-bay{right:5%;top:12%}.pin-garden{left:7%;top:18%}.pin-stage{right:15%;bottom:18%}.pin-map{left:38%;top:39%}.pin-sphere{right:33%;top:13%}.pin-room{left:8%;bottom:16%}.pin-story{left:38%;bottom:8%}.pin-create{left:24%;top:8%}.pin-passport{right:4%;top:48%}.pin-express{left:52%;top:58%}
.exp260-preview{display:flex;gap:1rem;align-items:center;margin-top:1rem;padding:1.1rem;border:1px solid rgba(255,135,201,.44);border-radius:20px;background:#0c000f}
.exp260-preview>span{font-size:2.5rem}.exp260-preview h3{margin:.15rem 0;font-size:1.5rem}
body.exp260-explore-mode .exp260-hub{padding-bottom:1rem}
body.exp260-explore-mode main>section:not(.exp260-hub):not(.exp270-passport-hud){display:block}
body:not(.exp260-explore-mode) main>section:not(.exp260-hub):not(.exp270-passport-hud){display:none}
body:not(.exp260-explore-mode) .exp260-hub{display:block!important}
@keyframes exp260Train{from{transform:translateX(0)}to{transform:translateX(60vw)}}
@media(max-width:850px){
  .exp260-hub-head{align-items:flex-start;flex-direction:column}
  .exp260-map-wrap{min-height:980px}
  .exp260-pin{position:absolute;min-width:145px;max-width:44%;font-size:.85rem}
  .pin-bay{right:4%;top:7%}.pin-garden{left:4%;top:19%}.pin-stage{right:5%;top:31%}.pin-map{left:5%;top:43%}.pin-sphere{right:5%;top:54%}.pin-room{left:5%;top:65%}.pin-story{right:5%;top:76%}.pin-create{left:5%;top:88%}.pin-passport{right:5%;top:90%}.pin-express{left:31%;top:8%}
}

/* EXP 27 — Sweet Passport layer */
.exp270-passport-hud{display:block!important;padding:1rem 3vw 4rem}
.exp270-passport-card{display:flex;gap:1rem;align-items:center;max-width:1320px;margin:auto;padding:1.1rem 1.3rem;border:1px solid rgba(255,146,207,.5);border-radius:22px;background:linear-gradient(135deg,#25001f,#0b000d)}
.exp270-passport-seal{font-size:3rem;color:#ff73ba}.exp270-passport-card h2{margin:.15rem 0;font-size:1.65rem}.exp270-passport-card button{margin-left:auto;padding:.8rem 1rem;border:1px solid #ff91c9;border-radius:999px;background:linear-gradient(135deg,#ff2f9f,#8d26ff);color:white;cursor:pointer}
.exp270-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;max-width:1320px;margin:.75rem auto 0}.exp270-stat-grid article{padding:1rem;border:1px solid rgba(255,139,201,.38);border-radius:18px;background:#0c000f;text-align:center}.exp270-stat-grid span,.exp270-stat-grid strong,.exp270-stat-grid small{display:block}.exp270-stat-grid span{font-size:1.6rem}.exp270-stat-grid strong{font-size:1.5rem}
.exp270-passport-modal{width:min(94vw,900px);padding:0;border:1px solid #ff8fc8;border-radius:28px;background:#130012;color:white}.exp270-passport-modal::backdrop{background:rgba(0,0,0,.82);backdrop-filter:blur(8px)}
.exp270-close{position:absolute;right:14px;top:12px;width:42px;height:42px;border:1px solid #ff9dcf;border-radius:50%;background:#22001c;color:white;font-size:1.5rem}
.exp270-passport-book{display:grid;grid-template-columns:.8fr 1.2fr}.exp270-passport-book>section{padding:2rem}.exp270-passport-book>section:first-child{background:linear-gradient(145deg,#8f1a6f,#2c0936)}.exp270-passport-book h2{font-family:"Playfair Display",serif;font-size:3rem}.exp270-identity{display:flex;gap:1rem;align-items:center;margin-top:2rem}.exp270-identity>span{font-size:4rem}
.exp270-stamps{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem}.exp270-stamp{padding:1rem;border:1px dashed rgba(255,151,207,.55);border-radius:16px;opacity:.4}.exp270-stamp.visited{opacity:1;border-color:#ffd765;box-shadow:0 0 22px rgba(255,213,101,.18)}
@media(max-width:760px){.exp270-stat-grid{grid-template-columns:repeat(2,1fr)}.exp270-passport-book{grid-template-columns:1fr}.exp270-passport-card{align-items:flex-start;flex-wrap:wrap}.exp270-passport-card button{margin-left:0}}
