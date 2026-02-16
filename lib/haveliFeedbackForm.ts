/**
 * Haveli feedback form — submission endpoint (Google Apps Script web app).
 * Do not add this route to site navigation; share the link directly.
 */
export const HAVELI_FEEDBACK_SUBMISSION_URL =
  process.env.NEXT_PUBLIC_HAVELI_FEEDBACK_URL ||
  "https://script.google.com/macros/s/AKfycbyHS6yS8_7c_e1ugKzECy0_bjeA2Wq_XEWXSVO_y7ckAK5OSDjAu72VKzI9OpHnEjtZgQ/exec";

export type HaveliFeedbackPayload = {
  hospitality: number | "";
  food: string;
  walkAroundStay: string;
  pets: string;
  monitor: string;
  entertainment: string;
  cleanliness: number | string | "";
  kitchen: string;
  princessTreatment: number | "";
  affection: number | "";
};
