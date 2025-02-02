window.addEventListener("DOMContentLoaded", ()=> {
    const App = {
        data() {
            return { 
                resources: []
            }
        },
        mounted() {
            const loadScript = (src) => {
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = () => {
                        this.resources.push({ name: src.split('/').pop(), src });
                        resolve();
                    };
                    document.head.appendChild(script);
                });
            };

            // FINALLY 
            loadScript('/staticfront/js/jquery-3.6.0.js')
                .then(() => loadScript('/staticfront/js/jquery-cookies.js'))
                .then(() => loadScript('/staticfront/js/jquery.form.js'))
                //.then(() => loadScript('/staticfront/js/jquery.validate.js'))
                .then(() => loadScript('/staticfront/js/jquery-validate-1.21.0.js'))
                .then(() => {
                    const mainstyle = document.createElement('link');
                    mainstyle.rel = 'stylesheet';
                    mainstyle.href = '/staticfront/css/style.css';
                    document.head.appendChild(mainstyle);
                    this.resources.push({
                        name: 'main-style',
                        src: mainstyle.href
                    });
                })
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
        }
    };
    Vue.createApp(App).mount('#app');
})