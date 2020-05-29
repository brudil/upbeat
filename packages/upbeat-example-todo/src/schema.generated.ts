import { Schema } from '@upbeat/schema/src';

import {
  UpbeatId,
  UpbeatResource,
  RealisedResource,
  UpbeatString,
  UpbeatBoolean,
  UpbeatOrderable,
  UpbeatSet,
  UpbeatReference,
} from '@upbeat/types/src';

export interface TodoResourceSchema extends UpbeatResource {
  _type: 'Todo';
  id: UpbeatId;
  name: UpbeatString;
  complete: UpbeatBoolean;
  order: UpbeatOrderable;
  tags: UpbeatSet<UpbeatReference<TodoTagResourceSchema>>;
}
export type TodoResource = RealisedResource<TodoResourceSchema>;

export interface TodoTagResourceSchema extends UpbeatResource {
  _type: 'TodoTag';
  id: UpbeatId;
  name: UpbeatString;
  color: UpbeatString;
}
export type TodoTagResource = RealisedResource<TodoTagResourceSchema>;

export interface ProjectResourceSchema extends UpbeatResource {
  _type: 'Project';
  id: UpbeatId;
  todos: UpbeatSet<TodoResourceSchema>;
}
export type ProjectResource = RealisedResource<ProjectResourceSchema>;

export interface ResourcesSchema {
  Todo: TodoResourceSchema;
  TodoTag: TodoTagResourceSchema;
}

export const schema: Schema = {
  resources: {
    Todo: {
      identifier: 'Todo',
      properties: {
        name: {
          identifier: 'name',
          type: {
            identifier: 'String',
            nullable: false,
            subtype: null,
          },
        },
        complete: {
          identifier: 'complete',
          type: {
            identifier: 'Boolean',
            nullable: false,
            subtype: null,
          },
        },
        order: {
          identifier: 'order',
          type: {
            identifier: 'Orderable',
            nullable: false,
            subtype: null,
          },
        },
        tags: {
          identifier: 'tags',
          type: {
            identifier: 'Set',
            nullable: false,
            subtype: {
              identifier: 'Reference',
              nullable: false,
              subtype: {
                identifier: 'TodoTag',
                nullable: false,
                subtype: null,
              },
            },
          },
        },
      },
      keys: {
        order_complete: {
          identifier: 'order_complete',
          identifiers: ['order', 'complete'],
        },
      },
    },
    TodoTag: {
      identifier: 'TodoTag',
      properties: {
        name: {
          identifier: 'name',
          type: {
            identifier: 'String',
            nullable: false,
            subtype: null,
          },
        },
        color: {
          identifier: 'color',
          type: {
            identifier: 'String',
            nullable: false,
            subtype: null,
          },
        },
      },
      keys: {},
    },
  },
  spaces: {
    Project: {
      identifier: 'Project',
      properties: {
        todos: {
          identifier: 'todos',
          type: {
            identifier: 'Set',
            nullable: false,
            subtype: {
              identifier: 'Todo',
              nullable: false,
              subtype: null,
            },
          },
        },
      },
    },
  },
};
