import { createBrowserRouter } from "react-router";
import { AdminLayout } from "./components/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { ArtistsPage } from "./pages/ArtistsPage";
import { CatalogPage } from "./pages/CatalogPage";
import { AddTrackPage } from "./pages/AddTrackPage";
import { UploadPage } from "./pages/UploadPage";
import { FinancesPage } from "./pages/FinancesPage";
import { ContractsPage } from "./pages/ContractsPage";
import { PhysicalSalesPage } from "./pages/PhysicalSalesPage";
import { ArtistPortalPage } from "./pages/ArtistPortalPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "artists", Component: ArtistsPage },
      { path: "catalog", Component: CatalogPage },
      { path: "catalog/add", Component: AddTrackPage },
      { path: "upload", Component: UploadPage },
      { path: "finances", Component: FinancesPage },
      { path: "contracts", Component: ContractsPage },
      { path: "physical-sales", Component: PhysicalSalesPage },
      { path: "artist-portal/:artistId", Component: ArtistPortalPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
