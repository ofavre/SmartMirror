<template>
  <div>
    <span ref="date" class="clock--date"></span>
    <span ref="time" class="clock--time"></span>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'clock',
    data: {
      intervalId: null,
    },
    mounted() {
      this.intervalId = setInterval(() => {
        this.$refs.date.innerText = moment().format('L');
        this.$refs.time.innerText = moment().format('LTS');
      }, 1000);
    },
    destroyed() {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
    },
  };
</script>

<style>
  .clock--time {
    font-weight: bold;
  }
</style>
