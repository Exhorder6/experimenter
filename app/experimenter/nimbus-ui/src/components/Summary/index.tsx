/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import Badge from "react-bootstrap/Badge";
import { ReactComponent as ExternalIcon } from "../../images/external.svg";
import { getStatus } from "../../lib/experiment";
import { ConfigOptions, getConfigLabel } from "../../lib/getConfigLabel";
import { getExperiment_experimentBySlug } from "../../types/getExperiment";
import LinkExternal from "../LinkExternal";
import LinkMonitoring from "../LinkMonitoring";
import NotSet from "../NotSet";
import EndExperiment from "./EndExperiment";
import SummaryTimeline from "./SummaryTimeline";
import TableAudience from "./TableAudience";
import TableBranches from "./TableBranches";
import TableSummary from "./TableSummary";

type SummaryProps = {
  experiment: getExperiment_experimentBySlug;
};

const Summary = ({ experiment }: SummaryProps) => {
  const status = getStatus(experiment);
  const branchCount = [
    experiment.referenceBranch,
    ...(experiment.treatmentBranches || []),
  ].filter((branch) => !!branch).length;

  return (
    <div data-testid="summary">
      <h2 className="h5 mb-3">
        Timeline
        {status.live && <StatusPills {...{ experiment }} />}
      </h2>

      <SummaryTimeline {...{ experiment }} />
      {status.live && <EndExperiment {...{ experiment }} />}

      <hr />

      <LinkMonitoring {...experiment} />

      <div className="d-flex flex-row justify-content-between">
        <h2 className="h5 mb-3">Summary</h2>
        {!status.draft && (
          <span>
            <LinkExternal
              href={`/api/v6/experiments/${experiment.slug}/`}
              data-testid="link-json"
            >
              <span className="mr-1 align-middle">
                See full JSON representation
              </span>
              <ExternalIcon />
            </LinkExternal>
          </span>
        )}
      </div>
      <TableSummary {...{ experiment }} />

      <h2 className="h5 mb-3">Audience</h2>
      <TableAudience {...{ experiment }} />

      <h2 className="h5 mb-3" data-testid="branches-section-title">
        Branches ({branchCount})
      </h2>
      <TableBranches {...{ experiment }} />
    </div>
  );
};

export const displayConfigLabelOrNotSet = (
  value: string | null,
  options: ConfigOptions,
) => {
  if (!value) return <NotSet />;
  return getConfigLabel(value, options);
};

export default Summary;

const StatusPills = ({
  experiment,
}: {
  experiment: getExperiment_experimentBySlug;
}) => (
  <>
    {experiment.isEndRequested && (
      <StatusPill
        testId="pill-end-requested"
        label="Experiment End Requested"
      />
    )}
    {experiment.isEnrollmentPaused === false && (
      <StatusPill
        testId="pill-enrolling-active"
        label="Enrolling Users in Progress"
      />
    )}
    {experiment.isEnrollmentPaused && experiment.enrollmentEndDate && (
      <StatusPill
        testId="pill-enrolling-complete"
        label="Enrollment Complete"
      />
    )}
  </>
);

const StatusPill = ({ label, testId }: { label: string; testId: string }) => (
  <Badge
    className="ml-2 border rounded-pill px-2 bg-white border-primary text-primary font-weight-normal"
    data-testid={testId}
  >
    {label}
  </Badge>
);
