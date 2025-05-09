import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthHeaders } from "../../store/auth-context";
import useProfile from "../../hooks/useProfile";
import classes from "../../components/PageComponent.module.css";

export default function Profile({ activeMenu }) {
  const headers = useAuthHeaders();
  const [reload, setReload] = useState(false);
  const { profile, loadingProfile } = useProfile(null, headers, reload);
  const [profileData, setProfileData] = useState({
    salutation: "",
    first_name: "",
    last_name: "",
    email_address: "",
    gender: "",
    date_of_birth: "",
    home_address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    marital_status: "",
    avatar: "",
    spouse: {
      salutation: "",
      first_name: "",
      last_name: "",
    },
    personal_preferences: {
      hobbies: [],
      interests: [],
      sports: [],
      musics: [],
      movies: [],
    },
  });
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const capitalizeString = (str) => {
    if (typeof str !== "string" || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (profile) {
      setProfileData({
        ...profile,
        home_address: {
          street: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          ...(profile.home_address || {}),
        },
        spouse: {
          salutation: "",
          first_name: "",
          last_name: "",
          ...(profile.spouse || {}),
        },
        personal_preferences: {
          hobbies: [],
          interests: [],
          sports: [],
          musics: [],
          movies: [],
          ...(profile.personal_preferences || {}),
        },
      });
      setOriginalProfileData(profile);
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    if (field.startsWith("home_address")) {
      const nestedField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        home_address: {
          ...prev.home_address,
          [nestedField]: value,
        },
      }));
    } else if (field.startsWith("spouse")) {
      const nestedField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        spouse: {
          ...prev.spouse,
          [nestedField]: value,
        },
      }));
    } else if (field.startsWith("personal_preferences")) {
      const nestedField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        personal_preferences: {
          ...prev.personal_preferences,
          [nestedField]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleAddItem = (field) => {
    setProfileData((prev) => ({
      ...prev,
      personal_preferences: {
        ...prev.personal_preferences,
        [field]: [...prev.personal_preferences[field], ""],
      },
    }));
  };

  const handleRemoveItem = (field, index) => {
    const updatedItems = [...profileData.personal_preferences[field]];
    updatedItems.splice(index, 1);
    setProfileData((prev) => ({
      ...prev,
      personal_preferences: {
        ...prev.personal_preferences,
        [field]: updatedItems,
      },
    }));
  };

  const handleItemChange = (field, index, value) => {
    const updatedItems = [...profileData.personal_preferences[field]];
    updatedItems[index] = value;
    setProfileData((prev) => ({
      ...prev,
      personal_preferences: {
        ...prev.personal_preferences,
        [field]: updatedItems,
      },
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
            value={profileData?.first_name || ""}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
          />
          {errors.first_name && (
            <p className={classes.error}>{errors.first_name}</p>
          )}
        </>
      ) : (
        <span>{capitalizeString(profileData?.first_name)}</span>
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

      <h4>Home Address</h4>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          <input
            className={errors.street && classes.error}
            placeholder="Street"
            value={profileData.home_address?.street || ""}
            onChange={(e) =>
              handleInputChange("home_address.street", e.target.value)
            }
          />
          {errors.street && <p className={classes.error}>{errors.street}</p>}

          <input
            className={errors.city && classes.error}
            placeholder="City"
            value={profileData.home_address?.city || ""}
            onChange={(e) =>
              handleInputChange("home_address.city", e.target.value)
            }
          />
          {errors.city && <p className={classes.error}>{errors.city}</p>}

          <input
            className={errors.state && classes.error}
            placeholder="State"
            value={profileData.home_address?.state || ""}
            onChange={(e) =>
              handleInputChange("home_address.state", e.target.value)
            }
          />
          {errors.state && <p className={classes.error}>{errors.state}</p>}

          <input
            className={errors.postal_code && classes.error}
            placeholder="Postal Code"
            value={profileData.home_address?.postal_code || ""}
            onChange={(e) =>
              handleInputChange("home_address.postal_code", e.target.value)
            }
          />
          {errors.postal_code && (
            <p className={classes.error}>{errors.postal_code}</p>
          )}

          <input
            className={errors.country && classes.error}
            placeholder="Country"
            value={profileData.home_address?.country || ""}
            onChange={(e) =>
              handleInputChange("home_address.country", e.target.value)
            }
          />
          {errors.country && <p className={classes.error}>{errors.country}</p>}
        </>
      ) : (
        <span>
          {profileData.home_address
            ? `${profileData.home_address.street}, ${profileData.home_address.city}, ${profileData.home_address.state}, ${profileData.home_address.postal_code}, ${profileData.home_address.country}`
            : "Not specified"}
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
            onChange={(e) =>
              handleInputChange("marital_status", e.target.value)
            }
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

      {/* Spouse Details Section */}
      <h4>Spouse Details</h4>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          <select
            className={errors.spouse_salutation && classes.error}
            value={profileData.spouse.salutation || ""}
            onChange={(e) =>
              handleInputChange("spouse.salutation", e.target.value)
            }
          >
            <option value="">Select Salutation</option>
            <option value="mr">Mr.</option>
            <option value="ms">Ms.</option>
            <option value="mrs">Mrs.</option>
          </select>
          {errors.spouse_salutation && (
            <p className={classes.error}>{errors.spouse_salutation}</p>
          )}

          <input
            className={errors.spouse_first_name && classes.error}
            placeholder="Spouse First Name"
            value={profileData.spouse.first_name || ""}
            onChange={(e) =>
              handleInputChange("spouse?.first_name", e.target.value)
            }
          />
          {errors.spouse_first_name && (
            <p className={classes.error}>{errors.spouse_first_name}</p>
          )}

          <input
            className={errors.spouse_last_name && classes.error}
            placeholder="Spouse Last Name"
            value={profileData.spouse.last_name || ""}
            onChange={(e) =>
              handleInputChange("spouse.last_name", e.target.value)
            }
          />
          {errors.spouse_last_name && (
            <p className={classes.error}>{errors.spouse_last_name}</p>
          )}
        </>
      ) : (
        <span>
          {profileData?.spouse?.first_name
            ? `${
                capitalizeString(profileData.spouse.salutation) + "." || ""
              } ${capitalizeString(profileData.spouse?.first_name)} ${
                capitalizeString(profileData.spouse?.last_name) || ""
              }`
            : "Not specified"}
        </span>
      )}
    </>
  );

  const renderPersonalPreferences = () => (
    <>
      <h4>Personal Preferences</h4>

      <h5>Hobbies</h5>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          {profileData.personal_preferences?.hobbies?.map((hobby, index) => (
            <div key={index} className={classes.preferenceItems}>
              <input
                className={errors.hobbies && classes.error}
                value={hobby}
                onChange={(e) =>
                  handleItemChange("hobbies", index, e.target.value)
                }
              />
              <button
                onClick={() => handleRemoveItem("hobbies", index)}
                className={classes.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem("hobbies")}
            className={classes.addButton}
          >
            Add Hobby
          </button>
          {errors.hobbies && <p className={classes.error}>{errors.hobbies}</p>}
        </>
      ) : (
        <span>
          {profileData?.personal_preferences?.hobbies.length
            ? profileData.personal_preferences.hobbies.join(", ")
            : "Not specified"}
        </span>
      )}

      <h5>Interests</h5>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          {profileData.personal_preferences?.interests?.map((interest, index) => (
            <div key={index} className={classes.preferenceItems}>
              <input
                className={errors.interests && classes.error}
                value={interest}
                onChange={(e) =>
                  handleItemChange("interests", index, e.target.value)
                }
              />
              <button
                onClick={() => handleRemoveItem("interests", index)}
                className={classes.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem("interests")}
            className={classes.addButton}
          >
            Add Interest
          </button>
          {errors.interests && (
            <p className={classes.error}>{errors.interests}</p>
          )}
        </>
      ) : (
        <span>
          {profileData.personal_preferences?.interests?.length
            ? profileData.personal_preferences.interests.join(", ")
            : "Not specified"}
        </span>
      )}

      <h5>Sports</h5>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          {profileData.personal_preferences?.sports?.map((sport, index) => (
            <div key={index} className={classes.preferenceItems}>
              <input
                className={errors.sports && classes.error}
                value={sport}
                onChange={(e) =>
                  handleItemChange("sports", index, e.target.value)
                }
              />
              <button
                onClick={() => handleRemoveItem("sports", index)}
                className={classes.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem("sports")}
            className={classes.addButton}
          >
            Add Sport
          </button>
          {errors.sports && <p className={classes.error}>{errors.sports}</p>}
        </>
      ) : (
        <span>
          {profileData.personal_preferences?.sports?.length
            ? profileData.personal_preferences.sports.join(", ")
            : "Not specified"}
        </span>
      )}

      {/* Musics */}
      <h5>Musics</h5>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          {profileData.personal_preferences?.musics?.map((music, index) => (
            <div key={index} className={classes.preferenceItems}>
              <input
                className={errors.musics && classes.error}
                value={music}
                onChange={(e) =>
                  handleItemChange("musics", index, e.target.value)
                }
              />
              <button
                onClick={() => handleRemoveItem("musics", index)}
                className={classes.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem("musics")}
            className={classes.addButton}
          >
            Add Music
          </button>
          {errors.musics && <p className={classes.error}>{errors.musics}</p>}
        </>
      ) : (
        <span>
          {profileData.personal_preferences?.musics?.length
            ? profileData.personal_preferences.musics.join(", ")
            : "Not specified"}
        </span>
      )}

      <h5>Movies</h5>
      {loadingProfile ? (
        "..."
      ) : isEditing ? (
        <>
          {profileData.personal_preferences?.movies?.map((movie, index) => (
            <div key={index} className={classes.preferenceItems}>
              <input
                className={errors.movies && classes.error}
                value={movie}
                onChange={(e) =>
                  handleItemChange("movies", index, e.target.value)
                }
              />
              <button
                onClick={() => handleRemoveItem("movies", index)}
                className={classes.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem("movies")}
            className={classes.addButton}
          >
            Add Movie
          </button>
          {errors.movies && <p className={classes.error}>{errors.movies}</p>}
        </>
      ) : (
        <span>
          {profileData.personal_preferences?.movies?.length
            ? profileData.personal_preferences.movies.join(", ")
            : "Not specified"}
        </span>
      )}
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
        return renderPersonalPreferences();
      default:
        return <span>Unknown section</span>;
    }
  };

  const handleSave = async () => {
    const newErrors = {};

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

    if (activeMenu === "spouse") {
      if (!profileData.spouse?.salutation) {
        newErrors.spouse_salutation = "Please select spouse's salutation";
      }
      if (!profileData.spouse?.first_name) {
        newErrors.spouse_first_name = "Please enter spouse's first name";
      }
      if (!profileData.spouse?.last_name) {
        newErrors.spouse_last_name = "Please enter spouse's last name";
      }
    }

    if (activeMenu === "preferences") {
      if (profileData?.personal_preferences.hobbies?.length === 0) {
        newErrors.hobbies = "Please add at least one hobby";
      }
      if (profileData?.personal_preferences.interests?.length === 0) {
        newErrors.interests = "Please add at least one interest";
      }
      if (profileData?.personal_preferences.sports?.length === 0) {
        newErrors.sports = "Please add at least one sport";
      }
      if (profileData?.personal_preferences.musics?.length === 0) {
        newErrors.musics = "Please add at least one music";
      }
      if (profileData?.personal_preferences.movies?.length === 0) {
        newErrors.movies = "Please add at least one movie";
      }
    }

    // If there are errors, display them and don't proceed with saving
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Send only the changed data to the server
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
              <p className={classes.editNote}>* Mandatory field</p>
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
