# Staff Registration - Non-Mandatory Fields Specification & Documentation

**Date**: 2026-10-14  
**Summary**: Removed mandatory (`required`) constraints for Location, Address, and Documents in Staff Registration across Frontend and Backend.

---

## 1. Summary of Non-Mandatory Fields

The following fields in **Register Staff** (`/staff/register`) are now **completely optional (non-mandatory)**:

| Field Category | Fields Affected | Previous Status | Updated Status |
| :--- | :--- | :--- | :--- |
| **Location** | `zone`, `zoneRefId` (Region), `state`, `city`, `pincode` | Required in validation, and zone mandatory for SALES department | **Completely Optional** |
| **Address** | `address`, `country` | `required: true` in Mongoose schema & controller validation | **Completely Optional** (Default country fallback: "India") |
| **Documents** | `aadharCard`, `panCard`, `aadharCardImg`, `panCardImg` | Required in Yup schema for non-Superadmin roles | **Completely Optional** |

---

## 2. Technical Modifications

### Backend

#### 1. `src/models/Auth/Employee.js`
- **Address & Country**:
  - Changed `address`: `required: false`, `default: ""`
  - Changed `country`: `required: false`, `default: "India"`
  - Changed `pincode`: `default: ""`
- **Zone**:
  - Removed conditional required validator (`required: function() { return ['EMPLOYEE', 'SUPERVISOR', 'TEAMLEAD'].includes(this.EmployeeType) && dept === 'SALES'; }`)
  - Set `zone.name` and `zone.refId` defaults to `null`.
- **Documents**:
  - `aadharCard`, `panCard`, `aadharCardImg`, `panCardImg` are confirmed optional (`default: ""`).

#### 2. `src/core/controllers/Auth/Employee/EmployeeManagement.js`
- **`createEmployee`**:
  - Removed `!address` and `!country` from required fields check. Only fundamental identity/account fields remain required: `employeeType`, `username`, `employeeName`, `email`, `password`, `phone`.
  - Removed mandatory SALES department zone check:
    ```javascript
    // Removed:
    // if (['EMPLOYEE', 'SUPERVISOR', 'TEAMLEAD'].includes(employeeType.toUpperCase()) && department && department.toUpperCase() === 'SALES' && !zone) { ... }
    ```
  - Added safe fallbacks for optional fields in `userData`:
    - `address: address || ''`
    - `country: country || 'India'`
    - `pincode: pincode || ''`
    - `aadharCard: aadharCard || ''`
    - `panCard: panCard || ''`
    - `aadharCardImg: aadharCardImg || ''`
    - `panCardImg: panCardImg || ''`

---

### Frontend

#### 1. `src/pages/Registration.jsx`
- **Validation Schema (`validationSchema`)**:
  - `address`: Changed from `.required('Address is required')` to `.notRequired().nullable()`
  - `pincode`: Changed from `.required('Pincode is required')` to `.notRequired().nullable()`
  - `zoneRefId`: Changed from `.required('Zone is required for Sales department')` to `.notRequired().nullable()`
  - `aadharCard`: Changed from `.required('Aadhar Card image is required')` to `.notRequired().nullable()`
  - `panCard`: Changed from `.required('PAN Card image is required')` to `.notRequired().nullable()`
- **Form Submission (`onSubmit`)**:
  - Updated SALES zone hierarchy assignment to only bind if `values.zoneRefId` is selected by the user:
    ```javascript
    if (isSales && values.zoneRefId) {
        const selectedZone = (locationData.zones || []).find(z => z._id === values.zoneRefId);
        if (selectedZone) {
            payload.zone = selectedZone?.name || selectedZone?.zone || '';
            payload.zoneRefId = values.zoneRefId;
        }
    }
    ```
- **UI Labels & Indicators**:
  - Removed asterisk `*` from:
    - Address (`Address`)
    - Country (`Country`)
    - Region (`Region`)
    - State (`State`)
    - City (`City`)
    - Pincode (`Pincode`)
  - Changed document headings to explicit optional labels:
    - `Aadhar Card (Optional)`
    - `PAN Card (Optional)`
  - Replaced hardcoded required error messages with dynamic formik error messages.
