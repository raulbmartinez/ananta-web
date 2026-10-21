/* Blog ANANTA: pinta el listado de noticias (blog.html) y cada noticia (blog-post.html)
   a partir de assets/data/blog-posts.js. */
(function(){
  var posts = (window.ANANTA_POSTS || []).slice().sort(function(a, b){ return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0; });
  var lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  var root = document.querySelector('[data-blog-base]');
  var base = root ? root.getAttribute('data-blog-base') : '';

  var T = {
    es: {
      cats: { todas: 'Todas', ferias: 'Ferias y eventos', proyectos: 'Proyectos', empresa: 'Empresa', productos: 'Productos' },
      read: 'Leer noticia', latest: 'Última noticia', photo: 'Foto pendiente', back: '← Volver al blog',
      empty: 'Muy pronto publicaremos aquí nuevas noticias de esta categoría.', notFound: 'No hemos encontrado esta noticia.',
      share: 'Compartir', copy: 'Copiar enlace', copied: 'Enlace copiado', more: 'Más noticias', locale: 'es-ES'
    },
    en: {
      cats: { todas: 'All', ferias: 'Trade shows & events', proyectos: 'Projects', empresa: 'Company', productos: 'Products' },
      read: 'Read more', latest: 'Latest news', photo: 'Photo coming soon', back: '← Back to the blog',
      empty: 'We will soon publish news in this category.', notFound: 'We could not find this article.',
      share: 'Share', copy: 'Copy link', copied: 'Link copied', more: 'More news', locale: 'en-US'
    }
  }[lang];

  var PH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"></path></svg>';

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function txt(p){ return p[lang] || p.es; }
  function date(p){
    var d = new Date(p.fecha + 'T12:00:00');
    return new Intl.DateTimeFormat(T.locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  }
  function url(p){ return 'blog-post.html?p=' + encodeURIComponent(p.slug); }
  function media(p, cls){
    if (p.imagen) return '<figure class="' + cls + '"><img src="' + base + esc(p.imagen) + '" alt="' + esc(txt(p).titulo) + '" loading="lazy"></figure>';
    return '<figure class="' + cls + ' ph-photo">' + PH_ICON + '<figcaption>' + T.photo + '</figcaption></figure>';
  }
  function meta(p){
    return '<div class="post-meta"><span class="post-cat">' + T.cats[p.categoria] + '</span><time datetime="' + p.fecha + '">' + date(p) + '</time></div>';
  }
  function card(p){
    var t = txt(p);
    return '<a class="post-card" href="' + url(p) + '">' + media(p, 'post-card-media') +
      '<div class="post-card-body">' + meta(p) + '<h3>' + esc(t.titulo) + '</h3><p>' + esc(t.resumen) + '</p>' +
      '<span class="post-link">' + T.read + ' →</span></div></a>';
  }

  /* ---------- LISTADO ---------- */
  var feed = document.getElementById('blogFeed');
  if (feed) {
    var filters = document.getElementById('blogFilters');
    var current = 'todas';
    var keys = Object.keys(T.cats);
    filters.innerHTML = keys.map(function(k){
      var n = k === 'todas' ? posts.length : posts.filter(function(p){ return p.categoria === k; }).length;
      return '<button type="button" class="blog-filter" data-cat="' + k + '" aria-pressed="' + (k === current) + '">' + T.cats[k] + ' <span class="count">' + n + '</span></button>';
    }).join('');

    function render(){
      var list = current === 'todas' ? posts : posts.filter(function(p){ return p.categoria === current; });
      if (!list.length) { feed.innerHTML = '<p class="blog-empty">' + T.empty + '</p>'; return; }
      var first = list[0], t = txt(first);
      var html = '<a class="post-featured" href="' + url(first) + '">' + media(first, 'post-featured-media') +
        '<div class="post-featured-body"><span class="post-featured-label">' + T.latest + '</span>' + meta(first) +
        '<h2>' + esc(t.titulo) + '</h2><p>' + esc(t.resumen) + '</p><span class="btn btn-navy">' + T.read + ' →</span></div></a>';
      if (list.length > 1) html += '<div class="post-grid">' + list.slice(1).map(card).join('') + '</div>';
      feed.innerHTML = html;
    }
    filters.addEventListener('click', function(e){
      var b = e.target.closest('.blog-filter'); if (!b) return;
      current = b.getAttribute('data-cat');
      filters.querySelectorAll('.blog-filter').forEach(function(x){ x.setAttribute('aria-pressed', x === b); });
      render();
    });
    render();
  }

  /* ---------- NOTICIA ---------- */
  var article = document.getElementById('blogPost');
  if (article) {
    var slug = new URLSearchParams(location.search).get('p');
    var post = posts.filter(function(p){ return p.slug === slug; })[0];
    if (!post) {
      article.innerHTML = '<div class="wrap post-article"><p class="blog-empty">' + T.notFound + '</p><a href="blog.html" class="btn btn-navy">' + T.back + '</a></div>';
      return;
    }
    var t = txt(post);
    var sw = document.querySelector('.lang-switch');
    if (sw) {
      var h = sw.getAttribute('href').replace('blog.html', 'blog-post.html');
      sw.setAttribute('href', h + (h.indexOf('?') > -1 ? '&' : '?') + 'p=' + encodeURIComponent(post.slug));
    }
    document.title = t.titulo + ' | ANANTA';
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t.resumen);
    var here = encodeURIComponent(location.href), title = encodeURIComponent(t.titulo);
    var others = posts.filter(function(p){ return p !== post; }).slice(0, 3);
    article.innerHTML =
      '<div class="wrap post-article">' +
        '<a href="blog.html" class="post-back">' + T.back + '</a>' + meta(post) +
        '<h1>' + esc(t.titulo) + '</h1><p class="post-lede">' + esc(t.resumen) + '</p>' +
        media(post, 'post-hero-media') +
        '<div class="post-body">' + t.cuerpo + '</div>' +
        '<div class="post-share"><span>' + T.share + '</span>' +
          '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + here + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="https://wa.me/?text=' + title + '%20' + here + '" target="_blank" rel="noopener">WhatsApp</a>' +
          '<button type="button" id="copyLink">' + T.copy + '</button>' +
        '</div>' +
      '</div>' +
      (others.length ? '<div class="post-more"><div class="wrap"><span class="eyebrow">' + T.more + '</span><div class="post-grid">' + others.map(card).join('') + '</div></div></div>' : '');
    var cb = document.getElementById('copyLink');
    cb.addEventListener('click', function(){
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function(){ cb.textContent = T.copied; });
    });
  }
})();
