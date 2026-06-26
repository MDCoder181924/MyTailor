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
    <div className="grid grid-cols-1 gap-6 bg-theme-bg p-6 text-theme-text md:grid-cols-3">
      <div className="relative rounded-xl bg-theme-panel p-6 shadow-lg border border-theme-border">
        <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">TOTAL REVENUE</p>
        <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
          {completedOrders.length} done
        </span>
        <h2 className="mt-2 text-3xl font-bold text-theme-accent">
          ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="mt-4 h-1 w-24 bg-theme-accent"></div>
      </div>

      <div className="rounded-xl bg-theme-panel p-6 shadow-lg border border-theme-border">
        <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-theme-text-muted uppercase">ACTIVE ORDERS</p>
        <h2 className="text-3xl font-bold text-theme-text">
          {activeOrders.length} <span className="text-sm text-theme-text-muted font-normal">Pending tailoring</span>
        </h2>

        <div className="mt-4 flex items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-theme-panel bg-theme-accent text-xs font-bold text-theme-bg shadow-sm">
            {activeOrders.length}
          </div>
          <div className="ml-2 text-xs text-theme-text-muted">
            {orders.length} total orders
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-theme-accent-muted to-theme-panel p-6 shadow-lg border border-theme-accent/20">
        <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-theme-accent uppercase">TOP PRODUCT</p>
        <h2 className="text-2xl font-serif font-bold text-theme-text">
          {topProduct?.productName || "No Product Yet"}
        </h2>
        <p className="mt-1 text-sm text-theme-text-muted font-light">
          {topProduct?.category || "Add products to see performance"}
        </p>
        <p className="mt-4 text-xs font-bold tracking-wider text-theme-accent uppercase">
          {topProduct ? `${orders.filter((order) => order.product === topProduct.productName).length} ORDERS` : "START SELLING"}
        </p>
        <div className="absolute bottom-2 right-4 text-7xl font-serif text-theme-accent/10 select-none">*</div>
      </div>
    </div>
  );
}
