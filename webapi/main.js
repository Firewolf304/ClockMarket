var token = "";
window.adminStatus = false;
var selectedProducts = new Set();
function deleteItem(button) {
    const productId = $(button).data('id'); // Получаем ID продукта
    
    // DELETE THIS SHIT
    fetch(`/Product/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            $(button).closest('.product-card').remove();
            alert("Продукт успешно удален!");
        } else {
            alert("Ошибка при удалении продукта. Попробуйте еще раз.");
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert("Произошла ошибка. Попробуйте еще раз.");
    });
}
window.addEventListener("load", ()=> {
    token = $.cookie("token");
    const filter = {
        Count : $.cookie("filterCount")
    };
    var products = {};
    var undefined = '/staticfront/jpg/undefined.jpg';
    var ItemMaxCount = 20;
    if($.cookie("role") == "Salesman") window.adminStatus = true;
    $("#filterCount").val($.cookie("filterCount"))
    var fetchBrands = () => {
        $.get("/Brand", function (brands) {
            const filterBrand = $("#filterBrand");
            filterBrand.empty();
            filterBrand.append('<option value="">Все бренды</option>');
            brands.forEach(brand => {
                filterBrand.append(`<option value="${brand.id}">${brand.name}</option>`);
            });
        });
    }
    
    var updateModal = () => {
        $(".product-card h3").on("click", function () {
            const productId = $(this).parent().data("id");
            const product = products.find(p => p.id === productId);
            $("#modalImage").attr("src", product.imagesURLs[0] || undefined);
            $("#modalTitle").text(product.name);
            $("#modalDescription").text(product.description);
            $("#modalPrice").text(`Цена: ${product.price} руб.`);
            const modelsList = $("#modalModels");
            modelsList.empty();
            if (product.models && product.models.length > 0) {
                product.models.forEach(model => {
                    modelsList.append(`<li>${model.model} => ${model.quantity}</li>`);
                });
            } else {
                modelsList.append(`<li>Модели не указаны</li>`);
            }
            $("#productModal").fadeIn();
            $("#productModal").css("display", "flex");
        });
    
        $("#productModal button#closeModal").on("click", function () {
            $("#productModal").css("display", "none");
            $("#productModal").fadeOut();
        });
    }
    var fetchProducts = () => {
        const queryParams = {};
        if (filter.Name) queryParams.Name = filter.Name;
        if (filter.BrandId) queryParams.BrandId = filter.BrandId;
        if (filter.MinPrice) queryParams.MinPrice = filter.MinPrice;
        if (filter.MaxPrice) queryParams.MaxPrice = filter.MaxPrice;
        if (filter.Gender) queryParams.Gender = filter.Gender;
        queryParams.Country = filter.Country;
        if (filter.Waterproof) queryParams.Waterproof = filter.Waterproof;
        queryParams.Count = filter.Count;
        queryParams.Offset = filter.Offset;
        $.get("/Product", queryParams, function (response) {
            const productList = $(document.querySelector("#productsList"));
            const pagination = $("#pagination");

            productList.empty();
            if(response.totalPages < 0) return;
            if($("#filterPage").val() > response.totalPages) {
                $("#filterPage").val(0);
                filter.Offset = $("#filterPage").val();
                fetchProducts();
            }
            products = response["products"];
            function  deleteItem (element) {
                console.log($(element))
                //$.delete(`/Product/${}`)
            };

            // ============= checkbox logic
            selectedProducts = new Set();

            function updateCartButtonState() {
                if (selectedProducts.size > 0) {
                    $("#addToCartButton").removeClass("disabled").prop("disabled", false);
                } else {
                    $("#addToCartButton").addClass("disabled").prop("disabled", true);
                }
            }

            $("body").on("change", "input.product-checkbox", function () {
                const productId = $(this).attr("data-id");
                if (this.checked) {
                    selectedProducts.add(productId);
                } else {
                    selectedProducts.delete(productId);
                }
                updateCartButtonState();
            });
            $("#addToCartButton").off();
            $("#addToCartButton").on("click", function () {
                if (selectedProducts.size > 0) {
                    //alert(`Добавлено в корзину: ${Array.from(selectedProducts).join(", ")}`);
                    
                    loadProducts();
                    $("#purchaseModal").fadeIn();

                    /*selectedProducts.clear();
                    $("input.product-checkbox").prop("checked", false);
                    updateCartButtonState();*/
                }
            });
            // ============= checkbox logic

            products.forEach(product => {
                const productItem = $(`
                    <div class="product-card" data-id="${product.id}">
                        <img src="${product.imagesURLs[0] || undefined}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Бренд: ${product.brand.name}</p>
                        <p>Цена: ${product.price}</p>
                        <input type="checkbox" class="product-checkbox" data-id="${product.id}" />
                        ` +
                        ((window.adminStatus) ? `<div class="delete"><button data-id="${product.id}" onclick="deleteItem(this)">Удалить</button></div>` : "")
                        +  `
                    </div>
                `);
                productList.append(productItem);
            });
            selectedProducts.clear();
            
            //$("#filterPage").attr("max", response.totalPages)
            //if(response.totalItems < ItemMaxCount) $("#filterCount").attr("max", response.totalItems)
            //else $("#filterCount").attr("max", ItemMaxCount)
            
            // update
            updateModal();
            /*pagination.empty();
            for (let i = 1; i <= response.remainingPages + 1; i++) {
                const pageButton = $(`<button>${i}</button>`);
                pageButton.on("click", function () {
                    filter.Offset = i;
                    fetchProducts();
                });
                pagination.append(pageButton);
            }*/
        });
    }
    
    // filter form
    $("#productFilterForm").on("submit", function (event) {
        event.preventDefault();
        filter.Name = $("#filterName").val() || null;
        filter.BrandId = $("#filterBrand").val() || null;
        filter.MinPrice = $("#filterMinPrice").val() || 0;
        filter.MaxPrice = $("#filterMaxPrice").val() || 999999;
        filter.Count = $("#filterCount").val() || $.cookie("filterCount");
        filter.Offset = $("#filterPage").val() || 0; 
        filter.Gender = $("#filterSex").val() || null;
        filter.Country = $("#filterCountry").val() || "";
        filter.Waterproof = $("#filterWaterproof").val() || 999999;

        if($("#filterCount").val()) {
            $.cookie("filterCount", $("#filterCount").val(), {expires : 9999999});
        }
        fetchProducts();
    });
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
        const selectedProductIds = Array.from(selectedProducts);
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
    

    // init
    fetchBrands();
    fetchProducts();
});
