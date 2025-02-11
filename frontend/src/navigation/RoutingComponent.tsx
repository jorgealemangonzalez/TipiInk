import { WithAnonymousUser } from "@/navigation/WithAnonymousUser";
import { MainComponent } from "@/pages/MainComponent.tsx";
import { UploadFilePage } from "@/pages/UploadFile.tsx";
import { Home } from "@/pages/Home.tsx";
import { AssistantPage } from "@/pages/AssistantPage";
import mixpanel from "mixpanel-browser";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PendingOrders } from '@/pages/PendingOrders'

export const RoutingComponent = () => {
    const location = useLocation();

    useEffect(() => {
        mixpanel.track_pageview({ page: location.pathname.split("/")[1] });
    }, [location]);

    return (
        <Routes>
            <Route path="/login" element={<div>Login</div>} />

            {/** PRIVATE **/}
            <Route
                path="*"
                element={
                    <WithAnonymousUser userType="anonymous">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/upload" element={<UploadFilePage />} />
                            <Route path="/main" element={<MainComponent />} />
                            <Route path="/assistant" element={<AssistantPage />} />
                            <Route path="/pending-orders" element={<PendingOrders />} />
                        </Routes>
                    </WithAnonymousUser>
                }
            />
        </Routes>
    );
};
