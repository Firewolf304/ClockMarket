var token = "";
window.adminStatus = false;

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
            const productList = $("#productsList");
            const pagination = $("#pagination");
            
            productList.empty();
            if (response.totalPages < 0) return;
            if ($("#filterPage").val() > response.totalPages) {
                $("#filterPage").val(0);
                filter.Offset = $("#filterPage").val();
                fetchProducts();
            }
            
            products = response["products"];
        
            function getSelectedProducts() {
                return JSON.parse(localStorage.getItem("selectedProducts") || "[]");
            }
            
            function saveSelectedProducts(selected) {
                localStorage.setItem("selectedProducts", JSON.stringify(selected));
            }
            
            function toggleProductSelection(productId, button) {
                let selectedProducts = getSelectedProducts();
                const index = selectedProducts.indexOf(productId);
                if (index === -1) {
                    selectedProducts.push(productId);
                    $(button).text("Добавлено").addClass("added");
                } else {
                    selectedProducts.splice(index, 1);
                    $(button).text("Добавить").removeClass("added");
                }
                saveSelectedProducts(selectedProducts);
            }
            
            products.forEach(product => {
                const productId = product.id.toString();
                const isSelected = getSelectedProducts().includes(productId);
                const productItem = $(
                    `<div class="product-card" data-id="${product.id}">
                        <img src="${product.imagesURLs[0] || undefined}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Бренд: ${product.brand.name}</p>
                        <p>Цена: ${product.price}</p>
                        <button class="product-btn ${isSelected ? 'added' : ''}" data-id="${product.id}">
                            ${isSelected ? 'Добавлено' : 'Добавить'}
                        </button>
                        ${window.adminStatus ? `<div class="delete"><button data-id="${product.id}" class="delete-btn">Удалить</button></div>` : ""}
                    </div>`
                );
                
                productList.append(productItem);
            });
            
            $("body").on("click", ".product-btn", function () {
                const productId = $(this).attr("data-id");
                toggleProductSelection(productId, this);
            });
        
            $("body").on("click", ".delete-btn", function () {
                //const productId = $(this).attr("data-id");
                //console.log("Удалить продукт:", productId);
                deleteItem(this)
            });
        
            updateModal();
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
    
    
    
    // init
    fetchBrands();
    fetchProducts();
});
