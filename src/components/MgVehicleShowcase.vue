<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
} from "vue";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;


/* =========================================================
   VEHICLE DATA

   IMPORTANT

   Every vehicle now has its OWN:

   - body image
   - front wheel
   - rear wheel
   - desktop wheel positions
   - mobile wheel positions
   - vehicle display width

   You only need to edit the values inside THIS ARRAY.
========================================================= */

const vehicles = [

  /* =======================================================
     01 — MG S5 EV

     THESE ARE YOUR EXISTING ALIGNMENT VALUES.
     THEY HAVE NOT BEEN CHANGED.
  ======================================================= */

  {
    id: 1,

    name: "MG ZS",

    type: "100% Electric",


    /* BODY */

    image:
      asset("images/123.png"),


    /* =====================================================
       WHEEL IMAGES

       If front + rear use the same wheel:
       use the same path for both.
    ====================================================== */

    frontWheel:
      asset("images/black.png"),

    rearWheel:
      asset("images/black.png"),


    link:
      "#",


    /* =====================================================
       VEHICLE DISPLAY SIZE
    ====================================================== */

    layout: {

      desktopWidth:
        "96%",

      tabletWidth:
        "90%",

      mobileWidth:
        "103%",

      maxWidth:
        "1280px",

    },


    /* =====================================================
       CUSTOM WHEEL POSITIONS
    ====================================================== */

    wheels: {

      desktop: {

        front: {

          x:
            "25.6%",

          y:
            "75.3%",

          size:
            "14%",

        },


        rear: {

          x:
            "75.8%",

          y:
            "75.3%",

          size:
            "14%",

        },

      },


      mobile: {

        front: {

          x:
            "24.4%",

          y:
            "73.2%",

          size:
            "13%",

        },


        rear: {

          x:
            "71.6%",

          y:
            "73.2%",

          size:
            "13%",

        },

      },

    },

  },



  /* =======================================================
     02 — MG ZS HYBRID+

     STARTER VALUES.
     Adjust these to match your actual PNG.
  ======================================================= */

  {
    id: 2,

    name: "MG 4 Ev",

    type: "Hybrid+",


    /* CHANGE IMAGE HERE */

    image:
      asset("images/234.png"),


    /* CHANGE WHEELS HERE */

    frontWheel:
      asset("images/orange.png"),

    rearWheel:
      asset("images/orange.png"),


    link:
      "#",


    layout: {

      desktopWidth:
        "95%",

      tabletWidth:
        "89%",

      mobileWidth:
        "102%",

      maxWidth:
        "1260px",

    },


    wheels: {

      desktop: {

        front: {

          /*
             MOVE FRONT WHEEL LEFT / RIGHT
          */

          x:
            "24.3%",


          /*
             MOVE FRONT WHEEL UP / DOWN
          */

          y:
            "75.5%",


          /*
             FRONT WHEEL SIZE
          */

          size:
            "14.2%",

        },


        rear: {

          x:
            "79.5%",

          y:
            "75.5%",

          size:
            "14.2%",

        },

      },


      mobile: {

        front: {

          x:
            "24.5%",

          y:
            "73.4%",

          size:
            "13.2%",

        },


        rear: {

          x:
            "72.1%",

          y:
            "73.4%",

          size:
            "13.2%",

        },

      },

    },

  },



  /* =======================================================
     03 — MG HS PHEV

     STARTER VALUES.
  ======================================================= */

  {
    id: 3,

    name: "MG S5 EV",

    type: "Plug-in Hybrid",


    image:
      asset("images/345.png"),


    frontWheel:
      asset("images/blue.png"),

    rearWheel:
      asset("images/blue.png"),


    link:
      "#",


    layout: {

      desktopWidth:
        "98%",

      tabletWidth:
        "92%",

      mobileWidth:
        "106%",

      maxWidth:
        "1340px",

    },


    wheels: {

      desktop: {

        front: {

          x:
            "24%",

          y:
            "74.5%",

          size:
            "14.4%",

        },


        rear: {

          x:
            "77.5%",

          y:
            "74.5%",

          size:
            "14.4%",

        },

      },


      mobile: {

        front: {

          x:
            "24%",

          y:
            "73.8%",

          size:
            "13.4%",

        },


        rear: {

          x:
            "72.6%",

          y:
            "73.8%",

          size:
            "13.4%",

        },

      },

    },

  },



  /* =======================================================
     04 — MG4 EV

     STARTER VALUES.
  ======================================================= */

  {
    id: 4,

    name: "MG Hs PHEV",

    type: "100% Electric",


    image:
      asset("images/567.png"),


    frontWheel:
      asset("images/white.png"),

    rearWheel:
      asset("images/white.png"),


    link:
      "#",


    layout: {

      desktopWidth:
        "94%",

      tabletWidth:
        "87%",

      mobileWidth:
        "101%",

      maxWidth:
        "1240px",

    },


    wheels: {

      desktop: {

        front: {

          x:
            "24.5%",

          y:
            "73.5%",

          size:
            "15%",

        },


        rear: {

          x:
            "77.7%",

          y:
            "73.5%",

          size:
            "15%",

        },

      },


      mobile: {

        front: {

          x:
            "24.8%",

          y:
            "73.5%",

          size:
            "13.8%",

        },


        rear: {

          x:
            "71.4%",

          y:
            "73.5%",

          size:
            "13.8%",

        },

      },

    },

  },



  /* =======================================================
     05 — MG CYBERSTER

     STARTER VALUES.
  ======================================================= */

  {
    id: 5,

    name: "MG ZS Hybrid+",

    type: "Electric Roadster",


    image:
      asset("images/456.png"),


    frontWheel:
      asset("images/green.png"),

    rearWheel:
      asset("images/green.png"),


    link:
      "#",


    layout: {

      desktopWidth:
        "98%",

      tabletWidth:
        "94%",

      mobileWidth:
      
        "110%",

      maxWidth:
        "1360px",

    },


    wheels: {

      desktop: {

        front: {

          x:
            "23.5%",

          y:
            "74.5%",

          size:
            "15.2%",

        },


        rear: {

          x:
            "78%",

          y:
            "74.5%",

          size:
            "15.2%",

        },

      },


      mobile: {

        front: {

          x:
            "24.1%",

          y:
            "74.2%",

          size:
            "14.1%",

        },


        rear: {

          x:
            "72.7%",

          y:
            "74.2%",

          size:
            "14.1%",

        },

      },

    },

  },

];


/* =========================================================
   STATE
========================================================= */

const activeIndex =
  ref(0);


const isAnimating =
  ref(false);


/* =========================================================
   ELEMENT REFERENCES
========================================================= */

const carRef =
  ref(null);


const frontWheelRef =
  ref(null);


const rearWheelRef =
  ref(null);


const shadowRef =
  ref(null);


/* =========================================================
   ANIMATION SETTINGS
========================================================= */

/*
   Existing speed retained.
*/

const DRIVE_DURATION =
  3400;


/*
   Additional distance outside viewport.
*/

const START_MARGIN =
  90;


/* =========================================================
   CURRENT VEHICLE
========================================================= */

const currentVehicle =
  computed(() => {

    return vehicles[
      activeIndex.value
    ];

  });


/* =========================================================
   DYNAMIC VEHICLE CSS VARIABLES

   This is the key part.

   When the user selects another vehicle, Vue automatically
   sends THAT VEHICLE'S custom wheel coordinates into CSS.
========================================================= */

const currentVehicleStyle =
  computed(() => {

    const vehicle =
      currentVehicle.value;


    return {

      /* =====================================================
         VEHICLE WIDTH
      ====================================================== */

      "--car-width-desktop":
        vehicle.layout.desktopWidth,

      "--car-width-tablet":
        vehicle.layout.tabletWidth,

      "--car-width-mobile":
        vehicle.layout.mobileWidth,

      "--car-max-width":
        vehicle.layout.maxWidth,


      /* =====================================================
         DESKTOP FRONT WHEEL
      ====================================================== */

      "--front-wheel-x-desktop":
        vehicle.wheels.desktop.front.x,

      "--front-wheel-y-desktop":
        vehicle.wheels.desktop.front.y,

      "--front-wheel-size-desktop":
        vehicle.wheels.desktop.front.size,


      /* =====================================================
         DESKTOP REAR WHEEL
      ====================================================== */

      "--rear-wheel-x-desktop":
        vehicle.wheels.desktop.rear.x,

      "--rear-wheel-y-desktop":
        vehicle.wheels.desktop.rear.y,

      "--rear-wheel-size-desktop":
        vehicle.wheels.desktop.rear.size,


      /* =====================================================
         MOBILE FRONT WHEEL
      ====================================================== */

      "--front-wheel-x-mobile":
        vehicle.wheels.mobile.front.x,

      "--front-wheel-y-mobile":
        vehicle.wheels.mobile.front.y,

      "--front-wheel-size-mobile":
        vehicle.wheels.mobile.front.size,


      /* =====================================================
         MOBILE REAR WHEEL
      ====================================================== */

      "--rear-wheel-x-mobile":
        vehicle.wheels.mobile.rear.x,

      "--rear-wheel-y-mobile":
        vehicle.wheels.mobile.rear.y,

      "--rear-wheel-size-mobile":
        vehicle.wheels.mobile.rear.size,

    };

  });


/* =========================================================
   CURRENT ANIMATIONS
========================================================= */

let carAnimation =
  null;


let frontWheelAnimation =
  null;


let rearWheelAnimation =
  null;


let shadowAnimation =
  null;


/* =========================================================
   CANCEL ANIMATIONS
========================================================= */

const cancelAnimations = () => {

  carAnimation?.cancel();

  frontWheelAnimation?.cancel();

  rearWheelAnimation?.cancel();

  shadowAnimation?.cancel();


  carAnimation =
    null;

  frontWheelAnimation =
    null;

  rearWheelAnimation =
    null;

  shadowAnimation =
    null;

};


/* =========================================================
   RESET
========================================================= */

const resetElements = () => {

  if (
    carRef.value
  ) {

    carRef.value.style.transform =
      "translate3d(0, 0, 0)";

  }


  if (
    frontWheelRef.value
  ) {

    frontWheelRef.value.style.transform =
      "rotate(0deg)";

  }


  if (
    rearWheelRef.value
  ) {

    rearWheelRef.value.style.transform =
      "rotate(0deg)";

  }


  if (
    shadowRef.value
  ) {

    shadowRef.value.style.transform =
      "translateX(-50%) scaleX(1)";


    shadowRef.value.style.opacity =
      "0.3";

  }

};


/* =========================================================
   DRIVE ANIMATION

   next:
   RIGHT → CENTER

   previous:
   LEFT → CENTER
========================================================= */

const playDriveAnimation =
  async (
    direction = "next"
  ) => {

    await nextTick();


    const car =
      carRef.value;


    const frontWheel =
      frontWheelRef.value;


    const rearWheel =
      rearWheelRef.value;


    const shadow =
      shadowRef.value;


    if (
      !car ||
      !frontWheel ||
      !rearWheel
    ) {

      return;

    }


    cancelAnimations();


    /* =====================================================
       ACCESSIBILITY
    ====================================================== */

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    if (
      reducedMotion
    ) {

      resetElements();

      isAnimating.value =
        false;

      return;

    }


    isAnimating.value =
      true;


    /* =====================================================
       VEHICLE SIZE
    ====================================================== */

    const carRect =
      car.getBoundingClientRect();


    /*
       Front and rear wheels can technically be
       different sizes.

       We calculate their rotations independently.
    */

    const frontWheelRect =
      frontWheel.getBoundingClientRect();


    const rearWheelRect =
      rearWheel.getBoundingClientRect();


    /* =====================================================
       TRAVEL DISTANCE
    ====================================================== */

    const travelDistance =

      window.innerWidth / 2 +

      carRect.width / 2 +

      START_MARGIN;


    /* =====================================================
       DIRECTION
    ====================================================== */

    const startX =

      direction === "previous"

        ? -travelDistance

        : travelDistance;


    /* =====================================================
       FRONT WHEEL CIRCUMFERENCE
    ====================================================== */

    const frontDiameter =
      frontWheelRect.width;


    const frontCircumference =

      Math.PI *

      frontDiameter;


    /* =====================================================
       REAR WHEEL CIRCUMFERENCE
    ====================================================== */

    const rearDiameter =
      rearWheelRect.width;


    const rearCircumference =

      Math.PI *

      rearDiameter;


    /* =====================================================
       ROTATION COUNTS
    ====================================================== */

    const frontRotations =

      travelDistance /

      frontCircumference;


    const rearRotations =

      travelDistance /

      rearCircumference;


    /* =====================================================
       ROTATION DIRECTION
    ====================================================== */

    const rotationDirection =

      direction === "previous"

        ? 1

        : -1;


    const frontWheelDegrees =

      frontRotations *

      360 *

      rotationDirection;


    const rearWheelDegrees =

      rearRotations *

      360 *

      rotationDirection;


    /* =====================================================
       EASING
    ====================================================== */

    const easing =

      "cubic-bezier(0.22, 1, 0.36, 1)";


    /* =====================================================
       VEHICLE
    ====================================================== */

    carAnimation =
      car.animate(

        [

          {

            transform:
              `translate3d(${startX}px, 0, 0)`,

          },

          {

            transform:
              "translate3d(0, 0, 0)",

          },

        ],

        {

          duration:
            DRIVE_DURATION,

          easing,

          fill:
            "forwards",

        }

      );


    /* =====================================================
       FRONT WHEEL
    ====================================================== */

    frontWheelAnimation =
      frontWheel.animate(

        [

          {

            transform:
              "rotate(0deg)",

          },

          {

            transform:
              `rotate(${frontWheelDegrees}deg)`,

          },

        ],

        {

          duration:
            DRIVE_DURATION,

          easing,

          fill:
            "forwards",

        }

      );


    /* =====================================================
       REAR WHEEL
    ====================================================== */

    rearWheelAnimation =
      rearWheel.animate(

        [

          {

            transform:
              "rotate(0deg)",

          },

          {

            transform:
              `rotate(${rearWheelDegrees}deg)`,

          },

        ],

        {

          duration:
            DRIVE_DURATION,

          easing,

          fill:
            "forwards",

        }

      );


    /* =====================================================
       SHADOW
    ====================================================== */

    if (
      shadow
    ) {

      shadowAnimation =
        shadow.animate(

          [

            {

              transform:
                `translate3d(${startX}px, 0, 0)
                 translateX(-50%)
                 scaleX(0.55)`,

              opacity:
                0.05,

            },

            {

              transform:
                `translate3d(0, 0, 0)
                 translateX(-50%)
                 scaleX(1)`,

              opacity:
                0.3,

            },

          ],

          {

            duration:
              DRIVE_DURATION,

            easing,

            fill:
              "forwards",

          }

        );

    }


    /* =====================================================
       WAIT
    ====================================================== */

    try {

      await carAnimation.finished;

    }

    catch {

      return;

    }


    isAnimating.value =
      false;

  };


/* =========================================================
   SELECT VEHICLE
========================================================= */

const selectVehicle =
  async (
    index
  ) => {

    if (
      index === activeIndex.value ||
      isAnimating.value
    ) {

      return;

    }


    const previousIndex =
      activeIndex.value;


    const direction =

      index > previousIndex

        ? "next"

        : "previous";


    activeIndex.value =
      index;


    await nextTick();


    playDriveAnimation(
      direction
    );

  };


/* =========================================================
   PREVIOUS
========================================================= */

const previousVehicle =
  async () => {

    if (
      isAnimating.value
    ) {

      return;

    }


    activeIndex.value =

      activeIndex.value === 0

        ? vehicles.length - 1

        : activeIndex.value - 1;


    await nextTick();


    playDriveAnimation(
      "previous"
    );

  };


/* =========================================================
   NEXT
========================================================= */

const nextVehicle =
  async () => {

    if (
      isAnimating.value
    ) {

      return;

    }


    activeIndex.value =

      activeIndex.value ===
      vehicles.length - 1

        ? 0

        : activeIndex.value + 1;


    await nextTick();


    playDriveAnimation(
      "next"
    );

  };


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(() => {

  cancelAnimations();

});
</script>



<template>

  <section class="mg-range">


    <!-- =====================================================
         SECTION LABEL
    ====================================================== -->

    <div class="mg-range__header">

      <span>
        Discover the range
      </span>

    </div>



    <!-- =====================================================
         LARGE BACKGROUND MODEL
    ====================================================== -->

    <Transition
      name="model-title"
      mode="out-in"
    >

      <div
        :key="currentVehicle.name"
        class="mg-range__background-title"
      >

        {{ currentVehicle.name }}

      </div>

    </Transition>



    <!-- =====================================================
         VEHICLE STAGE
    ====================================================== -->

    <div class="mg-stage">


      <!-- SHADOW -->

      <div
        ref="shadowRef"
        class="mg-stage__shadow"
      ></div>



      <!-- ===================================================
           COMPLETE VEHICLE

           currentVehicleStyle sends the selected vehicle's
           custom coordinates into this element.
      ==================================================== -->

      <div
        ref="carRef"
        :key="currentVehicle.id"
        class="mg-car"
        :style="currentVehicleStyle"
      >


        <!-- =================================================
             BODY
        ================================================== -->

        <img
          :src="currentVehicle.image"
          :alt="currentVehicle.name"
          class="mg-car__body"
          draggable="false"
        />



        <!-- =================================================
             FRONT WHEEL
        ================================================== -->

        <div
          class="
            mg-car__wheel-position
            mg-car__wheel-position--front
          "
        >

          <img
            ref="frontWheelRef"
            :src="currentVehicle.frontWheel"
            alt=""
            class="mg-car__wheel"
            draggable="false"
          />

        </div>



        <!-- =================================================
             REAR WHEEL
        ================================================== -->

        <div
          class="
            mg-car__wheel-position
            mg-car__wheel-position--rear
          "
        >

          <img
            ref="rearWheelRef"
            :src="currentVehicle.rearWheel"
            alt=""
            class="mg-car__wheel"
            draggable="false"
          />

        </div>


      </div>


    </div>



    <!-- =====================================================
         VEHICLE INFO
    ====================================================== -->

    <Transition
      name="vehicle-info"
      mode="out-in"
    >

      <div
        :key="currentVehicle.id"
        class="mg-range__info"
      >

        <span class="mg-range__type">

          {{ currentVehicle.type }}

        </span>


        <h2>

          {{ currentVehicle.name }}

        </h2>


        <a
          :href="currentVehicle.link"
          class="mg-range__explore"
        >

          <span>
            Explore
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

    </Transition>



    <!-- =====================================================
         CAROUSEL
    ====================================================== -->

    <div class="mg-carousel">


      <!-- PREVIOUS -->

      <button
        type="button"
        class="mg-carousel__nav"
        aria-label="Previous vehicle"
        :disabled="isAnimating"
        @click="previousVehicle"
      >

        <svg viewBox="0 0 24 24">

          <path
            d="M19 12H5M10 7l-5 5 5 5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

        </svg>

      </button>



      <!-- VEHICLES -->

      <div class="mg-carousel__vehicles">

        <button
          v-for="(vehicle, index) in vehicles"
          :key="vehicle.id"
          type="button"
          class="mg-carousel__vehicle"
          :class="{
            active:
              activeIndex === index
          }"
          :disabled="isAnimating"
          @click="selectVehicle(index)"
        >


          <div class="mg-carousel__image">

            <img
              :src="vehicle.image"
              :alt="vehicle.name"
              draggable="false"
            />

          </div>


          <span>

            {{ vehicle.name }}

          </span>


          <i></i>


        </button>

      </div>



      <!-- NEXT -->

      <button
        type="button"
        class="mg-carousel__nav"
        aria-label="Next vehicle"
        :disabled="isAnimating"
        @click="nextVehicle"
      >

        <svg viewBox="0 0 24 24">

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


  </section>

</template>



<style scoped>

/* =========================================================
   FONT
========================================================= */

@import url(
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"
);


/* =========================================================
   SECTION
========================================================= */

.mg-range {

  --mg-red:
    #e51920;

  position:
    relative;

  width:
    100%;

  min-height:
    100svh;

  padding:
    clamp(
      65px,
      6vw,
      100px
    )
    5vw
    45px;

  overflow:
    hidden;

  background:
    #f5f5f2;

  color:
    #111;

  isolation:
    isolate;

}


/* =========================================================
   HEADER
========================================================= */

.mg-range__header {

  position:
    relative;

  z-index:
    20;

  text-align:
    center;

}


.mg-range__header span {

  font-family:
    "Manrope",
    sans-serif;

  font-size: clamp(13px, 0.78vw, 16px);

  font-weight:
    700;

  letter-spacing:
    0.22em;

  text-transform:
    uppercase;

  color:
    rgba(
      0,
      0,
      0,
      0.45
    );

}


/* =========================================================
   BACKGROUND MODEL NAME
========================================================= */

.mg-range__background-title {

  position:
    absolute;

  top:
    15%;

  left:
    50%;

  z-index:
    -1;

  width:
    100%;

  transform:
    translateX(
      -50%
    );

  text-align:
    center;

  white-space:
    nowrap;

  pointer-events:
    none;

  font-family:
    "Barlow Condensed",
    sans-serif;

  font-size: clamp(220px, 19vw, 390px);

  font-weight:
    500;

  line-height:
    0.8;

  letter-spacing:
    -0.045em;

  text-transform:
    uppercase;

  color:
    rgba(
      15,
      15,
      15,
      0.045
    );

}


/* =========================================================
   VEHICLE STAGE
========================================================= */

.mg-stage {

  position:
    relative;

  width:
    min(
      92vw,
      1280px
    );

  height:
    clamp(
      330px,
      41vw,
      560px
    );

  margin:
    clamp(
      30px,
      4vh,
      55px
    )
    auto
    0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  overflow:
    visible;

}


/* =========================================================
   COMPLETE CAR

   IMPORTANT

   The custom values are supplied by Vue through
   :style="currentVehicleStyle".
========================================================= */

.mg-car {

  /* =====================================================
     ACTIVE DESKTOP VALUES

     These simply read the selected vehicle's data.
  ====================================================== */

  --front-wheel-x:
    var(
      --front-wheel-x-desktop
    );

  --front-wheel-y:
    var(
      --front-wheel-y-desktop
    );

  --front-wheel-size:
    var(
      --front-wheel-size-desktop
    );


  --rear-wheel-x:
    var(
      --rear-wheel-x-desktop
    );

  --rear-wheel-y:
    var(
      --rear-wheel-y-desktop
    );

  --rear-wheel-size:
    var(
      --rear-wheel-size-desktop
    );


  position:
    relative;

  z-index:
    5;


  /* =====================================================
     INDIVIDUAL VEHICLE WIDTH
  ====================================================== */

  width:
    var(
      --car-width-desktop
    );

  max-width:
    var(
      --car-max-width
    );


  margin:
    0
    auto;


  transform-origin:
    center;


  transform:
    translate3d(
      0,
      0,
      0
    );


  will-change:
    transform;


  backface-visibility:
    hidden;


  -webkit-backface-visibility:
    hidden;

}


/* =========================================================
   CAR BODY

   IMPORTANT:
   No fixed aspect-ratio is used anymore.

   The container naturally follows each body's
   actual PNG ratio, which is much better when you
   have five different models.
========================================================= */

.mg-car__body {

  position:
    relative;

  z-index:
    2;

  display:
    block;

  width:
    100%;

  height:
    auto;

  object-fit:
    contain;

  pointer-events:
    none;

  user-select:
    none;

  -webkit-user-drag:
    none;

  filter:
    drop-shadow(
      0
      20px
      22px
      rgba(
        0,
        0,
        0,
        0.055
      )
    );

  transform:
    translateZ(
      0
    );

}


/* =========================================================
   BASE WHEEL HOLDER
========================================================= */

.mg-car__wheel-position {

  position:
    absolute;

  aspect-ratio:
    1 / 1;

  transform:
    translate(
      -50%,
      -50%
    );

  z-index:
    8;

  pointer-events:
    none;

}


/* =========================================================
   FRONT WHEEL

   Every parameter is independent.
========================================================= */

.mg-car__wheel-position--front {

  left:
    var(
      --front-wheel-x
    );


  top:
    var(
      --front-wheel-y
    );


  width:
    var(
      --front-wheel-size
    );

}


/* =========================================================
   REAR WHEEL

   Every parameter is independent.
========================================================= */

.mg-car__wheel-position--rear {

  left:
    var(
      --rear-wheel-x
    );


  top:
    var(
      --rear-wheel-y
    );


  width:
    var(
      --rear-wheel-size
    );

}


/* =========================================================
   ACTUAL WHEEL

   Only the wheel image rotates.
========================================================= */

.mg-car__wheel {

  display:
    block;

  width:
    100%;

  height:
    100%;

  object-fit:
    contain;

  transform:
    rotate(
      0deg
    );

  transform-origin:
    50%
    50%;

  pointer-events:
    none;

  user-select:
    none;

  -webkit-user-drag:
    none;

  will-change:
    transform;

  backface-visibility:
    hidden;

  -webkit-backface-visibility:
    hidden;

}


/* =========================================================
   SHADOW
========================================================= */

.mg-stage__shadow {

  position:
    absolute;

  left:
    50%;

  bottom:
    10%;

  z-index:
    1;

  width:
    55%;

  height:
    32px;

  transform:
    translateX(
      -50%
    );

  border-radius:
    50%;

  background:
    rgba(
      0,
      0,
      0,
      0.17
    );

  filter:
    blur(
      24px
    );

  opacity:
    0.3;

  will-change:
    transform,
    opacity;

}


/* =========================================================
   VEHICLE INFO
========================================================= */

.mg-range__info {

  position:
    relative;

  z-index:
    10;

  margin-top:
    -18px;

  text-align:
    center;

}


/* =========================================================
   VEHICLE TYPE
========================================================= */

.mg-range__type {

  display:
    block;

  margin-bottom:
    5px;

  font-family:
    "Manrope",
    sans-serif;

  font-size: clamp(13px, 0.8vw, 16px);

  font-weight:
    700;

  letter-spacing:
    0.18em;

  text-transform:
    uppercase;

  color:
    var(
      --mg-red
    );

}


/* =========================================================
   VEHICLE TITLE
========================================================= */

.mg-range__info h2 {

  margin:
    0;

  font-family:
    "Barlow Condensed",
    sans-serif;

  font-size: clamp(46px, 2.8vw, 62px);

  font-weight:
    500;

  line-height:
    1;

  letter-spacing:
    -0.02em;

  text-transform:
    uppercase;

}


/* =========================================================
   EXPLORE BUTTON
========================================================= */

.mg-range__explore {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    12px;

  height:
    40px;

  margin-top:
    15px;

  padding:
    0
    19px;

  border:
    1px
    solid
    rgba(
      0,
      0,
      0,
      0.3
    );

  color:
    #111;

  text-decoration:
    none;

  font-family:
    "Manrope",
    sans-serif;

  font-size: clamp(13px, 0.8vw, 16px);

  font-weight:
    700;

  letter-spacing:
    0.16em;

  text-transform:
    uppercase;

  transition:
    background
    0.3s
    ease,
    border-color
    0.3s
    ease,
    color
    0.3s
    ease;

}


.mg-range__explore svg {

  width:
    14px;

  transition:
    transform
    0.3s
    ease;

}


.mg-range__explore:hover {

  background:
    var(
      --mg-red
    );

  border-color:
    var(
      --mg-red
    );

  color:
    #fff;

}


.mg-range__explore:hover svg {

  transform:
    translateX(
      4px
    );

}


/* =========================================================
   CAROUSEL
========================================================= */

.mg-carousel {

  position:
    relative;

  width:
    min(
      100%,
      1280px
    );

  margin:
    clamp(
      38px,
      4vh,
      55px
    )
    auto
    0;

  display:
    grid;

  grid-template-columns:
    44px
    minmax(
      0,
      1fr
    )
    44px;

  align-items:
    center;

  gap:
    clamp(
      10px,
      2vw,
      28px
    );

}


/* =========================================================
   CAROUSEL VEHICLES
========================================================= */

.mg-carousel__vehicles {

  display:
    flex;

  align-items:
    flex-start;

  justify-content:
    center;

  gap:
    clamp(
      18px,
      2.5vw,
      45px
    );

  overflow-x:
    auto;

  padding:
    8px
    4px
    10px;

  scrollbar-width:
    none;

}


.mg-carousel__vehicles::-webkit-scrollbar {

  display:
    none;

}


/* =========================================================
   CAROUSEL VEHICLE
========================================================= */

.mg-carousel__vehicle {

  position:
    relative;

  flex:
    0
    0
    clamp(
      105px,
      10vw,
      145px
    );

  padding:
    0
    0
    11px;

  border:
    0;

  background:
    transparent;

  cursor:
    pointer;

  color:
    #111;

  opacity:
    0.24;

  transition:
    opacity
    0.35s
    ease,
    transform
    0.4s
    cubic-bezier(
      0.16,
      1,
      0.3,
      1
    );

}


.mg-carousel__vehicle:hover:not(:disabled) {

  opacity:
    0.6;

}


.mg-carousel__vehicle.active {

  opacity:
    1;

  transform:
    translateY(
      -5px
    );

}


.mg-carousel__vehicle:disabled {

  cursor:
    default;

}


/* =========================================================
   THUMB
========================================================= */

.mg-carousel__image {

  width:
    100%;

  height:
    64px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

}


.mg-carousel__image img {

  display:
    block;

  width:
    100%;

  height:
    100%;

  object-fit:
    contain;

  pointer-events:
    none;

  user-select:
    none;

  -webkit-user-drag:
    none;

}


/* =========================================================
   CAROUSEL NAME
========================================================= */

.mg-carousel__vehicle > span {

  display:
    block;

  margin-top:
    6px;

  font-family:
    "Manrope",
    sans-serif;

  font-size: clamp(11px, 0.68vw, 14px);

  font-weight:
    700;

  letter-spacing:
    0.11em;

  text-transform:
    uppercase;

  text-align:
    center;

}


/* =========================================================
   ACTIVE LINE
========================================================= */

.mg-carousel__vehicle > i {

  position:
    absolute;

  left:
    50%;

  bottom:
    0;

  width:
    0;

  height:
    1px;

  transform:
    translateX(
      -50%
    );

  background:
    var(
      --mg-red
    );

  transition:
    width
    0.35s
    ease;

}


.mg-carousel__vehicle.active > i {

  width:
    36px;

}


/* =========================================================
   NAVIGATION
========================================================= */

.mg-carousel__nav {

  width:
    42px;

  height:
    42px;

  padding:
    0;

  display:
    grid;

  place-items:
    center;

  border:
    1px
    solid
    rgba(
      0,
      0,
      0,
      0.17
    );

  border-radius:
    50%;

  background:
    transparent;

  color:
    #111;

  cursor:
    pointer;

  transition:
    background
    0.3s
    ease,
    border-color
    0.3s
    ease,
    color
    0.3s
    ease,
    opacity
    0.3s
    ease;

}


.mg-carousel__nav svg {

  width:
    15px;

}


.mg-carousel__nav:hover:not(:disabled) {

  background:
    #111;

  border-color:
    #111;

  color:
    #fff;

}


.mg-carousel__nav:disabled {

  opacity:
    0.35;

  cursor:
    default;

}


/* =========================================================
   MODEL TITLE TRANSITION
========================================================= */

.model-title-enter-active,
.model-title-leave-active {

  transition:
    opacity
    0.45s
    ease,
    transform
    0.65s
    cubic-bezier(
      0.16,
      1,
      0.3,
      1
    );

}


.model-title-enter-from {

  opacity:
    0;

  transform:
    translateX(
      -47%
    )
    translateY(
      18px
    );

}


.model-title-leave-to {

  opacity:
    0;

  transform:
    translateX(
      -53%
    )
    translateY(
      -12px
    );

}


/* =========================================================
   INFO TRANSITION
========================================================= */

.vehicle-info-enter-active,
.vehicle-info-leave-active {

  transition:
    opacity
    0.35s
    ease,
    transform
    0.5s
    cubic-bezier(
      0.16,
      1,
      0.3,
      1
    );

}


.vehicle-info-enter-from {

  opacity:
    0;

  transform:
    translateY(
      13px
    );

}


.vehicle-info-leave-to {

  opacity:
    0;

  transform:
    translateY(
      -9px
    );

}




/* =========================================================
   LARGE DESKTOP — BIGGER CARS + LARGER TYPOGRAPHY
   1200px and above only.
   Tablet/mobile sizing below remains unchanged.
========================================================= */

@media (min-width: 1200px) {
  .mg-range {
    padding:
      clamp(80px, 6vw, 120px)
      var(--mg-page-gutter, 5vw)
      clamp(55px, 4vw, 80px);
  }

  .mg-range__header span {
    font-size: clamp(13px, 0.8vw, 17px);
  }

  .mg-range__background-title {
    top: 13%;
    font-size: clamp(240px, 19vw, 400px);
  }

  .mg-stage {
    width: min(96vw, 1500px);

    height:
      clamp(
        430px,
        45vw,
        680px
      );

    margin:
      clamp(
        34px,
        4vh,
        60px
      )
      auto
      0;
  }

  .mg-stage__shadow {
    width: 62%;
    height: 38px;
    filter: blur(28px);
  }

  .mg-range__info {
    margin-top: -28px;
  }

  .mg-range__type {
    font-size: clamp(13px, 0.82vw, 17px);
    margin-bottom: 7px;
  }

  .mg-range__info h2 {
    font-size: clamp(50px, 3vw, 68px);
  }

  .mg-range__explore {
    height: clamp(44px, 2.7vw, 52px);
    margin-top: 18px;
    padding: 0 clamp(20px, 1.4vw, 28px);
    gap: 13px;

    font-size: clamp(13px, 0.8vw, 16px);
  }

  .mg-range__explore svg {
    width: clamp(15px, 0.9vw, 18px);
  }

  .mg-carousel {
    width: min(100%, 1450px);

    grid-template-columns:
      50px
      minmax(0, 1fr)
      50px;

    margin:
      clamp(
        44px,
        4vh,
        62px
      )
      auto
      0;
  }

  .mg-carousel__vehicles {
    gap: clamp(24px, 2.7vw, 52px);
  }

  .mg-carousel__vehicle {
    flex:
      0
      0
      clamp(
        125px,
        11vw,
        170px
      );
  }

  .mg-carousel__image {
    height: clamp(72px, 5vw, 92px);
  }

  .mg-carousel__vehicle > span {
    margin-top: 8px;
    font-size: clamp(11px, 0.68vw, 14px);
  }

  .mg-carousel__nav {
    width: 46px;
    height: 46px;
  }

  .mg-carousel__nav svg {
    width: 17px;
  }
}


/* =========================================================
   VERY LARGE DESKTOP — 1600px+
========================================================= */

@media (min-width: 1600px) {
  .mg-range__header span {
    font-size: clamp(14px, 0.78vw, 18px);
  }

  .mg-range__background-title {
    font-size: clamp(300px, 18.5vw, 430px);
  }

  .mg-stage {
    width: min(97vw, 1650px);

    height:
      clamp(
        560px,
        43vw,
        760px
      );
  }

  .mg-range__info h2 {
    font-size: clamp(58px, 3vw, 74px);
  }

  .mg-range__type {
    font-size: clamp(14px, 0.8vw, 18px);
  }

  .mg-range__explore {
    font-size: clamp(14px, 0.78vw, 17px);
  }

  .mg-carousel {
    width: min(100%, 1550px);
  }

  .mg-carousel__vehicle {
    flex:
      0
      0
      clamp(
        140px,
        10vw,
        185px
      );
  }

  .mg-carousel__image {
    height: clamp(80px, 4.8vw, 100px);
  }

  .mg-carousel__vehicle > span {
    font-size: clamp(12px, 0.66vw, 15px);
  }
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .mg-range {

    min-height:
      auto;

  }


  .mg-stage {

    width:
      94vw;

    height:
      420px;

  }


  /* =====================================================
     EACH VEHICLE CAN HAVE ITS OWN TABLET WIDTH
  ====================================================== */

  .mg-car {

    width:
      var(
        --car-width-tablet
      );

  }


  .mg-carousel__vehicles {

    justify-content:
      flex-start;

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {

  .mg-range {

    min-height:
      auto;

    padding:
      60px
      16px
      40px;

  }


  .mg-range__background-title {

    top:
      15%;

    font-size:
      31vw;

  }


  .mg-stage {

    width:
      100%;

    height:
      280px;

    margin-top:
      25px;

  }


  /* =====================================================
     SWITCH TO THE SELECTED VEHICLE'S MOBILE VALUES

     No manual CSS per model is required down here.
  ====================================================== */

  .mg-car {

    width:
      var(
        --car-width-mobile
      );


    --front-wheel-x:
      var(
        --front-wheel-x-mobile
      );


    --front-wheel-y:
      var(
        --front-wheel-y-mobile
      );


    --front-wheel-size:
      var(
        --front-wheel-size-mobile
      );


    --rear-wheel-x:
      var(
        --rear-wheel-x-mobile
      );


    --rear-wheel-y:
      var(
        --rear-wheel-y-mobile
      );


    --rear-wheel-size:
      var(
        --rear-wheel-size-mobile
      );

  }


  .mg-range__info {

    margin-top:
      -4px;

  }


  .mg-carousel {

    grid-template-columns:
      34px
      minmax(
        0,
        1fr
      )
      34px;

    gap:
      6px;

    margin-top:
      38px;

  }


  .mg-carousel__nav {

    width:
      34px;

    height:
      34px;

  }


  .mg-carousel__vehicles {

    justify-content:
      flex-start;

    gap:
      12px;

    scroll-snap-type:
      x
      mandatory;

  }


  .mg-carousel__vehicle {

    flex-basis:
      90px;

    scroll-snap-align:
      center;

  }


  .mg-carousel__image {

    height:
      50px;

  }


  .mg-carousel__vehicle > span {

    font-size:
      7px;

  }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion:
  reduce
) {

  .mg-range *,
  .mg-range *::before,
  .mg-range *::after {

    transition-duration:
      0.01ms !important;

  }

}



/* =========================================================
   COMPACT JOIN WITH PREVIOUS SECTION
   Reduces the large blank gap before "DISCOVER THE RANGE".
========================================================= */
@media (min-width: 1001px) {
  .mg-range {
    min-height: auto;
    padding-top: clamp(22px, 1.7vw, 36px) !important;
  }

  .mg-stage {
    margin-top: clamp(12px, 1.4vh, 22px);
  }
}

@media (min-width: 1200px) {
  .mg-range {
    padding-top: clamp(24px, 1.8vw, 38px) !important;
  }

  .mg-range__background-title {
    top: 10%;
  }

  .mg-stage {
    margin-top: clamp(14px, 1.5vh, 24px);
  }
}


</style>