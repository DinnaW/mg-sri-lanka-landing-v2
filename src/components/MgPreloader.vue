<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";


/* =========================================================
   EMIT
========================================================= */

const emit = defineEmits([
  "finished",
]);


/* =========================================================
   BLANK COCKPIT IMAGE
========================================================= */

const cockpitImage =
  `${import.meta.env.BASE_URL}images/mg-cockpit/mg-cockpit-blank.png`;


/* =========================================================
   TIMING

   Same loading behaviour:
   0 -> 94
   wait for page
   94 -> 100
   short ignition hold
   exit
========================================================= */

const MAIN_DURATION =
  5000;

const FINAL_DURATION =
  520;

const HOLD_AT_100 =
  520;

const EXIT_DURATION =
  1050;


/* =========================================================
   STATE
========================================================= */

const progress =
  ref(0);

const isComplete =
  ref(false);

const isLeaving =
  ref(false);

const isVisible =
  ref(true);


let animationFrame =
  null;

let holdTimer =
  null;

let exitTimer =
  null;

let previousOverflow =
  "";

let finishStarted =
  false;


/* =========================================================
   PROGRESS DISPLAY
========================================================= */

const progressText =
  computed(() => {

    return String(
      progress.value
    ).padStart(
      2,
      "0"
    );

  });


/* =========================================================
   NEEDLE ROTATION

   IMPORTANT:
   Rotation is now applied directly in SVG:

   rotate(angle 160 160)

   That means the needle ALWAYS rotates around
   the actual gauge hub.
========================================================= */

const needleRotation =
  computed(() => {

    const start =
      -126;

    const end =
      126;


    return (
      start +
      (
        progress.value /
        100
      ) *
      (
        end -
        start
      )
    );

  });


/* =========================================================
   RIGHT NEEDLE

   Same loading percentage but a slightly softened
   response makes the two meters feel more natural.
========================================================= */

const rightProgress =
  computed(() => {

    return Math.min(
      100,
      progress.value *
      .96 +
      4
    );

  });


const rightNeedleRotation =
  computed(() => {

    const start =
      -126;

    const end =
      126;


    return (
      start +
      (
        rightProgress.value /
        100
      ) *
      (
        end -
        start
      )
    );

  });


/* =========================================================
   GAUGE ARC
========================================================= */

const gaugeOffset =
  computed(() => {

    return (
      100 -
      progress.value
    );

  });


const rightGaugeOffset =
  computed(() => {

    return (
      100 -
      rightProgress.value
    );

  });


/* =========================================================
   TICK DATA
========================================================= */

const minorTicks =
  Array.from(
    {
      length:
        51,
    },

    (
      _,
      index
    ) => {

      return {

        id:
          index,

        angle:
          -126 +
          index *
          5.04,

      };

    }
  );


const majorTicks =
  Array.from(
    {
      length:
        11,
    },

    (
      _,
      index
    ) => {

      return {

        id:
          index,

        angle:
          -126 +
          index *
          25.2,

        value:
          index *
          10,

      };

    }
  );


/* =========================================================
   ACTIVE MAJOR TICKS
========================================================= */

const isTickActive =
  (index) => {

    return (
      progress.value >=
      index *
      10
    );

  };


/* =========================================================
   STARTUP LEDS
========================================================= */

const startupIndicators =
  Array.from(
    {
      length:
        9,
    },

    (
      _,
      index
    ) =>
      index
  );


const indicatorActive =
  (index) => {

    const threshold =
      (
        (
          index +
          1
        ) /
        startupIndicators.length
      ) *
      100;


    return (
      progress.value >=
      threshold
    );

  };


/* =========================================================
   EASING
========================================================= */

const easeInOutCubic =
  (value) => {

    if (
      value <
      .5
    ) {

      return (
        4 *
        value *
        value *
        value
      );

    }


    return (
      1 -
      Math.pow(
        -2 *
        value +
        2,
        3
      ) /
      2
    );

  };


/* =========================================================
   INITIAL LOAD
========================================================= */

const startLoading =
  () => {

    const startedAt =
      performance.now();


    const animate =
      (
        currentTime
      ) => {

        const elapsed =
          currentTime -
          startedAt;


        const timeline =
          Math.min(
            elapsed /
            MAIN_DURATION,
            1
          );


        progress.value =
          Math.round(
            easeInOutCubic(
              timeline
            ) *
            94
          );


        if (
          timeline <
          1
        ) {

          animationFrame =
            requestAnimationFrame(
              animate
            );


          return;

        }


        waitForPage();

      };


    animationFrame =
      requestAnimationFrame(
        animate
      );

  };


/* =========================================================
   WAIT FOR PAGE
========================================================= */

const waitForPage =
  () => {

    if (
      document.readyState ===
      "complete"
    ) {

      finishLoading();

      return;

    }


    window.addEventListener(
      "load",
      finishLoading,
      {
        once:
          true,
      }
    );

  };


/* =========================================================
   FINAL 94 -> 100
========================================================= */

const finishLoading =
  () => {

    if (
      finishStarted
    ) {

      return;

    }


    finishStarted =
      true;


    window.removeEventListener(
      "load",
      finishLoading
    );


    const startingProgress =
      progress.value;


    const startedAt =
      performance.now();


    const animate =
      (
        currentTime
      ) => {

        const timeline =
          Math.min(
            (
              currentTime -
              startedAt
            ) /
            FINAL_DURATION,
            1
          );


        progress.value =
          Math.round(

            startingProgress +

            (
              100 -
              startingProgress
            ) *

            easeInOutCubic(
              timeline
            )

          );


        if (
          timeline <
          1
        ) {

          animationFrame =
            requestAnimationFrame(
              animate
            );


          return;

        }


        progress.value =
          100;


        isComplete.value =
          true;


        startExit();

      };


    animationFrame =
      requestAnimationFrame(
        animate
      );

  };


/* =========================================================
   EXIT
========================================================= */

const startExit =
  () => {

    holdTimer =
      window.setTimeout(
        () => {

          isLeaving.value =
            true;


          document.documentElement
            .style
            .overflow =
            previousOverflow;


          exitTimer =
            window.setTimeout(
              () => {

                isVisible.value =
                  false;


                emit(
                  "finished"
                );

              },

              EXIT_DURATION
            );

        },

        HOLD_AT_100
      );

  };


/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {

  previousOverflow =
    document.documentElement
      .style
      .overflow;


  document.documentElement
    .style
    .overflow =
    "hidden";


  startLoading();

});


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(() => {

  if (
    animationFrame
  ) {

    cancelAnimationFrame(
      animationFrame
    );

  }


  clearTimeout(
    holdTimer
  );


  clearTimeout(
    exitTimer
  );


  window.removeEventListener(
    "load",
    finishLoading
  );


  document.documentElement
    .style
    .overflow =
    previousOverflow;

});
</script>


<template>

  <div
    v-if="
      isVisible
    "

    class="
      mg-preloader
    "

    :class="{
      'is-complete':
        isComplete,

      'is-leaving':
        isLeaving,
    }"
  >


    <!-- =====================================================
         FIXED 16:9 CINEMATIC CANVAS
    ====================================================== -->

    <div
      class="
        mg-preloader__canvas
      "
    >


      <!-- ===================================================
           FULL SCREEN BLANK COCKPIT IMAGE
      ==================================================== -->

      <img
        class="
          mg-preloader__image
        "

        :src="
          cockpitImage
        "

        alt=""

        aria-hidden="
          true
        "

        fetchpriority="
          high
        "

        decoding="
          sync
        "
      />



      <!-- ===================================================
           IMAGE TREATMENT
      ==================================================== -->

      <div
        class="
          mg-preloader__shade
        "
      ></div>


      <div
        class="
          mg-preloader__screen-glow
        "
      ></div>



      <!-- ===================================================
           DIGITAL INSTRUMENT CLUSTER
      ==================================================== -->

      <div
        class="
          mg-cluster
        "
      >


        <!-- =================================================
             CLUSTER GLASS
        ================================================== -->

        <div
          class="
            mg-cluster__glass
          "
        ></div>



        <!-- =================================================
             LEFT GAUGE
        ================================================== -->

        <div
          class="
            mg-gauge
            mg-gauge--left
          "
        >

          <svg
            class="
              mg-gauge__svg
            "

            viewBox="
              0 0 320 320
            "

            aria-hidden="
              true
            "
          >


            <!-- OUTER SHADOW ARC -->

            <path
              class="
                mg-gauge__outer-arc
              "

              d="
                M 54 228
                A 132 132
                0 1 1
                266 228
              "
            />



            <!-- SECOND OUTER RING -->

            <path
              class="
                mg-gauge__secondary-arc
              "

              d="
                M 62 226
                A 124 124
                0 1 1
                258 226
              "
            />



            <!-- BASE TRACK -->

            <path
              class="
                mg-gauge__track
              "

              pathLength="
                100
              "

              d="
                M 67 224
                A 119 119
                0 1 1
                253 224
              "
            />



            <!-- ACTIVE TRACK -->

            <path
              class="
                mg-gauge__progress
              "

              pathLength="
                100
              "

              :style="{
                strokeDashoffset:
                  gaugeOffset,
              }"

              d="
                M 67 224
                A 119 119
                0 1 1
                253 224
              "
            />



            <!-- MINOR TICKS -->

            <g
              class="
                mg-gauge__minor
              "
            >

              <line
                v-for="
                  tick in minorTicks
                "

                :key="
                  `left-minor-${tick.id}`
                "

                x1="
                  160
                "

                y1="
                  39
                "

                x2="
                  160
                "

                y2="
                  46
                "

                :transform="
                  `rotate(${tick.angle} 160 160)`
                "
              />

            </g>



            <!-- MAJOR TICKS -->

            <g
              class="
                mg-gauge__major
              "
            >

              <line
                v-for="
                  tick in majorTicks
                "

                :key="
                  `left-major-${tick.id}`
                "

                x1="
                  160
                "

                y1="
                  36
                "

                x2="
                  160
                "

                y2="
                  53
                "

                :class="{
                  'is-active':
                    isTickActive(
                      tick.id
                    ),
                }"

                :transform="
                  `rotate(${tick.angle} 160 160)`
                "
              />

            </g>



            <!-- NUMBERS -->

            <g
              class="
                mg-gauge__numbers
              "
            >

              <text x="66" y="233">
                0
              </text>

              <text x="39" y="174">
                20
              </text>

              <text x="59" y="105">
                40
              </text>

              <text x="142" y="61">
                60
              </text>

              <text x="222" y="105">
                80
              </text>

              <text x="245" y="174">
                100
              </text>

            </g>



            <!-- INNER RING -->

            <circle
              class="
                mg-gauge__inner
              "

              cx="
                160
              "

              cy="
                160
              "

              r="
                72
              "
            />



            <!-- =================================================
                 NEEDLE

                 FIX:
                 rotation happens directly around SVG 160,160.
            ================================================== -->

            <g
              class="
                mg-gauge__needle-group
              "

              :transform="
                `rotate(${needleRotation} 160 160)`
              "
            >

              <path
                class="
                  mg-gauge__needle-body
                "

                d="
                  M 156.5 169
                  L 159.1 71
                  Q 160 64 160.9 71
                  L 163.5 169
                  Z
                "
              />


              <path
                class="
                  mg-gauge__needle-tail
                "

                d="
                  M 157.5 165
                  L 160 187
                  L 162.5 165
                  Z
                "
              />

            </g>



            <!-- HUB GLOW -->

            <circle
              class="
                mg-gauge__hub-glow
              "

              cx="
                160
              "

              cy="
                160
              "

              r="
                17
              "
            />


            <!-- HUB -->

            <circle
              class="
                mg-gauge__hub
              "

              cx="
                160
              "

              cy="
                160
              "

              r="
                7
              "
            />


          </svg>



          <!-- =================================================
               DIGITAL VALUE
          ================================================== -->

          <div
            class="
              mg-gauge__digital
            "
          >

            <strong>
              {{
                progress
              }}
            </strong>


            <span>
              km/h
            </span>

          </div>

        </div>



        <!-- =================================================
             CENTER DISPLAY
        ================================================== -->

        <div
          class="
            mg-cluster__center
          "
        >


          <!-- UPPER RING -->

          <div
            class="
              mg-cluster__center-ring
            "
          >

            <span></span>

          </div>



          <!-- STARTUP INDICATORS -->

          <div
            class="
              mg-cluster__indicators
            "
          >

            <span
              v-for="
                indicator in startupIndicators
              "

              :key="
                indicator
              "

              :class="{
                'is-active':
                  indicatorActive(
                    indicator
                  ),
              }"
            ></span>

          </div>



          <!-- PROGRESS NUMBER -->

          <div
            class="
              mg-cluster__percentage
            "
          >

            <strong>

              {{
                progressText
              }}

            </strong>


            <span>

              %

            </span>

          </div>



          <!-- =================================================
               LOWER TELEMETRY
          ================================================== -->

          <div
            class="
              mg-cluster__telemetry
            "
          >

            <div>

              <strong>
                432
              </strong>

              <span>
                km
              </span>

            </div>


            <div
              class="
                mg-cluster__gear
              "
            >

              P

            </div>


            <div>

              <strong>
                23
              </strong>

              <span>
                °C
              </span>

            </div>

          </div>


        </div>



        <!-- =================================================
             RIGHT GAUGE
        ================================================== -->

        <div
          class="
            mg-gauge
            mg-gauge--right
          "
        >

          <svg
            class="
              mg-gauge__svg
            "

            viewBox="
              0 0 320 320
            "

            aria-hidden="
              true
            "
          >


            <path
              class="
                mg-gauge__outer-arc
              "

              d="
                M 54 228
                A 132 132
                0 1 1
                266 228
              "
            />


            <path
              class="
                mg-gauge__secondary-arc
              "

              d="
                M 62 226
                A 124 124
                0 1 1
                258 226
              "
            />


            <path
              class="
                mg-gauge__track
              "

              pathLength="
                100
              "

              d="
                M 67 224
                A 119 119
                0 1 1
                253 224
              "
            />


            <path
              class="
                mg-gauge__progress
              "

              pathLength="
                100
              "

              :style="{
                strokeDashoffset:
                  rightGaugeOffset,
              }"

              d="
                M 67 224
                A 119 119
                0 1 1
                253 224
              "
            />



            <!-- MINOR -->

            <g
              class="
                mg-gauge__minor
              "
            >

              <line
                v-for="
                  tick in minorTicks
                "

                :key="
                  `right-minor-${tick.id}`
                "

                x1="
                  160
                "

                y1="
                  39
                "

                x2="
                  160
                "

                y2="
                  46
                "

                :transform="
                  `rotate(${tick.angle} 160 160)`
                "
              />

            </g>



            <!-- MAJOR -->

            <g
              class="
                mg-gauge__major
              "
            >

              <line
                v-for="
                  tick in majorTicks
                "

                :key="
                  `right-major-${tick.id}`
                "

                x1="
                  160
                "

                y1="
                  36
                "

                x2="
                  160
                "

                y2="
                  53
                "

                :class="{
                  'is-active':
                    isTickActive(
                      tick.id
                    ),
                }"

                :transform="
                  `rotate(${tick.angle} 160 160)`
                "
              />

            </g>



            <!-- NUMBERS -->

            <g
              class="
                mg-gauge__numbers
              "
            >

              <text x="66" y="233">
                0
              </text>

              <text x="39" y="174">
                20
              </text>

              <text x="59" y="105">
                40
              </text>

              <text x="142" y="61">
                60
              </text>

              <text x="222" y="105">
                80
              </text>

              <text x="245" y="174">
                100
              </text>

            </g>


            <circle
              class="
                mg-gauge__inner
              "

              cx="
                160
              "

              cy="
                160
              "

              r="
                72
              "
            />



            <!-- FIXED NEEDLE -->

            <g
              class="
                mg-gauge__needle-group
              "

              :transform="
                `rotate(${rightNeedleRotation} 160 160)`
              "
            >

              <path
                class="
                  mg-gauge__needle-body
                "

                d="
                  M 156.5 169
                  L 159.1 71
                  Q 160 64 160.9 71
                  L 163.5 169
                  Z
                "
              />


              <path
                class="
                  mg-gauge__needle-tail
                "

                d="
                  M 157.5 165
                  L 160 187
                  L 162.5 165
                  Z
                "
              />

            </g>


            <circle
              class="
                mg-gauge__hub-glow
              "

              cx="
                160
              "

              cy="
                160
              "

              r="
                17
              "
            />


            <circle
              class="
                mg-gauge__hub
              "

              cx="
                160
              "

              cy="
                160
              "

              r="
                7
              "
            />


          </svg>



          <!-- DIGITAL -->

          <div
            class="
              mg-gauge__digital
            "
          >

            <strong>

              {{
                Math.round(
                  rightProgress
                )
              }}

            </strong>


            <span>

              %

            </span>

          </div>


        </div>


      </div>



      <!-- ===================================================
           IGNITION LIGHT
      ==================================================== -->

      <div
        class="
          mg-preloader__ignition
        "
      ></div>


      <div
        class="
          mg-preloader__ignition-line
        "
      ></div>


    </div>

  </div>

</template>


<style scoped>

/* =========================================================
   ROOT
========================================================= */

.mg-preloader {

  --red:
    #e51920;


  position:
    fixed;


  inset:
    0;


  z-index:
    999999;


  overflow:
    hidden;


  background:
    #000;


  opacity:
    1;


  transition:
    opacity
    .95s
    cubic-bezier(
      .65,
      0,
      .35,
      1
    );

}


.mg-preloader.is-leaving {

  opacity:
    0;

}


/* =========================================================
   16:9 COVER CANVAS
========================================================= */

.mg-preloader__canvas {

  position:
    absolute;


  left:
    50%;


  top:
    50%;


  width:
    max(
      100vw,
      177.7777778vh
    );


  height:
    max(
      100vh,
      56.25vw
    );


  transform:
    translate(
      -50%,
      -50%
    );


  overflow:
    hidden;


  background:
    #020202;

}


/* =========================================================
   IMAGE
========================================================= */

.mg-preloader__image {

  position:
    absolute;


  inset:
    0;


  width:
    100%;


  height:
    100%;


  display:
    block;


  object-fit:
    fill;


  filter:
    brightness(
      .9
    )
    contrast(
      1.06
    )
    saturate(
      .88
    );


  transform:
    scale(
      1.002
    );


  pointer-events:
    none;


  user-select:
    none;


  transition:
    transform
    1.1s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    ),
    filter
    .8s
    ease;

}


/* =========================================================
   SUBTLE SHADE
========================================================= */

.mg-preloader__shade {

  position:
    absolute;


  inset:
    0;


  z-index:
    2;


  pointer-events:
    none;


  background:
    radial-gradient(
      ellipse
      at
      50%
      43%,

      transparent
      0%,

      transparent
      27%,

      rgba(
        0,
        0,
        0,
        .08
      )
      58%,

      rgba(
        0,
        0,
        0,
        .3
      )
      100%
    );

}


/* =========================================================
   SCREEN BACKLIGHT
========================================================= */

.mg-preloader__screen-glow {

  position:
    absolute;


  left:
    50%;


  top:
    43.1%;


  z-index:
    3;


  width:
    41%;


  height:
    19%;


  transform:
    translate(
      -50%,
      -50%
    );


  border-radius:
    50%;


  background:
    radial-gradient(
      ellipse,

      rgba(
        229,
        25,
        32,
        .035
      )
      0%,

      rgba(
        255,
        255,
        255,
        .015
      )
      38%,

      transparent
      72%
    );


  filter:
    blur(
      2vw
    );


  pointer-events:
    none;

}


/* =========================================================
   CLUSTER

   REDUCED SIZE.
========================================================= */

.mg-cluster {

  position:
    absolute;


  left:
    50%;


  top:
    43.3%;


  z-index:
    15;


  width:
    43%;


  height:
    27.5%;


  transform:
    translate(
      -50%,
      -50%
    );


  pointer-events:
    none;

}


/* =========================================================
   CLUSTER GLASS
========================================================= */

.mg-cluster__glass {

  position:
    absolute;


  inset:
    -3%;


  border-radius:
    46%;


  background:
    radial-gradient(
      ellipse
      at
      50%
      45%,

      rgba(
        255,
        255,
        255,
        .012
      ),

      rgba(
        0,
        0,
        0,
        .06
      )
      55%,

      transparent
      78%
    );


  border:
    1px
    solid
    rgba(
      255,
      255,
      255,
      .018
    );


  box-shadow:
    inset
    0
    0
    2vw
    rgba(
      255,
      255,
      255,
      .008
    );

}


/* =========================================================
   GAUGE
========================================================= */

.mg-gauge {

  position:
    absolute;


  top:
    50%;


  width:
    32.5%;


  aspect-ratio:
    1 /
    1;


  transform:
    translateY(
      -50%
    );

}


/* LEFT */

.mg-gauge--left {

  left:
    1.5%;

}


/* RIGHT */

.mg-gauge--right {

  right:
    1.5%;

}


/* =========================================================
   SVG
========================================================= */

.mg-gauge__svg {

  width:
    100%;


  height:
    100%;


  overflow:
    visible;

}


/* =========================================================
   OUTER ARC
========================================================= */

.mg-gauge__outer-arc {

  fill:
    none;


  stroke:
    rgba(
      255,
      255,
      255,
      .055
    );


  stroke-width:
    1;

}


/* =========================================================
   SECONDARY ARC
========================================================= */

.mg-gauge__secondary-arc {

  fill:
    none;


  stroke:
    rgba(
      255,
      255,
      255,
      .045
    );


  stroke-width:
    4;


  stroke-dasharray:
    2
    8;


  stroke-linecap:
    round;

}


/* =========================================================
   TRACK
========================================================= */

.mg-gauge__track {

  fill:
    none;


  stroke:
    rgba(
      255,
      255,
      255,
      .11
    );


  stroke-width:
    2.3;


  stroke-linecap:
    round;


  stroke-dasharray:
    100;

}


/* =========================================================
   PROGRESS ARC
========================================================= */

.mg-gauge__progress {

  fill:
    none;


  stroke:
    var(--red);


  stroke-width:
    3;


  stroke-linecap:
    round;


  stroke-dasharray:
    100;


  filter:
    drop-shadow(
      0
      0
      6px
      rgba(
        229,
        25,
        32,
        .68
      )
    );


  transition:
    stroke-dashoffset
    .14s
    linear;

}


/* =========================================================
   TICKS
========================================================= */

.mg-gauge__minor
line {

  stroke:
    rgba(
      255,
      255,
      255,
      .17
    );


  stroke-width:
    1;

}


.mg-gauge__major
line {

  stroke:
    rgba(
      255,
      255,
      255,
      .4
    );


  stroke-width:
    1.8;


  transition:
    stroke
    .2s
    ease,
    filter
    .2s
    ease;

}


.mg-gauge__major
line.is-active {

  stroke:
    rgba(
      255,
      255,
      255,
      .9
    );


  filter:
    drop-shadow(
      0
      0
      2px
      rgba(
        255,
        255,
        255,
        .28
      )
    );

}


/* =========================================================
   SCALE NUMBERS
========================================================= */

.mg-gauge__numbers
text {

  fill:
    rgba(
      255,
      255,
      255,
      .31
    );


  font-family:
    "Barlow Condensed",
    "Arial Narrow",
    Arial,
    sans-serif;


  font-size:
    10px;


  font-weight:
    400;

}


/* =========================================================
   INNER RING
========================================================= */

.mg-gauge__inner {

  fill:
    rgba(
      0,
      0,
      0,
      .045
    );


  stroke:
    rgba(
      255,
      255,
      255,
      .025
    );


  stroke-width:
    1;

}


/* =========================================================
   NEEDLE

   No CSS transform here.

   Vue sets:
   transform="rotate(angle 160 160)"

   Therefore the stick comes DIRECTLY out of its hub.
========================================================= */

.mg-gauge__needle-body {

  fill:
    var(--red);


  filter:
    drop-shadow(
      0
      0
      4px
      rgba(
        229,
        25,
        32,
        .72
      )
    );

}


.mg-gauge__needle-tail {

  fill:
    rgba(
      229,
      25,
      32,
      .55
    );

}


/* =========================================================
   HUB
========================================================= */

.mg-gauge__hub-glow {

  fill:
    rgba(
      229,
      25,
      32,
      .18
    );


  filter:
    blur(
      3px
    );

}


.mg-gauge__hub {

  fill:
    #e51920;


  stroke:
    rgba(
      255,
      255,
      255,
      .72
    );


  stroke-width:
    .9;


  filter:
    drop-shadow(
      0
      0
      4px
      rgba(
        229,
        25,
        32,
        .65
      )
    );

}


/* =========================================================
   GAUGE DIGITAL
========================================================= */

.mg-gauge__digital {

  position:
    absolute;


  left:
    50%;


  top:
    61%;


  transform:
    translate(
      -50%,
      -50%
    );


  display:
    flex;


  flex-direction:
    column;


  align-items:
    center;


  font-variant-numeric:
    tabular-nums;

}


.mg-gauge__digital
strong {

  color:
    rgba(
      255,
      255,
      255,
      .94
    );


  font-family:
    "Barlow Condensed",
    "Arial Narrow",
    sans-serif;


  font-size:
    1.65vw;


  font-weight:
    400;


  line-height:
    .9;


  letter-spacing:
    -.04em;

}


.mg-gauge__digital
span {

  margin-top:
    .25vw;


  color:
    rgba(
      255,
      255,
      255,
      .3
    );


  font-size:
    .34vw;


  font-weight:
    500;

}


/* =========================================================
   CENTER
========================================================= */

.mg-cluster__center {

  position:
    absolute;


  left:
    50%;


  top:
    51%;


  width:
    27%;


  height:
    73%;


  transform:
    translate(
      -50%,
      -50%
    );


  display:
    flex;


  flex-direction:
    column;


  align-items:
    center;


  justify-content:
    center;

}


/* =========================================================
   TOP SMALL RING
========================================================= */

.mg-cluster__center-ring {

  width:
    2.2vw;


  height:
    2.2vw;


  display:
    grid;


  place-items:
    center;


  margin-bottom:
    .6vw;


  border:
    1px
    solid
    rgba(
      255,
      255,
      255,
      .1
    );


  border-radius:
    50%;


  box-shadow:
    inset
    0
    0
    .7vw
    rgba(
      255,
      255,
      255,
      .025
    );

}


.mg-cluster__center-ring
span {

  width:
    .35vw;


  height:
    .35vw;


  border-radius:
    50%;


  background:
    var(--red);


  box-shadow:
    0
    0
    .6vw
    rgba(
      229,
      25,
      32,
      .65
    );

}


/* =========================================================
   INDICATORS
========================================================= */

.mg-cluster__indicators {

  display:
    flex;


  align-items:
    center;


  justify-content:
    center;


  gap:
    .45vw;


  margin-bottom:
    .7vw;

}


.mg-cluster__indicators
span {

  width:
    .22vw;


  height:
    .22vw;


  border-radius:
    50%;


  background:
    rgba(
      255,
      255,
      255,
      .08
    );


  transition:
    background
    .2s
    ease,
    box-shadow
    .2s
    ease,
    transform
    .2s
    ease;

}


.mg-cluster__indicators
span.is-active {

  background:
    var(--red);


  transform:
    scale(
      1.12
    );


  box-shadow:
    0
    0
    .48vw
    rgba(
      229,
      25,
      32,
      .7
    );

}


/* =========================================================
   CENTER PERCENTAGE
========================================================= */

.mg-cluster__percentage {

  display:
    flex;


  align-items:
    flex-start;


  font-variant-numeric:
    tabular-nums;

}


.mg-cluster__percentage
strong {

  color:
    #fff;


  font-family:
    "Barlow Condensed",
    "Arial Narrow",
    sans-serif;


  font-size:
    2.75vw;


  font-weight:
    400;


  line-height:
    .85;


  letter-spacing:
    -.06em;


  text-shadow:
    0
    0
    .8vw
    rgba(
      255,
      255,
      255,
      .08
    );

}


.mg-cluster__percentage
span {

  margin:
    .15vw
    0
    0
    .15vw;


  color:
    rgba(
      255,
      255,
      255,
      .43
    );


  font-size:
    .44vw;


  font-weight:
    600;

}


/* =========================================================
   TELEMETRY
========================================================= */

.mg-cluster__telemetry {

  width:
    115%;


  display:
    grid;


  grid-template-columns:
    1fr
    .65fr
    1fr;


  align-items:
    center;


  margin-top:
    .85vw;


  padding-top:
    .55vw;


  border-top:
    1px
    solid
    rgba(
      255,
      255,
      255,
      .06
    );

}


.mg-cluster__telemetry
> div {

  display:
    flex;


  align-items:
    baseline;


  justify-content:
    center;


  gap:
    .14vw;


  color:
    rgba(
      255,
      255,
      255,
      .5
    );

}


.mg-cluster__telemetry
strong {

  font-family:
    "Barlow Condensed",
    "Arial Narrow",
    sans-serif;


  font-size:
    .63vw;


  font-weight:
    500;

}


.mg-cluster__telemetry
span {

  font-size:
    .28vw;


  color:
    rgba(
      255,
      255,
      255,
      .26
    );

}


/* GEAR */

.mg-cluster__gear {

  color:
    var(--red) !important;


  font-family:
    "Barlow Condensed",
    sans-serif;


  font-size:
    .9vw;


  font-weight:
    500;

}


/* =========================================================
   COMPLETE
========================================================= */

.mg-preloader.is-complete
.mg-gauge__progress {

  stroke:
    #ff3037;


  filter:
    drop-shadow(
      0
      0
      9px
      rgba(
        229,
        25,
        32,
        .85
      )
    );

}


.mg-preloader.is-complete
.mg-cluster__center-ring {

  border-color:
    rgba(
      229,
      25,
      32,
      .32
    );


  box-shadow:
    0
    0
    1vw
    rgba(
      229,
      25,
      32,
      .12
    ),
    inset
    0
    0
    .8vw
    rgba(
      229,
      25,
      32,
      .08
    );

}


/* =========================================================
   IGNITION
========================================================= */

.mg-preloader__ignition {

  position:
    absolute;


  left:
    50%;


  top:
    43.2%;


  z-index:
    40;


  width:
    37%;


  height:
    21%;


  transform:
    translate(
      -50%,
      -50%
    );


  border-radius:
    50%;


  opacity:
    0;


  background:
    radial-gradient(
      ellipse,

      rgba(
        229,
        25,
        32,
        .13
      ),

      rgba(
        255,
        255,
        255,
        .025
      )
      42%,

      transparent
      72%
    );


  filter:
    blur(
      1.8vw
    );


  pointer-events:
    none;

}


.mg-preloader.is-complete
.mg-preloader__ignition {

  animation:
    mgIgnition
    .78s
    ease-out
    forwards;

}


@keyframes mgIgnition {

  0% {

    opacity:
      0;


    transform:
      translate(
        -50%,
        -50%
      )
      scale(
        .75
      );

  }


  36% {

    opacity:
      .75;

  }


  100% {

    opacity:
      0;


    transform:
      translate(
        -50%,
        -50%
      )
      scale(
        1.35
      );

  }

}


/* =========================================================
   IGNITION LINE
========================================================= */

.mg-preloader__ignition-line {

  position:
    absolute;


  left:
    50%;


  top:
    43.2%;


  z-index:
    45;


  width:
    0;


  height:
    1px;


  opacity:
    0;


  transform:
    translate(
      -50%,
      -50%
    );


  background:
    linear-gradient(
      90deg,

      transparent,

      rgba(
        255,
        255,
        255,
        .6
      ),

      var(--red),

      rgba(
        255,
        255,
        255,
        .6
      ),

      transparent
    );


  box-shadow:
    0
    0
    .8vw
    rgba(
      229,
      25,
      32,
      .45
    );


  pointer-events:
    none;

}


.mg-preloader.is-complete
.mg-preloader__ignition-line {

  animation:
    mgIgnitionLine
    .78s
    ease-out
    forwards;

}


@keyframes mgIgnitionLine {

  0% {

    width:
      0;


    opacity:
      0;

  }


  30% {

    opacity:
      .75;

  }


  78% {

    width:
      43%;


    opacity:
      .3;

  }


  100% {

    width:
      58%;


    opacity:
      0;

  }

}


/* =========================================================
   EXIT
========================================================= */

.mg-preloader.is-leaving
.mg-preloader__image {

  transform:
    scale(
      1.04
    );


  filter:
    brightness(
      .98
    )
    contrast(
      1.04
    )
    saturate(
      .92
    );

}


.mg-preloader.is-leaving
.mg-cluster {

  opacity:
    0;


  transform:
    translate(
      -50%,
      -50%
    )
    scale(
      1.025
    );


  filter:
    blur(
      .25vw
    );


  transition:
    opacity
    .42s
    ease,
    transform
    .75s
    cubic-bezier(
      .16,
      1,
      .3,
      1
    ),
    filter
    .42s
    ease;

}


/* =========================================================
   MOBILE

   Everything remains aligned because image + meters share
   the same 16:9 canvas.
========================================================= */

@media (
  max-width:
  767px
) {

  .mg-cluster {

    width:
      43%;

  }


  .mg-gauge__digital
  strong {

    font-size:
      1.8vw;

  }


  .mg-cluster__percentage
  strong {

    font-size:
      2.9vw;

  }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion:
  reduce
) {

  .mg-preloader *,
  .mg-preloader *::before,
  .mg-preloader *::after {

    animation-duration:
      .01ms !important;


    animation-iteration-count:
      1 !important;


    transition-duration:
      .01ms !important;

  }

}

</style>