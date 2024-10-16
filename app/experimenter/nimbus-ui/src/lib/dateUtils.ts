/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getAllExperiments_experiments } from "../types/getAllExperiments";
import { getExperiment_experimentBySlug } from "../types/getExperiment";
import pluralize from "./pluralize";

export function humanDate(
  date: string,
  year: boolean | "past" = "past",
): string {
  const today = new Date();
  const parsedDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  // Only show the year if the date's year is not the current
  // year, or if the option is explicitly enabled
  if (
    (year === "past" && today.getFullYear() !== parsedDate.getFullYear()) ||
    year === true
  ) {
    options.year = "numeric";
  }

  return parsedDate.toLocaleString("en-US", options);
}

export function addDaysToDate(datestring: string, days: number): string {
  const date = new Date(datestring);
  date.setDate(date.getDate() + days);
  return date.toDateString();
}

/**
 *  Subtract two dates (e.g. dateA - dateB) and return a string
 *  with their difference in days.
 */
export function stringDateSubtract(dateA: string, dateB: string): string {
  const DAY = 86400000; // Number of milliseconds in a day
  const dateAConverted = +new Date(dateA);
  const dateBConverted = +new Date(dateB);
  const dateDifference = Math.abs(dateAConverted - dateBConverted);

  return pluralize(Math.round(dateDifference / DAY), "day");
}

/**
 *  Renders period of enrollment depend on what's available
 *  If startDate is set, it will return a range of dates
 *      e.g. Dec 2 - Dec 4
 *  If startDate is not set, it will return a number of days
 *      e.g. 2 days
 */
export function getProposedEnrollmentRange(
  experiment: getExperiment_experimentBySlug | getAllExperiments_experiments,
): string {
  const { startDate, proposedEnrollment } = experiment;
  if (startDate) {
    return `${humanDate(startDate)} to ${humanDate(
      addDaysToDate(startDate, proposedEnrollment),
    )}`;
  } else {
    return pluralize(proposedEnrollment, "day");
  }
}
