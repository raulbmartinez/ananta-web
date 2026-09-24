document.addEventListener('DOMContentLoaded', function(){
  var STORAGE_KEY = 'ananta_cart_v1';
  var WA_NUMBER = '34628116355';
  var ORDER_EMAIL = 'comercial@ananta.es';

  var toggle = document.getElementById('cartToggle');
  var drawer = document.getElementById('cartDrawer');
  var closeBtn = document.getElementById('cartClose');
  var body = document.getElementById('cartBody');
  var footer = document.getElementById('cartFooter');
  var badge = document.getElementById('cartBadge');
  if(!toggle || !drawer || !body || !footer) return;

  var state = { view: 'cart', method: null };

  function loadItems(){
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e){ return []; }
  }
  function saveItems(items){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch(e){}
  }

  function formatPrice(cents){
    return (cents/100).toLocaleString('es-ES', {style:'currency', currency:'EUR'});
  }

  function cartTotal(items){
    var total = 0;
    for(var i=0;i<items.length;i++){
      if(items[i].price == null) return null;
      total += items[i].price * items[i].qty;
    }
    return total;
  }

  function updateBadge(){
    var items = loadItems();
    var count = items.reduce(function(n,it){ return n+it.qty; }, 0);
    if(badge){
      badge.textContent = count;
      badge.hidden = count === 0;
    }
  }

  window.Cart = {
    add: function(id, name, price, sku){
      var items = loadItems();
      var existing = items.filter(function(it){ return it.id === id; })[0];
      if(existing){ existing.qty += 1; }
      else { items.push({id:id, name:name, sku:sku||null, price:(price==null?null:price), qty:1}); }
      saveItems(items);
      updateBadge();
      openDrawer();
      renderCart();
    }
  };

  function removeItem(id){
    var items = loadItems().filter(function(it){ return it.id !== id; });
    saveItems(items);
    updateBadge();
    renderCart();
  }
  function setQty(id, qty){
    var items = loadItems();
    items.forEach(function(it){ if(it.id === id) it.qty = Math.max(1, qty); });
    saveItems(items);
    updateBadge();
    renderCart();
  }

  function el(tag, cls, html){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }

  function itemsSummaryText(items){
    return items.map(function(it){
      var priceTxt = it.price == null ? 'consultar precio' : formatPrice(it.price) + ' / ud.';
      return '- ' + it.name + (it.sku ? ' (' + it.sku + ')' : '') + ' x' + it.qty + ' — ' + priceTxt;
    }).join('\n');
  }

  function renderCart(){
    var items = loadItems();
    body.innerHTML = '';
    footer.innerHTML = '';

    if(state.view === 'checkout'){
      renderCheckout(items);
      return;
    }

    if(!items.length){
      body.appendChild(el('p', 'cart-empty', 'Todavía no ha añadido ningún producto a su pedido.'));
      return;
    }

    var list = el('div', 'cart-list');
    items.forEach(function(it){
      var row = el('div', 'cart-item');
      var info = el('div', 'cart-item-info');
      info.appendChild(el('div', 'cart-item-name', it.name + (it.sku ? ' <span class="cart-item-sku">('+it.sku+')</span>' : '')));
      info.appendChild(el('div', 'cart-item-price', it.price == null ? 'Consultar precio' : formatPrice(it.price) + ' / ud.'));
      row.appendChild(info);

      var qtyWrap = el('div', 'cart-item-qty');
      var minus = el('button', 'cart-qty-btn', '−');
      minus.type = 'button';
      minus.addEventListener('click', function(){ setQty(it.id, it.qty - 1); });
      var qtyVal = el('span', 'cart-qty-val', String(it.qty));
      var plus = el('button', 'cart-qty-btn', '+');
      plus.type = 'button';
      plus.addEventListener('click', function(){ setQty(it.id, it.qty + 1); });
      qtyWrap.appendChild(minus); qtyWrap.appendChild(qtyVal); qtyWrap.appendChild(plus);
      row.appendChild(qtyWrap);

      var removeBtn = el('button', 'cart-remove-btn', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>');
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', 'Quitar ' + it.name);
      removeBtn.addEventListener('click', function(){ removeItem(it.id); });
      row.appendChild(removeBtn);

      list.appendChild(row);
    });
    body.appendChild(list);

    var total = cartTotal(items);
    var totalRow = el('div', 'cart-total');
    totalRow.innerHTML = total == null
      ? '<span>Algunos productos requieren presupuesto</span>'
      : '<span>Total estimado</span><strong>' + formatPrice(total) + '</strong>';
    footer.appendChild(totalRow);

    var continueBtn = el('button', 'btn btn-primary cart-continue-btn', 'Continuar con el pedido →');
    continueBtn.type = 'button';
    continueBtn.addEventListener('click', function(){ state.view = 'checkout'; renderCart(); });
    footer.appendChild(continueBtn);
  }

  function renderCheckout(items){
    var backBtn = el('button', 'cart-back-btn', '← Volver al pedido');
    backBtn.type = 'button';
    backBtn.addEventListener('click', function(){ state.view = 'cart'; state.method = null; renderCart(); });
    body.appendChild(backBtn);

    var total = cartTotal(items);
    var canPay = total != null;

    var contactWrap = el('div', 'cart-contact');
    contactWrap.innerHTML =
      '<div class="field"><label for="cartName">Nombre *</label><input type="text" id="cartName" autocomplete="name"></div>' +
      '<div class="field"><label for="cartEmail">Correo electrónico *</label><input type="email" id="cartEmail" autocomplete="email"></div>' +
      '<div class="field"><label for="cartPhone">Teléfono</label><input type="tel" id="cartPhone" autocomplete="tel"></div>';
    body.appendChild(contactWrap);

    var methods = el('div', 'cart-methods');

    var quoteBtn = el('button', 'cart-method-btn', '<strong>Solicitar presupuesto</strong><span>Le respondemos con el precio y disponibilidad</span>');
    quoteBtn.type = 'button';
    quoteBtn.addEventListener('click', function(){ selectMethod('quote'); });
    methods.appendChild(quoteBtn);

    var transferBtn = el('button', 'cart-method-btn' + (canPay ? '' : ' is-disabled'), '<strong>Pagar por transferencia</strong><span>' + (canPay ? 'Le facilitamos los datos bancarios' : 'Disponible cuando el pedido tenga precio') + '</span>');
    transferBtn.type = 'button';
    transferBtn.disabled = !canPay;
    transferBtn.addEventListener('click', function(){ if(canPay) selectMethod('transfer'); });
    methods.appendChild(transferBtn);

    var cardBtn = el('button', 'cart-method-btn' + (canPay ? '' : ' is-disabled'), '<strong>Pagar con tarjeta</strong><span>' + (canPay ? 'Pago seguro online' : 'Disponible cuando el pedido tenga precio') + '</span>');
    cardBtn.type = 'button';
    cardBtn.disabled = !canPay;
    cardBtn.addEventListener('click', function(){ if(canPay) selectMethod('card'); });
    methods.appendChild(cardBtn);

    body.appendChild(methods);

    var methodDetail = el('div', 'cart-method-detail', '');
    methodDetail.id = 'cartMethodDetail';
    body.appendChild(methodDetail);

    if(state.method) renderMethodDetail(items, total);

    function selectMethod(method){
      state.method = method;
      renderMethodDetail(items, total);
    }
  }

  function getContact(){
    return {
      name: (document.getElementById('cartName') || {}).value || '',
      email: (document.getElementById('cartEmail') || {}).value || '',
      phone: (document.getElementById('cartPhone') || {}).value || ''
    };
  }

  function renderMethodDetail(items, total){
    var detail = document.getElementById('cartMethodDetail');
    if(!detail) return;
    detail.innerHTML = '';

    if(state.method === 'quote'){
      var msg = el('p', 'cart-method-note', 'Elija cómo prefiere enviarnos su solicitud de presupuesto. Incluiremos automáticamente los productos de su pedido.');
      detail.appendChild(msg);
      var actions = el('div', 'cart-method-actions');
      var mailBtn = el('a', 'btn btn-primary', 'Enviar por email →');
      var waBtn = el('a', 'btn btn-outline', 'Enviar por WhatsApp →');
      mailBtn.href = '#';
      mailBtn.addEventListener('click', function(ev){ ev.preventDefault(); window.location.href = buildMailtoUrl(items); });
      waBtn.href = '#';
      waBtn.target = '_blank'; waBtn.rel = 'noopener';
      waBtn.addEventListener('click', function(ev){ ev.preventDefault(); window.open(buildWhatsappUrl(items), '_blank', 'noopener'); });
      actions.appendChild(mailBtn); actions.appendChild(waBtn);
      detail.appendChild(actions);
    }

    if(state.method === 'transfer'){
      detail.appendChild(el('p', 'cart-method-note', 'Realice el ingreso indicando el número de pedido en el concepto. Datos bancarios pendientes de configurar por ANANTA — mientras tanto, envíenos su pedido y le confirmaremos la cuenta.'));
      var ref = 'ANANTA-' + Date.now().toString().slice(-8);
      var bank = el('div', 'cart-bank-details');
      bank.innerHTML = '<div><span>Beneficiario</span><strong>ANANTA Soluciones Industriales</strong></div>' +
        '<div><span>IBAN</span><strong>Pendiente de configurar</strong></div>' +
        '<div><span>Nº de pedido</span><strong>' + ref + '</strong></div>';
      detail.appendChild(bank);
      var actions2 = el('div', 'cart-method-actions');
      var mailBtn2 = el('a', 'btn btn-primary', 'Avisar del pedido por email →');
      mailBtn2.href = '#';
      mailBtn2.addEventListener('click', function(ev){ ev.preventDefault(); window.location.href = buildMailtoUrl(items, ref, 'transferencia'); });
      var waBtn2 = el('a', 'btn btn-outline', 'Avisar por WhatsApp →');
      waBtn2.href = '#'; waBtn2.target = '_blank'; waBtn2.rel = 'noopener';
      waBtn2.addEventListener('click', function(ev){ ev.preventDefault(); window.open(buildWhatsappUrl(items, ref, 'transferencia'), '_blank', 'noopener'); });
      actions2.appendChild(mailBtn2); actions2.appendChild(waBtn2);
      detail.appendChild(actions2);
    }

    if(state.method === 'card'){
      var cardNote = el('p', 'cart-method-note', 'Le redirigimos a una pasarela de pago segura.');
      detail.appendChild(cardNote);
      var payBtn = el('button', 'btn btn-primary', 'Ir al pago seguro →');
      payBtn.type = 'button';
      var errNote = el('p', 'cart-method-error');
      errNote.hidden = true;
      payBtn.addEventListener('click', function(){
        payBtn.disabled = true;
        payBtn.textContent = 'Conectando…';
        fetch('/api/checkout', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            items: items.map(function(it){ return {name: it.name, price: it.price, qty: it.qty}; }),
            origin: window.location.origin,
            contact: getContact()
          })
        }).then(function(res){ return res.json().catch(function(){ return {}; }); })
          .then(function(data){
            if(data && data.url){ window.location.href = data.url; return; }
            throw new Error(data && data.message);
          }).catch(function(err){
            payBtn.disabled = false;
            payBtn.textContent = 'Ir al pago seguro →';
            errNote.hidden = false;
            errNote.textContent = (err && err.message) || 'El pago con tarjeta todavía no está configurado. Puede solicitar presupuesto o pagar por transferencia mientras tanto.';
          });
      });
      detail.appendChild(payBtn);
      detail.appendChild(errNote);
    }
  }

  function buildMailtoUrl(items, ref, method){
    var contact = getContact();
    var subject = ref ? ('Pedido ' + ref + ' (pago por transferencia) - ANANTA web') : 'Solicitud de presupuesto - ANANTA web';
    var lines = [];
    lines.push('Nombre: ' + contact.name);
    lines.push('Email: ' + contact.email);
    if(contact.phone) lines.push('Teléfono: ' + contact.phone);
    if(ref) lines.push('Nº de pedido: ' + ref);
    lines.push('');
    lines.push('Productos:');
    lines.push(itemsSummaryText(items));
    var body = lines.join('\n');
    return 'mailto:' + ORDER_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function buildWhatsappUrl(items, ref, method){
    var contact = getContact();
    var lines = [];
    lines.push(ref ? ('Hola, les aviso del pedido ' + ref + ' (pago por transferencia):') : 'Hola, me gustaría solicitar presupuesto para:');
    lines.push('');
    lines.push(itemsSummaryText(items));
    lines.push('');
    lines.push('Nombre: ' + (contact.name || '—'));
    if(contact.phone) lines.push('Teléfono: ' + contact.phone);
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  function openDrawer(){
    drawer.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer(){
    drawer.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function(){
    if(drawer.classList.contains('is-open')) closeDrawer();
    else { renderCart(); openDrawer(); }
  });
  if(closeBtn) closeBtn.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  // botones "Añadir al pedido" del catálogo
  document.querySelectorAll('[data-add-to-cart]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.getAttribute('data-id');
      var name = btn.getAttribute('data-name');
      var sku = btn.getAttribute('data-sku');
      var priceAttr = btn.getAttribute('data-price');
      var price = priceAttr ? parseInt(priceAttr, 10) : null;
      window.Cart.add(id, name, price, sku);
    });
  });

  updateBadge();
  renderCart();
});
