import { ref, watch, Ref } from "vue";
import { useOffsetYHandler } from "./useOffsetYHandler";
export function useDragHandler(
  maxScrollY: number,
  path: string,
  id: string,
  isDialogLoading: Ref<boolean>,
  initialOffsetY: {
    mobile: number;
    tablet: number;
    desktop: number;
  },
  device: Ref<"mobile" | "tablet" | "desktop"> //ref才會響應，一般的型別只會傳入初始化結果
) {
  const offsetY = ref(initialOffsetY);
  const dragMessage = ref("");
  let startY = 0;
  let dragging = ref(false);
  let updateTimer;
  
  function startDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    dragging.value = true;
    startY = event.touches ? event.touches[0].clientY : event.clientY;
  }

  function onDrag(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (!dragging.value) return;
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = y - startY;
    startY = y;

    // 限制拖拉範圍：根據圖片高度與容器高度計算

    offsetY.value[device.value] = Math.max(
      Math.min(offsetY.value[device.value] + deltaY, 0),
      -maxScrollY
    );
  }

  async function endDrag() {
    dragging.value = false;
    isDialogLoading.value = true;
  }

  watch(
    offsetY,
    (newVal) => {
      clearTimeout(updateTimer);
      updateTimer = setTimeout(async () => {
        const message = await useOffsetYHandler(path, id, newVal);
        dragMessage.value = message;
        isDialogLoading.value = false;
      }, 3000);
    },
    { deep: true }
  );

  return {
    offsetY,
    dragMessage,
    startDrag,
    onDrag,
    endDrag,
    isDragging: dragging,
  };
}
