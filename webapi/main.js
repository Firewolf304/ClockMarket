window.addEventListener("load", ()=> {

    const filter = {
        Count : $.cookie("filterCount")
    };
    var products = {};
    var undefined = '/staticfront/jpg/undefined.jpg';


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
        $(".product-card").on("click", function () {
            const productId = $(this).data("id");
            const product = products.find(p => p.id === productId);
            $(".modal").css("display", "none");
            $("#modalImage").attr("src", product.imagesURLs[0] || undefined);
            $("#modalTitle").text(product.name);
            $("#modalDescription").text(product.description);
            $("#modalPrice").text(`Цена: ${product.price} руб.`);
            $(".modal").css("display", "flex");
            $("#productModal").fadeIn();
        });
    
        $("#closeModal").on("click", function () {
            $(".modal").css("display", "none");
            $("#productModal").fadeOut();
        });
    }
    var fetchProducts = () => {
        const queryParams = {};
        if (filter.Name) queryParams.Name = filter.Name;
        if (filter.BrandId) queryParams.BrandId = filter.BrandId;
        if (filter.MinPrice) queryParams.MinPrice = filter.MinPrice;
        if (filter.MaxPrice) queryParams.MaxPrice = filter.MaxPrice;
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
            products.forEach(product => {
                const productItem = $(`
                    <div class="product-card" data-id="${product.id}">
                        <img src="${product.imagesURLs[0] || undefined}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Бренд: ${product.brand.name}</p>
                        <p>Цена: ${product.price}</p>
                        <button data-id="${product.id}">Добавить в корзину</button>
                    </div>
                `);
                productList.append(productItem);
            });
            $("#filterPage").attr("max", response.totalPages)
            $("#filterCount").attr("max", response.totalItems)
            
            
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
        if($("#filterCount").val()) {
            $.cookie("filterCount", $("#filterCount").val(), {expires : 9999999});
        }
        fetchProducts();
    });

    // init
    fetchBrands();
    fetchProducts();
});
