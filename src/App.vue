<template>
  <div id="app">
    <h1>Demo of calendar component</h1>
    <div style="display: flex; flex-direction: row;">
      <div style="flex:1;">
        <h2>Langue</h2>
        <select v-model="language" id="language" style="
  width: 19.8em;
  height: 2em;
  border-radius: 0.25em;
  margin: 1em 0;">
          <option value="fr">Français</option>
          <option value="fr-ca">Français Canadien</option>
          <option value="en">English</option>
          <option value="zh-cn">中文</option>

        </select>
        <h2>Date(s) sélectionnée(s)</h2>

        <ul v-if="selection.length > 0">
          <li v-for="date in selection" :key="date">
            {{ date }}
          </li>
        </ul>
        <span v-else>Aucune</span>
      </div>
      <Calendar v-on:selectionChanged="selectionChanged" :language="language"/>
    </div>

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
      selection: [],
      language: 'en'
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
