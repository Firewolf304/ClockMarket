window.addEventListener("load", ()=> {
    $(document).ready(function () {
        if(!window.adminStatus) $("#createProductButton").addClass("hidden")
        const $createProductButton = $("#createProductButton");
        const $createProductModal = $("#productCreateModal");
        const $closeCreateModal = $("#closeCreateModal");
        const $createProductForm = $("#createProductForm");
    
        // Открытие модального окна
        $createProductButton.on("click", function () {
            $createProductModal.fadeIn();
            $("#productCreateModal .modal").css("display", "flex");
        });
    
        // Закрытие модального окна
        $closeCreateModal.on("click", function () {
            $createProductModal.fadeOut();
            $("#productCreateModal .modal").css("display", "none");
        });
    
        // Отправка формы
        $createProductForm.on("submit", function (e) {
            e.preventDefault();
    
            // Сбор данных из формы
            const productData = {
                name: $("#productName").val(),
                description: $("#productDescription").val(),
                barcode: $("#productBarcode").val(),
                brandId: parseInt($("#productBrand").val()),
                price: parseFloat($("#productPrice").val()),
                models: JSON.parse($("#productModels").val() || "{}")
            };
    
            // Отправка POST-запроса
            $.ajax({
                url: "/Product",
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                contentType: "application/json",
                data: JSON.stringify(productData),
                success: function () {
                    alert("Товар успешно создан!");
                    $createProductModal.fadeOut();
                    $createProductForm[0].reset();
                },
                error: function (xhr) {
                    console.error("Ошибка:", xhr.responseText);
                    alert("Не удалось создать товар. Проверьте данные.");
                }
            });
        });
    });
});