/* ============================================================
   main.js — RETRO ARCADE EDITION
   Content comes from js/content.js (SITE_CONTENT).
   Modules: sfx · starfield · hud score · boot text · skills
   (power-ups) · cartridges+console · Packet Pong · nav ·
   reveal · konami · misc. All motion honours
   prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ============================================================
     SFX — tiny WebAudio bleeper. OFF by default; HUD toggle.
     ============================================================ */
  var sfx = (function () {
    var enabled = false;
    var ctx = null;
    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function beep(freq, dur, type, vol) {
      if (!enabled || !ensure()) return;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol || 0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.08));
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + (dur || 0.08));
    }
    return {
      toggle: function () { enabled = !enabled; if (enabled) ensure(); return enabled; },
      blip: function () { beep(880, 0.05); },
      pickup: function () { beep(660, 0.06); setTimeout(function () { beep(990, 0.09); }, 55); },
      insert: function () { beep(220, 0.1, "sawtooth"); setTimeout(function () { beep(440, 0.12); }, 90); },
      bounce: function () { beep(440, 0.04); },
      score: function () { beep(180, 0.15, "sawtooth", 0.05); },
      fanfare: function () {
        [523, 659, 784, 1046].forEach(function (f, i) {
          setTimeout(function () { beep(f, 0.12); }, i * 110);
        });
      }
    };
  })();

  function initSfxToggle() {
    var btn = document.getElementById("sfx-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var on = sfx.toggle();
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "SFX:ON" : "SFX:OFF";
      if (on) sfx.blip();
    });
  }

  /* ============================================================
     HUD SCORE — scroll depth + power-up pickups. LVL = section.
     ============================================================ */
  var hud = (function () {
    var score = 0;
    var shown = 0;
    var el, lvlEl;
    function fmt(n) { return String(Math.floor(n)).padStart(6, "0"); }
    function tick() {
      if (!el) return;
      if (shown < score) {
        shown = Math.min(score, shown + Math.max(1, Math.round((score - shown) / 6)));
        el.textContent = fmt(shown);
        requestAnimationFrame(tick);
      } else {
        el.textContent = fmt(score);
      }
    }
    return {
      init: function () {
        el = document.getElementById("score");
        lvlEl = document.getElementById("level");
        var maxScroll = 0;
        window.addEventListener("scroll", function () {
          var doc = document.documentElement;
          var depth = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
          if (depth > maxScroll) {
            score += Math.round((depth - maxScroll) * 500);
            maxScroll = depth;
            tick();
          }
        }, { passive: true });
      },
      add: function (n) { score += n; tick(); },
      setLevel: function (n) { if (lvlEl) lvlEl.textContent = String(n).padStart(2, "0"); }
    };
  })();

  /* floating "+10" at a point */
  function floatPoints(x, y, label) {
    if (reducedMotion) return;
    var d = document.createElement("div");
    d.className = "float-pts";
    d.textContent = label;
    d.style.left = x + "px";
    d.style.top = y + "px";
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 750);
  }

  /* ============================================================
     STARFIELD — pixel stars drifting down. Paused off-tab.
     ============================================================ */
  function initStarfield() {
    var cv = document.getElementById("starfield");
    if (!cv) return;
    var cx = cv.getContext("2d");
    var stars = [];
    var running = !reducedMotion;

    function resize() {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    }
    function seed() {
      stars = [];
      var n = Math.min(140, Math.floor(cv.width * cv.height / 9000));
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * cv.width,
          y: Math.random() * cv.height,
          s: Math.random() < 0.85 ? 1 : 2,
          v: 0.15 + Math.random() * 0.5,
          c: Math.random() < 0.08 ? "#2de2e6" : (Math.random() < 0.06 ? "#ffb000" : "#8f89b8")
        });
      }
    }
    function draw() {
      cx.clearRect(0, 0, cv.width, cv.height);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        cx.fillStyle = st.c;
        cx.fillRect(st.x | 0, st.y | 0, st.s, st.s);
        st.y += st.v;
        if (st.y > cv.height) { st.y = -2; st.x = Math.random() * cv.width; }
      }
      if (running) requestAnimationFrame(draw);
    }
    resize(); seed();
    window.addEventListener("resize", function () { resize(); seed(); if (reducedMotion) draw(); });
    document.addEventListener("visibilitychange", function () {
      if (reducedMotion) return;
      running = !document.hidden;
      if (running) requestAnimationFrame(draw);
    });
    draw(); // reduced motion: single static frame
  }

  /* ============================================================
     BOOT LINE — typewriter, instant under reduced motion.
     ============================================================ */
  function initBoot() {
    var el = document.getElementById("bootline");
    if (!el) return;
    var full = "BOOT> LOADING PLAYER PROFILE… OK. READY PLAYER 1.";
    if (reducedMotion) { el.textContent = full; return; }
    el.textContent = "";
    var i = 0;
    (function type() {
      if (i <= full.length) {
        el.textContent = full.slice(0, i++);
        setTimeout(type, i < 6 ? 90 : 34);
      }
    })();
  }

  /* ============================================================
     SKILLS — power-up inventory with collectable chips.
     ============================================================ */
  function renderSkills() {
    var grid = document.getElementById("skills-grid");
    if (!grid || !window.SITE_CONTENT) return;
    SITE_CONTENT.skills.forEach(function (cat) {
      var panel = document.createElement("div");
      panel.className = "sensor reveal";
      panel.innerHTML =
        '<div class="sensor-head">' +
        '<span class="sensor-title">' + esc(cat.title.toUpperCase()) + "</span>" +
        '<span class="count">x' + cat.items.length + "</span>" +
        "</div>" +
        '<ul class="chipset" role="list">' +
        cat.items.map(function (s) {
          return '<li><button type="button" class="chip" aria-pressed="false">' + esc(s) + "</button></li>";
        }).join("") +
        "</ul>";
      grid.appendChild(panel);
    });

    grid.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip || chip.classList.contains("collected")) return;
      chip.classList.add("collected", "pop");
      chip.setAttribute("aria-pressed", "true");
      hud.add(10);
      sfx.pickup();
      var r = chip.getBoundingClientRect();
      floatPoints(r.left + r.width / 2 - 14, r.top - 8, "+10");
      setTimeout(function () { chip.classList.remove("pop"); }, 300);
    });
  }

  /* ============================================================
     PROJECTS — cartridge shelf (tabs) + console screen (panel).
     ============================================================ */
  var CART_STRIPES = [
    "linear-gradient(90deg,#ff3864,#ff6d1f,#ffd23f)",
    "linear-gradient(90deg,#2de2e6,#3bff8f)",
    "linear-gradient(90deg,#ffb000,#ff3864)",
    "linear-gradient(90deg,#3bff8f,#2de2e6,#ffd23f)"
  ];

  function renderProjects() {
    var shelf = document.getElementById("cart-shelf");
    var screen = document.getElementById("cart-screen");
    if (!shelf || !screen || !window.SITE_CONTENT) return;

    SITE_CONTENT.projects.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cart";
      b.id = "cart-" + p.id;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", "false");
      b.setAttribute("aria-controls", "cart-screen");
      b.innerHTML =
        '<span class="cart-id">' + esc(p.id.toUpperCase()) + "</span>" +
        '<span class="cart-label">' +
        '<span class="cart-stripe" style="background:' + CART_STRIPES[i % CART_STRIPES.length] + '"></span>' +
        '<span class="cart-title">' + esc(p.title.toUpperCase()) + "</span>" +
        '<span class="cart-stack">' + p.stack.map(esc).join(" · ") + "</span>" +
        "</span>";
      b.addEventListener("click", function () { selectCart(p, b); });
      shelf.appendChild(b);
    });

    // keyboard: arrow between cartridges
    shelf.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var carts = Array.prototype.slice.call(shelf.querySelectorAll(".cart"));
      var idx = carts.indexOf(document.activeElement);
      if (idx === -1) return;
      e.preventDefault();
      var next = carts[(idx + (e.key === "ArrowRight" ? 1 : carts.length - 1)) % carts.length];
      next.focus();
    });

    function selectCart(p, btn) {
      shelf.querySelectorAll(".cart").forEach(function (c) {
        c.setAttribute("aria-selected", "false");
      });
      btn.setAttribute("aria-selected", "true");
      screen.setAttribute("aria-labelledby", btn.id);
      sfx.insert();

      var render = function () {
        screen.innerHTML =
          '<h3 class="cs-title">' + esc(p.title.toUpperCase()) + "</h3>" +
          '<p class="cs-summary">' + esc(p.summary) + "</p>" +
          '<div class="cs-grid">' +
          csField("THE PROBLEM", "<p>" + esc(p.problem) + "</p>") +
          csField("MY ROLE", "<p>" + esc(p.role) + "</p>") +
          csField("KEY FEATURES", "<ul>" + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>") +
          csField("CHALLENGES & HIGHLIGHTS", phText(p.highlights)) +
          csField("WHAT I LEARNED", phText(p.learned)) +
          '<div class="cs-links">' +
          linkBtn(p.repo, "▶ VIEW REPOSITORY", "[ADD GITHUB REPO LINK]") +
          (p.demo !== undefined ? linkBtn(p.demo, "▶ LIVE DEMO", "[ADD DEMO LINK, OR REMOVE]") : "") +
          "</div></div>";
      };

      if (reducedMotion) { render(); return; }
      screen.classList.remove("loading");
      void screen.offsetWidth;           // restart animation
      screen.classList.add("loading");
      setTimeout(render, 140);
    }

    function csField(label, inner) {
      return '<div class="cs-field"><h4>' + label + "</h4>" + inner + "</div>";
    }
    function phText(obj) {
      if (!obj) return "<p>—</p>";
      return obj.ph
        ? '<p class="ph" title="Replace in js/content.js">' + esc(obj.text) + "</p>"
        : "<p>" + esc(obj.text) + "</p>";
    }
    function linkBtn(url, label, phLabel) {
      if (url) {
        return '<a class="btn btn-coin" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>";
      }
      return '<span class="chip ph" title="Add the URL in js/content.js">' + esc(phLabel) + "</span>";
    }
  }

  /* ============================================================
     PACKET PONG — attract mode + playable. LAN (you) vs WAN.
     ============================================================ */
  function initPong() {
    var cv = document.getElementById("pong");
    if (!cv) return;
    var cx = cv.getContext("2d");
    var W = cv.width, H = cv.height;

    var COL = {
      bg: "#02020a", dim: "#2b2348", text: "#e9e6f4",
      amber: "#ffb000", cyan: "#2de2e6", red: "#ff3864",
      green: "#3bff8f", faint: "#6a6394"
    };

    var state = "attract"; // attract | play | over
    var running = true, visible = true;
    var frameBlink = 0;

    var P = { x: 24, y: H / 2 - 32, w: 10, h: 64, score: 0 };       // player (LAN)
    var C = { x: W - 34, y: H / 2 - 32, w: 10, h: 64, score: 0 };   // cpu (WAN)
    var ball = { x: W / 2, y: H / 2, s: 9, vx: 3.4, vy: 2.1 };
    var keys = {};
    var WIN = 5;

    function resetBall(dir) {
      ball.x = W / 2; ball.y = H / 2;
      ball.vx = 3.4 * (dir || (Math.random() < 0.5 ? 1 : -1));
      ball.vy = (Math.random() * 3 - 1.5) || 1.4;
    }

    function startPlay() {
      P.score = 0; C.score = 0;
      state = "play";
      resetBall(1);
      cv.focus();
      sfx.fanfare();
    }

    // input
    cv.addEventListener("click", function () {
      if (state !== "play") startPlay();
    });
    cv.addEventListener("keydown", function (e) {
      if (["ArrowUp", "ArrowDown", "w", "s", "W", "S", " "].indexOf(e.key) !== -1) e.preventDefault();
      if (e.key === "Enter" && state !== "play") { startPlay(); return; }
      keys[e.key] = true;
    });
    cv.addEventListener("keyup", function (e) { keys[e.key] = false; });
    cv.addEventListener("mousemove", function (e) {
      if (state !== "play") return;
      var r = cv.getBoundingClientRect();
      var y = (e.clientY - r.top) / r.height * H;
      P.y = clamp(y - P.h / 2, 0, H - P.h);
    });
    cv.addEventListener("touchmove", function (e) {
      if (state !== "play") return;
      e.preventDefault();
      var r = cv.getBoundingClientRect();
      var y = (e.touches[0].clientY - r.top) / r.height * H;
      P.y = clamp(y - P.h / 2, 0, H - P.h);
    }, { passive: false });

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    function stepPaddles() {
      if (state === "play") {
        if (keys.ArrowUp || keys.w || keys.W) P.y -= 5;
        if (keys.ArrowDown || keys.s || keys.S) P.y += 5;
        P.y = clamp(P.y, 0, H - P.h);
        cpuFollow(C, 0.72);
      } else { // attract: two CPUs
        cpuFollow(P, 0.6);
        cpuFollow(C, 0.6);
      }
    }
    function cpuFollow(pad, skill) {
      var target = ball.y - pad.h / 2 + (Math.sin(Date.now() / 300) * 12);
      pad.y += clamp((target - pad.y) * 0.08 * (skill * 2), -4.2, 4.2);
      pad.y = clamp(pad.y, 0, H - pad.h);
    }

    function stepBall() {
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.y <= 0 || ball.y + ball.s >= H) { ball.vy *= -1; if (state === "play") sfx.bounce(); }
      // paddles
      if (ball.vx < 0 && hit(P)) { deflect(P); }
      if (ball.vx > 0 && hit(C)) { deflect(C); }
      // out
      if (ball.x < -20) { point(C); }
      if (ball.x > W + 20) { point(P); }
    }
    function hit(pad) {
      return ball.x < pad.x + pad.w && ball.x + ball.s > pad.x &&
             ball.y < pad.y + pad.h && ball.y + ball.s > pad.y;
    }
    function deflect(pad) {
      ball.vx *= -1.04;
      ball.vx = clamp(ball.vx, -8, 8);
      var rel = (ball.y + ball.s / 2 - (pad.y + pad.h / 2)) / (pad.h / 2);
      ball.vy = rel * 3.6;
      ball.x = pad === P ? pad.x + pad.w + 1 : pad.x - ball.s - 1;
      if (state === "play") sfx.bounce();
    }
    function point(who) {
      who.score++;
      if (state === "play") sfx.score();
      if (state === "play" && (who.score >= WIN)) {
        state = "over";
        if (who === P) { hud.add(100); }
        setTimeout(function () { state = "attract"; P.score = 0; C.score = 0; }, 3200);
      }
      resetBall(who === P ? -1 : 1);
    }

    function px(n) { return Math.round(n); }
    function text(t, x, y, size, color, align) {
      cx.fillStyle = color || COL.text;
      cx.font = size + 'px "Press Start 2P", monospace';
      cx.textAlign = align || "center";
      cx.fillText(t, x, y);
    }

    function draw() {
      cx.fillStyle = COL.bg;
      cx.fillRect(0, 0, W, H);

      // midline
      cx.fillStyle = COL.dim;
      for (var y = 8; y < H; y += 22) cx.fillRect(W / 2 - 2, y, 4, 12);

      // labels + score
      text("LAN", W * 0.25, 30, 10, COL.cyan);
      text("WAN", W * 0.75, 30, 10, COL.red);
      text(String(P.score), W * 0.25, 62, 22, COL.text);
      text(String(C.score), W * 0.75, 62, 22, COL.text);

      // paddles + packet
      cx.fillStyle = COL.cyan;  cx.fillRect(px(P.x), px(P.y), P.w, P.h);
      cx.fillStyle = COL.red;   cx.fillRect(px(C.x), px(C.y), C.w, C.h);
      cx.fillStyle = COL.amber;
      cx.fillRect(px(ball.x), px(ball.y), ball.s, ball.s);
      cx.fillStyle = "rgba(255,176,0,0.25)";
      cx.fillRect(px(ball.x - ball.vx * 1.5), px(ball.y - ball.vy * 1.5), ball.s, ball.s);

      frameBlink++;
      if (state === "attract") {
        if (frameBlink % 70 < 45) text("PACKET PONG", W / 2, H / 2 - 24, 16, COL.amber);
        if (frameBlink % 70 < 45) text("CLICK OR PRESS ENTER TO PLAY", W / 2, H / 2 + 8, 8, COL.faint);
        text("ATTRACT MODE — CPU vs CPU", W / 2, H - 18, 7, COL.dim);
      }
      if (state === "over") {
        var won = P.score > C.score;
        text(won ? "LAN WINS!" : "WAN WINS…", W / 2, H / 2 - 10, 16, won ? COL.green : COL.red);
        text(won ? "+100 PTS — PACKETS DELIVERED" : "RETRY? PACKETS DROPPED", W / 2, H / 2 + 20, 8, COL.faint);
      }
    }

    function loop() {
      if (running && visible) {
        stepPaddles();
        stepBall();
        draw();
      }
      requestAnimationFrame(loop);
    }

    // pause when offscreen / hidden
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.05 }).observe(cv);
    }
    document.addEventListener("visibilitychange", function () { running = !document.hidden; });

    if (reducedMotion) {
      // static frame; game starts only on explicit user action
      running = false;
      draw();
      text("ANIMATION PAUSED — CLICK TO PLAY", W / 2, H - 40, 8, COL.faint);
      cv.addEventListener("click", function () { running = true; }, { once: true });
      cv.addEventListener("keydown", function (e) { if (e.key === "Enter") running = true; }, { once: true });
    }
    loop();
  }

  /* ============================================================
     NAV + LEVEL TRACKING + REVEAL
     ============================================================ */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      sfx.blip();
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a[href^="#"]'));
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var map = new Map();
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute("href"));
      if (sec) map.set(sec, a);
    });
    if (!("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var link = map.get(en.target);
        if (link) {
          links.forEach(function (l) { l.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
        var idx = sections.indexOf(en.target);
        if (idx > -1) hud.setLevel(idx + 1);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach(function (_, sec) { obs.observe(sec); });
    sections.forEach(function (s) { obs.observe(s); });
  }

  function initReveal() {
    var targets = document.querySelectorAll(
      ".section-head, .about-grid, .pixel-panel, .learn-item, .hiscore, .cabinet, .cart, .console-screen, .reveal"
    );
    targets.forEach(function (t) { t.classList.add("reveal"); });
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach(function (t) { obs.observe(t); });
  }

  /* ============================================================
     KONAMI CODE — ↑↑↓↓←→←→BA = god mode (+30 lives)
     ============================================================ */
  function initKonami() {
    var seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var i = 0;
    document.addEventListener("keydown", function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = (k === seq[i]) ? i + 1 : (k === seq[0] ? 1 : 0);
      if (i === seq.length) {
        i = 0;
        document.body.classList.add("god-mode");
        hud.add(30);
        sfx.fanfare();
        floatPoints(window.innerWidth / 2 - 60, window.innerHeight / 2, "+30 LIVES");
      }
    });
  }

  /* ============================================================
     MISC — footer countdown, year
     ============================================================ */
  function initMisc() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());

    var c = document.getElementById("continue-count");
    if (c && !reducedMotion) {
      var n = 9;
      setInterval(function () {
        n = n === 0 ? 9 : n - 1;
        c.textContent = String(n);
      }, 1000);
    }
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initSfxToggle();
    hud.init();
    initStarfield();
    initBoot();
    renderSkills();
    renderProjects();
    initPong();
    initNav();
    initActiveNav();
    initReveal();
    initKonami();
    initMisc();
  });
})();
