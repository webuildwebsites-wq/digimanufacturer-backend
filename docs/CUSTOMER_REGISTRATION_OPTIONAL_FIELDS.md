# Customer Registration - Non-Mandatory Fields Specification & History

**Date**: 2026-10-14  
**Requested by**: User  
**Summary**: Removed mandatory validation for 6 key customer registration fields across Frontend and Backend.

---

## 1. Summary of Removed Mandates

The following fields are now **strictly optional (non-mandatory)** in customer registration and updates:

| Field Name | Description | Previous Status | Updated Status |
| :--- | :--- | :--- | :--- |
| **GST Number & Document** (`gstNumber`, `gstCertificateImg`) | GST number and uploaded GST certificate | Mandatory when Registered | **Optional** |
| **PAN & Document** (`panCard`, `panCardImg`) | PAN card number and photo/PDF upload | Mandatory when Unregistered | **Optional** |
| **AADHAR & Document** (`aadharCard`, `aadharCardImg`) | Aadhaar card number and photo/PDF upload | Mandatory when Unregistered | **Optional** |
| **Assign Brands** (`brands`, `brandCategories`) | Brands assigned to customer | Labeled with asterisk `*` | **Optional** |
| **Currently Deals Brands** (`currentlyDealtBrands`) | Existing brands customer trades in | Optional | **Confirmed Optional** |
| **Bank Cheques** (`chequeDetails`, `chequeRemark`) | 3 Blank cheques & submission remark | Required exactly 3 or mandatory remark | **Completely Optional** |
| **Zone** (`zone`, `zoneRefId`) | Operational / sales location zone | Required in validation & steps | **Optional** |

---

## 2. Changes Made by File

### Backend

#### 1. `src/models/Auth/Customer.js`
- **Documentation Fields**: Changed `required: function() { return this.isGSTRegistered === ...; }` to `required: false` on:
  - `gstNumber`
  - `gstCertificateImg`
  - `panCard`
  - `aadharCard`
  - `panCardImg`
  - `aadharCardImg`
  - `gstType` (`required: false`)
  - `isGSTRegistered` (`default: false`)
- **Cheque Validation**: Removed Mongoose array validator forcing `value.length === 3`. Now accepts any number of cheques (0, 1, 2, 3...) without validation rejection.

#### 2. `src/models/Auth/CustomerDraft.js`
- Added `brands` array schema (`brandId`, `brandName`) matching `Customer.js`.
- Confirmed `chequeDetails`, `currentlyDealtBrands`, `panCard`, `aadharCard`, `gstNumber`, `zone` are not required.

#### 3. `src/core/controllers/Auth/Customers/CustomerAuth.js`
- **`customerBasicRegistration`**:
  - Removed block requiring `gstNumber`, `gstCertificateImg`, `panCard`, `aadharCard`, `panCardImg`, `aadharCardImg`.
  - Removed requirement of exactly 3 entries in `chequeDetails`.
  - Removed requirement of `chequeRemark` when cheques are not provided.
  - Removed `zoneRefId` and `gstTypeRefId` from `requiredRefIds` list.
  - Made `zoneRefId` and `gstTypeRefId` validation conditional (validated only if provided).
  - Made `firmName` gracefully fallback to `shopName` if not provided so it doesn't block registration.
- **`updateCustomerProfile`**:
  - Added support for updating `brands`, `chequeDetails`, and `chequeRemark`.

#### 4. `src/core/controllers/Auth/Customers/darft.customers.controller.js`
- **`customerDraftRegistration`**:
  - Added `brands` saving to draft.
- **`updateDraftCustomer`**:
  - Added `brands`, `chequeDetails`, and `chequeRemark` to `updateFields`.

---

### Frontend

#### 1. `src/pages/RegisterCustomer.jsx`
- **Yup `validationSchema`**:
  - `gstNumber`: Changed from `.required()` to `.nullable().notRequired()`. Format validation only executes if a value is entered.
  - `aadharCard`: Changed from `.required()` to `.nullable().notRequired()`. Format validation only executes if a value is entered.
  - `panCard`: Changed from `.required()` to `.nullable().notRequired()`. Format validation only executes if a value is entered.
  - `zoneRefId`: Changed from `.required('Zone is required')` to `.nullable().notRequired()`.
- **`isStepValid`**:
  - Step 0 (Firm/Company Details): Removed requirement for `gstNumber`, `gstCertificateImg`, `aadharCard`, `aadharCardImg`, `panCard`, `panCardImg`.
  - Step 3 (Contact Information): Removed `zoneRefId` from required step fields (`contactFields`).
- **`getFieldsForStep`**:
  - Step 0: Removed `gstNumber`, `gstCertificateImg`, `aadharCard`, `aadharCardImg`, `panCard`, `panCardImg`.
  - Step 3: Removed `zoneRefId`.
- **`draftPayload`**:
  - Added `brands` mapping to payload when saving drafts.

#### 2. `src/components/CustomerRegistration/FirmCompanyDetails.jsx`
- Changed label `GST Number*` -> `GST Number`.
- Changed label `Aadhar Card No.*` -> `Aadhar Card No.`.
- Changed label `PAN Card No.*` -> `PAN Card No.`.

#### 3. `src/components/CustomerRegistration/BusinessInformation.jsx`
- Changed label `Assigned Brands*` -> `Assigned Brands`.
- Changed header `3 Blank Cheques` -> `Blank Cheques (Optional)`.
- Changed description `Please provide 3 blank cheques or state the reason.` -> `Optional - Provide blank cheques if available.`.
- Changed label `Remark (If Cheques Not Submitted)` -> `Cheque Remarks (Optional)`.

#### 4. `src/components/CustomerRegistration/ContactInformation.jsx`
- Changed label `Zone*` -> `Zone`.

#### 5. `src/components/CustomerRegistration/CustomerInfo.jsx` & `CustomerRegn.jsx`
- Removed asterisks from `GST Number`, `Aadhar Card No.`, `PAN Card No.`, `Brand Selection`, and `Zone`.
