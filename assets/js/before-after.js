/* Comparador antes/después: arrastrar (ratón o dedo) o usar las flechas del teclado. */
(function(){
  document.querySelectorAll('.ba-compare').forEach(function(box){
    var range = box.querySelector('.ba-range');
    function set(v){
      v = Math.max(0, Math.min(100, v));
      box.style.setProperty('--pos', v + '%');
      range.value = v;
    }
    range.addEventListener('input', function(){ set(+range.value); });

    var dragging = false;
    function fromEvent(e){
      var r = box.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      set(x / r.width * 100);
    }
    box.addEventListener('pointerdown', function(e){ dragging = true; box.setPointerCapture(e.pointerId); fromEvent(e); });
    box.addEventListener('pointermove', function(e){ if (dragging) fromEvent(e); });
    box.addEventListener('pointerup', function(){ dragging = false; });
    box.addEventListener('pointercancel', function(){ dragging = false; });

    // Pequeña animación de pista la primera vez que el comparador entra en pantalla
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function(entries){
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var t0 = null, from = 50;
        function step(t){
          if (dragging) return;
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1600);
          set(from + Math.sin(p * Math.PI * 2) * 18 * (1 - p));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, { threshold: 0.6 });
      io.observe(box);
    }
    set(50);
  });

  document.querySelectorAll('[data-ba-video]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var wrap = document.getElementById(btn.getAttribute('data-ba-video'));
      wrap.hidden = false;
      var v = wrap.querySelector('video');
      v.play();
      btn.hidden = true;
    });
  });
})();

/* Ventana del caso real (mantenimiento integral) */
(function(){
  document.querySelectorAll('[data-dialog]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var d = document.getElementById(btn.getAttribute('data-dialog'));
      if (d && d.showModal) { d.showModal(); document.body.classList.add('dialog-open'); }
    });
  });
  document.querySelectorAll('dialog.case-dialog').forEach(function(d){
    d.addEventListener('click', function(e){
      if (e.target === d || e.target.closest('[data-close]')) d.close();
    });
    d.addEventListener('close', function(){
      document.body.classList.remove('dialog-open');
      d.querySelectorAll('video').forEach(function(v){ v.pause(); });
    });
  });
})();
