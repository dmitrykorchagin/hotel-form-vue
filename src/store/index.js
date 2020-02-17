import Vue from 'vue';
import Vuex from 'vuex';
import dateP from '../helpers';

import { isWithinInterval } from 'date-fns';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    seasons: {},
    tariffs: ['econom', 'standart', 'lux'],
    date: '2020-05-15',
    date2: '2020-05-16'
  },
  getters: {
    getPriceAdult: state => (person, season, tariff) => {
      const cost = state.seasons[season][tariff];
      return cost * person;
    },
    getPriceChild: state => (person, season, tariff) => {
      const cost = state.seasons[season][tariff];
      return (
        person *
        (cost - cost * (state.seasons[season].child_descount_perc / 100))
      );
    },
    getSeason: state => date => {
      if (
        isWithinInterval(new Date(date), {
          start: new Date(dateP(state.seasons.low.date_from)),
          end: new Date(dateP(state.seasons.low.date_to))
        })
      ) {
        return 'low';
      }
      if (
        isWithinInterval(new Date(date), {
          start: new Date(dateP(state.seasons.high.date_from)),
          end: new Date(dateP(state.seasons.high.date_to))
        })
      ) {
        return 'high';
      }

      if (
        isWithinInterval(new Date(date), {
          start: new Date(dateP(state.seasons.low2.date_from)),
          end: new Date(dateP(state.seasons.low2.date_to))
        })
      ) {
        return 'low2';
      }
    }
  },
  mutations: {
    setForm(state, payload) {
      state.seasons = payload;
    }
  }
});
