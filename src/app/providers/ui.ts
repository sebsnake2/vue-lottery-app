import type { App } from "vue";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

export function setupUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });

  app.use(ConfirmationService);
  app.use(ToastService);
}