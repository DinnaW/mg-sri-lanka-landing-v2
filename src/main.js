import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

/*
 * Register <model-viewer> once at application startup.
 *
 * The 41 MB GLB is NOT requested here. HomeView mounts the
 * active MgModelShowcaseStage only after MgPreloader emits
 * "finished", so the heavy model starts after the preloader
 * has completely left the screen.
 *
 * Keeping registration here matches the project versions where
 * the supplied GLB rendered reliably and removes the async custom
 * element registration race from HomeView / the 3D component.
 */
import "@google/model-viewer";

const app = createApp(App);
app.use(router);
app.mount("#app");
