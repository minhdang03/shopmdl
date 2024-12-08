import {Route, Routes} from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Checkout from "./pages/checkout";
import Confirmation from "./pages/confirmation";

export default function PageRoutes(){
	return (
		<Routes>
			<Route path={'/'} element={<Layout/>}>
				<Route index element={<Home/>} />
				<Route path={'checkout'} element={<Checkout/>} />
				<Route path={'confirmation'} element={<Confirmation/>} />
				<Route path={'*'} element={<NotFound/>} />
			</Route>
		</Routes>
	)
}
