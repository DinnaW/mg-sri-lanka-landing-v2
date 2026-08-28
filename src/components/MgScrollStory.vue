<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;


/* =========================================================
   VIDEO
========================================================= */

const videoSrc =
  asset("videos/mg-scroll-story.mp4");


/*
   ONLY USE FIRST 8 SECONDS OF VIDEO
*/

const MAX_VIDEO_SECONDS =
  8;


/* =========================================================
   REFERENCES
========================================================= */

const sectionRef =
  ref(null);

const videoRef =
  ref(null);


/* =========================================================
   STATE
========================================================= */

const progress =
  ref(0);

const videoDuration =
  ref(0);

const usableVideoDuration =
  ref(0);

const isReady =
  ref(false);


/* =========================================================
   TEXT CHAPTERS

   RIGHT → LEFT → RIGHT → LEFT → RIGHT
========================================================= */

const chapters = [
  {
    id: 1,

    start: 0.04,
    end: 0.19,

    position: "right",

    eyebrow:
      "A NEW ERA",

    title:
      "INTELLIGENT",

    highlight:
      "MOBILITY",

    description:
      "Where innovation, performance and electric driving move together.",
  },

  {
    id: 2,

    start: 0.22,
    end: 0.38,

    position: "left",

    eyebrow:
      "INTELLIGENT DESIGN",

    title:
      "DESIGNED AROUND",

    highlight:
      "YOU",

    description:
      "Purposeful details, intelligent technology and a driving experience shaped for modern life.",
  },

  {
    id: 3,

    start: 0.41,
    end: 0.58,

    position: "right",

    eyebrow:
      "ELECTRIC PERFORMANCE",

    title:
      "POWER THAT FEELS",

    highlight:
      "EFFORTLESS",

    description:
      "Instant response and refined electric performance for every journey.",
  },

  {
    id: 4,

    start: 0.61,
    end: 0.78,

    position: "left",

    eyebrow:
      "MG INNOVATION",

    title:
      "TECHNOLOGY WITH",

    highlight:
      "PURPOSE",

    description:
      "Intelligent systems work quietly in the background to make every drive feel natural.",
  },

  {
    id: 5,

    start: 0.81,
    end: 0.97,

    position: "right",

    eyebrow:
      "MG MOTOR",

    title:
      "FORWARD",

    highlight:
      "TOGETHER",

    description:
      "A new generation of MG mobility, created for the road ahead.",
  },
];


/* =========================================================
   ACTIVE CHAPTER
========================================================= */

const activeChapter =
  computed(() => {

    return chapters.find(
      (chapter) =>
        progress.value >= chapter.start &&
        progress.value <= chapter.end
    );

  });


/* =========================================================
   CHAPTER PROGRESS
========================================================= */

const chapterProgress =
  computed(() => {

    if (!activeChapter.value) {
      return 0;
    }


    const chapter =
      activeChapter.value;


    const value =
      (
        progress.value -
        chapter.start
      ) /
      (
        chapter.end -
        chapter.start
      );


    return Math.max(
      0,
      Math.min(
        1,
        value
      )
    );

  });


/* =========================================================
   TEXT OPACITY
========================================================= */

const textOpacity =
  computed(() => {

    const p =
      chapterProgress.value;


    if (p < 0.18) {

      return (
        p /
        0.18
      );

    }


    if (p > 0.82) {

      return (
        1 -
        p
      ) / 0.18;

    }


    return 1;

  });


/* =========================================================
   TEXT MOVEMENT
========================================================= */

const textTransform =
  computed(() => {

    const p =
      chapterProgress.value;


    /*
       ENTER
    */

    if (p < 0.20) {

      const y =
        26 *
        (
          1 -
          p / 0.20
        );


      return `
        translate3d(
          0,
          ${y}px,
          0
        )
      `;

    }


    /*
       EXIT
    */

    if (p > 0.82) {

      const y =
        -12 *
        (
          (
            p -
            0.82
          ) /
          0.18
        );


      return `
        translate3d(
          0,
          ${y}px,
          0
        )
      `;

    }


    return `
      translate3d(
        0,
        0,
        0
      )
    `;

  });


/* =========================================================
   SMOOTH SCROLL SETTINGS
========================================================= */

/*
   Lower = smoother / more delayed
   Higher = more responsive

   9.5 works well for this 8s sequence.
*/

const FOLLOW_SPEED =
  9.5;


const PROGRESS_EPSILON =
  0.00004;


/*
   Don't send microscopic seeks.
*/

const SEEK_THRESHOLD =
  0.008;


/* =========================================================
   SCROLL VALUES
========================================================= */

let targetProgress =
  0;

let renderedProgress =
  0;

let rafId =
  null;

let previousTimestamp =
  0;


/* =========================================================
   SEEK STATE
========================================================= */

let seekBusy =
  false;

let pendingVideoTime =
  null;


/* =========================================================
   VIDEO READY
========================================================= */

const handleMetadata =
  () => {

    const video =
      videoRef.value;


    if (!video) {
      return;
    }


    videoDuration.value =
      video.duration;


    /*
       IMPORTANT:

       Use maximum 8 seconds.

       Example:
       source video = 14s
       usable = 8s

       source video = 6s
       usable = 6s
    */

    usableVideoDuration.value =
      Math.min(
        MAX_VIDEO_SECONDS,
        video.duration
      );


    video.pause();

    video.muted =
      true;


    try {

      video.currentTime =
        0.001;

    } catch {
      // Browser not ready yet.
    }


    isReady.value =
      true;


    calculateTargetProgress();

  };


/* =========================================================
   CAN PLAY
========================================================= */

const handleCanPlay =
  () => {

    isReady.value =
      true;

  };


/* =========================================================
   SEEKING
========================================================= */

const handleSeeking =
  () => {

    seekBusy =
      true;

  };


/* =========================================================
   SEEK FINISHED
========================================================= */

const handleSeeked =
  () => {

    seekBusy =
      false;


    /*
       User may have continued scrolling.

       Only use latest requested frame.
    */

    if (
      pendingVideoTime !== null
    ) {

      const newTime =
        pendingVideoTime;


      pendingVideoTime =
        null;


      seekVideo(
        newTime
      );

    }

  };


/* =========================================================
   VIDEO SEEK
========================================================= */

const seekVideo =
  (desiredTime) => {

    const video =
      videoRef.value;


    if (
      !video ||
      !isReady.value
    ) {

      return;

    }


    /*
       Browser still decoding previous frame.
       Save newest position only.
    */

    if (
      seekBusy ||
      video.seeking
    ) {

      pendingVideoTime =
        desiredTime;


      return;

    }


    const difference =
      Math.abs(
        video.currentTime -
        desiredTime
      );


    if (
      difference <
      SEEK_THRESHOLD
    ) {

      return;

    }


    try {

      seekBusy =
        true;


      video.currentTime =
        desiredTime;

    } catch {

      seekBusy =
        false;

    }

  };


/* =========================================================
   CALCULATE SCROLL PROGRESS
========================================================= */

const calculateTargetProgress =
  () => {

    const section =
      sectionRef.value;


    if (!section) {
      return;
    }


    const rect =
      section.getBoundingClientRect();


    const scrollDistance =
      section.offsetHeight -
      window.innerHeight;


    if (
      scrollDistance <= 0
    ) {

      targetProgress =
        0;


      return;

    }


    const travelled =
      Math.max(
        0,
        Math.min(
          scrollDistance,
          -rect.top
        )
      );


    targetProgress =
      travelled /
      scrollDistance;


    targetProgress =
      Math.max(
        0,
        Math.min(
          1,
          targetProgress
        )
      );


    /*
       Snap beginning.
    */

    if (
      targetProgress <=
      0.001
    ) {

      targetProgress =
        0;

    }


    /*
       Snap end.

       Ensures the whole 8-second
       sequence becomes visible.
    */

    if (
      targetProgress >=
      0.995
    ) {

      targetProgress =
        1;

    }

  };


/* =========================================================
   MAIN RENDER LOOP
========================================================= */

const renderLoop =
  (timestamp) => {

    /* =====================================================
       DELTA TIME
    ===================================================== */

    let deltaTime =
      (
        timestamp -
        previousTimestamp
      ) /
      1000;


    if (!previousTimestamp) {

      deltaTime =
        1 / 60;

    }


    previousTimestamp =
      timestamp;


    /*
       Prevent huge catch-up jumps.
    */

    deltaTime =
      Math.min(
        deltaTime,
        0.05
      );


    /* =====================================================
       SMOOTH SCROLL INTERPOLATION
    ===================================================== */

    const difference =
      targetProgress -
      renderedProgress;


    const smoothing =
      1 -
      Math.exp(
        -FOLLOW_SPEED *
        deltaTime
      );


    renderedProgress +=
      difference *
      smoothing;


    /* =====================================================
       SNAP
    ===================================================== */

    if (
      Math.abs(
        difference
      ) <
      PROGRESS_EPSILON
    ) {

      renderedProgress =
        targetProgress;

    }


    /*
       Ensure beginning is exact.
    */

    if (
      targetProgress === 0 &&
      renderedProgress <
      0.001
    ) {

      renderedProgress =
        0;

    }


    /*
       Ensure end is exact.
    */

    if (
      targetProgress === 1 &&
      renderedProgress >
      0.985
    ) {

      renderedProgress =
        1;

    }


    renderedProgress =
      Math.max(
        0,
        Math.min(
          1,
          renderedProgress
        )
      );


    progress.value =
      renderedProgress;


    /* =====================================================
       MAP SCROLL TO ONLY FIRST 8 SECONDS
    ===================================================== */

    if (
      isReady.value &&
      usableVideoDuration.value > 0
    ) {

      /*
         Avoid exact duration on short videos.

         For an 8s+ video:
         max usable time ≈ 7.99s
      */

      const endBuffer =
        0.01;


      const maxTime =
        Math.max(
          0,
          usableVideoDuration.value -
          endBuffer
        );


      const desiredTime =
        renderedProgress *
        maxTime;


      seekVideo(
        desiredTime
      );

    }


    rafId =
      requestAnimationFrame(
        renderLoop
      );

  };


/* =========================================================
   SCROLL HANDLER
========================================================= */

let scrollTicking =
  false;


const handleScroll =
  () => {

    if (scrollTicking) {
      return;
    }


    scrollTicking =
      true;


    requestAnimationFrame(
      () => {

        calculateTargetProgress();


        scrollTicking =
          false;

      }
    );

  };


/* =========================================================
   RESIZE
========================================================= */

const handleResize =
  () => {

    calculateTargetProgress();

  };


/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {

  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true,
    }
  );


  window.addEventListener(
    "resize",
    handleResize
  );


  if (videoRef.value) {

    videoRef.value.load();

  }


  calculateTargetProgress();


  renderedProgress =
    targetProgress;


  progress.value =
    renderedProgress;


  rafId =
    requestAnimationFrame(
      renderLoop
    );

});


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(() => {

  window.removeEventListener(
    "scroll",
    handleScroll
  );


  window.removeEventListener(
    "resize",
    handleResize
  );


  if (rafId) {

    cancelAnimationFrame(
      rafId
    );

  }

});
</script>


<template>

  <section
    ref="sectionRef"
    class="mg-story"
  >

    <div
      class="mg-story__sticky"
    >


      <!-- ===================================================
           VIDEO
      ==================================================== -->

      <video
        ref="videoRef"
        class="mg-story__video"
        :src="videoSrc"
        muted
        playsinline
        preload="auto"
        disablepictureinpicture
        @loadedmetadata="handleMetadata"
        @canplay="handleCanPlay"
        @seeking="handleSeeking"
        @seeked="handleSeeked"
      ></video>



      <!-- OVERLAY -->

      <div
        class="mg-story__overlay"
      ></div>



      <!-- VIGNETTE -->

      <div
        class="mg-story__vignette"
      ></div>



      <!-- ===================================================
           SIDE TEXT
      ==================================================== -->

      <div
        v-if="activeChapter"
        :key="activeChapter.id"
        class="mg-story__chapter"
        :class="[
          `mg-story__chapter--${activeChapter.position}`
        ]"
        :style="{
          opacity:
            textOpacity,

          transform:
            textTransform,
        }"
      >


        <span
          v-if="activeChapter.eyebrow"
          class="mg-story__eyebrow"
        >
          {{ activeChapter.eyebrow }}
        </span>


        <h2>

          <span>
            {{ activeChapter.title }}
          </span>

          <strong>
            {{ activeChapter.highlight }}
          </strong>

        </h2>


        <p
          v-if="activeChapter.description"
        >
          {{ activeChapter.description }}
        </p>


        <span
          class="mg-story__accent"
        ></span>

      </div>



      <!-- ===================================================
           PROGRESS
      ==================================================== -->

      <div
        class="mg-story__progress"
      >

        <span>
          MG
        </span>


        <div
          class="mg-story__progress-track"
        >

          <i
            :style="{
              transform:
                `scaleX(${progress})`
            }"
          ></i>

        </div>


        <span>

          {{
            Math.round(
              progress *
              100
            )
          }}

        </span>

      </div>



      <!-- ===================================================
           SCROLL INDICATOR
      ==================================================== -->

      <div
        class="mg-story__scroll-label"
        :class="{
          hidden:
            progress > 0.12
        }"
      >

        <span>
          Scroll to explore
        </span>

        <i></i>

      </div>

    </div>

  </section>

</template>


<style scoped>

/* =========================================================
   FONTS
========================================================= */

@import url(
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"
);


/* =========================================================
   SECTION

   First 8 seconds spread across this
   complete scroll distance.
========================================================= */

.mg-story {

  --mg-red:
    #e51920;


  position:
    relative;


  width:
    100%;


  /*
     8 second cinematic sequence.

     560vh gives enough scrolling
     without making it unnecessarily long.
  */

  height:
    560vh;


  background:
    #000;

}


/* =========================================================
   STICKY SCREEN
========================================================= */

.mg-story__sticky {

  position:
    sticky;


  top:
    0;


  width:
    100%;


  height:
    100svh;


  overflow:
    hidden;


  background:
    #000;


  color:
    #fff;


  isolation:
    isolate;

}


/* =========================================================
   VIDEO

   IMPORTANT:
   COVER FULL SCREEN
========================================================= */

.mg-story__video {

  position:
    absolute;


  top:
    0;


  left:
    0;


  z-index:
    -5;


  display:
    block;


  width:
    100%;


  height:
    100%;


  /*
     FULL SCREEN COVER
  */

  object-fit:
    cover;


  object-position:
    center
    center;


  background:
    #000;


  pointer-events:
    none;


  user-select:
    none;


  transform:
    translate3d(
      0,
      0,
      0
    );


  backface-visibility:
    hidden;


  -webkit-backface-visibility:
    hidden;

}


/* =========================================================
   OVERLAY
========================================================= */

.mg-story__overlay {

  position:
    absolute;


  inset:
    0;


  z-index:
    -4;


  pointer-events:
    none;


  background:

    linear-gradient(
      90deg,

      rgba(
        0,
        0,
        0,
        0.32
      )
      0%,

      rgba(
        0,
        0,
        0,
        0.08
      )
      25%,

      transparent
      42%,

      transparent
      58%,

      rgba(
        0,
        0,
        0,
        0.08
      )
      75%,

      rgba(
        0,
        0,
        0,
        0.32
      )
      100%
    ),

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
      35%,

      transparent
      70%,

      rgba(
        0,
        0,
        0,
        0.18
      )
      100%
    );

}


/* =========================================================
   VIGNETTE
========================================================= */

.mg-story__vignette {

  position:
    absolute;


  inset:
    0;


  z-index:
    -3;


  pointer-events:
    none;


  background:

    radial-gradient(
      circle
      at
      center,

      transparent
      48%,

      rgba(
        0,
        0,
        0,
        0.15
      )
      100%
    );

}


/* =========================================================
   CHAPTER
========================================================= */

.mg-story__chapter {

  position:
    absolute;


  top:
    50%;


  z-index:
    10;


  width:
    min(
      460px,
      34vw
    );


  translate:
    0
    -50%;


  will-change:
    opacity,
    transform;

}


/* =========================================================
   RIGHT
========================================================= */

.mg-story__chapter--right {

  right:
    clamp(
      40px,
      6vw,
      115px
    );


  left:
    auto;


  text-align:
    right;

}


.mg-story__chapter--right p {

  margin-left:
    auto;

}


.mg-story__chapter--right
.mg-story__accent {

  margin-left:
    auto;

}


/* =========================================================
   LEFT
========================================================= */

.mg-story__chapter--left {

  left:
    clamp(
      40px,
      6vw,
      115px
    );


  right:
    auto;


  text-align:
    left;

}


/* =========================================================
   EYEBROW
========================================================= */

.mg-story__eyebrow {

  display:
    block;


  margin-bottom:
    13px;


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
    0.21em;


  text-transform:
    uppercase;


  color:
    rgba(
      255,
      255,
      255,
      0.58
    );

}


/* =========================================================
   TITLE
========================================================= */

.mg-story__chapter h2 {

  margin:
    0;


  font-family:
    "Barlow Condensed",
    sans-serif;


  font-size:
    clamp(
      43px,
      4vw,
      74px
    );


  font-weight:
    400;


  line-height:
    0.93;


  letter-spacing:
    -0.025em;


  text-transform:
    uppercase;


  text-shadow:

    0
    5px
    28px
    rgba(
      0,
      0,
      0,
      0.32
    );

}


.mg-story__chapter h2 span {

  display:
    block;


  color:
    rgba(
      255,
      255,
      255,
      0.78
    );

}


.mg-story__chapter h2 strong {

  display:
    block;


  color:
    #fff;


  font-weight:
    500;

}


/* =========================================================
   DESCRIPTION
========================================================= */

.mg-story__chapter p {

  max-width:
    390px;


  margin-top:
    18px;


  margin-bottom:
    0;


  font-family:
    "Manrope",
    sans-serif;


  font-size:
    clamp(
      11px,
      0.78vw,
      14px
    );


  font-weight:
    400;


  line-height:
    1.68;


  color:
    rgba(
      255,
      255,
      255,
      0.65
    );


  text-shadow:

    0
    4px
    20px
    rgba(
      0,
      0,
      0,
      0.42
    );

}


/* =========================================================
   RED LINE
========================================================= */

.mg-story__accent {

  display:
    block;


  width:
    34px;


  height:
    1px;


  margin-top:
    22px;


  background:
    var(--mg-red);

}


/* =========================================================
   PROGRESS
========================================================= */

.mg-story__progress {

  position:
    absolute;


  left:
    clamp(
      20px,
      3vw,
      48px
    );


  bottom:
    clamp(
      20px,
      3vw,
      42px
    );


  z-index:
    20;


  display:
    flex;


  align-items:
    center;


  gap:
    10px;


  font-family:
    "Manrope",
    sans-serif;


  font-size:
    7px;


  font-weight:
    700;


  letter-spacing:
    0.14em;


  color:
    rgba(
      255,
      255,
      255,
      0.42
    );

}


/* =========================================================
   PROGRESS TRACK
========================================================= */

.mg-story__progress-track {

  position:
    relative;


  width:
    clamp(
      80px,
      8vw,
      135px
    );


  height:
    1px;


  overflow:
    hidden;


  background:
    rgba(
      255,
      255,
      255,
      0.18
    );

}


.mg-story__progress-track i {

  position:
    absolute;


  inset:
    0;


  transform-origin:
    left
    center;


  background:
    var(--mg-red);


  will-change:
    transform;

}


/* =========================================================
   SCROLL LABEL
========================================================= */

.mg-story__scroll-label {

  position:
    absolute;


  right:
    clamp(
      20px,
      3vw,
      48px
    );


  bottom:
    clamp(
      20px,
      3vw,
      42px
    );


  z-index:
    20;


  display:
    flex;


  align-items:
    center;


  gap:
    11px;


  transition:

    opacity
    0.45s
    ease,

    transform
    0.45s
    ease;

}


.mg-story__scroll-label.hidden {

  opacity:
    0;


  transform:
    translateY(
      8px
    );

}


.mg-story__scroll-label span {

  font-family:
    "Manrope",
    sans-serif;


  font-size:
    7px;


  font-weight:
    600;


  letter-spacing:
    0.18em;


  text-transform:
    uppercase;


  color:
    rgba(
      255,
      255,
      255,
      0.44
    );

}


/* =========================================================
   SCROLL LINE
========================================================= */

.mg-story__scroll-label i {

  position:
    relative;


  width:
    30px;


  height:
    1px;


  overflow:
    hidden;


  background:
    rgba(
      255,
      255,
      255,
      0.20
    );

}


.mg-story__scroll-label i::after {

  content:
    "";


  position:
    absolute;


  top:
    0;


  left:
    -100%;


  width:
    100%;


  height:
    100%;


  background:
    #fff;


  animation:
    mgStoryScrollLine
    1.7s
    ease-in-out
    infinite;

}


@keyframes mgStoryScrollLine {

  from {

    transform:
      translateX(
        0
      );

  }


  to {

    transform:
      translateX(
        200%
      );

  }

}


/* =========================================================
   TABLET
========================================================= */

@media (
  max-width:
  1000px
) {

  .mg-story {

    height:
      520vh;

  }


  .mg-story__chapter {

    width:
      min(
        400px,
        43vw
      );

  }


  .mg-story__chapter--right {

    right:
      35px;

  }


  .mg-story__chapter--left {

    left:
      35px;

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width:
  767px
) {

  .mg-story {

    height:
      460vh;

  }


  /* =======================================================
     VIDEO STILL COVER
  ======================================================= */

  .mg-story__video {

    object-fit:
      cover;


    object-position:
      center
      center;

  }


  /* =======================================================
     TEXT
  ======================================================= */

  .mg-story__chapter {

    top:
      auto;


    bottom:
      90px;


    width:
      calc(
        100% - 44px
      );


    translate:
      none;

  }


  .mg-story__chapter--right {

    right:
      22px;


    left:
      auto;


    text-align:
      right;

  }


  .mg-story__chapter--right p {

    margin-left:
      auto;

  }


  .mg-story__chapter--right
  .mg-story__accent {

    margin-left:
      auto;

  }


  .mg-story__chapter--left {

    left:
      22px;


    right:
      auto;


    text-align:
      left;

  }


  .mg-story__chapter h2 {

    font-size:
      clamp(
        38px,
        11vw,
        54px
      );

  }


  .mg-story__chapter p {

    max-width:
      310px;


    font-size:
      11px;

  }


  .mg-story__progress {

    left:
      18px;


    bottom:
      20px;

  }


  .mg-story__scroll-label {

    right:
      18px;


    bottom:
      20px;

  }


  .mg-story__scroll-label span {

    display:
      none;

  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (
  max-width:
  420px
) {

  .mg-story {

    height:
      440vh;

  }


  .mg-story__chapter {

    bottom:
      78px;

  }


  .mg-story__chapter h2 {

    font-size:
      40px;

  }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion:
  reduce
) {

  .mg-story__scroll-label i::after {

    animation:
      none;

  }

}

</style>