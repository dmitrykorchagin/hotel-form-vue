/* eslint-disable */
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Form from '../../src/components/Form.vue';
import store from '../../src/store/index.js';
import Vuetify from 'vuetify';
const localVue = createLocalVue();
localVue.use(Vuex);

describe('Form.vue', () => {
  // let store;
  let vuetify;

  beforeEach(() => {
    // store = new Vuex.Store({
    //   state: {},
    // });
    vuetify = new Vuetify();
  });

  const wrapper = shallowMount(Form, {
    localVue,
    store,
    vuetify,
  });

  test('является экземпляром Vue', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('has a form', () => {
    expect(wrapper.contains('v-form')).toBe(true);
  });

  test('has a button', () => {
    expect(wrapper.contains('v-btn')).toBe(true);
  });

  test('Проверка тарифов', () => {
    const result = ['econom', 'standart', 'lux'];

    expect(store.state.tariffs).toEqual(result);
  });
});
