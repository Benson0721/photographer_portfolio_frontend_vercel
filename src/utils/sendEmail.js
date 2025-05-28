import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

console.log(import.meta.env);

export const sendEmail = async (data) => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        subject: data.subject,
        name: data.name,
        message: data.message,
        email: data.email,
      },
      EMAILJS_USER_ID
    );
    return { message: "成功寄出郵件" };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { error: "寄出郵件失敗" };
  }
};
