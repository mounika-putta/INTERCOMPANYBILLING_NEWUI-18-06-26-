import React, { useState, useEffect, useRef } from "react";
import { AxiosInstance } from "../../services/api";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.css";
import "./InventoryItem.css";
import Button from "../../components/Common/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanieswithdeactivestatus } from '../../redux/CustomerSlice';
import HelpModal from "../../components/Common/HelpModal";
import { allowAlphaNumeric, isAlphaNumeric } from "../../validations/InputValdation";
import Pagination from "../../components/Common/Pagination";
import { FiCheck, FiX } from "react-icons/fi";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { FaEdit, FaTrash } from "react-icons/fa";

const InventoryItem = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [showCreateScreen, setShowCreateScreen] = useState(false);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isDownloadingCsvTemplate, setIsDownloadingCsvTemplate] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const companyList = useSelector((state) => state.Customers.companieslist);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchCompanieswithdeactivestatus());
      } catch (err) {
        console.error("Error fetching customers/companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const [newItem, setNewItem] = useState({
    ItemName: "",
    Description: "",
    Currency: "",
    Price: "",
    ItemCode: "",
    Quantity: "",
    UnitOfMeasure: "",
    Discount: "",
    TaxRate: "",
    TaxAmount: "",
    SubTotal: "",
    Total: "",
    MeterTypeId: "",
    Category: "",
    VatableStatus: false,
  });

  const [editItem, setEditItem] = useState({
    Id: "",
    ItemName: "",
    Description: "",
    Currency: "",
    PriceDisplay: "",
    ItemCode: "",
    Quantity: "",
    UnitOfMeasure: "",
    Discount: "",
    TaxRate: "",
    TaxAmount: "",
    SubTotal: "",
    Total: "",
    IsActive: "",
    IsDeleted: "",
    MeterTypeId: "",
    Category: "",
    VatableStatus: ""
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const finalValue = type === "checkbox" ? checked : value;

    let updatedItem = { ...newItem, [name]: finalValue };

    if (name === "Category") {
      if (finalValue.trim().toLowerCase() === "service rendered") {
        updatedItem.Quantity = 0;
      } else {
        updatedItem.Quantity = "";
      }
    }

    const textFields = ["ItemName", "Description", "UnitOfMeasure"];
    if (type !== "checkbox" && textFields.includes(name)) {
      const regex = /^[a-zA-Z0-9\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    const quantity = parseFloat(updatedItem.Quantity) || 0;
    const price = parseFloat(updatedItem.Price) || 0;
    const taxRate = parseFloat(updatedItem.TaxRate) || 0;

    const subTotal = quantity * price;
    const taxAmount = (subTotal * taxRate) / 100;
    const total = subTotal + taxAmount;

    updatedItem.SubTotal = subTotal.toFixed(2);
    updatedItem.TaxAmount = taxAmount.toFixed(2);
    updatedItem.Total = total.toFixed(2);

    setNewItem(updatedItem);

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleEditChange = (e) => {
    debugger
    const { name, type, value, checked } = e.target;

    let updatedItem = {
      ...editItem,
      [name]: type === "checkbox" ? checked : value
    };

    if (name === "Category") {
      if (value.trim().toLowerCase() === "service rendered") {
        updatedItem.Quantity = 0;
      } else {
        updatedItem.Quantity = "";
      }
    }

    const textFields = ["ItemName", "Description", "UnitOfMeasure"];
    if (textFields.includes(name)) {
      const regex = /^[a-zA-Z0-9\s]*$/;
      if (!regex.test(value)) return;
    }

    const quantity = parseFloat(updatedItem.Quantity) || 0;
    const price = parseFloat(updatedItem.Price) || 0;
    const taxRate = parseFloat(updatedItem.TaxRate) || 0;

    const subTotal = quantity * price;
    const taxAmount = (subTotal * taxRate) / 100;
    const total = subTotal + taxAmount;

    updatedItem.SubTotal = subTotal.toFixed(2);
    updatedItem.TaxAmount = taxAmount.toFixed(2);
    updatedItem.Total = total.toFixed(2);

    setEditItem(updatedItem);
  };

  useEffect(() => {
    GetTaxes()
    fetchCurrency()
    fetchMeterType()
    fetchItems()
    fetchCategories()
  }, []);

  const [currencies, setCurrencies] = useState([]);

  const fetchCurrency = async () => {
    try {
      const response = await AxiosInstance.get("/api/InventoryItems/GetCurrencies");
      console.log("Currency data", response.data);
      setCurrencies(response.data.data);
      if (response.data.success) { }
    } catch (error) {
      console.error("Error fetching ", error);
      alertify.alert('Error', "Failed to load");
    } finally { }
  };

  const [taxes, setTaxes] = useState([]);
  const [meterType, setMeterType] = useState([]);
  const [categories, setcategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await AxiosInstance.get("/api/InventoryItems/GetCategories");
      console.log("categories", response.data);
      setcategories(response.data.data);
      if (response.data.success) { }
    } catch (error) {
      console.error("Error fetching ", error);
      alertify.alert('Error', "Failed to load");
    } finally { }
  };

  const GetTaxes = async () => {
    try {
      const response = await AxiosInstance.get("/api/InventoryItems/GetTaxes");
      console.log("Tax data", response.data);
      if (response.data.success && response.data.data.length > 0) {
        setTaxes(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching ", error);
      alertify.alert('Error', "Failed to load");
    }
  };

  const fetchMeterType = async () => {
    try {
      const response = await AxiosInstance.get("/api/InventoryItems/GetMeterTypes");
      console.log("Meter data", response.data);
      setMeterType(response.data.data);
      if (response.data.success) { }
    } catch (error) {
      console.error("Error fetching ", error);
      alertify.alert('Error', "Failed to load");
    } finally { }
  };

  const fetchItems = async () => {
    try {
      const response = await AxiosInstance.get("/api/InventoryItems/GetTotalInventoryItems");
      console.log("inventory items", response);
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      alertify.alert('Error', "Error fetching inventory items.");
    } finally {
      setLoading(false);
    }
  };

  const [filters, setFilters] = useState({
    ItemName: "",
    Description: "",
    itemCode: "",
    Price: "",
    Category: "",
  });
  const [tempFilters, setTempFilters] = useState({
    ItemName: "",
    itemCode: "",
    Description: "",
    Price: "",
    Category: "",
  });

  const applyFilter = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
  };

  const filteredInvoices = items.filter((invoice) => {
    return (
      (filters.Category === "" ||
        invoice.category?.toLowerCase().includes(filters.Category.toLowerCase())) &&
      (filters.ItemName === "" ||
        invoice.itemName?.toLowerCase().includes(filters.ItemName.toLowerCase())) &&
      (filters.Description === "" ||
        invoice.description?.toLowerCase().includes(filters.Description.toLowerCase())) &&
      (filters.itemCode === "" ||
        invoice.itemCode?.toLowerCase().includes(filters.itemCode.toLowerCase())) &&
      (filters.Price === "" ||
        invoice.price?.toString().includes(filters.Price))
    );
  });

  const [editErrors, setEditErrors] = useState({});

  const validateEditForm = () => {
    debugger
    const editErrors = {};
    const safeTrim = (value) => (value !== null && value !== undefined ? value.toString().trim() : "");

    if (!safeTrim(editItem.ItemName)) editErrors.ItemName = "Item Name is required";
    if (!safeTrim(editItem.Description)) editErrors.Description = "Description is required";
    if (!safeTrim(editItem.PriceDisplay)) editErrors.PriceDisplay = "Price is required";
    if (!safeTrim(editItem.ItemCode)) editErrors.ItemCode = "Item Code is required";
    if (!safeTrim(editItem.UnitOfMeasure)) editErrors.UnitOfMeasure = "Unit of Measure is required";
    if (!safeTrim(editItem.Category)) editErrors.Category = "Category is required";

    if (editItem.Discount === 0 || editItem.Discount === null || editItem.Discount === undefined || editItem.Discount === "")
      editErrors.Discount = "Company is required";

    if (editItem.IsActive === null || editItem.IsActive === undefined || editItem.IsActive === "")
      editErrors.IsActive = "IsActive is required";

    if (editItem.IsDeleted === null || editItem.IsDeleted === undefined || editItem.IsDeleted === "")
      editErrors.IsDeleted = "IsDeleted is required";

    setEditErrors(editErrors);
    return Object.keys(editErrors).length === 0;
  };

  useEffect(() => {
    Object.keys(editItem).forEach((key) => {
      if (editItem[key] && editErrors[key]) {
        setEditErrors((prev) => ({ ...prev, [key]: "" }));
      }
    });
  }, [editItem]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const start = (currentPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const paginatedInvoices = filteredInvoices.slice(start, end);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = [...paginatedInvoices].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const x = a[sortConfig.key] ?? "";
    const y = b[sortConfig.key] ?? "";
    if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
    if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const [errors, setErrors] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleCreateItem();
    }
  };

  const validate = () => {
    const newErrors = {};
    debugger;
    const safeTrim = (value) => (value ? value.toString().trim() : "");

    if (!safeTrim(newItem.ItemName)) newErrors.ItemName = "Item Name is required";
    if (!safeTrim(newItem.Description)) newErrors.Description = "Description is required";
    if (!safeTrim(newItem.Price)) newErrors.PriceDisplay = "Price is required";
    if (!safeTrim(newItem.ItemCode)) newErrors.ItemCode = "Item Code is required";
    if (!safeTrim(newItem.UnitOfMeasure)) newErrors.UnitOfMeasure = "Unit of Measure is required";
    if (!safeTrim(newItem.Discount)) newErrors.Discount = "Company is required";
    if (!safeTrim(newItem.Category)) newErrors.Category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateItem = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...newItem,
        Currency: "USD",
        VatableStatus: newItem.VatableStatus ? "true" : "false",
        Price: parseFloat(newItem.Price) || 0,
        Quantity: parseInt(newItem.Quantity) || 0,
        Discount: parseInt(newItem.Discount) || 0,
        TaxRate: newItem.TaxRate?.toString() || "0",
        TaxAmount: parseInt(newItem.TaxAmount) || 0,
        SubTotal: parseInt(newItem.SubTotal) || 0,
        Total: parseInt(newItem.Total) || 0,
      };
      console.log("Payload", payload);
      const response = await AxiosInstance.post("/api/InventoryItems/SaveInventoryItem", payload);
      console.log("Inventory save response", response);
      if (response.data.success) {
        setItems([...items, response.data.data]);
        const message = response?.message || 'Item created successfully.';
        alertify.alert('Success', message);
        setShowCreateScreen(false);
        setNewItem({
          ItemName: "",
          Description: "",
          Currency: "",
          Price: "",
          ItemCode: "",
          Quantity: "",
          UnitOfMeasure: "",
          Discount: "",
          TaxRate: "",
          TaxAmount: "",
          SubTotal: "",
          Total: "",
          VatableStatus: "",
        });
      } else {
        debugger;
        const message = response?.data.message;
        alertify.alert('Error', message);
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alertify.alert('Error', "Failed to create item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = async (e) => {
    debugger;
    e.preventDefault();
    if (!validateEditForm()) {
      return;
    }
    setIsSaving(true);
    console.log("Edit meter type =", editItem.MeterTypeId);
    try {
      const payload = {
        ...editItem,
        Price: parseFloat(editItem.PriceDisplay),
        Quantity: parseInt(editItem.Quantity) || 0,
        Discount: parseInt(editItem.Discount) || 0,
        VatableStatus: editItem.VatableStatus ? "true" : "false",
        TaxRate: editItem.TaxRate?.toString() || "0",
        TaxAmount: parseInt(editItem.TaxAmount) || 0,
        SubTotal: parseInt(editItem.SubTotal) || 0,
        Total: parseInt(editItem.Total) || 0,
        ModifiedDate: new Date().toISOString(),
      };
      const response = await AxiosInstance.post(`/api/InventoryItems/${editItem.Id}`, payload);
      debugger;
      if (response.data.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.Id ? { ...payload, id: editItem.Id } : i))
        );
        const message = response?.data.message || 'Item updated successfully.';
        alertify.alert('Success', message);
        setShowEditScreen(false);
        setSelectedInvoice(null);
        fetchItems();
      } else {
        const message = response?.data.message || 'No Changes Found.';
        alertify.alert('Error', message);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alertify.alert('Error', "Failed to update item.");
    } finally {
      setIsSaving(false);
    }
  };

  const Cancel = async () => {
    setNewItem("");
    setShowCreateScreen(false);
  };

  const handleDeleteItem = async (id) => {
    alertify.confirm(
      "Delete Item",
      "Are you sure you want to delete this item?",
      async function () {
        try {
          const response = await AxiosInstance.post(`/api/InventoryItems/DeleteInventoryItem/${id}`);
          if (response.data.success) {
            setItems(items.filter((item) => item.id !== id));
            const message = response?.message || 'Item deleted successfully.';
            alertify.alert('Success', message);
            fetchItems();
          } else {
            const message = response?.message || 'Failed to delete item.';
            alertify.alert('Error', message);
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          alertify.alert('Error', "Error while deleting item.");
        }
      },
      function () {
        alertify.alert("Info", "Delete cancelled");
      }
    );
  };

   const downloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const response = await AxiosInstance.get(
        "/api/InventoryItems/download-template",
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ProductTemplate.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // ✅ CSV Template download — opens in Word (.doc)
  const downloadCsvTemplate = () => {
    // Set loader first, then defer the actual work so React re-renders the spinner before blob runs
    setIsDownloadingCsvTemplate(true);

    setTimeout(() => {
      try {
        const headers = [
          "Item Code",
          "Item Name",
          "Item Description",
          "Category",
          "Price Excl VAT",
          "Unit Of Measure",
          "Company",
          "Is Vatable"
        ];

        const escapeCsv = (val) => {
          if (val === null || val === undefined) return '""';
          const s = String(val);
          const escaped = s.replace(/"/g, '""');
          return `"${escaped}"`;
        };

        const sanitizeList = (arr, nameKey) => {
          if (!arr || !arr.length) return ["No Data"];
          return arr
            .map(item => {
              const val = nameKey ? item[nameKey] : item;
              if (val === null || val === undefined) return "";
              return String(val).replace(/\s+/g, " ").trim();
            })
            .filter(Boolean);
        };

        const categoryVals = sanitizeList(categories, 'name');
        const companyVals = sanitizeList(companyList, 'companyName');
        const uomVals = ["Hour", "Unit"];
        const vatableVals = ["TRUE", "FALSE"];

        const joinPipe = (arr) => arr.map(v => v.replace(/\|/g, ' ')).join('|');

        const categoryList = joinPipe(categoryVals);
        const companyNames = joinPipe(companyVals);
        const uomList = joinPipe(uomVals);
        const vatableList = joinPipe(vatableVals);

        const rows = [];
        rows.push(headers.map(h => escapeCsv(h)).join(','));
        rows.push(headers.map(() => '""').join(','));
        rows.push(headers.map(() => '""').join(','));

        rows.push(["", escapeCsv("LOOKUP_SECTION"), "", "", "", "", "", ""].join(','));
        rows.push(["", escapeCsv("Lookup Name"), escapeCsv("Allowed Values"), "", "", "", "", ""].join(','));

        const makeLookupRow = (lookupName, lookupValues) => {
          const cols = ["", lookupName, lookupValues, "", "", "", "", ""].map(c => escapeCsv(c));
          return cols.join(',');
        };

        rows.push(makeLookupRow('VALID_CATEGORIES', categoryList));
        rows.push(makeLookupRow('UNIT_OF_MEASURE', uomList));
        rows.push(makeLookupRow('IS_VATABLE', vatableList));
        rows.push(makeLookupRow('COMPANIES', companyNames));

        const csvContent = rows.join("\n") + "\n";

        // Use CSV MIME type for proper CSV format
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // .csv extension for CSV format
        link.setAttribute("download", "ProductTemplate.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("CSV template download failed:", error);
      } finally {
        setIsDownloadingCsvTemplate(false);
      }
    }, 300); // 300ms delay lets React paint the spinner before blob work starts
  };

 
   const handleBulkUpload = (e) => {
     console.log("Upload triggered");
     setIsBulkUploading(true);
 
     const file = e.target.files[0];
     if (!file) {
       console.log("No file selected");
       e.target.value = "";
       setIsBulkUploading(false);
       return;
     }
 
     console.log("File:", file.name);
     const fileType = file.name.split(".").pop().toLowerCase();
 
     if (fileType === "csv") {
       Papa.parse(file, {
         header: true,
         skipEmptyLines: true,
         complete: function (results) {
           console.log("CSV Parsed Data:", results.data);
           if (!results.data || results.data.length === 0) {
             alertify.alert("Error", "CSV is empty");
             e.target.value = "";
             return;
           }
           sendBulkData(results.data);
           e.target.value = "";
           fetchItems();
         },
         error: function (err) {
           console.error("CSV Parse Error:", err);
           e.target.value = "";
           alertify.alert("Error", "Failed to parse CSV file");
           setIsBulkUploading(false);
         },
       });
     } else if (fileType === "xlsx" || fileType === "xls") {
       const reader = new FileReader();
       reader.onload = (evt) => {
         console.log("Excel file loaded");
         try {
           const data = evt.target.result;
           const workbook = XLSX.read(data, { type: "binary" });
           console.log("Workbook:", workbook);
           const sheetName = workbook.SheetNames[0];
           const worksheet = workbook.Sheets[sheetName];
           const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
           console.log("Excel Parsed Data:", jsonData);
           if (!jsonData || jsonData.length === 0) {
             alertify.alert("Error", "Excel file is empty");
             e.target.value = "";
             return;
           }
           const cleanedData = jsonData.map(item => ({
             ...item,
             VatableStatus:
               item.VatableStatus === true ||
               item.VatableStatus === "true" ||
               item.VatableStatus === 1
           }));
           console.log("Cleaned Data:", cleanedData);
           sendBulkData(cleanedData);
           e.target.value = "";
         } catch (err) {
           console.error("Excel Processing Error:", err);
           alertify.alert("Error", "Error reading Excel file");
           e.target.value = "";
           setIsBulkUploading(false);
         }
       };
       reader.onerror = () => {
         console.error("File reading failed");
         alertify.alert("Error", "Failed to read file");
         e.target.value = "";
         setIsBulkUploading(false);
       };
       reader.readAsBinaryString(file);
     } else {
       alertify.alert("Error", "Only CSV or Excel files supported");
       e.target.value = "";
       setIsBulkUploading(false);
     }
   };
 
   const sendBulkData = async (data) => {
     console.log("Raw Data:", data);
 
     const normalizeData = (rows) => {
       return rows.map(row => {
         const normalized = {};
         for (let key in row) {
           const value = row[key];
           const lowerKey = key.toLowerCase().trim();
           if (lowerKey === "itemname" || lowerKey === "item name") {
             normalized.ItemName = value;
           } else if (lowerKey === "itemcode" || lowerKey === "item code") {
             normalized.ItemCode = value;
           } else if (lowerKey === "description" || lowerKey === "item description" || lowerKey === "desc") {
             normalized.Description = value;
           } else if (lowerKey === "category") {
             normalized.Category = value;
           } else if (
             lowerKey === "price" ||
             lowerKey === "price excl vat" ||
             lowerKey === "price exclvat"
           ) {
             normalized.Price = value;
           } else if (lowerKey === "unitofmeasure" || lowerKey === "unit of measure" || lowerKey === "uom") {
             normalized.UnitOfMeasure = value;
           } else if (lowerKey === "companyid" || lowerKey === "company id") {
             normalized.CompanyId = value;
           } else if (lowerKey === "companyname" || lowerKey === "company name" || lowerKey === "company") {
             normalized.CompanyName = value;
           } else if (lowerKey === "vatablewstatus" || lowerKey === "is vatable" || lowerKey === "vatable") {
             normalized.VatableStatus = value;
           }
         }
         return normalized;
       });
     };
 
     const filterUploadRows = (rows) => {
       return rows.filter((row) => {
         if (!row || typeof row !== "object") return false;
         const values = Object.values(row).map((value) => String(value || "").trim());
         const allEmpty = values.every((value) => value === "");
         if (allEmpty) return false;
         const lowerValues = values.map((value) => value.toLowerCase());
         const lookupSectionLabels = [
           "lookup_section",
           "lookup name",
           "allowed values",
           "valid_categories",
           "unit_of_measure",
           "is_vatable",
           "companies"
         ];
         if (lowerValues.some((value) => lookupSectionLabels.includes(value))) {
           return false;
         }
         if (!values[0] && values[1] && lookupSectionLabels.includes(values[1].toLowerCase())) {
           return false;
         }
         return true;
       });
     };
 
     const filteredData = filterUploadRows(data);
     console.log("Filtered Data:", filteredData);
 
     const normalizedData = normalizeData(filteredData);
     console.log("Normalized Data:", normalizedData);
 
     const requiredFields = ["ItemName", "ItemCode", "Description", "Category", "UnitOfMeasure"];
     const invalidRecords = [];
 
     const allowedCategories = (categories || []).map(c => (c.name ? c.name : c).trim().toLowerCase());
     const allowedCompanies = (companyList || []).map(c => c.companyName.trim().toLowerCase());
     const allowedUOM = ["Hour", "Unit"].map(u => u.toLowerCase());
     const allowedVatable = ["TRUE", "FALSE"].map(v => v.toLowerCase());
 
     normalizedData.forEach((item, index) => {
       const missingFields = requiredFields.filter(field => !item[field] || String(item[field]).trim() === "");
       if (missingFields.length > 0) {
         invalidRecords.push({
           rowIndex: index + 1,
           missingFields: missingFields,
           record: item
         });
         return;
       }
 
       const itemCategoryLower = String(item.Category).trim().toLowerCase();
       if (!allowedCategories.includes(itemCategoryLower)) {
         invalidRecords.push({
           rowIndex: index + 1,
           error: `Invalid Category "${item.Category}". Allowed: ${allowedCategories.join(", ")}`,
           record: item
         });
         return;
       }
 
       const itemUOMLower = String(item.UnitOfMeasure).trim().toLowerCase();
       if (!allowedUOM.includes(itemUOMLower)) {
         invalidRecords.push({
           rowIndex: index + 1,
           error: `Invalid Unit Of Measure "${item.UnitOfMeasure}". Allowed: Hour, Unit`,
           record: item
         });
         return;
       }
 
       if (item.VatableStatus !== undefined && item.VatableStatus !== null && item.VatableStatus !== "") {
         const itemVatableLower = String(item.VatableStatus).trim().toLowerCase();
         if (!allowedVatable.includes(itemVatableLower)) {
           invalidRecords.push({
             rowIndex: index + 1,
             error: `Invalid Is Vatable "${item.VatableStatus}". Allowed: TRUE, FALSE`,
             record: item
           });
           return;
         }
       }
 
       if (item.CompanyName) {
         const itemCompanyLower = String(item.CompanyName).trim().toLowerCase();
         if (!allowedCompanies.includes(itemCompanyLower)) {
           invalidRecords.push({
             rowIndex: index + 1,
             error: `Invalid Company "${item.CompanyName}". Allowed: ${allowedCompanies.join(", ")}`,
             record: item
           });
           return;
         }
       }
     });
 
     if (invalidRecords.length > 0) {
       const errorMessage = `Validation Error: The following rows have issues:\n\n${
         invalidRecords
           .slice(0, 5)
           .map(record => {
             if (record.missingFields) {
               return `Row ${record.rowIndex}: Missing ${record.missingFields.join(", ")}`;
             } else {
               return `Row ${record.rowIndex}: ${record.error}`;
             }
           })
           .join("\n")
       }${invalidRecords.length > 5 ? `\n\n... and ${invalidRecords.length - 5} more rows` : ""}\n\nPlease check your file and ensure all values match the allowed lookup values.`;
 
       console.error("Validation Errors:", invalidRecords);
       alertify.alert("Validation Error", errorMessage);
       setIsBulkUploading(false);
       return;
     }
 
     const companyErrors = [];
     const formattedData = normalizedData.map((item, index) => {
       let companyId = parseInt(item.CompanyId) || 0;
 
       if (!companyId && item.CompanyName) {
         const matchedCompany = companyList?.find(
           company => company.companyName?.toLowerCase().trim() === String(item.CompanyName).toLowerCase().trim()
         );
         companyId = matchedCompany?.id || 0;
 
         if (!matchedCompany) {
           companyErrors.push({
             rowIndex: index + 1,
             companyName: item.CompanyName
           });
           console.warn(`Company not found for: ${item.CompanyName}`);
         }
       }
 
       return {
         ItemName: item.ItemName?.toString().trim(),
         ItemCode: item.ItemCode?.toString().trim(),
         Description: item.Description?.toString().trim(),
         Category: item.Category?.toString().trim(),
         Price: parseFloat(item.Price) || 0,
         UnitOfMeasure: item.UnitOfMeasure?.toString().trim(),
         CompanyId: companyId,
         VatableStatus:
           item.VatableStatus === true ||
           item.VatableStatus === "true" ||
           item.VatableStatus === "TRUE" ||
           item.VatableStatus === 1 ||
           String(item.VatableStatus).toLowerCase() === "true"
       };
     });
 
     if (companyErrors.length > 0) {
       const errorMessage = `Warning: The following companies were not found in the system:\n\n${
         companyErrors
           .slice(0, 5)
           .map(err => `Row ${err.rowIndex}: "${err.companyName}"`)
           .join("\n")
       }${companyErrors.length > 5 ? `\n\n... and ${companyErrors.length - 5} more` : ""}\n\nAvailable companies: ${
         companyList?.map(c => c.companyName).join(", ") || "None"
       }`;
 
       alertify.alert("Company Mapping Warning", errorMessage);
       return;
     }
 
     console.log("Formatted Data:", formattedData);
 
     try {
       const response = await AxiosInstance.post("/api/InventoryItems/BulkUpload", formattedData);
       console.log("API Response:", response);
       if (response.data.success) {
         alertify.alert("Success", "Bulk upload successful", function () { fetchItems(); });
         fetchItems();
       } else {
         alertify.alert("Warning", response.data.message, function () { fetchItems(); });
       }
     } catch (err) {
       console.error("API Error:", err.response?.data || err);
       if (err.response?.data?.errors) {
         const errorObj = err.response.data.errors;
         let errorMsg = "Upload failed with validation errors:\n\n";
         let errorCount = 0;
         for (let rowIndex in errorObj) {
           if (errorCount >= 3) {
             errorMsg += `\n... and more errors`;
             break;
           }
           const rowErrors = errorObj[rowIndex];
           if (Array.isArray(rowErrors)) {
             errorMsg += `Row ${parseInt(rowIndex) + 1}: ${rowErrors.join(", ")}\n`;
             errorCount++;
           }
         }
         alertify.alert("Validation Error", errorMsg);
         setIsBulkUploading(false);
       } else {
         alertify.alert("Error", err.response?.data?.message || "Bulk upload failed");
         setIsBulkUploading(false);
       }
     } finally {
       setIsBulkUploading(false);
     }
   };
 
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* ✅ LIST SCREEN */}
        {!showCreateScreen && !showEditScreen && (
          <div className="reports-section">
            <div className="list-header">
              <h2 style={{ color: "green" }}>Products</h2>
              <button className="help-btn" onClick={() => setShowHelp(true)}>
                <i className="fas fa-question-circle"></i> Help
              </button>
            </div>

            {/* Filters */}
            <div className="filter-section">
              <select
                name="Category"
                value={tempFilters.Category}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, Category: e.target.value })
                }
                className="inventoryitem-input"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={tempFilters.ItemName}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, ItemName: e.target.value })
                }
                placeholder="Item Name"
                className="inventoryitem-input"
              />
              <input
                type="text"
                value={tempFilters.itemCode}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, itemCode: e.target.value })
                }
                placeholder="Item Code"
                className="inventoryitem-input"
              />
              <input
                type="text"
                value={tempFilters.Price}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, Price: e.target.value })
                }
                placeholder="Price"
                className="inventoryitem-input"
              />
              <button className="filter-btn" onClick={applyFilter}>
                Filter
              </button>
              <button
                className="clear-btn"
                onClick={() => {
                  const clearedFilters = { ItemName: "", Description: "", itemCode: "", Price: "", Category: "" };
                  setTempFilters(clearedFilters);
                  setFilters(clearedFilters);
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px 0",
              }}
            >
              {/* Add New Item + Bulk Upload — always visible */}
              <div style={{ margin: "10px 0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="btn_add"
                  onClick={() => setShowCreateScreen(true)}
                >
                  + Add New
                </button>

                 {/* Bulk Upload Button */}
              <button
                className="btn btn-primary"
                style={{ color: "white", backgroundColor: "green", cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isBulkUploading}
              >
                {isBulkUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    &nbsp;Uploading...
                  </>
                ) : (
                  "Bulk Upload"
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleBulkUpload}
                disabled={isBulkUploading}
              />

              {/* Download buttons — only visible after table data has loaded */}
              {!loading && (
                <>
                  {/* XL Template — opens in Excel, spinner only while downloading */}
                  <button
                    className="btn btn-primary"
                    style={{ color: "white", backgroundColor: "#006fff", cursor: "pointer" }}
                    onClick={downloadTemplate}
                    disabled={isDownloadingTemplate}
                  >
                    {isDownloadingTemplate ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        &nbsp;Downloading...
                      </>
                    ) : (
                      "Download xl Template"
                    )}
                  </button>

                  {/* CSV Template — opens in Word (.doc), spinner only while downloading */}
                  <button
                    className="btn btn-secondary"
                    style={{ color: "white", backgroundColor: "#444", cursor: "pointer" }}
                    onClick={downloadCsvTemplate}
                    disabled={isDownloadingCsvTemplate}
                  >
                    {isDownloadingCsvTemplate ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        &nbsp;Downloading...
                      </>
                    ) : (
                      "Download CSV Template"
                    )}
                  </button>
                </>
              )}
            </div>

              <div className="records-per-page">
                Records per page:
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="inventoryitem-input"
                >
                  {[5, 10, 25].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort("itemCode")} style={{ cursor: "pointer" }}>
                    ITEM CODE{" "}
                    {sortConfig.key === "itemCode" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}
                  </th>
                  <th>ITEM NAME</th>
                  <th>CATEGORY</th>
                  <th onClick={() => requestSort("description")} style={{ cursor: "pointer" }}>
                    DESCRIPTION {sortConfig.key === "description" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th onClick={() => requestSort("price")} style={{ cursor: "pointer" }}>
                    PRICE EXCL VAT {sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th onClick={() => requestSort("price")} style={{ cursor: "pointer" }}>
                    IS VATABLE
                  </th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      <div className="loader"></div>
                    </td>
                  </tr>
                ) : sortedInvoices.length > 0 ? (
                  sortedInvoices.map((invoice, idx) => (
                    <tr key={idx}>
                      <td>{invoice.itemCode}</td>
                      <td>{invoice.itemName}</td>
                      <td>{invoice.category}</td>
                      <td>{invoice.description}</td>
                      <td style={{ textAlign: "right" }}>{invoice.price}</td>
                      <td style={{ textAlign: "center" }}>
                        {invoice.vatableStatus === "true" ? (
                          <FiCheck style={{ color: "green", marginLeft: "6px", fontSize: "20px" }} />
                        ) : (
                          <FiX style={{ color: "red", marginLeft: "6px", fontSize: "20px" }} />
                        )}
                      </td>
                      <td>
                        <FaEdit
                          style={{ cursor: 'pointer' }}
                          className="action-icon edit-icon"
                          title="Edit"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setEditItem({
                              Id: invoice.id,
                              ItemName: invoice.itemName,
                              Description: invoice.description,
                              Currency: invoice.currency,
                              PriceDisplay: invoice.price,
                              ItemCode: invoice.itemCode,
                              Quantity: invoice.quantity,
                              UnitOfMeasure: invoice.unitOfMeasure,
                              Discount: invoice.discount,
                              VatableStatus: invoice.vatableStatus,
                              TaxRate: invoice.taxRate,
                              TaxAmount: invoice.taxAmount,
                              SubTotal: invoice.subTotal,
                              Total: invoice.total,
                              IsActive: invoice.isActive,
                              IsDeleted: invoice.isDeleted,
                              MeterTypeId: invoice.meterTypeId,
                              Category: invoice.category,
                              CreatedDate: invoice.createdDate,
                              CreatedBy: invoice.createdBy
                            });
                            setShowEditScreen(true);
                          }}
                        />
                        {invoice.isDeleted === "No" && (
                          <FaTrash
                            style={{ cursor: 'pointer' }}
                            className="action-icon cancel-icon"
                            title="Delete"
                            onClick={() => handleDeleteItem(invoice.id)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No result found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalItems={filteredInvoices.length}
              itemsPerPage={recordsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}

        {/* ✅ CREATE ITEM SCREEN */}
        {showCreateScreen && (
          <div className="create-item-section">
            <div className="create-item-box">
              <br />
              <h3 className="role-title">Create New Item</h3>
              <form onSubmit={onSubmit} noValidate className="create-item-form-row">

                <div className="formlabel-group">
                  <label>Category<span className="required">*</span></label>
                  <select
                    name="Category"
                    value={newItem.Category}
                    onChange={handleInputChange}
                    className={`inventoryitem-input ${errors.Category ? "error-border" : ""}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((Category) => (
                      <option key={Category.name} value={Category.name}>
                        {Category.name}
                      </option>
                    ))}
                  </select>
                  {errors.Category && <p className="error-message">{errors.Category}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Item Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="ItemName"
                    placeholder="Item Name"
                    value={newItem.ItemName}
                    onChange={handleInputChange}
                    className={`inventoryitem-input ${errors.ItemName ? "error-border" : ""}`}
                  />
                  {errors.ItemName && <p className="error-message">{errors.ItemName}</p>}
                </div>

                {newItem.ItemName?.trim().toLowerCase() === "meter" && (
                  <div className="formlabel-group">
                    <label>Meter Type <span className="required">*</span></label>
                    <select
                      name="MeterTypeId"
                      value={newItem.MeterTypeId}
                      onChange={handleInputChange}
                      className={`inventoryitem-input ${errors.MeterTypeId ? "error-border" : ""}`}
                    >
                      <option value="">Select MeterType</option>
                      {meterType.map((meterType) => (
                        <option key={meterType.id} value={meterType.id}>
                          {meterType.type}
                        </option>
                      ))}
                    </select>
                    {errors.MeterTypeId && <p className="error-message">{errors.MeterTypeId}</p>}
                  </div>
                )}

                <div className="formlabel-group">
                  <label>Item Code <span className="required">*</span></label>
                  <input
                    type="text"
                    name="ItemCode"
                    placeholder="Item Code"
                    value={newItem.ItemCode}
                    onChange={handleInputChange}
                    className={`inventoryitem-input ${errors.ItemCode ? "error-border" : ""}`}
                  />
                  {errors.ItemCode && <p className="error-message">{errors.ItemCode}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Description <span className="required">*</span></label>
                  <input
                    type="text"
                    name="Description"
                    placeholder="Description"
                    value={newItem.Description}
                    onChange={handleInputChange}
                    className={`inventoryitem-input ${errors.Description ? "error-border" : ""}`}
                  />
                  {errors.Description && <p className="error-message">{errors.Description}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Company Name <span className="required">*</span></label>
                  <select
                    name="Discount"
                    value={newItem.Discount}
                    onChange={handleInputChange}
                    className={`inventoryitem-input ${errors.Discount ? "error-border" : ""}`}
                  >
                    <option value="">Select Company</option>
                    {companyList.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                  {errors.Discount && <p className="error-message">{errors.Discount}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Price excl VAT <span className="required">*</span></label>
                  <input
                    type="text"
                    name="Price"
                    placeholder="Price"
                    value={newItem.PriceDisplay}
                    onChange={(e) => {
                      let input = e.target.value;
                      input = input.replace(/[^0-9.,]/g, "");
                      const normalized = input.replace(",", ".");
                      const parsed = parseFloat(normalized);
                      setNewItem({
                        ...newItem,
                        PriceDisplay: input,
                        Price: isNaN(parsed) ? "" : Number(parsed.toFixed(2)),
                      });
                    }}
                    className={`inventoryitem-input ${errors.PriceDisplay ? "error-border" : ""}`}
                  />
                  {errors.PriceDisplay && <p className="error-message">{errors.PriceDisplay}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Unit Of Measure <span className="required">*</span></label>
                  <select
                    name="UnitOfMeasure"
                    value={newItem.UnitOfMeasure}
                    onChange={handleInputChange}
                    className={`inventoryitem-input ${errors.UnitOfMeasure ? "error-border" : ""}`}
                  >
                    <option value="">Select UOM</option>
                    <option value="Hour">Hour</option>
                    <option value="Unit">Unit</option>
                  </select>
                  {errors.UnitOfMeasure && <p className="error-message">{errors.UnitOfMeasure}</p>}
                </div>

                <div className="formlabel-group">
                  <label htmlFor="VatableStatus" style={{ marginBottom: '-20px' }}>
                    Is Vatable <span className="required">*</span>
                  </label>
                  <input
                    type="checkbox"
                    id="VatableStatus"
                    name="VatableStatus"
                    checked={newItem.VatableStatus}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setNewItem({
                        ...newItem,
                        VatableStatus: isChecked,
                        TaxRate: isChecked ? taxes.id : 0,
                      });
                    }}
                    style={{ marginBottom: "-15px" }}
                  />
                </div>

                <input type="hidden" name="TaxRate" Value={newItem.TaxRate} />

                <div className="Inventory-actions">
                  <button type="submit" className="btn btn-success" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        &nbsp;Save
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    onClick={() => {
                      Cancel();
                      setErrors({});
                      setShowCreateScreen(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ✅ EDIT ITEM SCREEN */}
        {showEditScreen && selectedInvoice && (
          <div className="create-item-section">
            <div className="create-item-box">
              <br />
              <h3 className="role-title">Edit Item</h3>
              <form onSubmit={handleEditItem} className="create-item-form-row">

                <div className="formlabel-group">
                  <label>Category<span className="required">*</span></label>
                  <select
                    name="Category"
                    value={editItem.Category}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.Category ? "error-border" : ""}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((Category) => (
                      <option key={Category.name} value={Category.name}>
                        {Category.name}
                      </option>
                    ))}
                  </select>
                  {editErrors.Category && <p className="error-message">{editErrors.Category}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Item Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="ItemName"
                    placeholder="Item Name"
                    value={editItem.ItemName || ""}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.ItemName ? "error-border" : ""}`}
                  />
                  {editErrors.ItemName && <p className="error-message">{editErrors.ItemName}</p>}
                </div>

                {editItem.ItemName?.trim().toLowerCase() === "meter" && (
                  <div className="formlabel-group">
                    <label>Meter Type <span className="required">*</span></label>
                    <select
                      name="MeterTypeId"
                      value={editItem.MeterTypeId}
                      onChange={handleEditChange}
                      className={`inventoryitem-input ${editErrors.MeterTypeId ? "error-border" : ""}`}
                    >
                      <option value="">Select MeterType</option>
                      {meterType.map((meterType) => (
                        <option key={meterType.id} value={meterType.id}>
                          {meterType.type}
                        </option>
                      ))}
                    </select>
                    {editErrors.MeterTypeId && <p className="error-message">{editErrors.MeterTypeId}</p>}
                  </div>
                )}

                <div className="formlabel-group">
                  <label>Item Code <span className="required">*</span></label>
                  <input
                    type="text"
                    name="ItemCode"
                    placeholder="Item Code"
                    value={editItem.ItemCode}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.ItemCode ? "error-border" : ""}`}
                  />
                  {editErrors.ItemCode && <p className="error-message">{editErrors.ItemCode}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Description <span className="required">*</span></label>
                  <input
                    type="text"
                    name="Description"
                    placeholder="Description"
                    value={editItem.Description}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.Description ? "error-border" : ""}`}
                  />
                  {editErrors.Description && <p className="error-message">{editErrors.Description}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Company Name <span className="required">*</span></label>
                  <select
                    name="Discount"
                    value={editItem.Discount}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.Discount ? "error-border" : ""}`}
                  >
                    <option value="">Select Company</option>
                    {companyList.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                  {editErrors.Discount && <p className="error-message">{editErrors.Discount}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Price excl VAT<span className="required">*</span></label>
                  <input
                    type="text"
                    name="Price"
                    placeholder="Price"
                    value={editItem.PriceDisplay}
                    onChange={(e) => {
                      let input = e.target.value;
                      input = input.replace(/[^0-9.,]/g, "");
                      const parts = input.split(/[.,]/);
                      if (parts.length > 2) {
                        input = parts[0] + "." + parts[1];
                      }
                      const normalized = input.replace(/,/g, ".");
                      const parsed = parseFloat(normalized);
                      setEditItem({
                        ...editItem,
                        PriceDisplay: input,
                        Price: isNaN(parsed) ? "" : Number(parsed.toFixed(2)),
                      });
                    }}
                    className={`inventoryitem-input ${editErrors.PriceDisplay ? "error-border" : ""}`}
                  />
                  {editErrors.PriceDisplay && <p className="error-message">{editErrors.PriceDisplay}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Unit of Measure <span className="required">*</span></label>
                  <select
                    name="UnitOfMeasure"
                    value={editItem.UnitOfMeasure}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.UnitOfMeasure ? "error-border" : ""}`}
                  >
                    <option value="">Select UOM</option>
                    <option value="Hour">Hour</option>
                    <option value="Unit">Unit</option>
                  </select>
                  {editErrors.UnitOfMeasure && <p className="error-message">{editErrors.UnitOfMeasure}</p>}
                </div>

                <div className="formlabel-group">
                  <label htmlFor="VatableStatus" style={{ marginBottom: '-20px' }}>
                    Is Vatable <span className="required">*</span>
                  </label>
                  <input
                    type="checkbox"
                    id="VatableStatus"
                    name="VatableStatus"
                    checked={String(editItem.VatableStatus).toLowerCase() === "true"}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setEditItem({
                        ...editItem,
                        VatableStatus: isChecked,
                        TaxRate: isChecked ? taxes.id : 0,
                      });
                    }}
                    style={{ marginBottom: "-15px" }}
                  />
                </div>

                <input type="hidden" name="TaxRate" value={editItem.TaxRate} />

                <div className="formlabel-group">
                  <label>Is Active <span className="required">*</span></label>
                  <select
                    name="IsActive"
                    value={editItem.IsActive}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.IsActive ? "error-border" : ""}`}
                  >
                    <option value="">Select Is Active</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {editErrors.IsActive && <p className="error-message">{editErrors.IsActive}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Is Deleted <span className="required">*</span></label>
                  <select
                    name="IsDeleted"
                    value={editItem.IsDeleted}
                    onChange={handleEditChange}
                    className={`inventoryitem-input ${editErrors.IsDeleted ? "error-border" : ""}`}
                  >
                    <option value="">Select Is Deleted</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {editErrors.IsDeleted && <p className="error-message">{editErrors.IsDeleted}</p>}
                </div>

                <div className="Inventory-actions">
                  <button type="submit" className="btn btn-success" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        &nbsp;Update
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    onClick={() => setShowEditScreen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <HelpModal
          show={showHelp}
          title="Products - Help & Overview"
          screenName="Products"
          onClose={() => setShowHelp(false)}
        />
      </div>
    </div>
  );
};

export default InventoryItem;
