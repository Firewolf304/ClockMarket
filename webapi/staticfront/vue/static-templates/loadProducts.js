window.addEventListener("load", ()=> {
    $("#submitPurchase").on("click", function() {
        const selectedProducts = [];
        $(".product-item").each(function() {
            const productId = $(this).data("product-id");
            const modelId = $(this).children("select.product-select").val();
            const quantity = $(this).children("input.product-quantity").val();
            if (modelId) {
                selectedProducts.push({
                    modelID: modelId,
                    quantity: quantity
                });
            }
        });

        const data = {
            items: selectedProducts,
            address: {
                countryCode: $("#countryCode").val(),
                state: $("#state").val(),
                city: $("#city").val(),
                street: $("#street").val(),
                building: $("#building").val(),
                apartment: $("#apartment").val(),
                zipCode: $("#zipCode").val()
            },
            comment: $("#comment").val()
        };

        $.ajax({
            url: "/OrderControler",
            method: "POST",
            contentType: "application/json",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(data),
            success: function(response) {
                alert("Заказ оформлен успешно!");
                $("#purchaseModal").hide();
            },
            error: function() {
                alert("Ошибка при оформлении заказа");
            }
        });
    });
    var generate = (productData) => {
        const productId = productData.id;
        const productModels = productData.models || [];
        const price = productData.price

        let modelsOptions = productModels.map(model => {
            return `<option value="${model.id}">${model.model}</option>`;
        }).join("");

        var ele =  $(`
            <div class="product-item" data-product-id="${productId}">
                <h3>${productData.name}</h3>
                <label>Модель:</label>
                <select class="product-select" data-product-id="${productId}">
                    ${modelsOptions}
                </select>
                <label>Количество:</label>
                <input type="number" value="1" class="product-quantity" data-quantity="1" min="1">
                <label>Цена:</label>
                <label class="product-price"></label>
            </div>
        `);
        var updatePrice = () => {
            const $element = $(ele);
            const $quantityInput = $element.find("input")
            const quantity = parseInt($quantityInput.val(), 10) || 0;
            $(ele).find(".product-price").text((price * quantity).toFixed(2));
            $("h3#product-fullprice span").text("");
            var all1 = 0;
            var summ = $(".product-price");
            if(summ.length > 0)
            {
                summ.each((a) => { 
                    all1 += parseFloat($($("label.product-price")[a]).text())
                })
                $("h3#product-fullprice span").text((all1).toFixed(2));
            }
            
        }
        ele.children(".product-quantity").on("change", updatePrice);
        updatePrice();
        return ele;
    };
    function loadProducts() {
        const selectedProductIds = Array.from(JSON.parse(localStorage.getItem('selectedProducts')).map(Number));
        $("#productList").empty()
        $("h3#product-fullprice span").text("");
        var all = 0;
        const promises = selectedProductIds.map(id => {
            return $.ajax({
                url: `/Product/${id}`,
                method: "GET",
                success: function(productData) {
                    // add products
                    const productListHtml = generate(productData);
                    all += productData.price;
                    $("#productList").append(productListHtml);
                    $("h3#product-fullprice span").text((all).toFixed(2));
                }
            });
        });
    }
    $("#purchaseModal #closeModal").on("click", function() {
        $("#purchaseModal").fadeOut();
    });
    $("#addToCartButton").on("click", function() {
        $("#purchaseModal").fadeIn();
        loadProducts();
    });
})