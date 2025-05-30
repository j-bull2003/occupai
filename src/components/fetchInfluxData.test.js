import { fetchInfluxData } from './fetchInfluxData.jsx';
import { InfluxDB } from '@influxdata/influxdb-client';

let mockQueryRows;

jest.mock('@influxdata/influxdb-client', () => ({
  InfluxDB: jest.fn().mockImplementation(() => ({
    getQueryApi: () => ({
      queryRows: (...args) => mockQueryRows(...args),
    }),
  })),
}));

describe('fetchInfluxData', () => {
  beforeEach(() => {
    mockQueryRows = jest.fn();
  });

  it('returns grouped people_count and group_count data', async () => {
    mockQueryRows.mockImplementation((query, { next, error, complete }) => {
      next(null, {
        toObject: () => ({
          _time: '2025-05-27T00:00:00Z',
          _field: 'people_count',
          _value: 50,
        }),
      });
      next(null, {
        toObject: () => ({
          _time: '2025-05-27T00:00:00Z',
          _field: 'group_count',
          _value: 8,
        }),
      });
      complete();
    });

    const result = await fetchInfluxData();
    expect(result).toEqual([
      {
        time: '2025-05-27T00:00:00Z',
        people_count: 50,
        group_count: 8,
      },
    ]);
  });

  it('handles multiple time groups correctly', async () => {
    mockQueryRows.mockImplementation((query, { next, error, complete }) => {
      next(null, {
        toObject: () => ({
          _time: '2025-05-27T00:00:00Z',
          _field: 'people_count',
          _value: 10,
        }),
      });
      next(null, {
        toObject: () => ({
          _time: '2025-05-28T00:00:00Z',
          _field: 'group_count',
          _value: 5,
        }),
      });
      complete();
    });

    const result = await fetchInfluxData();
    expect(result).toEqual([
      {
        time: '2025-05-27T00:00:00Z',
        people_count: 10,
      },
      {
        time: '2025-05-28T00:00:00Z',
        group_count: 5,
      },
    ]);
  });

  it('handles errors from the InfluxDB client', async () => {
    const fakeError = new Error('Connection failed');
    mockQueryRows.mockImplementation((query, { next, error, complete }) => {
      error(fakeError);
    });

    await expect(fetchInfluxData()).rejects.toThrow('Connection failed');
  });

  it('returns empty array when no data received', async () => {
    mockQueryRows.mockImplementation((query, { next, error, complete }) => {
      complete();
    });

    const result = await fetchInfluxData();
    expect(result).toEqual([]);
  });
});
