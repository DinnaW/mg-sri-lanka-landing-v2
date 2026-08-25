<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

/* =========================================================
   HERO SLIDES
   You only need to change the youtubeId / copy here later.
========================================================= */

const slides = [
  {
    id: "s5-ev",
    eyebrow: "100% Electric",
    model: "MG S5 EV",
    tagline: "The EV that makes sense.",
    youtubeId: "ABUkN22N0F4",
    vehicleImage: asset("images/345.png"),
    modelLink: "#mg-range",
    testDriveLink: "#showroom",
  },
  {
    id: "mg4-electric",
    eyebrow: "100% Electric",
    model: "MG4 Electric",
    tagline: "Electric energy with a different attitude.",
    youtubeId: "K8EcIct77xY",
    vehicleImage: asset("images/234.png"),
    modelLink: "#mg-range",
    testDriveLink: "#showroom",
  },
  {
    id: "zs-ev",
    eyebrow: "100% Electric",
    model: "MG ZS EV",
    tagline: "Electric freedom made for everyday life.",
    youtubeId: "md1ZJLCxK6E",
    vehicleImage: asset("images/123.png"),
    modelLink: "#mg-range",
    testDriveLink: "#showroom",
  },
  {
    id: "hs",
    eyebrow: "Performance SUV",
    model: "MG HS",
    tagline: "Confident performance. Refined for every journey.",
    youtubeId: "Q3wGHI8ncG4",
    vehicleImage: asset("images/567.png"),
    modelLink: "#mg-range",
    testDriveLink: "#showroom",
  },
];

/* =========================================================
   SLIDER SETTINGS
========================================================= */

const AUTO_DURATION = 10000;
const VIDEO_REVEAL_DELAY = 450;
const CROSSFADE_DURATION = 900;
const VIDEO_FALLBACK_DELAY = 2600;

/* =========================================================
   STATE
========================================================= */

const activeIndex = ref(0);
const previousIndex = ref(null);
const isSwitching = ref(false);
const isPaused = ref(false);

/*
  Important:
  Each iframe receives its own loaded state.
  We DO NOT preload all four hidden iframes.
  Only the active + outgoing iframe are mounted.
*/
const videoReady = reactive(
  Object.fromEntries(
    slides.map((_, index) => [index, false])
  )
);

const mountVersion = reactive(
  Object.fromEntries(
    slides.map((_, index) => [index, 0])
  )
);

let autoTimer = null;
let transitionTimer = null;
let fallbackTimer = null;

const revealTimers = new Map();

/* =========================================================
   COMPUTED
========================================================= */

const activeSlide = computed(
  () => slides[activeIndex.value]
);

const currentNumber = computed(
  () => String(activeIndex.value + 1).padStart(2, "0")
);

const totalNumber = String(slides.length).padStart(2, "0");

/* =========================================================
   YOUTUBE
========================================================= */

const youtubeUrl = (slide) => {
  const origin =
    typeof window !== "undefined"
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : "";

  return (
    `https://www.youtube.com/embed/${slide.youtubeId}` +
    `?autoplay=1` +
    `&mute=1` +
    `&controls=0` +
    `&loop=1` +
    `&playlist=${slide.youtubeId}` +
    `&rel=0` +
    `&playsinline=1` +
    `&disablekb=1` +
    `&fs=0` +
    `&iv_load_policy=3` +
    `&modestbranding=1` +
    `&enablejsapi=1` +
    origin
  );
};

/* =========================================================
   RENDER HELPERS
========================================================= */

const shouldRenderVideo = (index) =>
  index === activeIndex.value ||
  index === previousIndex.value;

const videoKey = (index) =>
  `${slides[index].id}-${mountVersion[index]}`;

/* =========================================================
   TIMERS
========================================================= */

const clearAutoTimer = () => {
  if (autoTimer) {
    window.clearTimeout(autoTimer);
    autoTimer = null;
  }
};

const clearTransitionTimer = () => {
  if (transitionTimer) {
    window.clearTimeout(transitionTimer);
    transitionTimer = null;
  }
};

const clearFallbackTimer = () => {
  if (fallbackTimer) {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
};

const clearRevealTimer = (index) => {
  const timer = revealTimers.get(index);

  if (timer) {
    window.clearTimeout(timer);
    revealTimers.delete(index);
  }
};

/* =========================================================
   AUTOPLAY
========================================================= */

const scheduleAutoAdvance = () => {
  clearAutoTimer();

  if (isPaused.value) {
    return;
  }

  autoTimer = window.setTimeout(() => {
    const next =
      (activeIndex.value + 1) %
      slides.length;

    goToSlide(next, true);
  }, AUTO_DURATION);
};

/* =========================================================
   FINISH TRANSITION
========================================================= */

const finishTransition = (index) => {
  /*
    Ignore a late load event from an iframe that is no
    longer the active slide.
  */
  if (index !== activeIndex.value) {
    return;
  }

  clearFallbackTimer();
  clearTransitionTimer();

  /*
    Let Vue paint the new iframe at opacity:1 first,
    then remove the outgoing iframe after the CSS fade.
  */
  transitionTimer = window.setTimeout(() => {
    previousIndex.value = null;
    isSwitching.value = false;
  }, CROSSFADE_DURATION);
};

/* =========================================================
   IFRAME LOAD
========================================================= */

const handleVideoLoad = (index) => {
  clearRevealTimer(index);

  const timer = window.setTimeout(async () => {
    /*
      If the iframe became an outgoing slide before its
      delayed load callback ran, do nothing.
    */
    if (index !== activeIndex.value) {
      return;
    }

    videoReady[index] = true;

    await nextTick();

    finishTransition(index);

    revealTimers.delete(index);
  }, VIDEO_REVEAL_DELAY);

  revealTimers.set(index, timer);
};

/* =========================================================
   FALLBACK

   An embed can occasionally take longer to fire @load.
   Never leave navigation permanently locked.
========================================================= */

const createVideoFallback = (index) => {
  clearFallbackTimer();

  fallbackTimer = window.setTimeout(async () => {
    if (index !== activeIndex.value) {
      return;
    }

    videoReady[index] = true;

    await nextTick();

    finishTransition(index);
  }, VIDEO_FALLBACK_DELAY);
};

/* =========================================================
   NAVIGATION
========================================================= */

const goToSlide = async (index, fromAuto = false) => {
  if (
    index < 0 ||
    index >= slides.length ||
    index === activeIndex.value
  ) {
    if (!fromAuto) {
      scheduleAutoAdvance();
    }

    return;
  }

  /*
    Do not permanently block navigation.
    A fast user click during a crossfade simply starts
    the newest requested transition.
  */
  clearAutoTimer();
  clearTransitionTimer();
  clearFallbackTimer();

  const outgoingIndex = activeIndex.value;

  previousIndex.value = outgoingIndex;
  activeIndex.value = index;
  isSwitching.value = true;

  /*
    The target iframe is mounted fresh every time.
    This is the key fix for the previous implementation.
  */
  videoReady[index] = false;
  mountVersion[index] += 1;

  await nextTick();

  createVideoFallback(index);
  scheduleAutoAdvance();
};

const nextSlide = () => {
  const next =
    (activeIndex.value + 1) %
    slides.length;

  goToSlide(next);
};

const previousSlide = () => {
  const previous =
    (activeIndex.value - 1 + slides.length) %
    slides.length;

  goToSlide(previous);
};

/* =========================================================
   PAGE VISIBILITY
========================================================= */

const handleVisibilityChange = () => {
  isPaused.value = document.hidden;

  if (document.hidden) {
    clearAutoTimer();
  } else {
    scheduleAutoAdvance();
  }
};

/* =========================================================
   KEYBOARD
========================================================= */

const handleKeydown = (event) => {
  if (event.key === "ArrowRight") {
    nextSlide();
  }

  if (event.key === "ArrowLeft") {
    previousSlide();
  }
};

/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(() => {
  /*
    First iframe is already mounted by the template.
    Fallback guarantees the cover cannot stay forever.
  */
  createVideoFallback(0);
  scheduleAutoAdvance();

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  window.addEventListener(
    "keydown",
    handleKeydown
  );
});

onBeforeUnmount(() => {
  clearAutoTimer();
  clearTransitionTimer();
  clearFallbackTimer();

  revealTimers.forEach((timer) => {
    window.clearTimeout(timer);
  });

  revealTimers.clear();

  document.removeEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  window.removeEventListener(
    "keydown",
    handleKeydown
  );
});
</script>

<template>
  <section class="mg-hero">
    <!-- =====================================================
         VIDEO LAYERS
    ====================================================== -->
    <div class="mg-hero__videos">
      <template
        v-for="(slide, index) in slides"
        :key="slide.id"
      >
        <div
          v-if="shouldRenderVideo(index)"
          :key="videoKey(index)"
          class="mg-hero__video"
          :class="{
            'is-active':
              index === activeIndex &&
              videoReady[index],
            'is-previous':
              index === previousIndex,
          }"
        >
          <iframe
            :src="youtubeUrl(slide)"
            :title="`${slide.model} cinematic background`"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
            tabindex="-1"
            @load="handleVideoLoad(index)"
          ></iframe>
        </div>
      </template>

      <!-- Only covers the very first video startup -->
      <div
        class="mg-hero__startup-cover"
        :class="{
          'is-hidden': videoReady[0],
        }"
      ></div>
    </div>

    <!-- =====================================================
         CINEMATIC OVERLAYS
    ====================================================== -->
    <div class="mg-hero__overlay"></div>
    <div class="mg-hero__side-shade"></div>
    <div class="mg-hero__bottom-shade"></div>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <div class="mg-hero__container">
      <!-- COPY -->
      <Transition
        name="hero-copy"
        mode="out-in"
      >
        <div
          :key="activeSlide.id"
          class="mg-hero__intro"
        >
          <span class="mg-hero__label">
            {{ activeSlide.eyebrow }}
          </span>

          <h1 class="mg-hero__title">
            {{ activeSlide.model }}
          </h1>

          <p class="mg-hero__tagline">
            {{ activeSlide.tagline }}
          </p>
        </div>
      </Transition>

      <!-- ===================================================
           BOTTOM SLIDER TRACK
           Separate arrow icons removed.
           Navigation arrow now lives beside Test Drive.
      ==================================================== -->
      <div class="mg-hero__slider-nav">
        <div class="mg-hero__counter">
          <strong>{{ currentNumber }}</strong>
          <span>/</span>
          <small>{{ totalNumber }}</small>
        </div>

        <div class="mg-hero__tabs">
          <button
            v-for="(slide, index) in slides"
            :key="`${slide.id}-navigation`"
            type="button"
            class="mg-hero__tab"
            :class="{
              'is-active': index === activeIndex,
            }"
            :aria-current="
              index === activeIndex
                ? 'true'
                : undefined
            "
            :aria-label="`Show ${slide.model}`"
            @click.stop="goToSlide(index)"
          >
            <span class="mg-hero__tab-line">
              <i></i>
            </span>

            <span class="mg-hero__tab-copy">
              {{ slide.model }}
            </span>
          </button>
        </div>
      </div>

      <!-- ===================================================
           ACTIVE VEHICLE CARD
      ==================================================== -->
      <Transition
        name="vehicle-card-swap"
        mode="out-in"
      >
        <div
          :key="activeSlide.id"
          class="vehicle-card"
        >
          <a
            :href="activeSlide.modelLink"
            class="vehicle-card__image"
          >
            <div class="vehicle-card__vehicle-bg"></div>

            <img
              :src="activeSlide.vehicleImage"
              :alt="activeSlide.model"
            />

            <div class="vehicle-card__image-shade"></div>

            <div class="vehicle-card__meta">
              <span>Featured model</span>

              <strong>
                {{ activeSlide.model }}
              </strong>
            </div>
          </a>

          <div class="vehicle-card__bottom">
            <a
              :href="activeSlide.testDriveLink"
              class="vehicle-card__testdrive"
            >
              <span class="vehicle-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />

                  <path
                    d="M4.6 10.5h14.8M12 14v6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </span>

              <span>Test Drive</span>
            </a>

            <button
              type="button"
              class="vehicle-card__next"
              :aria-label="`Show next MG vehicle after ${activeSlide.model}`"
              @click.stop="nextSlide"
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
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
@import url(
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"
);

/* =========================================================
   HERO
========================================================= */

.mg-hero {
  --mg-red: #e51920;

  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 680px;
  overflow: hidden;
  background: #000;
  color: #fff;
  isolation: isolate;
  font-family: "Manrope", sans-serif;
}

/* =========================================================
   VIDEO
========================================================= */

.mg-hero__videos {
  position: absolute;
  inset: 0;
  z-index: -6;
  overflow: hidden;
  background: #000;
}

.mg-hero__video {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  overflow: hidden;
  transform: scale(1.025);
  transition:
    opacity .9s cubic-bezier(.22, 1, .36, 1),
    transform 1.5s cubic-bezier(.22, 1, .36, 1);
}

.mg-hero__video.is-previous {
  z-index: 1;
  opacity: 1;
  transform: scale(1);
}

.mg-hero__video.is-active {
  z-index: 2;
  opacity: 1;
  transform: scale(1);
}

.mg-hero__video iframe {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 100vw;
  height: 56.25vw;

  min-width: 177.78vh;
  min-height: 100vh;

  transform:
    translate(-50%, -50%)
    scale(1.018);

  border: 0;
  pointer-events: none;
}

/*
  Startup cover is ONLY for the first page load.
  During later transitions, the outgoing video remains
  visible until the incoming iframe is ready.
*/

.mg-hero__startup-cover {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: #000;
  opacity: 1;
  pointer-events: none;
  transition:
    opacity .75s cubic-bezier(.16, 1, .3, 1),
    visibility .75s ease;
}

.mg-hero__startup-cover.is-hidden {
  opacity: 0;
  visibility: hidden;
}

/* =========================================================
   OVERLAYS

   pointer-events:none is important:
   these layers can NEVER block slider navigation.
========================================================= */

.mg-hero__overlay,
.mg-hero__side-shade,
.mg-hero__bottom-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mg-hero__overlay {
  z-index: -5;

  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, .30) 0%,
      rgba(0, 0, 0, .04) 28%,
      rgba(0, 0, 0, .015) 58%,
      rgba(0, 0, 0, .18) 100%
    );
}

.mg-hero__side-shade {
  z-index: -4;

  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, .15) 0%,
      transparent 25%,
      transparent 73%,
      rgba(0, 0, 0, .08) 100%
    );
}

.mg-hero__bottom-shade {
  z-index: -3;

  background:
    linear-gradient(
      0deg,
      rgba(0, 0, 0, .62) 0%,
      rgba(0, 0, 0, .18) 23%,
      transparent 50%
    );
}

/* =========================================================
   CONTAINER
========================================================= */

.mg-hero__container {
  position: relative;
  z-index: 10;

  width: 100% !important;
  max-width: none !important;
  height: 100%;

  margin: 0 !important;

  padding-left: var(--mg-page-gutter, 5vw) !important;
  padding-right: var(--mg-page-gutter, 5vw) !important;

  box-sizing: border-box !important;

  pointer-events: none;
}

/*
  Individual interactive elements opt back into
  pointer events. This prevents invisible hero layers
  from swallowing clicks.
*/

.mg-hero__slider-nav,
.vehicle-card,
.vehicle-card a,
.vehicle-card button {
  pointer-events: auto;
}

/* =========================================================
   INTRO
========================================================= */

.mg-hero__intro {
  position: absolute;
  top: 7.2vw;
  left: 50%;
  width: 52vw;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.mg-hero__label {
  display: block;
  margin-bottom: .55vw;
  color: rgba(255, 255, 255, .84);
  font-size: clamp(14px, 0.82vw, 17px);
  font-weight: 650;
  letter-spacing: .18em;
  text-transform: uppercase;
}

.mg-hero__title {
  margin: 0;
  font-family: "Barlow Condensed", sans-serif;
  font-size: clamp(62px, 4.35vw, 86px);
  font-weight: 500;
  line-height: .91;
  letter-spacing: -.025em;
  text-transform: uppercase;
  text-shadow:
    0 .25vw 1.4vw rgba(0, 0, 0, .22);
}

.mg-hero__tagline {
  margin: .62vw 0 0;
  color: rgba(255, 255, 255, .94);
  font-size: clamp(18px, 1.2vw, 24px);
  font-weight: 400;
  text-shadow:
    0 .2vw 1vw rgba(0, 0, 0, .3);
}

/* =========================================================
   COPY TRANSITION
========================================================= */

.hero-copy-enter-active,
.hero-copy-leave-active {
  transition:
    opacity .45s ease,
    transform .65s cubic-bezier(.16, 1, .3, 1),
    filter .45s ease;
}

.hero-copy-enter-from {
  opacity: 0;
  transform:
    translateX(-50%)
    translateY(1vw);
  filter: blur(.25vw);
}

.hero-copy-leave-to {
  opacity: 0;
  transform:
    translateX(-50%)
    translateY(-.65vw);
  filter: blur(.18vw);
}

/* =========================================================
   SLIDER NAVIGATION
========================================================= */

.mg-hero__slider-nav {
  position: absolute;
  left: var(--mg-page-gutter, 5vw);
  bottom: 2.65vw;
  z-index: 60;

  width: min(47vw, 850px);

  display: grid;
  grid-template-columns:
    auto
    minmax(0, 1fr);

  align-items: center;
  gap: 1.3vw;
}

/* COUNTER */

.mg-hero__counter {
  min-width: 3.4vw;
  display: flex;
  align-items: baseline;
  gap: .27vw;
  font-variant-numeric: tabular-nums;
}

.mg-hero__counter strong {
  font-family: "Barlow Condensed", sans-serif;
  font-size: clamp(23px, 1.5vw, 31px);
  font-weight: 500;
}

.mg-hero__counter span,
.mg-hero__counter small {
  color: rgba(255, 255, 255, .5);
  font-size: clamp(12px, 0.72vw, 15px);
  font-weight: 600;
}

/* TABS */

.mg-hero__tabs {
  min-width: 0;

  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: .72vw;
}

.mg-hero__tab {
  position: relative;
  z-index: 65;

  min-width: 0;
  padding: .25vw 0 .2vw;

  border: 0;

  appearance: none;
  -webkit-appearance: none;

  background: transparent;
  color: rgba(255, 255, 255, .52);

  text-align: left;
  font: inherit;

  cursor: pointer;
  pointer-events: auto;

  transition: color .3s ease;
}

.mg-hero__tab:hover,
.mg-hero__tab.is-active {
  color: #fff;
}

.mg-hero__tab-line {
  position: relative;

  display: block;

  width: 100%;
  height: 1px;

  overflow: hidden;

  background:
    rgba(255, 255, 255, .23);
}

.mg-hero__tab-line i {
  position: absolute;
  inset: 0;

  display: block;

  background: #fff;

  transform: scaleX(0);
  transform-origin: left center;
}

.mg-hero__tab.is-active
.mg-hero__tab-line i {
  animation:
    heroSlideProgress
    10s
    linear
    forwards;
}

@keyframes heroSlideProgress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

.mg-hero__tab-copy {
  display: block;

  margin-top: .55vw;

  overflow: hidden;

  font-size: clamp(13px, 0.78vw, 16px);
  font-weight: 650;
  letter-spacing: .07em;

  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

/* =========================================================
   VEHICLE CARD
========================================================= */

.vehicle-card {
  position: absolute;
  right: var(--mg-page-gutter, 5vw);
  bottom: 2.5vw;
  z-index: 55;

  width: 16.3vw;
  padding: .38vw;

  border:
    1px solid
    rgba(255, 255, 255, .12);

  border-radius: .88vw;

  background:
    rgba(7, 7, 7, .58);

  backdrop-filter:
    blur(1.1vw)
    saturate(1.08);

  -webkit-backdrop-filter:
    blur(1.1vw)
    saturate(1.08);

  box-shadow:
    0 1.5vw 4vw rgba(0, 0, 0, .22);

  transition:
    transform .35s ease,
    background .35s ease;
}

.vehicle-card:hover {
  transform: translateY(-.25vw);
  background: rgba(7, 7, 7, .72);
}

.vehicle-card__image {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 8.6;
  overflow: hidden;
  border-radius: .62vw;
  color: #fff;
  text-decoration: none;
  background: #e8e8e4;
}

.vehicle-card__vehicle-bg {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at 50% 82%,
      rgba(0, 0, 0, .15),
      transparent 32%
    ),
    linear-gradient(
      150deg,
      #f0f0ed,
      #d8dbdc
    );
}

.vehicle-card__image img {
  position: absolute;
  left: 50%;
  top: 48%;
  z-index: 2;

  width: 94%;
  height: 85%;

  object-fit: contain;

  transform:
    translate(-50%, -50%)
    scale(1);

  transition:
    transform .65s
    cubic-bezier(.16, 1, .3, 1);
}

.vehicle-card:hover
.vehicle-card__image img {
  transform:
    translate(-50%, -52%)
    scale(1.045);
}

.vehicle-card__image-shade {
  position: absolute;
  inset: 0;
  z-index: 3;

  background:
    linear-gradient(
      0deg,
      rgba(0, 0, 0, .62) 0%,
      rgba(0, 0, 0, .04) 42%,
      transparent 67%
    );
}

.vehicle-card__meta {
  position: absolute;
  left: .78vw;
  bottom: .68vw;
  z-index: 4;
}

.vehicle-card__meta span {
  display: block;
  margin-bottom: .16vw;
  color: rgba(255, 255, 255, .62);
  font-size: clamp(10px, 0.58vw, 12px);
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.vehicle-card__meta strong {
  display: block;
  font-family: "Barlow Condensed", sans-serif;
  font-size: clamp(23px, 1.48vw, 30px);
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
}

.vehicle-card__bottom {
  display: flex;
  align-items: center;
  gap: .38vw;
  padding-top: .38vw;
}

.vehicle-card__testdrive {
  flex: 1;

  height: 2.42vw;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: .48vw;
  padding: 0 .7vw;

  border-radius: .55vw;

  background: #fff;
  color: #080808;

  text-decoration: none;

  transition:
    background .3s ease,
    color .3s ease,
    transform .3s ease;
}

.vehicle-card__testdrive
> span:last-child {
  font-size: clamp(12px, 0.74vw, 15px);
  font-weight: 750;
  letter-spacing: .11em;
  text-transform: uppercase;
}

.vehicle-card__testdrive:hover {
  background: var(--mg-red);
  color: #fff;
  transform: translateY(-.06vw);
}

.vehicle-card__icon {
  width: .95vw;
  height: .95vw;
  display: grid;
  place-items: center;
}

.vehicle-card__icon svg {
  width: 100%;
  height: 100%;
}

.vehicle-card__next {
  position: relative;

  flex: 0 0 2.42vw;

  width: 2.42vw;
  height: 2.42vw;

  display: grid;
  place-items: center;

  padding: 0;

  border:
    1px solid
    rgba(255, 255, 255, .16);

  border-radius: .55vw;

  appearance: none;
  -webkit-appearance: none;

  background:
    rgba(255, 255, 255, .07);

  color: #fff;

  cursor: pointer;

  overflow: hidden;

  transition:
    background .3s ease,
    border-color .3s ease,
    transform .3s ease;
}

/*
  The thin red line is synchronized to the same
  10 second duration as the video/tab autoplay.
*/
.vehicle-card__next::after {
  content: "";

  position: absolute;

  left: 0;
  bottom: 0;

  width: 100%;
  height: 2px;

  background: var(--mg-red);

  transform: scaleX(0);
  transform-origin: left center;

  animation:
    vehicleCardNextProgress
    10s
    linear
    forwards;
}

@keyframes vehicleCardNextProgress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

.vehicle-card__next svg {
  width: .84vw;

  transition:
    transform
    .3s
    cubic-bezier(.16, 1, .3, 1);
}

.vehicle-card__next:hover {
  border-color:
    rgba(255, 255, 255, .3);

  background: var(--mg-red);

  transform: translateX(.1vw);
}

.vehicle-card__next:hover svg {
  transform: translateX(.1vw);
}

.vehicle-card__next:active {
  transform: scale(.96);
}

/* =========================================================
   CARD SWAP
========================================================= */

.vehicle-card-swap-enter-active,
.vehicle-card-swap-leave-active {
  transition:
    opacity .38s ease,
    transform .55s cubic-bezier(.16, 1, .3, 1),
    filter .38s ease;
}

.vehicle-card-swap-enter-from {
  opacity: 0;
  transform: translateY(.85vw);
  filter: blur(.15vw);
}

.vehicle-card-swap-leave-to {
  opacity: 0;
  transform: translateY(-.4vw);
  filter: blur(.1vw);
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {
  .mg-hero__container {
    width: 100% !important;

    padding-left: var(--mg-page-gutter, 5vw) !important;
    padding-right: var(--mg-page-gutter, 5vw) !important;
  }

  .mg-hero__intro {
    top: 9vw;
    width: 58vw;
  }

  .mg-hero__label {
    font-size: .78vw;
  }

  .mg-hero__title {
    font-size: 5.7vw;
  }

  .mg-hero__tagline {
    font-size: 1.3vw;
  }

  .mg-hero__slider-nav {
    width: 54vw;
    bottom: 3vw;
  }

  .mg-hero__tab-copy {
    font-size: .72vw;
  }

  .vehicle-card {
    width: 21vw;
  }

  .vehicle-card__meta strong {
    font-size: 1.5vw;
  }

  .vehicle-card__testdrive,
  .vehicle-card__next {
    height: 3.2vw;
  }

  .vehicle-card__next {
    flex-basis: 3.2vw;
    width: 3.2vw;
  }

  .vehicle-card__testdrive
  > span:last-child {
    font-size: .72vw;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .mg-hero {
    min-height: 680px;
  }

  .mg-hero__video iframe {
    min-width: 190vh;
  }

  .mg-hero__bottom-shade {
    background:
      linear-gradient(
        0deg,
        rgba(0, 0, 0, .72) 0%,
        rgba(0, 0, 0, .22) 42%,
        transparent 69%
      );
  }

  .mg-hero__container {
    width: 100% !important;

    padding-left: var(--mg-page-gutter, 5vw) !important;
    padding-right: var(--mg-page-gutter, 5vw) !important;
  }

  .mg-hero__intro {
    top: 21vw;
    width: calc(100% - 10px);
  }

  .mg-hero__label {
    margin-bottom: 1.6vw;
    font-size: 1.95vw;
  }

  .mg-hero__title {
    font-size: 14vw;
  }

  .mg-hero__tagline {
    margin-top: 1.6vw;
    font-size: 3.5vw;
  }

  .mg-hero__slider-nav {
    left: var(--mg-page-gutter, 5vw);
    bottom: 31vw;
    width: 70%;

    grid-template-columns:
      auto
      1fr;

    gap: 3vw;
  }

  .mg-hero__counter {
    min-width: 9vw;
    gap: .8vw;
  }

  .mg-hero__counter strong {
    font-size: 4.1vw;
  }

  .mg-hero__counter span,
  .mg-hero__counter small {
    font-size: 1.8vw;
  }

  .mg-hero__tabs {
    gap: 1.5vw;
  }

  .mg-hero__tab {
    padding: 1.2vw 0;
  }

  .mg-hero__tab-copy {
    display: none;
  }

  .vehicle-card {
    right: var(--mg-page-gutter, 5vw);
    bottom: 18px;

    width: min(62vw, 245px);

    padding: 5px;
    border-radius: 13px;
  }

  .vehicle-card__image {
    border-radius: 9px;
  }

  .vehicle-card__meta {
    left: 10px;
    bottom: 8px;
  }

  .vehicle-card__meta span {
    margin-bottom: 2px;
    font-size: 5px;
  }

  .vehicle-card__meta strong {
    font-size: 17px;
  }

  .vehicle-card__bottom {
    gap: 5px;
    padding-top: 5px;
  }

  .vehicle-card__testdrive {
    height: 36px;
    gap: 7px;
    border-radius: 8px;
  }

  .vehicle-card__testdrive
  > span:last-child {
    font-size: 7px;
  }

  .vehicle-card__icon {
    width: 16px;
    height: 16px;
  }

  .vehicle-card__next {
    flex-basis: 36px;
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .vehicle-card__next svg {
    width: 14px;
  }

  .hero-copy-enter-from {
    transform:
      translateX(-50%)
      translateY(4vw);

    filter: blur(1vw);
  }

  .hero-copy-leave-to {
    transform:
      translateX(-50%)
      translateY(-2vw);
  }
}

@media (max-width: 420px) {
  .mg-hero__intro {
    top: 20vw;
  }

  .mg-hero__slider-nav {
    bottom: 140px;
    width: 68%;
  }

  .vehicle-card {
    width: 220px;
  }
}

/* =========================================================
   HERO INNER GUTTER
   ---------------------------------------------------------
   Full-width hero using the SAME shared page gutter
   as the header and every content section.
   Change --mg-page-gutter in main.css once to update all sections.
========================================================= */

.mg-hero .mg-hero__container {
  width: 100% !important;
  max-width: none !important;

  margin-left: 0 !important;
  margin-right: 0 !important;

  padding-left: var(--mg-page-gutter, 5vw) !important;
  padding-right: var(--mg-page-gutter, 5vw) !important;

  box-sizing: border-box !important;
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-hero *,
  .mg-hero *::before,
  .mg-hero *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
