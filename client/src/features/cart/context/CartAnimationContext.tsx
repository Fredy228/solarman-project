"use client";

import { ShoppingBasket } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

type FlyDot = {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

type CartAnimationContextValue = {
  triggerFly: (fromEl: HTMLElement) => void;
};

const CartAnimationContext = createContext<CartAnimationContextValue | null>(
  null,
);

export function useCartAnimation(): CartAnimationContextValue {
  const ctx = useContext(CartAnimationContext);
  if (!ctx)
    throw new Error(
      "useCartAnimation must be used within CartAnimationProvider",
    );
  return ctx;
}

export function CartAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dots, setDots] = useState<FlyDot[]>([]);
  const nextId = useRef(0);
  // Returns false on server, true on client — avoids SSR portal crash
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const triggerFly = useCallback((fromEl: HTMLElement) => {
    const cartEl = document.querySelector(
      "[data-cart-icon]",
    ) as HTMLElement | null;
    if (!cartEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = cartEl.getBoundingClientRect();

    const id = nextId.current++;
    setDots((prev) => [
      ...prev,
      {
        id,
        fromX: fromRect.left + fromRect.width / 2,
        fromY: fromRect.top + fromRect.height / 2,
        toX: toRect.left + toRect.width / 2,
        toY: toRect.top + toRect.height / 2,
      },
    ]);

    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
    }, 850);
  }, []);

  return (
    <CartAnimationContext.Provider value={{ triggerFly }}>
      {children}
      {mounted &&
        dots.length > 0 &&
        createPortal(
          dots.map((dot) => <FlyingIcon key={dot.id} dot={dot} />),
          document.body,
        )}
    </CartAnimationContext.Provider>
  );
}

function FlyingIcon({ dot }: { dot: FlyDot }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const icon = iconRef.current;
    if (!outer || !inner || !icon) return;

    const dx = dot.toX - dot.fromX;
    const dy = dot.toY - dot.fromY;
    const duration = 700;

    // X moves linearly
    outer.animate(
      [{ transform: "translateX(0px)" }, { transform: `translateX(${dx}px)` }],
      { duration, easing: "linear", fill: "forwards" },
    );

    // Y with ease-in creates the parabolic arc when combined with linear X:
    // the item initially drifts mostly sideways, then accelerates to target
    inner.animate(
      [{ transform: "translateY(0px)" }, { transform: `translateY(${dy}px)` }],
      { duration, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
    );

    // Icon: scale down and fade out as it reaches the cart
    icon.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1, offset: 0 },
        {
          transform: "translate(-50%, -50%) scale(0.85)",
          opacity: 1,
          offset: 0.75,
        },
        {
          transform: "translate(-50%, -50%) scale(0.2)",
          opacity: 0,
          offset: 1,
        },
      ],
      { duration, easing: "ease-in", fill: "forwards" },
    );
  }, [dot]);

  return (
    <div
      ref={outerRef}
      style={{
        position: "fixed",
        left: dot.fromX,
        top: dot.fromY,
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    >
      <div ref={innerRef} style={{ willChange: "transform" }}>
        <div
          ref={iconRef}
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            color: "var(--mui-palette-secondary-main, #e65100)",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
            willChange: "transform, opacity",
          }}
        >
          <ShoppingBasket size={26} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
