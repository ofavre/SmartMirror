<template>
  <div>
    <svg style="display:none;">
      <defs>
        <path id="drop-filled"
          d="M413.289,200.718c-0.016-0.021-0.03-0.041-0.045-0.061C407.69,193.171,277.11,17.178,267.635,5.534
                  c-2.918-3.587-7.379-5.634-11.949-5.53c-4.623,0.097-8.942,2.32-11.708,6.026L100.036,198.936
                  C74.498,232.909,61,273.39,61,316.001c0,108.075,87.477,196,195,196s195-87.925,195-196
                  C451,274.189,437.96,234.324,413.289,200.718z"
        />
        <path
          id="drop-contour"
          d="M413.289,200.718c-0.016-0.021-0.03-0.041-0.045-0.061C407.69,193.171,277.11,17.178,267.635,5.534
                  c-2.918-3.587-7.379-5.634-11.949-5.53c-4.623,0.097-8.942,2.32-11.708,6.026L100.036,198.936
                  C74.498,232.909,61,273.39,61,316.001c0,108.075,87.477,196,195,196s195-87.925,195-196
                  C451,274.189,437.96,234.324,413.289,200.718z
                  M256,482.001c-90.981,0-165-74.467-165-166c0-36.057,11.417-70.304,33.049-99.081
                  l132.08-177.01c27.492,36.534,94.768,127.061,133.009,178.605C409.984,246.929,421,280.637,421,316.001
                  C421,407.534,346.981,482.001,256,482.001z"
        />
      </defs>
    </svg>
    <ul class="weatherForecast" v-if="forecast !== null">
      <li class="weatherForecastItem" v-for="(item, index) in forecast.hourly_forecast" :key="index">
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoTime">
            {{item.FCTTIME.hour}}h
          </div>
        </div>
        <!--div class="weatherForecastItemInfo">{{item.condition}}</div-->
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoIcon">
            <i :class="['wu', 'wu-white', 'wu-64', 'wu-'+item.icon]"></i>
          </div>
        </div>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoWind">
            <img src="/static/winds-symbol.svg" :style="windStyle(item)"/>
          </div>
          {{item.wspd.metric}} <sup>km</sup>/<sub>h</sub>
        </div>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoRain">
            <svg viewBox="0 0 512 512">
              <defs>
                <clipPath :id="`precipitations-${index}-down`">
                  <rect x="0" :y="512 - rainScale(item) * 512" width="512" height="512"/>
                </clipPath>
                <clipPath :id="`precipitations-${index}-up`">
                  <rect x="0" :y="0 - rainScale(item) * 512" width="512" height="512"/>
                </clipPath>
              </defs>
              <use href="#drop-filled"
                   fill="#3390FF"
                   :clip-path="`url(#precipitations-${index}-down)`"
              />
              <use href="#drop-contour"
                   :clip-path="`url(#precipitations-${index}-up)`"
                   fill="#FFFFFF" fill-opacity="1"/>
            </svg>
          </div>
          {{qpfMm(item).toFixed(1)}}<small>mm</small> {{item.pop}}%
        </div>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoTemperature">
            <img src="/static/temperature.svg"/>
            <template v-if="item.temp.metric === item.feelslike.metric">
              {{item.temp.metric}}&deg;C
            </template>
            <template v-else>
              {{item.feelslike.metric}}&deg;C <small>({{item.temp.metric}}&deg;C)</small>
            </template>
          </div>
        </div>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoCloudiness">
            <img src="/static/cloud-filled.svg" :style="{opacity: parseFloat(item.sky)/100.}"/> {{item.sky}}%
          </div>
        </div>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoUV">
            <img src="/static/uv.svg"/> {{uvIndexLabel(item)}}
          </div>
        </div>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoHumidity">
            <img src="/static/humidity.svg"/> {{item.humidity}}%
          </div>
        </div>
        <div class="weatherForecastItemInfo" v-if="item.snow.metric !== '0'">Snow: {{item.snow.metric}} <small>mm</small></div>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoPressure">
            <img src="/static/pressure.svg"/> {{item.mslp.metric}} <small>hPa</small>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import config from '@/config';
  import 'weather-underground-icons/dist/wu-icons-style.min.css';

  const OWMApiKey = config.OWMApiKey;
  const WUApiKey = config.WUApiKey;

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
      };
    },
    asyncComputed: {
      forecast() {
        if (this.latitude === null || this.longitude === null) {
          return null;
        }
        if (Math.random() >= 0) {
          return fetch(`https://api.wunderground.com/api/${WUApiKey}/hourly/lang:${navigator.language.replace(/-.*/, '').toUpperCase()}/q/${this.latitude},${this.longitude}.json`)
            .then(response => response.json());
        } else if (Math.random() >= 0) {
          return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitude}&lon=${this.longitude}&appid=${OWMApiKey}`)
            .then(response => response.json());
        }
        return null;
      },
    },
    mounted() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    },
    methods: {
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
        return item.qpf.english * mmPerIn; // use the english metric as it is more accurate
      },
      rainScale(item) {
        const maxMm = 3;
        return this.qpfMm(item) / maxMm;
      },
      uvIndexLabel(item) {
        const uvi = parseInt(item.uvi, 10);
        if (uvi <= 2) return 'Very Low';
        if (uvi <= 4) return 'Low';
        if (uvi <= 6) return 'Moderate';
        if (uvi <= 9) return 'High';
        return 'Very High';
      },
    },
  };
</script>

<style>
  .weatherForecast .weatherForecastItem {
    width: 8em;
    margin: 1em;
    display: inline-block;
  }
  .weatherForecastItemInfo {
    margin: 0.2em 0;
  }
  .weatherForecastItemInfoTime {
    font-weight: bold;
  }
  .weatherForecastItemInfoTime,
  .weatherForecastItemInfoIcon {
    text-align: center;
  }
  .weatherForecastItemInfoWind {
    vertical-align: middle;
    width: 4em;
    height: 4em;
    display: inline-block;
  }
  .weatherForecastItemInfoWind > img {
    width: 100%;
  }
  .weatherForecastItemInfoCloudiness {
    line-height: 2em;
  }
  .weatherForecastItemInfoCloudiness > img {
    width: 2em;
    vertical-align: bottom;
  }
  .weatherForecastItemInfoTemperature,
  .weatherForecastItemInfoHumidity,
  .weatherForecastItemInfoPressure,
  .weatherForecastItemInfoUV {
    line-height: 1.5em;
  }
  .weatherForecastItemInfoTemperature > img,
  .weatherForecastItemInfoHumidity > img,
  .weatherForecastItemInfoPressure > img,
  .weatherForecastItemInfoUV > img {
    height: 1.5em;
    width: 2em;
    vertical-align: bottom;
  }
  .weatherForecastItemInfoRain {
    vertical-align: middle;
    width: 2em;
    height: 2em;
    display: inline-block;
  }
</style>
