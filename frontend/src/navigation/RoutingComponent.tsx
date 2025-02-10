import { WithAnonymousUser } from "@/old/auth/WithAnonymousUser.tsx";
import { LoginPage } from "@/old/pages/login/LoginPage.tsx";
import { MainComponent } from "@/pages/MainComponent.tsx";
import { UploadFilePage } from "@/pages/UploadFile.tsx";
import mixpanel from "mixpanel-browser";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

export const RoutingComponent = () => {
    const location = useLocation();

    useEffect(() => {
        mixpanel.track_pageview({ page: location.pathname.split("/")[1] });
    }, [location]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/** PRIVATE **/}
            <Route
                path="*"
                element={
                    <WithAnonymousUser userType="anonymous">
                        <Routes>
                            <Route path="/" element={<UploadFilePage />} />
                            <Route path="/main" element={<MainComponent />} />
                        </Routes>
                    </WithAnonymousUser>
                }
            />
        </Routes>
    );
};
