<template>
  <v-row class="mt-2">
    <v-col cols="12">
      <v-form lazy-validation>
        <v-row>
          <v-col cols="12" md="2">
            <TextField
              label="Óraszám"
              type="number"
              :value="hourCount"
              @input="hourCount = $event"
              :rules="[checkOnlyNumber]"
              :hint="IS_REQUIRED"
              :disabled="!!(workType && workType.isFullDay)"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="workType"
              :items="workTypes"
              item-text="name"
              item-value="id"
              label="Munka tipus"
              return-object
              outlined
            ></v-select>
          </v-col>

          <v-col cols="12" md="2">
            <TextField
              label="Órabér"
              type="number"
              :value="hourlyPrice"
              @input="hourlyPrice = $event"
              :rules="[checkOnlyNumber]"
              disabled
            />
          </v-col>

          <v-col cols="12" md="2">
            <TextField
              label="összesen"
              type="text"
              :value="fullPriceStr"
              disabled
            />
          </v-col>
        </v-row>

      </v-form>
    </v-col>

    <v-col cols="12">
      <v-btn @click="felvitel">
        Felvitel
      </v-btn>
    </v-col>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="cyan"
    ></v-progress-linear>

    <v-col cols="12">
      <CAlert :alert="alert" @input="alert = false"/>
    </v-col>
  </v-row>
</template>

<script>
import {checkOnlyNumber, checkRequired} from '@/utils/validationRules'
import {IS_OPTIONAL, IS_REQUIRED} from '@/utils/constans'
import {newAlert} from '@/utils/alerts'
import CAlert from "@/components/CAlert";
import {getDataFromSheet, insertDataToSheet} from "@/api/sheetBest";
import moment from 'moment/moment'
import TextField from "@/components/Fields/TextField";

export default {
  name: "workHourForm",
  components: {CAlert,TextField},
  setup(){
    return {
      checkRequired,
      checkOnlyNumber,
      IS_OPTIONAL,
      IS_REQUIRED,
    }
  },
  async beforeMount() {
    this.isLoading = true;
    const res = await getDataFromSheet('workType');
    if(res.status === 200){
      this.workTypes = res.data;
    }
    this.isLoading = false;
    console.log(res);
  },
  data(){
    return {
      hourCount: 0,
      workType: null,
      hourlyPrice: 0,
      fullPrice: 0,

      workHours: [],

      workTypes: [
        /*{id: 0, name: 'Piacozás', hourlyPrice: 5000},
        {id: 1, name: 'Traktorozás', hourlyPrice: 4000},
        {id: 2, name: 'Egyéb', hourlyPrice: 1000},*/
      ],

      isLoading: false,
      alert: false,
    };
  },
  computed: {
    fullPriceStr(){
      console.log('fullPrice',this.fullPrice)
      if(this.fullPrice && checkOnlyNumber(this.fullPrice)){
        return this.fullPrice+' Ft';
      }
    }
  },
  watch: {
    hourCount(){
      this.calc();
    },
    workType(val){
      if(val){
        this.hourlyPrice = val.hourlyPrice;
        if(val.isFullDay){
          this.hourCount = 0;
        }
      }
      this.calc();
    },
    hourlyPrice(){
      this.calc();
    }
  },
  methods: {
    calc(){
      if(this.workType && this.hourlyPrice && (this.workType.isFullDay || this.hourCount)){
        this.fullPrice = this.workType.hourlyPrice*this.hourCount;
      }
    },
    async felvitel(){
      console.log('felvitel')
      if(this.fullPrice || this.workType.isFullDay){
        this.isLoading = true;
        const res = await insertDataToSheet({
          hourCount: this.hourCount,
          workType: this.workType.name,
          hourlyPrice: this.workType.isFullDay ? 0 : this.hourlyPrice,
          fullPrice: this.workType.isFullDay ? this.workType.hourlyPrice : this.fullPrice,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        if(res.status === 200){
          this.alert = newAlert();
        } else {
          console.log(res);
          this.alert = newAlert('warning','Sikertelen felvitel!');
        }
        this.isLoading = false;
      } else {
        this.alert = newAlert('warning','Nem adtál meg minden adatot!');
      }
    },
  },
}
</script>

