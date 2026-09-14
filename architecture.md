# Frontend architecture

JWT Pizza is a Vite-served React single-page application. React Router owns the URL and the application keeps the authenticated user in `App` state. The diagram below shows the main render, navigation, and data flows.

```mermaid
flowchart TD
    Start["Browser loads the app"] --> Bootstrap["index.tsx<br/>mount React inside BrowserRouter"]
    Bootstrap --> App["App<br/>owns the current user and routes"]

    App --> Auth["Check localStorage token<br/>and load the current user"]
    App --> Layout["Shared layout<br/>Header, Breadcrumb, Footer"]
    App --> Router["React Router selects a view<br/>from the current URL"]

    Router --> Public["Public pages<br/>Home, About, History, Docs"]
    Router --> AuthPages["Account pages<br/>Login, Register, Logout"]
    Router --> Diner["Diner pages<br/>Menu, Payment, Delivery, History"]
    Router --> Business["Business pages<br/>Franchise and Admin dashboards"]

    Auth --> UserState["User state in App"]
    UserState --> Navigation["Navigation is shown based<br/>on login state and role"]
    UserState --> Diner
    UserState --> Business

    AuthPages --> Service["pizzaService"]
    Diner --> Service
    Business --> Service
    Public --> Service

    Service --> Http["HttpPizzaService<br/>shared API client"]
    Http --> Token["localStorage token<br/>sent as Bearer token"]
    Http --> PizzaAPI["Pizza service API"]
    Http --> FactoryAPI["Pizza factory API<br/>used for JWT verification"]

    Diner --> OrderFlow["Main customer flow"]
    OrderFlow --> Menu["Menu loads pizzas and stores"]
    Menu --> Payment["User selects pizzas<br/>and checks out"]
    Payment --> LoginRequired{"Logged in?"}
    LoginRequired -->|No| AuthPages
    LoginRequired -->|Yes| PizzaAPI
    PizzaAPI --> Delivery["Delivery displays the order<br/>and returned JWT"]
    Delivery --> FactoryAPI

    Business --> Management["Create and close franchises<br/>and stores"]
    Management --> PizzaAPI
```

## Key implementation details

- `index.tsx` mounts `App` inside `BrowserRouter`; `App` defines the route table and renders the shared header, breadcrumb, main content, and footer.
- `App` loads the current user once on startup. Navigation visibility is constrained by login state and roles, while `AdminDashboard` also checks the admin role before rendering its content.
- Views communicate through React Router location state for transient data such as an order, JWT confirmation, or the franchise/store being edited. `useBreadcrumb` returns to the parent path after management actions.
- All API calls go through `pizzaService` (`service.ts`), whose current implementation is `HttpPizzaService`. It adds JSON headers, cookies, and a `Bearer` token from `localStorage`, then delegates to the configured service or factory API.
- The primary customer journey is `Menu → Payment → Delivery`; payment requires a logged-in user, and delivery can send the returned JWT to the factory API for verification.
