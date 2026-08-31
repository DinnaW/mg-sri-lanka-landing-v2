<script setup>
const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const bannerImage = asset("images/Folder 1 (14) 2.png");
</script>

<template>
  <section class="mg-cinematic-banner">

    <!-- =====================================================
         FULL BACKGROUND IMAGE
    ====================================================== -->

    <img
      class="mg-cinematic-banner__image"
      :src="bannerImage"
      alt="MG vehicle overlooking a dramatic mountain road"
      loading="lazy"
      decoding="async"
    />

    <!-- Dark overlay ONLY on the image area below the top white band -->
    <div
      class="mg-cinematic-banner__image-overlay"
      aria-hidden="true"
    ></div>


    <!-- =====================================================
         IMAGE TREATMENT
    ====================================================== -->



    <!-- =====================================================
         CONTENT
    ====================================================== -->

    <div class="mg-cinematic-banner__container">

      <!-- TOP -->

    

      <!-- ===================================================
           MAIN COPY
      ==================================================== -->

      <div class="mg-cinematic-banner__content">

        <span class="mg-cinematic-banner__kicker">
          MADE FOR THE ROAD AHEAD
        </span>


        <h2>
          Built for wherever
          <br />
          the journey takes you.
        </h2>


        <p>
          Confident design, capable performance and the freedom
          to explore beyond the everyday. Discover a different
          side of MG.
        </p>


        <div class="mg-cinematic-banner__actions">

          <a
            href="#"
            class="mg-cinematic-banner__button"
          >

            <span>
              Explore MG
            </span>


            <span class="mg-cinematic-banner__button-arrow">

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


          <a
            href="#"
            class="mg-cinematic-banner__secondary"
          >

            <span>
              Discover the Range
            </span>

            <span>
              ↗
            </span>

          </a>

        </div>

      </div>



      <!-- ===================================================
           BOTTOM DETAILS
      ==================================================== -->

      <div class="mg-cinematic-banner__bottom">

        <div class="mg-cinematic-banner__bottom-left">

          <span>
            MG EXPERIENCE
          </span>

          <strong>
            Designed for more than the everyday.
          </strong>

        </div>


        <div class="mg-cinematic-banner__scroll">

          <span>
            EXPLORE
          </span>

          <i></i>

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
   SECTION
========================================================= */

.mg-cinematic-banner {
  --red: #e51920;
  --white: #ffffff;

  position: relative;

  width: 100%;

  margin-top: 60px;

  height: clamp(
    650px,
    56.25vw,
    980px
  );

  min-height: 650px;

  overflow: hidden;

  isolation: isolate;

  background: #f2f2f1;

  box-shadow: 0 -140px 0 0 #f2f2f1;

  color: var(--white);

  font-family:
    "Manrope",
    sans-serif;
}


/* =========================================================
   IMAGE

   Keeps the supplied composition stable with no hover zoom or top cropping.
========================================================= */

.mg-cinematic-banner__image {
  position: absolute;

  inset: 0;

  z-index: -10;

  width: 100%;

  height: 100%;

  display: block;

  object-fit: cover;

  /* Keep the roof/top of the vehicle visible */
  object-position: center top;

  /* Never zoom or move the image on hover */
  transform: none !important;
  transition: none !important;

  transform: scale(1);
  transform-origin: center center;

  transition:
    transform
    7s
    cubic-bezier(.16, 1, .3, 1);
}






/* =========================================================
   IMAGE OVERLAY ONLY

   IMPORTANT:
   - The top white area stays visually clean.
   - Overlay fades in smoothly with no hard horizontal edge.
   - The car/image itself is NOT moved or cropped.
========================================================= */

.mg-cinematic-banner__image-overlay {
  position: absolute;
  inset: 0;

  z-index: -5;

  pointer-events: none;

  /*
    No hard top edge.
    Overlay is fully transparent at the top,
    fades in smoothly below it,
    then uses the left-to-right darkening.
  */
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0.08) 18%,
      rgba(0, 0, 0, 0.16) 28%,
      rgba(0, 0, 0, 0.20) 100%
    ),
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.30) 0%,
      rgba(0, 0, 0, 0.18) 38%,
      rgba(0, 0, 0, 0.06) 68%,
      rgba(0, 0, 0, 0.08) 100%
    );

  /*
    Fade the whole overlay itself from transparent at the top,
    so there is never a straight grey horizontal line.
  */
  -webkit-mask-image:
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 8%,
      rgba(0, 0, 0, 0.25) 16%,
      #000 28%,
      #000 100%
    );

  mask-image:
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 8%,
      rgba(0, 0, 0, 0.25) 16%,
      #000 28%,
      #000 100%
    );
}


/* =========================================================
   CONTAINER
========================================================= */

.mg-cinematic-banner__container {
  position: relative;

  width: 100% !important;
  max-width: none !important;
  height: 100%;

  margin: 0 !important;

  padding-left: var(--mg-page-gutter, 5vw) !important;
  padding-right: var(--mg-page-gutter, 5vw) !important;

  box-sizing: border-box !important;
}


/* =========================================================
   TOP
========================================================= */

.mg-cinematic-banner__top {
  position: absolute;

  left: 0;
  right: 0;

  top: clamp(
    28px,
    2.7vw,
    46px
  );

  display: flex;

  align-items: center;

  justify-content: space-between;
}


/* =========================================================
   EYEBROW
========================================================= */

.mg-cinematic-banner__eyebrow {
  display: flex;

  align-items: center;

  gap: 9px;

  color:
    rgba(255, 255, 255, .8);

  font-size: clamp(10px, 0.58vw, 12px);

  font-weight: 700;

  letter-spacing: .15em;
}


.mg-cinematic-banner__dot {
  width: 6px;

  height: 6px;

  border-radius: 50%;

  background: var(--red);

  box-shadow:
    0 0 14px
    rgba(229, 25, 32, .6);
}


.mg-cinematic-banner__eyebrow i {
  width: 24px;

  height: 1px;

  background:
    rgba(255, 255, 255, .4);
}


/* =========================================================
   INDEX
========================================================= */

.mg-cinematic-banner__index {
  display: flex;

  align-items: center;

  gap: 8px;

  color:
    rgba(255, 255, 255, .63);

  font-family:
    "Barlow Condensed",
    sans-serif;

  font-size: clamp(10px, 0.6vw, 12px);

  letter-spacing: .08em;
}


.mg-cinematic-banner__index > span:first-child {
  color: #fff;

  font-size: clamp(14px, 0.9vw, 18px);
}


.mg-cinematic-banner__index i {
  width: 27px;

  height: 1px;

  background:
    rgba(255, 255, 255, .4);
}


/* =========================================================
   MAIN CONTENT

   Intentionally stays on left because the car is on right.
========================================================= */

.mg-cinematic-banner__content {
  position: absolute;

  left: var(--mg-page-gutter, 5vw);

  top: 49%;

  width: min(
    520px,
    35vw
  );

  transform:
    translateY(-50%);
}


/* =========================================================
   KICKER
========================================================= */

.mg-cinematic-banner__kicker {
  display: block;

  margin-bottom:
    clamp(
      18px,
      1.35vw,
      24px
    );

  color:
    rgba(255, 255, 255, .66);

  font-size: clamp(10px, 0.58vw, 12px);

  font-weight: 700;

  letter-spacing: .16em;
}


/* =========================================================
   HEADING
========================================================= */

.mg-cinematic-banner__content h2 {
  margin: 0;

  font-size: clamp(42px, 3vw, 60px);

  font-weight: 500;

  line-height: 1.16;

  letter-spacing: -0.045em;

  text-wrap: balance;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.mg-cinematic-banner__content p {
  max-width: 410px;

  margin:
    clamp(
      24px,
      1.8vw,
      32px
    )
    0
    0;

  color:
    rgba(255, 255, 255, .7);

  font-size: clamp(13px, 0.82vw, 16px);

  line-height: 1.78;
}


/* =========================================================
   ACTIONS
========================================================= */

.mg-cinematic-banner__actions {
  display: flex;

  align-items: center;

  gap:
    clamp(
      19px,
      1.6vw,
      27px
    );

  margin-top:
    clamp(
      30px,
      2.35vw,
      40px
    );
}


/* =========================================================
   PRIMARY BUTTON
========================================================= */

.mg-cinematic-banner__button {
  display: inline-flex;

  align-items: center;

  gap: 23px;

  min-height:
    clamp(
      49px,
      3.2vw,
      55px
    );

  padding:
    4px
    5px
    4px
    clamp(
      17px,
      1.2vw,
      21px
    );

  border-radius: 999px;

  background: #fff;

  color: #111;

  text-decoration: none;

  font-size: clamp(12px, 0.72vw, 14px);

  font-weight: 650;

  line-height: 1.35;

  transition:
    transform .3s ease;
}


.mg-cinematic-banner__button:hover {
  transform:
    translateY(-2px);
}


.mg-cinematic-banner__button-arrow {
  width:
    clamp(
      40px,
      2.6vw,
      46px
    );

  height:
    clamp(
      40px,
      2.6vw,
      46px
    );

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #111111;

  color: #fff;

  transition:
    background .3s ease,
    transform .3s ease;
}


.mg-cinematic-banner__button:hover
.mg-cinematic-banner__button-arrow {
  background: var(--red);

  transform:
    translateX(2px);
}


.mg-cinematic-banner__button-arrow svg {
  width: 15px;
}


/* =========================================================
   SECONDARY BUTTON
========================================================= */

.mg-cinematic-banner__secondary {
  display: flex;

  align-items: center;

  gap: 8px;

  color:
    rgba(255, 255, 255, .8);

  text-decoration: none;

  font-size: clamp(11px, 0.68vw, 13px);

  font-weight: 600;

  line-height: 1.4;
}


.mg-cinematic-banner__secondary span:last-child {
  transition:
    transform .3s ease;
}


.mg-cinematic-banner__secondary:hover
span:last-child {
  transform:
    translate(2px, -2px);
}


/* =========================================================
   BOTTOM
========================================================= */

.mg-cinematic-banner__bottom {
  position: absolute;

  left: var(--mg-page-gutter, 5vw);
  right: var(--mg-page-gutter, 5vw);

  bottom:
    clamp(
      28px,
      2.7vw,
      46px
    );

  display: flex;

  align-items: flex-end;

  justify-content: space-between;
}


/* =========================================================
   BOTTOM LEFT
========================================================= */

.mg-cinematic-banner__bottom-left span {
  display: block;

  margin-bottom: 5px;

  color:
    rgba(255, 255, 255, .44);

  font-size: clamp(9px, 0.5vw, 11px);

  font-weight: 700;

  letter-spacing: .15em;
}


.mg-cinematic-banner__bottom-left strong {
  font-size: clamp(12px, 0.72vw, 14px);

  font-weight: 500;
}


/* =========================================================
   SCROLL DETAIL
========================================================= */

.mg-cinematic-banner__scroll {
  display: flex;

  align-items: center;

  gap: 11px;

  color:
    rgba(255, 255, 255, .55);

  font-size: clamp(9px, 0.52vw, 11px);

  font-weight: 700;

  letter-spacing: .14em;
}


.mg-cinematic-banner__scroll i {
  position: relative;

  width: 45px;

  height: 1px;

  overflow: hidden;

  background:
    rgba(255, 255, 255, .23);
}


.mg-cinematic-banner__scroll i::after {
  content: "";

  position: absolute;

  left: 0;

  top: 0;

  width: 45%;

  height: 100%;

  background: var(--red);

  animation:
    mgBannerLine
    2.8s
    ease-in-out
    infinite;
}


@keyframes mgBannerLine {

  0%,
  100% {
    transform:
      translateX(-100%);
  }

  50% {
    transform:
      translateX(220%);
  }

}


/* =========================================================
   LARGE DESKTOP / VW
========================================================= */




/* =========================================================
   LARGE SCREEN TYPOGRAPHY
========================================================= */

@media (min-width: 1440px) {
  .mg-cinematic-banner__kicker {
    font-size: clamp(11px, 0.58vw, 12px);
  }

  .mg-cinematic-banner__content h2 {
    font-size: clamp(48px, 3vw, 62px);
    line-height: 1.15;
  }

  .mg-cinematic-banner__content p {
    font-size: clamp(14px, 0.82vw, 16px);
    line-height: 1.78;
  }

  .mg-cinematic-banner__button {
    font-size: clamp(12px, 0.72vw, 14px);
  }

  .mg-cinematic-banner__secondary {
    font-size: clamp(11px, 0.68vw, 13px);
  }

  .mg-cinematic-banner__bottom-left span,
  .mg-cinematic-banner__scroll {
    font-size: clamp(9px, 0.52vw, 11px);
  }

  .mg-cinematic-banner__bottom-left strong {
    font-size: clamp(12px, 0.72vw, 14px);
  }
}


/* =========================================================
   TABLET
========================================================= */

@media (
  max-width: 1000px
) {


  .mg-cinematic-banner {
    height: 700px;
  }


  .mg-cinematic-banner__content {
    width: min(
      450px,
      53vw
    );
  }


  .mg-cinematic-banner__content h2 {
    font-size: 42px;
    line-height: 1.16;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width: 767px
) {


  .mg-cinematic-banner {
    height: 740px;
    min-height: 740px;
  }


  .mg-cinematic-banner__container {
    width: 100% !important;
    padding-left: var(--mg-page-gutter, 5vw) !important;
    padding-right: var(--mg-page-gutter, 5vw) !important;
  }


  /*
   * On portrait screens we preserve the vehicle by moving
   * the crop to the right.
   */

  .mg-cinematic-banner__image {
    object-position: 63% top;
  }



  .mg-cinematic-banner__top {
    top: 22px;
  }


  .mg-cinematic-banner__index {
    display: none;
  }


  /*
   * On mobile move text to bottom so it doesn't cover
   * the vehicle.
   */

  .mg-cinematic-banner__content {
    top: auto;

    left: var(--mg-page-gutter, 5vw);

    bottom: 105px;

    width: 100%;

    transform: none;
  }


  .mg-cinematic-banner__content h2 {
    max-width: 370px;

    font-size: 34px;
    line-height: 1.18;
    letter-spacing: -0.035em;
  }


  .mg-cinematic-banner__content h2 br {
    display: none;
  }


  .mg-cinematic-banner__content p {
    max-width: 340px;

    margin-top: 15px;

    font-size: 13px;
    line-height: 1.72;
  }


  .mg-cinematic-banner__actions {
    margin-top: 28px;
  }


  .mg-cinematic-banner__button {
    min-height: 48px;

    padding-left: 17px;

    font-size: 12px;
  }


  .mg-cinematic-banner__button-arrow {
    width: 39px;

    height: 39px;
  }


  .mg-cinematic-banner__secondary {
    font-size: 11px;
  }


  .mg-cinematic-banner__bottom {
    bottom: 23px;
  }


  .mg-cinematic-banner__bottom-left {
    display: none;
  }


  .mg-cinematic-banner__scroll {
    margin-left: auto;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (
  max-width: 430px
) {


  .mg-cinematic-banner {
    height: 700px;
    min-height: 700px;
  }


  .mg-cinematic-banner__image {
    object-position: 66% top;
  }



  .mg-cinematic-banner__content h2 {
    font-size: 31px;
    line-height: 1.18;
  }


  .mg-cinematic-banner__actions {
    align-items: flex-start;

    flex-direction: column;

    gap: 14px;
  }

}



/* =========================================================
   RESPONSIVE HERO SIZE FIX

   Keeps the banner balanced on desktop, laptop, tablet
   and mobile. These rules are placed last so they override
   the older responsive values above.
========================================================= */

/* Large desktop */
@media (min-width: 1440px) {
  .mg-cinematic-banner {
    height: clamp(720px, 52vw, 900px);
    min-height: 720px;
  }

  .mg-cinematic-banner__image {
    object-position: center top;
  }

  .mg-cinematic-banner__content {
    top: 51%;
    width: min(520px, 34vw);
  }
}

/* Laptop / small desktop */
@media (min-width: 1100px) and (max-width: 1439px) {
  .mg-cinematic-banner {
    height: clamp(620px, 54vw, 760px);
    min-height: 620px;
  }

  .mg-cinematic-banner__image {
    object-position: 57% top;
  }

  .mg-cinematic-banner__content {
    top: 52%;
    width: min(470px, 36vw);
  }

  .mg-cinematic-banner__content h2 {
    font-size: clamp(40px, 3.4vw, 52px);
  }

  .mg-cinematic-banner__content p {
    max-width: 390px;
    font-size: 14px;
  }
}

/* Tablet landscape */
@media (min-width: 768px) and (max-width: 1099px) {
  .mg-cinematic-banner {
    height: 650px;
    min-height: 650px;
  }

  .mg-cinematic-banner__image {
    object-position: 61% top;
  }

  .mg-cinematic-banner__content {
    top: 53%;
    left: 5vw;
    width: 390px;
  }

  .mg-cinematic-banner__content h2 {
    font-size: 40px;
    line-height: 1.12;
  }

  .mg-cinematic-banner__content p {
    max-width: 350px;
    font-size: 13px;
    line-height: 1.65;
  }

  .mg-cinematic-banner__actions {
    margin-top: 24px;
  }

  .mg-cinematic-banner__button {
    min-height: 46px;
    font-size: 12px;
  }

  .mg-cinematic-banner__button-arrow {
    width: 38px;
    height: 38px;
  }

  .mg-cinematic-banner__bottom {
    bottom: 24px;
  }
}

/* Mobile */
@media (min-width: 481px) and (max-width: 767px) {
  .mg-cinematic-banner {
    height: 680px;
    min-height: 680px;
  }

  .mg-cinematic-banner__image {
    object-position: 68% top;
  }

  .mg-cinematic-banner__content {
    top: auto;
    left: 20px;
    right: 20px;
    bottom: 92px;
    width: auto;
    transform: none;
  }

  .mg-cinematic-banner__kicker {
    margin-bottom: 12px;
    font-size: 10px;
  }

  .mg-cinematic-banner__content h2 {
    max-width: 330px;
    font-size: 32px;
    line-height: 1.12;
  }

  .mg-cinematic-banner__content p {
    max-width: 320px;
    margin-top: 14px;
    font-size: 12px;
    line-height: 1.6;
  }

  .mg-cinematic-banner__actions {
    margin-top: 20px;
    gap: 14px;
  }

  .mg-cinematic-banner__button {
    min-height: 44px;
    padding-left: 15px;
    font-size: 11px;
  }

  .mg-cinematic-banner__button-arrow {
    width: 36px;
    height: 36px;
  }

  .mg-cinematic-banner__secondary {
    font-size: 10px;
  }

  .mg-cinematic-banner__bottom {
    left: 20px;
    right: 20px;
    bottom: 18px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .mg-cinematic-banner {
    height: 640px;
    min-height: 640px;
  }

  .mg-cinematic-banner__image {
    object-position: 72% top;
  }

  .mg-cinematic-banner__content {
    top: auto;
    left: 16px;
    right: 16px;
    bottom: 82px;
    width: auto;
    transform: none;
  }

  .mg-cinematic-banner__kicker {
    margin-bottom: 10px;
    font-size: 9px;
    letter-spacing: .13em;
  }

  .mg-cinematic-banner__content h2 {
    max-width: 295px;
    font-size: 28px;
    line-height: 1.1;
  }

  .mg-cinematic-banner__content h2 br {
    display: none;
  }

  .mg-cinematic-banner__content p {
    max-width: 285px;
    margin-top: 12px;
    font-size: 11px;
    line-height: 1.55;
  }

  .mg-cinematic-banner__actions {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-top: 17px;
  }

  .mg-cinematic-banner__button {
    min-height: 42px;
    padding: 3px 4px 3px 13px;
    gap: 12px;
    font-size: 10px;
  }

  .mg-cinematic-banner__button-arrow {
    width: 34px;
    height: 34px;
  }

  .mg-cinematic-banner__secondary {
    font-size: 9px;
  }

  .mg-cinematic-banner__bottom {
    left: 16px;
    right: 16px;
    bottom: 15px;
  }

  .mg-cinematic-banner__scroll {
    font-size: 9px;
  }
}


/* =========================================================
   FINAL IMAGE CROP SAFETY

   The image always anchors to the TOP vertically.
   This prevents the vehicle roof from being cut on
   laptop, tablet and mobile screen sizes.
========================================================= */

.mg-cinematic-banner__image,
.mg-cinematic-banner:hover .mg-cinematic-banner__image {
  transform: none !important;
  transition: none !important;
}

@media (min-width: 1440px) {
  .mg-cinematic-banner__image {
    object-position: center top !important;
  }
}

@media (min-width: 1100px) and (max-width: 1439px) {
  .mg-cinematic-banner__image {
    object-position: 57% top !important;
  }
}

@media (min-width: 768px) and (max-width: 1099px) {
  .mg-cinematic-banner__image {
    object-position: 61% top !important;
  }
}

@media (min-width: 481px) and (max-width: 767px) {
  .mg-cinematic-banner__image {
    object-position: 68% top !important;
  }
}

@media (max-width: 480px) {
  .mg-cinematic-banner__image {
    object-position: 72% top !important;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion: reduce
) {

  .mg-cinematic-banner *,
  .mg-cinematic-banner *::before,
  .mg-cinematic-banner *::after {
    animation-duration:
      .01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      .01ms !important;
  }

}

</style>