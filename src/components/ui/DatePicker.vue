<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="formattedDate"
          persistent-hint
          :label="label"
          v-on="on"
          prepend-icon="event"
          :rules="rules"
          readonly
        ></v-text-field>
      </template>

      <v-date-picker
        :value="value"
        @change="onDateChange"
        color="primary"
        no-title
        first-day-of-week="1"
        :min="min"
        :max="max"
        locale="ru"
        @input="menu = false"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import { format, parseISO } from 'date-fns'

export default {
  props: {
    value: { required: false },
    label: { required: false },
    max: { required: false },
    min: { required: false },
    rules: { required: false }
  },
  data() {
    return {
      menu: false,
      format: 'DD.MM.YYYY'
    }
  },
  computed: {
    formattedDate() {
      return this.value ? format(parseISO(this.value), 'dd.MM.yyyy') : '';
    },
  },
  methods: {
    onDateChange(value) {
      this.$emit('input', value);
    },
  }

}
</script>

<style>
</style>