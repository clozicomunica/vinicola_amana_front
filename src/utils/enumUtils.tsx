export function translateOrderStatus(status: string): string {
  switch (status) {
    case "pending":
      return "Pendente";
    case "paid":
      return "Pago";
    case "shipped":
      return "Enviado";
    case "delivered":
      return "Entregue";
    case "canceled":
      return "Cancelado";
    default:
      return "Desconhecido";
  }
}
