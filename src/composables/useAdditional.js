import { ref } from "vue";

export function useAdditionalInfo() {
    const visibleModalAdditionalInfo = ref(false);

    const openWindow = () => {
        visibleModalAdditionalInfo.value = true;
    }

    return {
        visibleModalAdditionalInfo,
        openWindow,
    }
}