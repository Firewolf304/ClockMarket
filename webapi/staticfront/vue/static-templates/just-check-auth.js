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

                    $.cookie("firstname", data["firstname"]);
                    $.cookie("lastname", data["lastname"]);
                    $.cookie("username", data["username"]);
                    $.cookie("id", data["id"]);
                    $.cookie("role", data["role"]);
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