export const productCategories = [
  {
    id: "rings",
    name: "Rings",
    description:
      "Solitaire settings, sculptural bands, and ceremony pieces made for daily wear.",
    href: "/products#rings",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    description:
      "Pearls, chains, pendants, and lariats balanced for layering or statement styling.",
    href: "/products#necklaces",
  },
  {
    id: "earrings",
    name: "Earrings",
    description:
      "Gold hoops, diamond studs, and pearl drops designed for polished movement.",
    href: "/products#earrings",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    description:
      "Fluid tennis lines, slim bangles, and cuffs finished with secure closures.",
    href: "/products#bracelets",
  },
  {
    id: "bespoke",
    name: "Bespoke",
    description:
      "Private commissions, remounts, bridal sets, and personal pieces made by appointment.",
    href: "/products#bespoke",
  },
] as const;

export type ProductCategoryId = (typeof productCategories)[number]["id"];
export type ProductCategory = (typeof productCategories)[number];

export type ProductImage = {
  readonly src: string;
  readonly alt: string;
  readonly objectPosition: string;
};

export type Product = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: ProductCategoryId;
  readonly price: number | null;
  readonly shortDescription: string;
  readonly description: string;
  readonly image: ProductImage;
  readonly badge?: string;
  readonly rating: number;
  readonly materials: readonly string[];
  readonly details: readonly string[];
  readonly care: string;
  readonly featured?: boolean;
  readonly tags: readonly string[];
};

const sharedCollectionImage = "/jewelry-hero.png";

const productList = [
  {
    id: "solenne-diamond-ring",
    slug: "solenne-diamond-ring",
    name: "Solenne Diamond Ring",
    category: "rings",
    price: 2950,
    shortDescription:
      "A brilliant solitaire in recycled 18k gold with a low-profile cathedral setting.",
    description:
      "A refined solitaire ring set low against the hand for comfort, balance, and everyday brilliance. The recycled 18k gold shank is hand-finished with a softened profile.",
    image: {
      src: "/solenne-diamond-ring.jpg",
      alt: "Solitaire diamond ring in recycled gold",
      objectPosition: "50% 50%",
    },
    badge: "New",
    rating: 4.9,
    materials: ["18k recycled gold", "Conflict-free round diamond"],
    details: ["Low cathedral setting", "Comfort-fit band", "Available in sizes 4-9"],
    care: "Clean with mild soap and a soft brush, then dry with a lint-free cloth.",
    featured: true,
    tags: ["diamond", "engagement", "gold"],
  },
  {
    id: "celeste-halo-ring",
    slug: "celeste-halo-ring",
    name: "Celeste Halo Ring",
    category: "rings",
    price: 3200,
    shortDescription:
      "A halo diamond ring framed by white sapphires and a slim polished band.",
    description:
      "A luminous center stone is framed by hand-set white sapphires for a crisp halo effect. The slim profile keeps the ring elegant without feeling delicate.",
    image: {
      src: sharedCollectionImage,
      alt: "Halo diamond ring with white sapphires",
      objectPosition: "50% 82%",
    },
    rating: 4.8,
    materials: ["18k yellow gold", "Diamond", "White sapphires"],
    details: ["Halo setting", "Polished slim band", "Made for stacking"],
    care: "Store separately and avoid ultrasonic cleaners for long-term setting security.",
    tags: ["diamond", "halo", "bridal"],
  },
  {
    id: "luna-emerald-ring",
    slug: "luna-emerald-ring",
    name: "Luna Emerald Ring",
    category: "rings",
    price: 4100,
    shortDescription:
      "An emerald and diamond three-stone ring with sculptural shoulders.",
    description:
      "A vivid emerald center is balanced by two bright diamonds in a graceful three-stone silhouette. The shoulders are softly tapered for a secure, elegant fit.",
    image: {
      src: sharedCollectionImage,
      alt: "Emerald and diamond three-stone ring",
      objectPosition: "57% 80%",
    },
    rating: 4.9,
    materials: ["18k yellow gold", "Emerald", "Diamonds"],
    details: ["Three-stone setting", "Tapered shoulders", "Made to order sizing"],
    care: "Wipe with a damp soft cloth and remove before swimming or heavy work.",
    tags: ["emerald", "diamond", "statement"],
  },
  {
    id: "aurelle-band",
    slug: "aurelle-band",
    name: "Aurelle Band",
    category: "rings",
    price: 890,
    shortDescription: "A textured gold wedding band with a soft satin finish.",
    description:
      "A quietly tactile band with hand-applied texture and a soft satin finish. Its rounded interior makes it suitable for ceremony or daily stacking.",
    image: {
      src: sharedCollectionImage,
      alt: "Textured gold wedding band",
      objectPosition: "62% 84%",
    },
    rating: 4.7,
    materials: ["18k recycled gold"],
    details: ["Satin finish", "Comfort-fit interior", "2.4 mm width"],
    care: "Polish gently with a jewelry cloth and store in its pouch between wears.",
    tags: ["gold", "wedding", "stacking"],
  },
  {
    id: "lumiere-pave-band",
    slug: "lumiere-pave-band",
    name: "Lumiere Pave Band",
    category: "rings",
    price: 1840,
    shortDescription:
      "A refined pave band made for stacking, ceremony, and daily polish.",
    description:
      "A slim gold band lined with bright pave stones. It sits cleanly next to engagement rings and brings a measured flash to everyday stacks.",
    image: {
      src: sharedCollectionImage,
      alt: "Pave diamond band in gold",
      objectPosition: "54% 79%",
    },
    badge: "Best seller",
    rating: 4.9,
    materials: ["18k yellow gold", "Pave diamonds"],
    details: ["Half-eternity pave", "Low profile", "Pairs with solitaire settings"],
    care: "Avoid lotion buildup around the stones and schedule yearly setting checks.",
    featured: true,
    tags: ["diamond", "pave", "stacking"],
  },
  {
    id: "nocturne-pearl-strand",
    slug: "nocturne-pearl-strand",
    name: "Nocturne Pearl Strand",
    category: "necklaces",
    price: 1280,
    shortDescription:
      "Graduated freshwater pearls finished with a sculptural gold clasp.",
    description:
      "A modern pearl strand with gentle graduation and a sculptural clasp that can sit at the nape or side. Each pearl is selected for luster and soft shape consistency.",
    image: {
      src: sharedCollectionImage,
      alt: "Graduated freshwater pearl necklace",
      objectPosition: "60% 35%",
    },
    rating: 4.9,
    materials: ["Freshwater pearls", "18k yellow gold clasp"],
    details: ["18 inch length", "Graduated pearl sizing", "Signature clasp"],
    care: "Put pearls on last, wipe after wear, and store away from direct heat.",
    featured: true,
    tags: ["pearl", "necklace", "classic"],
  },
  {
    id: "solara-pendant",
    slug: "solara-pendant",
    name: "Solara Pendant",
    category: "necklaces",
    price: 1450,
    shortDescription:
      "A gold sunburst pendant with a single diamond at the center.",
    description:
      "A dimensional sunburst pendant with a bright center diamond and finely polished rays. It hangs from a fine chain with adjustable length.",
    image: {
      src: sharedCollectionImage,
      alt: "Gold sunburst pendant with diamond",
      objectPosition: "45% 31%",
    },
    badge: "New",
    rating: 4.8,
    materials: ["18k yellow gold", "Diamond"],
    details: ["Adjustable 16-18 inch chain", "Lobster clasp", "Polished pendant back"],
    care: "Use a soft cloth after wear and keep the chain clasped while stored.",
    tags: ["pendant", "diamond", "gold"],
  },
  {
    id: "aurelia-chain",
    slug: "aurelia-chain",
    name: "Aurelia Chain",
    category: "necklaces",
    price: 540,
    shortDescription: "A delicate figaro chain necklace in polished gold.",
    description:
      "A polished figaro chain with enough presence to wear alone and enough restraint to layer. The links catch light without overpowering other pieces.",
    image: {
      src: sharedCollectionImage,
      alt: "Delicate figaro chain necklace",
      objectPosition: "40% 44%",
    },
    rating: 4.7,
    materials: ["14k yellow gold"],
    details: ["18 inch length", "Figaro link pattern", "Spring ring clasp"],
    care: "Store flat or hanging to prevent tangles.",
    tags: ["chain", "gold", "layering"],
  },
  {
    id: "stella-lariat",
    slug: "stella-lariat",
    name: "Stella Lariat",
    category: "necklaces",
    price: 2100,
    shortDescription:
      "A diamond lariat necklace with a fluid drop and fine gold chain.",
    description:
      "A fluid lariat with a diamond-set drop that follows the neckline. The adjustable construction makes it easy to style with silk, tailoring, or bare skin.",
    image: {
      src: sharedCollectionImage,
      alt: "Diamond lariat necklace",
      objectPosition: "50% 36%",
    },
    rating: 4.8,
    materials: ["18k yellow gold", "Diamonds"],
    details: ["Adjustable drop", "Fine cable chain", "Secure slider detail"],
    care: "Close the clasp before storage and avoid pulling the slider under tension.",
    tags: ["diamond", "lariat", "evening"],
  },
  {
    id: "aurelia-gold-hoops",
    slug: "aurelia-gold-hoops",
    name: "Aurelia Gold Hoops",
    category: "earrings",
    price: 740,
    shortDescription:
      "Polished double-wall hoops shaped for weightless everyday wear.",
    description:
      "High-polish double-wall hoops with a hollow construction for comfortable all-day wear. The rounded profile reads classic from every angle.",
    image: {
      src: sharedCollectionImage,
      alt: "Polished double-wall gold hoops",
      objectPosition: "89% 38%",
    },
    badge: "Best seller",
    rating: 4.9,
    materials: ["14k yellow gold"],
    details: ["Latch back closure", "24 mm diameter", "Hollow lightweight form"],
    care: "Wipe with a dry cloth and keep closures free from lotion residue.",
    featured: true,
    tags: ["gold", "hoops", "everyday"],
  },
  {
    id: "lumina-studs",
    slug: "lumina-studs",
    name: "Lumina Studs",
    category: "earrings",
    price: 1850,
    shortDescription: "Round diamond stud earrings set in bright gold baskets.",
    description:
      "A pair of diamond studs with open basket settings that allow light through the stones. The scale is polished, balanced, and easy to wear daily.",
    image: {
      src: sharedCollectionImage,
      alt: "Round diamond stud earrings",
      objectPosition: "80% 42%",
    },
    rating: 4.9,
    materials: ["18k yellow gold", "Diamonds"],
    details: ["Basket settings", "Secure push backs", "Matched diamond pair"],
    care: "Remove before sleep and clean around the posts with a soft brush.",
    tags: ["diamond", "studs", "classic"],
  },
  {
    id: "vega-drop-earrings",
    slug: "vega-drop-earrings",
    name: "Vega Drop Earrings",
    category: "earrings",
    price: 1620,
    shortDescription:
      "Pearl and diamond drop earrings with subtle articulated movement.",
    description:
      "Pearl drops suspended beneath small diamonds for quiet movement and soft light. The scale works for ceremonies without feeling overly formal.",
    image: {
      src: sharedCollectionImage,
      alt: "Pearl and diamond drop earrings",
      objectPosition: "84% 48%",
    },
    rating: 4.8,
    materials: ["Freshwater pearls", "Diamonds", "18k yellow gold"],
    details: ["Articulated drop", "Post back closure", "Matched pearl pair"],
    care: "Keep pearls away from perfume and store in a soft pouch.",
    tags: ["pearl", "diamond", "drops"],
  },
  {
    id: "nova-huggies",
    slug: "nova-huggies",
    name: "Nova Huggies",
    category: "earrings",
    price: 520,
    shortDescription: "Textured gold huggie hoops with secure hinged closures.",
    description:
      "Compact gold huggies with a lightly textured surface that catches daylight. Their hinged closure makes them simple for everyday rotation.",
    image: {
      src: sharedCollectionImage,
      alt: "Textured gold huggie hoops",
      objectPosition: "87% 40%",
    },
    rating: 4.7,
    materials: ["14k yellow gold"],
    details: ["Hinged closure", "12 mm diameter", "Textured finish"],
    care: "Close hinges before storage and avoid bending the posts.",
    tags: ["gold", "huggies", "everyday"],
  },
  {
    id: "maris-pearl-drops",
    slug: "maris-pearl-drops",
    name: "Maris Pearl Drops",
    category: "earrings",
    price: 920,
    shortDescription:
      "Pearl drops with slim 18k gold posts and softly mirrored movement.",
    description:
      "A clean pearl drop earring with slim gold posts and just enough swing to frame the face. The pearls are selected for warm luster and smooth surfaces.",
    image: {
      src: sharedCollectionImage,
      alt: "Pearl drop earrings on gold posts",
      objectPosition: "86% 46%",
    },
    rating: 4.8,
    materials: ["Freshwater pearls", "18k yellow gold"],
    details: ["Slim post setting", "Soft drop movement", "Gift box included"],
    care: "Wipe pearls after wear and avoid sealed plastic storage.",
    featured: true,
    tags: ["pearl", "drops", "gift"],
  },
  {
    id: "celeste-tennis-bracelet",
    slug: "celeste-tennis-bracelet",
    name: "Celeste Tennis Bracelet",
    category: "bracelets",
    price: 3600,
    shortDescription:
      "Hand-set white sapphires in a fluid line of warm 18k gold.",
    description:
      "A flexible line bracelet with hand-set white sapphires and a low-profile clasp. It layers cleanly with watches or stands alone with quiet brilliance.",
    image: {
      src: sharedCollectionImage,
      alt: "White sapphire tennis bracelet",
      objectPosition: "74% 91%",
    },
    rating: 4.9,
    materials: ["18k yellow gold", "White sapphires"],
    details: ["Box clasp with safety", "7 inch length", "Hand-set stones"],
    care: "Check clasp tension periodically and store flat in its case.",
    featured: true,
    tags: ["sapphire", "tennis", "bracelet"],
  },
  {
    id: "lyra-bangle",
    slug: "lyra-bangle",
    name: "Lyra Bangle",
    category: "bracelets",
    price: 1290,
    shortDescription:
      "A thin gold bangle with a single diamond accent and oval profile.",
    description:
      "A slim oval bangle designed to sit close to the wrist. A single diamond accent gives the polished gold line a restrained point of light.",
    image: {
      src: sharedCollectionImage,
      alt: "Thin gold bangle with diamond accent",
      objectPosition: "70% 88%",
    },
    rating: 4.8,
    materials: ["18k yellow gold", "Diamond"],
    details: ["Oval profile", "Hidden hinge", "Single diamond accent"],
    care: "Avoid stacking with abrasive stones to preserve the polished finish.",
    tags: ["gold", "bangle", "diamond"],
  },
  {
    id: "orion-chain-bracelet",
    slug: "orion-chain-bracelet",
    name: "Orion Chain Bracelet",
    category: "bracelets",
    price: 450,
    shortDescription: "A gold chain bracelet with a small polished charm.",
    description:
      "A bright gold chain bracelet with a small charm that rests lightly at the wrist. It is easy to layer and simple enough for everyday wear.",
    image: {
      src: sharedCollectionImage,
      alt: "Gold chain bracelet with charm",
      objectPosition: "66% 91%",
    },
    rating: 4.7,
    materials: ["14k yellow gold"],
    details: ["Adjustable 6.5-7.5 inch length", "Polished charm", "Lobster clasp"],
    care: "Keep clasped when stored to reduce tangling.",
    tags: ["gold", "chain", "layering"],
  },
  {
    id: "selene-cuff",
    slug: "selene-cuff",
    name: "Selene Cuff",
    category: "bracelets",
    price: 980,
    shortDescription: "An open cuff with a moonstone cabochon and satin gold edge.",
    description:
      "An open gold cuff with a glowing moonstone cabochon and soft satin edges. The silhouette is minimal, but the stone gives it a distinctive finish.",
    image: {
      src: sharedCollectionImage,
      alt: "Open cuff with moonstone",
      objectPosition: "72% 86%",
    },
    rating: 4.8,
    materials: ["14k yellow gold", "Moonstone"],
    details: ["Open cuff form", "Satin edge finish", "Cabochon moonstone"],
    care: "Do not bend repeatedly; slide on from the side of the wrist.",
    tags: ["moonstone", "cuff", "statement"],
  },
  {
    id: "custom-engagement-ring",
    slug: "custom-engagement-ring",
    name: "Custom Engagement Ring",
    category: "bespoke",
    price: null,
    shortDescription:
      "A private design process for a custom engagement ring and stone selection.",
    description:
      "A guided engagement ring commission that covers stone sourcing, setting design, model review, and final hand finishing with the atelier team.",
    image: {
      src: sharedCollectionImage,
      alt: "Custom designed engagement ring",
      objectPosition: "54% 78%",
    },
    badge: "By appointment",
    rating: 5,
    materials: ["Gold or platinum", "Stone options selected by brief"],
    details: ["Private design consult", "Stone sourcing", "Digital model review"],
    care: "Care guidance is provided with the final piece based on the selected stones.",
    tags: ["custom", "engagement", "bridal"],
  },
  {
    id: "wedding-set",
    slug: "wedding-set",
    name: "Wedding Set",
    category: "bespoke",
    price: null,
    shortDescription:
      "Matching bridal bands shaped around an existing engagement ring.",
    description:
      "A made-to-measure wedding set designed for visual balance, long-term comfort, and secure stacking beside an engagement ring.",
    image: {
      src: sharedCollectionImage,
      alt: "Matching bridal wedding set",
      objectPosition: "58% 82%",
    },
    rating: 5,
    materials: ["Gold or platinum", "Optional diamonds"],
    details: ["Ring contour review", "Matched finish options", "Sizing confirmation"],
    care: "Annual polishing and fit checks are recommended for bridal sets.",
    tags: ["custom", "wedding", "bands"],
  },
  {
    id: "heritage-remount",
    slug: "heritage-remount",
    name: "Heritage Remount",
    category: "bespoke",
    price: null,
    shortDescription:
      "A family heirloom remounting service for stones with personal history.",
    description:
      "A careful remounting process that preserves meaningful stones while rebuilding their setting for modern wear and proportion.",
    image: {
      src: sharedCollectionImage,
      alt: "Family heirloom remounting",
      objectPosition: "52% 76%",
    },
    rating: 5,
    materials: ["Existing stones", "New gold or platinum setting"],
    details: ["Stone condition review", "Setting redesign", "Final fit inspection"],
    care: "A custom care plan is supplied after stone inspection.",
    tags: ["custom", "heirloom", "remount"],
  },
  {
    id: "signature-pendant",
    slug: "signature-pendant",
    name: "Signature Pendant",
    category: "bespoke",
    price: null,
    shortDescription:
      "A custom engraved pendant designed around initials, dates, or symbols.",
    description:
      "A personal pendant commission with engraving, stone accents, and chain proportions selected around the story behind the piece.",
    image: {
      src: sharedCollectionImage,
      alt: "Custom engraved pendant",
      objectPosition: "46% 34%",
    },
    rating: 5,
    materials: ["Gold or platinum", "Optional stone accents"],
    details: ["Engraving proof", "Chain length selection", "Gift packaging"],
    care: "Keep engraved surfaces free from abrasive polishing compounds.",
    tags: ["custom", "pendant", "engraving"],
  },
] as const satisfies readonly Product[];

export type ProductId = (typeof productList)[number]["id"];
export type ProductSlug = (typeof productList)[number]["slug"];
export type CatalogProduct = Product & {
  readonly id: ProductId;
  readonly slug: ProductSlug;
};

export const products: readonly CatalogProduct[] = productList;
export const productIds = products.map((product) => product.id) as ProductId[];

export const featuredProducts = products.filter((product) => product.featured);

const productsBySlug = new Map<string, CatalogProduct>(
  products.map((product) => [product.slug, product]),
);

const productsById = new Map<string, CatalogProduct>(
  products.map((product) => [product.id, product]),
);

export function formatPrice(price: Product["price"]) {
  if (price === null) {
    return "Inquire";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getCategoryById(categoryId: ProductCategoryId) {
  return productCategories.find((category) => category.id === categoryId);
}

export function getCategoryName(categoryId: ProductCategoryId) {
  return getCategoryById(categoryId)?.name ?? "Jewelry";
}

export function getProductById(productId: string) {
  return productsById.get(productId);
}

export function getProductBySlug(slug: string) {
  return productsBySlug.get(slug);
}

export function getRequiredProductBySlug(slug: string) {
  const product = getProductBySlug(slug);

  if (!product) {
    throw new Error(`Product not found: ${slug}`);
  }

  return product;
}

export function getProductHref(product: Pick<Product, "slug">) {
  return `/products/${product.slug}`;
}

export function getProductsByCategory(categoryId: ProductCategoryId) {
  return products.filter((product) => product.category === categoryId);
}

export function getRelatedProducts(product: CatalogProduct, limit = 3) {
  return products
    .filter(
      (candidate) =>
        candidate.category === product.category && candidate.id !== product.id,
    )
    .slice(0, limit);
}

export function isProductId(value: string): value is ProductId {
  return productIds.includes(value as ProductId);
}
