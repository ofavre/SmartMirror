<template>
  <div>Fake data</div>
</template>

<script>
  export default {
    name: 'weather',
    props: {
      places: {
        type: Array,
        required: true,
      },
    },
  };
</script>
