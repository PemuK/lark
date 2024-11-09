import { defineStore } from "pinia";
import { ref } from "vue";

export const useSidebarStore = defineStore("sidebar", () => {
    const collapse = ref(true);

    function handleCollapse() {
        collapse.value = !collapse.value;
    }
    return {
        collapse,
        handleCollapse,
    };
});
