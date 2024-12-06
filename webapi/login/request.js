window.addEventListener("load", ()=> {
    console.log('request loading');
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=0';
    }
    function setCookie_old(name, value, options = {}) {
        options = {
            path: '/',
            ...options
        };
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }
        document.cookie = updatedCookie;
    }

    //$(document).ready(function(){
    var options = {
        type: "post",
        success: function() {
            alert("hello");
        },
        timeout: 3000 // тайм-аут
    };
    $('#register-button').click(function() {
        document.location.href = '/register/index.html';
    });
    $.validator.messages.required = '';
    $("#login_event").validate({
        focusInvalid: false,
        focusCleanup: true,
        rules: {
            login : {
                required: true,
                minLength: 4,
                maxLength: 64
            },
            password : {
                required: true,
                minLength: 4,
                maxLength: 64
            }
        },
        messages: {
            login: {
                required: "Login must be required!"
            },
            password: {
                required: "Password must be required!"
            }
        },
        onkeyup: false,
        errorPlacement: function(error,element) {
            if(error !== undefined) {
                console.log("Error input: " + error);
                //element.parent().find('em').text(error[0].innerText);
                error.appendTo(element.parent().find('em'));
            } else {
                element.parent().find('em').text("");
            }
        },
        submitHandler: function (form) {
            var data = {
                username: document.getElementById("login").value,
                password: document.getElementById("password").value
            };
            //data = btoa(JSON.stringify(data))   ;

            console.log(data);
            var xhr = fetch("/User/authenticate",
                {
                    method: 'POST',
                    headers: {
                        "accept": "text/plain",
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                }).then(response =>
            {
                if(response.ok) {
                    return response.text();
                }
            }).then( data => {
                console.log("Response:". data);
                if(data !== undefined) {
                    var js = JSON.parse(data);
                    if(js["error"] === undefined && data !== undefined) {
                        const expires = new Date();
                        expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
                        document.cookie = `id=${js["id"]}; expires=${expires.toUTCString()}; path=/ `;
                        document.cookie = `username=${js["username"]}; expires=${expires.toUTCString()}; path=/ `;
                        document.cookie = `role=${js["role"]}; expires=${expires.toUTCString()}; path=/ `;
                        document.cookie = `token=${js["token"]}; expires=${expires.toUTCString()}; path=/ `;
                        document.location.href = "/";
                    } else {
                        document.getElementById("status").innerHTML = js["error"];
                    }
                } else {
                    document.getElementById("status").innerHTML = "Сервер предпочел молчание";
                }

            }).catch(error => {
                $('#status').innerHTML("Incorrect input");
                console.error('error:', error);
            });
        }
    });

    //});
})
/*
fetch("http://127.0.0.1:82/User/authenticate", {
  "headers": {
    "accept": "text/plain",
    "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
    "content-type": "application/json",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "http://127.0.0.1:82/swagger/index.html",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\n  \"username\": \"admin\",\n  \"password\": \"admin\"\n}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});*/