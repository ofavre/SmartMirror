import localConfig from './config.local';

const config = {
  OWMApiKey: undefined, // https://openweathermap.org/price
  WUApiKey: undefined, // https://www.wunderground.com/weather/api/d/pricing.html
  rainMaxMm: 3.0,
};

export default {
  ...config,
  ...localConfig,
};
