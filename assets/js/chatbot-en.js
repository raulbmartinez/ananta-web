document.addEventListener('DOMContentLoaded', function(){
  var wrapper = document.getElementById('chatbot');
  var toggle = document.getElementById('chatbotToggle');
  var closeBtn = document.getElementById('chatbotClose');
  var body = document.getElementById('chatbotBody');
  var form = document.getElementById('chatbotForm');
  var input = document.getElementById('chatbotInput');
  if(!wrapper || !toggle || !closeBtn || !body) return;

  var WA_URL = "https://wa.me/34628116355?text=Hello%2C%20I%27d%20like%20to%20speak%20with%20a%20specialist%20at%20ANANTA.";

  var ICONS = {
    servicios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z"/></svg>',
    productos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    sedes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    empleo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.31c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.69 8.14-8.23 8.14Zm4.51-6.16c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14 0-.31-.02-.47-.02-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>'
  };

  // each topic carries its own keywords so free text can be matched too
  var MENU = [
    {
      id: 'servicios',
      label: 'Maintenance services', icon: ICONS.servicios,
      keywords: [
        'service','services','maintenance','maintain','repair','repairs','fix','fixing','check','inspection','inspect',
        'breakdown','breakdowns','fault','faults','failing','assembly','shutdown','shutdowns','corrective','preventive','predictive',
        'automation','automate','process control','valve','valves','welding','vibration','thermography','ultrasound',
        // common equipment/machinery a customer might mention
        'centrifuge','pump','pumps','motor','motors','compressor','compressors','turbine','turbines','gearbox','gearboxes',
        'agitator','agitators','transmission','machine','machines','machinery','equipment','installation','installations',
        'part','parts','component','components','bearing','bearings','gear','gears','conveyor belt',
        'boiler','heat exchanger','plant',
        // "something is wrong" signals (no need to name the exact machine)
        'broken','not working','doesnt work','stopped','stopped working','failed','damaged','faulty','out of order',
        'strange noise','weird noise','noisy','leaking','leak','vibrating','rusty','worn out','malfunction','malfunctioning'
      ],
      answer: 'We offer industrial maintenance (corrective, preventive and predictive), plant assembly and shutdowns, and process automation and control. If you have a broken piece of equipment, our corrective maintenance team can help.',
      link: {href:'negocio.html', label:'View all services →'}
    },
    {
      label: 'Products & brands', icon: ICONS.productos,
      keywords: ['product','products','brand','brands','bertoli','nakakin','nanakin','on fitting','onfitting','homogenizer','homogenizers','fitting','fittings','catalog','catalogue','distributor','official distributor','manufacturer','what do you sell'],
      answer: 'We are the official distributor of Bertoli, Nakakin and On Fitting.',
      link: {href:'productos.html', label:'View catalog →'}
    },
    {
      label: 'Locations & contact', icon: ICONS.sedes,
      keywords: ['location','locations','office','offices','address','where are you','where are you based','based','situated','casarrubios','talavera','fresno','toledo','badajoz','california','united states','usa','map'],
      answer: 'Head office in Casarrubios del Monte (Toledo, Spain), a branch in Talavera la Real (Badajoz, Spain), and an office in Fresno, California.',
      link: {href:'contacto.html', label:'View maps & contact details →'}
    },
    {
      label: 'Request information', icon: ICONS.info,
      keywords: ['information','info','quote','quotation','price','prices','how much','cost','costs','inquiry','enquiry','contact','email','phone','call','form','project','write to you'],
      answer: 'You can email us at comercial@ananta.es, call +34 918 18 34 74, or fill in our contact form.',
      link: {href:'contacto.html#formulario', label:'Go to the form →'}
    },
    {
      label: 'Careers', icon: ICONS.empleo,
      keywords: ['job','jobs','work with us','career','careers','application','resume','cv','vacancy','vacancies','hiring','hire','recruitment','open positions'],
      answer: 'You can send us your application through the contact form — please mention "recruitment" in the subject line.',
      link: {href:'contacto.html#formulario', label:'Go to the form →'}
    },
    {
      label: 'Talk to a specialist', icon: ICONS.whatsapp, accent: true,
      keywords: ['whatsapp','specialist','talk to someone','talk to a person','person','human','agent','call me','urgent','emergency'],
      whatsapp: true
    }
  ];

  var GREETINGS = ['hi','hello','hey','good morning','good afternoon','good evening','greetings'];
  var THANKS = ['thanks','thank you','great','perfect','awesome','ok','got it','cheers'];
  // if the message mentions a breakdown even without naming the exact machine, we still treat
  // it as a corrective-maintenance enquiry (by far the most common use case)
  var BREAKDOWN_SIGNALS = ['broken','not working','doesnt work','stopped working','failed','damaged','faulty','out of order','malfunction'];

  function normalize(s){
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').trim();
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
      addBotMessage('Can I help you with anything else?', renderMenu);
    }, 600);
  }

  function answerItem(item){
    if(item.whatsapp){
      addBotMessage('Connecting you with a specialist on WhatsApp:', function(){
        addLink(WA_URL, 'Open WhatsApp →', {blank:true});
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

  // ---- keyword search for free text ----
  function findBestMatch(rawText){
    var text = normalize(rawText);
    if(!text) return null;

    var best = null, bestScore = 0;
    MENU.forEach(function(item){
      var score = 0;
      item.keywords.forEach(function(kw){
        if(text.indexOf(kw) !== -1) score += kw.split(' ').length; // multi-word phrases weigh more
      });
      // "something is broken" is almost always corrective maintenance, even if we don't
      // recognise the exact machine the customer mentions
      if(item.id === 'servicios' && BREAKDOWN_SIGNALS.some(function(s){ return text.indexOf(s) !== -1; })){
        score += 3;
      }
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
        addBotMessage('You\'re welcome! I\'m here if you need anything else.', renderMenu);
        return;
      }
      if(isGreeting(normalized) && normalized.length < 20){
        addBotMessage('Hello! How can I help you?', renderMenu);
        return;
      }
      var match = findBestMatch(text);
      if(match){
        answerItem(match);
      } else {
        addBotMessage('I\'m not sure I understood your question. You can pick an option below or try different words — or speak directly with a specialist:', renderMenu);
      }
    }, 300);
  }

  var started = false;
  function initConversation(){
    body.innerHTML = '';
    addBotMessage('Hi 👋 I\'m the ANANTA virtual assistant. You can type your question or choose an option:', renderMenu);
  }

  // on mobile, focusing the field opens the keyboard right as the panel opens and shifts it
  // (hiding the conversation); only do this on devices with a mouse/physical keyboard
  var canAutoFocus = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  // the widget is position:fixed anchored to the "layout" viewport; when the mobile keyboard
  // appears, the "visual" viewport shrinks but fixed elements don't know, so they end up
  // hidden behind the keyboard. With visualViewport we shift it up by exactly that much.
  if(window.visualViewport){
    var syncKeyboardOffset = function(){
      var vv = window.visualViewport;
      var offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      wrapper.style.setProperty('--kb-offset', offset + 'px');
      if(offset > 0) scrollToBottom();
    };
    window.visualViewport.addEventListener('resize', syncKeyboardOffset);
    window.visualViewport.addEventListener('scroll', syncKeyboardOffset);
  }

  function openChat(){
    wrapper.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    if(!started){ started = true; initConversation(); }
    if(input && canAutoFocus){ setTimeout(function(){ input.focus(); }, 300); }
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
    // some browsers (e.g. automated testing or virtual keyboards) don't always fire the
    // form's implicit submit on Enter, so we force it here and cancel the native behaviour
    // to avoid sending the message twice
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
    // we use composedPath (the path captured at click time) because the option buttons get
    // removed from the DOM when selected, so ev.target would no longer be "inside" wrapper
    var path = ev.composedPath ? ev.composedPath() : [];
    if(path.indexOf(wrapper) === -1) closeChat();
  });
});
