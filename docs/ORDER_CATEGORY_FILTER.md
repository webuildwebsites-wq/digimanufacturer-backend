# Order Category Filter - Removal of Sunglass & Frame

**Date**: 2026-10-14  
**Summary**: Removed 'Frame' and 'Sunglass' options from Category dropdown in Create Order (`/new-order`) across both Backend and Frontend.

---

## 1. Summary of Changes

In the **Create Order** (`OrderWizard`) module:
- The categories **`FRAME` / `Frames`** and **`SUNGLASS` / `Sunglasses`** have been removed from the category dropdown options.
- The remaining operational categories available in the dropdown are: **`LENS`**, **`CONTACT LENS`**, **`SOLUTION`**, etc.

---

## 2. Technical Modifications

### Backend
- **File**: `src/core/services/order/order.service.js`
- **Function**: `getProductCategoriesService`
- **Change**: Added regex exclusion to match query:
  ```javascript
  const match = {
    category: {
      $nin: [null, ""],
      $not: /^(frame|frames|sunglass|sunglasses)$/i,
    },
  };
  ```
  Endpoint `GET /api/order/product-fields/category` now strictly excludes Frame and Sunglass categories.

---

### Frontend
1. **`src/services/orderService.js`**:
   - `getOrderProductConfigs()`: Added `filterOutFrameAndSunglass` filter on `category` array before returning config options.
   - `getCategoriesByBrand()`: Filtered out Frame and Sunglass from the returned brand category list.

2. **`src/pages/OrderWizard.jsx`**:
   - Sanitized `configs.category` in `fetchInitialData`.
   - Added exclusion filters on Category dropdowns:
     - SearchableSelect (Advanced mode)
     - Table rows (Bulk mode)
     - Mobile card view
     - Prevented legacy prefill/draft injection of excluded categories into the dropdown.

3. **`src/components/ui/OrderLensRangeModal.jsx`**:
   - Filtered out Frame and Sunglass from the modal's category select options.
