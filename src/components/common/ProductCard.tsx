type Product = {
  image: string;
  name: string;
  sold: number;
};

type ProductCardProps = {
  data: Product;
};

export default function ProductCard({ data }: ProductCardProps) {
  return (
    <div className="box">
      <img src={data.image} alt="" />
      <h3>{data.name}</h3>
      <div className="info">
        <span>Số lượng đã bán: {data.sold}</span>
      </div>
    </div>
  );
}
