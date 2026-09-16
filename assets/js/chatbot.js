document.addEventListener('DOMContentLoaded', function(){
  var wrapper = document.getElementById('chatbot');
  var toggle = document.getElementById('chatbotToggle');
  var closeBtn = document.getElementById('chatbotClose');
  var body = document.getElementById('chatbotBody');
  if(!wrapper || !toggle || !closeBtn || !body) return;

  var WA_URL = "https://wa.me/34628116355?text=Hola%2C%20me%20gustar%C3%ADa%20hablar%20con%20un%20especialista%20de%20ANANTA.";

  var MENU = [
    {
      label: 'Servicios de mantenimiento',
      answer: 'Ofrecemos mantenimiento industrial (correctivo, preventivo y predictivo), montajes y paradas de planta, y automatización y control de procesos.',
      link: {href:'negocio.html', label:'Ver todos los servicios →'}
    },
    {
      label: 'Productos y marcas',
      answer: 'Somos distribuidor oficial de Bertoli, Nakakin y On Fitting.',
      link: {href:'productos.html', label:'Ver catálogo →'}
    },
    {
      label: 'Sedes y contacto',
      answer: 'Sede central en Casarrubios del Monte (Toledo), delegación en Talavera la Real (Badajoz) y oficina en Fresno, California.',
      link: {href:'contacto.html', label:'Ver mapas y datos de contacto →'}
    },
    {
      label: 'Solicitar información',
      answer: 'Puede escribirnos a comercial@ananta.es, llamar al +34 918 18 34 74 o rellenar nuestro formulario de contacto.',
      link: {href:'contacto.html#formulario', label:'Ir al formulario →'}
    },
    {
      label: 'Trabajar con nosotros',
      answer: 'Envíenos su candidatura a través del formulario de contacto, indicando "selección de personal" en el asunto.',
      link: {href:'contacto.html#formulario', label:'Ir al formulario →'}
    },
    {
      label: 'Hablar con un especialista',
      whatsapp: true
    }
  ];

  function el(tag, cls, html){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }

  function scrollToBottom(){
    body.scrollTop = body.scrollHeight;
  }

  function addBotMessage(html){
    body.appendChild(el('div', 'chat-msg chat-msg-bot', html));
    scrollToBottom();
  }

  function addUserMessage(text){
    body.appendChild(el('div', 'chat-msg chat-msg-user', text));
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

  function renderMenu(){
    var wrap = el('div', 'chat-options');
    MENU.forEach(function(item){
      var btn = el('button', 'chat-option', item.label);
      btn.type = 'button';
      btn.addEventListener('click', function(){ handleSelect(item); });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollToBottom();
  }

  function handleSelect(item){
    // ya no se pueden volver a pulsar las opciones anteriores
    body.querySelectorAll('.chat-options').forEach(function(o){ o.remove(); });
    addUserMessage(item.label);

    setTimeout(function(){
      if(item.whatsapp){
        addBotMessage('Le paso con un especialista por WhatsApp:');
        addLink(WA_URL, 'Abrir WhatsApp →', {blank:true});
      } else {
        addBotMessage(item.answer);
        if(item.link){ addLink(item.link.href, item.link.label); }
      }
      setTimeout(function(){
        addBotMessage('¿Puedo ayudarle con algo más?');
        renderMenu();
      }, 500);
    }, 350);
  }

  var started = false;
  function initConversation(){
    body.innerHTML = '';
    addBotMessage('Hola 👋 Soy el asistente virtual de ANANTA. ¿En qué puedo ayudarle?');
    renderMenu();
  }

  function openChat(){
    wrapper.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    if(!started){ started = true; initConversation(); }
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
