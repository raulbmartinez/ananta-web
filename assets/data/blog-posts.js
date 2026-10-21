/*
 * NOTICIAS DEL BLOG ANANTA
 * ------------------------
 * Para publicar una noticia nueva, copie un bloque { ... } completo, péguelo
 * al PRINCIPIO de la lista y cambie sus datos. La web ordena por fecha, así que
 * la más reciente aparece siempre destacada.
 *
 *   slug       Identificador único, sin espacios ni tildes (va en la dirección web).
 *   fecha      Formato AAAA-MM-DD.
 *   categoria  Una de: "ferias", "proyectos", "empresa", "productos".
 *   imagen     Ruta de la foto (súbala a assets/img/blog/). Déjela en "" si aún
 *              no hay foto: se mostrará un recuadro pendiente.
 *   es / en    Textos en español e inglés. "cuerpo" admite párrafos <p>, listas
 *              <ul><li> y subtítulos <h2>.
 */
window.ANANTA_POSTS = [
  {
    slug: "nueva-web-ananta",
    fecha: "2026-10-21",
    categoria: "empresa",
    imagen: "assets/img/hero/hero-00-sede-ananta.jpg",
    es: {
      titulo: "Estrenamos nueva web",
      resumen: "Una web renovada para conocer mejor nuestros servicios de mantenimiento industrial, nuestros productos y nuestras sedes en España y Estados Unidos.",
      cuerpo: "<p>Hemos renovado por completo nuestra web para que clientes y colaboradores encuentren de forma más rápida y clara todo lo que hacemos: mantenimiento industrial, montajes y paradas, automatización y control, y los equipos que distribuimos.</p><p>Desde este blog compartiremos de forma periódica nuestra actividad: ferias y eventos en los que participamos, trabajos realizados en planta y novedades de la compañía.</p><p>La web está disponible en español y en inglés, y desde cualquier página puede contactar con nuestro equipo técnico o escribirnos por WhatsApp.</p>"
    },
    en: {
      titulo: "Our new website is live",
      resumen: "A redesigned website to help you get to know our industrial maintenance services, our products and our locations in Spain and the United States.",
      cuerpo: "<p>We have completely redesigned our website so that customers and partners can find everything we do more quickly and clearly: industrial maintenance, installations and shutdowns, automation and control, and the equipment we distribute.</p><p>On this blog we will regularly share our activity: trade shows and events we attend, work carried out on site and company news.</p><p>The website is available in Spanish and English, and from any page you can contact our technical team or message us on WhatsApp.</p>"
    }
  },
  {
    slug: "vaciado-de-bidones",
    fecha: "2026-10-21",
    categoria: "productos",
    imagen: "assets/img/productos/tote-dumper.jpg",
    es: {
      titulo: "Vaciado de bidones: descarga automática y sin pérdidas de producto",
      resumen: "Nuestra máquina vacía de forma automática bidones con bolsas asépticas, con un solo operario por turno y pérdidas de producto de alrededor del 0,5 %.",
      cuerpo: "<p>Diseñamos y fabricamos una máquina que automatiza el vaciado de bidones con bolsas asépticas de materia prima. El bidón se eleva y se voltea, la bolsa se lava, se corta con cuchillas rotativas y una prensa de rodillos vacía todo el producto en una tolva.</p><ul><li>Hasta 20 bidones por hora.</li><li>Un solo operario por turno, frente a 2–4 en la descarga por succión.</li><li>Pérdidas de producto de ≈0,5 %, frente al 3–20 % habitual.</li><li>Sistema CIP, control por PLC y seguridad SIL3.</li></ul><p>Puede ver todos los detalles en la sección de Productos.</p>"
    },
    en: {
      titulo: "Tote bin dumper: automatic unloading with virtually no product loss",
      resumen: "Our machine automatically empties tote bins holding aseptic bags, with a single operator per shift and product losses of around 0.5%.",
      cuerpo: "<p>We design and build a machine that automates the emptying of tote bins holding aseptic bags of raw material. The bin is lifted and turned over, the bag is washed, cut by rotary blades, and a roller press empties all the product into a hopper.</p><ul><li>Up to 20 tote bins per hour.</li><li>One operator per shift, versus 2–4 with suction unloading.</li><li>Product losses of ≈0.5%, versus the usual 3–20%.</li><li>CIP system, PLC control and SIL3 safety.</li></ul><p>You can find all the details in the Products section.</p>"
    }
  },
  {
    slug: "distribuidor-oficial-nakakin",
    fecha: "2026-10-21",
    categoria: "productos",
    imagen: "assets/img/productos/nakakin-bomba.jpg",
    es: {
      titulo: "Bombas de pistones rotativos Nakakin",
      resumen: "Como distribuidor oficial de Nakakin, ofrecemos sus bombas de pistones rotativos para alimentación, lácteos, bebidas, cosmética y farmacia.",
      cuerpo: "<p>Las bombas de pistones rotativos Nakakin, fabricadas en Japón, destacan por su higiene, su facilidad de limpieza CIP y la holgura mínima entre rotor y carcasa gracias a su aleación propia «Metal Nakamura n.º 3».</p><ul><li>Caudal de hasta 90.000 l/h.</li><li>Presión de trabajo de hasta 15 bar.</li><li>Productos de hasta 300.000 mPa·s.</li><li>Certificaciones EHEDG, 3-A y CE.</li></ul><p>En la sección de Productos encontrará las series disponibles, la tabla de tamaños y el catálogo para descargar.</p>"
    },
    en: {
      titulo: "Nakakin rotary piston pumps",
      resumen: "As an official Nakakin distributor, we offer their rotary piston pumps for food, dairy, beverages, cosmetics and pharmaceuticals.",
      cuerpo: "<p>Nakakin rotary piston pumps, made in Japan, stand out for their hygiene, easy CIP cleaning and the minimal rotor-to-casing clearance made possible by their proprietary \"Nakamura Metal No. 3\" alloy.</p><ul><li>Flow rates up to 90,000 l/h.</li><li>Working pressure up to 15 bar.</li><li>Products up to 300,000 mPa·s.</li><li>EHEDG, 3-A and CE certifications.</li></ul><p>In the Products section you will find the available series, the size table and the catalogue to download.</p>"
    }
  },
  {
    slug: "certificaciones-iso",
    fecha: "2026-10-21",
    categoria: "empresa",
    imagen: "assets/img/home/compromiso-calidad.jpg",
    es: {
      titulo: "Certificados ISO 9001 e ISO 14001",
      resumen: "Trabajamos con un sistema de gestión certificado en calidad y medio ambiente, con los mismos estándares en todas nuestras sedes.",
      cuerpo: "<p>Nuestro sistema de gestión está certificado según ISO 9001 (gestión de la calidad) e ISO 14001 (gestión ambiental), y aplicamos los mismos estándares en todas nuestras sedes.</p><p>Esto se traduce en procedimientos documentados, control de cada reparación y criterios ambientales integrados en cada proyecto.</p><p>Puede descargar los certificados desde el apartado Calidad y medioambiente de la página Compañía.</p>"
    },
    en: {
      titulo: "ISO 9001 and ISO 14001 certified",
      resumen: "We operate a certified quality and environmental management system, with the same standards at all our locations.",
      cuerpo: "<p>Our management system is certified to ISO 9001 (quality management) and ISO 14001 (environmental management), and we apply the same standards at all our locations.</p><p>This means documented procedures, control of every repair and environmental criteria built into every project.</p><p>You can download the certificates from the Quality and environment section of the Company page.</p>"
    }
  }
];
