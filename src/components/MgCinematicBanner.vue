<script setup>
const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const bannerImage = asset("images/mg-mountain-banner.png");
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


    <!-- =====================================================
         IMAGE TREATMENT
    ====================================================== -->

    <div class="mg-cinematic-banner__shade"></div>

    <div class="mg-cinematic-banner__top-shade"></div>

    <div class="mg-cinematic-banner__bottom-shade"></div>



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

  height: clamp(
    650px,
    56.25vw,
    980px
  );

  min-height: 650px;

  overflow: hidden;

  isolation: isolate;

  background: #111;

  color: var(--white);

  font-family:
    "Manrope",
    sans-serif;
}


/* =========================================================
   IMAGE

   Keeps the supplied 16:9 composition as intact as possible.
========================================================= */

.mg-cinematic-banner__image {
  position: absolute;

  inset: 0;

  z-index: -10;

  width: 100%;

  height: 100%;

  display: block;

  object-fit: cover;

  object-position: center center;

  transform: scale(1.002);

  transition:
    transform
    7s
    cubic-bezier(.16, 1, .3, 1);
}


.mg-cinematic-banner:hover
.mg-cinematic-banner__image {
  transform: scale(1.025);
}


/* =========================================================
   MAIN LEFT GRADIENT

   Darkens only the text area.
   Keeps vehicle side clean.
========================================================= */

.mg-cinematic-banner__shade {
  position: absolute;

  inset: 0;

  z-index: -7;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,

      rgba(5, 8, 10, .62)
      0%,

      rgba(5, 8, 10, .39)
      22%,

      rgba(5, 8, 10, .12)
      43%,

      rgba(5, 8, 10, 0)
      61%
    );
}


/* =========================================================
   TOP SHADE
========================================================= */

.mg-cinematic-banner__top-shade {
  position: absolute;

  inset: 0 0 auto;

  z-index: -6;

  height: 32%;

  pointer-events: none;

  background:
    linear-gradient(
      180deg,

      rgba(0, 0, 0, .32),

      transparent
    );
}


/* =========================================================
   BOTTOM SHADE
========================================================= */

.mg-cinematic-banner__bottom-shade {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  z-index: -6;

  height: 37%;

  pointer-events: none;

  background:
    linear-gradient(
      180deg,

      transparent,

      rgba(0, 0, 0, .14)
      35%,

      rgba(0, 0, 0, .5)
      100%
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

  font-size: .4vw;

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

  font-size: .52vw;

  letter-spacing: .08em;
}


.mg-cinematic-banner__index > span:first-child {
  color: #fff;

  font-size: .9vw;
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
      13px,
      1vw,
      17px
    );

  color:
    rgba(255, 255, 255, .66);

  font-size: .4vw;

  font-weight: 700;

  letter-spacing: .16em;
}


/* =========================================================
   HEADING
========================================================= */

.mg-cinematic-banner__content h2 {
  margin: 0;

  font-size: 3.4vw;

  font-weight: 500;

  line-height: .99;

  letter-spacing: -.057em;

  text-wrap: balance;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.mg-cinematic-banner__content p {
  max-width: 410px;

  margin:
    clamp(
      18px,
      1.55vw,
      25px
    )
    0
    0;

  color:
    rgba(255, 255, 255, .7);

  font-size: .68vw;

  line-height: 1.7;
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
      25px,
      2vw,
      34px
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

  font-size: .58vw;

  font-weight: 650;

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

  background: #111;

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

  font-size: .54vw;

  font-weight: 600;
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

  font-size: .34vw;

  font-weight: 700;

  letter-spacing: .15em;
}


.mg-cinematic-banner__bottom-left strong {
  font-size: .65vw;

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

  font-size: .35vw;

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
    font-size: 44px;
  }


  .mg-cinematic-banner__shade {
    background:
      linear-gradient(
        90deg,

        rgba(5, 8, 10, .67),

        rgba(5, 8, 10, .39)
        39%,

        transparent
        72%
      );
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
    object-position:
      63% center;
  }


  .mg-cinematic-banner__shade {
    background:
      linear-gradient(
        180deg,

        rgba(5, 8, 10, .3)
        0%,

        rgba(5, 8, 10, .07)
        32%,

        rgba(5, 8, 10, .24)
        57%,

        rgba(5, 8, 10, .83)
        100%
      );
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

    font-size: 36px;
  }


  .mg-cinematic-banner__content h2 br {
    display: none;
  }


  .mg-cinematic-banner__content p {
    max-width: 340px;

    margin-top: 15px;

    font-size: 9px;
  }


  .mg-cinematic-banner__actions {
    margin-top: 22px;
  }


  .mg-cinematic-banner__button {
    min-height: 48px;

    padding-left: 17px;

    font-size: 9px;
  }


  .mg-cinematic-banner__button-arrow {
    width: 39px;

    height: 39px;
  }


  .mg-cinematic-banner__secondary {
    font-size: 8px;
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
    object-position:
      66% center;
  }


  .mg-cinematic-banner__content h2 {
    font-size: 33px;
  }


  .mg-cinematic-banner__actions {
    align-items: flex-start;

    flex-direction: column;

    gap: 14px;
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