window.addEventListener("load", ()=> {
    let sess_data = $.cookie('username');
    var token = $.cookie('token')
    var setDefault = () => {
        $(".user-name").text(`Гость `)
        $(".user-role").text(`Customer`)
    }
    if(sess_data !== undefined || sess_data !== "undefined" || token !== undefined || token !== "undefined") {
        
        $.ajax({
            url: '/User/me',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                if(data !== undefined || data !== null || data !== "") {
                    console.log("success login");
                    $('#logout-button').removeClass('hidden')
                    $('#auth-button').addClass('hidden')
                    let elements = ["firstname", "lastname", "username", "id", "role"];
                    var date = new Date(Date.now() + 86400e3);
                    elements.forEach(element => {
                        $.cookie(element, data[element], { path: '/',  expires: date });
                    });
                    $(".user-name").text(`${data["firstname"]} ${data["lastname"]}`)
                    $(".user-role").text(`${data["role"]}`)
                } else {
                    setDefault();
                }
                return
            },
            error: function(xhr, status, error) {
                setDefault();
                console.log(error);
            }
        });
    } else {
        setDefault();
        //window.location.href = "/login";
    }
});