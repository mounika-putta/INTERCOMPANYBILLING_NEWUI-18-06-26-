import React from 'react';
import {
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaTimes,
  FaDownload,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
  FaQuestionCircle,
  FaUserCircle,
  FaSignOutAlt,
  FaFilePdf,
  FaFileCsv,
  FaPrint,
} from 'react-icons/fa';

// Central icon registry — pages reference icons by name so we can swap the
// underlying icon set in one place instead of importing react-icons everywhere.
const registry = {
  eye: FaEye,
  'eye-off': FaEyeSlash,
  search: FaSearch,
  close: FaTimes,
  download: FaDownload,
  add: FaPlus,
  edit: FaEdit,
  delete: FaTrash,
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
  back: FaArrowLeft,
  forward: FaArrowRight,
  help: FaQuestionCircle,
  user: FaUserCircle,
  logout: FaSignOutAlt,
  pdf: FaFilePdf,
  csv: FaFileCsv,
  print: FaPrint,
};

/**
 * <Icon name="eye" size={18} color="#3D8C4F" />
 * Falls back gracefully if a name is not registered.
 */
const Icon = ({ name, size = 16, color = 'currentColor', style, ...rest }) => {
  const Cmp = registry[name];
  if (!Cmp) return null;
  return <Cmp size={size} color={color} style={style} {...rest} />;
};

export default Icon;
