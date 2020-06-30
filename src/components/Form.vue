<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="evalation-8">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>HOTEL</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form">
                <div class="title">Выберите количество гостей</div>
                <v-text-field
                  v-model="adultsVal"
                  label="Количество гостей от 12 лет"
                  prepend-icon="accessibility"
                  :rules="[max3]"
                  type="number"
                />
                <v-checkbox
                  label="Дети 5-12 лет"
                  v-model="children"
                  hide-details
                />
                <v-text-field
                  v-if="children"
                  v-model="childrenVal"
                  label="Количество гостей от 5 и до 12 лет"
                  prepend-icon="accessibility"
                  @input="$refs.form.validate()"
                  type="number"
                  hide-details
                />
                <v-checkbox label="Дети до 5 лет" v-model="baby" hide-details />
                <v-text-field
                  v-if="baby"
                  v-model="babyVal"
                  label="Количество гостей до 5 лет"
                  prepend-icon="accessibility"
                  @input="$refs.form.validate()"
                  type="number"
                  hide-details
                />
                <div class="title mt-4">Выберите тип размещения</div>
                <v-select
                  :items="tariffs"
                  label="Тип номера"
                  v-model="tariff"
                  :rules="[required]"
                />
                <div class="title mt-4">Выберите даты размещения</div>
                <div class="d-flex">
                  <DatePicker
                    label="Дата заезда"
                    v-model="date"
                    min="2020-05-15"
                    max="2020-09-15"
                  ></DatePicker>
                  <DatePicker
                    label="Дата выезда"
                    v-model="date2"
                    :min="minDate"
                    max="2020-09-15"
                  ></DatePicker>
                </div>
                <div v-if="tariff">
                  <v-text-field
                    v-model="fullName"
                    label="ФИО"
                    prepend-icon="accessibility"
                    type="text"
                    :rules="[required]"
                  />
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    prepend-icon="email"
                    type="email"
                    :rules="[required, emailValid]"
                  />
                  <v-text-field
                    v-model="phone"
                    label="Телефон"
                    placeholder="(999)-123-45-67"
                    prepend-icon="phone"
                    v-mask="maska"
                    prefix="+7"
                    :rules="[required]"
                  />
                </div>
              </v-form>
              <div class="title" v-if="tariff">{{ price() }}</div>

              <v-btn color="primary" class="mt-3" @click="pay">Оплатить</v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import DatePicker from './ui/DatePicker.vue';
  import { mapMutations, mapGetters, mapState } from 'vuex';

  import { mask } from 'vue-the-mask';
  import axios from 'axios';
  import { format, parseISO } from 'date-fns';
  import { ru } from 'date-fns/locale';

  export default {
    name: 'HelloWorld',
    directives: { mask },
    components: { DatePicker },
    data() {
      return {
        children: false,
        childrenVal: 0,
        adults: true,
        adultsVal: 1,
        baby: false,
        babyVal: 0,
        tariff: '',
        fullName: '',
        email: '',
        phone: '',
        maska: '(###)-###-##-##',
        priceDay: null,
        minDate: '2020-05-16',
        max3: (v) =>
          Number(
            (
              Number(v) /
              (Number(this.babyVal) + Number(this.childrenVal))
            ).toFixed(2)
          ) >= 0.33 || 'На одного взрослого не более 3 детей от 0-12 лет',
        required: (v) => !!v || 'Обязательное поле',
        emailValid: (v) => /.+@.+\..+/.test(v) || 'E-mail не валидный',
      };
    },
    computed: {
      ...mapGetters(['getPriceAdult', 'getPriceChild', 'getSeason']),
      ...mapState(['tariffs', 'date', 'date2']),
    },
    watch: {
      children(v) {
        if (v === false) {
          this.childrenVal = 0;
        } else {
          this.childrenVal = 1;
        }
      },
      date() {
        const tr = [5, 7, 8];
        let day = new Date(this.date).getDate() + 1;
        let month = new Date(this.date).getMonth() + 1;

        if (tr.indexOf(month) !== -1 && day === 32) {
          day = '01';
          month++;
        }

        this.minDate = `2020-0${month}-${day}`;

        if (+new Date(this.date) >= +new Date(this.date2))
          this.date2 = this.minDate;
      },
    },
    methods: {
      ...mapMutations(['setForm']),
      parseDate(date) {
        if (!date) return;

        const [day, month, year] = date.split('.');
        return date ? `${year}-${month}-${day}` : '';
      },
      priceOneDay() {
        console.log(this.date, this.tariff, '----');
        console.log(this.tariff, '02');

        const adultPrice = this.getPriceAdult(
          this.adultsVal,
          this.getSeason(this.date),
          this.tariff
        );
        const childPrice = this.getPriceChild(
          this.childrenVal,
          this.getSeason(this.date),
          this.tariff
        );

        return (this.priceDay = adultPrice + childPrice);
      },
      price() {
        const timeDiff = Math.abs(+new Date(this.date2) - +new Date(this.date));
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const d1 = format(parseISO(this.date), 'dd MMMM', { locale: ru });
        const d2 = format(parseISO(this.date2), 'dd MMMM', { locale: ru });

        return `Стоимость отдыха с ${d1} по ${d2} ${this.priceOneDay() *
          days} руб.`;
      },
      pay() {
        if (!this.$refs.form.validate()) {
          return;
        }

        axios
          .post('https://example.com', {
            adult: this.adultsVal,
            children: this.childrenVal,
            baby: this.babyVal,
            tariff: this.tariff,
            dateFrom: this.date,
            dateTo: this.date2,
            price: this.price(),
          })
          .then((r) => console.log(r, 'response'))
          .catch((e) => console.log(e));
      },
    },
    mounted() {
      axios.get('data.json').then((res) => {
        this.response = res.data;
        this.setForm(res.data);
      });
    },
  };
</script>
