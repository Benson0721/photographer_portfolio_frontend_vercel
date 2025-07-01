import { ref } from "vue";

const snackbar = ref(false);
const message = ref("");
const color = ref("success");

export function useToast() {
  const show = (
    msg: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    message.value = msg;
    color.value = type;
    snackbar.value = true;
    setTimeout(() => {
      snackbar.value = false;
    }, 2000);
  };

  return {
    snackbar,
    message,
    color,
    show,
  };
}
