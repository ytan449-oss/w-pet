# Private GitHub review workflow

Repository: [ytan449-oss/w-pet](https://github.com/ytan449-oss/w-pet). Its visibility is **Private**.

The foundation and homepage PR #1 is merged into `main`. Keep new page work in separate review branches; do not merge PRs automatically.

Review the homepage design, English/Chinese content and proposed route structure before merging. The CI workflow checks route types, tests and the production build. Do not merge PRs automatically.

For each page, use its own feature branch, one page-completion commit and one PR. The current requested sequence is About, Our Craft, then Care & FAQ. These PRs are stacked so each review contains only one page: About targets `main`, Craft targets About, and Care targets Craft. Review/merge them in that order. The collection and remaining storefront pages follow later.

Products, prices and images remain concept previews. Checkout and payments require a separate integration before the storefront can accept real orders.
