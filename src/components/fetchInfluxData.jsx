// utils/fetchInfluxData.js
import { InfluxDB } from '@influxdata/influxdb-client';

const token = "tDXovw7zbw1w9OlsVbbhtpP_0XYA3I_vXC-X5RGuGcWMakPUSYZBQ8Jt5cMumPTO0L3gYCD8A5IlBHXVpDZNzg==";
const org = "OccupAI";
const bucket = 'occupancy_data';
const url = "https://us-east-1-1.aws.cloud2.influxdata.com";

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export async function fetchInfluxData() {
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1d)
      |> filter(fn: (r) => r._measurement == "crowd_metrics")
      |> filter(fn: (r) => r._field == "people_count" or r._field == "group_count")
  `;

  const groupedData = new Map();

  return new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        const time = o._time;

        if (!groupedData.has(time)) {
          groupedData.set(time, { time });
        }
        groupedData.get(time)[o._field] = o._value;
      },
      error(error) {
        console.error('Influx query error:', error);
        reject(error);
      },
      complete() {
        resolve(Array.from(groupedData.values()));
      },
    });
  });
}
