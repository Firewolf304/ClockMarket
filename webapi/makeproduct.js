window.addEventListener("load", ()=> {
    $(document).ready(function () {
        if(!window.adminStatus) $("#openModalButton").addClass("hidden")
        const $createModal = $("#createModal");
        const $productTab = $("#productTab");
        const $brandTab = $("#brandTab");
        const $productFormContainer = $("#productFormContainer");
        const $brandFormContainer = $("#brandFormContainer");

        $("#openModalButton").on("click", function () {
            $createModal.fadeIn();
        });

        $("#closeModal").on("click", function () {
            $createModal.fadeOut();
        });

        $productTab.on("click", function () {
            $productFormContainer.removeClass("hidden");
            $brandFormContainer.addClass("hidden");
            $productTab.addClass("active-tab");
            $brandTab.removeClass("active-tab");
        });

        $brandTab.on("click", function () {
            $brandFormContainer.removeClass("hidden");
            $productFormContainer.addClass("hidden");
            $brandTab.addClass("active-tab");
            $productTab.removeClass("active-tab");
        });

        $("#createProductForm").on("submit", function (e) {
            e.preventDefault();
            const productData = {
                name: $("#productName").val(),
                description: $("#productDescription").val(),
                barcode: $("#productBarcode").val(),
                brandId: parseInt($("#productBrand").val()),
                price: parseFloat($("#productPrice").val()),
                models: JSON.parse($("#productModels").val() || "{}")
            };

            $.ajax({
                url: "/Product",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                data: JSON.stringify(productData),
                success: function () {
                    alert("Товар успешно создан!");
                    $("#createProductForm")[0].reset();
                    $createModal.fadeOut();
                },
                error: function (xhr) {
                    console.error("Ошибка:", xhr.responseText);
                    alert("Не удалось создать товар.");
                }
            });
        });

        $("#createBrandForm").on("submit", function (e) {
            e.preventDefault();
            const brandData = {
                name: $("#brandName").val(),
                description: $("#brandDescription").val(),
                externalLogoId: $("#brandExternalLogoID").val()
            };

            $.ajax({
                url: "/Brand",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                data: JSON.stringify(brandData),
                success: function () {
                    alert("Бренд успешно создан!");
                    $("#createBrandForm")[0].reset();
                    $createModal.fadeOut();
                },
                error: function (xhr) {
                    console.error("Ошибка:", xhr.responseText);
                    alert("Не удалось создать бренд.");
                }
            });
        });
    });
});