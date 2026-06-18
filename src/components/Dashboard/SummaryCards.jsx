import React from "react";
import QuotationSummaryCards from "./QuotationSummaryCards";
import InvoiceSummaryCards from "./InvoiceSummaryCards";

const SummaryCards = ({ type, counts, onCardClick }) => {
  if (type === "Quotation") {
    return <QuotationSummaryCards counts={counts} onCardClick={onCardClick} />;
  }

  return <InvoiceSummaryCards counts={counts} onCardClick={onCardClick} />;
};

export default SummaryCards;
