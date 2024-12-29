import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

  useEffect(() => {
    const totalPrice = window.localStorage.getItem("totalPrice");
    const totalQuantities = window.localStorage.getItem("totalQuantities");
    const cartItems = window.localStorage.getItem("cartItems");

    if (totalPrice !== null) {
      setTotalPrice(totalPrice);
    }
    if (totalQuantities !== null) {
      setTotalQuantities(Number(totalQuantities));
    }
    if (cartItems !== null) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("totalPrice", totalPrice);
    window.localStorage.setItem("totalQuantities", totalQuantities);
    window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [totalPrice, totalQuantities, cartItems]);

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice((prevTotalPrice) =>
      Number(Number(prevTotalPrice) + Number(product.price) * quantity).toFixed(
        2
      )
    );

    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        } else {
          return { ...cartProduct };
        }
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice((prevTotalPrice) =>
      Number(
        Number(prevTotalPrice) -
          Number(foundProduct.price) * foundProduct.quantity
      ).toFixed(2)
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  const toggleCartItemQuanitity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      foundProduct.quantity = foundProduct.quantity + 1;
      newCartItems.splice(index, 0, foundProduct);

      setCartItems([...newCartItems]);
      setTotalPrice((prevTotalPrice) =>
        Number(Number(prevTotalPrice) + Number(foundProduct.price)).toFixed(2)
      );
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        foundProduct.quantity = foundProduct.quantity - 1;
        newCartItems.splice(index, 0, foundProduct);

        setCartItems([...newCartItems]);
        setTotalPrice((prevTotalPrice) =>
          Number(Number(prevTotalPrice) - Number(foundProduct.price)).toFixed(2)
        );
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
