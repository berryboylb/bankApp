export enum Sample  { 
    "sammple"= "sample"
}
export enum PaymentMethod {
  CARD = "card",
  TRANSFER = "transfer",
}

export enum IdentificationType {
  PASSPORT = "passport",
  DRIVER_LICENSE = "driver_license",
  NATIONAL_ID = "national_id",
}

export const UserTypes: string[] = ["User", "Admin"];
export const AccountTierTypes: string[] = ["Tier 1", "Tier 2", "Tier 3"];
export const AccountTypes: string[] = ["Savings", "Current"];
export const transactionTypes: string[] = ["debit", "credit"];