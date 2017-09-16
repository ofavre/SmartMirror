<template>
  <div>
    <ul class="weatherForecast" v-if="forecast !== null">
      <li class="weatherForecastItem" v-for="(item, index) in forecast.hourly_forecast" :key="index">
        <span class="weatherForecastItemInfo"><i :class="['wu', 'wu-white', 'wu-64', 'wu-'+item.icon]"></i></span>
        <span class="weatherForecastItemInfo">{{item.condition}}</span>
        <span class="weatherForecastItemInfo">{{item.FCTTIME.hour}}h</span>
        <span class="weatherForecastItemInfo">{{item.temp.metric}}&deg;C feels like {{item.feelslike.metric}}&deg;C</span>
        <span class="weatherForecastItemInfo">sky {{item.sky}}%</span>
        <div class="weatherForecastItemInfo">
          <div class="weatherForecastItemInfoWind">
            <img src="/static/winds-symbol.svg" :style="windStyle(item)"/>
          </div>
          {{item.wspd.metric}} <sup>km</sup>/<sub>h</sub>
        </div>
        <span class="weatherForecastItemInfo">wx {{item.wx}}</span>
        <span class="weatherForecastItemInfo">UV index {{item.uvi}}</span>
        <span class="weatherForecastItemInfo">humidity {{item.humidity}}%</span>
        <span class="weatherForecastItemInfo">precipitations {{item.qpf.metric}} mm {{item.pop}}%</span>
        <span class="weatherForecastItemInfo">snow {{item.snow.metric}} mm</span>
        <span class="weatherForecastItemInfo">pressure {{item.mslp.metric}} hPa</span>
      </li>
    </ul>
    <div style="white-space: pre">{{JSON.stringify(forecast, null, 8)}}</div>
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
            .then(response => response.json())
            .then((response) => {
              console.log(response);
              return response;
            });
        } else if (Math.random() >= 0) {
          return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitude}&lon=${this.longitude}&appid=${OWMApiKey}`)
            .then(response => response.json())
            .then((response) => {
              console.log(response);
              return response;
            });
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
    },
  };
</script>

<style>
  .weatherForecast .weatherForecastItem {
    display: inline-flex;
    flex-direction: column;
    min-width: 15em;
  }
  .weatherForecastItemInfo {
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
</style>
