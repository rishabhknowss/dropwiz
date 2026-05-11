import { generateIconSnippet } from "./icon";
import { generatePaymentIconsSnippet } from "./payment-icons";
import { generateRatingStarsSnippet } from "./rating-stars";

export type SnippetOutput = {
  filename: string;
  content: string;
};

export const generateAllSnippets = (): SnippetOutput[] => {
  return [
    {
      filename: "dw-icon.liquid",
      content: generateIconSnippet(),
    },
    {
      filename: "dw-payment-icons.liquid",
      content: generatePaymentIconsSnippet(),
    },
    {
      filename: "dw-rating-stars.liquid",
      content: generateRatingStarsSnippet(),
    },
  ];
};

export { generateIconSnippet, generatePaymentIconsSnippet, generateRatingStarsSnippet };
