import { useCart } from "../context/useCart";

interface Props {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  variant_id: number;
}

export const AddToCartButton = ({
  id,
  name,
  image,
  price,
  category,
  variant_id,
}: Props) => {
  const { addToCart } = useCart();

  const handleClick = () => {
    addToCart({ id, name, image, price, quantity: 1, category, variant_id });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Adicionar ao Carrinho
    </button>
  );
};
