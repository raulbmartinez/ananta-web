const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic(); // lee ANTHROPIC_API_KEY de las variables de entorno de Vercel

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 500;
const MAX_HISTORY_MESSAGES = 12; // ~6 turnos, para acotar coste y contexto
const MAX_MESSAGE_LENGTH = 800;

const COMPANY_FACTS = `
Datos de ANANTA Soluciones Industriales:
- Ingeniería de mantenimiento industrial, en activo desde 2003.
- Servicios: mantenimiento industrial (correctivo, preventivo y predictivo), montajes y paradas de planta, y automatización y control de procesos.
- Especialistas en maquinaria: bombas industriales, turbinas y equipos hidráulicos, motores, reductores, agitadores, transmisiones mecánicas, líneas de proceso y sistemas productivos completos.
- Distribuidor oficial de las marcas Bertoli, Nakakin y On Fitting.
- Sectores en los que opera: industria alimentaria, tratamiento de aguas y sector industrial en general (energía, construcción, manufactura...).
- Sedes: Casarrubios del Monte, Toledo, España (sede central); Talavera la Real, Badajoz, España; Fresno, California, EE. UU.
- Certificaciones: ISO 9001 e ISO 14001.
- Contacto: email comercial@ananta.es, teléfono +34 918 18 34 74, formulario en la página de contacto.
- WhatsApp para hablar con un especialista: https://wa.me/34628116355
- Empleo: se aceptan candidaturas a través del formulario de contacto indicando "selección de personal" en el asunto.
`.trim();

const SYSTEM_ES = `Eres el asistente virtual de ANANTA, publicado en su web. Tu único propósito es ayudar a los visitantes con consultas sobre ANANTA: sus servicios, productos, sectores, sedes, contacto o empleo.

${COMPANY_FACTS}

Instrucciones:
- Responde solo sobre ANANTA y temas directamente relacionados (mantenimiento industrial, los equipos que menciona el cliente, sus productos, sedes, contacto, empleo). Si preguntan algo ajeno a esto, indica amablemente que solo puedes ayudar con consultas sobre ANANTA y redirige la conversación.
- Sé breve y conversacional, como un chat de atención al cliente (2-4 frases como máximo), no como un correo o un artículo.
- No inventes datos que no tengas (precios exactos, plazos, disponibilidad): para presupuestos o casos concretos, indica que lo mejor es hablar con un especialista y facilita el email, el teléfono o el enlace de WhatsApp.
- Si el cliente describe una avería o un equipo con problemas, aunque no lo reconozcas con precisión, trátalo como una consulta de mantenimiento correctivo y ofrece que un especialista lo revise.
- Escribe en texto plano, sin formato markdown (sin **negrita**, sin listas con guiones ni encabezados).
- Responde siempre en español.`;

const SYSTEM_EN = `You are ANANTA's virtual assistant, published on their website. Your only purpose is to help visitors with questions about ANANTA: its services, products, sectors, locations, contact details or job openings.

${COMPANY_FACTS}

Instructions:
- Only answer about ANANTA and directly related topics (industrial maintenance, the equipment the customer mentions, its products, locations, contact, careers). If asked about something unrelated, politely explain you can only help with ANANTA-related questions and steer the conversation back.
- Be brief and conversational, like a customer-support chat (2-4 sentences at most), not an email or an article.
- Don't invent facts you don't have (exact prices, timelines, availability): for quotes or specific cases, say it's best to talk to a specialist and share the email, phone number or WhatsApp link.
- If the customer describes a breakdown or a piece of equipment with issues, even if you don't recognize it precisely, treat it as a corrective-maintenance inquiry and offer to have a specialist take a look.
- Write in plain text, no markdown formatting (no **bold**, no dashed lists, no headings).
- Always answer in English.`;

function sanitizeMessages(rawMessages) {
  if (!Array.isArray(rawMessages)) return [];
  return rawMessages
    .filter(function (m) { return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim(); })
    .slice(-MAX_HISTORY_MESSAGES)
    .map(function (m) {
      return { role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_LENGTH) };
    });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }

  const messages = sanitizeMessages(body && body.messages);
  const lang = body && body.lang === 'en' ? 'en' : 'es';

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'invalid_messages' });
    return;
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: lang === 'en' ? SYSTEM_EN : SYSTEM_ES,
      messages: messages,
    });

    const text = response.content
      .filter(function (b) { return b.type === 'text'; })
      .map(function (b) { return b.text; })
      .join('\n')
      .trim();

    res.status(200).json({
      reply: text || (lang === 'en'
        ? "Sorry, I couldn't process that — could you rephrase it?"
        : 'Disculpe, no he podido procesar su consulta. ¿Puede reformularla?'),
    });
  } catch (err) {
    console.error('chat api error:', err);
    res.status(502).json({
      error: 'upstream_error',
      reply: lang === 'en'
        ? "Sorry, I'm having trouble responding right now. You can reach a specialist directly on WhatsApp or write to comercial@ananta.es."
        : 'Disculpe, ahora mismo tengo problemas para responder. Puede hablar directamente con un especialista por WhatsApp o escribir a comercial@ananta.es.',
    });
  }
};
