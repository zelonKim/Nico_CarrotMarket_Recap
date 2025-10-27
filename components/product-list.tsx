"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/action";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);

  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);

  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];

        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);

          const newProducts = await getMoreProducts(page);

          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            //setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }

          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className=" flex flex-col mb-16">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}

      {!isLastPage ? (
        <span
          ref={trigger}
          className="text-sm text-center text-neutral-400 font-semibold  w-fit mx-auto px-3 py-2 "
        >
          {/* {isLoading ? (
            <ArrowPathIcon className="size-6 animate-spin" />
          ) : (
            <ArrowPathIcon className="size-6 " />
          )} */}
        </span>
      ) : null}
    </div>
  );
}
