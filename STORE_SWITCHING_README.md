# Store Switching Feature Documentation

## Overview

The Store Switching feature allows administrators who have access to multiple stores to seamlessly switch between them from within the dashboard. This feature provides a smooth user experience without requiring logout/login cycles.

## How It Works

### 1. **Store Switcher Component**
- Located in the dashboard navbar
- Only appears if the user has access to 2+ stores
- Shows current store name and provides a dropdown to select other stores

### 2. **Backend Requirements**
The feature expects a backend endpoint:
```
GET /auth/user-stores
Authorization: Bearer {token}
```

Response format:
```json
{
  "stores": [
    {
      "id": 1,
      "subdomain": "store1",
      "store_name": "Store One",
      "city": "New York",
      "status": "active"
    },
    {
      "id": 2,
      "subdomain": "store2", 
      "store_name": "Store Two",
      "city": "Los Angeles",
      "status": "active"
    }
  ]
}
```

### 3. **Data Flow**

#### Initial Login:
1. User logs in via `/Login`
2. Backend returns user info + associated stores
3. If multiple stores → show store selection modal
4. If single store → auto-select and proceed
5. Store info saved to localStorage

#### Store Switching:
1. User clicks store switcher in navbar
2. Component fetches available stores
3. User selects different store
4. localStorage updated with new store info
5. Custom `storeChanged` event dispatched
6. Dashboard components listen and refresh data
7. User sees notification confirming switch

### 4. **Local Storage Management**

The feature uses these localStorage keys:
- `subdomain`: The store's subdomain identifier
- `tenant_id`: The store's database ID
- `user`: User information (stored during login)

### 5. **Components Architecture**

```
StoreSwitcher.tsx          // Main switching component
├── useStoreSwitching.ts   // React hook for store management
├── StoreAwareWrapper.tsx  // HOC for pages that need store awareness
└── StoreSwitchNotification.tsx // Success notification
```

## Implementation Details

### **Files Added/Modified:**

1. **New Components:**
   - `app/Components/StoreSwitcher.tsx`
   - `app/Components/StoreSwitchNotification.tsx`
   - `app/Components/StoreAwareWrapper.tsx`

2. **New Hooks:**
   - `app/hooks/useStoreSwitching.ts`

3. **Modified Files:**
   - `app/Components/DashboardNavbar.tsx` - Added StoreSwitcher
   - `app/Dashboard/page.tsx` - Added store change listener
   - `app/Login/page.tsx` - Store user info for later use
   - `app/utils/auth.ts` - Added store management utilities
   - `app/layout.tsx` - Added notification component

### **Key Features:**

1. **Multi-tenant Data Isolation**: Each API request includes `x-tenant` header
2. **Real-time Updates**: Dashboard refreshes when store is switched
3. **Visual Feedback**: Notification shows successful store switch
4. **Persistent State**: Store selection persists across browser sessions
5. **Graceful Fallbacks**: Handles missing stores/permissions gracefully

### **Security Considerations:**

- Only shows stores the user has access to
- All API calls require authentication tokens
- Store switching doesn't bypass existing permissions
- No sensitive data exposed in localStorage

## Usage Examples

### **Basic Store Switching:**
```tsx
// Component automatically appears in navbar if user has multiple stores
<DashboardNavbar />
```

### **Custom Store Change Handling:**
```tsx
<StoreSwitcher onStoreSwitch={(store) => {
  console.log('Switched to:', store.store_name);
  // Custom logic here
}} />
```

### **Making Components Store-Aware:**
```tsx
<StoreAwareWrapper onStoreChange={(newTenant) => {
  // Refresh data for new store
  fetchDataForStore(newTenant);
}}>
  <YourComponent />
</StoreAwareWrapper>
```

### **Listening to Store Changes:**
```tsx
useEffect(() => {
  const handleStoreChange = (event: CustomEvent) => {
    const newStore = event.detail.store;
    // Handle store change
  };

  window.addEventListener('storeChanged', handleStoreChange);
  return () => window.removeEventListener('storeChanged', handleStoreChange);
}, []);
```

## API Requirements

### **Required Endpoint:**
```
GET /auth/user-stores
```

### **Headers:**
```
Authorization: Bearer {jwt_token}
Accept: application/json
```

### **Response:**
```json
{
  "stores": [
    {
      "id": number,
      "subdomain": string,
      "store_name": string,
      "city": string (optional),
      "status": string (optional)
    }
  ]
}
```

## Testing

### **Test Scenarios:**
1. User with single store - no switcher appears
2. User with multiple stores - switcher appears
3. Store switching updates all dashboard data
4. Notification appears on successful switch
5. Store context persists on page refresh
6. Error handling for failed API calls

### **Manual Testing:**
1. Login with multi-store account
2. Verify store switcher appears in navbar
3. Click switcher and select different store
4. Confirm notification appears
5. Verify dashboard data updates
6. Refresh page and confirm store context maintained

## Troubleshooting

### **Common Issues:**

1. **Store switcher not appearing:**
   - Check if user has multiple stores
   - Verify `/auth/user-stores` endpoint works
   - Check console for API errors

2. **Data not updating after switch:**
   - Verify components listen to `storeChanged` event
   - Check if `x-tenant` header is sent with API requests
   - Ensure localStorage is updated correctly

3. **Store context lost on refresh:**
   - Check if `subdomain` and `tenant_id` are in localStorage
   - Verify `getTenant()` function works correctly

### **Debug Tools:**

```javascript
// Check current store context
console.log('Current tenant:', localStorage.getItem('subdomain'));
console.log('Current tenant ID:', localStorage.getItem('tenant_id'));

// Manually trigger store change event
window.dispatchEvent(new CustomEvent('storeChanged', { 
  detail: { store: { id: 1, subdomain: 'test', store_name: 'Test Store' } } 
}));
```

## Future Enhancements

1. **Store Favorites**: Pin frequently used stores
2. **Recent Stores**: Quick access to recently switched stores
3. **Store Permissions**: Display user's role per store
4. **Store Status**: Show online/offline status
5. **Store Analytics**: Quick metrics in the switcher dropdown
