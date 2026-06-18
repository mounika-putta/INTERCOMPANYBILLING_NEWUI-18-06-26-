import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ScreenMapping.css';
import { fetchRoles, fetchScreenlist, fetchRolewiseScreenlist, savemapping } from '../../redux/ScreenMappingSlice';
import alertify from 'alertifyjs';
import HelpModal from '../../components/Common/HelpModal';

const ScreenMapping = () => {
  const dispatch = useDispatch();
  const [showHelp, setShowHelp] = useState(false);
  const {
    roles,
    Screens: screens,
    rolewisescreens,
    loading,
    error
  } = useSelector((state) => state.screenmapping);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchScreenlist());
    dispatch(fetchRolewiseScreenlist());

  }, [dispatch]);

  useEffect(() => {
    if (rolewisescreens) {
      console.log('RolewiseScreens:', rolewisescreens);
    }
  }, [rolewisescreens]);

  const [mapping, setMapping] = useState({});

  useEffect(() => {
    // Initialize mapping when screens, roles, or rolewisescreens change
    if (screens.length > 0 && roles.length > 0) {
      const initialMapping = {};

      screens.forEach(screen => {
        initialMapping[screen.screenName] = {};
        roles.forEach(role => {
          // Check if role-screen exists in rolewisescreens
          const isChecked = rolewisescreens.some(
            (rws) =>
              rws.screenName === screen.screenName && rws.roleName === role.roleName
          );
          initialMapping[screen.screenName][role.roleName] = isChecked;
        });
      });

      setMapping(initialMapping);
    }
  }, [screens, roles, rolewisescreens]);

  const [saving, setSaving] = useState(false);

  const handleSaveMapping = async () => {
    setSaving(true);

    try {
      let anyMappingSaved = false;

      for (const role of roles) {
        const selectedScreensForRole = [];

        for (const screen of screens) {
          if (mapping[screen.screenName]?.[role.roleName]) {
            selectedScreensForRole.push(screen.id);
          }
        }

        if (selectedScreensForRole.length === 0) continue;

        const payload = {
          roleId: role.id,
          screenIds: selectedScreensForRole,
        };

        const response = await dispatch(savemapping(payload)).unwrap();
        anyMappingSaved = true;
      }

      if (anyMappingSaved) {
        alertify.alert('Success', "Screens are mapped successfully.");
      } else {
        alertify.alert('Warning', "No changes to save.");
      }

    } catch (err) {
      console.error("Error saving mapping:", err);
      alertify.alert(err?.message || 'Failed to save mapping.');
    } finally {
      setSaving(false);
    }
  };


  const handleCheckboxChange = (screen, role) => {
    setMapping(prev => ({
      ...prev,
      [screen]: {
        ...prev[screen],
        [role]: !prev[screen][role],
      },
    }));
  };

  function formatDisplayName(path) {
    if (!path) return '';

    // Remove leading slash
    let name = path.startsWith('/') ? path.slice(1) : path;

    // Insert spaces before uppercase letters (except the first char)
    name = name.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Capitalize first letter of each word
    name = name.replace(/\b\w/g, char => char.toUpperCase());

    return name;
  }


  return (
    <>
      <div className="screenmappingtable-controls">
       
        <div className="list-header">
          <h2 className='screenmappingheading'>User Management</h2>
          <button className="help-btn" onClick={() => setShowHelp(true)}>
            <i className="fas fa-question-circle"></i> Help
          </button>
        </div>

        <div className="table-wrapper">
          <table className="screenmappingtable">
            <thead>
              <tr>
                <th style={{ color: "black" }}>
                  SCREEN NAMES 
                </th>
                {roles.map(role => (
                  <th key={role.id}>{role.roleName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screens.map(screen => (
                <tr key={screen.id}>

                  <td>{screen.display}</td>
                  <td hidden>{screen.screenName}</td>
                  {roles.map(role => (
                    <td key={role.id}>
                      <input
                        type="checkbox"
                        checked={mapping[screen.screenName]?.[role.roleName] || false}
                        onChange={() => handleCheckboxChange(screen.screenName, role.roleName)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="save-button" onClick={handleSaveMapping} disabled={saving}>
            {saving && <span className="spinner" />} Save Mapping
          </button>
        </div>
      </div>
      <HelpModal show={showHelp} title="User Management - Help & Overview" screenName="UserManagement" onClose={() => setShowHelp(false)} />


    </>
  );



};

export default ScreenMapping;
