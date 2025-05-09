exports.buildEmail = ( userName , order, shippingDetailUsername) => {
    const orderTemplates = [];

    for (const orderItem of order.orderItems) {
        orderTemplates.push(
            orderTemplates(
                orderItem.productImage,
                orderItem.productName,
                orderItem.productPrice,
                orderItem.quantity,
                orderItem.selectedColour,
                orderItem.selectedSize
            )
        );
    }
    const orderRows = orderTemplates.join(' ');
    return `Complete order ${orderRows}`
};