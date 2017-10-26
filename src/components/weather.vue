<template>
  <div>
    <ul class="weather--forecast" v-if="forecast !== null">
      <li class="weather--forecast-item" v-for="(item, index) in forecast.hourly_forecast" :key="index">
        <div class="weather--forecast-item-info">
          <div class="weather--forecast-item-info-time">
            {{item.FCTTIME.hour}}<small>h</small>
          </div>
        </div>
        <div class="weather--forecast-item-info">
          <div class="weather--forecast-item-info-icon">
            <i :class="['wu', 'wu-white', 'wu-'+item.icon]"></i>
          </div>
        </div>
        <div class="weather--forecast-item-info">
          <div class="weather--forecast-item-info-wind">
            <img src="/static/winds-symbol.svg" :style="windStyle(item)"/>
          </div>
        </div>
      </li>
    </ul>
    <div class="weather--chart-container weather--chart-temp">
      <canvas id="chartTemp"></canvas>
    </div>
    <div class="weather--chart-container weather--chart-rain">
      <canvas id="chartRain"></canvas>
    </div>
    <div class="weather--chart-container weather--chart-sky-air">
      <canvas id="chartSkyAir"></canvas>
    </div>
    <div class="weather--chart-container weather--chart-10d-temp">
      <canvas id="chart10dTemp"></canvas>
    </div>
  </div>
</template>

<script>
  import config from '@/config';
  import 'weather-underground-icons/dist/wu-icons-style.min.css';
  import Chart from 'chart.js';
  import 'chartjs-plugin-datalabels';

  // Disable datalabels globally, just in case
  Chart.defaults.global.plugins.datalabels.display = false;

  const WUApiKey = config.WUApiKey;
  const rainMaxMm = config.rainMaxMm;

  export default {
    name: 'weather',
    props: {
      places: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        latitude: null,
        longitude: null,
        chartTemp: null,
        chartRain: null,
        chartSkyAir: null,
      };
    },
    asyncComputed: {
      forecast() {
        if (this.latitude === null || this.longitude === null) {
          return null;
        }
        return fetch(`https://api.wunderground.com/api/${WUApiKey}/forecast10day/hourly/lang:${navigator.language.replace(/-.*/, '').toUpperCase()}/q/${this.latitude},${this.longitude}.json`)
          .then(response => response.json());
      },
    },
    mounted() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
      this.chartTemp = new Chart('chartTemp', {
        type: 'bar',
        data: {},
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              id: 'temp',
              display: false,
            }],
            xAxes: [{
              id: 'time',
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                drawTicks: false,
                tickMarkLength: 0,
              },
            }],
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          elements: {
            line: {
              borderCapStyle: 'round',
            },
            point: {
              radius: 0,
              hitRadius: 0,
              hoverRadius: 0,
            },
          },
          layout: {
            padding: {
              top: 20, // margin for top datalabels
            },
          },
          plugins: {
            datalabels: {
              display: true,
              color: 'white',
              align: 'end',
              offset: 0,
            },
          },
        },
        plugins: [{
          beforeRender: (chart) => {
            if (chart.config.data.datasets[0]) {
              const dsMeta = chart.getDatasetMeta(0);
              const dataset = dsMeta.controller.chart.config.data.datasets[0];
              const color = this.chartTemp.ctx.createLinearGradient(0, 0, chart.width, 0);
              dsMeta.data.forEach((el, idx) => {
                const pt = el.getCenterPoint();
                color.addColorStop(pt.x / chart.width, this.tempToColor(dataset.data[idx]));
              });
              dataset.borderColor = color;
              dsMeta.controller.update();
            }
          },
        }],
      });
      this.chartRain = new Chart('chartRain', {
        type: 'bar',
        data: {},
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              id: 'qpf',
              position: 'left',
              display: false,
              ticks: {
                min: 0,
                suggestedMax: rainMaxMm,
                stepSize: 0.5,
              },
            }, {
              id: 'pop',
              position: 'right',
              display: false,
              ticks: {
                min: 0,
                max: 100,
              },
            }],
            xAxes: [{
              id: 'time',
              ticks: {
                display: false,
              },
              gridLines: {
                tickMarkLength: 16, // (default 10) extra margin for bottom labels
              },
            }],
          },
          layout: {
            padding: {
              top: 16, // margin for top datalabels
            },
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          elements: {
            line: {
              borderCapStyle: 'round',
            },
            point: {
              radius: 0,
              hitRadius: 0,
              hoverRadius: 0,
            },
          },
        },
      });
      this.chartSkyAir = new Chart('chartSkyAir', {
        type: 'bar',
        data: {},
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              id: 'pct',
              position: 'left',
              display: false,
              ticks: {
                min: 0,
                max: 100,
              },
            }],
            xAxes: [{
              id: 'time',
              gridLines: {
                tickMarkLength: 20, // (default 10) extra margin for bottom labels
              },
            }],
          },
          layout: {
            padding: {
              top: 16, // margin for top datalabels
            },
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          elements: {
            line: {
              borderCapStyle: 'round',
            },
            point: {
              radius: 0,
              hitRadius: 0,
              hoverRadius: 0,
            },
          },
        },
      });
      this.chart10dTemp = new Chart('chart10dTemp', {
        type: 'bar',
        data: {},
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              id: 'temp',
              display: false,
            }],
            xAxes: [{
              id: 'time',
              ticks: {
                display: false,
              },
              gridLines: {
                drawBorder: false,
                drawTicks: false,
                tickMarkLength: 0,
              },
            }],
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          elements: {
            line: {
              borderCapStyle: 'round',
            },
            point: {
              radius: 0,
              hitRadius: 0,
              hoverRadius: 0,
            },
          },
          layout: {
            padding: {
              top: 20, // margin for top datalabels
            },
          },
          plugins: {
            datalabels: {
              display: true,
              color: 'white',
              align: 'end',
              offset: 0,
            },
          },
        },
        plugins: [{
          beforeRender: (chart) => {
            [0, 1].forEach((i) => {
              if (chart.config.data.datasets[i]) {
                const dsMeta = chart.getDatasetMeta(i);
                const dataset = dsMeta.controller.chart.config.data.datasets[i];
                const color = this.chartTemp.ctx.createLinearGradient(0, 0, chart.width, 0);
                dsMeta.data.forEach((el, idx) => {
                  const pt = el.getCenterPoint();
                  color.addColorStop(pt.x / chart.width, this.tempToColor(dataset.data[idx]));
                });
                dataset.borderColor = color;
                dsMeta.controller.update();
              }
            });
          },
        }],
      });
    },
    watch: {
      forecast(forecast) {
        const hours = forecast.hourly_forecast.map(item => `${item.FCTTIME.hour}h`);
        {
          const temps = forecast.hourly_forecast.map(item => parseFloat(item.temp.metric));
          this.chartTemp.data.labels = hours;
          this.chartTemp.data.datasets = [{
            fill: false,
            type: 'line',
            xAxisID: 'time',
            yAxisID: 'temp',
            label: 'Temp',
            data: temps,
          }];
          this.chartTemp.update();
        }
        {
          const qpf = forecast.hourly_forecast.map(item => this.qpfMm(item));
          const pop = forecast.hourly_forecast.map(item => parseInt(item.pop, 10));
          this.chartRain.data.labels = hours;
          this.chartRain.data.datasets = [{
            type: 'line',
            xAxisID: 'time',
            yAxisID: 'pop',
            label: 'Rain chance',
            fill: true,
            data: pop,
            borderColor: 'rgba(255, 255, 255, .4)',
            backgroundColor: 'rgba(0, 0, 0, .0)',
            datalabels: {
              display: true,
              color: 'white',
              align: 'end',
              offset: -2,
              formatter: x => (x === 0 ? '' : `${x}%`),
            },
          }, {
            type: 'bar',
            xAxisID: 'time',
            yAxisID: 'qpf',
            label: 'Quantity (mm)',
            data: qpf,
            backgroundColor: 'hsl(213, 100%, 60%)',
            datalabels: {
              display: true,
              color: 'hsl(213, 100%, 80%)',
              anchor: 'start',
              align: 'start',
              offset: -2,
              formatter: (x) => {
                if (x === 0) return '';
                if (x < 0.1) return '~';
                return x;
              },
            },
          }];
          this.chartRain.update();
        }
        {
          const sky = forecast.hourly_forecast.map(item => parseInt(item.sky, 10));
          const hum = forecast.hourly_forecast.map(item => parseInt(item.humidity, 10));
          this.chartSkyAir.data.labels = hours;
          this.chartSkyAir.data.datasets = [{
            type: 'line',
            xAxisID: 'time',
            yAxisID: 'pct',
            label: 'Humidity',
            fill: true,
            data: hum,
            borderColor: 'hsl(213, 100%, 60%)',
            backgroundColor: 'rgba(0, 0, 0, .0)',
            datalabels: {
              display: true,
              color: 'hsl(213, 100%, 80%)',
              align: 'end',
              offset: -2,
              formatter: x => (x === 0 ? '' : `${x}%`),
            },
          }, {
            type: 'bar',
            xAxisID: 'time',
            yAxisID: 'pct',
            label: 'Cloudiness',
            data: sky,
            backgroundColor: 'rgba(256, 256, 256, .4)',
            datalabels: {
              display: true,
              color: 'white',
              anchor: 'start',
              align: 'start',
              offset: -2,
              formatter: x => (x === 0 ? '' : `${x}%`),
            },
          }];
          this.chartSkyAir.update();
        }
        const days = forecast.forecast.simpleforecast.forecastday
          .map(item => `${item.date.day}/${item.date.month}`);
        {
          const highs = forecast.forecast.simpleforecast.forecastday
            .map(item => parseFloat(item.high.celsius));
          const lows = forecast.forecast.simpleforecast.forecastday
            .map(item => parseFloat(item.low.celsius));
          this.chart10dTemp.data.labels = days;
          this.chart10dTemp.data.datasets = [{
            fill: false,
            type: 'line',
            xAxisID: 'time',
            yAxisID: 'temp',
            label: 'High',
            data: highs,
          }, {
            fill: false,
            type: 'line',
            xAxisID: 'time',
            yAxisID: 'temp',
            label: 'Low',
            data: lows,
          }];
          this.chart10dTemp.update();
        }
      },
    },
    methods: {
      scale(value, zero, one) {
        const min = Math.min(zero, one);
        const max = Math.max(zero, one);
        const clamped = Math.min(max, Math.max(min, value));
        return (clamped - zero) / (one - zero);
      },
      tempToColor(temp) {
        const redHot = 30;
        const blueCold = 5;
        const whiteCold = -10;
        if (temp <= blueCold) {
          return `hsla(240, 100%, ${Math.round(50 + (50 * this.scale(temp, blueCold, whiteCold)))}%, 1)`;
        }
        return `hsla(${Math.round(240 * this.scale(temp, redHot, blueCold))}, 100%, 50%, 1)`;
      },
      windStyle(item) {
        const maxSpeed = 30;
        const scale = item.wspd.metric / maxSpeed;
        const rotateOffset = 90; // depends on the chosen icon
        return {
          transform: [
            `rotate(${parseFloat(item.wdir.degrees) + rotateOffset}deg)`,
            `scale(${scale})`,
          ].join(' '),
        };
      },
      qpfMm(item) {
        const mmPerIn = 25.4;
        const mm = item.qpf.english * mmPerIn; // use the english metric as it is more accurate
        if (mm === 0 && item.pop !== '0') return 0.05;
        return mm;
      },
    },
  };
</script>

<style>
  .weather--chart-container {
    position: relative;
  }
  .weather--chart-temp {
    height: 200px;
  }
  .weather--chart-sky-air {
    height: 150px;
  }
  .weather--chart-rain {
    height: 100px;
  }
  .weather--chart-10d-temp {
    height: 200px;
  }
  .weather--forecast {
    padding: 0 8px 0 14px;
    display: flex;
    flex-direction: row;
  }
  .weather--forecast .weather--forecast-item {
    display: inline-block;
    flex-grow: 1;
  }
  .weather--forecast-item-info-time {
    font-weight: bold;
  }
  .weather--forecast-item-info-time,
  .weather--forecast-item-info-icon,
  .weather--forecast-item-info-wind {
    text-align: center;
  }
  .weather--forecast-item-info-wind {
    vertical-align: middle;
    display: inline-block;
  }
  .weather--forecast-item-info-wind > img {
    width: 100%;
  }
  .weather--forecast-item-info-icon .wu {
    width: 30px;
    height: 30px;
  }
</style>
