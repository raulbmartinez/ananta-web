document.addEventListener('DOMContentLoaded', function(){
  var wrapper = document.getElementById('chatbot');
  var toggle = document.getElementById('chatbotToggle');
  var closeBtn = document.getElementById('chatbotClose');
  var body = document.getElementById('chatbotBody');
  var form = document.getElementById('chatbotForm');
  var input = document.getElementById('chatbotInput');
  if(!wrapper || !toggle || !closeBtn || !body) return;

  var WA_URL = "https://wa.me/34628116355?text=Hola%2C%20me%20gustar%C3%ADa%20hablar%20con%20un%20especialista%20de%20ANANTA.";

  var ICONS = {
    servicios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z"/></svg>',
    productos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    sedes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    empleo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.31c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.69 8.14-8.23 8.14Zm4.51-6.16c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14 0-.31-.02-.47-.02-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>'
  };

  // cada tema lleva sus palabras clave (sin acentos) para poder responder también en texto libre
  var MENU = [
    {
      label: 'Servicios de mantenimiento', icon: ICONS.servicios,
      keywords: ['servicio','servicios','mantenimiento','mantener','reparar','reparacion','reparaciones','averia','averias','fallo','fallos','montaje','montajes','parada','paradas','correctivo','preventivo','predictivo','automatizacion','automatizar','control de procesos','valvula','valvulas','soldadura'],
      answer: 'Ofrecemos mantenimiento industrial (correctivo, preventivo y predictivo), montajes y paradas de planta, y automatización y control de procesos.',
      link: {href:'negocio.html', label:'Ver todos los servicios →'}
    },
    {
      label: 'Productos y marcas', icon: ICONS.productos,
      keywords: ['producto','productos','marca','marcas','bertoli','nakakin','nanakin','on fitting','onfitting','homogeneizador','homogeneizadores','bomba','bombas','racor','racores','catalogo','distribuidor','distribuidor oficial'],
      answer: 'Somos distribuidor oficial de Bertoli, Nakakin y On Fitting.',
      link: {href:'productos.html', label:'Ver catálogo →'}
    },
    {
      label: 'Sedes y contacto', icon: ICONS.sedes,
      keywords: ['sede','sedes','oficina','oficinas','direccion','ubicacion','localizacion','donde estan','donde estais','donde estamos','casarrubios','talavera','fresno','toledo','badajoz','california','estados unidos','mapa','planta'],
      answer: 'Sede central en Casarrubios del Monte (Toledo), delegación en Talavera la Real (Badajoz) y oficina en Fresno, California.',
      link: {href:'contacto.html', label:'Ver mapas y datos de contacto →'}
    },
    {
      label: 'Solicitar información', icon: ICONS.info,
      keywords: ['informacion','presupuesto','precio','precios','cotizacion','coste','costes','consulta','contacto','contactar','email','correo','telefono','llamar','formulario','proyecto'],
      answer: 'Puede escribirnos a comercial@ananta.es, llamar al +34 918 18 34 74 o rellenar nuestro formulario de contacto.',
      link: {href:'contacto.html#formulario', label:'Ir al formulario →'}
    },
    {
      label: 'Trabajar con nosotros', icon: ICONS.empleo,
      keywords: ['trabajo','trabajar','empleo','empleos','candidatura','curriculum','cv','vacante','vacantes','seleccion de personal','oferta de empleo','contratar','contratacion'],
      answer: 'Envíenos su candidatura a través del formulario de contacto, indicando "selección de personal" en el asunto.',
      link: {href:'contacto.html#formulario', label:'Ir al formulario →'}
    },
    {
      label: 'Hablar con un especialista', icon: ICONS.whatsapp, accent: true,
      keywords: ['whatsapp','especialista','hablar con alguien','hablar con una persona','persona','humano','agente','llamada','urgente','urgencia'],
      whatsapp: true
    }
  ];

  var GREETINGS = ['hola','buenas','buenos dias','buenas tardes','buenas noches','hey','saludos','ola'];
  var THANKS = ['gracias','genial','perfecto','vale','ok','entendido','muchas gracias'];

  function normalize(s){
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }

  function el(tag, cls, html){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }

  function scrollToBottom(){
    body.scrollTop = body.scrollHeight;
  }

  function addBotMessage(html, cb){
    var typing = el('div', 'chat-msg chat-msg-bot chat-typing', '<span></span><span></span><span></span>');
    body.appendChild(typing);
    scrollToBottom();
    setTimeout(function(){
      typing.remove();
      body.appendChild(el('div', 'chat-msg chat-msg-bot', html));
      scrollToBottom();
      if(cb) cb();
    }, 550);
  }

  function addUserMessage(text){
    var msg = el('div', 'chat-msg chat-msg-user');
    msg.textContent = text;
    body.appendChild(msg);
    scrollToBottom();
  }

  function addLink(href, label, opts){
    var wrap = el('div', 'chat-options');
    var a = document.createElement('a');
    a.href = href;
    a.className = 'chat-link-btn';
    a.textContent = label;
    if(opts && opts.blank){ a.target = '_blank'; a.rel = 'noopener'; }
    wrap.appendChild(a);
    body.appendChild(wrap);
    scrollToBottom();
  }

  function clearOptions(){
    body.querySelectorAll('.chat-options').forEach(function(o){ o.remove(); });
  }

  function renderMenu(){
    var wrap = el('div', 'chat-options');
    MENU.forEach(function(item){
      var btn = el('button', 'chat-option' + (item.accent ? ' chat-option-accent' : ''));
      btn.type = 'button';
      btn.innerHTML = '<span class="chat-option-icon">' + item.icon + '</span><span>' + item.label + '</span>';
      btn.addEventListener('click', function(){
        clearOptions();
        handleSelect(item);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollToBottom();
  }

  function followUp(){
    setTimeout(function(){
      addBotMessage('¿Puedo ayudarle con algo más?', renderMenu);
    }, 600);
  }

  function answerItem(item){
    if(item.whatsapp){
      addBotMessage('Le paso con un especialista por WhatsApp:', function(){
        addLink(WA_URL, 'Abrir WhatsApp →', {blank:true});
        followUp();
      });
    } else {
      addBotMessage(item.answer, function(){
        if(item.link){ addLink(item.link.href, item.link.label); }
        followUp();
      });
    }
  }

  function handleSelect(item){
    addUserMessage(item.label);
    setTimeout(function(){ answerItem(item); }, 300);
  }

  // ---- búsqueda por palabras clave para el texto libre ----
  function findBestMatch(rawText){
    var text = normalize(rawText);
    if(!text) return null;

    var best = null, bestScore = 0;
    MENU.forEach(function(item){
      var score = 0;
      item.keywords.forEach(function(kw){
        if(text.indexOf(kw) !== -1) score += kw.split(' ').length; // las frases de varias palabras pesan más
      });
      if(score > bestScore){ bestScore = score; best = item; }
    });
    return best;
  }

  function isGreeting(text){ return GREETINGS.some(function(g){ return text === g || text.indexOf(g) !== -1; }); }
  function isThanks(text){ return THANKS.some(function(g){ return text === g || text.indexOf(g) !== -1; }); }

  function handleFreeText(rawText){
    var text = rawText.trim();
    if(!text) return;
    clearOptions();
    addUserMessage(text);

    var normalized = normalize(text);
    setTimeout(function(){
      if(isThanks(normalized) && normalized.length < 30){
        addBotMessage('¡De nada! Estoy aquí si necesita algo más.', renderMenu);
        return;
      }
      if(isGreeting(normalized) && normalized.length < 20){
        addBotMessage('¡Hola! ¿En qué puedo ayudarle?', renderMenu);
        return;
      }
      var match = findBestMatch(text);
      if(match){
        answerItem(match);
      } else {
        addBotMessage('No estoy seguro de haber entendido su consulta. Puede elegir una opción o escribir con otras palabras; si lo prefiere, hable directamente con un especialista:', renderMenu);
      }
    }, 300);
  }

  var started = false;
  function initConversation(){
    body.innerHTML = '';
    addBotMessage('Hola 👋 Soy el asistente virtual de ANANTA. Puede escribir su consulta o elegir una opción:', renderMenu);
  }

  function openChat(){
    wrapper.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    if(!started){ started = true; initConversation(); }
    if(input){ setTimeout(function(){ input.focus(); }, 300); }
  }
  function closeChat(){
    wrapper.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function(){
    if(wrapper.classList.contains('is-open')) closeChat();
    else openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  if(form && input){
    function submitInput(){
      var text = input.value;
      input.value = '';
      handleFreeText(text);
    }
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      submitInput();
    });
    // algunos navegadores (p.ej. en pruebas automatizadas o teclados virtuales) no disparan
    // siempre el envío implícito del formulario al pulsar Enter, así que lo forzamos aquí
    // y cancelamos el comportamiento nativo para no enviar el mensaje dos veces
    input.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter'){
        ev.preventDefault();
        submitInput();
      }
    });
  }

  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape' && wrapper.classList.contains('is-open')) closeChat();
  });
  document.addEventListener('click', function(ev){
    if(!wrapper.classList.contains('is-open')) return;
    // usamos composedPath (la ruta capturada en el momento del clic) porque los botones de
    // opciones se eliminan del DOM al seleccionarlos, y ev.target ya no estaría "dentro" de wrapper
    var path = ev.composedPath ? ev.composedPath() : [];
    if(path.indexOf(wrapper) === -1) closeChat();
  });
});
