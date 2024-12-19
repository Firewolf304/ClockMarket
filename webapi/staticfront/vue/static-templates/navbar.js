window.addEventListener("DOMContentLoaded", ()=> {
    const App = {
        template: `
            <div class="navbar">
                <h1 @click="mainpage" id="mainpage">DNAAS</h1>
                <div>
                    <span class="user-name" id="user-name"></span>
                    <span class="user-role" id="user-role"></span>
                    <button class="nav-button button" @click="orders">Заказы</button>
                    <button class="nav-button button" @click="profile">Профиль</button>
                    <button class="nav-button" id="auth-button" @click="authClick">Авторизация</button>
                    <button class="nav-button hidden" id="logout-button" @click="logout">Выход</button>
                </div>
            </div>
        `,
        mounted() {
            /*const getCookie = (name) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) {
                    return parts.pop().split(';').shift();
                }
                return null;
            };
            (this.firstname = decodeURIComponent(getCookie("firstname"))) == 'null' ? this.firstname = "Гость" : "";
            (this.lastname = decodeURIComponent(getCookie("lastname"))) == 'null' ? this.lastname = "" : "";
            (this.role = decodeURIComponent(getCookie("role"))) == 'null' ? this.role = "Customer" : ""  ;*/

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
            profile() {
                window.location.href = '/profile';
            },
            orders() {
                window.location.href = '/orders';
            },
            mainpage() {
                window.location.href = '/';
            }
        }
    };
    Vue.createApp(App).mount('#navbar');
})