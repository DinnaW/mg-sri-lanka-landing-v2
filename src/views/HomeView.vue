<script setup>
import { ref } from "vue";

import MgPreloader from "../components/MgPreloader.vue";
import MgHeader from "../components/MgHeader.vue";
import MgHero from "../components/MgHero.vue";
import MgVehicleShowcase from "../components/MgVehicleShowcase.vue";
import MgAboutStory from "../components/MgAboutStory.vue";
import MgEditorialShowcase from "../components/MgEditorialShowcase.vue";
import MgDesignGallery from "../components/MgDesignGallery.vue";
import MgOwnerStories from "../components/MgOwnerStories.vue";
import MgDarkBrandStory from "../components/MgDarkBrandStory.vue";
import MgRangeSection from "../components/MgRangeSection.vue";
import MgCinematicBanner from "../components/MgCinematicBanner.vue";
import MgShowroomFooter from "../components/MgShowroomFooter.vue";
import MgModelShowcaseStage from "../components/MgModelShowcaseStage.vue";

// import MgScrollStory from "../components/MgScrollStory.vue";

/* =========================================================
   PRELOADER → 3D GATE

   model-viewer is registered by main.js, while the heavy GLB
   showcase is mounted only after the cockpit preloader has
   completely finished.
========================================================= */

const preloaderFinished = ref(false);

const handlePreloaderFinished = () => {
  preloaderFinished.value = true;
};
</script>

<template>
  <MgPreloader @finished="handlePreloaderFinished" />

  <MgHeader
    test-drive-link="#showroom"
    dealer-link="#showroom"
  />

  <main class="mg-page">
    <!-- 01 — Brand / campaign opening -->
    <MgHero />

     <div id="mg-range" class="mg-anchor-target">
      <div id="offers" class="mg-anchor-alias" aria-hidden="true"></div>
      <MgRangeSection />
    </div>

    <!-- 02 — Immediate product discovery -->
    <MgVehicleShowcase />

    <!-- 03 — Engineering / driving story -->
    <div id="discover" class="mg-anchor-target">
      <MgAboutStory />
    </div>

    <!-- 04 — Design and craftsmanship -->
    <MgEditorialShowcase />

    <!-- 05 — Dark brand statement / tonal reset -->
    <MgDarkBrandStory />

    <!-- 06 — Detail-led gallery -->
    <MgDesignGallery />

    <MgModelShowcaseStage v-if="preloaderFinished" />

    <!-- 08 — Real-world confidence / social proof -->
    <div id="owners" class="mg-anchor-target">
      <MgOwnerStories />
    </div>

  
    <!-- 10 — Emotional campaign close -->
    <MgCinematicBanner />

    <!-- 11 — Showroom / contact / footer -->
    <div id="showroom" class="mg-anchor-target">
      <MgShowroomFooter />
    </div>

    <!-- <MgScrollStory /> -->
  </main>
</template>

<style scoped>
.mg-page {
  width: 100%;
  overflow: hidden;
}

.mg-anchor-target {
  position: relative;
  scroll-margin-top: 5.4vw;
}

.mg-anchor-alias {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
</style>
