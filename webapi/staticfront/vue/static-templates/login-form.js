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
                loadScript('/staticfront/js/jquery-1.2.6.js')
                    .then(() => loadScript('/staticfront/js/jquery-cookies.js'))
                    .then(() => loadScript('/staticfront/js/jquery.form.js'))
                    .then(() => loadScript('/staticfront/js/jquery.validate.js'))
                    .then(() => {
                        const mainstyle = document.createElement('link');
                        mainstyle.rel = 'stylesheet';
                        mainstyle.href = '/staticfront/css/style-login.css';
                        document.head.appendChild(mainstyle);
                        this.resources.push({
                            name: 'main-style',
                            src: mainstyle.href
                        });
                    });
        }
    };
    Vue.createApp(App).mount('#app');
})