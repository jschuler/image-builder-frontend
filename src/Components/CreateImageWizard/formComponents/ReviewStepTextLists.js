import React from 'react';

import { useFormApi } from '@data-driven-forms/react-form-renderer';
import {
  Alert,
  Button,
  Popover,
  Spinner,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants,
  TextVariants,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon, HelpIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

import ActivationKeyInformation from './ActivationKeyInformation';
import { AwsAccountId } from './AwsAccountId';
import {
  FSReviewTable,
  PackagesTable,
  RepositoriesTable,
} from './ReviewStepTables';

import { RELEASES, UNIT_GIB } from '../../../constants';
import { extractProvisioningList } from '../../../store/helpers';
import { useGetOscapCustomizationsQuery } from '../../../store/imageBuilderApi';
import { useGetSourceListQuery } from '../../../store/provisioningApi';
import { useShowActivationKeyQuery } from '../../../store/rhsmApi';
import { useGetEnvironment } from '../../../Utilities/useGetEnvironment';
import { googleAccType } from '../steps/googleCloud';

const ExpirationWarning = () => {
  return (
    <div className="pf-u-mr-sm pf-u-font-size-sm pf-u-warning-color-100">
      <ExclamationTriangleIcon /> Expires 14 days after creation
    </div>
  );
};

export const ImageOutputList = () => {
  const { getState } = useFormApi();
  return (
    <TextContent>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Release
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {RELEASES.get(getState()?.values?.release)}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          Architecture
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {getState()?.values?.arch}
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};

export const TargetEnvAWSList = () => {
  const { data: rawAWSSources, isSuccess } = useGetSourceListQuery({
    provider: 'aws',
  });
  const awsSources = extractProvisioningList(rawAWSSources);
  const { isBeta } = useGetEnvironment();

  const { getState } = useFormApi();
  return (
    <TextContent>
      <Text component={TextVariants.h3}>AWS</Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Image type
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Red Hat hosted image
          <br />
          <ExpirationWarning />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          Shared to account
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {!isBeta() && getState()?.values?.['aws-account-id']}
          {isBeta() &&
            getState()?.values?.['aws-target-type'] ===
              'aws-target-type-source' &&
            isSuccess && (
              <AwsAccountId
                sourceId={getState()?.values?.['aws-sources-select']}
              />
            )}
          {isBeta() &&
            getState()?.values?.['aws-target-type'] ===
              'aws-target-type-account-id' &&
            getState()?.values?.['aws-account-id']}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {getState()?.values?.['aws-target-type'] === 'aws-target-type-source'
            ? 'Source'
            : null}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {isSuccess &&
          getState()?.values?.['aws-target-type'] === 'aws-target-type-source'
            ? awsSources.find(
                (source) =>
                  source.id === getState()?.values?.['aws-sources-select']
              )?.name
            : null}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          Default region
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          us-east-1
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};

export const TargetEnvGCPList = () => {
  const { getState } = useFormApi();
  return (
    <TextContent>
      <Text component={TextVariants.h3}>GCP</Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Image type
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Red Hat hosted image
          <br />
          <ExpirationWarning />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          Account type
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {googleAccType?.[getState()?.values?.['google-account-type']]}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          {googleAccType?.[getState()?.values?.['google-account-type']] ===
          'Domain'
            ? 'Domain'
            : 'Principal'}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {getState()?.values?.['google-email'] ||
            getState()?.values?.['google-domain']}
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};

export const TargetEnvAzureList = () => {
  const { getState } = useFormApi();
  const { data: rawAzureSources, isSuccess: isSuccessAzureSources } =
    useGetSourceListQuery({ provider: 'azure' });
  const azureSources = extractProvisioningList(rawAzureSources);
  return (
    <TextContent>
      <Text component={TextVariants.h3}>Microsoft Azure</Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Image type
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Red Hat hosted image
          <br />
          <ExpirationWarning />
        </TextListItem>
        {getState()?.values?.['azure-type'] === 'azure-type-source' &&
          isSuccessAzureSources && (
            <>
              <TextListItem component={TextListItemVariants.dt}>
                Azure Source
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {
                  azureSources.find(
                    (source) =>
                      source.id === getState()?.values?.['azure-sources-select']
                  )?.name
                }
              </TextListItem>
            </>
          )}
        {getState()?.values?.['azure-type'] === 'azure-type-manual' && (
          <>
            <TextListItem component={TextListItemVariants.dt}>
              Azure Tenant ID
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {getState()?.values?.['azure-tenant-id']}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dt}>
              Subscription ID
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {getState()?.values?.['azure-subscription-id']}
            </TextListItem>
          </>
        )}
        <TextListItem component={TextListItemVariants.dt}>
          Resource group
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {getState()?.values?.['azure-resource-group']}
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};

export const TargetEnvOciList = () => {
  return (
    <TextContent>
      <Text component={TextVariants.h3}>Oracle Cloud Infrastructure</Text>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Object Storage URL
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          The URL for the built image will be ready to copy
          <br />
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};

export const TargetEnvOtherList = () => {
  return (
    <>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Image type
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Built image will be available for download
        </TextListItem>
      </TextList>
      <br />
    </>
  );
};

export const FSCList = () => {
  const { getState } = useFormApi();
  const isManual =
    getState()?.values?.['file-system-config-radio'] === 'manual';
  const partitions = getState()?.values?.['file-system-configuration'];

  return (
    <TextContent>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Configuration type
        </TextListItem>
        <TextListItem
          component={TextListItemVariants.dd}
          data-testid="partitioning-auto-manual"
        >
          {isManual ? 'Manual' : 'Automatic'}
          {isManual && (
            <>
              {' '}
              <Popover
                position="bottom"
                headerContent="Partitions"
                hasAutoWidth
                minWidth="30rem"
                bodyContent={<FSReviewTable />}
              >
                <Button
                  data-testid="file-system-configuration-popover"
                  variant="link"
                  aria-label="File system configuration info"
                  aria-describedby="file-system-configuration-info"
                  className="pf-u-pt-0 pf-u-pb-0"
                >
                  View partitions
                </Button>
              </Popover>
            </>
          )}
        </TextListItem>
        {isManual && (
          <>
            <TextListItem component={TextListItemVariants.dt}>
              Image size (minimum)
              <Popover
                hasAutoWidth
                bodyContent={
                  <TextContent>
                    <Text>
                      Image Builder may extend this size based on requirements,
                      selected packages, and configurations.
                    </Text>
                  </TextContent>
                }
              >
                <Button
                  variant="plain"
                  aria-label="File system configuration info"
                  aria-describedby="file-system-configuration-info"
                  className="pf-c-form__group-label-help"
                >
                  <HelpIcon />
                </Button>
              </Popover>
            </TextListItem>
            <MinSize isManual={isManual} partitions={partitions} />
          </>
        )}
      </TextList>
      <br />
    </TextContent>
  );
};

export const MinSize = ({ isManual, partitions }) => {
  let minSize = '';
  if (isManual && partitions) {
    let size = 0;
    for (const partition of partitions) {
      size += partition.size * partition.unit;
    }

    size = (size / UNIT_GIB).toFixed(1);
    if (size < 1) {
      minSize = `Less than 1 GiB`;
    } else {
      minSize = `${size} GiB`;
    }
  }

  return (
    <TextListItem component={TextListItemVariants.dd}> {minSize} </TextListItem>
  );
};

MinSize.propTypes = {
  isManual: PropTypes.bool,
  partitions: PropTypes.arrayOf(PropTypes.object),
};

export const ContentList = () => {
  const { getState } = useFormApi();
  return (
    <TextContent>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Additional Red Hat
          <br />
          and 3rd party packages
        </TextListItem>
        <TextListItem
          component={TextListItemVariants.dd}
          data-testid="chosen-packages-count"
        >
          {getState()?.values?.['selected-packages']?.length > 0 ? (
            <Popover
              position="bottom"
              headerContent="Additional packages"
              hasAutoWidth
              minWidth="30rem"
              bodyContent={<PackagesTable />}
            >
              <Button
                variant="link"
                aria-label="About packages key"
                className="pf-u-p-0"
              >
                {getState()?.values?.['selected-packages']?.length}
              </Button>
            </Popover>
          ) : (
            0
          )}
        </TextListItem>
        <TextListItem component={TextListItemVariants.dt}>
          Custom repositories
        </TextListItem>
        <TextListItem
          component={TextListItemVariants.dd}
          data-testid="custom-repositories-count"
        >
          {getState()?.values?.['payload-repositories']?.length > 0 ? (
            <Popover
              position="bottom"
              headerContent="Custom repositories"
              hasAutoWidth
              minWidth="30rem"
              bodyContent={<RepositoriesTable />}
            >
              <Button
                variant="link"
                aria-label="About custom repositories"
                className="pf-u-p-0"
              >
                {getState()?.values?.['payload-repositories']?.length || 0}
              </Button>
            </Popover>
          ) : (
            0
          )}
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};

export const RegisterLaterList = () => {
  return (
    <TextContent>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Registration type
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          Register the system later
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};

export const RegisterNowList = () => {
  const { getState } = useFormApi();
  const activationKey = getState()?.values?.['subscription-activation-key'];
  const { isError } = useShowActivationKeyQuery(
    { name: activationKey },
    {
      skip: !activationKey,
    }
  );
  return (
    <>
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem
            component={TextListItemVariants.dt}
            className="pf-u-min-width"
          >
            Registration type
          </TextListItem>
          <TextListItem
            component={TextListItemVariants.dd}
            data-testid="review-registration"
          >
            <TextList isPlain>
              {getState()?.values?.['register-system']?.startsWith(
                'register-now'
              ) && (
                <TextListItem>
                  Register with Red Hat Subscription Manager (RHSM)
                  <br />
                </TextListItem>
              )}
              {(getState()?.values?.['register-system'] ===
                'register-now-insights' ||
                getState()?.values?.['register-system'] ===
                  'register-now-rhc') && (
                <TextListItem>
                  Connect to Red Hat Insights
                  <br />
                </TextListItem>
              )}
              {getState()?.values?.['register-system'] ===
                'register-now-rhc' && (
                <TextListItem>
                  Use remote host configuration (rhc) utility
                  <br />
                </TextListItem>
              )}
            </TextList>
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Activation key
            <Popover
              bodyContent={
                <TextContent>
                  <Text>
                    Activation keys enable you to register a system with
                    appropriate subscriptions, system purpose, and repositories
                    attached.
                    <br />
                    <br />
                    If using an activation key with command line registration,
                    you must provide your organization&apos;s ID. Your
                    organization&apos;s ID is{' '}
                    {getState()?.values?.['subscription-organization-id'] !==
                    undefined ? (
                      getState()?.values?.['subscription-organization-id']
                    ) : (
                      <Spinner size="md" />
                    )}
                  </Text>
                </TextContent>
              }
            >
              <Button
                variant="plain"
                aria-label="About activation key"
                className="pf-u-pl-sm pf-u-pt-0 pf-u-pb-0"
                size="sm"
              >
                <HelpIcon />
              </Button>
            </Popover>
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            <ActivationKeyInformation />
          </TextListItem>
        </TextList>
        <br />
      </TextContent>
      {isError && (
        <Alert
          title="Information about the activation key unavailable"
          variant="danger"
          isPlain
          isInline
        >
          Information about the activation key cannot be loaded. Please check
          the key was not removed and try again later.
        </Alert>
      )}
    </>
  );
};

export const ImageDetailsList = () => {
  const { getState } = useFormApi();
  const imageName = getState()?.values?.['image-name'];
  const imageDescription = getState()?.values?.['image-description'];

  return (
    <TextContent>
      <TextList component={TextListVariants.dl}>
        {imageName && (
          <>
            <TextListItem
              component={TextListItemVariants.dt}
              className="pf-u-min-width"
            >
              Image name
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {imageName}
            </TextListItem>
          </>
        )}
        {imageDescription && (
          <>
            <TextListItem
              component={TextListItemVariants.dt}
              className="pf-u-min-width"
            >
              Description
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {imageDescription}
            </TextListItem>
          </>
        )}
      </TextList>
      <br />
    </TextContent>
  );
};

export const OscapList = () => {
  const { getState } = useFormApi();
  const oscapProfile = getState()?.values?.['oscap-profile'];
  const { data } = useGetOscapCustomizationsQuery({
    distribution: getState()?.values?.['release'],
    profile: oscapProfile,
  });

  return (
    <TextContent>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Profile Name:
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {data?.openscap?.profile_name}
        </TextListItem>
      </TextList>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Profile description:
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {data?.openscap?.profile_description}
        </TextListItem>
      </TextList>
      <TextList component={TextListVariants.dl}>
        <TextListItem
          component={TextListItemVariants.dt}
          className="pf-u-min-width"
        >
          Reference ID:
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {oscapProfile}
        </TextListItem>
      </TextList>
      <br />
    </TextContent>
  );
};
