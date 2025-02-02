window.addEventListener("DOMContentLoaded", ()=> {
    const App = {
        data() {
            return {
                isSalesman : false,
            }
        },
        template: `
            <div class="navbar">
                <h1 @click="mainpage" id="mainpage">AllTime</h1>
                <div>
                    <span class="user-name" id="user-name">{{ firstname || "Гость" }}</span>
                    <span class="user-role" id="user-role">{{ role || "Customer" }}</span>
                    <button class="nav-button button" @click="orders">Заказы</button>
                    <button id="addToCartButton" class="nav-button button">Корзина</button>
                    <button class="nav-button" v-if="isSalesman" @click="formOrders">Оформления</button>
                    <button class="nav-button" id="auth-button" @click="authClick">Авторизация</button>
                    <button class="nav-button hidden" id="logout-button" @click="logout">Выход</button>
                </div>
            </div>
            <!-- ПОКУПКА -->
            <div id="purchaseModal" class="modal" style="display:none;">
                <h2>Оформление покупки</h2>
                <div id="productList"></div> <!-- Список товаров и селектов -->
                <h3 id="product-fullprice">Итого: <span></span></h3>
                <h3>Адрес доставки</h3>
                <div>
                    <label>Страна:</label><input type="text" id="countryCode">
                    <label>Область:</label><input type="text" id="state">
                    <label>Город:</label><input type="text" id="city">
                    <label>Улица:</label><input type="text" id="street">
                    <label>Дом:</label><input type="text" id="building">
                    <label>Квартира:</label><input type="text" id="apartment">
                    <label>Почтовый индекс:</label><input type="text" id="zipCode">
                </div>
                <div>
                    <label>Комментарий:</label><textarea id="comment"></textarea>
                </div>
                <button id="submitPurchase">Оформить покупку</button>
                <button id="closeModal">Закрыть</button>
            </div>
            <!-- ПОКУПКА -->
        `,
        mounted() {
            this.loadScript('/staticfront/vue/static-templates/loadProducts.js')
            .then(() => {
                const mainstyle = document.createElement('link');
                mainstyle.rel = 'stylesheet';
                mainstyle.href = '/staticfront/css/order-style.css';
                document.head.appendChild(mainstyle);
                this.resources.push({
                    name: 'order-style',
                    src: mainstyle.href
                });
            });
            this.checkRole();
            //document.querySelector("#logout-button").classList.remove("hidden")
            //document.querySelector("#auth-button").classList.add("hidden")
            //document.querySelector(".user-name").innerText = `${(this.getCookie("firstname") || "Гость")}  ${(this.getCookie("lastname") || "")}`;
            //document.querySelector(".user-role").innerText = (this.getCookie("role") || "Customer");
        },
        methods: {
            loadScript(src) {
                return new Promise((resolve) => {
                    
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = () => {
                        try{
                            this.resources.push({ name: src.split('/').pop(), src });
                            resolve();
                        } catch(err){console.log(`cant load: ${src}`)}
                    };
                    document.head.appendChild(script);
                    
                });
            },
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
            basket() {
                //$("#purchaseModal").fadeIn();
            }
        }
    };
    Vue.createApp(App).mount('#navbar');
})