import { pick } from 'ramda';

// Converts a string value or `null` to an OData literal value.
export const odataLiteral = (value) => (value != null
  ? `'${value.replaceAll("'", "''")}'`
  : 'null');

// Converts the OData for an entity to an entity in the format of a REST
// response.
export const odataEntityToRest = (odata, properties) => {
  const { creatorId, creatorName } = odata.__system;
  const creator = { id: creatorId, displayName: creatorName };

  const propertyData = Object.create(null);
  for (const { name, odataName } of properties) {
    const value = odata[odataName];
    if (value != null) propertyData[name] = value;
  }

  return {
    uuid: odata.__id,
    creatorId,
    creator,
    ...pick(
      ['conflict', 'updates', 'createdAt', 'updatedAt'],
      odata.__system
    ),
    currentVersion: {
      version: odata.__system.version,
      label: odata.label,
      data: propertyData
    }
  };
};
