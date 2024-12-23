/**
 * @param {state} myDate The number
 * 
 * Pending = 0,
 * Processing = 1,
 * Shipped = 2,
 * Delivered = 3,
 * Cancelled = 4,
 */
var productStates = {
    "Pending" : 0,
    "Processing" : 1,
    "Shipped" : 2,
    "Delivered" : 3,
    "Cancelled" : 4
}
var getStates = (state) => {
    switch(state) {
        case '0' : {
            return "Pending";
        }break;
        case '1' : {
            return "Processing";
        }break;
        case '2' : {
            return "Shipped";
        }break;
        case '3' : {
            return "Delivered";
        }break;
        case '4' : {
            return "Cancelled";
        }break;
        
    }
};
var getIndexState = (state) => {
    const keys = Object.keys(productStates);
    const index = keys.indexOf(state);
    return index !== -1 ? productStates[keys[index]] : null;
};
window.addEventListener("load", ()=> {
    var createOrders = (order) => {
        const $orderItem = $(`
            <div class="order-item">
                <div class="order-header">
                    <span>Заказ #${order.id} — ${new Date(order.createdAt).toLocaleString()}</span>
                    <input type="text" class="tracking-number" placeholder="Tracking Number" value="${order.trackingNumber || ''}" />
                    <select class="order-status"></select>
                    <button class="update-order">Update</button>
                </div>
            </div>
        `);
        const $statusSelect = $orderItem.find(".order-status");
        for (const [key, value] of Object.entries(productStates)) {
            $statusSelect.append(new Option(key, value));
        }
        $statusSelect.val(getIndexState(order.status));
        $statusSelect.on("change", function () {
            const selectedValue = $(this).val();
            //$orderItem.find(".order-header").find(".order-status").text(getIndexState(selectedValue));
        });
        const $itemsContainer = $("<div>", { class: "order-items" });
        if (order.items.length === 1) {
            const item = order.items[0];
            $itemsContainer.append(`
                <div class="item">
                    <span>${item.model.product.name} (${item.model.model})</span>
                    <span>${item.quantity} шт.</span>
                </div>
              `);
            
        }
        else {
            const $detailsButton = $("<button>").text("Показать товары").on("click", function () {
                $itemsContainer.toggle();
            });

            $itemsContainer.css("display", "none");
            order.items.forEach(item => {
                $itemsContainer.append(`
                <div class="item">
                    <span>${item.model.product.name} (${item.model.model})</span>
                    <span>${item.quantity} шт.</span>
                </div>
                `);
            });

            $orderItem.find(".order-header").append($detailsButton); 
        }
        $orderItem.append($itemsContainer);
        const $orderList = $("#orderList"); 

        $orderItem.find(".update-order").on("click", function () {
            const trackingNumber = $orderItem.find(".tracking-number").val() || "";
            const status = $statusSelect.val()  || "0";
            const orderId = order.id;

            $.ajax({
                url: `/OrderControler/${orderId}`,
                method: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({
                    status: getStates(status),
                    trackingNumber: trackingNumber
                }),
                headers: {
                    'Authorization': `Bearer ${$.cookie("token")}`
                },
                success: function (response) {
                    alert("Order updated successfully!");

                    getOrders();
                },
                error: function (xhr) {
                    alert("Error updating order: " + xhr.responseText);
                }
            });
        });
        $orderList.append($orderItem);
    };
    var getOrders = () => {
        $.ajax({
            url: "/OrderControler/all",
            method: "GET",
            headers: {
                'Authorization': `Bearer ${$.cookie("token")}`
            },
            success: function(response) {
                const $orderList = $("#orderList");
                $orderList.empty();
                response.forEach(order => {
                    createOrders(order);
                });
                
            },
            error: function() {
                
            }
        });
    }

    getOrders();
});