import { useEffect, useMemo, useState } from "react";
import { getMyProducts } from "../../../utils/productUtils";
import { getTailorOrders } from "../../../utils/orderUtils";

const parseAmount = (value) => {
  const numericValue = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

export default function DashboardCards() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const nextProducts = await getMyProducts();
        setProducts(nextProducts);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const syncOrders = async () => {
      try {
        const nextOrders = await getTailorOrders();
        setOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch {
        setOrders([]);
      }
    };

    syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener("tailor-orders-updated", syncOrders);

    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("tailor-orders-updated", syncOrders);
    };
  }, []);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "SHIPPED"),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === "SHIPPED"),
    [orders]
  );

  const totalRevenue = useMemo(
    () => completedOrders.reduce((sum, order) => sum + parseAmount(order.total), 0),
    [completedOrders]
  );

  const topProduct = useMemo(() => {
    if (!products.length) {
      return null;
    }

    const ordersByProduct = orders.reduce((acc, order) => {
      acc[order.product] = (acc[order.product] || 0) + 1;
      return acc;
    }, {});

    return [...products].sort((a, b) => {
      const orderDiff = (ordersByProduct[b.productName] || 0) - (ordersByProduct[a.productName] || 0);
      if (orderDiff !== 0) {
        return orderDiff;
      }

      return parseAmount(b.price) - parseAmount(a.price);
    })[0];
  }, [orders, products]);

  return (
    <div className="grid grid-cols-1 gap-6 bg-black p-6 text-white md:grid-cols-3">
      <div className="relative rounded-xl bg-gray-900 p-6 shadow-lg">
        <p className="mb-2 text-xs text-gray-400">TOTAL REVENUE</p>
        <span className="absolute right-4 top-4 rounded-full bg-green-600 px-2 py-1 text-xs">
          {completedOrders.length} done
        </span>
        <h2 className="mt-2 text-3xl font-bold text-yellow-400">
          ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="mt-4 h-1 w-24 bg-yellow-400"></div>
      </div>

      <div className="rounded-xl bg-gray-900 p-6 shadow-lg">
        <p className="mb-2 text-xs text-gray-400">ACTIVE ORDERS</p>
        <h2 className="text-3xl font-bold">
          {activeOrders.length} <span className="text-sm text-gray-400">Pending tailoring</span>
        </h2>

        <div className="mt-4 flex items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-yellow-400 text-xs font-bold text-black">
            {activeOrders.length}
          </div>
          <div className="ml-2 text-xs text-gray-400">
            {orders.length} total orders
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 p-6 shadow-lg">
        <p className="mb-2 text-xs text-yellow-400">TOP PRODUCT</p>
        <h2 className="text-2xl font-serif font-bold">
          {topProduct?.productName || "No Product Yet"}
        </h2>
        <p className="mt-1 text-sm text-gray-300">
          {topProduct?.category || "Add products to see performance"}
        </p>
        <p className="mt-4 text-sm text-yellow-400">
          {topProduct ? `${orders.filter((order) => order.product === topProduct.productName).length} ORDERS` : "START SELLING"}
        </p>
        <div className="absolute bottom-2 right-4 text-7xl opacity-20">*</div>
      </div>
    </div>
  );
}
