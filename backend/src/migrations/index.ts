import * as migration_20260622_100407_initial from './20260622_100407_initial';

export const migrations = [
  {
    up: migration_20260622_100407_initial.up,
    down: migration_20260622_100407_initial.down,
    name: '20260622_100407_initial'
  },
];
