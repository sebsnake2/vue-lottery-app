import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./app/App.vue";
import router from "./router";

import { registerServices } from "@/app/providers/services";
import { setupUi } from "@/app/providers/ui";

import "./app/styles/main.scss";

const app = createApp(App);

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

registerServices();
setupUi(app);

app.use(pinia);
app.use(router);

app.mount("#app");