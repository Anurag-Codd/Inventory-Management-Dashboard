import User from "../models/user.model.js";
import Widget from "../models/widget.model.js";

export const updateWidget = async (req, res) => {
  try {
    const { home, statics } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let widget;
    if (user.dashboard) {
      widget = await Widget.findByIdAndUpdate(
        user.dashboard,
        {
          ...(home && {
            "home.leftOrder": home.leftOrder,
            "home.rightOrder": home.rightOrder,
          }),
          ...(statics && {
            "statics.revenue": statics.revenue,
            "statics.sold": statics.sold,
            "statics.inStock": statics.inStock,
          }),
        },
        { new: true }
      );
    } else {
      widget = await Widget.create({
        home: {
          leftOrder: home?.leftOrder || ["overview", "chart"],
          rightOrder: home?.rightOrder || ["summary", "topProducts"],
        },
        statics,
      });

      user.dashboard = widget._id;
      await user.save();
    }

    res.json(widget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update widget positions" });
  }
};

export const getWidget = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("dashboard");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.dashboard || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch widget positions" });
  }
};
