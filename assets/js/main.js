document.addEventListener('DOMContentLoaded', function(){
  var y = document.querySelector('[data-year]');
  if(y) y.textContent = new Date().getFullYear();

  var header = document.getElementById('siteHeader');
  if(header && !header.classList.contains('solid')){
    window.addEventListener('scroll', function(){
      if(window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // ---- menú móvil ----
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      var open = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- desplegables de navegación: margen de gracia para que no se cierren al bajar el ratón ----
  var navItems = document.querySelectorAll('.nav-item');
  var navCloseTimers = new Map();
  navItems.forEach(function(item){
    item.addEventListener('mouseenter', function(){
      var ownTimer = navCloseTimers.get(item);
      if(ownTimer){ clearTimeout(ownTimer); navCloseTimers.delete(item); }
      // al entrar en uno nuevo, cerrar cualquier otro al instante (evita que se muestren varios a la vez con un ratón rápido)
      navItems.forEach(function(other){
        if(other === item) return;
        var otherTimer = navCloseTimers.get(other);
        if(otherTimer){ clearTimeout(otherTimer); navCloseTimers.delete(other); }
        other.classList.remove('is-open');
      });
      item.classList.add('is-open');
    });
    item.addEventListener('mouseleave', function(){
      var timer = setTimeout(function(){ item.classList.remove('is-open'); }, 300);
      navCloseTimers.set(item, timer);
    });
  });

  // ---- botón WhatsApp: ocultar mientras haya una zona sensible a la vista (móvil) ----
  var waFloat = document.querySelector('.whatsapp-float');
  var coordSections = Array.prototype.map.call(
    document.querySelectorAll('.coords-bar'),
    function(el){ return el.closest('.reel') || el.parentElement; }
  ).concat(Array.prototype.slice.call(document.querySelectorAll('.wa-avoid')));
  if(waFloat && coordSections.length){
    var waIntersecting = new Set();
    var waObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting) waIntersecting.add(e.target);
        else waIntersecting.delete(e.target);
      });
      waFloat.classList.toggle('wa-visible', waIntersecting.size === 0);
    }, {threshold: 0});
    coordSections.forEach(function(el){ waObs.observe(el); });
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('is-visible'); }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // ---- chapter split-reveal ----
  var chapterObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('is-revealed'); }
    });
  }, {threshold:0.3});
  document.querySelectorAll('.chapter').forEach(function(el){ chapterObs.observe(el); });

  // ---- stat count-up ----
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var pad = parseInt(el.getAttribute('data-pad') || '1', 10);
    var start = null, duration = 1400;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      var text = String(val);
      while(text.length < pad) text = '0' + text;
      el.textContent = text + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !e.target.dataset.counted){
        e.target.dataset.counted = "1";
        animateCount(e.target);
      }
    });
  }, {threshold:0.6});
  document.querySelectorAll('.num[data-count]').forEach(function(el){ countObs.observe(el); });

  // ---- formulario de contacto (demo visual, sin backend) ----
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(ev){
      ev.preventDefault();
      if(!contactForm.checkValidity()){ contactForm.reportValidity(); return; }
      var success = document.getElementById('formSuccess');
      contactForm.reset();
      if(success) success.classList.add('is-shown');
    });
  }

  // ---- hero spotlight follow ----
  var heroSection = document.querySelector('.hero');
  var spotlight = document.querySelector('.hero-spotlight');
  if(heroSection && spotlight){
    heroSection.addEventListener('mousemove', function(ev){
      var r = heroSection.getBoundingClientRect();
      var mx = ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%';
      var my = ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%';
      spotlight.style.setProperty('--mx', mx);
      spotlight.style.setProperty('--my', my);
    });
  }

  // ---- red de puntos tipo "precisión" (hero, blog...) ----
  document.querySelectorAll('.network-canvas').forEach(function(networkCanvas){
    var ctx = networkCanvas.getContext('2d');
    var W, H, nodes = [];
    var dpr = window.devicePixelRatio || 1;
    var NODE_COUNT = window.innerWidth < 720 ? 24 : 46;
    function resizeCanvas(){
      W = networkCanvas.width = networkCanvas.offsetWidth * dpr;
      H = networkCanvas.height = networkCanvas.offsetHeight * dpr;
    }
    function initNodes(){
      nodes = [];
      for(var i=0;i<NODE_COUNT;i++){
        nodes.push({
          x: Math.random()*W, y: Math.random()*H,
          vx: (Math.random()-0.5)*0.15, vy: (Math.random()-0.5)*0.15
        });
      }
    }
    function tickCanvas(){
      ctx.clearRect(0,0,W,H);
      ctx.lineWidth = dpr;
      for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > W) n.vx *= -1;
        if(n.y < 0 || n.y > H) n.vy *= -1;
        for(var j=i+1;j<nodes.length;j++){
          var m = nodes[j];
          var dx = n.x-m.x, dy = n.y-m.y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          var maxDist = 170 * dpr;
          if(dist < maxDist){
            ctx.strokeStyle = 'rgba(111,163,201,' + (0.35 * (1 - dist/maxDist)) + ')';
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }
      for(var k=0;k<nodes.length;k++){
        ctx.fillStyle = 'rgba(205,216,226,0.55)';
        ctx.beginPath();
        ctx.arc(nodes[k].x, nodes[k].y, 1.6*dpr, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(tickCanvas);
    }
    resizeCanvas(); initNodes(); tickCanvas();
    window.addEventListener('resize', function(){ resizeCanvas(); initNodes(); });
  });
});
