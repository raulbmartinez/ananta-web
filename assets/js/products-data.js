// Catálogo de productos comprables desde la web. `price` en null significa
// "consultar precio": el pago con tarjeta y por transferencia se desactivan
// para ese producto hasta que se indique un precio real (en céntimos de euro).
window.ANANTA_PRODUCTS = [
  {
    id: 'px-pasadora-refinadora',
    category: 'maquinas',
    categoryLabel: 'Máquinas propias',
    name: 'Pasadora/Refinadora PX300 / PX500',
    sku: 'PX300 / PX500',
    image: 'assets/img/productos/pasadora-refinadora.jpg',
    desc: 'Pasadora/refinadora de doble etapa fabricada por ANANTA. Disponible en PX300 y PX500 según capacidad de producción requerida.',
    price: null
  },
  {
    id: 'px-turboprensa',
    category: 'maquinas',
    categoryLabel: 'Máquinas propias',
    name: 'Turboprensa PX300T / PX500T',
    sku: 'PX300T / PX500T',
    image: 'assets/img/productos/turboprensa.jpg',
    desc: 'Turboprensa para separación sólido-líquido fabricada por ANANTA. Disponible en PX300T y PX500T según capacidad de producción requerida.',
    price: null
  },
  {
    id: 'pieza-pala-rotor-inox',
    category: 'piezas',
    categoryLabel: 'Piezas y repuestos',
    name: 'Pala/paleta de rotor en acero inoxidable',
    sku: null,
    image: null,
    desc: 'Recambio de pala o paleta de rotor en acero inoxidable, fabricado a medida según el equipo y modelo.',
    price: null
  },
  {
    id: 'pieza-consulta',
    category: 'piezas',
    categoryLabel: 'Piezas y repuestos',
    name: 'Otra pieza o repuesto a medida',
    sku: null,
    image: null,
    desc: '¿Necesita otra pieza, componente o repuesto de acero inoxidable? Indíquenos el equipo y la referencia y le preparamos presupuesto.',
    price: null
  }
];

// Renderiza las tarjetas de "Máquinas propias" y "Piezas y repuestos" en
// productos.html a partir del catálogo de arriba.
(function renderProductCards(){
  function cardHtml(p){
    var img = p.image
      ? '<div class="product-card-img"><img src="' + p.image + '" alt="' + p.name + '" loading="lazy"></div>'
      : '<div class="product-card-img is-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 16l5-5 4 4 5-6 4 5"/></svg></div>';
    var priceLabel = p.price == null ? 'Consultar precio' : (p.price/100).toLocaleString('es-ES', {style:'currency', currency:'EUR'});
    return (
      '<div class="product-card">' + img +
      '<div class="product-card-body">' +
      (p.sku ? '<span class="product-card-sku">' + p.sku + '</span>' : '') +
      '<h3 class="product-card-name">' + p.name + '</h3>' +
      '<p class="product-card-desc">' + p.desc + '</p>' +
      '<span class="product-card-price">' + priceLabel + '</span>' +
      '<button type="button" class="product-add-btn" data-add-to-cart data-id="' + p.id + '" data-name="' + p.name + '"' + (p.sku ? ' data-sku="' + p.sku + '"' : '') + (p.price != null ? ' data-price="' + p.price + '"' : '') + '>Añadir al pedido →</button>' +
      '</div></div>'
    );
  }

  function mount(){
    var products = window.ANANTA_PRODUCTS || [];
    var maquinasGrid = document.getElementById('maquinasGrid');
    var piezasGrid = document.getElementById('piezasGrid');
    if(maquinasGrid){
      maquinasGrid.innerHTML = products.filter(function(p){ return p.category === 'maquinas'; }).map(cardHtml).join('');
    }
    if(piezasGrid){
      piezasGrid.innerHTML = products.filter(function(p){ return p.category === 'piezas'; }).map(cardHtml).join('');
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
