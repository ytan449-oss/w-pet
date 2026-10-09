# Private GitHub review workflow

Repository: [ytan449-oss/w-pet](https://github.com/ytan449-oss/w-pet). Its visibility is **Private**.

`main` retains the README review baseline. `feat/foundation-and-homepage` contains a separate foundation commit and homepage completion commit. The first PR targets `main` and uses `docs/foundation-homepage-pr.md` as its description.

Review the homepage design, English/Chinese content and proposed route structure before merging. The CI workflow checks route types, tests and the production build. Do not merge PRs automatically.

For each subsequent page, use its own feature branch, one page-completion commit and one PR. The Aotearoa Bloom collection page is next, followed by product details, brand story, craftsmanship, care/FAQ, contact, cart, checkout, order confirmation and policies.

Products, prices and images remain concept previews. Checkout and payments require a separate integration before the storefront can accept real orders.
