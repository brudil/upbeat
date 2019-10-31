import React, { useMemo } from 'react';
import { ClientContainer } from '../clientManager';
import { Atom } from '../types';
import { OperationTreeVisualisation } from './OperationTreeVisualisation';
import { Heading } from './Heading';

const opTreeTransform = (op: Atom) => {
  return {
    name: '',
    attributes: {
      site: op.operation.id.siteId,
      operation:
        op.operation.value === null
          ? 'NULL'
          : op.operation.value.type === 1
          ? 'INSERT'
          : 'DELETE',
      contents:
        op.operation.value && op.operation.value.contents
          ? op.operation.value.contents.join('')
          : '',
    },
    children: op.children.map(opTreeTransform),
  };
};

export const Client: React.FC<{ clientContainer: ClientContainer }> = ({
  clientContainer,
}) => {
  // const transform = useMemo(() => , [clientContainer.client.text.operationTree]);

  return (
    <div className="p-3 bg-blue-100 my-2">
      <Heading>{clientContainer.client.siteId}</Heading>
      <div>{clientContainer.client.assembleString()}</div>
      <div className="h-64">
        <OperationTreeVisualisation
          tree={opTreeTransform(clientContainer.client.text.operationTree)}
        ></OperationTreeVisualisation>
      </div>
    </div>
  );
};
