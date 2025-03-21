import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'

import mixpanel from 'mixpanel-browser'

import { FloatingMicButton } from '@/features/floating-mic'
import { WithAnonymousUser } from '@/navigation/WithAnonymousUser'
import { ActiveOrdersPage } from '@/pages/ActiveOrders'
import { AddInvoicePage } from '@/pages/AddInvoice/ui/AddInvoicePage'
import { InvoiceSummaryPage } from '@/pages/AddInvoice/ui/InvoiceSummaryPage'
import { AssistantPage } from '@/pages/AssistantPage'
import { Home } from '@/pages/Home.tsx'
import { MainComponent } from '@/pages/MainComponent.tsx'
import { PendingOrdersPage } from '@/pages/PendingOrders'
import { RecipeDetailsPage } from '@/pages/RecipeDetails/ui/RecipeDetailsPage'
import { RecipesPage } from '@/pages/Recipes/ui/RecipesPage'
import { SupplierManagementPage } from '@/pages/SupplierManagement'
import { SupplierDetailsPage } from '@/pages/SupplierManagement/ui/SupplierDetailsPage'
import { UploadFilePage } from '@/pages/UploadFile.tsx'

export const RoutingComponent = () => {
    const location = useLocation()

    useEffect(() => {
        mixpanel.track_pageview({ page: location.pathname.split('/')[1] })
    }, [location])

    return (
        <Routes>
            <Route path='/login' element={<div>Login</div>} />

            {/** PRIVATE **/}
            <Route
                path='*'
                element={
                    <WithAnonymousUser userType='anonymous'>
                        <Routes>
                            <Route
                                path='/'
                                element={
                                    <>
                                        <FloatingMicButton />
                                        <Outlet />
                                    </>
                                }
                            >
                                <Route path='/' element={<Home />} />
                                <Route path='/upload' element={<UploadFilePage />} />
                                <Route path='/main' element={<MainComponent />} />
                                <Route path='/assistant' element={<AssistantPage />} />
                                <Route path='/pending-orders' element={<PendingOrdersPage />} />
                                <Route path='/active-orders' element={<ActiveOrdersPage />} />
                                <Route path='/recipes' element={<RecipesPage />} />
                                <Route path='/recipes/:id' element={<RecipeDetailsPage />} />
                                <Route path='/supplier-management' element={<SupplierManagementPage />} />
                                <Route path='/supplier-management/:supplierId' element={<SupplierDetailsPage />} />
                                <Route
                                    path='/supplier-management/:supplierId/addInvoice'
                                    element={<AddInvoicePage />}
                                />
                                <Route
                                    path='/supplier-management/:supplierId/addInvoice/summary'
                                    element={<InvoiceSummaryPage />}
                                />
                            </Route>
                        </Routes>
                    </WithAnonymousUser>
                }
            />
        </Routes>
    )
}
