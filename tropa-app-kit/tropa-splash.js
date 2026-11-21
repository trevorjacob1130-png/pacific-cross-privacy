/*
 * Tropa Fantasy: animated launch screen.
 *
 * Load it as the FIRST thing inside <body>, as a normal (blocking) script:
 *   <script src="/tropa-splash.js"></script>
 *
 * It plays when the site is opened from the home-screen icon (standalone mode),
 * once per app session. Add ?splash=1 to any URL to force it in a normal tab.
 * It stays up until the page has loaded (min 1.7s, max 4s), then animates away.
 */
(function () {
  var MIN_MS = 1700, MAX_MS = 4000, BG = "#070B1A";

  var forced = /[?&]splash=1\b/.test(location.search);
  var standalone =
    (window.matchMedia && matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;
  if (!forced && !standalone) return;

  try {
    if (!forced && sessionStorage.getItem("tropaSplashShown")) return;
    sessionStorage.setItem("tropaSplashShown", "1");
  } catch (e) { /* storage blocked: just show it */ }

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var start = Date.now();

  var css = [
    "#tropa-splash{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;",
    "background:radial-gradient(120% 80% at 50% 38%,#1B2550 0%,#0D1430 45%," + BG + " 100%);",
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;overflow:hidden;",
    "padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);-webkit-user-select:none;user-select:none}",
    "#tropa-splash .ts-rays{position:absolute;width:160vmax;height:160vmax;left:50%;top:44%;margin:-80vmax 0 0 -80vmax;",
    "background:repeating-conic-gradient(from 0deg,rgba(255,194,51,.07) 0deg 6deg,transparent 6deg 18deg);",
    "-webkit-mask:radial-gradient(circle,#000 0,transparent 55%);mask:radial-gradient(circle,#000 0,transparent 55%);",
    "opacity:0;animation:ts-fade .9s .25s ease-out forwards,ts-spin 18s linear infinite}",
    "#tropa-splash .ts-stage{position:relative;width:min(58vw,270px);aspect-ratio:1}",
    "#tropa-splash .ts-ring{position:absolute;inset:-6%;border-radius:50%;border:2px solid rgba(255,214,102,.55);opacity:0;transform:scale(.4)}",
    "#tropa-splash .ts-ring.r1{animation:ts-ring 1.1s .35s cubic-bezier(.2,.7,.2,1) forwards}",
    "#tropa-splash .ts-ring.r2{animation:ts-ring 1.1s .55s cubic-bezier(.2,.7,.2,1) forwards}",
    "#tropa-splash svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}",
    "#tropa-splash .ts-crest{transform-origin:256px 260px;transform:scale(.2) rotate(-18deg);opacity:0;",
    "animation:ts-pop .75s .1s cubic-bezier(.34,1.56,.64,1) forwards}",
    "#tropa-splash .ts-outline{stroke-dasharray:1100;stroke-dashoffset:1100;animation:ts-draw .9s .2s ease-out forwards}",
    "#tropa-splash .ts-bar{transform:translateY(-140px);opacity:0;animation:ts-drop .5s .6s cubic-bezier(.34,1.56,.64,1) forwards}",
    "#tropa-splash .ts-stem{transform-origin:256px 178px;transform:scaleY(0);animation:ts-grow .45s .85s cubic-bezier(.2,.8,.2,1) forwards}",
    "#tropa-splash .ts-shine{transform:translateX(-420px) skewX(-20deg);animation:ts-shine .8s 1.15s ease-in-out forwards}",
    "#tropa-splash .ts-spark{transform-origin:358px 134px;transform:scale(0);animation:ts-spark .6s 1.25s cubic-bezier(.34,1.56,.64,1) forwards}",
    "#tropa-splash .ts-word{margin-top:28px;display:flex;gap:.06em;font-size:clamp(34px,10vw,52px);font-weight:900;letter-spacing:.04em;color:#fff}",
    "#tropa-splash .ts-word span{display:inline-block;opacity:0;transform:translateY(24px);animation:ts-rise .5s cubic-bezier(.2,.8,.2,1) forwards}",
    "#tropa-splash .ts-sub{margin-top:6px;font-size:clamp(11px,3.2vw,14px);font-weight:700;color:#FFC233;letter-spacing:.2em;opacity:0;",
    "animation:ts-track .8s 1.35s cubic-bezier(.2,.8,.2,1) forwards}",
    "#tropa-splash .ts-load{position:absolute;bottom:calc(64px + env(safe-area-inset-bottom));width:120px;height:3px;border-radius:3px;",
    "background:rgba(255,255,255,.12);overflow:hidden;opacity:0;animation:ts-fade .4s 1.4s forwards}",
    "#tropa-splash .ts-load i{position:absolute;inset:0;width:40%;border-radius:3px;background:linear-gradient(90deg,#FFE38A,#F08A0C);",
    "animation:ts-bar 1.1s ease-in-out infinite}",
    "#tropa-splash.ts-out{animation:ts-out .45s cubic-bezier(.6,0,.8,.4) forwards}",
    "#tropa-splash.ts-out .ts-stage{animation:ts-zoom .45s cubic-bezier(.6,0,.8,.4) forwards}",
    "@keyframes ts-pop{to{transform:scale(1) rotate(0);opacity:1}}",
    "@keyframes ts-draw{to{stroke-dashoffset:0}}",
    "@keyframes ts-drop{to{transform:translateY(0);opacity:1}}",
    "@keyframes ts-grow{to{transform:scaleY(1)}}",
    "@keyframes ts-shine{to{transform:translateX(420px) skewX(-20deg)}}",
    "@keyframes ts-spark{0%{transform:scale(0) rotate(0)}100%{transform:scale(1) rotate(90deg)}}",
    "@keyframes ts-ring{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(1.5)}}",
    "@keyframes ts-rise{to{opacity:1;transform:translateY(0)}}",
    "@keyframes ts-track{from{opacity:0;letter-spacing:.05em}to{opacity:1;letter-spacing:.55em}}",
    "@keyframes ts-fade{to{opacity:1}}",
    "@keyframes ts-spin{to{transform:rotate(360deg)}}",
    "@keyframes ts-bar{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}",
    "@keyframes ts-out{to{opacity:0;visibility:hidden}}",
    "@keyframes ts-zoom{to{transform:scale(1.35)}}",
    "@media (prefers-reduced-motion:reduce){#tropa-splash *{animation-duration:.01s!important;animation-delay:0s!important}",
    "#tropa-splash .ts-rays,#tropa-splash .ts-ring{display:none}}"
  ].join("");

  var letters = "TROPA".split("").map(function (c, i) {
    return '<span style="animation-delay:' + (0.95 + i * 0.07).toFixed(2) + 's">' + c + "</span>";
  }).join("");

  var html =
    '<div class="ts-rays"></div>' +
    '<div class="ts-stage">' +
      '<div class="ts-ring r1"></div><div class="ts-ring r2"></div>' +
      '<svg viewBox="0 0 512 512" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="tsGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE38A"/><stop offset=".5" stop-color="#FFC233"/><stop offset="1" stop-color="#F08A0C"/></linearGradient>' +
          '<clipPath id="tsClip"><path d="M256 104 L380 146 V254 C380 330 324 382 256 410 C188 382 132 330 132 254 V146 Z"/></clipPath>' +
          '<filter id="tsGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>' +
        '</defs>' +
        '<g class="ts-crest">' +
          '<path d="M256 104 L380 146 V254 C380 330 324 382 256 410 C188 382 132 330 132 254 V146 Z" fill="#FFC233" opacity=".45" filter="url(#tsGlow)"/>' +
          '<path d="M256 104 L380 146 V254 C380 330 324 382 256 410 C188 382 132 330 132 254 V146 Z" fill="url(#tsGold)"/>' +
          '<g clip-path="url(#tsClip)">' +
            '<rect class="ts-bar" x="180" y="178" width="152" height="42" rx="9" fill="#0D1430"/>' +
            '<rect class="ts-stem" x="235" y="178" width="42" height="170" rx="9" fill="#0D1430"/>' +
            '<rect class="ts-shine" x="100" y="80" width="70" height="360" fill="#fff" opacity=".45"/>' +
          '</g>' +
        '</g>' +
        '<path class="ts-outline" d="M256 104 L380 146 V254 C380 330 324 382 256 410 C188 382 132 330 132 254 V146 Z" fill="none" stroke="#FFF4C7" stroke-width="6" stroke-linejoin="round"/>' +
        '<path class="ts-spark" d="M358 112 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 l16 -6 z" fill="#FFF4C7"/>' +
      "</svg>" +
    "</div>" +
    '<div class="ts-word" aria-label="Tropa">' + letters + "</div>" +
    '<div class="ts-sub">FANTASY</div>' +
    '<div class="ts-load"><i></i></div>';

  var style = document.createElement("style");
  style.id = "tropa-splash-style";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  var el = document.createElement("div");
  el.id = "tropa-splash";
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Loading Tropa Fantasy");
  el.innerHTML = html;
  (document.body || document.documentElement).appendChild(el);

  var done = false;
  function hide() {
    if (done) return;
    done = true;
    el.classList.add("ts-out");
    setTimeout(function () {
      el.remove();
      style.remove();
    }, reduce ? 50 : 480);
  }
  function whenReady() {
    setTimeout(hide, Math.max(0, (reduce ? 300 : MIN_MS) - (Date.now() - start)));
  }
  if (document.readyState === "complete") whenReady();
  else window.addEventListener("load", whenReady, { once: true });
  setTimeout(hide, MAX_MS);
  el.addEventListener("click", hide);
})();
