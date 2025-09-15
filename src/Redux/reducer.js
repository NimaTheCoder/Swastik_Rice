import {combineReducers} from 'redux';
import CounterSlice from './reducerSlice/CounterSlice';
import ProductSlice from './reducerSlice/ProductSlice';
import categorySlice from './reducerSlice/CategorySlice';
import AllActionSlice from './reducerSlice/AllactionSlice';
import AuthSlice from './reducerSlice/AuthSlice';
import CartSlicer from './reducerSlice/CartSlicer';
import ProductsOneSlice from './reducerSlice/getProductsOne';
import ProductsTowSlice from './reducerSlice/getProductsTwo';
import wishlistSlice from './reducerSlice/WishlistSlice';
import ViewAllProductsSlice from './reducerSlice/ViewAllProductsSlice';
import ProductByIdSlice from './reducerSlice/ProductByIdSlice';
import BannerImagesSlice from './reducerSlice/BannerSlice';
import SearchProductSlice from './reducerSlice/SearchProductSlice';
import ProfileSlice from './reducerSlice/ProfileSlice';
import AddressSlice from './reducerSlice/AddressSlice';
import OtherProductsSlice from './reducerSlice/OtherProductsSlice';
import ContactSlice from './reducerSlice/ContactUsSlice';
import DeleteAccountSlice from './reducerSlice/DeleteAccoutSlice';
import ProfileImageSlice from './reducerSlice/ProfileImageSlice';
import saveOrderSlice from './reducerSlice/saveOrderSlice';
import GetOrderAndReviewSlice from './reducerSlice/GetOrderAndReviewSlice';

const rootReducer = combineReducers({
  counter: CounterSlice,
  products: ProductSlice,
  cart: CartSlicer,
  category: categorySlice,
  allActionSLice: AllActionSlice,
  login: AuthSlice,
  productsOneSlice: ProductsOneSlice,
  productsTowSlice: ProductsTowSlice,
  wishlist: wishlistSlice,
  viewAllProducts: ViewAllProductsSlice,
  productDetails: ProductByIdSlice,
  bannerImages: BannerImagesSlice,
  searchProducts: SearchProductSlice,
  profile: ProfileSlice,
  address: AddressSlice,
  otherProduct: OtherProductsSlice,
  contactUs: ContactSlice,
  deleteAccount: DeleteAccountSlice,
  profileImage: ProfileImageSlice,
  saveOrder: saveOrderSlice,
  order: GetOrderAndReviewSlice,
});

export default rootReducer;
