import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// type StoreState = {
//   products: Product[];
//   series: Serie[];

//   setProducts: (products: Product[]) => void;
//   setSeries: (series: Serie[]) => void;

//   filteredProducts: Product[];
//   setFilteredProducts: (word: string) => void;
//   orderFilteredProductsByPrice: () => void;
//   orderFilteredProductsByBrand: () => void;

//   selectedProduct: Product;
//   setSelectedProduct: (product: Product) => void;

//   cart: CartItem[];
//   addToCart: (newCartItem: CartItem) => void;
//   deleteToCart: (cartItem: CartItem) => void;
//   clearCart: () => void;
//   changeQuantity: (cartItem: CartItem, quantity: number) => void;

//   savedItems: CartItem[];
//   addToSavedItems: (newSavedItem: CartItem) => void;
//   deleteToSavedItems: (cartItem: CartItem) => void;
//   changeQuantitySavedItems: (savedItem: CartItem, quantity: number) => void;

//   orderedItems: OrderItem[];
//   addToOrderedItems: (newOrderedItem: OrderItem) => void;

//   users: User[];
//   addToUsers: (newUser: User) => void;

//   currentUser: User;
//   setCurrentUser: (user: User) => void;
//   logoutCurrentUser: () => void;
// };

export const useStore = create()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,

        setCurrentUser: (user) => {
          set(() => ({
            currentUser: user,
          }));
        },

        products: [],

        setProducts: (products) => {
          set(() => ({
            products,
          }));
        },

        series: [],

        setSeries: (series) => {
          set(() => ({
            series,
          }));
        },

        addToUsers: (newUser) => {
          set(() => ({
            users: [...get().users, newUser],
          }));
        },

        logoutCurrentUser: () => {
          set(() => ({
            currentUser: {},
          }));
        },

        addToOrderedItems: (newOrderedItem) => {
          set(() => ({
            orderedItems: [...get().orderedItems, newOrderedItem],
          }));
        },
        savedItems: [],
        addToSavedItems: (newSavedItem) => {
          set(() => ({
            savedItems: [...get().savedItems, newSavedItem],
          }));
        },
        deleteToSavedItems: (savedItemSelected) => {
          set(() => ({
            savedItems: get().savedItems.filter(
              (savedItem) => savedItem.id !== savedItemSelected.id
            ),
          }));
        },

        filteredProducts: [],
        cart: [],
        setFilteredProducts: (word) => {
          set((state) => ({
            filteredProducts: state.products.filter(
              (product) =>
                product.name.toLowerCase().includes(word.toLowerCase()) ||
                product.brand.toLowerCase().includes(word.toLowerCase())
            ),
          }));
        },
        orderFilteredProductsByPrice: () => {
          set((state) => ({
            filteredProducts: [...state.filteredProducts].sort(
              (a, b) => b.price - a.price
            ),
          }));
        },
        orderFilteredProductsByBrand: () => {
          set((state) => ({
            filteredProducts: [...state.filteredProducts].sort((a, b) => {
              if (a.brand < b.brand) {
                return -1;
              } else if (a.brand > b.brand) {
                return 1;
              } else {
                return 0;
              }
            }),
          }));
        },

        selectedProduct: {},

        setSelectedProduct: (product) => {
          set(() => ({
            selectedProduct: product,
          }));
        },

        addToCart: (newCartItem) => {
          let updatedCart = [];
          const index = get().cart.findIndex(
            (cartItem) => cartItem.id === newCartItem.id
          );
          if (index === -1) {
            updatedCart = [...get().cart, newCartItem];
          } else {
            updatedCart = [...get().cart];
            updatedCart[index].quantity += newCartItem.quantity;
          }

          set(() => ({
            cart: updatedCart,
          }));
        },

        deleteToCart: (cartItemSelected) => {
          set(() => ({
            cart: get().cart.filter(
              (carItem) => carItem.id !== cartItemSelected.id
            ),
          }));
        },

        clearCart: () => {
          set(() => ({
            cart: [],
          }));
        },

        changeQuantity: (cartItemSelected, quantity) => {
          let updatedCart = [];
          const index = get().cart.findIndex(
            (cartItem) => cartItem.id === cartItemSelected.id
          );
          updatedCart = [...get().cart];
          updatedCart[index].quantity = quantity;
          set(() => ({
            cart: updatedCart,
          }));
        },

        changeQuantitySavedItems: (savedItemSelected, quantity) => {
          let updatedSavedItems = [];
          const index = get().savedItems.findIndex(
            (savedItem) => savedItem.id === savedItemSelected.id
          );
          updatedSavedItems = [...get().savedItems];
          updatedSavedItems[index].quantity = quantity;
          set(() => ({
            savedItems: updatedSavedItems,
          }));
        },
      }),
      { name: "ulima-store-storage" }
    )
  )
);
