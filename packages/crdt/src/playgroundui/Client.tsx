import React, { useMemo } from 'react';
import { ClientContainer, ClientStatus } from '../networkSimulator';
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

  const online = clientContainer.status === ClientStatus.ONLINE;
  return (
    <div className="p-3 bg-blue-100 my-2">
      <Heading>
        <span className="mr-2">{clientContainer.client.siteId}</span>
        <button
          className={`uppercase font-bold text-xs underline ${
            online ? 'text-green-700 mr-2' : 'text-red-700 mr-2'
          }`}
          onClick={() =>
            (clientContainer.status =
              clientContainer.status === ClientStatus.ONLINE
                ? ClientStatus.OFFLINE
                : ClientStatus.ONLINE)
          }
        >
          {online ? 'Online' : 'Offline'}
        </button>
        <span className="text-orange-700 mr-2">
          {clientContainer.operationQueue.length > 0
            ? `${clientContainer.operationQueue.length} in queue`
            : ''}
        </span>
        <span className="float-right">
          {(clientContainer.client.text.getSize() / 1024).toPrecision(2)}KB
        </span>
      </Heading>
      <textarea value={clientContainer.client.assembleString()} />
      <div className="h-64">
        <OperationTreeVisualisation
          tree={opTreeTransform(clientContainer.client.text.operationTree)}
        ></OperationTreeVisualisation>
      </div>
    </div>
  );
};
