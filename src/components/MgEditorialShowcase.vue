<script setup>
const asset = (path) =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const section = {
  index: "",
  title: "Electric vehicles crafted\nfor the next generation.",
  model: "MG S5 EV",
  category: "Electric Urban Crossover",
  specs: [
    "Up to 520 km estimated range",
    "Rapid charging capability",
    "Responsive electric performance",
    "Advanced driver-focused cabin",
    "Smart connected technology",
  ],
  cta: "Explore Details",
};

const heroImage = asset(
  "images/Generated Image August 24, 2026 - 1_51PM.jpg"
);

/*
  KEEPING THE THREE UPPER DETAIL CARDS ONLY:
  - Charge Ready
  - Wheel Design
  - Signature Lighting

  The circled lower section has been completely removed.
*/
const detailCards = [
  {
    id: "charge-ready",
    label: "Charge Ready",
    image: asset(
      "images/Generated Image August 24, 2026 - 2_11PM.jpg"
    ),
    alt: "Electric vehicle charging detail",
    className: "mg-editorial__detail--charge",
  },
  {
    id: "wheel-design",
    label: "Wheel Design",
    image: asset(
      "images/Generated Image August 24, 2026 - 2_15PM.jpg"
    ),
    alt: "Premium vehicle driving detail",
    className: "mg-editorial__detail--wheel",
  },
  {
    id: "signature-lighting",
    label: "Signature Lighting",
    image: asset(
      "images/Generated Image August 24, 2026 - 1_58PM.jpg"
    ),
    alt: "MG signature headlight detail",
    className: "mg-editorial__detail--lighting",
  },
];
</script>

<template>
  <section class="mg-editorial">
    <div class="mg-editorial__container">
      <!-- =================================================
           TOP HEADER
      ================================================== -->
      <div class="mg-editorial__top">
        <span class="mg-editorial__index">
          {{ section.index }}
        </span>

        <h2 class="mg-editorial__title">
          {{ section.title }}
        </h2>
      </div>

      <!-- =================================================
           MAIN GRID
           Everything below this grid was removed:
           - wide story image
           - MG Design Story text
           - ONE heading
           - Craftsmanship card
           - Interior card
      ================================================== -->
      <div class="mg-editorial__grid">
        <!-- LEFT SPECS -->
        <aside class="mg-editorial__specs">
          <div class="mg-editorial__specs-inner">
            <div>
              <h3>
                {{ section.model }}
              </h3>

              <p class="mg-editorial__specs-category">
                {{ section.category }}
              </p>

              <ul class="mg-editorial__spec-list">
                <li
                  v-for="item in section.specs"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>

            <a
              href="#mg-range"
              class="mg-editorial__cta"
            >
              <span>
                {{ section.cta }}
              </span>

              <span class="mg-editorial__cta-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M14 7l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </aside>

        <!-- HERO -->
        <article class="mg-editorial__hero">
          <img
            :src="heroImage"
            alt="MG electric vehicle hero"
            loading="lazy"
            decoding="async"
          />

          <div class="mg-editorial__hero-overlay"></div>

          <div class="mg-editorial__hero-note">
            <span>
              MG ELECTRIC DESIGN
            </span>

            <strong>
              Crafted for modern mobility
            </strong>
          </div>
        </article>

        <!-- THREE DETAIL CARDS -->
        <article
          v-for="card in detailCards"
          :key="card.id"
          class="mg-editorial__detail"
          :class="card.className"
        >
          <div class="mg-editorial__detail-image">
            <img
              :src="card.image"
              :alt="card.alt"
              loading="lazy"
              decoding="async"
            />
          </div>

          <span class="mg-editorial__detail-label">
            {{ card.label }}
          </span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url(
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
);

/* =========================================================
   SECTION
========================================================= */

.mg-editorial {
  --bg: #f5f5f3;
  --card: #ffffff;
  --text: #131313;
  --muted: #6a6a6a;
  --line: rgba(0, 0, 0, 0.08);
  --red: #e51920;

  width: 100%;

  overflow: hidden;

  padding:
    clamp(72px, 6vw, 110px)
    0;

  background:
    var(--bg);

  color:
    var(--text);

  font-family:
    "Manrope",
    sans-serif;
}

/* =========================================================
   CONTAINER
========================================================= */

.mg-editorial__container {
  width:
    min(
      92%,
      1540px
    );

  margin:
    0
    auto;
}

/* =========================================================
   TOP
========================================================= */

.mg-editorial__top {
  position: relative;

  min-height:
    clamp(
      54px,
      5vw,
      76px
    );

  margin-bottom:
    clamp(
      34px,
      3.2vw,
      52px
    );
}

.mg-editorial__index {
  position: absolute;

  left: 0;
  top: 0;

  color:
    #6e6e6e;

  font-size:
    .75vw;

  font-weight:
    600;

  letter-spacing:
    -.02em;
}

.mg-editorial__title {
  margin: 0;

  text-align: center;

  white-space: pre-line;

  font-size:
    2.6vw;

  line-height:
    1.02;

  letter-spacing:
    -.06em;

  font-weight:
    650;
}

/* =========================================================
   GRID
========================================================= */

.mg-editorial__grid {
  display: grid;

  grid-template-columns:
    1.1fr
    1fr
    1fr
    1fr
    1.15fr;

  grid-template-areas:
    "spec hero hero hero hero"
    "spec charge wheel lighting lighting";

  gap:
    clamp(
      14px,
      1.15vw,
      20px
    );

  align-items: start;
}

/* =========================================================
   LEFT SPECS
========================================================= */

.mg-editorial__specs {
  grid-area: spec;

  min-height: 100%;
}

.mg-editorial__specs-inner {
  height: 100%;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  padding:
    clamp(
      8px,
      .7vw,
      12px
    )
    0;
}

.mg-editorial__specs h3 {
  margin: 0;

  font-size:
    1.65vw;

  line-height:
    1;

  letter-spacing:
    -.05em;

  font-weight:
    700;
}

.mg-editorial__specs-category {
  margin:
    10px
    0
    24px;

  color:
    var(--muted);

  font-size:
    .7vw;

  font-weight:
    600;

  letter-spacing:
    .02em;

  text-transform:
    uppercase;
}

.mg-editorial__spec-list {
  display: grid;

  gap: 14px;

  margin: 0;

  padding: 0;

  list-style: none;
}

.mg-editorial__spec-list li {
  padding-bottom: 12px;

  border-bottom:
    1px
    solid
    var(--line);

  color:
    #4f4f4f;

  font-size:
    .8vw;

  line-height:
    1.5;
}

/* =========================================================
   CTA
========================================================= */

.mg-editorial__cta {
  width:
    fit-content;

  display:
    inline-flex;

  align-items:
    center;

  gap:
    12px;

  margin-top:
    28px;

  color:
    var(--text);

  text-decoration:
    none;

  font-size:
    .78vw;

  font-weight:
    600;
}

.mg-editorial__cta-icon {
  width:
    34px;

  height:
    34px;

  display:
    grid;

  place-items:
    center;

  border:
    1px
    solid
    var(--line);

  border-radius:
    999px;

  transition:
    background
    .3s
    ease,
    border-color
    .3s
    ease,
    color
    .3s
    ease,
    transform
    .3s
    ease;
}

.mg-editorial__cta:hover
.mg-editorial__cta-icon {
  border-color:
    var(--red);

  background:
    var(--red);

  color:
    #fff;

  transform:
    translateX(
      3px
    );
}

.mg-editorial__cta-icon svg {
  width:
    14px;
}

/* =========================================================
   HERO
========================================================= */

.mg-editorial__hero {
  position: relative;

  grid-area: hero;

  overflow: hidden;

  aspect-ratio:
    2.4
    /
    1;

  background:
    var(--card);
}

.mg-editorial__hero img {
  width:
    100%;

  height:
    100%;

  display:
    block;

  object-fit:
    cover;

  object-position:
    center;

  transition:
    transform
    1s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    );
}

.mg-editorial__hero:hover
img {
  transform:
    scale(
      1.03
    );
}

.mg-editorial__hero-overlay {
  position: absolute;

  inset: 0;

  pointer-events:
    none;

  background:
    linear-gradient(
      180deg,
      rgba(
        0,
        0,
        0,
        .02
      ),
      rgba(
        0,
        0,
        0,
        .12
      )
    );
}

.mg-editorial__hero-note {
  position: absolute;

  right:
    18px;

  bottom:
    18px;

  max-width:
    250px;

  display:
    flex;

  flex-direction:
    column;

  gap:
    4px;

  padding:
    12px
    14px;

  background:
    rgba(
      255,
      255,
      255,
      .88
    );

  backdrop-filter:
    blur(
      8px
    );

  -webkit-backdrop-filter:
    blur(
      8px
    );
}

.mg-editorial__hero-note span {
  color:
    #707070;

  font-size:
    .625vw;

  font-weight:
    700;

  letter-spacing:
    .08em;

  text-transform:
    uppercase;
}

.mg-editorial__hero-note strong {
  font-size:
    .8vw;

  line-height:
    1.35;

  letter-spacing:
    -.02em;

  font-weight:
    600;
}

/* =========================================================
   DETAIL CARDS
========================================================= */

.mg-editorial__detail {
  display:
    flex;

  flex-direction:
    column;

  gap:
    8px;

  min-width:
    0;
}

.mg-editorial__detail--charge {
  grid-area:
    charge;
}

.mg-editorial__detail--wheel {
  grid-area:
    wheel;
}

.mg-editorial__detail--lighting {
  grid-area:
    lighting;
}

.mg-editorial__detail-image {
  overflow:
    hidden;

  background:
    var(--card);
}

.mg-editorial__detail--charge
.mg-editorial__detail-image,
.mg-editorial__detail--wheel
.mg-editorial__detail-image {
  aspect-ratio:
    1.22
    /
    1;
}

.mg-editorial__detail--lighting
.mg-editorial__detail-image {
  aspect-ratio:
    1.9
    /
    1.42;
}

.mg-editorial__detail-image img {
  width:
    100%;

  height:
    100%;

  display:
    block;

  object-fit:
    cover;

  transition:
    transform
    .9s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    );
}

.mg-editorial__detail:hover
.mg-editorial__detail-image
img {
  transform:
    scale(
      1.04
    );
}

.mg-editorial__detail-label {
  color:
    #4f4f4f;

  font-size:
    .66vw;

  font-weight:
    600;
}

/* =========================================================
   LARGE DESKTOP
========================================================= */

@media (min-width: 1800px) {
  .mg-editorial__container {
    width:
      92vw;

    max-width:
      none;
  }

  .mg-editorial__title {
    font-size:
      2.5vw;
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {
  .mg-editorial__title {
    font-size:
      clamp(
        32px,
        4vw,
        44px
      );
  }

  .mg-editorial__grid {
    grid-template-columns:
      1fr
      1fr;

    grid-template-areas:
      "hero hero"
      "spec spec"
      "charge wheel"
      "lighting lighting";
  }

  .mg-editorial__specs-inner {
    padding:
      0;
  }

  .mg-editorial__spec-list {
    grid-template-columns:
      1fr
      1fr;

    gap:
      12px
      24px;
  }

  .mg-editorial__specs h3 {
    font-size:
      24px;
  }

  .mg-editorial__specs-category,
  .mg-editorial__spec-list li,
  .mg-editorial__cta {
    font-size:
      10px;
  }

  .mg-editorial__hero {
    aspect-ratio:
      1.8
      /
      1;
  }

  .mg-editorial__hero-note span {
    font-size:
      7px;
  }

  .mg-editorial__hero-note strong {
    font-size:
      10px;
  }

  .mg-editorial__detail-label {
    font-size:
      9px;
  }

  .mg-editorial__detail--lighting
  .mg-editorial__detail-image {
    aspect-ratio:
      1.8
      /
      1;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .mg-editorial {
    padding:
      58px
      0
      68px;
  }

  .mg-editorial__container {
    width:
      calc(
        100% - 30px
      );
  }

  .mg-editorial__top {
    min-height:
      auto;

    margin-bottom:
      28px;
  }

  .mg-editorial__index {
    position:
      static;

    display:
      block;

    margin-bottom:
      12px;

    font-size:
      10px;
  }

  .mg-editorial__title {
    text-align:
      left;

    font-size:
      30px;
  }

  .mg-editorial__grid {
    grid-template-columns:
      1fr;

    grid-template-areas:
      "hero"
      "spec"
      "charge"
      "wheel"
      "lighting";

    gap:
      14px;
  }

  .mg-editorial__hero {
    aspect-ratio:
      1.25
      /
      1;
  }

  .mg-editorial__hero-note {
    left:
      12px;

    right:
      12px;

    bottom:
      12px;

    max-width:
      none;
  }

  .mg-editorial__spec-list {
    grid-template-columns:
      1fr;
  }

  .mg-editorial__detail-image,
  .mg-editorial__detail--lighting
  .mg-editorial__detail-image {
    aspect-ratio:
      1.35
      /
      1;
  }

  .mg-editorial__detail-label {
    font-size:
      10px;
  }
}
</style>
