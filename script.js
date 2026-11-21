/* ==========================================================================
   Rohan & Priya — Wedding Invitation
   Cinematic Animations, Scroll Choreography & Interactive Engine
   ========================================================================== */

(function () {
  "use strict";

  const WEDDING_DATE_ISO = "2026-12-12T19:00:00+05:30";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     1. Celebration Gold & Maroon Foil Confetti Burst
     ------------------------------------------------------------------------ */
  const Confetti = (() => {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return { burst() {} };
    const ctx = canvas.getContext("2d");
    let particles = [];
    let rafId = null;

    const palette = ["#c9a227", "#e8c978", "#6e1f2f", "#f6e5b3", "#b38728", "#fff5db"];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16;
        p.vx *= 0.99;
        p.rot += p.vrot;
        p.life -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (particles.length > 0) {
        rafId = window.requestAnimationFrame(frame);
      } else {
        rafId = null;
      }
    }

    function burst(originX, originY, count = 65) {
      if (prefersReducedMotion) return;
      const x = originX ?? window.innerWidth / 2;
      const y = originY ?? window.innerHeight * 0.45;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
        const speed = 3 + Math.random() * 6.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.2,
          w: 5 + Math.random() * 6,
          h: 3 + Math.random() * 4,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.22,
          color: palette[i % palette.length],
          life: 0.9 + Math.random() * 0.4,
        });
      }
      if (!rafId) rafId = window.requestAnimationFrame(frame);
    }

    return { burst };
  })();

  /* ------------------------------------------------------------------------
     2. Romantic Wedding Music Player (Dhaga Dhaga)
     ------------------------------------------------------------------------ */
  const MusicPlayer = (() => {
    let audio = null;
    let isPlaying = false;
    let fadeTimer = null;

    function getAudio() {
      if (!audio) {
        audio = document.getElementById("bgMusic");
        if (!audio) {
          audio = new Audio("assets/music.mp3");
          audio.loop = true;
        }
        audio.loop = true;
      }
      return audio;
    }

    function updateButton() {
      const btn = document.getElementById("musicToggle");
      if (!btn) return;
      btn.classList.toggle("is-playing", isPlaying);
      btn.setAttribute("aria-pressed", String(isPlaying));
    }

    function fadeIn(targetVolume = 0.65, duration = 1200) {
      const a = getAudio();
      clearInterval(fadeTimer);
      a.volume = 0.05;
      const step = 0.05;
      const interval = duration / (targetVolume / step);
      fadeTimer = setInterval(() => {
        if (a.volume + step >= targetVolume) {
          a.volume = targetVolume;
          clearInterval(fadeTimer);
        } else {
          a.volume = Math.min(targetVolume, a.volume + step);
        }
      }, interval);
    }

    function play() {
      const a = getAudio();
      const playPromise = a.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
            fadeIn(0.65, 1200);
            updateButton();
          })
          .catch((err) => {
            console.warn("Audio autoplay waiting for user interaction:", err);
          });
      }
    }

    function pause() {
      const a = getAudio();
      clearInterval(fadeTimer);
      const step = 0.08;
      fadeTimer = setInterval(() => {
        if (a.volume - step <= 0.05) {
          a.pause();
          a.volume = 0.65;
          clearInterval(fadeTimer);
          isPlaying = false;
          updateButton();
        } else {
          a.volume = Math.max(0, a.volume - step);
        }
      }, 50);
    }

    function toggle() {
      if (isPlaying) pause();
      else play();
    }

    return { play, pause, toggle };
  })();

  /* ------------------------------------------------------------------------
     3. Decorative Particles
     ------------------------------------------------------------------------ */
  function spawnMotes(containerId, count, className, factory) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const node = document.createElement("span");
      node.className = className;
      factory(node, i);
      frag.appendChild(node);
    }
    el.appendChild(frag);
  }

  function initParticles() {
    spawnMotes("preloaderMotes", 26, "mote", (n) => {
      const size = 4 + Math.random() * 8;
      n.style.width = `${size}px`;
      n.style.height = `${size}px`;
      n.style.left = `${Math.random() * 100}%`;
      n.style.animationDuration = `${6 + Math.random() * 8}s`;
      n.style.animationDelay = `${-Math.random() * 10}s`;
      n.style.setProperty("--drift", `${(Math.random() - 0.5) * 60}px`);
    });

    spawnMotes("heroFireflies", 24, "firefly", (n) => {
      const size = 3 + Math.random() * 5;
      n.style.width = `${size}px`;
      n.style.height = `${size}px`;
      n.style.left = `${8 + Math.random() * 84}%`;
      n.style.top = `${15 + Math.random() * 75}%`;
      n.style.setProperty("--dur", `${5 + Math.random() * 5}s`);
      n.style.setProperty("--delay", `${Math.random() * 4}s`);
      n.style.setProperty("--dx", `${(Math.random() - 0.5) * 44}px`);
      n.style.setProperty("--dy", `${-20 - Math.random() * 42}px`);
    });

    spawnMotes("scratchSparks", 32, "spark", (n) => {
      const size = 3 + Math.random() * 5;
      n.style.width = `${size}px`;
      n.style.height = `${size}px`;
      n.style.left = `${Math.random() * 100}%`;
      n.style.top = `${Math.random() * 100}%`;
      n.style.setProperty("--dur", `${5 + Math.random() * 6}s`);
      n.style.setProperty("--delay", `${Math.random() * 5}s`);
    });
  }

  /* ------------------------------------------------------------------------
     4. Preloader & Hero Gate Opening Sequence
     ------------------------------------------------------------------------ */
  function initPreloaderAndHero() {
    const preloader = document.getElementById("preloader");
    const hero = document.getElementById("hero");
    const cover = document.getElementById("heroCover");
    const skipBtn = document.getElementById("heroSkip");

    let preloaderDone = false;
    function hidePreloader() {
      if (preloaderDone || !preloader) return;
      preloaderDone = true;
      preloader.classList.add("is-hidden");
    }

    window.addEventListener("load", () => {
      window.setTimeout(hidePreloader, 950);
    });
    window.setTimeout(hidePreloader, 4500);

    let revealed = false;
    let skipTimer = null;
    let revealTimer = null;

    function unlockAndReveal() {
      if (revealed) return;
      revealed = true;
      clearTimeout(skipTimer);
      clearTimeout(revealTimer);
      hero.classList.remove("is-opening");
      hero.classList.add("is-revealed");
      skipBtn.classList.remove("is-visible");
      document.documentElement.classList.remove("is-locked");
      document.body.classList.remove("is-locked");
    }

    function beginOpening() {
      if (hero.classList.contains("is-opening") || revealed) return;
      hero.classList.add("is-opening");
      MusicPlayer.play();

      skipTimer = window.setTimeout(() => {
        if (!revealed) skipBtn.classList.add("is-visible");
      }, 1000);

      revealTimer = window.setTimeout(unlockAndReveal, 3200);
    }

    cover.addEventListener("click", beginOpening);
    skipBtn.addEventListener("click", unlockAndReveal);

    const musicToggle = document.getElementById("musicToggle");
    if (musicToggle) {
      musicToggle.addEventListener("click", MusicPlayer.toggle);
    }
  }

  /* ------------------------------------------------------------------------
     5. Unified Scroll Engine: Progress Bar, Hero Parallax, Chapter Rail & Flight
     ------------------------------------------------------------------------ */
  function initScrollChoreography() {
    const progressBar = document.getElementById("scrollProgressBar");
    const hero = document.getElementById("hero");
    const courtyardImg = document.getElementById("heroCourtyardImg");
    const heroNames = document.getElementById("heroNames");
    const journeyTrack = document.getElementById("journeyTrack");
    const journeyPlane = document.getElementById("journeyPlane");
    const journeyProgress = document.getElementById("journeyProgress");
    const arrivalBeacon = document.getElementById("journeyArrivalBeacon");
    const railDots = Array.from(document.querySelectorAll(".chapter-rail__dot"));
    const sectionEls = railDots
      .map((dot) => document.getElementById(dot.dataset.section))
      .filter(Boolean);

    const lineHeight = 240;
    const planeHeight = 40;
    const maxTravel = lineHeight - planeHeight;

    let ticking = false;

    function onFrame() {
      ticking = false;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // 1. Reading progress bar
      if (progressBar && docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = `${pct.toFixed(2)}%`;
      }

      // 2. Hero subtle scroll parallax
      if (!prefersReducedMotion && hero && hero.classList.contains("is-revealed")) {
        const heroH = hero.offsetHeight;
        if (scrollY < heroH * 1.15) {
          const offset = scrollY * 0.28;
          if (courtyardImg) {
            courtyardImg.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.03)`;
          }
          if (heroNames) {
            const fade = Math.max(0, 1 - scrollY / (heroH * 0.65));
            heroNames.style.transform = `translate3d(0, ${(scrollY * 0.16).toFixed(1)}px, 0)`;
            heroNames.style.opacity = fade.toFixed(3);
          }
        }
      }

      // 3. Jaipur -> Udaipur flight progress
      if (journeyTrack && journeyPlane) {
        const rect = journeyTrack.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (vh * 0.72 - rect.top) / (rect.height + vh * 0.3)));
        const y = progress * maxTravel;
        const scale = 1 + Math.sin(progress * Math.PI) * 0.18;
        journeyPlane.style.transform = `translate(-50%, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        if (journeyProgress) {
          journeyProgress.style.height = `${(progress * 100).toFixed(1)}%`;
        }
        if (arrivalBeacon) {
          arrivalBeacon.classList.toggle("is-lit", progress > 0.92);
        }
      }

      // 4. Active chapter dot
      if (sectionEls.length) {
        const pivot = scrollY + window.innerHeight * 0.35;
        let currentId = sectionEls[0].id;
        for (const sec of sectionEls) {
          if (sec.offsetTop <= pivot) currentId = sec.id;
        }
        railDots.forEach((dot) => {
          dot.classList.toggle("is-active", dot.dataset.section === currentId);
        });
      }
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onFrame);
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    onFrame();
  }

  /* ------------------------------------------------------------------------
     6. Scroll Reveals & Offscreen Animation Pausing
     ------------------------------------------------------------------------ */
  function initScrollObservers() {
    const revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
      );
      revealEls.forEach((el) => revealObserver.observe(el));

      const sections = document.querySelectorAll(".section");
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("is-offscreen", !entry.isIntersecting);
          });
        },
        { rootMargin: "140px 0px 140px 0px" }
      );
      sections.forEach((sec) => sectionObserver.observe(sec));
    } else {
      revealEls.forEach((el) => el.classList.add("is-in"));
    }
  }

  /* ------------------------------------------------------------------------
     7. Interactive Gold-Foil Heart Scratch Card + .ics Add-to-Calendar
     ------------------------------------------------------------------------ */
  function initScratchCard() {
    const container = document.getElementById("scratchHeart");
    const canvas = document.getElementById("scratchCanvas");
    const prompt = document.getElementById("scratchPrompt");
    const actions = document.getElementById("scratchActions");
    const calBtn = document.getElementById("addToCalendarBtn");
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const w = canvas.width;
    const h = canvas.height;
    let isDrawing = false;
    let isRevealed = false;
    let strokeCount = 0;

    function paintGoldFoil() {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#d7b449");
      grad.addColorStop(0.28, "#f3da8a");
      grad.addColorStop(0.52, "#c69926");
      grad.addColorStop(0.78, "#ebd077");
      grad.addColorStop(1, "#a97d1d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      for (let i = 0; i < 650; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 0.6 + Math.random() * 1.6;
        ctx.fillStyle =
          Math.random() > 0.5 ? "rgba(255, 250, 230, 0.25)" : "rgba(120, 82, 12, 0.16)";
        ctx.fillRect(x, y, r * 3, r);
      }
      ctx.fillStyle = "rgba(110, 31, 47, 0.45)";
      ctx.font = '600 15px "Cinzel", Georgia, serif';
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", w / 2, h * 0.48);
      ctx.restore();
    }

    paintGoldFoil();

    function getPoint(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * w,
        y: ((clientY - rect.top) / rect.height) * h,
      };
    }

    function scratchAt(pt) {
      if (isRevealed) return;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      strokeCount++;
      if (strokeCount % 6 === 0) checkProgress();
    }

    function checkProgress() {
      if (isRevealed) return;
      const img = ctx.getImageData(0, 0, w, h).data;
      let cleared = 0;
      let total = 0;
      for (let i = 3; i < img.length; i += 64) {
        total++;
        if (img[i] < 128) cleared++;
      }
      const ratio = cleared / total;
      if (ratio >= 0.16) {
        container.classList.add("is-shimmering");
      }
      if (ratio >= 0.25) {
        isRevealed = true;
        container.classList.add("is-revealed");
        if (prompt) prompt.innerHTML = "<span>SAVE THE DATE! &#x2728;</span>";
        if (actions) actions.classList.add("is-visible");
        const rect = container.getBoundingClientRect();
        Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 75);
      }
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (isRevealed) return;
      isDrawing = true;
      scratchAt(getPoint(e));
    });
    window.addEventListener(
      "pointermove",
      (e) => {
        if (!isDrawing || isRevealed) return;
        if (e.cancelable) e.preventDefault();
        scratchAt(getPoint(e));
      },
      { passive: false }
    );
    window.addEventListener("pointerup", () => {
      if (!isDrawing) return;
      isDrawing = false;
      checkProgress();
    });

    if (calBtn) {
      calBtn.addEventListener("click", () => {
        const ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Rohan & Priya Wedding//EN",
          "BEGIN:VEVENT",
          "DTSTART:20261212T133000Z",
          "DTEND:20261212T183000Z",
          "SUMMARY:Rohan & Priya Wedding Ceremony",
          "LOCATION:The Leela Palace Udaipur, Lake Pichola, Udaipur, Rajasthan, India",
          "DESCRIPTION:Together with our beloved families, we request the honour of your gracious presence to celebrate the wedding of Rohan & Priya.",
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\r\n");

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Rohan-and-Priya-Wedding.ics";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }
  }

  /* ------------------------------------------------------------------------
     8. Live Countdown Timer with Tick Micro-Animation
     ------------------------------------------------------------------------ */
  function initCountdown() {
    const els = {
      days: document.getElementById("cdDays"),
      hours: document.getElementById("cdHours"),
      mins: document.getElementById("cdMinutes"),
      secs: document.getElementById("cdSeconds"),
    };
    if (!els.days) return;

    const target = new Date(WEDDING_DATE_ISO).getTime();

    function setVal(el, val) {
      const str = String(Math.max(0, val)).padStart(2, "0");
      if (el.textContent !== str) {
        el.textContent = str;
        el.classList.remove("is-ticking");
        void el.offsetWidth;
        el.classList.add("is-ticking");
      }
    }

    function tick() {
      const diff = Math.max(0, target - Date.now());
      setVal(els.days, Math.floor(diff / (1000 * 60 * 60 * 24)));
      setVal(els.hours, Math.floor((diff / (1000 * 60 * 60)) % 24));
      setVal(els.mins, Math.floor((diff / (1000 * 60)) % 60));
      setVal(els.secs, Math.floor((diff / 1000) % 60));
    }

    tick();
    window.setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------------
     9. Our Story 3D Overlapping Carousel
     ------------------------------------------------------------------------ */
  function initStoryCarousel() {
    const carousel = document.getElementById("storyCarousel");
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll(".story-slide"));
    const dots = Array.from(document.querySelectorAll(".story-dot"));
    const prevBtn = document.getElementById("storyPrev");
    const nextBtn = document.getElementById("storyNext");
    let active = 0;
    let autoTimer = null;
    let startX = null;

    function render() {
      const total = slides.length;
      slides.forEach((slide, idx) => {
        slide.classList.remove("is-active", "is-prev", "is-next");
        if (idx === active) slide.classList.add("is-active");
        else if (idx === (active + 1) % total) slide.classList.add("is-next");
        else slide.classList.add("is-prev");
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === active);
      });
    }

    function next() {
      active = (active + 1) % slides.length;
      render();
    }

    function prev() {
      active = (active - 1 + slides.length) % slides.length;
      render();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = window.setInterval(next, 3500);
    }

    slides.forEach((slide, idx) => {
      slide.addEventListener("click", () => {
        active = idx !== active ? idx : (active + 1) % slides.length;
        render();
        resetAuto();
      });
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        active = idx;
        render();
        resetAuto();
      });
    });

    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { next(); resetAuto(); });

    carousel.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    carousel.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) >= 50) {
        if (dx < 0) next();
        else prev();
        resetAuto();
      }
    });

    render();
    resetAuto();
  }

  /* ------------------------------------------------------------------------
     10. RSVP Boarding Pass Form + Confetti Confirmation
     ------------------------------------------------------------------------ */
  function initRsvpForm() {
    const form = document.getElementById("rsvpForm");
    if (!form) return;

    const pills = Array.from(form.querySelectorAll(".attend-pill"));
    const guestsField = document.getElementById("guestsField");
    const minusBtn = document.getElementById("guestMinus");
    const plusBtn = document.getElementById("guestPlus");
    const countEl = document.getElementById("guestCount");
    const countInput = document.getElementById("guestInput");
    const errorEl = document.getElementById("rsvpError");
    const confirmedBox = document.getElementById("rsvpConfirmed");
    const confirmedTitle = document.getElementById("rsvpConfirmedTitle");
    const confirmedSummary = document.getElementById("rsvpConfirmedSummary");
    const resetBtn = document.getElementById("rsvpReset");

    let guests = 1;

    function syncPills() {
      let attending = "yes";
      pills.forEach((pill) => {
        const input = pill.querySelector("input");
        const checked = input.checked;
        pill.classList.toggle("is-selected", checked);
        if (checked) attending = input.value;
      });
      guestsField.style.display = attending === "yes" ? "" : "none";
    }

    pills.forEach((pill) => pill.addEventListener("change", syncPills));

    minusBtn.addEventListener("click", () => {
      guests = Math.max(1, guests - 1);
      countEl.textContent = String(guests);
      countInput.value = String(guests);
    });

    plusBtn.addEventListener("click", () => {
      guests = Math.min(10, guests + 1);
      countEl.textContent = String(guests);
      countInput.value = String(guests);
    });

    function showConfirmed(data) {
      form.hidden = true;
      confirmedBox.hidden = false;
      confirmedTitle.textContent = `Thank You, ${data.name}!`;
      if (data.attending === "yes") {
        const guestWord = data.guests === 1 ? "guest" : "guests";
        confirmedSummary.textContent = `Your boarding pass for ${data.guests} ${guestWord} on The Wedding Express (Jaipur → Udaipur) is confirmed. We can't wait to celebrate with you!`;
        Confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 70);
      } else {
        confirmedSummary.textContent =
          "We will miss celebrating with you in person, and we truly cherish your warm wishes and blessings.";
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errorEl.hidden = true;

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const attending = form.attending.value;
      const message = form.message.value.trim();

      if (!name) {
        errorEl.textContent = "Please enter your name on the boarding pass.";
        errorEl.hidden = false;
        form.name.focus();
        return;
      }
      if (!phone || phone.replace(/\D/g, "").length < 7) {
        errorEl.textContent = "Please enter a valid phone number.";
        errorEl.hidden = false;
        form.phone.focus();
        return;
      }

      const payload = {
        name,
        phone,
        attending,
        guests: attending === "yes" ? guests : 0,
        message,
        submittedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem("rohan_priya_rsvp", JSON.stringify(payload));
      } catch (_) {
        // ignore storage errors
      }

      showConfirmed(payload);
    });

    resetBtn.addEventListener("click", () => {
      confirmedBox.hidden = true;
      form.hidden = false;
    });

    syncPills();
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  initParticles();
  initPreloaderAndHero();
  initScrollChoreography();
  initScrollObservers();
  initScratchCard();
  initCountdown();
  initStoryCarousel();
  initRsvpForm();
})();
