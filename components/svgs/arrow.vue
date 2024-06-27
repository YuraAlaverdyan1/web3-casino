<template>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="arrow-right">
      <path
        id="Vector"
        d="M8.33334 13.3333L11.6667 9.99998L8.33334 6.66665"
        :stroke="svgColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<script>
export default {
    name: 'Arrow',
    props: ['svgColor']
}
</script>
