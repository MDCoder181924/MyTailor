import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/user/Dashboard/HeaderDashboard";
import PhoneFooter from "../../components/user/Dashboard/PhoneFotter";
import defaultTailorImage from "../../assets/images/by-defalt-tailor-img.avif";
import { getProductsByTailorId } from "../../utils/productUtils";
import { getTailorById } from "../../utils/tailorUtils";

const fallbackProductImage = "https://picsum.photos/seed/tailor-product/800/1000";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isNaN(numericPrice) ? "Price on request" : `$${numericPrice}`;
};

export default function TailorPublicProfile() {
  const { tailorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tailor, setTailor] = useState(location.state?.tailor || null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTailorProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [tailorData, productData] = await Promise.all([
          location.state?.tailor ? Promise.resolve(location.state.tailor) : getTailorById(tailorId),
          getProductsByTailorId(tailorId),
        ]);

        if (!isMounted) {
          return;
        }

        setTailor(tailorData);
        setProducts(productData);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load tailor profile");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTailorProfile();

    return () => {
      isMounted = false;
    };
  }, [location.state, tailorId]);

  const stats = useMemo(
    () => [
      {
        label: "YEARS EXPERIENCE",
        value: Number.isFinite(Number(tailor?.yearsOfExperience))
          ? `${Number(tailor?.yearsOfExperience)}+`
          : "0+",
      },
      {
        label: "SPECIALIZATIONS",
        value: `${tailor?.specializations?.length || 0}`,
      },
      {
        label: "PRODUCTS",
        value: `${products.length}`,
      },
    ],
    [products.length, tailor]
  );

  const handleOrderProduct = (product) => {
    navigate(`/OrdarProduct?productId=${product._id}`, {
      state: { product },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-20 text-center text-gray-400">
            Loading tailor profile...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 px-6 py-16 text-center text-red-200">
            {error}
          </div>
        ) : null}

        {!loading && !error && tailor ? (
          <>
            <section className="grid gap-6 rounded-[32px] border border-[#242424] bg-[#0f0f0f] p-5 md:grid-cols-[320px_1fr] md:p-8">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#161616]">
                <img
                  src={tailor.profilePhoto || defaultTailorImage}
                  alt={tailor.tailorName || "Tailor"}
                  className="h-full min-h-[360px] w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
                    Tailor Profile
                  </p>
                  <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
                    {tailor.tailorName}
                  </h1>
                  <p className="mt-3 text-lg text-yellow-300">
                    {tailor.professionalTitle || "Master Tailor & Designer"}
                  </p>
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
                    {tailor.shopDescription ||
                      "This tailor has not added a public description yet, but you can still explore their products and place an order."}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-black/40 px-4 py-5"
                    >
                      <p className="text-2xl font-bold text-yellow-400">{item.value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.28em] text-gray-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-[#101010] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Shop Details
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {tailor.shopName || tailor.tailorName}
                </h2>
                <p className="mt-4 text-sm leading-7 text-gray-300">
                  {tailor.shopAddress || "Shop address is not available yet."}
                </p>
                <p className="mt-4 text-sm text-gray-400">
                  Contact: {tailor.tailorEmail || "Not available"}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#101010] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Specializations
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {(tailor.specializations?.length
                    ? tailor.specializations
                    : ["Custom Suits", "Ethnic Wear", "Alterations"]
                  ).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-yellow-400/50 px-4 py-2 text-sm text-yellow-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-[#242424] bg-[#0d0d0d] p-5 md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Products
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">Order From This Tailor</h2>
                </div>
                <p className="text-sm text-gray-400">
                  Click any product to open its order page.
                </p>
              </div>

              {products.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  No products available for this tailor yet.
                </div>
              ) : (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleOrderProduct(product)}
                      className="overflow-hidden rounded-[28px] border border-white/10 bg-[#141414] text-left transition hover:-translate-y-1 hover:border-yellow-400/70"
                    >
                      <img
                        src={product.image || fallbackProductImage}
                        alt={product.productName}
                        className="h-72 w-full object-cover"
                      />

                      <div className="p-5">
                        <p className="text-xs uppercase tracking-[0.28em] text-gray-500">
                          {product.category}
                        </p>
                        <h3 className="mt-3 text-xl font-semibold text-white">
                          {product.productName}
                        </h3>
                        {product.description ? (
                          <p className="mt-3 text-sm leading-6 text-gray-300">
                            {product.description}
                          </p>
                        ) : null}

                        <div className="mt-5 flex items-center justify-between gap-3">
                          <span className="text-lg font-bold text-yellow-400">
                            {formatPrice(product.price)}
                          </span>
                          <span className="rounded-full border border-yellow-400/40 px-4 py-2 text-xs uppercase tracking-[0.24em] text-yellow-300">
                            Order Now
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>

      <PhoneFooter />
    </div>
  );
}
