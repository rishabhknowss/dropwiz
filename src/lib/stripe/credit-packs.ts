export type CreditPack = {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: string;
  popular?: boolean;
};

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack_50",
    name: "Starter Pack",
    credits: 50,
    price: 9,
    priceId: "price_1TUQVOLwwekd9qw0t4j3BYnC",
  },
  {
    id: "pack_100",
    name: "Growth Pack",
    credits: 100,
    price: 15,
    priceId: "price_1TUQVVLwwekd9qw0LnNBAR1s",
    popular: true,
  },
  {
    id: "pack_250",
    name: "Pro Pack",
    credits: 250,
    price: 29,
    priceId: "price_1TUQVfLwwekd9qw0YfLCTBVr",
  },
];

export const getCreditPackByPriceId = (priceId: string): CreditPack | undefined =>
  CREDIT_PACKS.find((p) => p.priceId === priceId);
