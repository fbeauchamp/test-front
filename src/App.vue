<template>
  <div id="app">
    <h1>Demo of calendar component</h1>
    <Calendar v-on:selectionChanged="selectionChanged"/>
    <ul>
      <li v-for="date in selection" :key="date">
        {{ date }}
      </li>
    </ul>
  </div>
</template>

<script>
import Calendar from './components/Calendar.vue'

export default {
  name: 'App',
  components: {
    Calendar
  },
  data () {
    return {
      selection: []
    }
  },
  methods: {
    selectionChanged (dates) {
      this.selection = dates
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
