import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchhelpinfowithscreen } from "../../redux/MasterSlice";
import "./HelpModal.css";

const HelpModal = ({ show, title, screenName, onClose }) => {
  const dispatch = useDispatch();
  const { helpinfo } = useSelector((state) => state.master);

  // 🔹 When the modal opens, call the API for that specific screen
  useEffect(() => {
    if (show && screenName) {
      dispatch(fetchhelpinfowithscreen(screenName));
    }
  }, [show, screenName, dispatch]);

  if (!show) return null;

  return (
    <div className="help-modal-overlay">
      <div className="help-modal">
        <button className="help-close-btn" onClick={onClose}>
          &times;
        </button>
        <h3 className="help-title">{title}</h3>

        <div className="help-content">
          {helpinfo ? (
            <p>{helpinfo}</p>
          ) : (
            <p>No help information available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
