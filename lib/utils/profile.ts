import type { ProfileDTO } from "@/types/user";

export type ProfileFieldKey =
  | "phone"
  | "bloodGroup"
  | "state"
  | "district"
  | "locality"
  | "availableToDonate";

const FIELD_LABELS: Record<ProfileFieldKey, string> = {
  phone: "Mobile number",
  bloodGroup: "Blood group",
  state: "State",
  district: "District",
  locality: "Village or locality",
  availableToDonate: "Donor availability",
};

const FIELD_ORDER: ProfileFieldKey[] = [
  "phone",
  "bloodGroup",
  "state",
  "district",
  "locality",
  "availableToDonate",
];

function isMissing(profile: ProfileDTO, field: ProfileFieldKey): boolean {
  switch (field) {
    case "phone":
      return !profile.phone;
    case "bloodGroup":
      return !profile.bloodGroup;
    case "state":
      return !profile.state;
    case "district":
      return !profile.district;
    case "locality":
      return !profile.locality;
    case "availableToDonate":
      return profile.availableToDonate === null;
  }
}

export function missingProfileFields(profile: ProfileDTO): ProfileFieldKey[] {
  return FIELD_ORDER.filter((field) => isMissing(profile, field));
}

export function completedProfileFieldCount(profile: ProfileDTO): number {
  return FIELD_ORDER.length - missingProfileFields(profile).length;
}

export function totalProfileFieldCount(): number {
  return FIELD_ORDER.length;
}

export function profileFieldLabel(field: ProfileFieldKey): string {
  return FIELD_LABELS[field];
}
