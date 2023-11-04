type Props = {
  data: {
    count: number;
    amount: number;
    total: number;
    price: number;
  }[];
  action: 'buy' | 'sell';
  size?: number;
};

export function Table({ data, size = 20 }: Props) {
  return (
    <div className="flex flex-col tabular-nums">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    count
                  </th>
                  <th scope="col" className="px-6 py-4">
                    amount
                  </th>
                  <th scope="col" className="px-6 py-4">
                    total
                  </th>
                  <th scope="col" className="px-6 py-4">
                    price
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-size).map(({ count, amount, total, price }, index) => (
                  <tr key={`${count}/${amount}/${price}/${index}`} className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4">{count}</td>
                    <td className="whitespace-nowrap px-6 py-4">{amount?.toFixed(4)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{total?.toFixed(4)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
