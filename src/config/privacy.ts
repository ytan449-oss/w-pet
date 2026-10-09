import type { Policy } from "../types/policy";

/** Current implementation notice; commercial operator details remain unapproved. */
export const privacyPolicy = {
  slug: "privacy",
  title: { en: "Privacy policy", zh: "隐私政策" },
  intro: { en: "How this W Pet preview handles enquiries, shopping-cart data and sandbox checkout.", zh: "本页说明 W Pet 测试站如何处理咨询信息、购物车数据与测试支付。" },
  updated: "2026-10-10",
  notice: { en: "Testing edition. The legal operator, postal address and dedicated privacy contact must be confirmed before public trading.", zh: "测试站版本。营业主体法定名称、地址及专用隐私联络方式，需在正式公开营业前确认。" },
  sections: [
    {
      id: "scope", heading: { en: "Who this notice covers", zh: "本说明适用范围" },
      paragraphs: {
        en: ["This notice describes the W Pet preview and its enquiry form. The preview is currently private and does not accept retail orders or arrange shipments.", "You can reach the brand through the contact page. Choose Privacy request for questions about information submitted here."],
        zh: ["本说明适用于 W Pet 测试站及其咨询表单。目前站点为私有预览，不接收正式零售订单，也不安排发货。", "您可以通过联系页联系品牌方。如需咨询在此提交的信息，请选择“隐私请求”。"],
      }, contactTopic: "privacy",
    },
    {
      id: "collection", heading: { en: "Information you share", zh: "您提供的信息" },
      paragraphs: {
        en: ["The enquiry form requires a name, email, topic and message. We save those fields, your chosen language, submission time, enquiry reference, request identifier, an integrity hash and the version of the privacy notice you acknowledged. These details help us handle your question and identify a follow-up without saving a duplicate when you retry.", "Submitting an enquiry is optional. Without the required fields and privacy acknowledgement, it cannot be saved. Share only the details needed for your question; the form does not ask for a postal address, payment-card information or identity documents."],
        zh: ["咨询表单要求填写姓名、邮箱、主题和内容。我们会保存这些字段、所选语言、提交时间、咨询编号、请求标识、完整性校验摘要，以及您确认阅读的隐私说明版本，用于处理咨询、识别后续联系，并避免重试产生重复记录。", "提交咨询是自愿的。缺少必填字段或未确认隐私说明时，咨询无法保存。请仅提供处理问题所需的信息；表单不要求邮寄地址、银行卡信息或身份证明文件。"],
      },
    },
    {
      id: "purpose", heading: { en: "How enquiries are used", zh: "咨询信息的用途" },
      paragraphs: {
        en: ["Enquiry details are saved for the brand owner to review and handle product questions, custom-colour requests, test-checkout questions and privacy requests. The current form saves a record; it does not send an automatic email or subscribe you to marketing.", "There is no public inquiry-list endpoint. This preview does not install advertising pixels, a newsletter subscription or a workflow that sells contact information."],
        zh: ["咨询信息会保存供品牌方查看，用于处理产品问题、定制配色、测试支付与隐私请求。当前表单仅保存记录，不会自动发送邮件，也不会将您加入营销订阅。", "站点不提供公开的咨询列表接口。本测试站未加入广告追踪像素、邮件订阅，或出售联系人信息的流程。"],
      },
    },
    {
      id: "storage", heading: { en: "Storage, providers and retention", zh: "保存、服务提供方与保留" },
      paragraphs: {
        en: ["Enquiries are stored in the Site’s hosted Cloudflare D1 database. ChatGPT Sites and Cloudflare provide private access and hosting; their services may maintain their own access and network logs. This preview has not selected a New Zealand-only data-residency arrangement, so do not assume all processing stays in New Zealand.", "To limit repeated submissions, the contact service stores a short-lived hashed visitor key, a count and an expiry time. It does not put a raw IP address in the enquiry record. Expired rate-limit buckets are removed during a later valid submission.", "No automatic enquiry-deletion schedule is configured for this preview. The owner must review and remove information when it is no longer needed for a lawful purpose. The final retention and overseas-provider arrangements need confirmation before public launch. You can request deletion through the contact page."],
        zh: ["咨询信息保存在站点托管的 Cloudflare D1 数据库中。ChatGPT Sites 与 Cloudflare 提供私有访问和托管，其服务可能记录访问与网络日志。本测试站未选择仅限新西兰的数据驻留安排，请勿假定所有处理都发生在新西兰。", "为限制重复提交，咨询服务会保存短期的访客哈希标识、次数和到期时间，不会将原始 IP 地址写入咨询记录。过期的限流记录会在后续有效提交时清除。", "本测试站尚未配置咨询记录的自动删除计划。品牌方需审核记录，并在合法用途不再需要时删除信息。正式公开上线前，还需确认最终保留流程及境外服务安排。您可以通过联系页申请删除。"],
      }, links: [
        { href: "https://www.privacy.org.nz/privacy-principles/9/", label: { en: "NZ guidance on retention", zh: "新西兰信息保留指引" } },
        { href: "https://www.privacy.org.nz/privacy-principles/12/", label: { en: "NZ guidance on overseas disclosure", zh: "新西兰境外披露指引" } },
      ], contactTopic: "privacy",
    },
    {
      id: "browser", heading: { en: "Cookies and browser storage", zh: "Cookie 与浏览器存储" },
      paragraphs: {
        en: ["Your selected product variants and quantities are saved in this browser’s local storage. They remain until you update the cart, a verified test payment removes purchased quantities, or you clear site data. They do not sync across devices.", "Configured test checkout uses a signed, HttpOnly cookie for each provider to bind its transaction reference to your cart. These cookies expire after one hour. A tab-session marker prevents repeated payment confirmation from removing purchased quantities twice. The hosting platform may also use cookies for private sign-in.", "Enquiry text is not saved as a browser draft by this form. Clearing browser storage can remove your cart and confirmation markers but does not delete enquiry records already saved on the server."],
        zh: ["所选商品规格和数量保存在当前浏览器的本地存储中，直到您更新购物车、经核验的测试支付移除已支付数量，或清除站点数据。购物车不会跨设备同步。", "配置后的测试支付使用每个平台独立的签名 HttpOnly Cookie，将交易编号与购物车绑定；这些 Cookie 一小时后到期。标签页会话标记用于避免重复核验时两次移除已支付数量。托管平台也可能使用 Cookie 处理私有站点登录。", "本表单不会将咨询内容保存为浏览器草稿。清除浏览器数据可能删除购物车及支付核验标记，但不会删除已保存到服务器的咨询记录。"],
      },
    },
    {
      id: "payments", heading: { en: "Sandbox payment information", zh: "测试支付信息" },
      paragraphs: {
        en: ["Stripe Checkout and PayPal are test integrations. Each method remains unavailable until its merchant sandbox credentials are configured. The server sends selected variants, quantities, a test amount and a transaction identifier to the chosen provider; payment details are entered on that provider’s page rather than this storefront.", "Use only test cards or sandbox accounts. Our preview verifies the provider’s transaction reference, amount, currency and status on return. It does not create a retail order, store payment-card details or arrange fulfilment. The provider’s own privacy terms also apply to information you enter there."],
        zh: ["Stripe Checkout 与 PayPal 均为测试接入，各支付方式只有配置商户测试凭据后才可用。服务器向所选平台发送商品规格、数量、测试金额及交易标识；支付信息在该平台页面填写，不在本站填写。", "请仅使用测试卡或沙盒账户。支付回跳后，本站会核验平台返回的交易编号、金额、币种和状态，不会创建正式零售订单、保存银行卡信息或安排发货。在支付平台填写的信息也受该平台自身隐私条款约束。"],
      }, links: [
        { href: "https://stripe.com/privacy", label: { en: "Stripe privacy policy", zh: "Stripe 隐私政策" } },
        { href: "https://www.paypal.com/nz/legalhub/paypal/privacy-full", label: { en: "PayPal privacy statement", zh: "PayPal 隐私声明" } },
      ],
    },
    {
      id: "rights", heading: { en: "Access, correction and concerns", zh: "访问、更正及相关问题" },
      paragraphs: {
        en: ["You may ask to access or correct information held about you and request deletion of your inquiry. Use the contact page’s Privacy request topic and include your enquiry reference and contact email. The owner may need to verify that the request concerns your own information before responding.", "For an unresolved privacy concern, New Zealand’s Office of the Privacy Commissioner explains your rights and its complaint process. Raise the concern with the brand first. This notice will be updated when the service or its approved operating details change."],
        zh: ["您可以申请访问或更正与您有关的信息，也可以请求删除咨询记录。请在联系页选择“隐私请求”，并附上咨询编号及联系邮箱。回复前，品牌方可能需要核实该请求确实涉及您本人的信息。", "如隐私问题未解决，新西兰隐私专员办公室提供权利说明及投诉流程。请先向品牌方提出相关问题。服务或经确认的经营资料变更时，本说明也会更新。"],
      }, links: [{ href: "https://www.privacy.org.nz/your-rights/your-privacy-rights/", label: { en: "Your privacy rights in New Zealand", zh: "新西兰隐私权利说明" } }], contactTopic: "privacy",
    },
  ],
} as const satisfies Policy;
