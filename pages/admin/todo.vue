<template>
  <!-- <div id="app">
        <v-app> -->
  <!-- <v-main> -->
  <!-- <v-theme-provider root :dark="isDark"> -->
  <v-container>
    <!-- <v-row justify="center" class="ma-5"> -->
    <v-row justify="center">
      <v-col xs="12" sm="8">
        <v-card>
          <v-toolbar color="darken-4" dark>
            <v-toolbar-title class="headline">Feladatlista</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon @click="showSearch = !showSearch">mdi-magnify</v-icon>
            </v-btn>
            <v-tooltip bottom>
              <span>
                {{ isDark ? "light mode" : "dark mode" }}
              </span>
            </v-tooltip>
          </v-toolbar>
          <v-list-item v-if="showSearch">
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field
                  v-model="search"
                  label="Keresés"
                  color="#359756"
                ></v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list two-line subheader>
            <v-subheader class="headline"> {{ date }}</v-subheader>
            <p class="mx-12 text-right">
              <b>{{ todos.length }}</b> Feladat
            </p>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-text-field
                    v-model="newTodo"
                    id="newTodo"
                    name="newTodo"
                    label="Kezd el beírni a feladat nevét"
                    @keyup.enter="addTodo"
                    :hint="todoExists"
                    persistent-hint
                    color="#00000099"
                  />
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list subheader two-line flat>
            <v-subheader class="subheading" v-if="todos.length == 0"
              >Egyelőre nincsen feladat</v-subheader
            >
            <v-subheader class="subheading" v-else
              >Aktuális feladatok</v-subheader
            >
            <v-list-item-group>
              <v-list-item v-for="(todo, i) in filteredItems" :key="i">
                <template #default="{ active }">
                  <v-list-item-action>
                    <v-checkbox  color="#359756"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ todo.title }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Hozzáadva: {{ todo.createdAt }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-btn
                    fab
                    ripple
                    small
                    color="#359756"
                    v-if="active"
                    @click="removeTodo(i)"
                  >
                    <v-icon class="white--text">mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list-item-group>
            <!-- Elvégzett feladatok -->
            <v-divider></v-divider>
            <v-subheader class="subheading" v-if="doneTodos.length == 0"
              >Egyelőre nincsen elvégzett feladat</v-subheader
            >
            <v-subheader class="subheading"
              >Elvégzett feladatok</v-subheader
            >
            <v-list-item-group>
              <v-list-item
                v-for="(todo, i) in filteredDoneItems"
                :key="i"
                v-if="todo.done"
                :disabled="true"
              >
                <template #default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title class="done">{{
                      todo.title
                    }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Hozzáadva: {{ todo.createdAt }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- </v-theme-provider> -->
  <!-- </v-main> -->
  <!-- </v-app>
    </div> -->
</template>

<script>
import { APIGET, APIPOST, APIUPLOAD } from "~/api/apiHelper";

export default {
  name: "admin-todo",
  async fetch() {
    // Itt végezheted az adatlekérdezést
    try {
      const response = await APIGET("getTodo");
      var error = "";
      if (!response.data.error) {
        response.data.forEach((item, index) => {
          this.todos.push({
            ...this.todos[index],
            id: item.id,
            title: item.title,
            createdAt: item.created_at,
            createdBy: item.created_by,
          });
        });
      } else {
        error += response.data.error;

        this.checkError(error, {
          show: true,
          title: "Hiba",
          message: "Hiba történt az adatok lekérése közben: " + error,
          options: [],
          type: {
            action: "error",
          },
        });
      }
    } catch (error) {
      error += error.message;
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: "Hiba történt az adatok lekérése közben: " + error,
        options: [],
        type: {
          action: "error",
        },
      });
    }
    // Az itt visszaadott adatokat elmentjük a komponens adattagjában
    //this.responseData = data;
  },
  data() {
    return {
      showSearch: false,
      search: "",
      isDark: false,
      show: true,
      newTodo: "",
      todos: [],
      doneTodos: [],
      day: this.todoDay(),
      //date: new Date().getDate(),
      date: new Date().toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
      isTodoExist: false,
    };
  },
  computed: {
    todoExists() {
      return this.isTodoExist ? "már van ilyen feladat a listában" : "";
    },
    filteredItems() {
      if (this.search === "") {
        return this.todos;
      } else {
        return this.todos.filter((todo) => {
          return todo.title.toLowerCase().includes(this.search.toLowerCase());
        });
      }
    },
    filteredDoneItems() {
      if (this.search === "") {
        return this.doneTodos;
      } else {
        return this.doneTodos.filter((todo) => {
          return todo.title.toLowerCase().includes(this.search.toLowerCase());
        });
      }
    },
  },

  methods: {
    async addTodo() {
      this.isTodoExist = false;
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      const isTodoExists = this.todos.find((todo) => todo.title === value);
      if (!isTodoExists) {
        this.todos.push({
          title: this.newTodo,
          done: false,
        });

        const dataFromLocalStorage = localStorage.getItem("apiLogin");
        const parsedData = JSON.parse(dataFromLocalStorage);
        //TODO adat eltárolása adatbázisban API hívással
        const response = await APIPOST("addTodo", {
          userId: parsedData.userId,
          newTodo: this.newTodo,
        });
        this.newTodo = "";
      }
      if (isTodoExists) {
        this.isTodoExist = true;
      }
    },

    removeTodo(index) {
      this.doneTodos.push({
        title: this.todos[index].title,
        createdAt: this.todos[index].createdAt,
        done: true,
      });
      // TODO API hívás a státusz módosításához

      this.todos.splice(index, 1);
    },

    todoDay() {
      const d = new Date();
      const days = [
        "Vasárnap",
        "Hétfő",
        "Kedd",
        "Szerda",
        "Csütörtök",
        "Péntek",
        "Szombat",
      ];
      return days[d.getDay()];
    },
  },
};
</script>

<style scoped>
.done {
  text-decoration: line-through;
  font-style: italic;
}

header {
  background-color: #359756 !important;
}

.v-list-item__title >>> .v-input--is-focused {
  color: #359756 !important;
}

.v-list-item__content >>> .v-list-item__title:focus {
  color: #359756 !important;
}

/* @media (min-width: 390px) {
    .container {
        min-width: 350px !important;
        padding: 0px !important;
    }

    .container .row.ma-5 {
        margin: 0px !important;
    }
} */
</style>