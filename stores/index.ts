import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPersistedState);

export default pinia;
