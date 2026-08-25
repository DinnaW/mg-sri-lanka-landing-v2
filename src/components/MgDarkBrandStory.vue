<script setup>
const asset = (path) =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const backgroundImage = asset(
  "images/ChatGPT Image Aug 23, 2026, 05_44_38 PM.png"
);
</script>

<template>
  <section class="mg-night-drive">
    <div
      class="mg-night-drive__noise"
      aria-hidden="true"
    ></div>

    <div class="mg-night-drive__visual">
      <img
        class="mg-night-drive__image"
        :src="backgroundImage"
        alt="MG vehicle on a dramatic mountain road"
        loading="lazy"
        decoding="async"
      />

      <!-- Local contrast only where text needs it -->
      <div
        class="mg-night-drive__shade"
        aria-hidden="true"
      ></div>

      <div
        class="mg-night-drive__vignette"
        aria-hidden="true"
      ></div>

      <div
        class="mg-night-drive__light"
        aria-hidden="true"
      ></div>

      <!-- ===================================================
           MAIN HEADING + DESCRIPTION
      ==================================================== -->
      <header class="mg-night-drive__header">
        <div class="mg-night-drive__heading">
          <h2>
            Made to move you.
          </h2>
        </div>

        <div class="mg-night-drive__header-copy">
          <p>
            From the first MG in 1924 to a new generation
            of electrified vehicles, every chapter has been
            shaped around one idea — make the drive feel memorable.
          </p>
        </div>
      </header>

      <!-- ===================================================
           HERITAGE STAT
      ==================================================== -->
      <div class="mg-night-drive__metric">
        <strong>
          100+
        </strong>

        <span>
          Years of MG
        </span>

        <i></i>
      </div>

      <!-- ===================================================
           IMAGE FOOTER DETAILS
           This is now the natural clean ending.
      ==================================================== -->
      <div class="mg-night-drive__image-footer">
        <div>
          <span>DESIGN</span>
          <strong>Expressive</strong>
        </div>

        <div>
          <span>PERFORMANCE</span>
          <strong>Responsive</strong>
        </div>

        <div>
          <span>TECHNOLOGY</span>
          <strong>Intuitive</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url(
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"
);

/* =========================================================
   ROOT
========================================================= */

.mg-night-drive {
  --red: #e51920;

  position: relative;

  width: 100%;
  height: 100vh;
  min-height: 100vh;

  overflow: hidden;

  isolation: isolate;

  background: #0b0b0b;

  color: #fff;

  font-family:
    "Manrope",
    sans-serif;
}

/* =========================================================
   NOISE
========================================================= */

.mg-night-drive__noise {
  position: absolute;

  inset: 0;

  z-index: 20;

  pointer-events: none;

  opacity: .012;

  background-image:
    url(
      "data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E"
    );
}

/* =========================================================
   FULL IMAGE
========================================================= */

.mg-night-drive__visual {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  isolation: isolate;

  background: #101010;
}

/* =========================================================
   IMAGE
   Kept brighter than the previous version.
========================================================= */

.mg-night-drive__image {
  position: absolute;

  inset: 0;

  z-index: 0;

  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  object-position:
    center
    49%;

  filter:
    saturate(.98)
    brightness(.93)
    contrast(1.035);

  transform:
    scale(1.01);

  transition:
    transform
    2.2s
    cubic-bezier(.16, 1, .3, 1),
    filter
    .9s
    ease;
}

.mg-night-drive__visual:hover
.mg-night-drive__image {
  transform:
    scale(1.022);

  filter:
    saturate(1.02)
    brightness(.96)
    contrast(1.025);
}

/* =========================================================
   LOCALISED TEXT CONTRAST
   No heavy full-screen black overlay.
========================================================= */

.mg-night-drive__shade {
  position: absolute;

  inset: 0;

  z-index: 1;

  pointer-events: none;

  background:
    radial-gradient(
      ellipse at 14% 9%,
      rgba(0, 0, 0, .42) 0%,
      rgba(0, 0, 0, .18) 27%,
      transparent 58%
    ),
    radial-gradient(
      ellipse at 86% 9%,
      rgba(0, 0, 0, .33) 0%,
      rgba(0, 0, 0, .13) 30%,
      transparent 58%
    ),
    radial-gradient(
      ellipse at 88% 47%,
      rgba(0, 0, 0, .28) 0%,
      rgba(0, 0, 0, .1) 35%,
      transparent 64%
    ),
    linear-gradient(
      180deg,
      rgba(0, 0, 0, .08) 0%,
      transparent 36%,
      transparent 76%,
      rgba(0, 0, 0, .18) 100%
    );
}

/* =========================================================
   LIGHT VIGNETTE
========================================================= */

.mg-night-drive__vignette {
  position: absolute;

  inset: 0;

  z-index: 2;

  pointer-events: none;

  box-shadow:
    inset
    0
    0
    5vw
    rgba(0, 0, 0, .11);
}

/* =========================================================
   WARM LIGHT BLOOM
========================================================= */

.mg-night-drive__light {
  position: absolute;

  left: -9vw;
  top: 16%;

  z-index: 2;

  width: 43vw;
  height: 31vw;

  border-radius: 50%;

  opacity: .14;

  filter:
    blur(5vw);

  background:
    radial-gradient(
      circle,
      rgba(255, 243, 213, .42),
      transparent 68%
    );

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.mg-night-drive__header {
  position: absolute;

  left: 4.5vw;
  right: 4.5vw;
  top: clamp(28px, 2.4vw, 46px);

  z-index: 8;

  display: grid;

  grid-template-columns:
    minmax(0, 1.3fr)
    minmax(0, .7fr);

  gap: 8vw;

  align-items: start;
}

/* =========================================================
   HEADING
========================================================= */

.mg-night-drive__heading h2 {
  margin: 0;

  color: #fff;

  font-size: clamp(36px, 2.55vw, 49px);

  font-weight: 550;

  line-height: .98;

  letter-spacing: -.06em;

  text-shadow:
    0
    .12vw
    .35vw
    rgba(0, 0, 0, .42),
    0
    .7vw
    1.7vw
    rgba(0, 0, 0, .22);
}

/* =========================================================
   DESCRIPTION
========================================================= */

.mg-night-drive__header-copy {
  justify-self: end;

  width: 26vw;

  padding-top: .35vw;
}

.mg-night-drive__header-copy p {
  margin: 0;

  color:
    rgba(255, 255, 255, .94);

  font-size: clamp(13px, 0.82vw, 16px);

  font-weight: 500;

  line-height: 1.68;

  text-shadow:
    0
    .1vw
    .28vw
    rgba(0, 0, 0, .5),
    0
    .45vw
    1.2vw
    rgba(0, 0, 0, .24);
}

/* =========================================================
   HERITAGE METRIC
========================================================= */

.mg-night-drive__metric {
  position: absolute;

  right: 4.7vw;
  top: 47%;

  z-index: 8;

  width: 14vw;

  transform:
    translateY(-50%);
}

.mg-night-drive__metric strong {
  display: block;

  color: var(--red);

  font-family:
    "Barlow Condensed",
    sans-serif;

  font-size: 5.25vw;

  font-weight: 500;

  line-height: .78;

  letter-spacing: -.05em;

  text-shadow:
    0
    .3vw
    1vw
    rgba(0, 0, 0, .2);
}

.mg-night-drive__metric span {
  display: block;

  margin-top: 1vw;

  color:
    rgba(255, 255, 255, .97);

  font-size: clamp(16px, 1vw, 20px);

  font-weight: 600;

  text-shadow:
    0
    .1vw
    .3vw
    rgba(0, 0, 0, .5);
}

.mg-night-drive__metric i {
  display: block;

  width: 100%;
  height: 1px;

  margin-top: 1.05vw;

  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, .72),
      rgba(255, 255, 255, .08)
    );
}

/* =========================================================
   IMAGE FOOTER
   Clean final detail strip; no MG Spirit panel.
========================================================= */

.mg-night-drive__image-footer {
  position: absolute;

  right: 4.5vw;
  bottom: 2.5vw;

  z-index: 8;

  display: flex;

  gap: 3vw;

  padding:
    .85vw
    1vw;

  border-top:
    1px solid
    rgba(255, 255, 255, .2);

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(0, 0, 0, .12) 20%,
      rgba(0, 0, 0, .12) 100%
    );

  backdrop-filter:
    blur(2px);

  -webkit-backdrop-filter:
    blur(2px);
}

.mg-night-drive__image-footer div {
  min-width: clamp(110px, 8vw, 150px);
}

.mg-night-drive__image-footer span {
  display: block;

  margin-bottom: clamp(5px, 0.35vw, 8px);

  color:
    rgba(255, 255, 255, .7);

  font-size: clamp(12px, 0.72vw, 15px);

  font-weight: 700;

  letter-spacing: .15em;
}

.mg-night-drive__image-footer strong {
  color:
    rgba(255, 255, 255, .97);

  font-size: clamp(16px, 1vw, 20px);

  font-weight: 500;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {
  .mg-night-drive__header {
    top: 5vw;

    grid-template-columns:
      1.2fr
      .8fr;

    gap: 5vw;
  }

  .mg-night-drive__heading h2 {
    font-size: clamp(34px, 4.1vw, 44px);
  }

  .mg-night-drive__header-copy {
    width: 31vw;
  }

  .mg-night-drive__header-copy p {
    font-size: clamp(12px, 1.25vw, 14px);
  }

  .mg-night-drive__metric {
    width: 16vw;
  }

  .mg-night-drive__metric strong {
    font-size: 6.8vw;
  }

  .mg-night-drive__metric span {
    font-size: .98vw;
  }

  .mg-night-drive__image-footer {
    bottom: 3vw;
  }

  .mg-night-drive__image-footer span {
    font-size: .52vw;
  }

  .mg-night-drive__image-footer strong {
    font-size: .78vw;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .mg-night-drive {
    height: 100svh;
    min-height: 100svh;
  }

  .mg-night-drive__image {
    object-position:
      62%
      center;

    filter:
      saturate(.98)
      brightness(.91)
      contrast(1.025);
  }

  .mg-night-drive__shade {
    background:
      radial-gradient(
        ellipse at 19% 9%,
        rgba(0, 0, 0, .44) 0%,
        rgba(0, 0, 0, .2) 31%,
        transparent 63%
      ),
      radial-gradient(
        ellipse at 88% 45%,
        rgba(0, 0, 0, .31) 0%,
        rgba(0, 0, 0, .12) 33%,
        transparent 67%
      ),
      linear-gradient(
        180deg,
        rgba(0, 0, 0, .07),
        transparent 68%,
        rgba(0, 0, 0, .16)
      );
  }

  .mg-night-drive__header {
    left: 15px;
    right: 15px;
    top: 3.5vh;

    display: block;
  }

  .mg-night-drive__heading h2 {
    font-size:
      clamp(
        36px,
        9vw,
        52px
      );
  }

  .mg-night-drive__header-copy {
    width: min(82vw, 470px);

    margin-top: 14px;
  }

  .mg-night-drive__header-copy p {
    font-size:
      clamp(
        10px,
        2.35vw,
        13px
      );

    line-height: 1.58;
  }

  .mg-night-drive__metric {
    right: 18px;
    top: 45%;

    width: 120px;
  }

  .mg-night-drive__metric strong {
    font-size: 64px;
  }

  .mg-night-drive__metric span {
    margin-top: 8px;

    font-size: 10px;
  }

  .mg-night-drive__metric i {
    margin-top: 10px;
  }

  /* Keep mobile visually clean */
  .mg-night-drive__image-footer {
    display: none;
  }
}

/* =========================================================
   VERY SHORT MOBILE
========================================================= */

@media (
  max-width: 767px
) and (
  max-height: 700px
) {
  .mg-night-drive__header {
    top: 4.5vh;
  }

  .mg-night-drive__header-copy {
    margin-top: 10px;
  }

  .mg-night-drive__metric {
    top: 43%;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-night-drive *,
  .mg-night-drive *::before,
  .mg-night-drive *::after {
    animation-duration:
      .01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      .01ms !important;
  }
}
</style>
