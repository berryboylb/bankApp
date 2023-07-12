export enum Sample {
  "sample" = "sample",
}
export enum PaymentMethod {
  CARD = "card",
  TRANSFER = "transfer",
  DEPOSIT = "DEPOSIT",
}

export enum IdentificationType {
  PASSPORT = "passport",
  DRIVER_LICENSE = "driver_license",
  NATIONAL_ID = "national_id",
}

export enum UserTypes {
  User = "User",
  SubAdmin = "SubAdmin",
  Admin = "Admin",
}

export enum DescriptionTypes {
  Deposit = "Deposit",
}
export enum TransferLimits {
  Minimum = 100,
  Tier1 = 50000,
  Tier2 = 1000000,
  Tier3 = 50000000,
}

// export const UserTypes: string[] = ["User", "Admin"];
export const AccountTierTypes: string[] = ["Tier 1", "Tier 2", "Tier 3"];
export const AccountTypes: string[] = ["Savings", "Current"];
export const transactionTypes: string[] = ["debit", "credit"];

export const logFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
