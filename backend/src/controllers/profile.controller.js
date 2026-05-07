import fs from "fs";

const createProfile = (req, res) => {
  try {
    const { profile_name, theme, active } = req.body;

    if (!profile_name) {
      console.log("CREATE PROFILE API: NO PROFILE NAME");
      return res.status(400).json({
        message: "YOU HAVE TO SEND A PROFILE NAME",
      });
    }
    if (!theme) {
      console.log("CREATE PROFILE API: NO THEME");
      return res.status(400).json({
        message: "YOU HAVE TO SEND A THEME",
      });
    }

    if (!(active == false || active == true)) {
      console.log("CREATE PROFILE API: NO ACTIVE");
      return res.status(400).json({
        message: "YOU HAVE TO SEND THE ACTIVE PROPERTY",
      });
    }

    let profiles = [];
    if (fs.existsSync("profile-json.json")) {
      const fileData = fs.readFileSync("profile-json.json", "utf8");
      if (fileData) profiles = JSON.parse(fileData);
    }

    const newProfile = {
      profile_name,
      theme,
      active,
      devices: [],
    }; // create a new class with the informations passed by the user

    profiles.push(newProfile);
    fs.writeFileSync("profile-json.json", JSON.stringify(profiles, null, 2));

    console.log("È stato creato un nuovo profilo:", newProfile);

    res.status(200).json({
      message: "OK",
      data: newProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR " + error.message,
    });
  }
};

const updateProfile = (req, res) => {
  try {
    const { theme, newDevice, removedDevice, active, newLayoutInfo } = req.body;
    const profile_name = req.params.profile_name;

    if (
      !theme &&
      !newDevice &&
      !removedDevice &&
      !(active == false || active == true) &&
      !newLayoutInfo
    ) {
      console.log("UPDATE PROFILE API: NOTHING HAS BEEN UPDATED");
      return res.status(400).json({
        message: "NOTHING HAS BEEN UPDATED",
      });
    }

    if (!fs.existsSync("profile-json.json")) {
      console.log("UPDATE PROFILE API: PROFILES FILE NOT FOUND");
      return res.status(404).json({
        message: "PROFILES FILE NOT FOUND",
      });
    }

    let profiles = JSON.parse(fs.readFileSync("profile-json.json", "utf8"));
    if (profiles.length == 0) {
      console.log("UPDATE PROFILE API: NO PROFILES");
      return res.status(404).json({
        message: "PROFILES MISSED",
      });
    }
    let profile_exist = false;
    for (let i = 0; i < profiles.length; i++) {
      // and check all of them by the profile_name
      if (profiles[i].profile_name == profile_name) {
        profile_exist = true;
        if (theme) {
          profiles[i].theme = theme;
        }
        if (newDevice) {
          profiles[i].devices.push(newDevice);
        }
        if (removedDevice) {
          profiles[i].devices = profiles[i].devices.filter(
            (device) => device.name != removedDevice.name,
          );
        }
        if (active == true || active == false) {
          if (active === true) {
            // Spegniamo lo stato "active" su tutti gli altri profili
            profiles.forEach((p) => (p.active = false));
          }
          profiles[i].active = active;
        }
        if (newLayoutInfo) {
          profiles[i].devices.map((device) => {
            if (
              device.idVendor == newLayoutInfo.idVendor &&
              device.idProduct == newLayoutInfo.idProduct
            ) {
              device.layout = newLayoutInfo.layout;
            }
          });
        }
        break;
      }
    }
    if (!profile_exist) {
      console.log("UPDATE PROFILE API: PROFILE NOT FOUND");
      return res.status(404).json({
        message: "PROFILE NOT FOUND",
      });
    }
    fs.writeFileSync("profile-json.json", JSON.stringify(profiles, null, 2));
    res.status(200).json({
      message: "OK",
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR " + error.message,
    });
  }
};

const deleteProfile = (req, res) => {
  try {
    const profile_name = req.params.profile_name;

    if (!profile_name) {
      return res.status(400).json({
        message: "YOU HAVE TO SEND A PROFILE NAME",
      });
    }

    if (!fs.existsSync("profile-json.json")) {
      return res.status(404).json({
        message: "PROFILES FILE NOT FOUND",
      });
    }

    const profiles = JSON.parse(fs.readFileSync("profile-json.json", "utf8"));
    if (profiles.length == 0) {
      return res.status(404).json({
        message: "PROFILES MISSED",
      });
    }
    let profile_exist = false;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].profile_name == profile_name) {
        profile_exist = true;
        profiles.splice(i, 1);
        break;
      }
    }
    if (!profile_exist) {
      return res.status(404).json({
        message: "PROFILE NOT FOUND",
      });
    }
    fs.writeFileSync("profile-json.json", JSON.stringify(profiles, null, 2));
    res.status(200).json({
      message: "PROFILE DELETED SUCCESSFULLY",
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR " + error.message,
    });
  }
};

const getProfiles = (req, res) => {
  try {
    if (!fs.existsSync("profile-json.json")) {
      return res.status(404).json({
        message: "PROFILES FILE NOT FOUND",
      });
    }
    const profiles = JSON.parse(fs.readFileSync("profile-json.json", "utf8"));

    // Recuperiamo il watcher da Express
    const usbWatcher = req.app.get("usbWatcher");
    const liveDevices = usbWatcher ? usbWatcher.devices : [];

    // Arricchiamo i device con lo stato di connessione in tempo reale
    const enrichedProfiles = profiles.map((profile) => {
      if (profile.devices && Array.isArray(profile.devices)) {
        profile.devices = profile.devices.map((device) => {
          const isConnected = liveDevices.some(
            (liveD) =>
              liveD.idVendor === device.idVendor &&
              liveD.idProduct === device.idProduct,
          );
          return { ...device, isConnected };
        });
      }
      return profile;
    });

    res.status(200).json({
      message: "OK, HERE ALL YOUR PROFILES",
      data: enrichedProfiles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR " + error.message,
    });
  }
};

export { createProfile, updateProfile, deleteProfile, getProfiles };
