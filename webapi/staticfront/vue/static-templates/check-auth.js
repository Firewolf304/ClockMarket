window.addEventListener("load", ()=> {
    /*
        Made by
          _____.__                            .__   _____ 
        _/ ____\__|______   ______  _  ______ |  |_/ ____\
        \   __\|  \_  __ \_/ __ \ \/ \/ /  _ \|  |\   __\ 
        |  |  |  ||  | \/\  ___/\     (  <_> )  |_|  |   
        |__|  |__||__|    \___  >\/\_/ \____/|____/__|   
                            \/                         
    */
    var a = $.cookie('username');
    if(a !== undefined) {
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
                    elements.forEach(element => {
                        $.cookie(element, data[element]);
                    });
                    return;
                } 
                window.location.href = "/login";
            },
            error: function(xhr, status, error) {
                console.log(error);
                window.location.href = "/login";
            }
        });
    } else {
        window.location.href = "/login";
    }
});