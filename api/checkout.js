const Stripe = require('stripe');

const NOT_CONFIGURED_MESSAGE = 'El pago con tarjeta todavía no está configurado. Puede solicitar presupuesto o pagar por transferencia mientras tanto.';

function sanitizeItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter(function (it) {
      return it && typeof it.name === 'string' && it.name.trim() && Number.isFinite(it.price) && it.price > 0;
    })
    .map(function (it) {
      return {
        name: it.name.trim().slice(0, 200),
        price: Math.round(it.price),
        qty: Math.max(1, Math.min(999, parseInt(it.qty, 10) || 1)),
      };
    });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: 'stripe_not_configured', message: NOT_CONFIGURED_MESSAGE });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }

  const items = sanitizeItems(body && body.items);
  if (!items.length) {
    res.status(400).json({ error: 'empty_cart', message: 'El pedido está vacío o no tiene precio.' });
    return;
  }

  const origin = (body && typeof body.origin === 'string' && body.origin.startsWith('http')) ? body.origin : '';
  if (!origin) {
    res.status(400).json({ error: 'invalid_origin' });
    return;
  }

  const contact = (body && body.contact) || {};

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map(function (it) {
        return {
          price_data: {
            currency: 'eur',
            product_data: { name: it.name },
            unit_amount: it.price,
          },
          quantity: it.qty,
        };
      }),
      customer_email: typeof contact.email === 'string' && contact.email.includes('@') ? contact.email : undefined,
      success_url: origin + '/pedido-confirmado.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/productos.html',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('checkout error:', err);
    res.status(502).json({ error: 'checkout_error', message: 'No se ha podido iniciar el pago. Inténtelo de nuevo o solicite presupuesto.' });
  }
};
