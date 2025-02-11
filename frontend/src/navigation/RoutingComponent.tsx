import { WithAnonymousUser } from "@/navigation/WithAnonymousUser";
import { MainComponent } from "@/pages/MainComponent.tsx";
import { UploadFilePage } from "@/pages/UploadFile.tsx";
import { Home } from "@/pages/Home.tsx";
import { AssistantPage } from "@/pages/AssistantPage";
import { RecipeReviewPage } from "@/pages/RecipeReview";
import { RecipeDetailsPage } from "@/pages/RecipeDetails/ui/RecipeDetailsPage";
import { PendingOrdersPage } from "@/pages/PendingOrders";
import { ActiveOrdersPage } from "@/pages/ActiveOrders";
import { InvoicePage } from "@/pages/Invoice";
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
                            <Route path="/pending-orders" element={<PendingOrdersPage />} />
                            <Route path="/active-orders" element={<ActiveOrdersPage />} />
                            <Route path="/recipe-review" element={<RecipeReviewPage />} />
                            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
                            <Route path="/invoice" element={<InvoicePage />} />
                        </Routes>
                    </WithAnonymousUser>
                }
            />
        </Routes>
    );
};
