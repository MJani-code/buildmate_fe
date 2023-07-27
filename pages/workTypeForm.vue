<template>
  <v-row class="mt-2">
    <v-col cols="12">
      <v-form lazy-validation>
        <v-row>
          <v-col cols="12" md="2">
            <TextField
              label="Név"
              type="text"
              :value="workTypeName"
              @input="workTypeName = $event"
              :rules="[checkRequired]"
              :hint="IS_REQUIRED"
            />
          </v-col>

          <v-col cols="12" md="2">
            <TextField
              label="Órabér"
              type="number"
              :value="workTypePrice"
              @input="workTypePrice = $event"
              :rules="[checkRequired,checkOnlyNumber]"
              :hint="IS_REQUIRED"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-switch
              v-model="isFullDay"
              :label="`Teljes nap: ${isFullDay ? 'Igen' : 'Nem'}`"
              color="success"
              :value="1"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <v-col cols="12">
      <v-btn @click="addNew">
        Felvitel
      </v-btn>
    </v-col>

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
import {insertDataToSheet} from "@/api/sheetBest";
import TextField from "@/components/Fields/TextField";

export default {
  name: "workTypeForm",
  components: {CAlert,TextField},
  setup(){
    return {
      checkRequired,
      checkOnlyNumber,
      IS_OPTIONAL,
      IS_REQUIRED,
    }
  },
  data(){
    return {
      workTypeName: '',
      workTypePrice: 0,
      isFullDay: 0,

      workTypes: [],

      alert: false,
      isLoading: false,
    };
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    async addNew(){
      if(this.workTypeName && this.workTypePrice > 0){
        const res = await insertDataToSheet({
          hourlyPrice: this.workTypePrice,
          name: this.workTypeName,
          isFullDay: this.isFullDay ? 1 : 0,
        },'workType');
        if(res.status === 200){
          this.alert = newAlert();
        } else {
          console.log(res);
          this.alert = newAlert('warning','Sikertelen felvitel!');
        }
      } else {
        this.alert = newAlert('warning','Nem adtál meg minden adatot!');
      }
    },
  },
}
</script>

