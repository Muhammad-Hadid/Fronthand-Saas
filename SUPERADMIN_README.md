# Super Admin Dashboard

A comprehensive Super Admin dashboard for managing inventory stores, monitoring stock movements, and analyzing business performance.

## Features

### 🏠 Dashboard Overview
- **Real-time Statistics**: Total stores, stock movements, and activity metrics
- **Quick Actions**: Fast access to common administrative tasks
- **Recent Activity**: Live feed of latest stock movements
- **Store Status Overview**: Visual representation of store performance

### 🏪 Store Management
- **Complete CRUD Operations**: Create, read, update, and delete stores
- **Advanced Search & Filtering**: Find stores by name, admin, city, or status
- **Detailed Store Information**: Contact details, addresses, and operational status
- **Bulk Operations**: Manage multiple stores efficiently

### 📊 Stock Overview
- **Movement Tracking**: Monitor all stock in/out operations across stores
- **Advanced Filtering**: Filter by date range, store, and movement type
- **Performance Metrics**: Track stock trends and identify patterns
- **Real-time Updates**: Live data synchronization
- **Export Functionality**: Download reports for analysis

### 📈 Analytics Dashboard
- **Interactive Charts**: Line charts, bar charts, and pie charts for data visualization
- **Store Performance**: Compare performance across different stores
- **Trend Analysis**: Identify patterns and growth opportunities
- **Movement Distribution**: Understand stock flow patterns
- **Top Products**: Track most active products by movement

## API Endpoints

### Authentication
```
POST /superadmin/login
```

### Store Management
```
GET    /api/getAllStores          # Get all stores
GET    /api/getStoreById/{id}     # Get store by ID
POST   /api/createStore           # Create new store
PUT    /api/updateStore/{id}      # Update store
DELETE /api/deleteStore/{id}      # Delete store
```

### Stock Overview
```
GET /stockoverview/getAllStockMovements         # Get all stock movements
GET /stockoverview/getStoreStockMovements/{id}  # Get store-specific movements
GET /stockoverview/getStockOverviewSummary      # Get summary statistics
```

## Data Models

### Store
```typescript
interface Store {
  id: number;
  store_name: string;
  admin_name: string;
  email: string;
  contact_info: string;
  cnic: string;
  store_address: string;
  city: string;
  subdomain: string;
  user_id: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Stock Movement
```typescript
interface StockMovement {
  id: number;
  store_id: number;
  product_id: number;
  movement_type: 'in' | 'out';
  quantity_changed: number;
  previous_quantity: number;
  new_quantity: number;
  movement_date: string;
  reference_type: string;
  reference_id: number;
  store: {
    id: number;
    store_name: string;
    city: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
  };
}
```

## File Structure

```
app/
├── Superadmin/
│   ├── Dashboard/
│   │   └── page.tsx              # Main dashboard page
│   ├── Stores/
│   │   └── page.tsx              # Store management page
│   ├── Overview/
│   │   └── page.tsx              # Stock overview page
│   ├── Analytics/
│   │   └── page.tsx              # Analytics dashboard page
│   └── Login/
│       └── page.tsx              # Super admin login
├── Components/
│   ├── SuperadminNavbar.tsx      # Navigation header
│   ├── SuperadminSidebar.tsx     # Side navigation
│   ├── DashboardOverview.tsx     # Dashboard main content
│   ├── StoreManagement.tsx       # Store CRUD operations
│   ├── StockOverview.tsx         # Stock monitoring
│   └── AnalyticsDashboard.tsx    # Analytics and charts
├── hooks/
│   └── useSuperAdminData.ts      # Custom hooks for data management
└── lib/
    └── api.ts                    # API utilities
```

## Technologies Used

- **Next.js 15**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **SWR**: Data fetching and caching
- **Recharts**: Data visualization library
- **Lucide React**: Icon library
- **js-cookie**: Cookie management

## Usage

### Accessing the Dashboard
1. Navigate to `/Superadmin/Login`
2. Login with super admin credentials
3. Access dashboard at `/Superadmin/Dashboard`

### Managing Stores
1. Go to **Stores** section from sidebar
2. Use **Add New Store** button to create stores
3. Use search and filters to find specific stores
4. Click actions (view, edit, delete) for store operations

### Monitoring Stock
1. Visit **Stock Overview** section
2. Use date range picker to filter data
3. Apply store and movement type filters
4. View detailed movement history with pagination

### Analyzing Performance
1. Access **Analytics** section
2. Select date range for analysis
3. View charts for trends and distributions
4. Export data for further analysis

## Key Features

### Real-time Data
- All data is fetched in real-time using SWR
- Automatic revalidation ensures fresh data
- Loading states provide smooth user experience

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements

### Performance Optimized
- Efficient data fetching with SWR caching
- Lazy loading for large datasets
- Optimized chart rendering with Recharts

### User Experience
- Intuitive navigation with clear visual hierarchy
- Consistent design patterns across all pages
- Comprehensive error handling and loading states

## Security Features

- JWT token-based authentication
- Automatic token refresh handling
- Secure API communication
- Role-based access control

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced reporting features
- [ ] Data export in multiple formats
- [ ] Advanced filtering options
- [ ] Dashboard customization
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app integration

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API server running on port 4000

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## API Requirements

Ensure your backend supports:
- CORS configuration for frontend origin
- JWT authentication for super admin role
- All the API endpoints listed above
- Proper error handling and status codes

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Add proper error handling
5. Update documentation for new features
