"use client";

import { useId, useState } from "react";
import { INDIA_STATES, getDistrictsForState } from "@/lib/data/india-locations";

interface StateDistrictSelectProps {
  defaultState?: string;
  defaultDistrict?: string;
  stateName?: string;
  districtName?: string;
  stateLabel?: string;
  districtLabel?: string;
  statePlaceholder?: string;
  districtPlaceholder?: string;
  stateError?: string;
  districtError?: string;
  required?: boolean;
  className?: string;
  onStateChange?: (state: string) => void;
  onDistrictChange?: (district: string) => void;
}

export function StateDistrictSelect({
  defaultState = "",
  defaultDistrict = "",
  stateName = "state",
  districtName = "district",
  stateLabel = "State",
  districtLabel = "District",
  statePlaceholder,
  districtPlaceholder,
  stateError,
  districtError,
  required = true,
  className = "",
  onStateChange,
  onDistrictChange,
}: StateDistrictSelectProps) {
  const stateId = useId();
  const districtId = useId();

  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);

  const availableDistricts = getDistrictsForState(selectedState);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    onStateChange?.(newState);

    const districts = getDistrictsForState(newState);
    if (!districts.includes(selectedDistrict)) {
      setSelectedDistrict("");
      onDistrictChange?.("");
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    onDistrictChange?.(newDistrict);
  };

  const defaultStateText = statePlaceholder || (required ? "Select State / Union Territory" : "All States / Any");
  const defaultDistrictText =
    districtPlaceholder ||
    (!selectedState
      ? required
        ? "First select a state"
        : "All Districts / Any"
      : required
      ? "Select District"
      : "All Districts in State");

  const baseSelectClasses =
    "h-10.5 w-full rounded-xl border bg-surface px-3.5 text-sm font-medium text-ink outline-none transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10 shadow-xs cursor-pointer";

  return (
    <div className={className || "grid gap-4 sm:grid-cols-2"}>
      {/* State Dropdown */}
      <div>
        <label
          htmlFor={stateId}
          className="mb-1.5 block text-xs font-bold text-ink-secondary"
        >
          {stateLabel} {required ? <span className="text-mahogany-600">*</span> : null}
        </label>
        <select
          id={stateId}
          name={stateName}
          value={selectedState}
          required={required}
          onChange={(e) => handleStateChange(e.target.value)}
          className={`${baseSelectClasses} ${
            stateError
              ? "border-mahogany-500 bg-mahogany-50/20 text-mahogany-900"
              : "border-line-strong/80"
          }`}
        >
          <option value="" disabled={required}>
            {defaultStateText}
          </option>
          {INDIA_STATES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
        {stateError ? (
          <p className="mt-1 text-xs font-semibold text-mahogany-700">{stateError}</p>
        ) : null}
      </div>

      {/* District Dropdown */}
      <div>
        <label
          htmlFor={districtId}
          className="mb-1.5 block text-xs font-bold text-ink-secondary"
        >
          {districtLabel} {required ? <span className="text-mahogany-600">*</span> : null}
        </label>
        <select
          id={districtId}
          name={districtName}
          value={selectedDistrict}
          required={required}
          disabled={required && (!selectedState || availableDistricts.length === 0)}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className={`${baseSelectClasses} ${
            districtError
              ? "border-mahogany-500 bg-mahogany-50/20 text-mahogany-900"
              : "border-line-strong/80"
          } ${
            required && !selectedState
              ? "cursor-not-allowed bg-canvas text-ink-subtle opacity-70"
              : ""
          }`}
        >
          <option value="" disabled={required}>
            {defaultDistrictText}
          </option>
          {availableDistricts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
        {districtError ? (
          <p className="mt-1 text-xs font-semibold text-mahogany-700">
            {districtError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
