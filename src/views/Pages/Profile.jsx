import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthHeaders } from "../../store/auth-context";
import useProfile from "../../hooks/useProfile";

import classes from "../../components/PageComponent.module.css";

export default function Profile({ activeMenu }) {
  const headers = useAuthHeaders();
  const [reload, setReload] = useState(false);
  const { profile, loadingProfile } = useProfile(null, headers, reload);
  const [profileData, setProfileData] = useState({});
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const capitalizeString = (str) => {
    if (typeof str !== "string" || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
      setOriginalProfileData(profile);
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditMode = () => {
    setErrors({});
    setIsEditing((prev) => !prev);
    setReload((prev) => !prev);
  };

  const renderBasicDetails = () => (
    <>
      <h4>Salutation*</h4>
      {loadingProfile ? (
        <>...</>
      ) : isEditing ? (
        <>
          <select
            className={errors.salutation && classes.error}
            value={profileData.salutation || ""}
            onChange={(e) => handleInputChange("salutation", e.target.value)}
          >
            <option value="">Select Salutation</option>
            <option value="mr">Mr.</option>
            <option value="ms">Ms.</option>
            <option value="mrs">Mrs.</option>
            <option value="dr">Dr.</option>
            <option value="prof">Prof.</option>
            <option value="eng">Engineer</option>
          </select>
          {errors.salutation && (
            <p className={classes.error}>{errors.salutation}</p>
          )}
        </>
      ) : (
        <span>{capitalizeString(profileData.salutation) + "."}</span>
      )}

      <h4>First name*</h4>
      {loadingProfile ? (
        <>...</>
      ) : isEditing ? (
        <>
          <input
            className={errors.first_name && classes.error}
            value={profileData.first_name || ""}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
          />
          {errors.first_name && (
            <p className={classes.error}>{errors.first_name}</p>
          )}
        </>
      ) : (
        <span>{capitalizeString(profileData.first_name)}</span>
      )}

      <h4>Last name*</h4>
      {loadingProfile ? (
        <>...</>
      ) : isEditing ? (
        <>
          <input
            className={errors.last_name && classes.error}
            value={profileData.last_name || ""}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
          />
          {errors.last_name && (
            <p className={classes.error}>{errors.last_name}</p>
          )}
        </>
      ) : (
        <span>{capitalizeString(profileData.last_name)}</span>
      )}

      <h4>Email address*</h4>
      {loadingProfile ? (
        <>...</>
      ) : isEditing ? (
        <>
          <input
            className={errors.email_address && classes.error}
            type="email"
            value={profileData.email_address || ""}
            onChange={(e) => handleInputChange("email_address", e.target.value)}
          />
          {errors.email_address && (
            <p className={classes.error}>{errors.email_address}</p>
          )}
        </>
      ) : (
        <span>{profileData.email_address}</span>
      )}
    </>
  );

  const renderAdditionalDetails = () => (
    <>
      <h4>Gender</h4>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          <select
            className={errors.gender && classes.error}
            value={profileData.gender || ""}
            onChange={(e) => handleInputChange("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className={classes.error}>{errors.gender}</p>}
        </>
      ) : (
        <span>{capitalizeString(profileData.gender) || "Not specified"}</span>
      )}

      <h4>Date of Birth</h4>
      {loadingProfile ? (
        <>...</>
      ) : isEditing ? (
        <>
          <input
            type="date"
            className={errors.date_of_birth && classes.error}
            value={profileData.date_of_birth || ""}
            onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
          />
          {errors.date_of_birth && (
            <p className={classes.error}>{errors.date_of_birth}</p>
          )}
        </>
      ) : (
        <span>
          {new Date(profileData.date_of_birth).toLocaleDateString() || "-"}
        </span>
      )}
    </>
  );

  const renderSpouseDetails = () => (
    <>
      <h4>Marital Status</h4>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          <select
            className={errors.marital_status && classes.error}
            value={profileData.marital_status || ""}
            onChange={(e) => handleInputChange("marital_status", e.target.value)}
          >
            <option value="">Select Marital Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          {errors.marital_status && (
            <p className={classes.error}>{errors.marital_status}</p>
          )}
        </>
      ) : (
        <span>{capitalizeString(profileData.marital_status) || "N/A"}</span>
      )}
    </>
  );

  const renderPreferences = () => (
    <>
      <h4>Preferred Contact Method</h4>
      {loadingProfile ? "..." : <span>-</span>}
    </>
  );

  const renderSection = () => {
    switch (activeMenu) {
      case "basic":
        return renderBasicDetails();
      case "additional":
        return renderAdditionalDetails();
      case "spouse":
        return renderSpouseDetails();
      case "preferences":
        return renderPreferences();
      default:
        return <span>Unknown section</span>;
    }
  };

  const handleSave = async () => {
    const newErrors = {};
  
    // Check validation based on activeMenu
    if (activeMenu === "basic") {
      if (!profileData.salutation) {
        newErrors.salutation = "Please select your salutation";
      }
  
      if (!profileData.first_name) {
        newErrors.first_name = "Please enter your first name";
      }
  
      if (!profileData.last_name) {
        newErrors.last_name = "Please enter your last name";
      }
  
      if (!profileData.email_address) {
        newErrors.email_address = "Please enter your email address";
      }
    }
  
    if (activeMenu === "additional") {
      if (!profileData.gender) {
        newErrors.gender = "Please select your gender";
      }
  
      if (!profileData.date_of_birth) {
        newErrors.date_of_birth = "Please enter your date of birth";
      }
    }
  
    if (activeMenu === "spouse") {
      if (!profileData.marital_status) {
        newErrors.marital_status = "Please select your marital status";
      }
    }
  
    // If there are errors, show them and stop the save
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      // Only update the fields that were edited for the current section
      await axios.put(
        `${process.env.REACT_APP_API_USER_PROFILE}`,
        profileData,
        { headers }
      );
      setIsEditing(false);
      setOriginalProfileData(profileData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setErrors({});
    setProfileData(originalProfileData);
    setIsEditing(false);
    setReload((prev) => !prev);
  };

  return (
    <div className={classes.profile}>
      <div className={classes.profileHeading}>
        <h1>
          My <span className={classes.highlight}>Profile</span>
        </h1>
        <div className={classes.line}></div>
        <button onClick={toggleEditMode}>
          {isEditing ? (
            <>
              <i className="material-icons">chevron_left</i>
              <span className={classes.text}>Go back to My Profile</span>
            </>
          ) : (
            <>
              <span className={classes.text}>Edit Profile</span>
              <i className="material-icons">edit</i>
            </>
          )}
        </button>
      </div>

      <div className={classes.profileDetails}>
        <div className={classes.avatar}>
          <img
            src={
              profileData?.avatar ||
              "https://ui-avatars.com/api/?name=NA&size=200&background=333333&color=ffffff"
            }
            alt={profileData?.display_name}
          />
        </div>
        <div
          className={`${classes.details} ${isEditing ? classes.isEditing : ""}`}
        >
          {renderSection()}
          {isEditing && (
            <>
               <p className={classes.editNote}>
                  * Mandatory field
                </p>
                <div className={classes.buttons}>
                  <button onClick={handleSave} className={classes.saveButton}>
                    Save & Update
                  </button>
                  <button onClick={handleCancel} className={classes.cancelButton}>
                    Cancel
                  </button>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
