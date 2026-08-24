<script setup>

const cards = [

  {

    id: 1,

    number: "01",

    label: "Design",

    title: "Made to stand apart.",

    description:

      "Clean proportions, confident surfaces and details that give MG a distinctive presence.",

    image:

      "https://news.mgmotor.eu/wp-content/uploads/2025/05/KV1-1040x585.jpg",

    className: "mg-card--feature",

  },

  {

    id: 2,

    number: "02",

    label: "Interior",

    title: "Designed around you.",

    description:

      "A calm, driver-focused cabin where technology feels intuitive rather than intrusive.",

    image:

      "https://news.mgmotor.eu/wp-content/uploads/2025/05/Grand-interior-decor-1040x585.jpg",

    className: "mg-card--standard",

  },

  {

    id: 3,

    number: "03",

    label: "Details",

    title: "Precision in every line.",

    description:

      "Lighting and exterior details give the S5 EV a sharp, contemporary character.",

    image:

      "https://news.mgmotor.eu/wp-content/uploads/2025/05/Headlight-1040x585.jpg",

    className: "mg-card--standard",

  },

  {

    id: 4,

    number: "04",

    label: "Technology",

    title: "Everything within reach.",

    description:

      "Digital controls and connected features are positioned around the driver for a simpler experience.",

    image:

      "https://news.mgmotor.eu/wp-content/uploads/2025/05/Steering-wheel-1040x585.jpg",

    className: "mg-card--wide",

  },

];

</script>



<template>

  <section class="mg-brand">

    <div class="mg-brand__container">



      <!-- =====================================================*

*           SECTION INTRO*

*      ====================================================== -->

      <div class="mg-brand__intro">



        <div class="mg-brand__heading">

          <span class="mg-brand__eyebrow">

            The MG experience

          </span>



          <h2>

            Built around

            <br />

            the drive.

          </h2>

        </div>



        <div class="mg-brand__intro-copy">

          <p>

            Thoughtful design, intuitive technology and

            electric performance come together in a driving

            experience that feels distinctly MG.

          </p>



          <a

            href="#"

            class="mg-brand__link"

          >

            <span>

              Discover MG

            </span>



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

          </a>

        </div>



      </div>





      <!-- =====================================================*

*           CARDS*

*      ====================================================== -->

      <div class="mg-brand__grid">



        <article

          v-for="card in cards"

          :key="card.id"

          class="mg-card"

          :class="card.className"

        >



          <!-- IMAGE -->

          <div class="mg-card__media">

            <img

              :src="card.image"

              :alt="card.title"

              loading="lazy"

              draggable="false"

            />



            <div class="mg-card__shade"></div>

          </div>





          <!-- TOP META -->

          <div class="mg-card__meta">

            <span>

              {{ card.label }}

            </span>



            <span>

              {{ card.number }}

            </span>

          </div>





          <!-- CONTENT -->

          <div class="mg-card__content">

            <h3>

              {{ card.title }}

            </h3>



            <p>

              {{ card.description }}

            </p>



            <span class="mg-card__arrow">

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

          </div>



        </article>



      </div>



    </div>

  </section>

</template>



<style scoped>

/* =========================================================*

*   FONT*

*========================================================= */

@import url(
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
);



/* =========================================================*

*   SECTION*

*========================================================= */

.mg-brand {

  --mg-red:

    #e51920;

  --mg-bg:

    #f5f5f2;

  --mg-text:

    #111111;



  position:

    relative;



  width:

    100%;



  padding:

    clamp(

      75px,

      6.5vw,

      110px

    )

    0

    clamp(

      80px,

      7vw,

      120px

    );



  overflow:

    hidden;



  background:

    var(--mg-bg);



  color:

    var(--mg-text);

  font-family:
    "Manrope",
    sans-serif;

}



/* =========================================================*

*   CONTAINER*

*========================================================= */

.mg-brand__container {

  width:

    min(

      90%,

      1380px

    );



  margin:

    0

    auto;

}



/* =========================================================*

*   INTRO*

*   MUCH MORE CONTROLLED THAN PREVIOUS VERSION*

*========================================================= */

.mg-brand__intro {

  display:

    grid;



  grid-template-columns:

    minmax(

      0,

      1fr

    )

    minmax(

      290px,

      410px

    );



  align-items:

    end;



  gap:

    clamp(

      40px,

      6vw,

      90px

    );



  margin-bottom:

    clamp(

      38px,

      4.5vw,

      65px

    );

}



/* =========================================================*

*   EYEBROW*

*========================================================= */

.mg-brand__eyebrow {

  display:

    block;



  margin-bottom:

    11px;



  font-family:

    "Manrope",

    sans-serif;



  font-size:

    clamp(

      8px,

      0.52vw,

      10px

    );



  font-weight:

    700;



  letter-spacing:

    0.19em;



  text-transform:

    uppercase;



  color:

    rgba(

      0,

      0,

      0,

      0.43

    );

}



/* =========================================================*

*   HEADING*

*   NO MASSIVE 120PX TEXT*

*========================================================= */

.mg-brand__heading h2 {
  max-width:
    660px;

  margin:
    0;

  font-family:
    "Manrope",
    sans-serif;

  font-size:
    clamp(
      30px,
      2.5vw,
      42px
    );

  font-weight:
    600;

  line-height:
    1.08;

  letter-spacing:
    -0.04em;

  color:
    #111;
}



/* =========================================================*

*   INTRO COPY*

*========================================================= */

.mg-brand__intro-copy {

  padding-bottom:

    2px;

}



.mg-brand__intro-copy p {

  max-width:

    390px;



  margin:

    0;



  font-family:

    "Manrope",

    sans-serif;



  font-size:

    clamp(

      11px,

      0.8vw,

      14px

    );



  font-weight:

    400;



  line-height:

    1.72;



  color:

    rgba(

      0,

      0,

      0,

      0.54

    );

}



/* =========================================================*

*   SMALL TEXT LINK*

*========================================================= */

.mg-brand__link {

  display:

    inline-flex;



  align-items:

    center;



  gap:

    10px;



  margin-top:

    20px;



  color:

    #111;



  text-decoration:

    none;



  font-family:

    "Manrope",

    sans-serif;



  font-size:

    9px;



  font-weight:

    700;



  letter-spacing:

    0.11em;



  text-transform:

    uppercase;

}



.mg-brand__link svg {

  width:

    14px;



  transition:

    transform

    0.3s

    ease;

}



.mg-brand__link:hover svg {

  transform:

    translateX(

      4px

    );

}



/* =========================================================*

*   GRID*

*   Clean asymmetric editorial grid.*

*========================================================= */

.mg-brand__grid {

  display:

    grid;



  grid-template-columns:

    repeat(

      12,

      minmax(

        0,

        1fr

      )

    );



  grid-template-rows:

    330px

    310px;



  gap:

    clamp(

      14px,

      1.4vw,

      20px

    );

}



/* =========================================================*

*   CARD BASE*

*========================================================= */

.mg-card {

  position:

    relative;



  overflow:

    hidden;



  min-width:

    0;



  border-radius:

    18px;



  background:

    #171717;



  color:

    #fff;



  isolation:

    isolate;

}



/* =========================================================*

*   LAYOUT*

*========================================================= */

.mg-card--feature {

  grid-column:

    1 /

    8;



  grid-row:

    1 /

    3;

}



.mg-card--standard:nth-child(2) {

  grid-column:

    8 /

    13;



  grid-row:

    1;

}



.mg-card--standard:nth-child(3) {

  grid-column:

    8 /

    11;



  grid-row:

    2;

}



.mg-card--wide {

  grid-column:

    11 /

    13;



  grid-row:

    2;

}



/* =========================================================*

*   IMAGE*

*========================================================= */

.mg-card__media {

  position:

    absolute;



  inset:

    0;



  overflow:

    hidden;

}



.mg-card__media img {

  display:

    block;



  width:

    100%;



  height:

    100%;



  object-fit:

    cover;



  object-position:

    center;



  transform:

    scale(

      1.001

    );



  transition:

    transform

    0.9s

    cubic-bezier(

      0.16,

      1,

      0.3,

      1

    );



  user-select:

    none;



  -webkit-user-drag:

    none;

}



/* =========================================================*

*   FEATURE IMAGE POSITION*

*========================================================= */

.mg-card--feature

.mg-card__media img {

  object-position:

    center;

}



/* =========================================================*

*   IMAGE SHADE*

*========================================================= */

.mg-card__shade {

  position:

    absolute;



  inset:

    0;



  background:

    linear-gradient(

      180deg,

      rgba(

        0,

        0,

        0,

        0.08

      )

      0%,

      rgba(

        0,

        0,

        0,

        0.02

      )

      38%,

      rgba(

        0,

        0,

        0,

        0.7

      )

      100%

    );

}



/* slightly stronger on feature */

.mg-card--feature

.mg-card__shade {

  background:

    linear-gradient(

      180deg,

      rgba(

        0,

        0,

        0,

        0.08

      )

      0%,

      transparent

      36%,

      rgba(

        0,

        0,

        0,

        0.68

      )

      100%

    );

}



/* =========================================================*

*   META*

*========================================================= */

.mg-card__meta {

  position:

    absolute;



  top:

    19px;



  left:

    20px;



  right:

    20px;



  z-index:

    5;



  display:

    flex;



  align-items:

    center;



  justify-content:

    space-between;



  font-family:

    "Manrope",

    sans-serif;



  font-size:

    8px;



  font-weight:

    700;



  letter-spacing:

    0.16em;



  text-transform:

    uppercase;



  color:

    rgba(

      255,

      255,

      255,

      0.7

    );

}



/* =========================================================*

*   CONTENT*

*========================================================= */

.mg-card__content {

  position:

    absolute;



  left:

    20px;



  right:

    20px;



  bottom:

    20px;



  z-index:

    6;

}



/* =========================================================*

*   CARD TITLE*

*   Proper usable sizing.*

*========================================================= */

.mg-card__content h3 {
  max-width:
    430px;

  margin:
    0;

  font-family:
    "Manrope",
    sans-serif;

  font-size:
    clamp(
      18px,
      1.35vw,
      23px
    );

  font-weight:
    600;

  line-height:
    1.08;

  letter-spacing:
    -0.035em;
}



/* feature only slightly larger */

.mg-card--feature
.mg-card__content h3 {
  font-size:
    clamp(
      20px,
      1.6vw,
      26px
    );
}



/* narrow cards smaller */

.mg-card--standard:nth-child(3)
.mg-card__content h3,
.mg-card--wide
.mg-card__content h3 {
  font-size:
    clamp(
      17px,
      1.2vw,
      21px
    );
}



/* =========================================================*

*   DESCRIPTION*

*========================================================= */

.mg-card__content p {

  max-width:

    360px;



  margin:

    9px

    0

    0;



  font-family:

    "Manrope",

    sans-serif;



  font-size:

    clamp(

      9px,

      0.7vw,

      12px

    );



  font-weight:

    400;



  line-height:

    1.55;



  color:

    rgba(

      255,

      255,

      255,

      0.68

    );

}



/* narrow cards hide extra paragraph to avoid clutter */

.mg-card--standard:nth-child(3)

.mg-card__content p,

.mg-card--wide

.mg-card__content p {

  display:

    none;

}



/* =========================================================*

*   SMALL ARROW*

*========================================================= */

.mg-card__arrow {

  display:

    grid;



  place-items:

    center;



  width:

    31px;



  height:

    31px;



  margin-top:

    14px;



  border:

    1px

    solid

    rgba(

      255,

      255,

      255,

      0.27

    );



  border-radius:

    50%;



  transition:

    background

    0.3s

    ease,

    color

    0.3s

    ease,

    border-color

    0.3s

    ease;

}



.mg-card__arrow svg {

  width:

    13px;

}



/* hide arrow on smallest cards */

.mg-card--standard:nth-child(3)

.mg-card__arrow,

.mg-card--wide

.mg-card__arrow {

  display:

    none;

}



/* =========================================================*

*   CARD HOVER*

*========================================================= */

.mg-card:hover

.mg-card__media img {

  transform:

    scale(

      1.035

    );

}



.mg-card:hover

.mg-card__arrow {

  background:

    #fff;



  border-color:

    #fff;



  color:

    #111;

}



/* =========================================================*

*   SMALL MG RED DETAIL*

*   Very restrained.*

*========================================================= */

.mg-card::after {

  content:

    "";



  position:

    absolute;



  left:

    20px;



  bottom:

    0;



  z-index:

    8;



  width:

    0;



  height:

    2px;



  background:

    var(--mg-red);



  transition:

    width

    0.55s

    cubic-bezier(

      0.16,

      1,

      0.3,

      1

    );

}



.mg-card:hover::after {

  width:

    42px;

}



/* =========================================================*

*   TABLET*

*========================================================= */

@media (

  max-width:

  1050px

) {

  .mg-brand__grid {

    grid-template-columns:

      1fr

      1fr;



    grid-template-rows:

      470px

      300px

      300px;

  }



  .mg-card--feature {

    grid-column:

      1 /

      -1;



    grid-row:

      1;

  }



  .mg-card--standard:nth-child(2) {

    grid-column:

      1;



    grid-row:

      2;

  }



  .mg-card--standard:nth-child(3) {

    grid-column:

      2;



    grid-row:

      2;

  }



  .mg-card--wide {

    grid-column:

      1 /

      -1;



    grid-row:

      3;

  }



  .mg-card--standard:nth-child(3)

  .mg-card__content p,

  .mg-card--wide

  .mg-card__content p {

    display:

      block;

  }



  .mg-card--standard:nth-child(3)

  .mg-card__arrow,

  .mg-card--wide

  .mg-card__arrow {

    display:

      grid;

  }

}



/* =========================================================*

*   MOBILE*

*========================================================= */

@media (

  max-width:

  767px

) {

  .mg-brand {

    padding:

      68px

      0

      72px;

  }



  .mg-brand__container {

    width:

      calc(

        100% - 30px

      );

  }



  /* INTRO */

  .mg-brand__intro {

    display:

      block;



    margin-bottom:

      32px;

  }



  .mg-brand__heading h2 {
    font-size:
      29px;

    line-height:
      1.08;
  }


  .mg-brand__intro-copy {

    max-width:

      390px;



    margin-top:

      22px;

  }



  /* GRID */

  .mg-brand__grid {

    display:

      grid;



    grid-template-columns:

      1fr;



    grid-template-rows:

      none;



    gap:

      12px;

  }



  .mg-card--feature,

  .mg-card--standard:nth-child(2),

  .mg-card--standard:nth-child(3),

  .mg-card--wide {

    grid-column:

      auto;



    grid-row:

      auto;

  }



  .mg-card--feature {

    height:

      430px;

  }



  .mg-card--standard,

  .mg-card--wide {

    height:

      310px;

  }



  .mg-card__meta {

    top:

      17px;



    left:

      17px;



    right:

      17px;

  }



  .mg-card__content {

    left:

      17px;



    right:

      17px;



    bottom:

      18px;

  }



  .mg-card__content h3,

  .mg-card--feature

  .mg-card__content h3,

  .mg-card--standard:nth-child(3)

  .mg-card__content h3,

  .mg-card--wide

  .mg-card__content h3 {
    font-size:
      20px;

    line-height:
      1.08;
  }



  .mg-card__content p,

  .mg-card--standard:nth-child(3)

  .mg-card__content p,

  .mg-card--wide

  .mg-card__content p {

    display:

      block;



    max-width:

      320px;



    font-size:

      10px;

  }



  .mg-card--standard:nth-child(3)

  .mg-card__arrow,

  .mg-card--wide

  .mg-card__arrow {

    display:

      grid;

  }

}



/* =========================================================*

*   SMALL MOBILE*

*========================================================= */

@media (

  max-width:

  420px

) {

  .mg-brand__heading h2 {
    font-size:
      27px;
  }



  .mg-card--feature {

    height:

      400px;

  }



  .mg-card--standard,

  .mg-card--wide {

    height:

      290px;

  }



  .mg-card__content h3,

  .mg-card--feature

  .mg-card__content h3,

  .mg-card--standard:nth-child(3)

  .mg-card__content h3,

  .mg-card--wide

  .mg-card__content h3 {
    font-size:
      18px;
  }

}

</style>