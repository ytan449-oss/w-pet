import type { Policy } from "../types/policy";

export const previewTerms = {
  slug: "terms",
  title: { en: "Terms & conditions", zh: "条款与条件" },
  intro: { en: "The terms for exploring this W Pet preview, sending an enquiry and using sandbox checkout.", zh: "本条款适用于浏览 W Pet 测试站、提交咨询及使用测试支付。" },
  updated: "2026-10-10",
  notice: { en: "Preview terms. Retail trading has not opened; the legal operator and final sales, delivery and returns arrangements await confirmation.", zh: "测试站条款。正式零售尚未开放；营业主体及正式销售、配送与退换安排仍待确认。" },
  sections: [
    {
      id: "preview", heading: { en: "The current store preview", zh: "当前店铺预览" },
      paragraphs: {
        en: ["W Pet is presented as an original New Zealand pet brand. This private preview introduces the brand and Aotearoa Bloom Hand-Woven Dog Leash. It does not currently accept retail orders, reserve stock or arrange shipments.", "Browsing a product, adding it to the test cart, sending an enquiry or completing a sandbox payment does not create an order for physical goods. The legal trading name, business address and formal customer-support details need confirmation before public retail trading."],
        zh: ["W Pet 为新西兰原创宠物品牌。本私有测试站用于展示品牌及 Aotearoa Bloom 手工编织狗牵引绳，目前不接受正式零售订单、不预留库存，也不安排发货。", "浏览商品、加入测试购物车、提交咨询或完成沙盒支付，均不会创建实物商品订单。正式公开零售前，还需确认法定营业名称、经营地址及正式客服信息。"],
      },
    },
    {
      id: "product-information", heading: { en: "Product information and imagery", zh: "商品信息与图片" },
      paragraphs: {
        en: ["The product page records the specifications supplied by the brand, including the standard and lightweight versions, 1.2m and 2m lengths and Pink Mint Haze. Consult that page for the complete specification table.", "Product gallery images are generated concepts and are labelled accordingly. The tensile-test documentation is awaiting verification; no independent certification, certification body or report number is claimed. Official washing and storage instructions are also awaiting the brand’s confirmation."],
        zh: ["产品页记录品牌方提供的规格，包括标准版与轻量版、1.2m 与 2m 长度，以及 Pink Mint Haze 配色。完整规格表请查看产品详情页。", "产品图为已标注的生成概念图。拉力测试认证资料仍待核验，本站不声称已取得独立认证，不虚构认证机构或报告编号。官方清洗与存放说明也仍待品牌方确认。"],
      }, contactTopic: "product-care",
    },
    {
      id: "pricing", heading: { en: "Prices and the test cart", zh: "价格与测试购物车" },
      paragraphs: {
        en: ["The retail selling price has not been provided. NZD 1.00 per item is only a sandbox amount used to exercise checkout; it is not a retail offer or a quote for custom production.", "Cart totals use the selected variants and quantities. The server checks the catalog and calculates test amounts again before creating a provider session. Test totals do not represent approved shipping charges, taxes, import duties or a final commercial invoice."],
        zh: ["正式零售价格尚未提供。每件 NZD 1.00 仅为测试支付金额，不是零售报价，也不是定制生产报价。", "购物车按所选规格及数量显示测试合计。创建支付平台会话前，服务器会核对商品配置并重新计算测试金额。测试合计不代表已确认的运费、税费、进口关税或正式商业发票。"],
      },
    },
    {
      id: "payments", heading: { en: "Stripe and PayPal sandbox checkout", zh: "Stripe 与 PayPal 测试支付" },
      paragraphs: {
        en: ["Stripe Checkout and PayPal are available only in test mode and only after the relevant merchant sandbox credentials are configured. Use provider-supplied test cards or sandbox accounts, not live payment details.", "Returning from a provider does not by itself confirm payment. The server checks the transaction’s ownership, reference, test status, currency and amount. PayPal capture requires an approved sandbox order. A confirmed test receipt is a record of a sandbox transaction, not a retail purchase, shipping confirmation or promise to supply goods.", "A cancelled, incomplete or unverified test payment retains the cart. Provider services also have their own terms and privacy notices."],
        zh: ["Stripe Checkout 与 PayPal 仅在测试模式下使用，且需先配置相应商户测试凭据。请使用平台提供的测试卡或沙盒账户，不要使用真实支付信息。", "从支付平台回跳本身并不代表支付成功。服务器会核对交易归属、编号、测试状态、币种和金额。PayPal 扣款需要已获批准的沙盒订单。经确认的测试记录仅代表沙盒交易，不是正式购买、发货确认或供货承诺。", "取消、未完成或未经核验的测试支付会保留购物车。支付平台服务也有其自身条款与隐私说明。"],
      }, contactTopic: "test-checkout",
    },
    {
      id: "custom-colours", heading: { en: "Small-batch custom-colour enquiries", zh: "小批量定制配色咨询" },
      paragraphs: {
        en: ["The supplied product information supports small-batch custom colours. Use the contact form to describe your preferred colours, version, length and quantity.", "Sending that request does not place or accept a custom order. Minimum quantity, colours, price, production timing and delivery arrangements must be confirmed separately before any retail offer. This preview does not publish an unapproved minimum order or lead time."],
        zh: ["已提供的商品资料说明支持小批量定制配色。请通过联系表单提供希望的颜色、版本、长度及数量。", "提交咨询不会下单，也不代表定制订单已被接受。最低数量、配色、价格、生产时间与配送安排，需在正式报价前另行确认。本测试站不公布未经确认的起订量或交期。"],
      }, contactTopic: "custom-colours",
    },
    {
      id: "delivery-returns", heading: { en: "Delivery, returns and consumer rights", zh: "配送、退换与消费者权益" },
      paragraphs: {
        en: ["There is no physical fulfilment in this preview. Delivery destinations, courier charges, taxes/duties, dispatch timing, return procedures and any change-of-mind return window are not yet approved. Those details must be published before live checkout opens; no free-shipping, delivery-time or returns promise is made here.", "Nothing in these preview terms removes rights that applicable law does not allow a business to exclude. Where New Zealand consumer law applies, this includes protections under the Consumer Guarantees Act and Fair Trading Act. A future cross-border sale may also be subject to mandatory protections in the customer’s location."],
        zh: ["本测试站不安排实物履约。配送国家或地区、快递费用、税费及关税、发货时间、退换流程，以及是否提供无理由退货期限，均尚未确认。这些信息需在正式结账开放前公布；本页不作包邮、交付时间或退货承诺。", "本测试站条款不会排除适用法律禁止商家排除的权利。在新西兰消费者法律适用时，包括《消费者保障法》和《公平交易法》提供的保护。未来跨境销售也可能受到客户所在地强制性消费者保护规则约束。"],
      }, links: [
        { href: "https://www.consumerprotection.govt.nz/general-help/consumer-laws/consumer-guarantees-act", label: { en: "Consumer Guarantees Act guidance", zh: "消费者保障法官方指引" } },
        { href: "https://www.consumerprotection.govt.nz/general-help/consumer-laws/fair-trading-act", label: { en: "Fair Trading Act guidance", zh: "公平交易法官方指引" } },
      ],
    },
    {
      id: "enquiries", heading: { en: "Using the enquiry form", zh: "使用咨询表单" },
      paragraphs: {
        en: ["Send genuine enquiries and only the information needed to handle them. Do not submit spam, payment-card details or someone else’s personal information without authority. Repeated submissions may be limited.", "A saved-enquiry reference means the form has stored your message. It does not mean an email has been sent, a quote accepted or a reply deadline agreed. Information submitted here is handled as explained in the privacy policy."],
        zh: ["请提交真实咨询，并仅提供处理咨询所需的信息。请勿提交垃圾内容、银行卡信息，或未经授权提交他人的个人信息。频繁提交可能受到限制。", "咨询编号表示表单已保存您的内容，不代表已发送邮件、接受报价或约定回复期限。在此提交的信息将按隐私政策处理。"],
      }, contactTopic: "general",
    },
    {
      id: "updates", heading: { en: "Questions and updates", zh: "咨询与更新" },
      paragraphs: {
        en: ["Questions about this preview can be sent through the contact page. The version date appears above. These terms need a further review when the legal operator, approved sales policies or live-commerce behaviour changes."],
        zh: ["如对本测试站有疑问，请通过联系页咨询。本页顶部显示版本日期。营业主体、经确认的销售政策或正式交易功能变更时，需再次审核本条款。"],
      }, contactTopic: "general",
    },
  ],
} as const satisfies Policy;
