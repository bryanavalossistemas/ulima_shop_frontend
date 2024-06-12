import Heading from "@/components/shop/Heading";
import HeadingBar from "@/components/shop/HeadingBar";
import CheckoutCard from "@/components/shop/CheckoutCard";
import CheckoutInput from "@/components/shop/CheckoutInput";
import ItemInOrderItem from "@/components/shop/ItemInOrderItem";
import SummaryOrderItem from "@/components/shop/SummaryOrderItem";
import ErrorDisplay from "@/components/shop/ErrorDisplay";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CheckoutView() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);

  const [firstDirection, setFirstDirection] = useState("");
  const [secondDirection, setSecondDirection] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setMethodPay] = useState("Tarjeta");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiration, setExpiration] = useState("");
  const [ccv, setCcv] = useState("");
  const [shippingMethod, setShippingMethod] = useState("Económico");
  const [addressError, setAddressError] = useState("");
  const [payError, setPayError] = useState("");
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);

  const subTotal = useMemo(
    () =>
      cart.reduce(
        (total, cartItem) => total + cartItem.price * cartItem.quantity,
        0
      ),
    [cart]
  );

  const shipmentAmount = useMemo(
    () => (shippingMethod === "economic" ? 10 : 17),
    [shippingMethod]
  );

  const tax = useMemo(() => subTotal * 0.18, [shippingMethod]);

  const total = useMemo(
    () => subTotal + shipmentAmount + tax,
    [shippingMethod]
  );

  async function handleSubmit() {
    if (
      [
        firstDirection,
        district,
        city,
        country,
        paymentMethod,
        shippingMethod,
      ].includes("")
    ) {
      setAddressError("Debe completar los campos de dirección de envío");
      return;
    }

    setAddressError("");

    if (paymentMethod === "Tarjeta") {
      if ([cardNumber, nameOnCard, expiration, ccv].includes("")) {
        setPayError("Debe completar los campos de pago");
        return;
      }
    }

    setPayError("");

    const response = await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstDirection,
        secondDirection,
        district,
        city,
        country,
        shippingMethod,
        paymentMethod,
        cardNumber,
        nameOnCard,
        expiration,
        ccv,
        userId: currentUser.id,
        status: "Pendiente",
      }),
    });

    if (!response.ok) {
      toast.error("Error al crear la orden");
      return;
    }

    const order = await response.json();

    const createdDetailsOrder = cart.map((item) => {
      fetch(`http://localhost:4000/api/detailsOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.id,
          orderId: order.id,
          quantity: item.quantity,
        }),
      });
    });

    await Promise.all([createdDetailsOrder]);
    toast.success("Orden creada correctamente");
    clearCart();
    navigate("/order_completed");
  }

  function verifySession() {
    if (!currentUser) {
      navigate("/auth/login");
    }
  }

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <main className="space-y-4 py-4 px-10">
      <Heading text="¡Casi Listo! Tu orden no estará completa hasta que revises y presiones el botón “completar orden” al final de la página." />
      <HeadingBar text="Items Disponibles para Envío" />
      <div className="flex gap-x-[37px] justify-between items-center">
        <CheckoutCard className="h-[559px]" heading="Dirección de Envío">
          <div className="flex flex-col gap-y-[27px]">
            <CheckoutInput
              placeholder="Línea 1"
              value={firstDirection}
              onChange={(e) => setFirstDirection(e.target.value)}
            />
            <CheckoutInput
              placeholder="Línea 2"
              value={secondDirection}
              onChange={(e) => setSecondDirection(e.target.value)}
            />
            <CheckoutInput
              placeholder="Distrito"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <CheckoutInput
              placeholder="Ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <CheckoutInput
              placeholder="País"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {addressError !== "" && <ErrorDisplay text={addressError} />}
          </div>
        </CheckoutCard>

        <CheckoutCard className="h-[559px]" heading="Pago">
          <div className="pl-[15px] flex flex-col gap-y-[29px] mb-[32px]">
            <div className="flex items-center gap-x-[17px]">
              <input
                type="radio"
                name="paymentMethod"
                id="paymentMethod1"
                value="QR"
                checked={paymentMethod === "QR"}
                onChange={(e) => setMethodPay(e.target.value)}
              />
              <label htmlFor="paymentMethod1">Pago con código QR</label>
            </div>

            <div className="flex items-center gap-x-[17px]">
              <input
                type="radio"
                name="paymentMethod"
                id="paymentMethod2"
                value="Tarjeta"
                checked={paymentMethod === "Tarjeta"}
                onChange={(e) => setMethodPay(e.target.value)}
              />
              <label htmlFor="paymentMethod2">
                Pago con tarjeta de crédito
              </label>
            </div>
          </div>

          {paymentMethod === "Tarjeta" ? (
            <>
              <div className="flex flex-col gap-y-[22px] mb-[22px]">
                <CheckoutInput
                  placeholder="Número de tarjeta"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <CheckoutInput
                  placeholder="Nombre en tarjeta"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                />
              </div>

              <div className="flex gap-x-[30px]">
                <CheckoutInput
                  placeholder="Vencimiento"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                />
                <CheckoutInput
                  placeholder="CCV"
                  value={ccv}
                  onChange={(e) => setCcv(e.target.value)}
                />
              </div>
              {payError !== "" && <ErrorDisplay text={payError} />}
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="296"
                  height="296"
                >
                  <path d="M32,236v-28h56v56H32V236L32,236z M80,236v-20H40v40h40V236L80,236z M48,236v-12h24v24H48V236L48,236z M104,260v-4h-8v-16h8v-24h8v-8H96v-8H64v-8h8v-8H56v16h-8v-8H32v-8h16v-16h-8v8h-8v-16h16v8h8v8h8v-8h8v8h16v-8h-8v-8H56v-8h24v-8H56v-8h-8v8H32v-24h8v8h48v-8h-8v-8H64v8h-8v-8H40V96h16v16h8v-8h16v-8h8v8h-8v8h8v8h8v-16h8v-8h-8V72h16v8h8v8h-8v8h8v48h-16v-8h-8v8h-8v8h-8v8h8v8h8v8h16v-8h-8v-8h-8v-8h16v16h8v-16h8v16h8v-24h8v-8h8v8h-8v8h8v8h24v-8h-8v-8h-8v-16h-8v-8h8v-8h8v-8h-8v-8h-8v16h-8v-8h-8v8h-8v-8h8v-8h-8V72h-8v-8h8v8h8V40h8v16h16v-8h-8V32h16v8h-8v8h16v-8h8v-8h16v24h-16v-8h-8v16h8v24h8v-8h8v40h16v-8h-8V96h16v24h16v-8h-8V96h8v16h8v-8h16v16h-8v-8h-8v8h-8v24h8v8h-8v8h-16v8h-8v8h-16v-8h-8v-8h-8v16h8v8h24v8h16v-8h-8v-8h8v-8h8v8h8v8h8v-16h-8v-8h16v24h-8v16h8v16h-8v24h8v8h-24v16h-24v-8h16v-8h-16v-16h-8v16h-8v8h8v8h-16v-24h-8v16h-8v-8h-8v-32h8v24h8v-24h8v-16h-8v-8h-8v-8h8v-8h-8v-8h-8v32h8v8h-16v16h-8v16h8v8h-8v8h16v8h-16v-8h-8v-8h-8v16h-32V260L104,260z M128,248v-8h8v-24h-16v8h8v8h-16v8h-8v8h8v8h16V248L128,248z M240,240v-8h8v-16h8v-8h-8v-24h-8v24h8v8h-8v8h-8v24h8V240L240,240z M200,236v-4h-8v8h8V236L200,236z M152,220v-4h-8v8h8V220L152,220z M224,212v-12h-24v24h24V212L224,212z M208,212v-4h8v8h-8V212L208,212z M144,204v-4h16v-8h-16v-8h-8v8h8v8h-16v-8h-8v8h-8v-8h-8v-8h-8v-8h-8v8h-8v8h8v-8h8v8h8v8h8v8h32V204L144,204z M120,180v-4h-8v8h8V180L120,180z M160,176v-8h-16v8h8v8h8V176L160,176z M208,164v-4h-8v8h8V164L208,164z M224,156v-4h8v-24h-8v8h-8v8h-8v-8h-16v-8h-8v-8h8V96h-8v-8h-8v-8h-8v8h-8V64h8v8h8v-8h-8v-8h-8v8h-8v24h8v8h8v-8h8v24h-8v8h-8v8h8v16h8v-8h16v8h8v8h16v8h8V156L224,156z M216,148v-4h8v8h-8V148L216,148z M88,140v-4h8v-8h-8v8h-8v8h8V140L88,140z M112,124v-4h-8v8h8V124L112,124z M112,84v-4h-8v8h8V84L112,84z M144,80v-8h-8v16h8V80L144,80z M192,44v-4h-8v8h8V44L192,44z M256,260v-4h8v8h-8V260L256,260z M256,144v-8h-8v-8h8v8h8v16h-8V144L256,144z M32,60V32h56v56H32V60L32,60zM80,60V40H40v40h40V60L80,60z M48,60V48h24v24H48V60L48,60z M208,60V32h56v56h-56V60L208,60z M256,60V40h-40v40h40V60L256,60zM224,60V48h24v24h-24V60L224,60z M96,60v-4h8v8h-8V60L96,60z M112,52v-4h-8V32h8v8h8v-8h8v8h-8v16h-8V52L112,52z" />
                </svg>
              </div>
            </>
          )}
        </CheckoutCard>
      </div>

      <HeadingBar text="Método de envío" />

      <div className="flex items-center h-[68px] bg-white px-[69px] text-2xl">
        <div className="flex items-center gap-x-[145px]">
          <div className="flex items-center gap-x-[17px]">
            <input
              type="radio"
              name="shippingMethod"
              id="shippingMethod1"
              value="Económico"
              checked={shippingMethod === "Económico"}
              onChange={(e) => setShippingMethod(e.target.value)}
            />
            <label htmlFor="shippingMethod1">Económico Aéreo - S/10.00</label>
          </div>
          <div className="flex items-center gap-x-[17px]">
            <input
              type="radio"
              name="shippingMethod"
              id="shippingMethod2"
              value="Prioritario"
              checked={shippingMethod === "Prioritario"}
              onChange={(e) => setShippingMethod(e.target.value)}
            />
            <label htmlFor="shippingMethod2">
              Envío prioritario (5 a 10 días) - S/ 17.00
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-x-[37px] justify-between items-center">
        <CheckoutCard className="h-[467px]" heading="Items en Pedido:">
          <div className="pl-[56px] pr-[17px] flex flex-col gap-y-[20px]">
            {cart.map((cartItem) => (
              <ItemInOrderItem key={cartItem.id} cartItem={cartItem} />
            ))}
          </div>
        </CheckoutCard>

        <CheckoutCard className="h-[467px]" heading="Resumen de Orden">
          <div className="pl-[78px]">
            <div className="flex flex-col text-2xl gap-y-[17px]">
              <SummaryOrderItem title="Subtotal" amount={subTotal} />
              <SummaryOrderItem title="Envío" amount={shipmentAmount} />
              <SummaryOrderItem title="Impuestos" amount={tax} />
              <SummaryOrderItem title="Total" amount={total} />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="mt-[87px] w-[381px] h-[60px] bg-slate-700 text-white text-2xl rounded-md"
              onClick={handleSubmit}
            >
              Completar Orden
            </button>
          </div>
        </CheckoutCard>
      </div>
    </main>
  );
}
