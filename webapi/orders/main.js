/**
 * @param {state} myDate The number
 * 
 * Pending = 0,
 * Processing = 1,
 * Shipped = 2,
 * Delivered = 3,
 * Cancelled = 4,
 */
var getStates = (state) => {
    switch(state) {
        case 0 : {
            return "Pending";
        }break;
        case 1 : {
            return "Processing";
        }break;
        case 2 : {
            return "Shipped";
        }break;
        case 3 : {
            return "Delivered";
        }break;
        case 4 : {
            return "Cancelled";
        }break;
        
    }
};
window.addEventListener("load", ()=> {
    var getOrders = () => {
        $.ajax({
            url: "/OrderControler",
            method: "GET",
            headers: {
                'Authorization': `Bearer ${$.cookie("token")}`
            },
            success: function(response) {
                const $orderList = $("#orderList");
                $orderList.empty();
                response.forEach(order => {
                    var $orderItem = $(`
                        <div class="order-item">
                            <div class="order-header">
                                <span>Заказ #${order.id} — ${new Date(order.createdAt).toLocaleString()}</span>
                                <span class="order-status ${order.status}">${order.status}</span>
                            </div>
                        </div>
                    `);
                    const $itemsContainer = $("<div>", { class: "order-items" });
                    if (order.items.length === 1) {
                        const item = order.items[0];
                        $orderItem.closest(".order-item").find(".order-header").append("<span>Показать товары</span>")
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
                    $orderList.append($orderItem);
                });
                
            },
            error: function() {
                
            }
        });
    }

    getOrders();
});