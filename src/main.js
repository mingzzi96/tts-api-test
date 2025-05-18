import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import lang from "@/locales/index";

const app = createApp(App);

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang"),
  fallbackLocale: "EN",
  messages: lang,
});

app.use(i18n);

app.mount("#app");
