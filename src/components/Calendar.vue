<template>
    <div>
      <select v-model="currentYearMonth" aria-label="month selector">
        <option v-for="option in selectOptions"
          :key="option.value"
          :aria-label="option.label"
          :aria-selected="option.value === currentYearMonth"
          :value="option.value">{{ option.label }}</option>
      </select>
      <table
        @mouseleave="rangeStart = null"
        @mouseup="endRange()"
        >
        <thead>
          <tr>
            <th
              v-for="day in daysOfWeek"
              :key="day.index"
              >
              <button
                v-on:click="selectDayOfWeek(day.index)"
                :ariaLabel="`click to select all ${day.short}`">
                {{ day.short }}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in weeks" :key="week.index">
            <td v-for="day in week.days" :key="day.index"
              :class="{today: day.isToday, selected: day.isSelected, inRange: day.isInRange}"
            >
              <button
                v-if="day.date"
                @mouseover="updateRange(day.date, $event)"
                @mousedown="startRange(day.date)"
                :aria-label="day.ariaLabel"
                :aria-selected="day.isSelected"
              >{{ day.dayOfMonth }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

</template>
<style scoped>
.today button{
  font-weight: bold;
}
.selected button{
  color: white;
  background-color:slategray
}
.inRange button {
  color:white;
  background-color: lightslategray;
}
button {
  padding: 0.25em;
  width: 2.5em;
  height:2.5em;
}
</style>
<script>
import 'dayjs/locale/fr'
import * as dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(isToday)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(localeData)
dayjs.extend(localizedFormat)
dayjs.extend(weekday)
dayjs.locale('fr')
const SELECTED_DATE_FORMAT = 'YYYY-MM-DD'
const MONTH_RANGE = 12

export default {
  name: 'Calendar',
  data () {
    return {
      lastError: null,
      selected: [],
      rangeStart: null,
      rangeEnd: null,
      rangeGrowingFromEnd: true,
      currentYearMonth: '2020-7'
    }
  },
  computed: {
    selectOptions () {
      const current = dayjs(this.currentYearMonth, 'YYYY-M')
      if (!current.isValid()) {
        console.error('invalid date', this.currentYearMonth)
        return
      }
      const options = []
      for (let i = -MONTH_RANGE; i < MONTH_RANGE; i++) {
        const date = current.add(i, 'month')
        options.push({
          date,
          value: date.format('YYYY-M'),
          label: date.format('MMMM YYYY')
        })
      }
      return options
    },
    daysOfWeek () {
      const days = []
      // align starting day with the locale usage
      dayjs.localeData().weekdaysShort().forEach((day, index) => {
        const localeIndex = (index + 7 - dayjs.localeData().firstDayOfWeek()) % 7
        days[localeIndex] = { short: day, index: localeIndex }
      })
      return days
    },
    weeks () {
      const monthStart = dayjs(this.currentYearMonth, 'YYYY-MM')
      if (!monthStart.isValid()) {
        return null
      }
      const monthDuration = monthStart.daysInMonth()
      const weeks = []
      let days = []
      for (let d = 0; d < monthStart.weekday(); d++) {
        // precedent month
        days.push({
          index: monthStart.add(d - monthStart.weekday(), 'd').format(SELECTED_DATE_FORMAT)
        })
      }
      // magic caching/computed doesn't seems to like optional chaining
      const isRanging = this.rangeStart && this.rangeEnd
      for (let d = 0; d < monthDuration; d++) {
        const date = monthStart.add(d, 'd')
        const isSelected = this.isAlreadySelected(date)
        days.push({
          index: date.format(SELECTED_DATE_FORMAT),
          dayOfMonth: date.date(),
          date,
          isToday: date.isToday(),
          isSelected,
          isInRange: isRanging && this.rangeStart.isSameOrBefore(date) && this.rangeEnd.isSameOrAfter(date),
          ariaLabel: `${date.format('LL')} click to ${isSelected ? 'deselect' : 'select'}`
        })
        if (days.length === 7) {
          weeks.push({ index: weeks.length, days })
          days = []
        }
      }
      weeks.push({ index: weeks.length, days })
      return weeks
    }
  },
  methods: {
    isAlreadySelected (date) {
      return this.selected.findIndex(d => d === date.format(SELECTED_DATE_FORMAT)) >= 0
    },
    select (date) {
      if (!this.isAlreadySelected(date)) {
        this.$set(this.selected, this.selected.length, date.format(SELECTED_DATE_FORMAT))
      }
    },
    deselect (date) {
      const index = this.selected.findIndex(d => d === date.format(SELECTED_DATE_FORMAT))
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    },
    selectDayOfWeek (dayNumber) {
      const firstDayOfMonth = dayjs(this.currentYearMonth, 'YYYY-MM')
      if (!firstDayOfMonth.isValid()) {
        return
      }
      const firstSelectedDay = (dayNumber - firstDayOfMonth.weekday() + 7) % 7
      let allWereSelected = true
      for (let d = firstSelectedDay; d <= firstDayOfMonth.daysInMonth(); d += 7) {
        allWereSelected = allWereSelected && this.isAlreadySelected(firstDayOfMonth.add(d, 'd'))
      }
      for (let d = firstSelectedDay; d <= firstDayOfMonth.daysInMonth(); d += 7) {
        allWereSelected ? this.deselect(firstDayOfMonth.add(d, 'd')) : this.select(firstDayOfMonth.add(d, 'd'))
      }
      this.rangeStart = null
    },
    startRange (date) {
      this.rangeStart = date
      this.rangeEnd = date
      this.rangeGrowingFromEnd = true
    },
    updateRange (date, event) {
      if (!this.rangeStart) {
        return
      }
      this.rangeGrowingFromEnd = date.isAfter(this.rangeStart)
      if (this.rangeGrowingFromEnd) {
        this.rangeEnd = date
      } else {
        this.rangeStart = date
      }
    },
    endRange (date) {
      if (!this.rangeStart) {
        return
      }
      let d = this.rangeStart
      let allWereSelected = true
      while (d.isSameOrBefore(this.rangeEnd)) {
        allWereSelected = allWereSelected && this.isAlreadySelected(d)
        d = d.add(1, 'd')
      }
      d = this.rangeStart
      while (d.isSameOrBefore(this.rangeEnd)) {
        allWereSelected ? this.deselect(d) : this.select(d)
        d = d.add(1, 'd')
      }
      this.rangeStart = null
      this.rangeEnd = null
    }
  }
}
</script>
