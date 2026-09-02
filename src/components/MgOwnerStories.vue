<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

/* =========================================================
   CAROUSEL
========================================================= */

const activeSlide = ref(0);

let autoplayTimer = null;

/*
  Customer handover / delivery images.

  These are temporary public image URLs so the section
  immediately looks like a real ownership / buying story.

  For the final production website, replace these with
  client-owned MG Sri Lanka delivery photos if available.
*/

const slides = [
  {
    id: 1,
    image:
      "images/mg-owners/a679dfcb-fba4-4727-ad28-da21c99dea85.png",
    alt:
      "MG customer vehicle handover in Sri Lanka with a ceremonial MG key",
    quote:
      "The best part of every MG journey is the moment it becomes yours.",
    meta:
      "Customer Handover · MG Ownership",
    tag:
      "NEW MG OWNER",
    objectPosition:
      "center center",
  },

  {
    id: 2,
    image:
      "images/mg-owners/9b23f1af-7267-4a13-ac95-5cc94f4825ff.png",
    alt:
      "Family collecting a new MG vehicle at a showroom",
    quote:
      "From choosing the right model to collecting the keys, every detail should feel effortless.",
    meta:
      "Customer Delivery · Showroom Experience",
    tag:
      "DELIVERY DAY",
    objectPosition:
      "center center",
  },

  {
    id: 3,
    image:
      "images/mg-owners/744ed884-dbde-4328-9af0-a554bf5f4799.png",
    alt:
      "Customers receiving a new MG vehicle at a dealership",
    quote:
      "A new car is more than a purchase — it is the beginning of the journeys that follow.",
    meta:
      "MG Customer · New Vehicle Handover",
    tag:
      "MG FAMILY",
    objectPosition:
      "center center",
  },

  {
    id: 4,
    image:
      "images/mg-owners/c8e29417-5e27-4a79-9ce5-e6fbd21dddef.png",
    alt:
      "MG owners celebrating the delivery of their new vehicle",
    quote:
      "Confident cars, personal service and an ownership experience designed around real people.",
    meta:
      "Owner Experience · Customer Moment",
    tag:
      "OWNER STORY",
    objectPosition:
      "center center",
  },
];

const currentSlide =
  computed(
    () =>
      slides[
        activeSlide.value
      ]
  );

/* =========================================================
   NAVIGATION
========================================================= */

const nextSlide =
  () => {

    activeSlide.value =
      (
        activeSlide.value +
        1
      ) %
      slides.length;

  };


const previousSlide =
  () => {

    activeSlide.value =
      (
        activeSlide.value -
        1 +
        slides.length
      ) %
      slides.length;

  };


const selectSlide =
  (index) => {

    activeSlide.value =
      index;

    startAutoplay();

  };

/* =========================================================
   AUTOPLAY
========================================================= */

const stopAutoplay =
  () => {

    if (
      !autoplayTimer
    ) {
      return;
    }

    window.clearInterval(
      autoplayTimer
    );

    autoplayTimer =
      null;

  };


const startAutoplay =
  () => {

    stopAutoplay();

    autoplayTimer =
      window.setInterval(
        nextSlide,
        6500
      );

  };


onMounted(
  startAutoplay
);


onBeforeUnmount(
  stopAutoplay
);
</script>


<template>
  <section
    id="owners"
    class="mg-owners"
  >
    <div
      class="mg-owners__container"
    >

      <!-- ===================================================
           SECTION HEADER
      ==================================================== -->

      <header
        class="mg-owners__header"
      >
        <div
          class="mg-owners__heading"
        >
          <span
            class="mg-owners__eyebrow"
          >
            MG OWNERS
          </span>

          <h2>
            Start your journey with MG
          </h2>
        </div>


        <div
          class="mg-owners__header-right"
        >
          <a
            href="#mg-range"
            class="mg-owners__cta"
          >
            <span>
              Explore the Range
            </span>

            <span
              class="mg-owners__cta-arrow"
            >
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


          <p>
            From the first showroom visit to the moment
            the keys are handed over, MG ownership is
            designed around confidence, support and
            memorable experiences.
          </p>
        </div>
      </header>


      <!-- ===================================================
           MAIN STAGE
      ==================================================== -->

      <div
        class="mg-owners__stage"
      >

        <!-- =================================================
             CUSTOMER STORY CAROUSEL
        ================================================== -->

        <article
          class="mg-owner-card"
          @mouseenter="stopAutoplay"
          @mouseleave="startAutoplay"
        >
          <div
            class="mg-owner-card__visual"
          >

            <Transition
              name="owner-image"
              mode="out-in"
            >
              <img
                :key="currentSlide.id"
                class="mg-owner-card__image"
                :src="currentSlide.image"
                :alt="currentSlide.alt"
                :style="{
                  objectPosition:
                    currentSlide.objectPosition,
                }"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </Transition>


            <div
              class="mg-owner-card__image-overlay"
            ></div>


            <div
              class="mg-owner-card__image-tag"
            >
              <span>
                {{ currentSlide.tag }}
              </span>

              <i></i>

              <span>
                MG OWNERSHIP
              </span>
            </div>


            <div
              class="mg-owner-card__index"
            >
              <span>
                {{
                  String(
                    activeSlide +
                    1
                  ).padStart(
                    2,
                    "0"
                  )
                }}
              </span>

              <i></i>

              <span>
                {{
                  String(
                    slides.length
                  ).padStart(
                    2,
                    "0"
                  )
                }}
              </span>
            </div>
          </div>


          <!-- ===============================================
               PREVIOUS
          ================================================ -->

          <button
            type="button"
            class="
              mg-owner-card__nav
              mg-owner-card__nav--prev
            "
            aria-label="Previous customer story"
            @click="previousSlide"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M19 12H5M10 7l-5 5 5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>


          <!-- ===============================================
               NEXT
          ================================================ -->

          <button
            type="button"
            class="
              mg-owner-card__nav
              mg-owner-card__nav--next
            "
            aria-label="Next customer story"
            @click="nextSlide"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M14 7l5 5-5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>


          <!-- ===============================================
               STORY COPY
          ================================================ -->

          <div
            class="mg-owner-card__copy"
          >
            <Transition
              name="owner-copy"
              mode="out-in"
            >
              <div
                :key="currentSlide.id"
                class="mg-owner-card__copy-inner"
              >
                <blockquote>
                  “{{ currentSlide.quote }}”
                </blockquote>

                <p>
                  {{ currentSlide.meta }}
                </p>
              </div>
            </Transition>


            <div
              class="mg-owner-card__progress"
            >
              <button
                v-for="(slide, index) in slides"
                :key="slide.id"
                type="button"
                :class="{
                  'is-active':
                    activeSlide ===
                    index,
                }"
                :aria-label="
                  `Show customer story ${index + 1}`
                "
                @click="selectSlide(index)"
              ></button>
            </div>
          </div>
        </article>


        <!-- =================================================
             STAT 01
        ================================================== -->

        <article
          class="
            mg-stat
            mg-stat--experience
          "
        >
          <div
            class="mg-stat__topline"
          >
            <span>
              01
            </span>

            <i></i>

            <span>
              HERITAGE
            </span>
          </div>


          <div
            class="mg-stat__number"
          >
            <strong>
              100
            </strong>

            <span>
              +
            </span>
          </div>


          <div
            class="mg-stat__bottom"
          >
            <span>
              Years of
            </span>

            <strong>
              MG motoring heritage
            </strong>
          </div>
        </article>


        <!-- =================================================
             STAT 02
        ================================================== -->

        <article
          class="
            mg-stat
            mg-stat--since
          "
        >
          <div
            class="mg-stat__topline"
          >
            <span>
              02
            </span>

            <i></i>

            <span>
              SINCE
            </span>
          </div>


          <div
            class="
              mg-stat__number
              mg-stat__number--year
            "
          >
            <strong>
              1924
            </strong>
          </div>


          <div
            class="mg-stat__bottom"
          >
            <span>
              Driving forward
            </span>

            <strong>
              Since 1924
            </strong>
          </div>
        </article>


        <!-- =================================================
             GOOGLE REVIEWS
        ================================================== -->

        <aside
          class="mg-google-proof"
        >
          <div
            class="mg-google-proof__logo"
            aria-hidden="true"
          >
            <!-- Google G -->
            <svg
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.4-.4-3.5Z"
              />

              <path
                fill="#FF3D00"
                d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7Z"
              />

              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.5 16.2 44 24 44Z"
              />

              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C37 39.1 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z"
              />
            </svg>
          </div>


          <div
            class="mg-google-proof__content"
          >
            <span
              class="mg-google-proof__eyebrow"
            >
              GOOGLE REVIEWS
            </span>


            <strong
              class="mg-google-proof__title"
            >
              Customer experiences
            </strong>


            <div
              class="mg-google-proof__stars"
              aria-hidden="true"
            >
              <svg
                v-for="star in 5"
                :key="star"
                viewBox="0 0 24 24"
              >
                <path
                  d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.6-4.4 6.3-.9L12 2.8Z"
                  fill="currentColor"
                />
              </svg>
            </div>


            <p>
              See what MG owners say about
              their showroom and ownership
              experience.
            </p>


            <a
              href="#"
              class="mg-google-proof__link"
              aria-label="View Google Reviews"
            >
              <span>
                View reviews
              </span>

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M7 17 17 7M9 7h8v8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </div>
        </aside>

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

.mg-owners {

  --mg-red:
    #e51920;

  --black:
    #111111;

  --page:
    #f2f2f1;

  --card:
    #fbfbfa;

  --grey:
    #8e908e;


  position:
    relative;


  width:
    100%;


  overflow:
    hidden;


  padding:
    clamp(
      72px,
      6.2vw,
      105px
    )
    0
    clamp(
      72px,
      6vw,
      105px
    );


  background:
    var(--page);


  color:
    var(--black);


  font-family:
    "Manrope",
    sans-serif;

}


/* =========================================================
   CONTAINER
========================================================= */

.mg-owners__container {

  width:
    min(
      93%,
      1500px
    );


  margin:
    0
    auto;

}


/* =========================================================
   HEADER
========================================================= */

.mg-owners__header {

  display:
    grid;


  grid-template-columns:
    minmax(
      0,
      1fr
    )
    minmax(
      300px,
      .72fr
    );


  gap:
    clamp(
      80px,
      8vw,
      150px
    );


  align-items:
    start;


  margin-bottom:
    clamp(
      62px,
      6.5vw,
      105px
    );

}


.mg-owners__eyebrow {

  display:
    block;


  margin-bottom:
    clamp(
      14px,
      1vw,
      18px
    );


  color:
    rgba(
      0,
      0,
      0,
      .42
    );


  font-size:
    0.60vw;


  font-weight:
    700;


  letter-spacing:
    .19em;


  text-transform:
    uppercase;

}


/* =========================================================
   MAIN HEADING
   MATCHED TO YOUR OTHER MG SECTIONS
========================================================= */

.mg-owners__heading h2 {

  max-width:
    660px;


  margin:
    0;


  font-family:
    "Manrope",
    sans-serif;


  font-size:
    clamp(
      38px,
      2.8vw,
      54px
    );


  font-weight:
    600;


  line-height:
    1.08;


  letter-spacing:
    -.04em;


  color:
    #111;

}


/* =========================================================
   HEADER RIGHT
========================================================= */

.mg-owners__header-right {

  display:
    flex;


  flex-direction:
    column;


  align-items:
    flex-start;


  padding-top:
    .75vw;

}


.mg-owners__cta {

  align-self:
    flex-end;


  min-width:
    14.5vw;


  height:
    3.45vw;


  display:
    inline-flex;


  align-items:
    center;


  justify-content:
    space-between;


  gap:
    1.25vw;


  padding:
    .24vw
    .3vw
    .24vw
    1.15vw;


  box-sizing:
    border-box;


  border-radius:
    .9vw;


  background:
    #050505;


  color:
    #fff;


  text-decoration:
    none;


  font-size:
    0.78vw;


  font-weight:
    600;


  transition:
    transform
    .35s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    );

}


.mg-owners__cta:hover {

  transform:
    translateY(
      -.12vw
    );

}


.mg-owners__cta-arrow {

  width:
    2.9vw;


  height:
    2.9vw;


  flex:
    0
    0
    2.9vw;


  display:
    grid;


  place-items:
    center;


  border-radius:
    .72vw;


  background:
    #fff;


  color:
    #111;


  transition:
    color
    .3s
    ease,
    background
    .3s
    ease;

}


.mg-owners__cta:hover
.mg-owners__cta-arrow {

  color:
    #fff;


  background:
    var(--mg-red);

}


.mg-owners__cta-arrow
svg {

  width:
    1vw;

}


.mg-owners__header-right
p {

  width:
    min(
      100%,
      390px
    );


  margin:
    1.65vw
    0
    0;


  color:
    #5e605e;


  font-size:
    0.82vw;


  line-height:
    1.65;


  letter-spacing:
    -.015em;

}


/* =========================================================
   MAIN STAGE
========================================================= */

.mg-owners__stage {

  display:
    grid;


  grid-template-columns:
    minmax(
      0,
      2.08fr
    )
    minmax(
      210px,
      .97fr
    )
    minmax(
      230px,
      1.05fr
    )
    minmax(
      170px,
      .62fr
    );


  gap:
    clamp(
      17px,
      1.5vw,
      27px
    );


  align-items:
    end;

}


/* =========================================================
   CUSTOMER CAROUSEL
========================================================= */

.mg-owner-card {

  position:
    relative;


  height:
    clamp(
      500px,
      38vw,
      610px
    );


  overflow:
    visible;


  border-radius:
    16px;


  background:
    var(--card);


  box-shadow:
    0
    10px
    25px
    rgba(
      0,
      0,
      0,
      .018
    );

}


.mg-owner-card__visual {

  position:
    relative;


  width:
    100%;


  height:
    72%;


  overflow:
    hidden;


  border-radius:
    16px
    16px
    0
    0;


  background:
    #d8d8d6;

}


.mg-owner-card__image {

  position:
    absolute;


  inset:
    0;


  width:
    100%;


  height:
    100%;


  object-fit:
    cover;


  transform:
    scale(
      1.01
    );

}


/* Customer photos are usually portrait-ish.
   A slight zoom makes them sit better in this wide card. */

.mg-owner-card__image {

  transform:
    scale(
      1.045
    );

}


.mg-owner-card__image-overlay {

  position:
    absolute;


  inset:
    0;


  pointer-events:
    none;


  background:
    linear-gradient(
      180deg,
      rgba(
        0,
        0,
        0,
        .05
      ),
      transparent
      40%
    ),
    linear-gradient(
      0deg,
      rgba(
        0,
        0,
        0,
        .36
      ),
      transparent
      46%
    );

}


/* =========================================================
   IMAGE TAG
========================================================= */

.mg-owner-card__image-tag {

  position:
    absolute;


  left:
    1.05vw;


  bottom:
    1vw;


  z-index:
    6;


  display:
    flex;


  align-items:
    center;


  gap:
    .45vw;


  padding:
    .46vw
    .62vw;


  border:
    1px
    solid
    rgba(
      255,
      255,
      255,
      .3
    );


  border-radius:
    999px;


  background:
    rgba(
      0,
      0,
      0,
      .32
    );


  backdrop-filter:
    blur(
      .7vw
    );


  -webkit-backdrop-filter:
    blur(
      .7vw
    );


  color:
    #fff;


  font-size:
    0.50vw;


  font-weight:
    700;


  letter-spacing:
    .12em;


  text-transform:
    uppercase;

}


.mg-owner-card__image-tag
i {

  width:
    1vw;


  height:
    1px;


  background:
    rgba(
      255,
      255,
      255,
      .42
    );

}


/* =========================================================
   INDEX
========================================================= */

.mg-owner-card__index {

  position:
    absolute;


  right:
    1.05vw;


  bottom:
    1vw;


  z-index:
    6;


  display:
    flex;


  align-items:
    center;


  gap:
    .4vw;


  padding:
    .4vw
    .55vw;


  border-radius:
    999px;


  background:
    rgba(
      0,
      0,
      0,
      .42
    );


  backdrop-filter:
    blur(
      .6vw
    );


  -webkit-backdrop-filter:
    blur(
      .6vw
    );


  color:
    rgba(
      255,
      255,
      255,
      .84
    );


  font-size:
    0.52vw;


  font-weight:
    600;


  letter-spacing:
    .1em;

}


.mg-owner-card__index
i {

  width:
    1.05vw;


  height:
    1px;


  background:
    rgba(
      255,
      255,
      255,
      .4
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

.mg-owner-card__nav {

  position:
    absolute;


  top:
    4px;


  z-index:
    20;


  width:
    3.15vw;


  height:
    3.15vw;


  display:
    grid;


  place-items:
    center;


  padding:
    0;


  border:
    .25vw
    solid
    var(--page);


  border-radius:
    .9vw;


  background:
    linear-gradient(
      145deg,
      #30312f,
      #080808
    );


  color:
    #fff;


  cursor:
    pointer;


  box-sizing:
    content-box;


  transition:
    background
    .3s
    ease,
    transform
    .3s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    );

}


.mg-owner-card__nav:hover {

  background:
    var(--mg-red);

}


.mg-owner-card__nav--prev {

  left:
    0;


  transform:
    translate(
      -3px,
      -4px
    );

}


.mg-owner-card__nav--prev:hover {

  transform:
    translate(
      -6px,
      -4px
    );

}


.mg-owner-card__nav--next {

  right:
    0;


  transform:
    translate(
      3px,
      -4px
    );

}


.mg-owner-card__nav--next:hover {

  transform:
    translate(
      6px,
      -4px
    );

}


.mg-owner-card__nav
svg {

  width:
    1.05vw;

}


/* =========================================================
   COPY
========================================================= */

.mg-owner-card__copy {

  position:
    relative;


  height:
    28%;


  display:
    flex;


  flex-direction:
    column;


  justify-content:
    space-between;


  padding:
    clamp(
      18px,
      1.7vw,
      26px
    )
    clamp(
      20px,
      1.75vw,
      27px
    )
    18px;


  box-sizing:
    border-box;

}


.mg-owner-card__copy-inner {

  min-width:
    0;

}


.mg-owner-card__copy
blockquote {

  max-width:
    610px;


  margin:
    0;


  font-size:
    1.18vw;


  font-weight:
    500;


  line-height:
    1.44;


  letter-spacing:
    -.025em;

}


.mg-owner-card__copy
p {

  margin:
    .9vw
    0
    0;


  color:
    #666765;


  font-size:
    0.78vw;


  font-weight:
    500;

}


.mg-owner-card__progress {

  position:
    absolute;


  right:
    1.2vw;


  bottom:
    1.15vw;


  display:
    flex;


  gap:
    .3vw;

}


.mg-owner-card__progress
button {

  width:
    1vw;


  height:
    2px;


  padding:
    0;


  border:
    0;


  background:
    #d1d2cf;


  cursor:
    pointer;


  transition:
    width
    .35s
    ease,
    background
    .35s
    ease;

}


.mg-owner-card__progress
button.is-active {

  width:
    1.7vw;


  background:
    var(--mg-red);

}


/* =========================================================
   CAROUSEL TRANSITIONS
========================================================= */

.owner-image-enter-active,
.owner-image-leave-active {

  transition:
    opacity
    .46s
    ease,
    transform
    .8s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    );

}


.owner-image-enter-from {

  opacity:
    0;


  transform:
    scale(
      1.09
    );

}


.owner-image-leave-to {

  opacity:
    0;


  transform:
    scale(
      1.02
    );

}


.owner-copy-enter-active,
.owner-copy-leave-active {

  transition:
    opacity
    .3s
    ease,
    transform
    .4s
    ease;

}


.owner-copy-enter-from {

  opacity:
    0;


  transform:
    translateY(
      7px
    );

}


.owner-copy-leave-to {

  opacity:
    0;


  transform:
    translateY(
      -5px
    );

}


/* =========================================================
   STAT CARDS
========================================================= */

.mg-stat {

  position:
    relative;


  display:
    flex;


  flex-direction:
    column;


  justify-content:
    space-between;


  min-width:
    0;


  padding:
    clamp(
      24px,
      2vw,
      32px
    );


  box-sizing:
    border-box;


  border-radius:
    16px;


  background:
    rgba(
      255,
      255,
      255,
      .68
    );


  overflow:
    hidden;

}


.mg-stat--experience {

  height:
    clamp(
      330px,
      27vw,
      430px
    );

}


.mg-stat--since {

  height:
    clamp(
      410px,
      34vw,
      520px
    );

}


.mg-stat__topline {

  display:
    flex;


  align-items:
    center;


  gap:
    .45vw;


  color:
    rgba(
      0,
      0,
      0,
      .34
    );


  font-size:
    0.50vw;


  font-weight:
    700;


  letter-spacing:
    .12em;

}


.mg-stat__topline
i {

  width:
    1.35vw;


  height:
    1px;


  background:
    rgba(
      0,
      0,
      0,
      .14
    );

}


.mg-stat__number {

  display:
    flex;


  align-items:
    flex-start;


  color:
    #898b89;


  line-height:
    1;


  margin-top:
    1.1vw;

}


.mg-stat__number
strong {

  font-size:
    4.4vw;


  font-weight:
    400;


  line-height:
    .94;


  letter-spacing:
    -.075em;

}


.mg-stat__number
span {

  margin-left:
    .18vw;


  font-size:
    2.5vw;


  font-weight:
    400;


  line-height:
    .9;

}


.mg-stat__number--year
strong {

  font-size:
    4vw;

}


.mg-stat__bottom
span {

  display:
    block;


  margin-bottom:
    .25vw;


  color:
    #707270;


  font-size:
    0.78vw;

}


.mg-stat__bottom
strong {

  display:
    block;


  color:
    #565856;


  font-size:
    0.82vw;


  font-weight:
    500;

}


.mg-stat::after {

  content:
    "";


  position:
    absolute;


  left:
    0;


  bottom:
    0;


  width:
    0;


  height:
    3px;


  background:
    var(--mg-red);


  transition:
    width
    .55s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    );

}


.mg-stat:hover::after {

  width:
    100%;

}


/* =========================================================
   GOOGLE REVIEWS
========================================================= */

.mg-google-proof {

  align-self:
    end;


  min-width:
    0;


  padding:
    1.15vw
    .35vw
    .2vw;


  border-top:
    1px
    solid
    rgba(
      0,
      0,
      0,
      .1
    );

}


.mg-google-proof__logo {

  width:
    2.3vw;


  height:
    2.3vw;


  margin-bottom:
    .8vw;

}


.mg-google-proof__logo
svg {

  display:
    block;


  width:
    100%;


  height:
    100%;

}


.mg-google-proof__eyebrow {

  display:
    block;


  margin-bottom:
    .42vw;


  color:
    #777977;


  font-size:
    0.50vw;


  font-weight:
    700;


  letter-spacing:
    .14em;

}


.mg-google-proof__title {

  display:
    block;


  color:
    #171817;


  font-size:
    0.88vw;


  font-weight:
    600;


  line-height:
    1.25;

}


.mg-google-proof__stars {

  display:
    flex;


  align-items:
    center;


  gap:
    .15vw;


  margin-top:
    .5vw;


  color:
    #fbbc04;

}


.mg-google-proof__stars
svg {

  width:
    .65vw;


  height:
    .65vw;

}


.mg-google-proof__content
p {

  margin:
    .6vw
    0
    0;


  color:
    #666866;


  font-size:
    0.72vw;


  line-height:
    1.52;

}


.mg-google-proof__link {

  display:
    inline-flex;


  align-items:
    center;


  gap:
    .35vw;


  margin-top:
    .7vw;


  color:
    #171817;


  text-decoration:
    none;


  font-size:
    0.68vw;


  font-weight:
    650;

}


.mg-google-proof__link
svg {

  width:
    .72vw;


  transition:
    transform
    .3s
    ease;

}


.mg-google-proof__link:hover
svg {

  transform:
    translate(
      .12vw,
      -.12vw
    );

}


/* =========================================================
   LARGE SCREEN FONT SIZES ONLY
========================================================= */

@media (min-width: 1440px) {
  .mg-owners__eyebrow {
    font-size: clamp(11px, 0.60vw, 13px);
  }

  .mg-owners__heading h2 {
    font-size: clamp(42px, 2.8vw, 58px);
  }

  .mg-owners__cta,
  .mg-owners__header-right p,
  .mg-owner-card__copy p,
  .mg-stat__bottom span,
  .mg-stat__bottom strong,
  .mg-google-proof__content p,
  .mg-google-proof__link {
    font-size: clamp(12px, 0.78vw, 15px);
  }

  .mg-owner-card__copy blockquote {
    font-size: clamp(18px, 1.18vw, 23px);
  }

  .mg-owner-card__image-tag,
  .mg-owner-card__index,
  .mg-stat__topline,
  .mg-google-proof__eyebrow {
    font-size: clamp(9px, 0.52vw, 11px);
  }

  .mg-google-proof__title {
    font-size: clamp(14px, 0.88vw, 18px);
  }
}


/* =========================================================
   SMALL DESKTOP
========================================================= */

@media (
  max-width:
  1180px
) {

  .mg-owners__header {

    gap:
      60px;


    margin-bottom:
      80px;

  }


  .mg-owners__stage {

    grid-template-columns:
      1.8fr
      .8fr
      .9fr;

  }


  .mg-google-proof {

    grid-column:
      3;


    margin-top:
      18px;

  }


  .mg-owner-card {

    height:
      500px;

  }


  .mg-stat--experience {

    height:
      340px;

  }


  .mg-stat--since {

    height:
      420px;

  }

}


/* =========================================================
   TABLET
========================================================= */

@media (
  max-width:
  900px
) {

  .mg-owners__header {

    grid-template-columns:
      1fr
      .8fr;


    gap:
      40px;


    margin-bottom:
      65px;

  }


  .mg-owners__eyebrow {

    font-size:
      .8vw;

  }


  .mg-owners__stage {

    grid-template-columns:
      1.55fr
      .72fr
      .72fr;


    gap:
      14px;

  }


  .mg-owner-card {

    height:
      470px;

  }


  .mg-owner-card__visual {

    height:
      69%;

  }


  .mg-owner-card__copy {

    height:
      31%;

  }


  .mg-stat--experience {

    height:
      310px;

  }


  .mg-stat--since {

    height:
      380px;

  }


  .mg-stat {

    padding:
      20px;

  }


  .mg-stat__number
  strong {

    font-size:
      47px;

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width:
  767px
) {

  .mg-owners {

    padding:
      58px
      0
      65px;

  }


  .mg-owners__container {

    width:
      calc(
        100% - 30px
      );

  }


  .mg-owners__header {

    display:
      block;


    margin-bottom:
      48px;

  }


  .mg-owners__eyebrow {

    margin-bottom:
      18px;


    font-size:
      2.1vw;

  }


  .mg-owners__heading
  h2 {

    font-size:
      8.7vw;


    font-weight:
      600;

  }


  .mg-owners__header-right {

    display:
      grid;


    grid-template-columns:
      1fr;


    gap:
      18px;


    margin-top:
      28px;


    padding:
      0;

  }


  .mg-owners__cta {

    align-self:
      auto;


    justify-self:
      start;


    order:
      2;


    min-width:
      205px;


    height:
      50px;


    padding:
      4px
      5px
      4px
      18px;


    border-radius:
      14px;


    font-size:
      2.2vw;

  }


  .mg-owners__cta-arrow {

    width:
      41px;


    height:
      41px;


    flex-basis:
      41px;


    border-radius:
      11px;

  }


  .mg-owners__cta-arrow
  svg {

    width:
      15px;

  }


  .mg-owners__header-right
  p {

    order:
      1;


    max-width:
      330px;


    margin:
      0;


    font-size:
      2.6vw;

  }


  .mg-owners__stage {

    display:
      grid;


    grid-template-columns:
      repeat(
        2,
        minmax(
          0,
          1fr
        )
      );


    gap:
      12px;

  }


  .mg-owner-card {

    grid-column:
      1
      /
      3;


    height:
      520px;


    border-radius:
      14px;

  }


  .mg-owner-card__visual {

    height:
      70%;


    border-radius:
      14px
      14px
      0
      0;

  }


  .mg-owner-card__copy {

    height:
      30%;


    padding:
      20px;

  }


  .mg-owner-card__copy
  blockquote {

    max-width:
      95%;


    font-size:
      3.8vw;

  }


  .mg-owner-card__copy
  p {

    font-size:
      2.1vw;

  }


  .mg-owner-card__image-tag {

    left:
      12px;


    bottom:
      12px;


    gap:
      6px;


    padding:
      7px
      9px;


    font-size:
      1.5vw;

  }


  .mg-owner-card__index {

    right:
      12px;


    bottom:
      12px;


    padding:
      6px
      8px;


    font-size:
      1.6vw;

  }


  .mg-owner-card__nav {

    top:
      3px;


    width:
      45px;


    height:
      45px;


    border:
      4px
      solid
      var(--page);


    border-radius:
      13px;

  }


  .mg-owner-card__nav
  svg {

    width:
      17px;

  }


  .mg-owner-card__progress {

    right:
      18px;


    bottom:
      17px;


    gap:
      5px;

  }


  .mg-owner-card__progress
  button {

    width:
      16px;

  }


  .mg-owner-card__progress
  button.is-active {

    width:
      28px;

  }


  .mg-stat {

    height:
      260px
      !important;


    padding:
      20px;


    border-radius:
      14px;

  }


  .mg-stat__topline {

    font-size:
      1.6vw;

  }


  .mg-stat__number
  strong {

    font-size:
      11vw;

  }


  .mg-stat__number--year
  strong {

    font-size:
      9.7vw;

  }


  .mg-stat__bottom
  span,
  .mg-stat__bottom
  strong {

    font-size:
      2.1vw;

  }


  .mg-google-proof {

    grid-column:
      1
      /
      3;


    display:
      grid;


    grid-template-columns:
      auto
      1fr;


    gap:
      14px;


    margin:
      18px
      0
      0;


    padding:
      22px
      0
      0;

  }


  .mg-google-proof__logo {

    width:
      38px;


    height:
      38px;


    margin:
      0;

  }


  .mg-google-proof__eyebrow {

    font-size:
      1.6vw;

  }


  .mg-google-proof__title {

    font-size:
      2.8vw;

  }


  .mg-google-proof__stars {

    gap:
      2px;


    margin-top:
      6px;

  }


  .mg-google-proof__stars
  svg {

    width:
      12px;


    height:
      12px;

  }


  .mg-google-proof__content
  p {

    max-width:
      300px;


    margin-top:
      7px;


    font-size:
      2.1vw;

  }


  .mg-google-proof__link {

    gap:
      5px;


    margin-top:
      9px;


    font-size:
      2.1vw;

  }


  .mg-google-proof__link
  svg {

    width:
      12px;

  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (
  max-width:
  440px
) {

  .mg-owners__heading
  h2 {

    font-size:
      8.4vw;

  }


  .mg-owner-card {

    height:
      475px;

  }


  .mg-owner-card__visual {

    height:
      66%;

  }


  .mg-owner-card__copy {

    height:
      34%;

  }


  .mg-owner-card__copy
  blockquote {

    font-size:
      3.55vw;


    line-height:
      1.42;

  }


  .mg-stat {

    height:
      225px
      !important;


    padding:
      17px;

  }


  .mg-stat__number
  strong {

    font-size:
      10vw;

  }


  .mg-stat__number--year
  strong {

    font-size:
      8.6vw;

  }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion:
  reduce
) {

  .mg-owners *,
  .mg-owners *::before,
  .mg-owners *::after {

    animation-duration:
      .01ms
      !important;


    animation-iteration-count:
      1
      !important;


    transition-duration:
      .01ms
      !important;

  }

}
</style>
