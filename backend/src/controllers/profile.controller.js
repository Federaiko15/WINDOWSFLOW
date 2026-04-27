import fs from "fs";

const createProfile = (req, res) => {
  try {
    const { profile_name, theme } = req.body;

    if (!profile_name) {
      return res.status(400).json({
        message: "YOU HAVE TO SEND A PROFILE NAME",
      });
    }
    if (!theme) {
      return res.status(400).json({
        message: "YOU HAVE TO ENTER A THEME VALUE",
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
    const { theme, newDevice, removedDevices } = req.body;
    const profile_name = req.params.profile_name;

    if (!theme && !newDevice && !removedDevices) {
      return res.status(400).json({
        message: "NOTHING HAS BEEN UPDATED",
      });
    }

    if (!fs.existsSync("profile-json.json")) {
      return res.status(404).json({
        message: "PROFILES FILE NOT FOUND",
      });
    }

    // Rinominiamo la variabile in 'profiles' per non confonderci: contiene i dati attuali
    let profiles = JSON.parse(fs.readFileSync("profile-json.json", "utf8"));
    if (profiles.length == 0) {
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
        if (removedDevices) {
          const diff = profiles[i].devices.filter(
            (device) =>
              !removedDevices.find((rdevice) => rdevice.name === device.name),
          );
          profiles[i].devices = diff;
        }
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

    res.status(200).json({
      message: "OK, HERE ALL YOUR PROFILES",
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SERVER ERROR " + error.message,
    });
  }
};

export { createProfile, updateProfile, deleteProfile, getProfiles };
