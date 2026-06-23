import React, { useState, useEffect } from "react";
import "./Quotation.css";
import { AxiosInstance } from "../../services/api";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { baseURL } from "../../services/api";
import CompanyPopup from "../../components/Quotation/CompanyPopup";
import { fetchActiveUrl } from '../../redux/RegistrationSlice';
import { useDispatch, useSelector } from 'react-redux';
import HelpModal from "../../components/Common/HelpModal";
import { allowAlphaNumeric, isAlphaNumeric } from "../../validations/InputValdation";
import Pagination from "../../components/Common/Pagination";
import useSort from "../../components/Common/useSort";
import CreateQuotationForm from "../../components/Quotation/CreateQuotationForm";
import UpdateQuotationForm from "../../components/Quotation/UpdateQuotationForm";
import InventoryPopup from "../../components/Quotation/InventoryPopup";
import CustomerPopup from "../../components/Quotation/CustomerPopup";
import ViewQuotationModal from "../../components/Quotation/ViewQuotationModal";
import { fetchCompanieswithfilter } from '../../redux/CustomerSlice';
import { data } from "react-router-dom";
import CommonDatePicker from "../../components/Common/CommonDatePicker";
import { width } from "@mui/system";
import dayjs from 'dayjs';
import { FaDownload, FaEdit, FaEye } from "react-icons/fa";
import { downloadPdfFromPage } from "../../components/Common/downloadPdf";

const Quotation = () => {
  const [popupMode, setPopupMode] = useState("create"); // "create" or "edit"
  const [DiscountMode, setDiscountMode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [CompanyName, setCompanyName] = useState('');
  const [CompanyId, setCompanyId] = useState('');

  const [VatNumber, setVatNumber] = useState('');
  const [RegistrationNumber, setRegistrationNumber] = useState('');
  const [CompanyAddress, setCompanyAddress] = useState('');
  const [CompanyWebsite, setCompanyWebsite] = useState('');
  const [CompanyEmail, setCompanyEmail] = useState('');
  const [CompanyPhoneNumber, setCompanyPhoneNumber] = useState('');
  const [CompanyLogo, setCompanyLogo] = useState([]);
  const [CustomerName, setCustomerName] = useState('');
  const [CustomerPhone, setCustomerPhone] = useState('');
  const [CustomerEmail, setCustomerEmail] = useState('');
  const [CustomerAddress, setCustomerAddress] = useState('');
  const [BankAccountNumber, setBankAccountNumber] = useState('');

  const [BranchCode, setBranchCode] = useState('');
  const [BrannchAddress, setBrannchAddress] = useState('');
  const [IFSCCode, setIFSCCode] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState()
  const [generatedQuotationId, setGeneratedQuotationId] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [generatedbillingentity, setBillingEntity] = useState('');
  const [receivingEntity, setReceivingEntity] = useState('');
  const [currency, setCurrency] = useState('');
  const [quotationType, setQuotationType] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [noteComment, setNoteComment] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [billingEntities, setBillingEntities] = useState([]);
  const [receivingEntities, setReceivingEntities] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [PaymentTerms, setPaymentTerms] = useState('');
  const [SubTotal, setSubTotal] = useState('');
  const [TaxAmount, setTaxAmount] = useState('');
  const [TotaAmount, setTotalAmount] = useState('');
  // BillingEntityModal.tsx
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10; // You can adjust this
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [receivingCompany, setReceivingCompany] = useState("");

  // customer popup code 
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [selectedCustomerRowIndex, setSelectedCustomerRowIndex] = useState(null);
  const [popupCustomerMode, setPopupCustomerMode] = useState("create"); // "create" or "edit"
  const [customerRefNo, setCustomerRefNo] = useState(false);
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [showInvoiceUpdateForm, setShowInvoiceUpdateForm] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [showInventoryPopup, setShowInventoryPopup] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [loading, setLoading] = useState(false);  // 👈 add this
  const [itemsPerPage, setItemsPerPage] = useState(5); // default 5
  const [isSaving, setIsSaving] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [popuploading, setpopupLoading] = useState(false);
  const [generateloading, setgenerateLoading] = useState(false);
  const companyList = useSelector((state) => state.Customers.companies);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadQuotation = async (
    quotationId,
    referenceNumber
  ) => {

    debugger
    try {

      setDownloadingId(quotationId);

      // Allow UI render
      await new Promise((resolve) => setTimeout(resolve, 300));

      const url =
        `${window.location.origin}` +
        `/QuotationTemplateModern?quotationId=${quotationId}&type=download`;

      await downloadPdfFromPage({
        url,
        fileName: `Quotation_${referenceNumber}.pdf`,
      });

      // Keep loader visible slightly longer
      await new Promise((resolve) => setTimeout(resolve, 1500));

    } catch (error) {

      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to download quotation.";

      if (
        message ===
        "Quotation is older than 14 days and has expired."
      ) {
        alertify.error(
          "Quotation expired. PDF download is not allowed."
        );
      } else {
        alertify.error(message);
      }

    } finally {

      setDownloadingId(null);

    }
  };

  const [selectedQuotation, setSelectedQuotation] = useState({
    quotationDetails: [],  // must be an array
    subTotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    quotationType: "",
  });
  const [showHelp, setShowHelp] = useState(false);

  const dispatch = useDispatch();

  const {
    activeurl,
    error
  } = useSelector((state) => state.registration);

  useEffect(() => {
    dispatch((fetchActiveUrl()));
    fetchInvoices();

  }, [dispatch]);

  const activationUrl = `${activeurl?.[0] || ''}QuotationTemplateModern`;
  console.log('activationUrl:', activationUrl);


  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // start loader
      try {
        await dispatch(fetchCompanieswithfilter());
      } catch (err) {
        console.error("Error fetching customers/companies:", err);
      } finally {
        setLoading(false); // stop loader after fetch completes
      }
    };

    fetchData();
  }, [dispatch]);

  const fetchCurrency = async () => {
    try {
      const response = await AxiosInstance.get(
        "/api/InventoryItems/GetCurrencies"
      );
      console.log("Currency data", response.data);
      debugger

      if (response.data.success) {
        setCurrencies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching ", error);
      // alertify.alert("Error", "Failed to load ");
    } finally {
    }
  };
  const [tax, settax] = useState(0);

  const fetchTax = async () => {
    try {
      const response = await AxiosInstance.get(
        "/api/InventoryItems/GetTax"
      );
      debugger
      if (response.data.success) {
        settax(response.data.tax);
      }
      console.log("Tax data", tax);

      debugger;

    } catch (error) {
      console.error("Error fetching ", error);
      // alertify.alert("Error", "Failed to load ");
    } finally {
    }
  };
  useEffect(() => {
    console.log("Updated tax:", tax);
  }, [tax]);


  const [createErrors, setCreateErrors] = useState({});
  const openCreatePopup = (index) => {
    setSelectedRowIndex(index);
    setPopupMode("create");
    setShowInventoryPopup(true);
    fetchItems();
  };
  const closeInvoiceForm = (index) => {

    setShowInvoiceForm(false);
    setCreateErrors("");
    resetForm();
  };

  // Function to handle selection of an inventory item
  const handleItemSelected = (selectedItem) => {
    if (selectedRowIndex === null) return;

    const newDetails = [...selectedQuotation.details];

    // Update the row at selectedRowIndex
    newDetails[selectedRowIndex] = {
      ...newDetails[selectedRowIndex],
      itemName: selectedItem.itemName,
      description: selectedItem.description,
      unitRate: selectedItem.price,
      tax: selectedItem.taxRate,
      discount: 0, // default discount if needed
    };

    // Recalculate totals
    const totals = calculateTotals(newDetails);

    setSelectedQuotation((prev) => ({
      ...prev,
      details: newDetails,
      subTotal: totals.subtotal.toFixed(2),
      taxAmount: totals.vatAmount.toFixed(2),
      totalAmount: totals.totalAmount.toFixed(2),
    }));

    setShowInventoryPopup(false); // Close the popup
  };
  const openEditPopup = (index) => {
    setSelectedRowIndex(index);
    setPopupMode("edit");
    setShowInventoryPopup(true);
    fetchItems();
  };



  // fetch customers
  const fetchInvoices = async () => {
    setLoading(true);   // show loader

    try {
      const response = await AxiosInstance.get('/api/Quotation/getQuotationList');
      const data = response.data.list || [];
      console.log('response', data);
      const mappedData = data.map(item => ({
        id: item.referenceNumber,
        quotationid : item.quotationId,
        date: item.quotationDate,
        billing: item.billingEntity,
        receiving: item.receivingEntity,
        currency: item.currency,
        companyName: item.companyName,
        companyId: item.companyId,
        vatNumber: item.vatNumber,
        registrationNumber: item.registrationNumber,
        companyAddress: item.companyAddress,
        companyWebsite: item.companyWebsite,
        companyEmail: item.companyEmail,
        accountHolderName: item.accountHolderName,
        bankAccountNumber: item.bankAccountNumber,
        companyPhoneNumber: item.companyPhoneNumber,
        branchCode: item.branchCode,
        brannchAddress: item.brannchAddress,
        ifscCode: item.ifscCode,
        customerName: item.customerName,
        customerEmail: item.customerEmail,
        customerPhone: item.customerPhone,
        customerAddress: item.customerAddress,
        Status: item.status,
        subTotal: item.subTotal,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount,
        paymentTerms: item.paymentTerms,
        quotationType: item.quotationType,
        reason: item.reason,
        companyLogo : item.companyLogo,
        // Calculate total amount from details
        amount: item.details?.reduce((sum, detail) => {
          return sum + (detail.quantity * detail.unitRate) + detail.tax;
        }, 0),

        // Map the detail lines
        details: item.details?.map(detail => ({
          detailId: detail.detailId,
          Name: detail.itemName,
          itemName: `${detail.itemCode} - ${detail.itemName} - ${detail.description}`,
          itemCode: detail.itemCode,
          discount: detail.discount,
          discountType: detail.discountType,
          category: detail.category,
          description: detail.description,
          quantity: detail.quotationQuantity,
          unitRate: detail.unitRate,
          tax: detail.tax,
          filename: detail.filename,
          filepath: detail.filepath,
          taxAmount,
          netamount: detail.quotationAmount,
          id: detail.inventoryId,
          discountValue: detail.discountValue


        })) || []
      }));

      console.log('data:', mappedData);
      setInvoices(mappedData);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);  // hide loader
    }
  };
  const fetchCustomers = async () => {
    setShowCustomerPopup(true);
    setpopupLoading(true);
    try {
      const response = await AxiosInstance.get("/api/Quotation/getCustomersList", {
        params: { excludeIds: selectedCompanyIds }
      });
      console.log('Customers data', response.data.list);
      if (response.data && response.data.list) {
        setCustomers(response.data.list);
      } else {
        setCustomers([]);
      }

    } catch (error) {
      console.error("Error fetching Customers:", error);
      alertify.alert("Error", "Failed to load Customers");
    } finally {
      setpopupLoading(false);
    }
  };
  const fetchItems = async () => {
    setpopupLoading(true);
    try {
      const response = await AxiosInstance.get(
        "/api/InventoryItems/GetInventoryItems"
      );
      console.log('inventory data', response.data.data);
      if (response.data.success) {
        setInventoryItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      // alertify.alert('Error', "Failed to load items");
    } finally {
      setpopupLoading(false);
    }
  };
  const [quotationDetails, setQuotationDetails] = useState([
    {
      itemName: "",
      itemCode: "",
      description: "",
      quantity: 0,
      price: "",
      tax: "",
      referencedocument: "",
      amount: 0,
      discount: 0,
      category: "",
      discountType: "",
      netamount: 0,
      discountValue: 0

    }
  ]);
  const handleDetailsChange1 = (index, field, value) => {
    const newDetails = [...quotationDetails];
    newDetails[index][field] = value;

    const qty = parseFloat(newDetails[index].quantity) || 0;
    const price = parseFloat(newDetails[index].price) || 0;
    const tax = parseFloat(newDetails[index].tax) || 0;

    let discount = 0; // ✅ use let

    const rowSubtotal = qty * price;
    newDetails[index].amount = rowSubtotal.toFixed(2);

    // ✅ Discount calculation
    if (newDetails[index].discountType === "%" && newDetails[index].discountValue) {
      discount = (rowSubtotal * newDetails[index].discountValue) / 100;
    }
    else if (
      newDetails[index].discountType === "price" &&
      newDetails[index].discountValue
    ) {
      discount = Math.min(
        Number(newDetails[index].discountValue),
        rowSubtotal
      );
    }
    else {
      discount = 0; // ✅ allowed now
    }

    // newDetails[index].discount = discount.toFixed(2);
    newDetails[index].discount = Number(discount.toFixed(2));


    // ✅ Net amount calculation
    const netValue =
      (rowSubtotal - discount) +
      ((rowSubtotal - discount) * tax) / 100;

    newDetails[index].netamount = netValue.toFixed(2);

    const totals = createrecalculateTotals(newDetails);

    setQuotationDetails(newDetails);

    setSelectedQuotation(prev => ({
      ...prev,
      details: newDetails,
      subTotal: totals.subtotal.toFixed(2),
      vatAmount: totals.vatAmount.toFixed(2),
      totalAmount: totals.totalAmount.toFixed(2),
    }));
  };
  const handleDetailsChange = (index, field, value) => {
    const updated = [...quotationDetails];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updated[index] = recalculateRow(updated[index], 'create');

    const totals = createrecalculateTotals(updated);

    setQuotationDetails(updated);
    setSelectedQuotation(prev => ({
      ...prev,
      details: updated,
      subTotal: totals.subtotal.toFixed(2),
      vatAmount: totals.vatAmount.toFixed(2),
      totalAmount: totals.totalAmount.toFixed(2),
    }));
  };


  const recalculateRow = (row, type) => {
    debugger
    let price = 0;
    if (type === 'create') {
      price = Number(row.price) || 0;
    } else {
      price = Number(row.unitRate) || 0;
    }
    const qty = Number(row.quantity) || 0;

    const tax = Number(row.tax) || 0;

    let discount = 0;
    const rowSubtotal = qty * price;

    if (rowSubtotal > 0) {
      if (row.discountType === "%" && row.discountValue) {
        discount = (rowSubtotal * row.discountValue) / 100;
      } else if (row.discountType === "price" && row.discountValue) {
        discount = Math.min(Number(row.discountValue), rowSubtotal);
      }
    }

    discount = Math.max(0, Math.min(discount, rowSubtotal));

    const taxable = rowSubtotal - discount;
    const netamount = taxable + (taxable * tax) / 100;

    return {
      ...row,
      amount: Number(rowSubtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      netamount: Number(netamount.toFixed(2)),
    };
  };




  const createrecalculateTotals = (details) => {
    let subtotal = 0;
    let totalVat = 0;

    details.forEach(row => {
      const quantity = parseFloat(row.quantity) || 0;
      const unitRate = parseFloat(row.price) || 0;
      const vatPercent = parseFloat(row.tax) || 0;

      const baseAmount = quantity * unitRate;
      const vatAmount = (baseAmount * vatPercent) / 100;

      // store baseAmount (without VAT)
      row.amount = baseAmount;

      // store VAT amount per row
      row.vatAmount = vatAmount;
      row.netAmount = (row.amount - row.discount) + (row.amount - row.discount) * row.tax / 100;
      subtotal += baseAmount;
      totalVat += vatAmount;
    });

    const totalInvoiceAmount = subtotal + totalVat;

    return {
      subtotal,
      vatAmount: totalVat,
      totalAmount: totalInvoiceAmount,
    };
  };

  //   const handleEditDetailsChange = (index, field, value) => {
  //     const newDetails = [...selectedQuotation.details];
  //     newDetails[index][field] = value;
  // const qty = parseFloat(newDetails[index].quantity) || 0;
  //   const price = parseFloat(newDetails[index].price) || 0;

  //   // ✅ Always recompute row total
  //   const rowSubtotal = qty * price;
  //   newDetails[index].amount = rowSubtotal.toFixed(2);
  //  const netamount =parseFloat(newDetails[index].netamount)|| 0;
  //  const rownetamount = (newDetails[index].amount-newDetails[index].discount)+(newDetails[index].tax/100);
  //   newDetails[index].netamount = rownetamount.toFixed(2);

  //   // ✅ Recalculate discount when qty/price changes
  //   if (newDetails[index].discountType === "%" && newDetails[index].discountValue) {
  //     newDetails[index].discount = (
  //       (rowSubtotal * newDetails[index].discountValue) / 100
  //     ).toFixed(2);
  //   }

  //   if (newDetails[index].discountType === "price" && newDetails[index].discountValue) {
  //     newDetails[index].discount = Math.min(
  //       Number(newDetails[index].discountValue),
  //       rowSubtotal
  //     ).toFixed(2);
  //   }

  //     const totals = calculateTotals(newDetails);

  //     setSelectedQuotation(prev => ({
  //       ...prev,
  //       details: newDetails,
  //       subTotal: totals.subtotal.toFixed(2),
  //       taxAmount: totals.vatAmount.toFixed(2),
  //       totalAmount: totals.totalAmount.toFixed(2),
  //     }));
  //   };
  // debugger
  //   const calculateTotals = (details) => {
  //     let subtotal = 0;
  //     let totalVat = 0;

  //     details.forEach(row => {
  //       const qty = parseFloat(row.quantity) || 0;
  //       const unitRate = parseFloat(row.unitRate) || 0;
  //       const tax = parseFloat(row.tax) || 0;
  //       const discount = parseFloat(row.discount) || 0;

  //       const rowSubtotal = (qty * unitRate) - discount;
  //       const rowVat = (rowSubtotal * tax) / 100;
  //  const netamount =parseFloat(row.netamount)|| 0;
  // const rownetamount = rowSubtotal+rowVat;
  // row.netamount =rownetamount;
  //       row.amount = rowSubtotal;
  //       row.vatAmount = rowVat;

  //       subtotal += rowSubtotal;
  //       totalVat += rowVat;
  //     });

  //     return {
  //       subtotal,
  //       vatAmount: totalVat,
  //       totalAmount: subtotal + totalVat,
  //     };
  //   };


  const handleEditDetailsChange = (index, field, value) => {
    debugger
    const newDetails = [...selectedQuotation.details];
    newDetails[index][field] = value;

    const qty = parseFloat(newDetails[index].quantity) || 0;
    const unitRate = parseFloat(newDetails[index].unitRate) || 0;
    const tax = parseFloat(newDetails[index].tax) || 0;
    const discount = parseFloat(newDetails[index].discount) || 0;

    // 1️⃣ Gross amount
    const grossAmount = qty * unitRate;

    // 2️⃣ Discounted amount
    const discountedAmount = Math.max(grossAmount - discount, 0);

    // 3️⃣ VAT amount
    const vatAmount = (discountedAmount * tax) / 100;

    // 4️⃣ Net amount
    const netAmount = discountedAmount + vatAmount;

    newDetails[index].amount = grossAmount.toFixed(2);
    newDetails[index].discountedAmount = discountedAmount.toFixed(2);
    newDetails[index].vatAmount = vatAmount.toFixed(2);
    newDetails[index].netamount = netAmount.toFixed(2);

    // 🔁 Recalculate discount if % based
    // if (newDetails[index].discountType === "%" && newDetails[index].discountValue) {
    //   newDetails[index].discount = (
    //     (grossAmount * newDetails[index].discountValue) / 100
    //   ).toFixed(2);
    // }
    newDetails[index] = recalculateRow(newDetails[index], 'edit');

    const totals = calculateTotals(newDetails);

    setSelectedQuotation(prev => ({
      ...prev,
      details: newDetails,
      subTotal: totals.subtotal.toFixed(2),
      taxAmount: totals.vatAmount.toFixed(2),
      totalAmount: totals.totalAmount.toFixed(2),
    }));
  };

  const calculateTotals = (details) => {
    debugger
    let subtotal = 0;
    let totalVat = 0;

    details.forEach(row => {
      const qty = parseFloat(row.quantity) || 0;
      const unitRate = parseFloat(row.unitRate) || 0;
      const tax = parseFloat(row.tax) || 0;
      const discount = parseFloat(row.discount) || 0;

      const grossAmount = qty * unitRate;
      const discountedAmount = Math.max(grossAmount - discount, 0);
      const vatAmount = (discountedAmount * tax) / 100;

      row.amount = grossAmount.toFixed(2);
      row.discountedAmount = discountedAmount.toFixed(2);
      row.vatAmount = vatAmount.toFixed(2);
      row.netamount = (discountedAmount + vatAmount).toFixed(2);

      subtotal += discountedAmount;
      totalVat += vatAmount;
    });

    return {
      subtotal,
      vatAmount: totalVat,
      totalAmount: subtotal + totalVat,
    };
  };

  const handleUpdate = async (quotation) => {

    try {
      setIsSaving(true);
      console.log("update quotation data:", quotation);

      debugger;

      if (!quotation.details || quotation.details.length === 0) {
        alertify.alert("Warning", "Add at least one quotation item.");
        return;
      }
      const invalidQty = quotation.details.some(item => !item.quantity || item.quantity < 1);
// const invalidPrice = quotation.details.some(item =>
//     Number(item.unitRate) <= 0 || isNaN(Number(item.unitRate)) || Number(item.price) <= 0 || isNaN(Number(item.price)&&isNaN(Number( item.unitRate)>0))
// );

// if (invalidPrice) {
//     alertify.alert("Warning", "Price must be greater than 0.");
//     return;
// }
if (quotation.details.some(item => isNaN(Number(item.unitRate)) || Number(item.unitRate) <= 0)) {
    alertify.alert("Warning", "Unit Rate must be greater than 0.");
    return;
}

// if (quotation.details.some(item => isNaN(Number(item.price)) || Number(item.price) < 0)) {
//     alertify.alert("Warning", "Price must not be negative.");
//     return;
// }
      if (invalidQty) {
        alertify.alert("Warning", "Quantity must be at least 1 for all items.");
        return;
      }
  

      if (!quotation.paymentTerms || quotation.paymentTerms.trim() === "") {
        alertify.alert("Warning", "Please enter payment terms.");
        return;
      }


      const payload = {
        quotationId: quotation.quotationId || quotation.id || "", // ✅ required field
        referenceNumber: quotation.id || "", // ✅ required field

        companyId: quotation.companyId || "",
        quotationDate: quotation.quotationDate || new Date().toISOString(),
        billingEntity: quotation.billingEntity || "",
        receivingEntity: quotation.receiving || "",
        currency: quotation.currency || "",
        noteComment: quotation.noteComment || "",
        projectCode: quotation.projectCode || "",
        subtotal: quotation.subTotal || 0,
        taxAmount: quotation.taxAmount || 0,
        totalAmount: quotation.totalAmount || 0,
        quotationType: quotation.quotationType || "",
        companyName: quotation.companyName || "",
        companyEmail: quotation.companyEmail || "",
        companyPhoneNumber: quotation.companyPhoneNumber || "",
        companyAddress: quotation.companyAddress || "",
        vatNumber: quotation.vatNumber || "",
        registrationNumber: quotation.registrationNumber || "",
        companyWebsite: quotation.companyWebsite || "",
        bankAccountNumber: quotation.bankAccountNumber || "",
        branchCode: quotation.branchCode || "",
        brannchAddress: quotation.brannchAddress || "",
        ifscCode: quotation.ifscCode || "",
        customerName: quotation.customerName || "",
        customerEmail: quotation.customerEmail || "",
        customerPhone: quotation.customerPhone || "",
        customerAddress: quotation.customerAddress || "",
        PaymentTerms: quotation.paymentTerms || "",
        currency: quotation.currency || "",
        quotationType: quotation.quotationType || "",
        QuotationLink: activationUrl,   // 👈 NEW FIELD
        AccountHolderName: quotation.accountHolderName,

        quotationDetails: (quotation.details || []).map(item => ({
          InventoryId: item.id.toString(),
          itemName: item.itemName || "",
          itemCode: item.itemCode || "",
          Category: item.category || "",
          description: item.description || "",
          quantity: item.quantity || 0,
          price: item.unitRate || item.price || 0,
          // amount:
          //   (parseFloat(item.quantity || 0) * parseFloat(item.unitRate || item.price || 0)) +
          //   ((parseFloat(item.tax || 0) / 100) *
          //     parseFloat(item.quantity || 0) *
          //     parseFloat(item.unitRate || item.price || 0)),

          tax: item.tax || 0,
          fileName: item.fileName || "test",
          filePath: item.filePath || "test",
          Discount: item.discount,
          DiscountType: item.discountType,
          NetAmount: item.netamount,
          discountValue: item.discountValue


        }))

      };



      console.log("Updating quotation payload:", payload);
      console.log("quotationDetails:", quotationDetails);

      const response = await AxiosInstance.post(
        `/api/Quotation/update/${quotation.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      const message = response?.data?.message || "Quotation updated successfully";

      if (message.includes("No changes")) {
        alertify.alert("Error", message); // ⚠ Just inform the user
      } else {
        alertify.alert("Success", message);
        // alert(response.data.message || "Invoice updated successfully");
        setShowInvoiceUpdateForm(false);
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error updating invoice:", error.response.data.errors || error.message);

      alertify.alert('Error', "Failed to update Quotation");
    } finally {
      setIsSaving(false);
    }
  };
  // ✅ Add this function
  const resetForm = () => {
    setCompanyName("");
    setVatNumber("");
    setRegistrationNumber("");
    setCompanyAddress("");
    setCompanyWebsite("");
    setCompanyEmail("");
    setCompanyPhoneNumber("");
    setCompanyLogo("");
    setReceivingEntity("");
    setCurrency("");
    setQuotationType("");
    setProjectCode("");
    setNoteComment("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerAddress("");
    setBankAccountNumber("");
    setBranchCode("");
    setBrannchAddress("");
    setIFSCCode("");
    setAccountHolderName("");
    setQuotationDetails([]);
    setPaymentTerms(""); // reset table items

    setTodayDate(new Date().toISOString().slice(0, 10));
  };
  const handleSave = async () => {
    const newErrors = {};
    // Required fields validation
    if (!CompanyName.trim()) newErrors.CompanyName = "Company Name is required";
    if (!VatNumber.trim()) newErrors.VatNumber = "VAT Number is required";
    if (!RegistrationNumber.trim()) newErrors.RegistrationNumber = "Registration Number is required";
    if (!CompanyAddress.trim()) newErrors.CompanyAddress = "Company Address is required";
    // if (!CompanyWebsite.trim()) newErrors.CompanyWebsite = "Company Website is required";
    if (!CompanyEmail.trim()) newErrors.CompanyEmail = "Company Email is required";
    if (!CompanyPhoneNumber.trim()) newErrors.CompanyPhoneNumber = "Company Phone Number is required";
    if (!BankAccountNumber.trim()) newErrors.BankAccountNumber = "Bank Account Number is required";
    if (!BranchCode.trim()) newErrors.BranchCode = "Branch Code is required";
    if (!BrannchAddress.trim()) newErrors.BrannchAddress = "Branch Address is required";
    // if (!IFSCCode.trim()) newErrors.IFSCCode = "IFSC Code is required";
    if (!receivingEntity.trim()) newErrors.receivingEntity = "Receiving Entity is required";
    if (!currency.trim()) newErrors.currency = "Currency is required";
    if (!quotationType.trim()) newErrors.quotationType = "Quotation Type is required";
    if (!CustomerName.trim()) newErrors.CustomerName = "Customer Name is required";
    if (!CustomerPhone.trim()) newErrors.CustomerPhone = "Customer Phone is required";
    if (!CustomerEmail.trim()) newErrors.CustomerEmail = "Customer Email is required";
    if (!CustomerAddress.trim()) newErrors.CustomerAddress = "Customer Address is required";
    if (!PaymentTerms.trim()) newErrors.PaymentTerms = "Payment Terms are required";
    // Quotation table validation
    if (quotationDetails.length === 0) {
      alertify.alert("Warning", "Add at least one quotation item.");
      return;
    }

    quotationDetails.forEach((row, index) => {
      if (!row.itemName.trim()) newErrors[`itemName_${index}`] = "itemName is required";
      if (!row.description.trim()) newErrors[`description_${index}`] = "Description is required";
      if (!row.quantity || row.quantity <= 0) newErrors[`quantity_${index}`] = "Quantity must be greater than 0";
      // if (!row.price || row.price <= 0 && row.price>0) newErrors[`price_${index}`] = "Price must be greater than 0";
      // if (!row.tax !=null) newErrors[`tax${index}`] = "tax must be greater than 0";
if (Number(row.price) <= 0 || isNaN(Number(row.price))) {
    newErrors[`price_${index}`] = "Price must be greater than 0";
}
    });

    // If errors exist, stop save
    if (Object.keys(newErrors).length > 0) {
      setCreateErrors(newErrors);
      alertify.alert("Warning", "Please fill all required fields.");
      return;
    }

    // --- If validation passes ---
    setIsSaving(true);

    try {
      const formData = new FormData();


      const invoiceData = {
        CompanyId,
        CompanyName,
        VatNumber,
        RegistrationNumber,
        CompanyAddress,
        CompanyWebsite,
        CompanyEmail,
        CompanyPhoneNumber,
        quotationId: generatedQuotationId,
        quotationDate: todayDate,
        billingEntity: generatedbillingentity,
        receivingEntity,
        currency,
        quotationType,
        projectCode,
        noteComment,
        subtotal: computedSubtotal,
        taxAmount: computedTaxAmount,
        totalAmount: computedTotalAmount,
        CustomerName,
        CustomerPhone,
        CustomerEmail,
        CustomerAddress,
        customerRefNo,
        BankAccountNumber,
        BranchCode,
        BrannchAddress,
        IFSCCode,
        AccountHolderName,
        QuotationLink: activationUrl,   // 👈 NEW FIELD
        CompanyLogo,
        PaymentTerms,
        quotationDetails: quotationDetails.map((item) => ({
          InventoryId: item.id.toString(),
          itemName: item.itemName,
          description: item.description,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          tax: parseFloat(item.tax),
          amount: item.amount,
          ItemCode: item.itemCode,
          Discount: Number(item.discount),
          category: item.category,
          DiscountType: item.discountType,
          NetAmount: item.netamount,
          DiscountValue: item.discountValue


        })),
      };

      // Append invoiceData JSON
      console.log("invoiceData---", invoiceData);
      // formData.append("invoiceData sending", JSON.stringify(invoiceData));
      formData.append("invoiceData", JSON.stringify(invoiceData));

      console.log("FormData being sent:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          console.log(`${key}: File -> ${value.name}`);
        } else if (value instanceof File && value.size === 0) {
          console.log(`${key}: Empty File placeholder`);
        } else {
          try {
            const parsed = JSON.parse(value);
            console.log(`${key}: JSON ->`, parsed);
          } catch {
            console.log(`${key}:`, value);
          }
        }
      }
      console.log("FINAL invoiceData:", invoiceData);
      console.log("FINAL JSON:", JSON.stringify(invoiceData));

      // Send request
      const res = await AxiosInstance.post("/api/Quotation/saveQuotation", formData, {
        headers: { "Content-Type": "multipart/form-data" }

      });
      if (res.status === 200 || res.data.success) {
        const message = res.data?.message;
        if (message == 'Quotation Reference already Used') {
          alertify.alert('Warning', 'Quotation reference already exists. A new reference number will be generated.', function () {
            handleGenerateQuotation();
          });

        }
        else {
          alertify.alert('Success', message, function () {
            resetForm();
            setShowInvoiceForm(false);
            fetchInvoices();
          });

        }

      } else {
        alertify.alert("Error", "Failed to save Quotation.");
      }
    } catch (error) {
      console.error("Error", "Error saving Quotation:", error);
      alertify.alert("Error", "An error occurred while saving Quotation.");
    } finally {
      setIsSaving(false); // hide loader
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setTodayDate(formattedDate);
  }, []);

  

  const [tempFilters, setTempFilters] = useState({
    date: null,
    referenceNumber: "",
    customerName: "",
    companyName: "",

  });
  const [waterFilters, setWaterFilters] = useState({
    date: null,
    referenceNumber: "",
    customerName: "",
    companyName: "",

  });


  const applyFilter = () => {
    setWaterFilters(tempFilters);
    setCurrentPage(1);
  };

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const handleSearch = async () => {
    setShowCompanyPopup(true);
    setpopupLoading(true);
    try {

      const response = await AxiosInstance.get(
        `/api/Quotation/SearchCompany`
      );
      console.log('companies data', response.data);

      if (response.data && response.data.length > 0) {

        setCompanies(response.data);
        console.log(response.data[0].id);
        setSelectedCompanyIds(response.data[0].id);
        setNoDataFound(false);

      } else {
        setCompanies([]);
        setNoDataFound(true);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
      setCompanies([]);
      setNoDataFound(true);

    }
    finally {
      setpopupLoading(false);
    }
  };


  const filteredInvoices = invoices.filter((invoice) =>
    Object.keys(waterFilters).every((key) => {
      debugger
      const filterValue = waterFilters[key];
      if (!filterValue) return true;

      // ✅ DATE FILTER
      if (key === "date") {
        const selectedDate = new Date(filterValue).toISOString().split("T")[0];
        const invoiceDate = invoice.date
          ? new Date(invoice.date).toISOString().split("T")[0]
          : "";

        return invoiceDate === selectedDate;
      }

      // ✅ COMPANY FILTER (FIXED)
      if (key === "companyName") {
        const invoiceCompany =
          typeof invoice.companyName === "string"
            ? invoice.companyName
            : invoice.company?.companyName ||
            invoice.company?.name ||
            "";

        return invoiceCompany
          .toLowerCase()
          .trim()
          .includes(filterValue.toLowerCase().trim());
      }

      // ✅ CUSTOMER FILTER
      if (key === "customerName") {
        const invoiceCustomer =
          invoice.customerName ||
          invoice.customer?.name ||
          "";

        return invoiceCustomer
          .toLowerCase()
          .trim()
          .includes(filterValue.toLowerCase().trim());
      }

      // ✅ REFERENCE NUMBER
      if (key === "referenceNumber") {
        return String(invoice.id ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }

      // ✅ FALLBACK
      const invoiceValue = String(invoice[key] ?? "").toLowerCase();
      return invoiceValue.includes(filterValue.toLowerCase());
    })
  );




  const { sortedData, requestSort, sortConfig } = useSort(filteredInvoices);

  const paginatedInvoices = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const addRow = () => {
    // Get the last row
    const lastRow = quotationDetails[quotationDetails.length - 1];

    // Check if last row exists and quantity > 0
    if (!lastRow || Number(lastRow.quantity) > 0) {
      const updated = [
        ...quotationDetails,
        {
          itemName: "",
          description: "",
          quantity: "",
          price: 0,
          tax: 0,
          discount: 0,
          amount: 0,
          discountedamount: 0,
          netamount: 0
        }
      ];

      setQuotationDetails(updated);

      // RECALCULATE TOTALS
      const totals = recalculateTotals(updated);

      // UPDATE EDIT MODE
      setSelectedQuotation(prev => ({
        ...prev,
        details: updated,
        subTotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount
      }));
    } else {
      // Optional: Show warning or feedback to user
      alertify.alert('Warning', "Please select Item and enter quantity in the previous row before adding a new one.");
    }
  };


  const removeRow = (index) => {
    const newDetails = [...quotationDetails];
    newDetails.splice(index, 1);
    setQuotationDetails(newDetails);
  };
  // For edit mode


  const handleEditAddRow = () => {
    // Get last row (previous row)
    const lastRow =
      selectedQuotation.details[selectedQuotation.details.length - 1];

    // ✅ Validate quantity
    if (lastRow && Number(lastRow.quantity) <= 0) {
      alertify.alert('Warning', "Please select Item and enter quantity in the previous row before adding a new one.");
      return;
    }

    const newRow = {
      itemName: "",
      description: "",
      quantity: "",
      unitRate: 0,
      tax: 0,
      discount: 0,
      amount: 0,
      discountedamount: 0,
      netamount: 0,
    };

    setSelectedQuotation((prev) => ({
      ...prev,
      details: [...prev.details, newRow],
    }));

    // ✅ Select newly added row
    setSelectedRowIndex(selectedQuotation.details.length);
  };


  const handleEditRemoveRow = (index) => {
    const updatedDetails = [...selectedQuotation.details];
    updatedDetails.splice(index, 1);

    // ✅ Recalculate totals after removing row
    const totals = calculateTotals(updatedDetails);

    setSelectedQuotation({
      ...selectedQuotation,
      details: updatedDetails,
      subTotal: totals.subtotal.toFixed(2),
      taxAmount: totals.vatAmount.toFixed(2),
      totalAmount: totals.totalAmount.toFixed(2),
    });
  };

  const subtotal = quotationDetails.reduce((sum, row) => sum + (row.quantity * row.price), 0);
  const taxAmount = quotationDetails.reduce((sum, row) => {
    const rowSubtotal = row.quantity * row.price;
    return sum + (rowSubtotal * (row.tax || 0)) / 100;
  }, 0);
  const totalAmount = subtotal + taxAmount;
  // 🔹 1. Universal handler
  const handleItemSelect = (item) => {
    console.log("Selected item category:", item.category);
    if (popupMode === "create") {
      const updated = [...quotationDetails];
      updated[selectedRowIndex] = {
        ...updated[selectedRowIndex],
        id: item.id,
        itemName: `${item.itemCode} - ${item.itemName} - ${item.description} `,
        itemCode: item.itemCode,
        description: item.description,
        price: item.price,
        tax: item.taxRate,
        quantity: item.quantity,
        category: item.category,
        amount: parseInt(item.price),
        discount: 0,
        discountValue: 0,
        discountType: "",
      };
      setQuotationDetails(updated);
    } else if (popupMode === "edit") {
      const updated = [...selectedQuotation.details];

      if (selectedRowIndex != null && updated[selectedRowIndex]) {
        // Update existing row
        updated[selectedRowIndex] = {
          ...updated[selectedRowIndex],
          id: item.id,
          itemName: `${item.itemCode} - ${item.itemName} - ${item.description} - ${item.category}`,
          itemCode: item.itemCode,
          category: item.category,
          description: item.description,
          unitRate: item.price,
          tax: item.taxRate,
          quantity: item.quantity,
          discount: item.discount,
          discountType: item.discountType,
          discount: 0,
          discountValue: 0,
          discountType: "",
        };
      } else {
        // Add new row if none exists at selectedRowIndex
        updated.push({
          id: item.id,
          itemName: `${item.itemCode} - ${item.itemName} - ${item.description} - ${item.category}`,
          itemCode: item.itemCode,
          category: item.category,
          description: item.description,
          unitRate: item.price,
          tax: item.taxRate,
          quantity: item.quantity,
          // discount: item.discount,
          // discountType: item.discountType,
          amount: 0,
          vatAmount: 0,
          discount: 0,
          discountValue: 0,
          discountType: "",
        });
      }

      // Recalculate totals
      const totals = calculateTotals(updated);
      //const totals = createrecalculateTotals(updated);

      setSelectedQuotation({
        ...selectedQuotation,
        details: updated,
        subTotal: totals.subtotal.toFixed(2),
        taxAmount: totals.vatAmount.toFixed(2),
        totalAmount: totals.totalAmount.toFixed(2),
      });
    }

    // Clear validation errors for that row
    clearTableValidation(
      ["itemName", "description", "price", "quantity", "tax"],
      selectedRowIndex
    );

    setShowInventoryPopup(false);
    setSearchQuery("");
  };
  const handleItemSelect1 = (item) => {
    const updated = [...quotationDetails];

    updated[selectedRowIndex] = recalculateRow({
      ...updated[selectedRowIndex],
      id: item.id,
      itemName: `${item.itemCode} - ${item.itemName} - ${item.description} - ${item.category}`,
      itemCode: item.itemCode,
      description: item.description,
      category: item.category,
      price: item.price,
      tax: item.taxRate,

      // 🚨 Reset these to avoid negative values
      price:0,
      quantity: 0,
      discount: 0,
      discountValue: 0,
      discountType: "",
    });

    const totals = createrecalculateTotals(updated);

    setQuotationDetails(updated);
    setSelectedQuotation(prev => ({
      ...prev,
      details: updated,
      subTotal: totals.subtotal.toFixed(2),
      vatAmount: totals.vatAmount.toFixed(2),
      totalAmount: totals.totalAmount.toFixed(2),
    }));

    setShowInventoryPopup(false);
    setSearchQuery("");
  };

  const handleGenerateQuotation = async () => {
    setgenerateLoading(true);
    try {
      // Run all fetches concurrently or sequentially
      await Promise.all([
        fetchCurrency(),
        fetchTax(),
      ]);

      // Fetch quotation reference number
      const res = await AxiosInstance.get(`/api/Quotation/getQuotationRefno`);
      setGeneratedQuotationId(res.data.referenceNumber);

      // Show invoice form
      setShowInvoiceForm(true);

    } catch (error) {
      console.error("Error generating quotation", error);
    }
    finally {
      setgenerateLoading(false);
    }
  };


  const renderTable = () => {
    return (
      <>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    margin: "10px 0",
  }}
>
  
 <div
  className="records-per-page"
  style={{ display: "flex", alignItems: "center", gap: "8px" }}
>
  <span>Records per page:</span>
  <select
    value={itemsPerPage}
    onChange={(e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    }}
  >
    {[2, 5, 10, 25].map((num) => (
      <option key={num} value={num}>
        {num}
      </option>
    ))}
  </select>
</div>

  {/* Right Side */}
  <div className="Invoicebuttons">
    <button className="Generate" onClick={handleGenerateQuotation}>
      {generateloading ? (
        <>
          <span
            className="button-loader"
            style={{ marginRight: "8px" }}
          />
          Generate Quotation
        </>
      ) : (
        "Generate Quotation"
      )}
    </button>
  </div>
</div>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("id")}>
                QUOTATION ID {""}
                {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}
              </th>
              <th>QUOTATION DATE</th>
              {/* <th>COMPANY</th> */}
              <th>COMPANY NAME</th>
              <th>CURRENCY</th>
              <th>CUSTOMER NAME</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  <div className="loader"></div>
                </td>
              </tr>
            ) : paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>No Quotations Found</td>
              </tr>
            ) : (
              paginatedInvoices.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.id}</td>
                  <td>{row.date
                    ? new Date(row.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    : "-"}</td>

                  <td>{row.companyName}</td>
                  <td>{row.currency}</td>
                  <td>{row.customerName}</td>

                  <td>
                    <span
                      className={`status-badge 
                                            ${row.Status === "Created" ? "status-created" : ""}
                                            ${row.Status === "Approved" ? "status-paid" : ""}
                                            ${row.Status === "Rejected" ? "status-cancelled" : ""}
                                            ${row.Status === "Expired" ? "status-expired" : ""}
                                            ${row.Status === "Updated" ? "status-creditnote" : ""}`}>
                      {row.Status}
                    </span>
                  </td>
                  <td className="actions">
                    {/* View Button */}
                    <div className="action-container">                    
                    <FaEye
                      style={{ cursor: 'pointer' }}
                      className="action-icon view-icon"
                      onClick={() => {
                        setSelectedInvoice(row);
                        console.log('view', row)
                        setShowModal(true);
                      }}
                      title="View"
                    />

                    {/* Edit Button */}
                    {row.Status !== "Approved" && row.Status !== "Expired" && (
                      <FaEdit
                        style={{ cursor: 'pointer' }}
                        className="action-icon edit-icon"
                        title="Edit"
                        onClick={() => {
                          debugger
                          console.log("Row data:", row);
                          setSelectedQuotation(row);
                          setShowInvoiceUpdateForm(true);
                          fetchCurrency();
                          fetchTax();
                        }}
                      />

                    )}

                    <div
                      onClick={() =>
                        handleDownloadQuotation(
                          row.quotationid,
                          row.id
                        )
                      }
                      style={{
                        cursor:
                          downloadingId === row.quotationid
                            ? "not-allowed"
                            : "pointer",
                        pointerEvents:
                          downloadingId === row.quotationid
                            ? "none"
                            : "auto",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "18px",
                        minHeight: "18px",
                      }}
                    >
                      {downloadingId === row.quotationid ? (
                        <div className="mini-spinner"></div>
                      ) : (
                        <FaDownload
                          className="action-icon download-icon"
                          title="Quotation Download"
                        />
                      )}
                    </div>
                     </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
        <Pagination currentPage={currentPage} totalItems={filteredInvoices.length} itemsPerPage={itemsPerPage} onPageChange={(page) => setCurrentPage(page)} />

        <ViewQuotationModal show={showModal} onClose={() => setShowModal(false)} selectedInvoice={selectedInvoice} />
      </>
    );
  };

  const computedSubtotal = quotationDetails.reduce(
    (sum, row) => sum + (row.quantity * row.price) - (row.discount || 0),
    0
  );

  const computedTaxAmount = quotationDetails.reduce((sum, row) => {
    const rowSubtotal = (row.quantity * row.price) - (row.discount || 0);
    return sum + (rowSubtotal * (row.tax || 0)) / 100;
  }, 0);

  const computedTotalAmount = computedSubtotal + computedTaxAmount;

  const logoFile = CompanyLogo && typeof CompanyLogo === "string" ? CompanyLogo.split(/[/\\]UploadedFiles[/\\]/).pop() : "";
  // console.log("logoFile", CompanyLogo);
  const recalculateTotals = (details) => {
    let subTotal = 0;
    let taxAmount = 0;
    details.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.unitRate) || 0;
      const tax = parseFloat(item.tax) || 0;
      const amount = qty * rate;
      const itemTax = (amount * tax) / 100;
      subTotal += amount;
      taxAmount += itemTax;
    });

    const totalAmount = subTotal + taxAmount;

    return {
      subTotal: subTotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const clearValidation = (fields = []) => {
    setCreateErrors((prev) => {
      const updated = { ...prev };
      fields.forEach((field) => {
        updated[field] = "";
      });
      return updated;
    });
  };

  const clearTableValidation = (fields = [], rowIndex) => {
    setCreateErrors((prev) => {
      const updated = { ...prev };
      fields.forEach((field) => {
        const key = `${field}_${rowIndex}`;
        if (updated.hasOwnProperty(key)) {
          delete updated[key]; // OR: updated[key] = ""; 
        }
      });
      return updated;
    });
  };

  const handleCompanySelect = (company) => {
    // close popup
    setShowCompanyPopup(false);
    // Clear validation keys (use your existing function)
    clearValidation([
      "CompanyName",
      "CompanyPhoneNumber",
      "CompanyEmail",
      "CompanyAddress",
      "RegistrationNumber",
      "CompanyWebsite",
      "VatNumber",
      "BankAccountNumber",
      "BrannchAddress",
      "BranchCode",
      // "IFSCCode",
      "AccountHolderName",
    ]);
    // Create (Generate Quotation) mode: set individual create form state
    if (showInvoiceForm) {
      setCompanyName(company.companyName || "");
      setVatNumber(company.vatNumber || "");
      setRegistrationNumber(company.registrationNumber || "");
      setCompanyAddress(company.companyAddress || "");
      setCompanyWebsite(company.companyWebsite || "");
      setCompanyEmail(company.companyEmail || "");
      setCompanyPhoneNumber(company.companyPhoneNumber || "");
      setBankAccountNumber(company.bankAccountNumber || "");
      setBranchCode(company.branchCode || "");
      setBrannchAddress(company.brannchAddress || "");
      setIFSCCode(company.ifscCode || "");
      setAccountHolderName(company.accountHolderName || "");
      setCompanyLogo(company.companyLogo || "");
      setCompanyId(String(company.id));

      return;
    }

    // Update (Edit Quotation) mode: update selectedQuotation object
    if (showInvoiceUpdateForm && selectedQuotation) {
      debugger
      setSelectedQuotation((prev) => ({
        ...prev,
        companyName: company.companyName || "",
        vatNumber: company.vatNumber || "",
        registrationNumber: company.registrationNumber || "",
        companyAddress: company.companyAddress || "",
        companyWebsite: company.companyWebsite || "",
        companyEmail: company.companyEmail || "",
        companyPhoneNumber: company.companyPhoneNumber || "",
        bankAccountNumber: company.bankAccountNumber || "",
        branchCode: company.branchCode || "",
        brannchAddress: company.brannchAddress || "",
        ifscCode: company.ifscCode || "",
        accountHolderName: company.accountHolderName || "",
        logoFile: company.companyLogo || "",
        compnyId: company.id

      }));
    }
  };
  const clearForm = () => {
    setShowInvoiceForm(false);
    resetForm();
  };
  const closeForm = () => {
    setDiscountType("");
    setDiscountValue("");
    setDiscountedTotal(0);
    setShowDiscountPopup(false);

  };
  const resetDiscountPopup = () => {
    setDiscountType("");
    setDiscountValue("");
    setDiscountedTotal(0);
  };
  const [discountData, setDiscountData] = useState({
    discountType: "% Discount",
    percentage: "",
    priceOff: "",
    discountedTotal: ""
  });
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(0);

  const [totalBefore, setTotalBefore] = useState(0);
  const [updatediscountType, setupdatediscounttype, updatediscountvalue, setupdatediscountvalue] = useState("");

  const toISO = (date) => {
    if (!date) return "";
    const [d, m, y] = date.split("/");
    return `${y}-${m}-${d}`;
  };

  const formatDateToDDMMYYYY = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };


  return (
    <>
      <div className="quotation-container">
        <div className="quotation-content">
          <div className="list-header">

            <h2 style={{ color: "green" }}>Quotation</h2>
            <button className="help-btn" onClick={() => setShowHelp(true)}>
              <i className="fas fa-question-circle"></i> Help
            </button>
          </div>
          <div className="filter-section">
            <input
              type="text"
              value={tempFilters.referenceNumber}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, referenceNumber: e.target.value })
              }
              placeholder="Quotation Id"
            />


            <CommonDatePicker
              value={tempFilters.date}
              onChange={(newDate) =>
                setTempFilters({ ...tempFilters, date: newDate })
              }
              className="common-input" label="Select Date" placeholder="Select Date"
            />

            <input type="text" value={tempFilters.customerName}
              onChange={(e) => setTempFilters({ ...tempFilters, customerName: e.target.value })}
              placeholder="Customer Name"
            />


            <select
              value={tempFilters.companyName}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, companyName: e.target.value })
              }
              className="common-input"
            >
              <option value="">Select Company </option>
              {companyList.map((company) => (
                <option key={company.companyName} value={company.companyName}>
                  {company.companyName}
                </option>
              ))}

            </select>


            <button className="filter-btn" onClick={applyFilter}>
              Filter
            </button>
            <button className="clear-btn"
              onClick={() => {
                const clearedFilters = {
                  date: null,
                  referenceNumber: "",
                  customerName: "",
                  companyName: "",
                  receiving: "",
                  currency: "",
                  status: ""
                };

                setTempFilters(clearedFilters);
                setWaterFilters(clearedFilters);
                setCurrentPage(1);
                setTempFilters(clearedFilters); setWaterFilters(clearedFilters); setCurrentPage(1);
              }}>Clear
            </button>
          </div>
          {renderTable()}

          <InventoryPopup
            show={showInventoryPopup} onItemSelected={handleItemSelected} onClose={() => setShowInventoryPopup(false)}
            inventoryItems={inventoryItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            handleItemSelect={handleItemSelect} popupMode={popupMode} quotationDetails={quotationDetails}
            selectedQuotation={selectedQuotation} selectedRowIndex={selectedRowIndex} popuploading={popuploading} />

          <CustomerPopup show={showCustomerPopup} onClose={() => setShowCustomerPopup(false)} customers={customers} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            popupCustomerMode={popupCustomerMode}
            setSelectedQuotation={setSelectedQuotation}
            clearValidation={clearValidation}
            setReceivingEntity={setReceivingEntity}
            setCustomerName={setCustomerName}
            setCustomerPhone={setCustomerPhone}
            setCustomerEmail={setCustomerEmail}
            setCustomerAddress={setCustomerAddress}
            setReceivingCompany={setReceivingCompany}
            setCustomerRefNo={setCustomerRefNo}
            popuploading={popuploading}
          />
          {showCompanyPopup && (
            <CompanyPopup
              isOpen={showCompanyPopup}
              companies={companies}
              onSelect={handleCompanySelect}
              onClose={() => setShowCompanyPopup(false)}
              popuploading={popuploading}


            />
          )}



          {showDiscountPopup && (

            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10050
            }}>
              <div style={{
                background: "#fff",
                padding: "35px",
                borderRadius: "12px",
                width: "480px"
              }}>

                <span className="closequotation-btn" onClick={() => {
                  resetDiscountPopup();
                  setShowDiscountPopup(false);
                }}>
                  &times;
                </span>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontWeight: 600 }}>Discount</label>

                  <select
                    className="uniform-input"

                    style={{ width: "100%", marginTop: "6px", padding: "10px", borderRadius: "6px" }}
                    value={discountType}
                    onChange={(e) => {

                      setDiscountType(e.target.value);
                      setDiscountValue("");
                      setDiscountedTotal(0);
                    }}
                  >
                    <option value="">-- Select --</option>
                    <option value="%">% Discount</option>
                    <option value="price">Price Off Discount</option>
                  </select>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ fontWeight: 600 }}>Total</label>
                  <input
                    className="uniform-input"

                    type="number"
                    disabled
                    style={{ width: "100%", marginTop: "6px", padding: "10px", borderRadius: "6px" }}
                    value={totalBefore}

                  />
                </div>


                {discountType === "%" && (
                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ fontWeight: 600 }}>% Discount</label>
                    <input
                      type="number"
                      className="uniform-input"

                      style={{ width: "100%", marginTop: "6px", padding: "10px", borderRadius: "6px" }}
                      value={discountValue}
                      // onChange={(e) => {
                      //   const v = e.target.value;
                      //   setDiscountValue(v);
                      //   const calc = (totalBefore * v) / 100;
                      //   setDiscountedTotal(calc.toFixed(2));
                      // }}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setDiscountValue(v);

                        if (v < 0) {
                          setDiscountError("Discount cannot be negative");
                          setDiscountedTotal(0);
                        }
                        else if (v > 100) {
                          setDiscountError("Percentage cannot be greater than 100%");
                          setDiscountedTotal(0);
                        }
                        else {
                          setDiscountError("");
                          const calc = (totalBefore * v) / 100;
                          setDiscountedTotal(calc.toFixed(2));
                        }
                      }}

                    />
                  </div>
                )}

                {discountType === "price" && (
                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ fontWeight: 600 }}>Price Off Discount</label>
                    <input
                      className="uniform-input"

                      type="number"
                      style={{ width: "100%", marginTop: "6px", padding: "10px", borderRadius: "6px" }}
                      value={discountValue}
                      // onChange={(e) => {
                      //   const v = e.target.value;
                      //   setDiscountValue(v);
                      //   setDiscountedTotal(v);
                      // }}

                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setDiscountValue(v);

                        if (v > totalBefore) {
                          setDiscountError("Discount cannot be greater than total amount");
                          setDiscountedTotal(0);
                        } else {
                          setDiscountError("");
                          setDiscountedTotal(v);
                        }
                      }}
                    />

                  </div>
                )}
                {discountError && (
                  <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                    {discountError}
                  </div>
                )}


                <div style={{ marginBottom: "25px" }}>
                  <label style={{ fontWeight: 600 }}>Discounted Total</label>
                  <input
                    className="uniform-input"

                    type="number"
                    disabled
                    style={{ width: "100%", marginTop: "6px", padding: "10px", borderRadius: "6px" }}
                    value={discountedTotal}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    style={{
                      padding: "12px 40px",
                      borderRadius: "8px",
                      background: "#28a745",
                      border: "none",
                      color: "#fff",
                      fontSize: "18px",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      debugger;
                      if (selectedRowIndex == null) return;

                      let updatedRows = [];

                      if (DiscountMode == "create") {
                        // --- CREATE MODE ---
                        if (quotationDetails && Array.isArray(quotationDetails)) {
                          updatedRows = [...quotationDetails];
                          if (updatedRows[selectedRowIndex]) {
                            updatedRows[selectedRowIndex].discount = parseFloat(discountedTotal) || 0;
                            updatedRows[selectedRowIndex].discountValue = parseFloat(discountValue) || 0;
                            updatedRows[selectedRowIndex].discountType = discountType;
                            handleDetailsChange(selectedRowIndex, "discount", updatedRows[selectedRowIndex].discount);
                            setDiscountType(discountType);
                            setDiscountedTotal(discountedTotal);
                            setDiscountValue(discountValue);
                            setQuotationDetails(updatedRows);

                          }
                        }
                      }
                      else {

                        // --- EDIT MODE ---
                        if (selectedQuotation && Array.isArray(selectedQuotation.details)) {
                          updatedRows = [...selectedQuotation.details];
                          updatedRows[selectedRowIndex].discount = parseFloat(discountedTotal) || 0;
                          updatedRows[selectedRowIndex].discountValue = parseFloat(discountValue) || 0;
                          updatedRows[selectedRowIndex].discountType = discountType;

                          const totals = calculateTotals(updatedRows);

                          setSelectedQuotation(prev => ({
                            ...prev,
                            details: updatedRows,
                            // subTotal :discountValue - totals.subtotal.toFixed(2),
                            subTotal: totals.subtotal.toFixed(2),
                            taxAmount: totals.vatAmount.toFixed(2),
                            totalAmount: totals.totalAmount.toFixed(2),
                          }));
                        }
                      }

                      resetDiscountPopup();
                      setShowDiscountPopup(false);
                    }}
                  >
                    Save
                  </button>

                  <button
                    style={{
                      padding: "12px 34px",
                      borderRadius: "8px",
                      border: "1px solid #777",
                      background: "red",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      resetDiscountPopup();
                      setShowDiscountPopup(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          )}

          {showInvoiceForm && (
            <CreateQuotationForm
              clearForm={clearForm}
              logoFile={logoFile}
              baseURL={baseURL}
              CompanyId={CompanyId}
              setCompanyId={setCompanyId}
              CompanyName={CompanyName}
              setCompanyName={setCompanyName}
              VatNumber={VatNumber}
              setVatNumber={setVatNumber}
              RegistrationNumber={RegistrationNumber}
              setRegistrationNumber={setRegistrationNumber}
              CompanyAddress={CompanyAddress}
              setCompanyAddress={setCompanyAddress}
              CompanyWebsite={CompanyWebsite}
              setCompanyWebsite={setCompanyWebsite}
              CompanyEmail={CompanyEmail}
              setCompanyEmail={setCompanyEmail}
              CompanyPhoneNumber={CompanyPhoneNumber}
              setCompanyPhoneNumber={setCompanyPhoneNumber}
              BankAccountNumber={BankAccountNumber}
              setBankAccountNumber={setBankAccountNumber}
              BranchCode={BranchCode}
              setBranchCode={setBranchCode}
              BrannchAddress={BrannchAddress}
              setBrannchAddress={setBrannchAddress}
              IFSCCode={IFSCCode}
              setIFSCCode={setIFSCCode}
              generatedQuotationId={generatedQuotationId}
              todayDate={todayDate}
              receivingEntity={receivingEntity}
              setReceivingEntity={setReceivingEntity}
              currencies={currencies}
              currency={currency}
              setCurrency={setCurrency}
              quotationType={quotationType}
              setQuotationType={setQuotationType}
              quotationDetails={quotationDetails}
              addRow={addRow}
              removeRow={removeRow}
              handleDetailsChange={handleDetailsChange}
              createErrors={createErrors}
              setCreateErrors={setCreateErrors}
              CustomerName={CustomerName}
              setCustomerName={setCustomerName}
              CustomerPhone={CustomerPhone}
              setCustomerPhone={setCustomerPhone}
              CustomerEmail={CustomerEmail}
              setCustomerEmail={setCustomerEmail}
              CustomerAddress={CustomerAddress}
              setCustomerAddress={setCustomerAddress}
              PaymentTerms={PaymentTerms}
              setPaymentTerms={setPaymentTerms}
              allowAlphaNumeric={allowAlphaNumeric}
              isAlphaNumeric={isAlphaNumeric}
              computedSubtotal={computedSubtotal}
              computedTaxAmount={computedTaxAmount}
              computedTotalAmount={computedTotalAmount}
              setSubTotal={setSubTotal}
              setTaxAmount={setTaxAmount}
              setTotalAmount={setTotalAmount}
              handleSearch={handleSearch}
              fetchCustomers={fetchCustomers}
              handleSave={handleSave}
              isSaving={isSaving}
              openCreatePopup={openCreatePopup}
              setSelectedRowIndex={setSelectedRowIndex}
              setShowDiscountPopup={setShowDiscountPopup}
              setTotalBefore={setTotalBefore}
              setShowInvoiceForm={setShowInvoiceForm}
              closeInvoiceForm={closeInvoiceForm}
              DiscountMode={DiscountMode}
              setDiscountMode={setDiscountMode}
              setDiscountType={setDiscountType}
              setDiscountedTotal={setDiscountedTotal}
              setDiscountValue={setDiscountValue}
              popuploading={popuploading}
              tax={tax}

            />
          )}

          {/* // inventory popup */}

          {showInvoiceUpdateForm && selectedQuotation && (
            <UpdateQuotationForm
              selectedQuotation={selectedQuotation}
              setSelectedQuotation={setSelectedQuotation}
              showInvoiceUpdateForm={showInvoiceUpdateForm}
              setShowInvoiceUpdateForm={setShowInvoiceUpdateForm}
              currencies={currencies}
              handleEditDetailsChange={handleEditDetailsChange}
              handleEditAddRow={handleEditAddRow}
              handleEditRemoveRow={handleEditRemoveRow}
              fetchCustomers={fetchCustomers}
              setShowCustomerPopup={setShowCustomerPopup}
              handleSearch={handleSearch}
              setPopupCustomerMode={setPopupCustomerMode}
              openEditPopup={openEditPopup}
              setSelectedRowIndex={setSelectedRowIndex}
              setPopupMode={setPopupMode}
              setShowInventoryPopup={setShowInventoryPopup}
              handleUpdate={handleUpdate}
              isSaving={isSaving}
              setShowDiscountPopup={setShowDiscountPopup}
              setTotalBefore={setTotalBefore}
              setupdatediscounttype={setupdatediscounttype}
              setupdatediscountvalue={setupdatediscountvalue}
              generatedQuotationId={generatedQuotationId}
              todayDate={todayDate}
              popuploading={popuploading}
              setDiscountType={setDiscountType}
              setDiscountedTotal={setDiscountedTotal}
              setDiscountValue={setDiscountValue}
              DiscountMode={DiscountMode}
              setDiscountMode={setDiscountMode}
              tax={tax}


            />
          )}

          <HelpModal show={showHelp} title="Quotation- Help & Overview" screenName="Quotation" onClose={() => setShowHelp(false)} />

        </div>
      </div>
    </>
  );
};
export default Quotation;