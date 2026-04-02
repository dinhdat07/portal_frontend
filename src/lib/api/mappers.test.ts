import { describe, expect, it } from 'vitest';
import { mapPagination, mapUser } from './mappers';

describe('api mappers', () => {
  it('maps user transport to frontend model', () => {
    const user = mapUser({
      id: '1',
      email: 'ada@example.com',
      username: 'ada',
      first_name: 'Ada',
      last_name: 'Lovelace',
      role: 'admin',
      status: 'active',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z',
    });

    expect(user.firstName).toBe('Ada');
    expect(user.lastName).toBe('Lovelace');
    expect(user.role).toBe('admin');
  });

  it('maps pagination keys', () => {
    expect(
      mapPagination({
        page: 2,
        page_size: 20,
        total: 99,
      }),
    ).toEqual({
      page: 2,
      pageSize: 20,
      total: 99,
    });
  });
});
