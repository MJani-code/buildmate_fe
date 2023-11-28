<template>
  <v-container>
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
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
                    <v-checkbox v-model="active" color="#359756"></v-checkbox>
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
                    @click="removeTodo(todo, i)"
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
            <v-subheader class="subheading">Elvégzett feladatok</v-subheader>
            <v-list-item-group>
              <v-list-item
                v-for="(todo, i) in filteredDoneItems"
                :key="i"
                :disabled="true"
              >
                <template>
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
</template>

<script>
import { APIGET, APIPOST, APIPOST2,APIUPLOAD } from "~/api/apiHelper";

export default {
  name: "admin-todo",
  data() {
    return {
      showSearch: false,
      search: "",
      isDark: false,
      show: true,
      newTodo: "",
      showAlert: false,
      alertMessage: "",
      alertType: "",
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
      userData: null
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
  created() {
    this.getTodo();
  },

  methods: {
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
    async getTodo() {
      const dataFromLocalStorage = localStorage.getItem("apiLogin");
      const parsedData = JSON.parse(dataFromLocalStorage);

      this.userData = parsedData;
      try {
        const response = await APIPOST("getTodo", this.userData);
        var error = "";
        if (!response.data.error) {
          this.todos = [];
          response.data.forEach((item, index) => {
            if (item.status == 1) {
              this.todos.push({
                ...this.todos[index],
                id: item.id,
                title: item.title,
                createdAt: item.createdAt,
                createdBy: item.createdBy,
              });
            } else {
              this.doneTodos.push({
                ...this.doneTodos[index],
                id: item.id,
                title: item.title,
                createdAt: item.createdAt,
                done: true,
              });
            }
          });
        } else {
          error = response.data.error;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    async addTodo() {
      this.isTodoExist = false;
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      const isTodoExists = this.todos.find((todo) => todo.title === value);
      if (!isTodoExists) {
        const formattedDate = new Date().toLocaleString("hu-HU", {
          hour12: false,
        });

        this.todos.push({
          title: this.newTodo,
          createdAt: formattedDate,
          done: false,
        });
        const dataFromLocalStorage = localStorage.getItem("apiLogin");
        const parsedData = JSON.parse(dataFromLocalStorage);
        //TODO adat eltárolása adatbázisban API hívással
        const response = await APIPOST2("addTodo", {
          userId: parsedData.userId,
          newTodo: this.newTodo,
          token: this.userData.token
        });
        if (response) {
          this.newTodo = "";
        }
      }
      if (isTodoExists) {
        this.isTodoExist = true;
      }
    },
    async removeTodo(todo, index) {
      try {
        const response = await APIPOST("updateTodo", { id: todo.id });
        if (response.data.confirmUpdateTodoData == true) {
          this.doneTodos.push({
            title: this.todos[index].title,
            createdAt: this.todos[index].createdAt,
            done: true,
          });
          this.todos.splice(index, 1);
          this.showServerResponse();
        } else {
          const error = response.data.error;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    showServerResponse() {
      this.uploadDialog = false;
      //If succes
      this.alertMessage = "A művelet sikeres volt!";
      this.alertType = "success";
      this.showAlert = true;
      if ((this.showAlert = true)) {
        setTimeout(() => {
          this.showAlert = false; // Az értesítés elrejtése
        }, 3000);
      }
    },
    showServerError(error) {
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: `Hiba történt az adatok lekérése közben: ${error}`,
        options: [],
        type: {
          action: "error",
        },
      });
    },
    showCatchError(error) {
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: `Hiba történt az adatok lekérése közben: ${error.code} - ${error.name} - ${error.message}`,
        options: [],
        type: {
          action: "error",
        },
      });
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