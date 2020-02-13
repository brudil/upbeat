import {
  UpbeatId,
  UpbeatResource,
  UpbeatString,
  UpbeatBoolean,
  UpbeatOrderable,
  UpbeatSet,
  UpbeatReference,
} from '@upbeat/types/src';

export interface Todo extends UpbeatResource {
  _type: 'Todo';
  id: UpbeatId;
  name: UpbeatString;
  complete: UpbeatBoolean;
  order: UpbeatOrderable;
  tags: UpbeatSet<UpbeatReference<TodoTag>>;
}

export interface TodoTag extends UpbeatResource {
  _type: 'TodoTag';
  id: UpbeatId;
  name: UpbeatString;
  color: UpbeatString;
}

export interface Project extends UpbeatResource {
  _type: 'Project';
  id: UpbeatId;
  todos: UpbeatSet<Todo>;
}

export const schema = {
  resources: {
    Todo: {
      identifier: 'Todo',
      properties: {
        name: {
          identifier: 'name',
          type: { identifier: 'String', nullable: false, subtype: null },
        },
        complete: {
          identifier: 'complete',
          type: { identifier: 'Boolean', nullable: false, subtype: null },
        },
        order: {
          identifier: 'order',
          type: { identifier: 'Orderable', nullable: false, subtype: null },
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
    },
    TodoTag: {
      identifier: 'TodoTag',
      properties: {
        name: {
          identifier: 'name',
          type: { identifier: 'String', nullable: false, subtype: null },
        },
        color: {
          identifier: 'color',
          type: { identifier: 'String', nullable: false, subtype: null },
        },
      },
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
            subtype: { identifier: 'Todo', nullable: false, subtype: null },
          },
        },
      },
    },
  },
};
