window.addEventListener("DOMContentLoaded", ()=> {
    const App = {
        data() {
            return {
                isSalesman : false,
            }
        },
        template: `
            <div class="navbar">
                <h1 @click="mainpage" id="mainpage">Сетевое оборудование</h1>
                <div>
                    <span class="user-name" id="user-name">{{ firstname || "Гость" }}</span>
                    <span class="user-role" id="user-role">{{ role || "Customer" }}</span>
                    <button class="nav-button button" @click="orders">Заказы</button>
                    <button class="nav-button button" @click="profile">Профиль</button>
                    <button class="nav-button" v-if="isSalesman" @click="formOrders">Оформления</button>
                    <button class="nav-button" id="auth-button" @click="authClick">Авторизация</button>
                    <button class="nav-button hidden" id="logout-button" @click="logout">Выход</button>
                </div>
            </div>
        `,
        mounted() {
            this.checkRole();
            //document.querySelector("#logout-button").classList.remove("hidden")
            //document.querySelector("#auth-button").classList.add("hidden")
            //document.querySelector(".user-name").innerText = `${(this.getCookie("firstname") || "Гость")}  ${(this.getCookie("lastname") || "")}`;
            //document.querySelector(".user-role").innerText = (this.getCookie("role") || "Customer");
        },
        methods: {
            authClick() {
                window.location.href = '/login';
            },
            logout() {
                let id = $.cookie("id");
                let token = $.cookie("token");
                
                fetch(`/User/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                      }
                })
                $.cookie('username', undefined, { path: '/',  expires: -1 }) ;
                $.cookie('firstname', undefined, { path: '/',  expires: -1 }) ;
                $.cookie('lastname', undefined, { path: '/',  expires: -1 }) ;
                $.cookie('phoneNumber', undefined, { path: '/',  expires: -1 }) ;
                $.cookie('role', undefined, { path: '/',  expires: -1 }) ;
                $.cookie('token', undefined, { path: '/',  expires: -1 }) ;
                $.cookie('id', undefined, { path: '/',  expires: -1 }) ;
                window.location.href = '/';
            },
            getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length >= 2) {
                    return parts.pop().split(';').shift();
                }
                return null;
            },
            checkRole() {
                const role = this.getCookie("role");
                this.isSalesman = role === "Salesman";
            },
            profile() {
                window.location.href = '/profile';
            },
            orders() {
                window.location.href = '/orders';
            },
            mainpage() {
                window.location.href = '/';
            },
            formOrders() {
                window.location.href = '/allorders';
            },
        }
    };
    Vue.createApp(App).mount('#navbar');
})