import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./app/App.vue";
import "./app/styles/main.scss";
import { registerServices } from "@/app/providers/services";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);

registerServices();

app.use(createPinia());
app.use(router);

app.mount("#app");

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);