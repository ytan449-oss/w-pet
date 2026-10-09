# Test shopping cart

Complete the bilingual cart with persisted variant selections, quantity updates, removal, catalog-derived sandbox totals, an empty state and a header quantity indicator. Cart storage is local to the browser; neither provider credentials nor claimed payment results are stored in it.

Selections preserve version, length and Pink Mint Haze. Test amounts are explicitly distinguished from unknown retail pricing. The flow does not create a fulfillment order. Invalid variants, non-integer quantities and quantity limits are rejected.

One cart-page commit, stacked on the product-detail PR. Checkout follows in its own PR.
