"use client";

import { useActionState, useState } from "react";

import { updateProfileAction } from "@/app/actions/profile";
import { Alert } from "@/components/ui/alert";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioCardGroup } from "@/components/ui/radio-card-group";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Avatar } from "@/components/ui/avatar";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";
import { BLOOD_GROUPS } from "@/lib/constants";
import type { ProfileDTO } from "@/types/user";

const BLOOD_GROUP_OPTIONS = BLOOD_GROUPS.map((group) => ({
  value: group,
  label: group,
}));

const AVAILABILITY_OPTIONS = [
  {
    value: "available",
    title: "Available to Donate",
    description: "You can be contacted when someone near you needs blood.",
    tone: "positive",
  },
  {
    value: "unavailable",
    title: "Not Available",
    description: "Keep your details on file but do not contact you right now.",
  },
] as const;

export function ProfileForm({ profile }: { profile: ProfileDTO }) {
  const [state, formAction] = useActionState(updateProfileAction, IDLE_FORM_STATE);
  const [availability, setAvailability] = useState<"" | "available" | "unavailable">(
    profile.availableToDonate === null
      ? ""
      : profile.availableToDonate
        ? "available"
        : "unavailable",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile.profileImage,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? (
        <Alert tone="error" title="Profile not saved">
          {state.message}
        </Alert>
      ) : null}

      {state.status === "success" ? (
        <Alert tone="success" title="Saved">
          {state.message}
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Personal</CardTitle>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile.name}
              src={imagePreview}
              size="lg"
              className="size-16"
            />
            <p className="text-sm text-ink-muted">
              Add a link to a photo so donors recognise you. Leave it empty to use
              your initials.
            </p>
          </div>

          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            autoComplete="name"
            defaultValue={profile.name}
            required
            error={state.fieldErrors?.name?.[0]}
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Mobile Number"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            defaultValue={profile.phone ?? ""}
            required
            hint="Only shared with a donor or requester after a request connects you."
            error={state.fieldErrors?.phone?.[0]}
          />

          <Input
            id="profileImage"
            name="profileImage"
            type="url"
            label="Profile Image"
            inputMode="url"
            placeholder="https://example.com/photo.jpg"
            defaultValue={profile.profileImage ?? ""}
            optional
            error={state.fieldErrors?.profileImage?.[0]}
            onChange={(event) => {
              const value = event.currentTarget.value.trim();
              setImagePreview(value.length > 0 ? value : null);
            }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood</CardTitle>
        </CardHeader>
        <CardBody className="space-y-5">
          <Select
            id="bloodGroup"
            name="bloodGroup"
            label="Blood Group"
            options={BLOOD_GROUP_OPTIONS}
            placeholder="Select your blood group"
            defaultValue={profile.bloodGroup ?? ""}
            required
            error={state.fieldErrors?.bloodGroup?.[0]}
          />

          <RadioCardGroup
            id="availability"
            name="availability"
            legend="Donor availability"
            hint="You can change this at any time."
            error={state.fieldErrors?.availability?.[0]}
            value={availability}
            options={AVAILABILITY_OPTIONS}
            onChange={setAvailability}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-5 sm:grid-cols-2">
          <Input
            id="state"
            name="state"
            type="text"
            label="State"
            autoComplete="address-level1"
            defaultValue={profile.state ?? ""}
            required
            error={state.fieldErrors?.state?.[0]}
          />

          <Input
            id="district"
            name="district"
            type="text"
            label="District"
            autoComplete="address-level2"
            defaultValue={profile.district ?? ""}
            required
            error={state.fieldErrors?.district?.[0]}
          />

          <Input
            id="locality"
            name="locality"
            type="text"
            label="Village / Locality"
            autoComplete="address-level3"
            containerClassName="sm:col-span-2"
            defaultValue={profile.locality ?? ""}
            required
            hint="Used to rank the closest donors first."
            error={state.fieldErrors?.locality?.[0]}
          />
        </CardBody>
        <CardFooter>
          <SubmitButton pendingLabel="Saving…" className="sm:w-auto">
            Save Profile
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
