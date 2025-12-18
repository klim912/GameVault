export const calculateTotal = (items: { price: number; quantity: number }[]) => {
    // Вимога: сума = ціна * кількість для всіх товарів
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };