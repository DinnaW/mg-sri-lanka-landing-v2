<script setup>

import {

  computed,

  nextTick,

  onBeforeUnmount,

  ref,

} from "vue";

const asset = (path) =>

  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const vehicles = [

  {

    id: 1,

    name: "MG ZS",

    type: "100% Electric",

    

    image:

      asset("images/123.png"),

    

    frontWheel:

      asset("images/black.png"),

    rearWheel:

      asset("images/black.png"),

    link:

      "#",

    

    layout: {

      desktopWidth:

        "86%",

      tabletWidth:

        "90%",

      mobileWidth:

        "103%",

      maxWidth: "none",

    },

    

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

  

  {

    id: 2,

    name: "MG 4 Ev",

    type: "Hybrid+",

    

    image:

      asset("images/234.png"),

    

    frontWheel:

      asset("images/orange.png"),

    rearWheel:

      asset("images/orange.png"),

    link:

      "#",

    layout: {

      desktopWidth:

        "84%",

      tabletWidth:

        "89%",

      mobileWidth:

        "102%",

      maxWidth: "none",

    },

    wheels: {

      desktop: {

        front: {

          x:

            "24.3%",

          

          y:

            "75.5%",

          

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

        "88%",

      tabletWidth:

        "92%",

      mobileWidth:

        "106%",

      maxWidth: "none",

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

        "82%",

      tabletWidth:

        "87%",

      mobileWidth:

        "101%",

      maxWidth: "none",

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

        "88%",

      tabletWidth:

        "94%",

      mobileWidth:

        "110%",

      maxWidth: "none",

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

const activeIndex =

  ref(0);

const isAnimating =

  ref(false);

const carRef =

  ref(null);

const frontWheelRef =

  ref(null);

const rearWheelRef =

  ref(null);

const shadowRef =

  ref(null);

const DRIVE_DURATION =

  3400;

const START_MARGIN =

  90;

const currentVehicle =

  computed(() => {

    return vehicles[

      activeIndex.value

    ];

  });

const currentVehicleStyle =

  computed(() => {

    const vehicle =

      currentVehicle.value;

    return {

      "--car-width-desktop":

        vehicle.layout.desktopWidth,

      "--car-width-tablet":

        vehicle.layout.tabletWidth,

      "--car-width-mobile":

        vehicle.layout.mobileWidth,

      "--car-max-width":

        vehicle.layout.maxWidth,

      

      "--front-wheel-x-desktop":

        vehicle.wheels.desktop.front.x,

      "--front-wheel-y-desktop":

        vehicle.wheels.desktop.front.y,

      "--front-wheel-size-desktop":

        vehicle.wheels.desktop.front.size,

      

      "--rear-wheel-x-desktop":

        vehicle.wheels.desktop.rear.x,

      "--rear-wheel-y-desktop":

        vehicle.wheels.desktop.rear.y,

      "--rear-wheel-size-desktop":

        vehicle.wheels.desktop.rear.size,

      

      "--front-wheel-x-mobile":

        vehicle.wheels.mobile.front.x,

      "--front-wheel-y-mobile":

        vehicle.wheels.mobile.front.y,

      "--front-wheel-size-mobile":

        vehicle.wheels.mobile.front.size,

      

      "--rear-wheel-x-mobile":

        vehicle.wheels.mobile.rear.x,

      "--rear-wheel-y-mobile":

        vehicle.wheels.mobile.rear.y,

      "--rear-wheel-size-mobile":

        vehicle.wheels.mobile.rear.size,

    };

  });

let carAnimation =

  null;

let frontWheelAnimation =

  null;

let rearWheelAnimation =

  null;

let shadowAnimation =

  null;

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

    

    const carRect =

      car.getBoundingClientRect();

    

    const frontWheelRect =

      frontWheel.getBoundingClientRect();

    const rearWheelRect =

      rearWheel.getBoundingClientRect();

    

    const travelDistance =

      window.innerWidth / 2 +

      carRect.width / 2 +

      START_MARGIN;

    

    const startX =

      direction === "previous"

        ? -travelDistance

        : travelDistance;

    

    const frontDiameter =

      frontWheelRect.width;

    const frontCircumference =

      Math.PI *

      frontDiameter;

    

    const rearDiameter =

      rearWheelRect.width;

    const rearCircumference =

      Math.PI *

      rearDiameter;

    

    const frontRotations =

      travelDistance /

      frontCircumference;

    const rearRotations =

      travelDistance /

      rearCircumference;

    

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

    

    const easing =

      "cubic-bezier(0.22, 1, 0.36, 1)";

    

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

    

    try {

      await carAnimation.finished;

    }

    catch {

      return;

    }

    isAnimating.value =

      false;

  };

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

onBeforeUnmount(() => {

  cancelAnimations();

});

</script>

<template>

  <section class="mg-range">

    

    <div class="mg-range__header">

      <span>

        Discover the range

      </span>

    </div>

    

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

    

    <div class="mg-stage">

      

      <div

        ref="shadowRef"

        class="mg-stage__shadow"

      ></div>

      

      <div

        ref="carRef"

        :key="currentVehicle.id"

        class="mg-car"

        :style="currentVehicleStyle"

      >

        

        <img

          :src="currentVehicle.image"

          :alt="currentVehicle.name"

          class="mg-car__body"

          draggable="false"

        />

        

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

    

    <div class="mg-carousel">

      

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

@import url(

  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"

);

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

  font-size: 0.55vw;

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

  font-size: 18vw;

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

.mg-car {

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

.mg-range__type {

  display:

    block;

  margin-bottom:

    5px;

  font-family:

    "Manrope",

    sans-serif;

  font-size: 0.556vw;

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

.mg-range__info h2 {

  margin:

    0;

  font-family:

    "Barlow Condensed",

    sans-serif;

  font-size: 2.35vw;

  font-weight:

    500;

  line-height:

    1;

  letter-spacing:

    -0.02em;

  text-transform:

    uppercase;

}

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

  font-size: 0.556vw;

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

.mg-carousel__vehicle > span {

  display:

    block;

  margin-top:

    6px;

  font-family:

    "Manrope",

    sans-serif;

  font-size: 0.5vw;

  font-weight:

    700;

  letter-spacing:

    0.11em;

  text-transform:

    uppercase;

  text-align:

    center;

}

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
   FINAL SAME-VIEW RESPONSIVE LOCK
   ---------------------------------------------------------
   Removes the old desktop pixel caps so the full showcase
   keeps the same visual proportions on 1080p, 1440p, 2K,
   ultrawide and 4K screens.
========================================================= */

@media (min-width: 1001px) {
  .mg-range {
    min-height: 100svh;

    padding:
      6vw
      5vw
      3vw;

    box-sizing: border-box;
  }

  .mg-stage {
    width: 92vw;

    /*
      Width-driven scaling preserves the original composition.
      The viewport-height cap stops it from becoming too tall
      on very wide screens.
    */
    height: min(41vw, 54svh);

    margin-top: 4vh;
  }

  .mg-car {
    width: var(--car-width-desktop);
    max-width: none;
  }

  .mg-range__background-title {
    top: 15%;
    font-size: 18vw;
  }

  .mg-range__header span {
    font-size: .55vw;
  }

  .mg-range__info {
    margin-top: -1.25vw;
  }

  .mg-range__type {
    font-size: .556vw;
  }

  .mg-range__info h2 {
    font-size: 2.35vw;
  }

  .mg-range__explore {
    height: 2.8vw;
    min-height: 40px;

    margin-top: 1vw;

    padding:
      0
      1.3vw;

    font-size: .556vw;
  }

  .mg-carousel {
    width: 100%;

    margin-top: 4vh;

    grid-template-columns:
      2.8vw
      minmax(0, 1fr)
      2.8vw;

    gap: 2vw;
  }

  .mg-carousel__vehicles {
    justify-content: center;
    gap: 2.5vw;
  }

  .mg-carousel__vehicle {
    flex:
      0
      0
      10vw;
  }

  .mg-carousel__image {
    height: 4.4vw;
  }

  .mg-carousel__vehicle > span {
    font-size: .5vw;
  }

  .mg-carousel__nav {
    width: 2.8vw;
    height: 2.8vw;

    min-width: 42px;
    min-height: 42px;
  }

  .mg-carousel__nav svg {
    width: 1vw;
  }
}

/* =========================================================
   LARGE DESKTOP / 2K / 4K
   ---------------------------------------------------------
   Do not shrink the showcase by reintroducing pixel caps.
========================================================= */

@media (min-width: 1800px) {
  .mg-range {
    padding-top: 5.4vw;
    padding-bottom: 2.6vw;
  }

  .mg-stage {
    width: 92vw;
    height: min(41vw, 55svh);
  }

  .mg-car {
    width: var(--car-width-desktop);
    max-width: none;
  }

  .mg-carousel {
    width: 100%;
  }
}

</style>