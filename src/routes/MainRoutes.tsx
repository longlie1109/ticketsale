import React from "react";
import { Routes, Route } from "react-router-dom";
import Caidat from "../components/Caidat";
import Doisoatve from "../components/Doisoatve";
import InnerIndex from "../components/InnerIndex";
import Quanlyve from "../components/Quanlyve";
import Trangchu from "../components/Trangchu";
const MainRoutes = () => {
    return <div>
        <Routes>
            <Route path="/" element={<Trangchu/>}>
                <Route index element={<InnerIndex/>}/>
                <Route path="doisoatve" element={<Doisoatve />} />
                <Route path="quanlyve" element={<Quanlyve />} />
                <Route path="caidat" element={<Caidat />} />
            </Route>
        </Routes>
    </div>
}
export default MainRoutes;