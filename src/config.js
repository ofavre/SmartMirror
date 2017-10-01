import localConfig from './config.local';

const config = {
  WUApiKey: undefined, // https://www.wunderground.com/weather/api/d/pricing.html
  rainMaxMm: 3.0,
  MercuryApiKey: undefined, // https://mercury.postlight.com/web-parser/
};

export default {
  ...config,
  ...localConfig,
};
